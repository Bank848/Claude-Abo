**English** | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=A%20portable%20snapshot%20of%20one%20person's%20Claude%20Code%20setup&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="Claude Code Clone Template banner" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=45+curated+skills+with+full+provenance;Cost-aware+Sonnet+%2F+Opus+%2F+Haiku+model+routing;Git+safety+hooks+%2B+%2Fplan-pro+workflow;Cross-project+second-brain+vault" alt="rotating feature highlights"/>

</div>

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

<details>
<summary><b>See all 45 skills, grouped by category</b> (click to expand)</summary>

**Engineering process & workflow (15)**

| Skill | What it does |
|---|---|
| `debug-mantra` | Four-step debugging discipline (reproduce → trace → falsify → cross-reference) recited before proposing any fix. |
| `poka-yoke` *(self-authored)* | Mistake-proofing review — makes a bad state impossible/obvious at the source instead of catching it after the fact. |
| `post-mortem` | Writes the canonical root-cause writeup after a bug is fixed and validated. |
| `scrutinize` | Outsider-perspective review of a plan/PR/diff — checks intent first, then traces the real code path. |
| `shipping-a-branch` *(self-authored)* | Drives commit → push → PR → review → merge end to end, confirming each risky step separately. |
| `plan-pro` *(self-authored)* | Implementation-plan writer with a spawned multi-agent review loop and an HTML before/after output. |
| `dependency-audit` | Checks project dependencies for known CVEs and supply-chain risks. |
| `secrets-audit` | Scans source, git history, and infra for leaked credentials and weak secrets-management posture. |
| `prompt-injection` | Audits apps/agents for prompt-injection and LLM permission-boundary vulnerabilities. |
| `decide` | Structured decision workflow (37signals-style question set) that also archives the rationale. |
| `unstuck` | Lateral-thinking technique bank for cracking a roadblock instead of reporting "not possible". |
| `teach` | Teaches the user a new concept/skill within the current workspace. |
| `wait-what` | Flags a message that didn't land and re-pitches it. |
| `skillify` | Creates, adapts, or updates a Claude Code skill (from chat, video, dump, or an external repo). |
| `wizard` | Generates an interactive bash wizard for steps only a human can perform (credentials, dashboards, migrations). |

**Design & UI (11)**

| Skill | What it does |
|---|---|
| `banner-design` | Designs social/ad/web/print banners across many art-direction styles. |
| `design` | Broad design skill — logos, CIP mockups, slides, banners, icons, social photos. |
| `design-system` | Three-layer design-token architecture (primitive → semantic → component) plus slide generation. |
| `deslop-defaults` *(adapted)* | Structural defaults that stop AI-generated UI from looking averaged-out (z-index, accent restraint, states). |
| `hallmark` | Anti-AI-slop design skill for greenfield pages, redesigns, and design extraction from URLs/screenshots. |
| `ui-styling` | Builds accessible UI with shadcn/ui, Tailwind, and dark-mode-aware theming. |
| `ui-ux-pro-max` | Searchable UI/UX database — styles, palettes, font pairings, UX guidelines, motion presets, chart types. |
| `mobbin-references` | Pulls real-app reference screenshots (onboarding, paywalls, empty states...) before a UI is designed. |
| `dembrandt` *(wrapper)* | Extracts a live website's actual design tokens (colors, type, spacing) via DOM/CSS inspection. |
| `image` | Generates/edits/optimizes marketing images (heroes, social graphics, mockups, OG images). |
| `slides` | Builds strategic HTML presentations with Chart.js and design-token theming. |

**Marketing, content & brand (13)**

| Skill | What it does |
|---|---|
| `brand` | Brand voice, visual identity, messaging frameworks, and consistency checks. |
| `community-marketing` | Community-led growth strategy (Discord/Slack/forum, ambassador programs, advocacy). |
| `content-strategy` | Decides what content to create — topic clusters, editorial calendars, content pillars. |
| `copy-editing` | Edits/tightens/refreshes existing marketing copy. |
| `copywriting` | Writes new marketing copy for landing/pricing/feature/about pages. |
| `launch` | Plans a product launch, feature announcement, or go-to-market checklist. |
| `management-talk` | Rewrites engineer-to-engineer writing for leadership, shaped to the target channel (Slack/email/standup). |
| `marketing-council` | Simulated advisory board of named marketers debating a positioning question. |
| `marketing-ideas` | Growth/marketing idea generator for SaaS and software products. |
| `marketing-psychology` | Applies behavioral-science principles (anchoring, social proof, framing) to marketing decisions. |
| `pricing` | Pricing/packaging strategy and pricing-page audits. |
| `product-marketing` | Builds the reusable product/audience/positioning context doc other marketing skills reference. |
| `social` | Social content creation, scheduling, repurposing, and social listening across platforms. |

