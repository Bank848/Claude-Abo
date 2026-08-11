<#
Deliberate, on-demand helper for piping a file through a local Ollama model
before it enters a paid Claude session's context. NOT a hook — nothing calls
this automatically. Claude (or the user) invokes it explicitly when a file is
large/low-stakes enough that a lossy local pre-digest is worth the latency.

Output is ALWAYS advisory. Never treat it as source of truth — re-read the
original before quoting it or acting on specifics from it.

Usage:
  powershell -NoProfile -ExecutionPolicy Bypass -File .claude\tools\ollama-digest.ps1 -Path <file> [-Instruction "..."] [-Model qwen2.5-coder-7b-instruct-q5:latest] [-TimeoutSec 30]

Default model has no "thinking" capability (unlike the qwen3-5-9b line) so it
answers directly instead of emitting a long chain-of-thought preamble first -
keeps this fast enough for the default timeout. Pick a thinking model
explicitly via -Model if CoT-style reasoning is actually wanted for a given
call, and raise -TimeoutSec accordingly.
#>

param(
    [Parameter(Mandatory=$true)][string]$Path,
    [string]$Instruction = "Summarize the key points in under 15 lines.",
    [string]$Model = "qwen2.5-coder-7b-instruct-q5:latest",
    [int]$TimeoutSec = 30
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Error "ollama not found on PATH. Not attempting anything (no auto-install)."
    exit 1
}

if (-not (Test-Path $Path)) {
    Write-Error "File not found: $Path"
    exit 1
}

$installed = ollama list 2>$null
if (-not ($installed -match [regex]::Escape($Model))) {
    Write-Error "Model '$Model' is not pulled locally. Refusing to auto-pull (could be multi-GB). Run 'ollama pull $Model' manually first."
    exit 1
}

$content = Get-Content -Path $Path -Raw -Encoding UTF8

$job = Start-Job -ScriptBlock {
    param($m, $i, $c)
    $prompt = "$i`n`n---`n$c"
    $prompt | ollama run $m 2>$null
} -ArgumentList $Model, $Instruction, $content

$done = Wait-Job -Job $job -Timeout $TimeoutSec
if (-not $done) {
    Stop-Job -Job $job | Out-Null
    Remove-Job -Job $job -Force | Out-Null
    Write-Error "ollama run timed out after ${TimeoutSec}s."
    exit 1
}

$result = Receive-Job -Job $job
Remove-Job -Job $job -Force | Out-Null

Write-Output "ADVISORY - lossy local-model output ($Model), not source of truth. Re-read the original before quoting or acting on specifics."
Write-Output "---"
Write-Output $result
