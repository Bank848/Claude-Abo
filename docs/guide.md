# Claude-Abo guide

Long-form notes that used to be the top of the README: what each piece is, how to adopt it by hand, model routing, the optional Ollama idea and compatibility with other agents. The short version is in [README.md](../README.md).

## Who is this for

| Good fit | Not a fit |
|---|---|
| You already use Claude Code daily and want ready-made habits: model routing by cost, git safety hooks, a plan-review loop | You want a one-click config. Nothing here runs as-is; everything is meant to be read and adapted |
| You like reading other people's setups and copying only the parts that suit you | You need Windows-free or Thai-free defaults everywhere. The author's setup is Windows and Thai-English, and some sections show it |
| You run more than one AI coding tool and want a portable `AGENTS.md` | You want a maintained product with releases and support. This is a personal snapshot |

## Getting started (quickstart)

> **Shortcut:** clone the repo, open it in Claude Code, and run `/adopt` — it interviews you and does steps 2, 3, 5, and 7 below for you, checking off progress in a resumable journal file. Step 6 (installing the plugin ecosystems themselves) is deliberately out of scope for `/adopt` — that one's still on you.

<p align="center"><img src="assets/quickstart-flow.svg" alt="Clone, then copy configs, then run /adopt, then verify" width="100%"/></p>

