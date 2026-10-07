<#
=====================================================================
  Claude Skill / Plugin Weekly Update Checker
=====================================================================
  PRINCIPLE: REVIEW-BEFORE-APPLY. This script ONLY CHECKS and REPORTS.
  It NEVER updates, pulls, or installs anything automatically.

  - The "check" is fully DETERMINISTIC (git + pip only) => 0 LLM tokens.
  - It writes a human-readable report to ~/.claude/skill-update-report.md
  - You (the human) read the report and update each item yourself,
    one at a time, using the suggested command.

  Baseline rule:
  - Personal skills are tracked by 'last_seen_commit' in sources.json.
  - The normal run NEVER changes the baseline (so you can't miss an update).
  - Run with  -Ack  ONLY AFTER you have actually applied an update, to
    record the current upstream HEAD as the new baseline.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File check.ps1
    powershell -NoProfile -ExecutionPolicy Bypass -File check.ps1 -Ack
=====================================================================
#>
[CmdletBinding()]
param(
    [switch]$Ack
)

$ErrorActionPreference = 'Continue'

# --- Paths -----------------------------------------------------------
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ClaudeRoot  = Split-Path -Parent (Split-Path -Parent $ScriptDir)   # ...\.claude
$SourcesPath = Join-Path $ScriptDir 'sources.json'
$PluginCache = Join-Path $ClaudeRoot 'plugins\cache'
$ReportPath  = Join-Path $ClaudeRoot 'skill-update-report.md'

# --- Helpers ---------------------------------------------------------
function Clean-Cell([string]$s) {
    if ($null -eq $s) { return '' }
    $s = $s -replace "`r?`n", '<br>'
    $s = $s -replace '\|', '/'
    return $s.Trim()
}

function Invoke-Git {
    param([string[]]$GitArgs)
    # Returns object: @{ Ok=$bool; Out=$string }
    try {
        $out = & git @GitArgs 2>&1 | Out-String
        return @{ Ok = ($LASTEXITCODE -eq 0); Out = $out.Trim() }
    } catch {
        return @{ Ok = $false; Out = "$($_.Exception.Message)" }
    }
}

# --- Load manifest ---------------------------------------------------
if (-not (Test-Path $SourcesPath)) {
    Write-Error "Manifest not found: $SourcesPath"
    exit 1
}
$manifest = Get-Content -Raw -Path $SourcesPath -Encoding UTF8 | ConvertFrom-Json

$now    = Get-Date
$stamp  = $now.ToString('yyyy-MM-dd HH:mm:ss')
$rows   = New-Object System.Collections.Generic.List[string]
$notes  = New-Object System.Collections.Generic.List[string]

# =====================================================================
# SECTION A: git-backed plugin caches (auto-discovered)
# =====================================================================
if (Test-Path $PluginCache) {
    $gitDirs = Get-ChildItem -Path $PluginCache -Recurse -Force -Directory -Filter '.git' -Depth 4 -ErrorAction SilentlyContinue
    foreach ($g in $gitDirs) {
        $repo = $g.Parent.FullName
        # name = <marketplace>/<plugin> derived from path under cache
        $rel  = $repo.Substring($PluginCache.Length).TrimStart('\')
        $parts = $rel -split '\\'
        $name = if ($parts.Count -ge 2) { "$($parts[0])/$($parts[1])" } else { $rel }

        $cur = (Invoke-Git @('-C', $repo, 'rev-parse', '--short', 'HEAD')).Out
        $fetch = Invoke-Git @('-C', $repo, 'fetch', '-q')
        if (-not $fetch.Ok) {
            $rows.Add("| $name | plugin (git) | $cur | cannot check (offline/error) | $(Clean-Cell $fetch.Out) | - |")
            continue
        }
        $countRes = Invoke-Git @('-C', $repo, 'rev-list', '--count', 'HEAD..@{u}')
        if (-not $countRes.Ok) {
            $rows.Add("| $name | plugin (git) | $cur | cannot check (no upstream?) | $(Clean-Cell $countRes.Out) | - |")
            continue
        }
        $count = ($countRes.Out).Trim()
        if ($count -eq '0') {
            $rows.Add("| $name | plugin (git) | $cur | none (up to date) | - | - |")
        } else {
            $log = (Invoke-Git @('-C', $repo, 'log', '--oneline', '-5', 'HEAD..@{u}')).Out
            $cmd = "claude plugin update  or  git -C `"$repo`" pull"
            $rows.Add("| $name | plugin (git) | $cur | yes - $count commit(s) | $(Clean-Cell $log) | $(Clean-Cell $cmd) |")
        }
    }
} else {
    $notes.Add("Plugin cache folder not found at $PluginCache")
}

# =====================================================================
# SECTION B: pip packages (graphify engine, markitdown, ...)
# =====================================================================
$pipInstalled = @{}
$pipOutdated  = @{}
try {
    $instJson = & pip list --format=json 2>$null | Out-String
    if ($instJson.Trim()) {
        foreach ($p in ($instJson | ConvertFrom-Json)) { $pipInstalled[$p.name.ToLower()] = $p.version }
    }
    $outJson = & pip list --outdated --format=json 2>$null | Out-String
    if ($outJson.Trim()) {
        foreach ($p in ($outJson | ConvertFrom-Json)) { $pipOutdated[$p.name.ToLower()] = $p }
    }
    $pipOk = $true
} catch {
    $pipOk = $false
    $notes.Add("pip call failed: $($_.Exception.Message)")
}

foreach ($pkg in $manifest.pip_packages) {
    $dist = $pkg.dist_name
    $key  = $dist.ToLower()
    $skillName = $pkg.skill
    if (-not $pipOk) {
        $rows.Add("| $skillName | pip: $dist | ? | cannot check (pip unavailable) | - | - |")
        continue
    }
    if (-not $pipInstalled.ContainsKey($key)) {
        $rows.Add("| $skillName | pip: $dist | not installed | - | - | pip install $dist |")
        continue
    }
    $curV = $pipInstalled[$key]
    if ($pipOutdated.ContainsKey($key)) {
        $latest = $pipOutdated[$key].latest_version
        $rows.Add("| $skillName | pip: $dist | $curV | yes - $latest available | update $curV → $latest | pip install -U $dist |")
    } else {
        $rows.Add("| $skillName | pip: $dist | $curV | none (up to date) | - | - |")
    }
}

# =====================================================================
# SECTION C: personal skills (git ls-remote, no clone)
# =====================================================================
$ackUpdated = $false
foreach ($sk in $manifest.personal_skills) {
    $name = $sk.name
    $url  = $sk.source_repo_url
    $seen = $sk.last_seen_commit

    if ($url -eq 'self-authored') {
        $rows.Add("| $name | self-authored | - | skipped (no upstream) | - | - |")
        continue
    }
    if ([string]::IsNullOrWhiteSpace($url) -or $url -eq 'unknown') {
        $rows.Add("| $name | unknown (fill in URL in sources.json) | - | cannot check yet | $(Clean-Cell $sk.note) | - |")
        continue
    }

    $lsr = Invoke-Git @('ls-remote', $url, 'HEAD')
    if (-not $lsr.Ok -or [string]::IsNullOrWhiteSpace($lsr.Out)) {
        $rows.Add("| $name | $url | $(if($seen){$seen.Substring(0,[Math]::Min(7,$seen.Length))}else{'(no baseline)'}) | cannot check (offline/wrong repo) | $(Clean-Cell $lsr.Out) | - |")
        continue
    }
    $remoteHead = ($lsr.Out -split '\s+')[0]
    $remoteShort = $remoteHead.Substring(0, [Math]::Min(7, $remoteHead.Length))

    if ($Ack) {
        $sk.last_seen_commit = $remoteHead
        $ackUpdated = $true
        $rows.Add("| $name | $url | $remoteShort | -Ack: baseline recorded | subpath: $(Clean-Cell $sk.subpath_in_repo) | - |")
        continue
    }

    $cmd = "git pull in the source repo, then copy the subpath over ~/.claude/skills/$name (subpath: $($sk.subpath_in_repo)); then run check.ps1 -Ack"
    if ([string]::IsNullOrWhiteSpace($seen)) {
        $rows.Add("| $name | $url | remote=$remoteShort | no baseline set (run -Ack to record) | $(Clean-Cell $sk.note) | $(Clean-Cell $cmd) |")
    } elseif ($seen -ne $remoteHead) {
        $seenShort = $seen.Substring(0, [Math]::Min(7, $seen.Length))
        $rows.Add("| $name | $url | baseline=$seenShort | yes - remote=$remoteShort (repo changed*) | $(Clean-Cell $sk.note) | $(Clean-Cell $cmd) |")
    } else {
        $rows.Add("| $name | $url | $remoteShort | none (matches baseline) | - | - |")
    }
}

# --- Persist baseline on -Ack ---------------------------------------
if ($Ack -and $ackUpdated) {
    $manifest | ConvertTo-Json -Depth 8 | Set-Content -Path $SourcesPath -Encoding UTF8
    $notes.Add("New baseline written to sources.json (-Ack mode)")
}

# =====================================================================
# WRITE REPORT
# =====================================================================
$out = New-Object System.Collections.Generic.List[string]
$out.Add("# Skill/plugin update check report (Claude)")
$out.Add("")
$out.Add("**Last checked:** $stamp")
$mode = if ($Ack) { 'record baseline (-Ack)' } else { 'check only (read-only)' }
$out.Add("**Mode:** $mode")
$out.Add("")
$out.Add("> This check is fully deterministic (git/pip), no LLM calls = no tokens spent.")
$out.Add("> **REVIEW-BEFORE-APPLY:** this script only reports and never updates automatically. Read it, then update each item yourself.")
$out.Add("")
$out.Add("| Skill | Source | Current version/commit | New upstream? | Latest commit summary | Suggested update command |")
$out.Add("|------|-------|--------------------------|------------------|--------------------|----------------------|")
foreach ($r in $rows) { $out.Add($r) }
$out.Add("")
$out.Add("\* Note: personal skills are checked with ``git ls-remote HEAD`` of the whole repo, not just the subpath. If the upstream repo has commits elsewhere it will show 'repo changed' even when the skill's subpath is unchanged (deliberate over-reporting, safe because you review first).")
if ($notes.Count -gt 0) {
    $out.Add("")
    $out.Add("## System notes")
    foreach ($n in $notes) { $out.Add("- $n") }
}
$out.Add("")
$out.Add("## How to update (manually, one at a time)")
$out.Add("- **plugin (git):** ``claude plugin update`` or ``git -C <cache path> pull``")
$out.Add("- **pip:** ``pip install -U <dist_name>``")
$out.Add("- **personal skill:** update the source repo, copy the subpath over ``~/.claude/skills/<name>``, then run ``check.ps1 -Ack`` to reset the baseline")
$out.Add("")

$out | Set-Content -Path $ReportPath -Encoding UTF8

Write-Host "Report written: $ReportPath"
Write-Host "Items checked: $($rows.Count)"