**Research & knowledge management (6)**

| Skill | What it does |
|---|---|
| `deep-research` | Multi-source, multi-pass research brief with citations, contradictions, and gaps. |
| `graphify` *(wrapper, self-authored)* | Turns any input (code/docs/papers/images) into a clustered knowledge graph with an audit report. |
| `grilling` | Interviews the user relentlessly to stress-test a plan before building it. |
| `second-brain` | Capture/compile/query/lint/connect workflow for a personal Obsidian-style knowledge vault. |
| `watch-video` | Extracts transcript/visual/multimodal content from any yt-dlp-supported video source. |
| `markitdown` *(wrapper)* | Converts PDFs/slides/sheets/audio/HTML/etc. into clean Markdown for LLM/RAG use. |

Full provenance (source repo, adoption date, self-authored vs. adopted vs. adapted) for every entry is in `global-config/tools/skill-update-check/sources.json`; upstream credits are in `ATTRIBUTION.md`.

</details>

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

## A note on subscription plan and the Fable 5.1 tier

The model-routing ladder in `CLAUDE.md` tops out at a `fable-medium` subagent — a deliberately expensive, rarely-used escalation tier for the hardest problems. The original owner is on a **Max** plan, where that model is available. If you're on **Pro** (or any plan without Fable 5.1 access), spawning `fable-medium` will just fail.

Before copying `CLAUDE.md` as-is, check which plan you're on. If you don't have Fable 5.1:
- Delete the `fable-medium` paragraphs and the "สุดบันได" (top-of-ladder) bullet from the model-routing section.
- Change the ladder's ceiling to stop at `opus` — the routing logic (escalate to Opus on hard/high-stakes work) still holds, it just won't have a level above Opus to escalate to.
- Drop `global-config/agents/fable-medium.md` from what you copy into `~/.claude/agents/`.

`/adopt` asks this as part of its interview and does this edit for you; if you're copying files by hand instead, do it yourself so Claude doesn't keep trying to spawn a subagent your plan can't reach.

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

## Compatibility with other AI coding tools

This template is built specifically for **Claude Code**. The mechanisms it relies on — an auto-loaded `CLAUDE.md`, the `Skill` tool, `settings.json` hooks, subagent definitions — are Claude Code features, not a portable file format. Pointing Codex CLI, ChatGPT, Antigravity, Cursor, or any other tool at this repo won't make it "pick up" the skills or rules automatically; nothing here works out of the box outside Claude Code.

What *can* be adapted by hand:
- `global-config/CLAUDE.md` is plain text — copy the parts you want into an `AGENTS.md` (which Codex CLI and a few other tools read) or a custom system prompt. Strip anything that references Claude Code-specific mechanisms (spawn_task, the Skill tool, subagent routing) first — those won't mean anything elsewhere.
- Each skill under `global-config/skills/<name>/SKILL.md` is just a markdown instruction file. You can paste one into another tool's custom instructions, but you lose automatic triggering, and any bundled scripts assume a shell the tool can actually run.
- Hooks (`settings.json`) and the subagent files (`agents/*.md`) are Claude Code-only — there's no equivalent to port them to.

If you use Codex/ChatGPT/Antigravity day to day, this repo is still useful as *reference material* (the writing rules, the .docx fixes, the git-safety hook logic) — just expect to copy/paste the relevant parts rather than drop the folder in and have it work.

---

## Caveat: this is one person's setup

This snapshot comes from a specific workflow: a Thai-English bilingual user on a Windows machine. That shows everywhere — the bilingual sections in CLAUDE.md, the PowerShell-vs-Bash gotchas.

Adopt what's useful, discard what isn't. None of this is prescriptive best practice — it's what worked for one person, written down well enough to be portable. The real value is the *shape* of the system (routing by cost, offloading heavy work, one home per piece of knowledge, safety gates on destructive commands), not any individual rule.