| # | Step | Where |
|---|---|---|
| 1 | Clone the repo | anywhere convenient |
| 2 | Decide: want local Ollama pre-compression? | see [Optional: Local AI](#optional-idea-local-ai-ollama-pre-compression) |
| 3 | Copy configs into `~/.claude/` | `CLAUDE.md`, `agents/*.md`, `hooks/*.py`, `skills/*`, `tools/` — **rewrite "Installed Plugins" first** |
| 4 | Merge settings | `global-config/settings.example.json` → `~/.claude/settings.json` (replace `<YOUR_HOME>`) |
| 5 | Find-and-replace placeholders | full list in [How to adopt this](#how-to-adopt-this), step 8 |
| 6 | Install the plugin ecosystems | see [What you'll still need to install](#what-youll-still-need-to-install-separately) |
| 7 | Copy `notes/` + `memory-examples/` (optional) | your own vault / auto-memory folder |
| 8 | Verify | ask for an implementation plan — does `/plan-pro` fire? |

Multi-agent shop (Codex, Cursor, Gemini CLI, ...)? Also copy `global-config/AGENTS.md` into each project root — see [Compatibility with other AI coding tools](#compatibility-with-other-ai-coding-tools).

The rest of this README explains each piece in detail.

## What's in here

```
Claude-Abo/
├── README.md
├── LICENSE                                # MIT license for this repo's own content
├── ATTRIBUTION.md                         # Credits for the upstream repos the third-party skills were adopted from
├── .claude/commands/adopt.md              # Run `/adopt` in this repo to interview + auto-apply the steps below
├── global-config/
│   ├── CLAUDE.md                          # Global instruction file (~/.claude/CLAUDE.md equivalent)
│   ├── AGENTS.md                          # Portable subset of CLAUDE.md for non-Claude-Code agents (Codex, Cursor, Gemini CLI, ...)
│   ├── settings.example.json              # Sanitized ~/.claude/settings.json — hooks, plugins, model default
│   ├── agents/                            # 4 pinned-model subagent definitions (opus, sonnet-worker, haiku-batch, fable-medium)
│   ├── hooks/i-have-adhd/always-on.sh       # Optional hook script for the i-have-adhd output style (wire it into settings.json yourself)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate that asks before risky git commands
│   ├── hooks/graphify-auto-update.py      # PostToolUse hook — keeps the graphify knowledge graph in sync after edits
│   ├── rules/ecc-common/                  # 10 engineering-discipline rule files (ecc plugin ecosystem)
│   ├── skills/                            # <!-- gen:skills-count:start -->61<!-- gen:skills-count:end --> curated skill folders (the actual SKILL.md instructions, not just an index — see sources.json for provenance)
│   ├── SKILLS_INDEX.md                    # Personal index of installed skills/plugins + when to use which
│   ├── memory-examples/                   # example auto-memory entries showing the memory system's format/patterns
│   ├── templates/                         # 2 starter templates to copy into a new repo (project-CLAUDE.md, conventions.md)
│   └── tools/
│       ├── skill-update-check/
│       │   ├── check.ps1                  # Weekly update checker — reads sources.json from this same folder
│       │   └── sources.json               # Provenance manifest: <!-- gen:skills-count-4:start -->66<!-- gen:skills-count-4:end --> personal skills + 3 pip + 2 npm + 1 binary tool
│       └── ollama/ollama-digest.ps1       # On-demand local-model pre-digest helper (see the Ollama section below)
└── notes/                                 # 3 notes: a personal cross-project "second brain" vault (example content)
```

### `global-config/CLAUDE.md`
The heart of the setup. It encodes:

- **Cost-aware model routing** — main loop on your choice of Opus 5.5 (judgment-heavy work) or Sonnet 5.5 (cheaper routine sessions) as orchestrator, delegating to Haiku/Sonnet/Opus/Fable subagents by task difficulty, with hard rules about who reads raw files vs. who reads conclusions.
- **Heavy-execution offloading** — spawning big jobs into separate sessions instead of bloating (and billing) the current one.
- **Planning workflow** — `/plan-pro` as the default planner.
- **Second-brain vault convention** — a single rule ("is it tied to one repo?") deciding what lives in the vault vs. in a repo's docs/ADRs.
- **Git safety hook** — a PreToolUse gate that asks before destructive git commands.
- **graphify auto-sync hook** — a PostToolUse hook that keeps the knowledge graph up to date after every edit, without blocking the edit itself.
- **Auto Mode classifier workaround** — what to do when Auto Mode's own safety classifier silently re-blocks a command you already approved in chat, including a permanent `permissions.ask` fix for the "editing your own Claude Code config" case specifically.
- **Shell gotchas** — Bash tool vs. PowerShell tool heredoc syntax rules (Windows-specific pain, learned the hard way).
- **Context self-monitoring** — when Claude should proactively suggest `/compact`.
- **Anti-AI-tell writing rules** — a full Thai + English ruleset for making drafted text read as human-written (vocab to avoid, structural patterns, register matching); the largest, most broadly reusable piece in the file. Backing detail lives in `memory-examples/`.
- **PR draft-first default**, **ask-before-scheduling cron/cloud agents**, **terse narration during long-running commands**, a **claude-in-chrome shared-tab-group gotcha** for parallel sessions, and a **proactive Supabase RLS check** for any project using Supabase.

### `global-config/rules/ecc-common/`
General engineering discipline from the ecc (everything-claude-code) plugin ecosystem: TDD workflow, immutability, commit format, security checklist, code-review severity levels, agent delegation. Only useful if you also run ecc (see "What you'll still need to install" below).

(The full skill list, generated from the catalog, is in [README.md](../README.md#skills).)

### `global-config/memory-examples/`
Example entries from a Claude Code auto-memory system (not project-specific facts — portable "how I work" habits): a naming-convention disambiguation for cross-session messaging, the local-Ollama-as-pre-compression pattern, a rule about what "update the skill notebook" actually means operationally, a shell-quoting gotcha (`\b` silently becoming a backspace byte), a feedback entry on how aggressively to trim context bloat, and the full backing detail (vocab tables + before/after examples) for the anti-AI-tell writing rules in CLAUDE.md, in both Thai and English. These exist to show the *shape* of a good memory entry (rule + why + how-to-apply) as much as their specific content — see `global-config/rules/ecc-common/` for how memory fits into the broader workflow, and CLAUDE.md's "จำ/บัญญัติ" section for the local-vs-global memory distinction this owner uses.

### `global-config/tools/skill-update-check/sources.json`
The owner's actual skill/tool adoption manifest — real provenance data (source repo URLs, install notes, version history) for all <!-- gen:skills-count-5:start -->66<!-- gen:skills-count-5:end --> personal skills (including the self-authored and adapted ones) plus 3 pip packages, 2 npm packages, and 1 binary tool. Paired with `check.ps1`, this is what lets a `claude-clone-template` adopter track upstream updates to the skills they copied into `~/.claude/skills/`, the same way the original owner does. Update `last_seen_commit` values are mostly `unknown`/stale from the recipient's perspective until they run `check.ps1 -Ack` once to establish their own baseline.

### `global-config/templates/`
Two small starter files (`project-CLAUDE.md`, `conventions.md`) to copy into a new repo on first setup — a ≤45-line "router" project CLAUDE.md and a conventions/green-gate template. Each has a comment block with a fill-in-the-blank PRESET for the stack you're bootstrapping (currently just a Python-web example); add your own preset the same way if your stack needs one.

### `notes/`
Example content from the owner's Obsidian second-brain vault: local Ollama model inventory, bookmarked repos, and misc reference notes. These show *what kind of thing* belongs in a cross-project vault — they are not universal must-haves. Keep the structure idea, replace the content with your own over time.

## How to adopt this

1. **Copy `global-config/CLAUDE.md`** into your own `~/.claude/CLAUDE.md`. Merge it with what you already have, or replace outright — your call. Read it first; delete sections that don't apply to you. **Rewrite the "Installed Plugins" section before you do anything else with this file** — it currently asserts specific plugins (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) are installed and enabled, and tells Claude not to mention installing them. That's true for the original owner, not for you. Replace it with your own actual plugin list, or delete it until you've installed something.
2. **Copy `global-config/agents/*.md`** into `~/.claude/agents/` and **`global-config/hooks/*.py`** into `~/.claude/hooks/`. These are what make the model-routing rules, the git safety gate, and the graphify auto-sync hook in CLAUDE.md actually functional, rather than just prose.
3. **Copy `global-config/skills/*`** into `~/.claude/skills/`. This is the bulk of the actual value — <!-- gen:skills-count-3:start -->61<!-- gen:skills-count-3:end --> working skill folders, not just descriptions of them.
4. **Merge `global-config/settings.example.json`** into your own `~/.claude/settings.json` (replace `<YOUR_HOME>` with your real home path first). Merge, don't overwrite, if you already have a settings.json — take the `hooks.PreToolUse`/`hooks.PostToolUse` entries, the `permissions.ask` block, and whatever else you want from `enabledPlugins`. The shipped hook commands use the Windows `py` launcher; on macOS/Linux, change them to `python3` first.
5. **Copy `global-config/rules/ecc-common/`** into `~/.claude/rules/` **only if** you install the ecc plugin. Otherwise skip.
6. **Copy `global-config/memory-examples/*.md`** into the auto-memory folder for whichever project you want them to apply to (Claude Code auto-memory is per-project, at `~/.claude/projects/<project>/memory/`), or read them as reference and write your own from scratch.
7. **Copy `notes/`** into your own second-brain vault location (any folder Obsidian or plain markdown tools can see), or skip entirely if you don't want a vault.
8. **Find-and-replace every placeholder** — this is the most important step:
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → your actual Windows/system username and home path
   - `<YOUR_VAULT_PATH>` → wherever you keep (or plan to keep) your second-brain vault
9. **Copy `global-config/tools/`** (both `skill-update-check/` and, if you kept Ollama, `ollama/`) into `~/.claude/tools/`, then **set your own baseline in `sources.json`**: run `check.ps1 -Ack` once after copying the skills over, so `last_seen_commit` reflects a starting point you control rather than the original owner's history.

## What you'll still need to install separately

This repo contains **references to and rules for** skill ecosystems — not the ecosystems themselves. For the CLAUDE.md instructions to mean anything, you need to install:

- **superpowers** (obra/superpowers) — brainstorming, writing-plans, TDD, debugging skills
- **ecc / everything-claude-code** (affaan-m/ECC) — agents, skills, commands, MCP servers
- Any other plugins named in `SKILLS_INDEX.md` that you decide you want

Install them via Claude Code's plugin system on the new machine, then reconcile `SKILLS_INDEX.md` with what you actually installed.

---

## A note on subscription plan and the Fable 5.2 tier

`CLAUDE.md`'s routing ladder tops out at a `fable-medium` subagent, which needs a **Max** plan — on **Pro**, spawning it just fails. `/adopt` asks about this and fixes it for you.

<details>
<summary>Manual fix if you're not on Max</summary>

The model-routing ladder in `CLAUDE.md` tops out at a `fable-medium` subagent — the most expensive tier, used as the preferred advisor/second-opinion model for hard decisions. The original owner is on a **Max** plan, where that model is available. If you're on **Pro** (or any plan without Fable 5.2 access), spawning `fable-medium` will just fail.

Before copying `CLAUDE.md` as-is, check which plan you're on. If you don't have Fable 5.2:
- Delete the `fable-medium` paragraphs and the "สุดบันได" (top-of-ladder) bullet from the model-routing section.
- Change the ladder's ceiling to stop at `opus` — the routing logic (escalate to Opus on hard/high-stakes work) still holds, it just won't have a level above Opus to escalate to.
- Drop `global-config/agents/fable-medium.md` from what you copy into `~/.claude/agents/`.

`/adopt` asks this as part of its interview and does this edit for you; if you're copying files by hand instead, do it yourself so Claude doesn't keep trying to spawn a subagent your plan can't reach.

</details>

---

## Optional idea: local AI (Ollama) pre-compression

An idea, not a requirement: a cloud model such as Haiku already covers most of this cheaply. Skip it unless you want to experiment.

A **free, lossy pre-compression tier** — a local model digests long low-stakes text before it hits a paid model's context. Zero capability added, pure cost-saver. Skippable; nothing else here depends on it.

<details>
<summary>Details — do you want this?</summary>

The original setup uses local Ollama models as a **free, lossy pre-compression tier** — piping long low-stakes text (logs, verbose docs) through a local model to digest it *before* it enters a paid model's context. It sits **below Haiku** in the cost ladder and is not a routing tier: no tool access, no repo context, text in / text out only. It saves money; it adds no capability. Nothing else in this repo depends on it.

**So, a question you need to answer for yourself: do you want to set up local Ollama models for this?**

### If no
Skip this entire section. Delete the Ollama paragraphs from your copy of `CLAUDE.md` and drop `notes/local-ollama-models.md`. Everything else works fine without it.

### If yes
1. **Install Ollama** from [ollama.com](https://ollama.com).
2. **Decide where the model store lives.** Models are large (a 27B model is tens of GB) and the default location is on your system drive (`%USERPROFILE%\.ollama` on Windows). If your system drive is tight on space, relocate the store to a bigger drive — the original setup used `<YOUR_DRIVE>:\ollama` for exactly this reason. On Windows, set the `OLLAMA_MODELS` environment variable to your chosen path before pulling models; other platforms have equivalent env-var or symlink approaches.
3. **Pull at least one general-purpose instruct model** (e.g. `ollama pull qwen2.5:7b-instruct` or a similar ~7–9B instruct model — small enough to run fast, good enough to summarize). The original inventory in `notes/local-ollama-models.md` shows one possible spread: a heavy 27B for best quality, mid-size 7–9B models for speed/reasoning/code, and one vision-capable model (`llava:7b`) — treat that list as inspiration, not a shopping list.
4. **Learn the usage pattern:** pipe a file in, get a digest out —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Pipe the file; don't stuff long prompts into the argument.)
5. **Know the one hard rule:** local-model output is **never ground truth**. It's lossy compression for low-stakes text. If a decision depends on the content, the paid model reads the original — always.

This is 100% optional and skippable. It exists purely to shave token costs on bulk text.

</details>

---

## Compatibility with other AI coding tools

Two files ship instead of one: `CLAUDE.md` (Claude Code-only) and `AGENTS.md` (the portable subset — [agents.md](https://agents.md), also read by Codex, Cursor, Gemini CLI, Copilot).

<details>
<summary>How the two interact</summary>

This template is built specifically for **Claude Code**, but as of Claude Code 2.1.277 (September 2026), Claude Code itself also reads [`AGENTS.md`](https://agents.md) as a fallback when a project has no `CLAUDE.md` — the same convention Codex CLI, Cursor, Gemini CLI, and GitHub Copilot already read. That's why this template ships two files instead of one:

- **`global-config/CLAUDE.md`** — the full setup: cost-aware model routing, `/plan-pro`, the skill catalog, hooks, subagent routing, everything that only means something inside Claude Code.
- **`global-config/AGENTS.md`** — the portable subset (coding style, git workflow, testing, code review, security checklist, common patterns) with every Claude Code-only mechanism stripped out. Drop it into any project and any AGENTS.md-aware agent picks it up, Claude Code included.

If a project has **both** files, Claude Code reads `CLAUDE.md` and ignores `AGENTS.md` — the two aren't merged, so don't expect the Claude Code-specific rules to apply just because AGENTS.md is also present. Other tools (Codex, Cursor, etc.) only ever read `AGENTS.md`; they have no concept of `CLAUDE.md`, the `Skill` tool, `settings.json` hooks, or subagent definitions, so those stay Claude Code-only no matter what.

What else *can* be adapted by hand if you want more than the AGENTS.md subset:
- Each skill under `global-config/skills/<name>/SKILL.md` is just a markdown instruction file. You can paste one into another tool's custom instructions, but you lose automatic triggering, and any bundled scripts assume a shell the tool can actually run.
- Hooks (`settings.json`) and the subagent files (`agents/*.md`) are Claude Code-only — there's no equivalent to port them to.

If you use Codex/Cursor/Gemini CLI day to day, `AGENTS.md` gets you the engineering-discipline rules out of the box; the rest of the repo (skills, hooks, the .docx fixes) is still there as reference material to copy/paste from.

</details>
