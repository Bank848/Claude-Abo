# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

# Cost-aware model routing — Opus 5.5 / Sonnet 5.5 / Haiku 5.5 (global, updated 2026-10-08: Haiku 4.5 → Haiku 5.5; 2026-09-29: Sonnet 5 → Sonnet 5.5; 2026-09-23: Opus 5 → Opus 5.5)
Pick the model based on how hard the task actually is, so easy work doesn't burn an expensive model.

**Note:** `fable-medium` (Fable 5.1 at **medium reasoning**, no need for max) can be spawned normally, but only for genuinely highest-stakes work (see the Opus 5.5 note below — the bar for calling it is much higher now). If it's banned you'll find out when the spawn fails, no need to check dates in advance.

**Pricing (per 1M tokens, input/output):** Opus 5.5 `$4/$20` (cache read `$0.20`) · Sonnet 5.5 `$2/$10` (cache read `$0.20`, same as Opus 5.5; the launch promo price became permanent, the planned bump to `$3/$15` on 1 Sep 2026 was cancelled — source https://platform.claude.com/docs/en/about-claude/pricing, checked 2026-09-23) · Haiku 4.5 `$1/$5` (cheapest) · Fable 5.1 `$10/$50` (most expensive). Saving money means "pulling work off the expensive model," not "bringing in the expensive model to help" · Haiku 5.5 `$0.10/$0.50` (prompt ≤100k tokens; above 100k it's `$0.50/$2.50`; cache read `$0.01`/`$0.05`) is about 10x cheaper than Haiku 4.5 on paper, but the new tokenizer counts about 30% more tokens for the same text, so the real saving is about 7x (Anthropic estimates average cost down about 75%) · has effort levels (default `medium`), 1M context, no Priority Tier support · source https://platform.claude.com/docs/en/models/haiku-5-5/overview (checked 2026-10-08)

**Opus 5.5 (released 2026-09-22) matches or beats Fable 5.1 on many public benchmarks, yet costs about 20-60% less than the old Opus 5 depending on category** → the normal escalation ceiling moves up to Opus 5.5 (replacing the old Opus 5 everywhere). **fable-medium is now a true last resort only, not the default step after Opus as before** — the quality gap between the two has narrowed a lot, so escalating to Fable should happen clearly less often (these figures are launch-day data from Anthropic itself, not yet proven in long real-world use)

**Real limitation:** the main loop can't switch models by itself mid-session (only `/model`, which breaks the cache). "Switching models back and forth" is done through **subagents pinned to different models** — main stays on one model and hands work to different agents.

**The lead (main loop) — two options to choose from**, set via `"model"` in `~/.claude/settings.json` (or the model picker when opening a session):

| | **Option A: Opus 5.5 main** (`"claude-opus-5-5"`) | **Option B: Sonnet 5.5 main** (`"sonnet"`) |
|---|---|---|
| Best for | Decision-heavy work: planning, debugging, architecture, CTF, system config | Long routine sessions with low judgment: batch translation, long document drafts, following instructions |
| Cost per turn | ~1.4x of Option B (not 2x, because cache read costs the same `$0.20` and is the largest chunk of main-loop cost) | Cheapest |
| Hard work | Do it yourself in main | Spawn an `opus` subagent or temporarily switch with `/model` |
| Large standard work | Spawn `sonnet-worker` (half the price) | Do it yourself in main |

Compare cost per **finished task**, not per turn: if Sonnet main has to redo work once, or you spawn `opus` once (fixed cost ~100k tokens ≈ $0.40-0.50), the savings are gone. Both options only save money **when the lead doesn't do the grunt work itself** — the trap is reading 20 files yourself or editing line by line yourself, which is work Haiku can do.

**What the lead does itself:** planning, decisions, reading the *conclusions* from subordinates, checking work, writing the hard parts / taking over when a subordinate can't cope. **Iron rule:** read conclusions, not file dumps — have the subordinate summarize, otherwise context bloats and costs more.

**Subordinates = `Agent` subagents (mostly foreground):** order → wait → check → if it can't cope, the lead does it. Use `run_in_background` only when firing several agents **in parallel** (e.g. reviewing from 3 angles at once). Ladder for picking the agentType:
- Mechanical/batch work (rename, format, find-replace, scaffold) → **`haiku-batch`** (Haiku 5.5, pinned to `claude-haiku-5-5`; don't send security/CTF work since the cyber classifier may refuse)
- Reading lots of files and returning a map/conclusion → **`Explore`** (reads excerpts, no dumps)
- Standard work / first drafts (coding, per-language review) → Option B: do it in main. Option A: small work in main; large chunks where the design is already decided / parallel runs → spawn **`sonnet-worker`** (Sonnet 5.5) — `general-purpose` inherits main's model, so use `sonnet-worker` if you want Sonnet
- Hard/high-stakes work (algorithms, deep debugging, architecture) → Option A: do it in main (spawn `opus` only to separate context/run in parallel). Option B: spawn an **`opus`** subagent (claude-opus-5-5) or temporarily switch to Opus with `/model`
- **Top of the ladder = `fable-medium` (Fable 5.1 @ medium effort, most expensive) — gate before calling, much higher bar since Opus 5.5:** call it only when **the previous Opus 5.5 step answered wrong / shakily** (don't skip Opus and call it directly), and only for highest-stakes architecture / brutal algorithm-concurrency work / multi-condition debugging / correctness proofs that Opus 5.5 itself still gets wrong — it should be called far less than back when Opus 5 was the ceiling, because the quality gap has narrowed. Use **medium reasoning, no need for max** to keep cost down. **Skip it** if: the bug is obvious from reading the code, the task is format/rename, or Opus 5.5 hasn't been tried yet. **Brief under 400 words**: goal + constraints + file paths + what's been tried + acceptance criteria + the questions you want answered (don't paste the whole chat). Fable returns **a plan/diff as text** and the orchestrator does the work itself (advisor-only). If stuck, use SendMessage to keep talking to the same agent, don't spawn new ones in a loop.

**Mandatory rules:**
1. **Announce before spawning:** `🧠 spawn <agentType> → <task> (because <reason>)` so the user can object before money is spent
2. The subagent must get **fresh context scoped to the task** (not the whole chat) + be told to **return only a conclusion**
3. Small work / short answers / quick inline fixes → do it in main, no need to spawn (spawning has overhead)
4. `spawn_task` (chip) is **a different thing** — it opens a new session, billed separately, and the lead can't supervise/inspect it live → use it only to offload heavy work to a different bill, it is not a "subordinate" in this model

Agents with a pinned model: `~/.claude/agents/haiku-batch.md` (Haiku 5.5), `~/.claude/agents/sonnet-worker.md` (Sonnet 5.5), `~/.claude/agents/opus.md` (claude-opus-5-5), `~/.claude/agents/fable-medium.md` (claude-fable-5-1 @ medium reasoning — last resort above Opus 5.5 only because it's the most expensive; medium effort is enough, no need for max)

**Local Ollama (free, ad hoc — not a routing tier, below Haiku):** `qwen2.5:7b-instruct` is available on the machine (no tools, no repo context), called via Bash: `Get-Content <file> | ollama run qwen2.5:7b-instruct "<instruction>"` (pipe the file, don't stuff a long prompt into the argument). Use it only for lossy pre-compression of large low-stakes text (long logs/docs) before it enters a paid model's context — **never treat its output as a source of truth**: if a decision depends on the content, have the main model read the original itself.

# Offload heavy execution to a spawned session (global, cost-saving)
- When there is **heavy/long execution work** (running an implementation plan, multi-file refactor, large batch) **and** it can be split into its own session (via `spawn_task` / a chip → separate worktree+branch) → **create a spawn_task chip as the default immediately, without asking first**, especially when the current session's cost is already high
- Reason: the work is **billed in the new session**, not the current expensive one, and the separate worktree doesn't disturb current work
- The prompt in the chip **must be self-contained** (the new session has no chat memory): point to the plan file/path + commit hash + task sequence + key points in full. If the plan/files are still untracked, **commit first** before releasing the chip (a fresh worktree can't see untracked files)
- State the limitation honestly: the chip **still needs the user to click once** to open the new session — Claude can't open it automatically (a harness limitation). But "no need to ask permission before *creating* the chip" stands, as the user instructed
- Small work / short answers / quick inline fixes → do it in this session as usual, no chip

## When a spawn_task child finishes — act on it, never just silently acknowledge (codified 2026-08-10)
The harness already auto-notifies the parent session when a `spawn_task` chip's work finishes (no need to tell the child to `send_message` back — that mechanism already works correctly, and the child doesn't even know the parent's session id)

**Real problem seen:** the notification reached the parent, but the parent just "acknowledged" it internally and did nothing further — the user had to ask whether the child was done.

**Rule:** whenever a spawn_task task-notification arrives in a turn, **surface it to the user as a real action in that same turn immediately**, not just acknowledge it and wait for the user to ask:
1. Read the child session's actual result (e.g. via `mcp__ccd_session_mgmt__get_session`/`list_events`, or the session summary attached to the notification)
2. Give the user a short summary: what the child finished, how it turned out, whether anything broke
3. If anything remains to be decided (e.g. reviewing the diff, merging the branch, a commit left pending in the child's worktree), propose/ask right away — don't leave it hanging silently

## Don't poll a background wakeup tool in a tight loop while waiting for the same spawn_task
If your harness has a "schedule a wakeup" tool (self-pacing polling instead of a fixed cron), don't call it repeatedly back-to-back just to check whether a `spawn_task` chip finished — each wakeup re-injects a fresh chunk of system context even when nothing changed, which burns tokens for zero new information. Set the longest delay the tool allows, then actually wait quietly for the real completion notification instead of polling. After 2-3 wakeups in a row with nothing new, stop calling the tool at all and just wait. If the delay parameter doesn't seem to be honored (wakes up immediately regardless of what you set), that's a harness bug — switch to polling the underlying status directly (e.g. a CI API) instead of the wakeup tool.

## Subagent review dispatch — tell a review subagent to invoke the real review skill, don't freelance
When you spawn a subagent to review code/a diff (e.g. self-review before merge), don't write it a freeform "please review this" prompt — explicitly instruct it to invoke the project's actual code-review skill/command (whatever that is in your setup) rather than inventing its own review process. Match review depth/cost to the diff size: a tiny diff doesn't need the same multi-agent review depth as a large architectural change — if the user flags that a review spun up more sub-reviewers than the change warranted, scale down immediately for the rest of that review.

## Self-verify loop during development, not just at the end
For work that has an automatic way to check itself (a test suite, a dev server + screenshot, a lint/typecheck script), run that check immediately after finishing each independently-verifiable unit of work, then iterate up to 2-3 rounds before moving to the next unit — don't let unverified work pile up and only check everything at the very end. Stop and report to the user if it's still failing after 2-3 rounds. Exceptions: a change too small to plausibly break anything, or a check that costs more to set up than the work itself.

# scrutinize — whenever the user asks to "review/find gaps," this skill must actually be called
`scrutinize` (`global-config/skills/scrutinize/`) = an outsider-perspective review of a plan/PR/diff/design doc — first asks whether there's a simpler way, then traces the actual code to verify the claims match the real code, rather than just reading the diff
- **Trigger**: the user asks with phrasing like "go review / find gaps / take a look / audit / sanity-check / second opinion" → actually call this skill, never freelance a review yourself
- Pick the weight based on the stakes: high-stakes architecture/design → spawn a separate subagent with an announcement. Bounded scope / small diff → do it yourself (main model)
- Different from the self-review at the end of an implementation plan (e.g. `plan-pro`) which has its own review loop — don't call scrutinize again after that by default

# Planning: use /plan-pro by default (global)
- When writing an implementation plan (after brainstorm/spec approval), use **`/plan-pro`** as the primary planner — not plain `superpowers:writing-plans`
- Reason: plan-pro extends writing-plans with a spawned review loop + HTML before/after diagrams + parallel execution → plans can be reviewed and updated themselves
- Applies to every project (global). Where `brainstorming` would normally end at writing-plans, switch to calling /plan-pro instead
- **Save tokens — skip a separate spec.md:** if brainstorming has reached design approval in chat and it's a small-to-medium feature (a single plan), **skip writing a separate spec `.md` file** and go straight to `/plan-pro` — plan-pro is the single main artifact (it absorbs the approved design into the plan header itself). Keep a separate spec only for large multi-session work / multiple plans that genuinely need a durable design. (The brainstorming skill normally requires writing a spec first — override that here to cut tokens that duplicate plan-pro.)

# Persist glossary after grilling/brainstorm (global)
- At the end of a `grilling` / `brainstorming` session (or any time a conversation settles on shared terminology/agreements) → if there is **specific terminology or an agreement that conflicts with common understanding** (one word whose meaning differs from what an outsider would guess, e.g. "platform", "quest", "layer"), **save it to memory as type `reference` (glossary) immediately**, without waiting for the user to ask
- Reason: closes the gap of "terms floating in chat and forgotten next session" — gives a permanent glossary + a shared language/ubiquitous language using the existing memory system, without creating a parallel context file
- **A term tied to a single project** → that project's memory (type reference) is the single source of truth — don't spin off a separate CONTEXT.md. **A genuinely cross-project term** (shared across several repos) → store it in `<YOUR_VAULT_PATH>\notes\` instead (see the "Second brain vault" section below), and the memory of any project referencing that term just links back, without copying the content. Each term has exactly one owner location.
- 1 term per file + add a pointer line in MEMORY.md (for the project-specific case) as usual
- Before saving, check whether an existing glossary entry already covers it (in both memory and `<YOUR_VAULT_PATH>\notes\`) → if so, update the existing file, don't create a duplicate

# Memory commands: "remember" (จำ) = local, "codify" (บัญญัติ) = global (agreed 2026-08-09)
- **"remember" / "jot down"** ("จำ" / "จดจำ", the default, nothing extra to say) → save to the **current project's auto-memory only** (`~/.claude/projects/<project>/memory/`) under the appropriate type (user/feedback/project/reference) — the existing behavior already in use, unchanged
- **"codify"** ("บัญญัติ") → a rule/behavior that must apply to **every project, every session** → write it directly into this `~/.claude/CLAUDE.md` (add a new section or edit the relevant existing one), not just auto-memory, because auto-memory is always tied to the current project and is invisible from other projects
- Why the split: the existing auto-memory system is tied to a project by structure (the path contains the project name) — there's no way to "remember across all projects" through auto-memory; only writing CLAUDE.md directly truly crosses projects.
- If unsure whether the user means local or global (e.g. they say "remember" but the content clearly sounds like a cross-project rule) → ask for clarification before saving, don't guess

# Second brain vault — <YOUR_VAULT_PATH> (global)
A personal Obsidian vault that holds only things **not tied to any one repo** — cross-project knowledge (game-dev patterns, general Python idioms, etc.), web clippings, and scratch thinking before it crystallizes into a real decision.

**The single dividing line (use it to decide on the spot):** "Is it tied to any specific repo?"
- Tied to a repo → always lives in that repo's own system: decision → `docs/adr/`, session → `docs/log/`, why → the repo's docs, a fact to remember across sessions → that project's memory
- Not tied to any repo → `<YOUR_VAULT_PATH>\`

**Structure:** `inbox/` (everything lands here first) · `notes/` (curated from inbox, permanent) · `clippings/` (web clips) · `projects/<name>/` (scratch thinking about that project **before** it crystallizes)

**Mandatory rules:**
1. **Promote-to-ADR**: if scratch in `projects/<name>/` becomes a real decision that affects code → promote it to that repo's ADR/log immediately, leaving only a pointer in the vault; never leave it dangling as scratch (otherwise the decision falls out of git and can't be found next session)
2. Never put anything in the vault that references a specific repo's paths/files/decisions — it must live in that repo
3. The vault has **no** auto-lint/`just check`/auto-link — it's entirely manual, don't expect any automatic checking
4. Integration: write `.md` directly into the vault folder with the normal Read/Write/Edit tools, no MCP server needed — the skills `obsidian-markdown`/`obsidian-bases`/`json-canvas`/`obsidian-cli`/`defuddle` are installed at `<YOUR_VAULT_PATH>\.claude\skills\` (from kepano/obsidian-skills), use them when editing `.md`/`.base`/`.canvas` files in there

# Git safety hook — global PreToolUse gate on destructive git (codified 2026-08-09)
Since 2026-06-27 there has been a **global PreToolUse(Bash) hook** in `~/.claude/settings.json` that intercepts risky git commands before they run, in **every session of every project**. Updated 2026-07-02: changed from hard-block (exit 2) → **asking the user first** via the PreToolUse `ask` decision (JSON `hookSpecificOutput.permissionDecision:"ask"` on stdout, exit 0). The user clicks Allow → the command runs; Deny → Claude is told no.

Commands gated: `git push` (every form; `--force`/`--force-with-lease` are clearly labeled), `git reset --hard`, `git clean -f*`, `git branch -D`, `git checkout .`, `git restore .`.

- Hook script: `~/.claude/hooks/block-dangerous-git.py` (Python stdlib, invoked via the `py` launcher — **not** jq/bash because this machine **has no jq**). Parses real JSON + a raw-scan fallback to prevent silent bypass.
- Adapted from the git-guardrails hook of utarn/engineer-skills but rewritten in Python stdlib (the original is a jq-based .sh that doesn't work on a machine without jq)
- Loaded only at session start — after editing `settings.json` you must restart the session for it to take effect (editing only the .py needs no restart because the hook reads the file fresh on each run)

# graphify auto-sync hook — keep the knowledge graph fresh without blocking edits
`~/.claude/hooks/graphify-auto-update.py` (PostToolUse, matcher `Write|Edit`) launches `graphify update .` detached in the background after every file edit, in any project that already has a `graphify-out/graph.json`. graphify has no built-in file-watcher, so without this the graph silently goes stale between full rebuilds. It's a no-op (returns immediately, no subprocess spawned) in any project without an existing graph — safe to leave wired globally even in projects that don't use graphify at all.

- Runs detached (`subprocess.Popen`, not `subprocess.run`) specifically so it never blocks the Write/Edit tool call waiting for graphify to finish.
- Idea adapted from evaluating a third-party Rust memory/context-injection engine (ChristopherKahler/base) that does something similar but heavier — full adoption wasn't worth it (its per-tool-call injection pattern fights the context-budget rules elsewhere in this file, and its auto-updater doesn't verify checksums before pulling new binaries). This hook keeps just the "auto-sync the graph after every edit" idea, paired with the `graphify` skill already in this template, without installing the rest of that project.

# Auto-mode classifier blocking already-confirmed commands — switch to Manual mode temporarily, then back
Claude Code's Auto Mode runs an extra safety classifier on top of your own permission rules and hooks. Sometimes it silently re-blocks a command you already discussed and approved in chat (reason tags like `[Irreversible Local Destruction]` / `[Auto-Mode Bypass]` / `[Self-Modification]`), even when no project hook or `permissions.deny` rule is the thing actually blocking it.

**For a command you've already approved in chat:** switch the session to Manual mode temporarily (the exact tool call depends on your harness — look for a session permission-mode toggle) so it shows a real permission popup instead of silently blocking, run the approved command, then **switch back to Auto mode immediately afterward** — never leave the session in Manual mode.

- **Never use this to skip an action the user hasn't actually approved yet** — you still need to ask/wait for confirmation in chat first, per the normal "Explicit permission required"/"Prohibited" rules above. This only fixes "approved in chat, but Auto Mode won't ask again and silently blocks instead" — it isn't a general bypass.
- **The `[Self-Modification]` case (editing your own security/permission config — `.claude/settings.json`, `~/.claude/**`, `CLAUDE.md`, `.mcp.json`) has a more permanent fix**: add a `permissions.ask` rule for those exact paths in `settings.json` (see `global-config/settings.example.json` in this template). A path-matching `ask` rule forces a real permission prompt ahead of the classifier, so you get asked instead of silently blocked — tested and confirmed working, no more need to toggle Manual mode for this specific case. A command routed through a tool call that can't be pattern-matched to one of these exact paths (e.g. an indirect edit where the target file isn't visible to the permission matcher) may still hit the classifier first — fall back to the Manual-mode toggle above for those.

# Bash tool vs PowerShell tool — never mix heredoc syntax (codified 2026-08-09)
This machine has two shells with different syntax: **Bash tool = POSIX sh**, **PowerShell tool = `@'...'@` here-string**. Never use a PowerShell here-string `@'...'@` in the Bash tool — Bash treats `@` literally and it leaks into the real output (this happened: a `git commit` subject became `@` + the actual text, and had to be fixed with --amend).

**How to build a multi-line string for the right shell:**
- Bash tool → use a real heredoc `command <<'EOF' ... EOF` or write to a file and pass `-F file` / `--file`
- PowerShell tool → `@'...'@` works as normal (never cross over)
- Multi-line / Thai-language git commit messages → safest is `git commit -F <file>` after writing the message with the Write tool first

# "log it in the skill notebook" ("จดลงสมุดสกิล") = update sources.json (codified 2026-08-09)
When the user says **"log it in the skill notebook"** ("จดลงสมุดสกิล"), it means **specifically**: update `~/.claude/tools/skill-update-check/sources.json` — not just `~/.claude/SKILLS_INDEX.md` or some project ledger file (e.g. `FULL-LEDGER.md`). Updating only the human-readable index/ledger and skipping sources.json does not count as "logging it in the skill notebook"; the user will have you redo it.

**Why:** `sources.json` is the manifest that `check.ps1` (the weekly update checker) reads. If a newly adopted skill/tool isn't recorded here, it falls out of tracking forever — exactly the problem this system exists to prevent. SKILLS_INDEX.md/ledgers are for humans to read; sources.json is the source of truth that automation actually reads.

**How to apply:**
- Every time a new skill/pip package/tool is adopted and you're about to "write the summary," add/update the entry in `sources.json` as part of that same job — not optional
- The manifest has categories: `personal_skills` (skill folders under `~/.claude/skills/` with a tracked subpath + baseline commit), `pip_packages` (dist name + source repo), `npm_packages`, `binary_tools` (for standalone CLI tools that aren't Claude Code skills, e.g. witr, opencode, magnitude, pi, ifixai) — pick the right category, don't shove everything into personal_skills
- Be honest in the note field about whether check.ps1 actually checks it automatically — `npm_packages`/`binary_tools` have no automated check.ps1 logic yet (only git/pip are automated), so write "update manually", don't imply it's auto-tracked
- If there's a genuinely new category that doesn't fit personal_skills/pip_packages, you may add a new top-level array (precedent: npm_packages, binary_tools)

# Cross-session "send message" vs spawn_task vs SendMessage (codified 2026-08-09)
The user calls `mcp__ccd_session_mgmt__send_message` simply **"send message"** — keep it distinct from the 2 similarly named tools:
- **`mcp__ccd_session_mgmt__send_message`** ("send message") — sends a message to **another CCD session that already exists** (found via `mcp__ccd_session_mgmt__list_sessions`); the message shows up as a user turn in the target session with a "From {this session's name}" label, and creates nothing new. Use it for handing off context / relaying a finding across sessions. **Doesn't work in an unattended session** (scheduled-task runs, remote-dispatched)
- **`spawn_task`** (chip) — creates a **brand new session** for out-of-scope work found along the way; the user must click the chip to actually open it; the prompt must be self-contained; billed separately from the current one
- **`SendMessage`** (top-level tool, no `mcp__` prefix) — sends a message to a **subagent/teammate spawned in the same session** (e.g. via the Agent tool), not a separate CCD session

Note: this is the harness-level equivalent of Claude Code CLI's cross-session messaging (v2.1.224+, macOS/Linux or WSL2 only) — but this tool works on Windows without needing WSL2

# Skills Index (global reference)
A central index of every skill the user has installed (built-in / superpowers / ecc / ui-ux-pro-max / pordee / lazyweb / karpathy / anthropic-skills) with a "which to use when" cheatsheet:
- File: `~/.claude/SKILLS_INDEX.md`
- Use when: before starting any work, open and read it to check whether a skill matches the task (saves tokens + gets a workflow the user has already vetted)
- When a new skill is installed/removed, update this file too


# Installed Plugins (enabled in ~/.claude/settings.json)
<!-- Claude-Abo template: REWRITE THIS SECTION before copying — it names the original owner's plugins, not yours. See README's "How to adopt this" step 1 / `/adopt` step 3.5. -->


These plugins are installed and ENABLED — their skills/commands/agents/MCP tools are available. Do NOT tell the user they need to install them.

- **superpowers** v6.2.0 (obra/superpowers) — 14 skills: brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, requesting-code-review, receiving-code-review, subagent-driven-development, dispatching-parallel-agents, verification-before-completion, using-git-worktrees, finishing-a-development-branch, writing-skills, using-superpowers. Trigger via `/plan`, `/brainstorm`, etc. (updated 2026-08-08 from v5.1.0, 240 commits)
- **ecc** v2.2.0 (affaan-m/ECC — repo renamed from `everything-claude-code`, same repo) — 67 agents, 284 skills, 94 commands. Agents include: planner, architect, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, refactor-cleaner, doc-updater, e2e-runner, code-explorer, code-architect, plus language reviewers (typescript, python, go, rust, java, kotlin, swift, csharp, fsharp, cpp, django, fastapi, flutter, dart). Commands: /feature-dev, /code-review, /build-fix, /checkpoint, /evolve, /hookify, etc. MCP servers (prefixed `plugin_ecc_`): context7, github, memory, playwright, sequential-thinking. (updated 2026-08-08 from v2.0.0-rc.1, 533 commits; note: `claude plugin update` ships new versions as non-git release-archive extracts, not `git pull` — the weekly `check.ps1` checker only understands `.git`-backed caches, so it will keep reporting this plugin as "behind" until the stale `2.0.0-rc.1` cache dir is manually removed — see SKILLS_INDEX.md "reference tools" section)
- **pordee** (kerlos/pordee), **lazyweb** (aboul3ata/lazyweb-skill), **andrej-karpathy-skills** (forrestchang/andrej-karpathy-skills) — also enabled.

Install paths: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`. Enabled-state manifest: `~/.claude/settings.json` -> `enabledPlugins`.

Note: ECC ships a GateGuard hook (`pre:edit-write:gateguard-fact-force`) that demands a "fact-forcing" preamble before edits to certain files. To disable for setup/repair: set `ECC_GATEGUARD=off` or add the hook name to `ECC_DISABLED_HOOKS`.


# Auto-compact awareness — warn/ask for a compact yourself when burning tokens (codified 2026-08-09)
Claude must **keep watching its own context size at all times** and be the one to propose a compact, rather than waiting for the user to notice the chat is long

**Limitations to state plainly (never pretend otherwise):**
- Claude **can't run `/compact` itself** — it's a CLI slash command the user must type (not a tool)
- **A hook can't trigger a compact either** — PreToolUse/PostToolUse hooks can only block/ask/inject text; no hook event can order a compact (the `SessionStart` matcher `compact` is a hook that *runs after* a compact finishes, not one that orders it)
- What's actually possible is the harness's built-in **auto-compact** (runs by itself when the context is nearly full) + **Claude warning the user to press compact before reaching that point**

**Triggers to propose a compact (check every time before starting a new chunk of work):**
1. **Hard ceiling: context reaches ~200k tokens → warn immediately; reaches ~300k → warn strongly and confirm a compact is needed before doing anything else** (these numbers are the user's own and take priority over any % threshold — when the number is reached you must warn even if the window isn't close to full). If you also know the %, use ~60% of the window as a supplement → tell the user in one line: "context is ~Xk now, recommend `/compact` before starting the next task"
2. Just finished reading a large file / long log / huge tool output several times and that task is now **done** → propose a compact immediately (the raw content doesn't need to stay)
3. About to start a **new task unrelated to the previous one** in the same chat → propose a compact first (a topic change is the cut point where compacting loses the least)
4. About to start heavy/long execution work → per the "Offload heavy execution" rule, release a `spawn_task` chip instead of continuing in an already-bloated chat

**How to propose it:** short, 1-2 lines + say what you'll do after compacting; don't ask again if the user just declined in a recent turn (asking again is annoying and burns tokens itself)

**Prevention beats cure — cut tokens before reaching the point of needing a compact:**
- Don't dump whole files into context if you only need the conclusion → have `Explore`/a subagent summarize (per the cost-aware routing rule)
- Don't re-read the same file to "check whether the fix landed" — Edit/Write errors out by itself if it failed
- Long low-stakes logs/docs → pre-compress with ollama before they enter context

# MCP/Plugin context bloat audit
If the user complains their context feels bloated, the biggest culprit is often not project-level settings but **marketplace plugins/connectors enabled at the account level** (in whatever settings surface your harness exposes for that, separate from the project's own config) — turned on ages ago and forgotten. Before recommending anything get disabled, check evidence of actual recent usage (search session history/transcripts if that's available) rather than guessing from a plugin's name or category — an unused-sounding name isn't proof it's unused, and a command that lists installed plugins/servers often only shows a subset. Priority order: disable unused account-level plugins first (biggest win, lowest risk) before touching project-level instruction files (CLAUDE.md/AGENTS.md/rules) — trimming those risks losing context the user actually wanted; suggest it but don't push.

# Terse narration during routine command execution
This rule only governs how much narration to produce — it does not change when to ask for permission. Always decide first whether an action falls under "explicit permission required" / "prohibited" categories, and if so, ask/stop exactly as normal regardless of this rule. It only relaxes narration for commands that already cleared that gate (scans, builds, test loops, long-running batch jobs).
- **Brief before running**: one line saying what you're about to do and why, before firing off a long-running command.
- **Quiet while waiting**: don't report every failed attempt/every retry/every parameter tweak — accumulate and summarize once you get a result or hit a real blocker.
- **Brief when done**: a short result line, then move to the next step.
- **Still always speak up, even mid-wait**: anything that changes the plan (a critical finding, a credential/secret encountered, discovering you're targeting the wrong thing), an error that requires a different approach, and any "announce before spawning a subagent" convention you're following — none of these count as "chatter."
- **Exception that overrides this rule**: destructive actions, irreversible/risky commands, or any point that genuinely needs the user's judgment — those still always get a stop-and-ask, per the normal "explicit permission required"/"prohibited" categories.
- Why: users often want to read progress from the command's own output, not a running commentary from Claude — heavy narration makes it harder to follow and burns tokens for no benefit.

# PR & review defaults — draft-first
- Every time you open a new PR → default to `--draft` (`gh pr create --draft`, including `--fill` variants) unless the user has explicitly said in this session to open it ready-for-review. If the repo/plan doesn't support drafts (some private-repo tiers), say so and ask before opening a ready PR silently.
- Code review on a PR → **don't use `gh pr review`** (it submits immediately, no pending mode) — create a **pending review** via `gh api repos/{owner}/{repo}/pulls/{pr}/reviews` with **no `event` field**, then tell the user the review is waiting to be submitted in the GitHub UI (pending reviews are invisible to anyone else — if you don't say so, the user will forget it's there). Note: only one pending review can exist per PR at a time — if the API errors that one already exists, tell the user to go submit/delete the existing one first.
- Draft PRs **cannot be merged** — before merging you need `gh pr ready` first, and marking ready publishes the PR to reviewers, so that's its own separate confirmation checkpoint, never bundled silently into a merge.
- Why: most people want to review/tweak their own work before it's visible to reviewers.

## After merging a PR, sync the local base branch as part of the same job
Every time a PR merge finishes, fetch and fast-forward your local checkout of the base branch to match origin as part of finishing that task, without waiting for the user to ask "did you pull yet." A squash-merge can leave the local base branch unable to fast-forward even though its content already matches origin — in that case diff against `origin/<base>` first; if it's empty for the affected paths, the local-only commits are safe to reset away, but never discard something that turns out to be genuinely unpushed work. Branch deletion is a separate question — always ask before deleting a branch, even right after a successful merge.

# Scheduled cloud agents/cron — you may propose and create these on your own initiative, but always say so or ask first
You're free to **propose and create** a scheduled cloud agent / cron job (whatever your harness's equivalent tool is for recurring automated runs) on your own initiative when you spot a good fit — e.g. a status check that should repeat daily, polling a long-running result, a maintenance task that recurs. You don't need to wait for the user to ask first.

**But before actually creating one, always say so or ask first** (never create silently and mention it after the fact) — tell the user at minimum: what it will run, the schedule/frequency, and the consequence (e.g. cost per run if any), then wait for confirmation before calling the tool. Why: a scheduled/cron job is **standing/persistent config** that keeps running after this session ends — creating one without telling the user leaves something running in the background that they don't know about.

# Browser tool choice — ask once, don't assume
<!-- Claude-Abo template: this section is intentionally a question, not a fixed answer — the "right" browser tool depends on what the adopter has installed, not on what the original author uses. Ask this once during /adopt (or the first time browser automation comes up) and write the answer back into this file so future sessions don't ask again. -->

Before using any browser-automation tool for the first time in a fresh setup, ask the user which of these they want as the default, and record the answer here:
1. **The Claude Code app's own built-in browser tool** (e.g. an in-app Chrome/DevTools MCP) — works out of the box, no extra setup, but has had real bugs in some versions (tabs not actually isolated per session — see the gotcha below — or the tool silently failing). If the user has hit that, don't default back to it.
2. **The user's regular Chrome via a browser-extension MCP** — real logins/cookies, but shares the user's daily-driver browser, so treat tabs it opens as something a human might also be looking at.
3. **A dedicated agent-only browser** (a browser instance/profile set up specifically for agent use, kept signed into accounts, separate from the user's daily browser) — often the cheapest on tokens per action of the three, and the safest to leave things open in since a human isn't using it at the same time. Recommend this by default if the user has one available and doesn't have an existing preference.

Once the user picks, use that tool as the default for browser work in this project without asking again, and update the placeholder line above to name the chosen tool instead of re-describing all three options.

## Shared tab group gotcha across parallel sessions
If you're running with browser automation tools (e.g. an in-Chrome MCP) alongside another parallel session that also uses browser tools, **all sessions typically share the same Chrome tab group** — they are not automatically isolated into separate tabs, even if the tool's own description claims each conversation gets its own tab.

**Why this matters (real incident):** one session was polling a tab (kept the same tab ID from when it first opened) waiting on a long-running job to finish. Meanwhile a parallel session opened a browser tab too, got back the *same* tab ID via a "list tabs" call, and navigated it somewhere else entirely — without the first session knowing. The first session kept reading page content from the wrong page for a while before noticing the title had changed.

**How to avoid it:** if you know you're running in parallel with another session that also uses browser tools → **open your own new tab immediately** rather than relying on a "list tabs" call and reusing whatever tab ID comes back (it may be a tab another session just created/is using). If you're polling something for a while and the tab's title/URL changes without you having navigated it yourself → suspect immediately that another session took over the tab, and open a fresh one rather than debugging further on the same tab.

# Thai writing anti-AI-tell rules
When drafting Thai-language content (homework, essays, reports, articles, chat) avoid these patterns — they're the clearest fingerprints of AI-generated Thai text:
- **Formal essay connectives opening paragraphs**: don't use "อย่างไรก็ตาม / นอกจากนี้ / ในขณะเดียวกัน / ทั้งนี้ / ดังนั้น" to open a paragraph more than once in a whole piece, and don't rotate through this connective family so every paragraph gets a different one.
- **Symmetrical three-item lists**: don't give examples in threes with identical parallel sentence structure and equal length every time — mix in twos or fours, vary the length, and avoid the "ไม่ว่าจะเป็น... หรือ..." opening formula.
- **Restate-everything closing sentences**: don't close with "สรุปได้ว่า / กล่าวโดยสรุป / ท้ายที่สุดแล้ว" followed by a recap of every point — end on a specific detail or personal opinion instead, shorter than you'd expect.
- **Uniform sentence length + no specific detail**: mix short punchy sentences with longer ones, and narrative/essay writing needs at least one genuinely specific detail (a name, place, event, real number) — ask the user rather than writing something generic if you don't know one.
- **Register**: know what you're writing (homework/academic/article/chat/creative) and match it — don't default to essay-formal tone every time. Chat should have particles and dropped subjects; student homework should use first-person pronouns and direct personal experience.
- **English-calque nominalization**: avoid "มีความสามารถในการ X", "อย่างมีประสิทธิภาพ/อย่างมีนัยสำคัญ" — use plain Thai verbs instead (except in genuinely academic writing that needs the formal terminology).
- **Copula avoidance**: AI likes to replace a plain "X คือ Y" statement with "ทำหน้าที่เป็น", "ถือเป็น", "สะท้อนให้เห็นถึง", "นับว่าเป็น" — if you can say it plainly, say it plainly.
- **"ไม่ใช่แค่ X แต่ยังเป็น/แต่ยังรวมถึง Y" negative-parallelism**: this template manufactures false depth for simple points — use it rarely, only for a genuinely sharp contrast, never as a recurring sentence shape in one piece.
- **Floating attribution with no real source**: avoid "ผู้เชี่ยวชาญระบุว่า", "มีการศึกษาพบว่า", "จากสถิติชี้ให้เห็นว่า" without a real name/source behind it — state it as your own opinion instead ("ผมว่า...") rather than manufacturing fake authority.
- **Hedge-then-emphasize closing formula**: avoid closing every paragraph/piece with "แม้จะมี [good point] แต่ก็ยังคงเผชิญกับความท้าทาย/ปัญหาอยู่" — it's a formula for fake balance, not real analysis.
- **Excessive synonym-swapping (elegant variation)**: AI tends to avoid repeating a word by calling the same thing by 2-3 different names within one paragraph — real writers repeat the same word naturally, no need to avoid it.
- **Tourist-brochure tone in neutral contexts**: avoid overused positive words like "งดงาม", "เต็มไปด้วยเสน่ห์", "มีชีวิตชีวา", "น่าประทับใจอย่างยิ่ง" in content that wasn't asked to be a review/ad — especially describing ordinary places/objects.
- **Formatting overkill for the context**: bolding whole paragraphs, decorative emoji as section markers, unnecessary horizontal rules, tables in a chat/homework context where plain prose is fine — reserve heavy formatting for content actually requested as a document/deck.
- **Suspiciously flawless (zero human noise)**: real human writing (especially chat/personal narrative) has natural stumbles, mid-sentence changes of mind, idiosyncratic word choices — don't polish every sentence to identical smoothness; let some natural voice through appropriate to the register.
- **Overused Thai "GPT-isms"**: words like "เจาะลึก" (delve), "พลิกโฉม"/"เปลี่ยนโฉม" (revolutionize, overused), "ยกระดับ" (elevate, overused), "ตอกย้ำ" (underscore), "ตกผลึก" (used outside genuine idea-crystallization contexts), "หลากหลายมิติ"/"รอบด้าน" (multifaceted filler), "โอบรับ" (embrace, calqued), "องค์รวม" overused — only use these when they're genuinely the right word, not because they sound impressive.
- Why: these aren't just word-level tells (em dash, quote marks) — they're structural/rhetorical patterns, and readers used to AI text catch these as easily as, or more easily than, individual words. See `global-config/memory-examples/anti-ai-tell-thai-detail.md` for the full backing detail and before/after examples.

# Don't wrap emphasized words/phrases in quote marks ("") in Thai writing
When drafting Thai content, don't put quote marks around a word or phrase just to emphasize it — rewrite the sentence so the word carries weight from context instead, or use **bold** if emphasis is genuinely needed.
- Why: quoting a word for emphasis (e.g. "คน-ประสบการณ์-ความทรงจำ") is a pattern readers immediately recognize as AI-assisted writing, especially in homework/writing that might get checked for AI content.

# English writing anti-AI-tell rules
When drafting English content (chat, email, DM, essay, report, post) avoid these patterns — full detail + vocab tables + before/after examples in `global-config/memory-examples/anti-ai-tell-english-detail.md`:
- **Em dash**: don't use an em dash to join two clauses, especially the "X — because Y" pattern — use a comma, a new sentence, or "and"/"so" instead.
- **GPT-ism vocabulary**: avoid "delve", "tapestry", "boasts", "underscore(s)", "landscape" (metaphorical), "realm", "crucial/pivotal/vital" as a default intensifier, "intricate", "multifaceted", "leverage" (verb), "seamless(ly)", "robust", "foster", "navigate (challenges)", "embark", "elevate", "unlock", "game-changer", "in today's fast-paced world" — when unsure, use the plain verb ("use" not "utilize", "help" not "facilitate").
- **"not just X, but Y"**: use at most once per piece, and never "It's not about X. It's about Y."
- **Rule-of-three throttle**: don't reflexively list three parallel items ("clear, concise, and compelling") — use two or four items of uneven length, or expand a single point instead.
- **Copula avoidance**: write "is/are/has" plainly — don't swap in "serves as", "stands as", "represents", "acts as", "functions as".
- **Opener/closer formulas**: don't open with "In today's world / digital age / ever-evolving landscape"; don't close with "In conclusion / Ultimately / At the end of the day" followed by a full recap; avoid hedge-then-emphasize closings ("While challenges remain, X continues to...") — end on a specific detail or a shorter opinion than you'd expect.
- **Vague attribution**: don't write "experts say / studies show / many believe" without a real citable source — ask the user, or state it as your own view.
- **Elegant variation**: repeat the same word naturally rather than swapping synonyms (dog → canine → four-legged friend) to avoid repetition.
- **Promotional inflation**: neutral/factual context calls for neutral language — avoid "vibrant", "stunning", "rich cultural heritage", "must-see", "nestled" outside genuine advertising copy.
- **Formatting overkill**: chat/DM/email should be plain prose — no bold-term-colon lists, headers, emoji bullets, horizontal rules, or tables unless the user actually asked for a structured document.
- **Contractions**: conversational writing (chat, DM, casual email, blog post) needs contractions ("don't/it's/I'll") — zero contractions is itself a tell, and vary sentence/paragraph length so it doesn't read too uniform.
- **Register first**: decide chat / professional email / essay / creative before writing, then match it — defaulting to polished-neutral-formal every time is the single biggest tell.
- Priority order when self-editing a draft: (1) GPT-ism vocab + em dash, (2) promotional inflation + copula avoidance, (3) "not just X but Y" + rule-of-three, (4) opener/closer formula + vague attribution, (5) contractions + register match, (6) sentence/paragraph rhythm, (7) formatting overkill.

# Proactive Supabase RLS/security check on new work
Whenever you start work on a project that uses **Supabase** (dependency on `@supabase/supabase-js`, a `.env` with `SUPABASE_URL`/`SUPABASE_ANON_KEY`, or the user says so directly), proactively offer (don't wait to be asked) to run a security check via the Supabase MCP/CLI (`get_advisors` type `security` + `list_tables` verbose) to confirm **RLS is enabled on every table exposed via PostgREST** — especially before deploying or sharing a link with anyone else.
- Why: it's a common pattern for a table to end up with real data in it and RLS still off, invisible until someone points the anon key straight at PostgREST. The problem isn't the anon key leaking (that's expected to be public) — it's a table with no RLS/policy behind it.
- How to check: list the relevant Supabase project → `get_advisors(type:"security")` + `list_tables(verbose:true)` for every table's `rls_enabled` → flag immediately if any table with real/expected data has `rls_enabled:false`.
- **Don't auto-apply a fix** — turning on RLS with no policy attached will immediately lock the app itself out of its own data. Ask first whether the project has auth/login: if yes, policies should key off `auth.uid()`; if no, offer alternatives like revoking anon direct grants and proxying through an Edge Function/API route instead.
