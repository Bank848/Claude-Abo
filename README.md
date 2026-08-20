English | **[ภาษาไทย](README.th.md)**

# Claude Code Clone Template

A portable snapshot of one person's Claude Code setup — global instructions, engineering rules, **45 curated skills** (7 self-authored — 3 written from scratch, 4 self-written wrappers around third-party tools — 1 adapted from an upstream skill, the rest adopted from upstream repos, all with per-skill provenance in `sources.json`), real memory examples, a skill-provenance manifest, and a cross-project knowledge vault — packaged so a fresh Claude Code instance (or the person setting one up) can bootstrap the same workflow habits and capabilities on a new machine. This is a **template to adapt, not a config to run as-is**: personal identifiers have been scrubbed and replaced with placeholders, and several sections only make sense if you also adopt the tools they describe.

## Getting started (quickstart)

**Shortcut:** clone the repo, open it in Claude Code, and run `/adopt` — it interviews you (which optional pieces you want, plugin list, target paths) and does steps 2-6 and 8-9 below for you, checking off progress in a resumable journal file as it goes. Step 7 (installing the plugin ecosystems themselves) is deliberately out of `/adopt`'s scope — that one's still on you. The manual steps below are what `/adopt` automates, and are also there for anyone who'd rather do it by hand or review exactly what changes before running it.

1. **Clone the repo** to anywhere convenient on the target machine.
2. **Decide the one optional piece now** — answer yes/no, since it determines what you delete in step 5: Local AI (Ollama) pre-compression. See the "Optional: ___" section below for details.
3. **Copy `global-config/CLAUDE.md`, `agents/*.md`, `hooks/block-dangerous-git.py`, `skills/*`, and `tools/`** to your own `~/.claude/` (merge or replace — your call). These are what make the routing rules, git safety gate, skill catalog, and update checker actually work, not just read as prose. **Before copying `CLAUDE.md`, rewrite its "Installed Plugins" section to list only what you actually have installed** — the original owner's copy claims specific plugins are enabled; carrying that over verbatim makes your Claude lie about available tooling.
4. **Merge `global-config/settings.example.json`** into your `~/.claude/settings.json` (after replacing `<YOUR_HOME>`; on macOS/Linux also change the hook command's `py` launcher to `python3`, that entry is Windows-specific as shipped).
5. **Delete Ollama if you said "no" in step 2.** Fast pass: the Ollama paragraphs in your CLAUDE.md copy + `notes/local-ollama-models.md` + `tools/ollama/`.
6. **Find-and-replace the placeholders** in everything you kept — see step 8 of "How to adopt this" below for the full list.
7. **Install the plugin ecosystems referenced** (superpowers, ecc, etc.) — see "What you'll still need to install separately" below.
8. **Optionally copy `notes/`** into your own second-brain vault location, and **`memory-examples/`** into your Claude Code auto-memory folder for the relevant project.
9. **Start a Claude Code session and verify** it picked up the new CLAUDE.md — e.g. ask for an implementation plan and check that `/plan-pro` gets invoked, or ask about model routing and see if the cost ladder comes back.

The rest of this README explains each piece in detail.

## What's in here

```
claude-clone-template/
├── README.md
├── LICENSE                                # MIT license for this repo's own content
├── ATTRIBUTION.md                         # Credits for the upstream repos the third-party skills were adopted from
├── .claude/commands/adopt.md              # Run `/adopt` in this repo to interview + auto-apply the steps below
├── global-config/
│   ├── CLAUDE.md                          # Global instruction file (~/.claude/CLAUDE.md equivalent)
│   ├── settings.example.json              # Sanitized ~/.claude/settings.json — hooks, plugins, model default
│   ├── agents/                            # 3 pinned-model subagent definitions (opus, haiku-batch, fable-medium)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate that asks before risky git commands
│   ├── rules/ecc-common/                  # 10 engineering-discipline rule files (ecc plugin ecosystem)
│   ├── skills/                            # 45 curated skill folders (the actual SKILL.md instructions, not just an index — see sources.json for provenance)
│   ├── SKILLS_INDEX.md                    # Personal index of installed skills/plugins + when to use which
│   ├── memory-examples/                   # 7 real auto-memory entries showing the memory system's format/patterns
│   ├── templates/                         # 2 starter templates to copy into a new repo (project-CLAUDE.md, conventions.md)
│   └── tools/
│       ├── skill-update-check/
│       │   ├── check.ps1                  # Weekly update checker — reads sources.json from this same folder
│       │   └── sources.json               # Real provenance manifest: 45 personal skills + 3 pip + 2 npm + 1 binary tool
│       └── ollama/ollama-digest.ps1       # On-demand local-model pre-digest helper (see the Ollama section below)
└── notes/                                 # 3 notes: a personal cross-project "second brain" vault (example content)
```

### `global-config/CLAUDE.md`
The heart of the setup. It encodes:

- **Cost-aware model routing** — main loop on Sonnet as orchestrator, delegating to Haiku/Opus/Fable subagents by task difficulty, with hard rules about who reads raw files vs. who reads conclusions.
- **Heavy-execution offloading** — spawning big jobs into separate sessions instead of bloating (and billing) the current one.
- **Planning workflow** — `/plan-pro` as the default planner.
- **Second-brain vault convention** — a single rule ("is it tied to one repo?") deciding what lives in the vault vs. in a repo's docs/ADRs.
- **Git safety hook** — a PreToolUse gate that asks before destructive git commands.
- **Shell gotchas** — Bash tool vs. PowerShell tool heredoc syntax rules (Windows-specific pain, learned the hard way).
- **Context self-monitoring** — when Claude should proactively suggest `/compact`.
- **Anti-AI-tell writing rules** — a full Thai + English ruleset for making drafted text read as human-written (vocab to avoid, structural patterns, register matching); the largest, most broadly reusable piece in the file. Backing detail lives in `memory-examples/`.
- **PR draft-first default**, **ask-before-scheduling cron/cloud agents**, **terse narration during long-running commands**, a **claude-in-chrome shared-tab-group gotcha** for parallel sessions, and a **proactive Supabase RLS check** for any project using Supabase.

### `global-config/rules/ecc-common/`
General engineering discipline from the ecc (everything-claude-code) plugin ecosystem: TDD workflow, immutability, commit format, security checklist, code-review severity levels, agent delegation. Only useful if you also run ecc (see "What you'll still need to install" below).

### `global-config/skills/`
45 curated `SKILL.md` folders (plus supporting scripts/reference/data files where a skill has them) covering writing/marketing craft (copywriting, copy-editing, hallmark, marketing-council, pricing...), engineering process (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), design (design-system, ui-ux-pro-max, banner-design, mobbin-references...), and meta-skills for managing Claude Code itself (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...). `poka-yoke`, `plan-pro`, and `shipping-a-branch` are self-authored from scratch; `graphify`, `dembrandt`, `markitdown`, and `mobbin-references` are self-written wrapper skills whose SKILL.md is original but whose underlying tools are third-party (credited in `ATTRIBUTION.md` and version-tracked in `sources.json`); `deslop-defaults` is adapted (harvested from `ibelick/ui-skills` and rewritten stack-agnostic); the rest are adopted from upstream repos — see `sources.json` for per-skill provenance and `ATTRIBUTION.md` for upstream credits. These are genuinely reusable prompt-engineering artifacts, not just descriptions of skills — copy them into `~/.claude/skills/` and they work immediately.

### `global-config/memory-examples/`
7 real entries from the owner's Claude Code auto-memory system (not project-specific facts — portable "how I work" habits): a naming-convention disambiguation for cross-session messaging, the local-Ollama-as-pre-compression pattern, a rule about what "update the skill notebook" actually means operationally, a shell-quoting gotcha (`\b` silently becoming a backspace byte), a feedback entry on how aggressively to trim context bloat, and the full backing detail (vocab tables + before/after examples) for the anti-AI-tell writing rules in CLAUDE.md, in both Thai and English. These exist to show the *shape* of a good memory entry (rule + why + how-to-apply) as much as their specific content — see `global-config/rules/ecc-common/` for how memory fits into the broader workflow, and CLAUDE.md's "จำ/บัญญัติ" section for the local-vs-global memory distinction this owner uses.

### `global-config/tools/skill-update-check/sources.json`
The owner's actual skill/tool adoption manifest — real provenance data (source repo URLs, install notes, version history) for all 45 personal skills (including the self-authored and adapted ones) plus 3 pip packages, 2 npm packages, and 1 binary tool. Paired with `check.ps1`, this is what lets a `claude-clone-template` adopter track upstream updates to the skills they copied into `~/.claude/skills/`, the same way the original owner does. Update `last_seen_commit` values are mostly `unknown`/stale from the recipient's perspective until they run `check.ps1 -Ack` once to establish their own baseline.

### `global-config/templates/`
Two small starter files (`project-CLAUDE.md`, `conventions.md`) to copy into a new repo on first setup — a ≤45-line "router" project CLAUDE.md and a conventions/green-gate template. Each has a comment block with a fill-in-the-blank PRESET for the stack you're bootstrapping (currently just a Python-web example); add your own preset the same way if your stack needs one.

### `notes/`
Example content from the owner's Obsidian second-brain vault: local Ollama model inventory, bookmarked repos, and misc reference notes. These show *what kind of thing* belongs in a cross-project vault — they are not universal must-haves. Keep the structure idea, replace the content with your own over time.

## How to adopt this

1. **Copy `global-config/CLAUDE.md`** into your own `~/.claude/CLAUDE.md`. Merge it with what you already have, or replace outright — your call. Read it first; delete sections that don't apply to you. **Rewrite the "Installed Plugins" section before you do anything else with this file** — it currently asserts specific plugins (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) are installed and enabled, and tells Claude not to mention installing them. That's true for the original owner, not for you. Replace it with your own actual plugin list, or delete it until you've installed something.
2. **Copy `global-config/agents/*.md`** into `~/.claude/agents/` and **`global-config/hooks/block-dangerous-git.py`** into `~/.claude/hooks/`. These are what make the model-routing rules and the git safety gate in CLAUDE.md actually functional, rather than just prose.
3. **Copy `global-config/skills/*`** into `~/.claude/skills/`. This is the bulk of the actual value — 45 working skill folders, not just descriptions of them.
4. **Merge `global-config/settings.example.json`** into your own `~/.claude/settings.json` (replace `<YOUR_HOME>` with your real home path first). Merge, don't overwrite, if you already have a settings.json — take the `hooks.PreToolUse` entry and whatever else you want from `enabledPlugins`. The shipped hook command uses the Windows `py` launcher; on macOS/Linux, change it to `python3` first.
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

## Optional: Local AI (Ollama) pre-compression

The original setup uses local Ollama models as a **free, lossy pre-compression tier** — piping long low-stakes text (logs, verbose docs) through a local model to digest it *before* it enters a paid model's context. It sits **below Haiku** in the cost ladder and is not a routing tier: no tool access, no repo context, text in / text out only. It saves money; it adds no capability. Nothing else in this repo depends on it.

**So, a question you need to answer for yourself: do you want to set up local Ollama models for this?**

### If no
Skip this entire section. Delete the Ollama paragraphs from your copy of `CLAUDE.md` and drop `notes/local-ollama-models.md`. Everything else works fine without it.

### If yes
1. **Install Ollama** from [ollama.com](https://ollama.com).
2. **Decide where the model store lives.** Models are large (a 27B model is tens of GB) and the default location is on your system drive (`%USERPROFILE%\.ollama` on Windows). If your system drive is tight on space, relocate the store to a bigger drive — the original setup used `D:\ollama` for exactly this reason. On Windows, set the `OLLAMA_MODELS` environment variable to your chosen path before pulling models; other platforms have equivalent env-var or symlink approaches.
3. **Pull at least one general-purpose instruct model** (e.g. `ollama pull qwen2.5:7b-instruct` or a similar ~7–9B instruct model — small enough to run fast, good enough to summarize). The original inventory in `notes/local-ollama-models.md` shows one possible spread: a heavy 27B for best quality, mid-size 7–9B models for speed/reasoning/code, and one vision-capable model (`llava:7b`) — treat that list as inspiration, not a shopping list.
4. **Learn the usage pattern:** pipe a file in, get a digest out —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (Pipe the file; don't stuff long prompts into the argument.)
5. **Know the one hard rule:** local-model output is **never ground truth**. It's lossy compression for low-stakes text. If a decision depends on the content, the paid model reads the original — always.

This is 100% optional and skippable. It exists purely to shave token costs on bulk text.

---

## Caveat: this is one person's setup

This snapshot comes from a specific workflow: a Thai-English bilingual user on a Windows machine. That shows everywhere — the bilingual sections in CLAUDE.md, the PowerShell-vs-Bash gotchas.

Adopt what's useful, discard what isn't. None of this is prescriptive best practice — it's what worked for one person, written down well enough to be portable. The real value is the *shape* of the system (routing by cost, offloading heavy work, one home per piece of knowledge, safety gates on destructive commands), not any individual rule.
