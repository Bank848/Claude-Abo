**English** | [ภาษาไทย](README.th.md) | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

# Claude-Abo

A skill notebook for Claude Code: each skill is listed with its source, license and status, and Claude picks the right one itself from the skill's one-line description, so there is no command to type.
That line also costs context every session. One command estimates the cost in tokens (next to the real `/context` figure) and lists what to cut; the catalog has 68 skills with license, test date and known issues for each.
`npx github:Bank848/Claude-Abo audit`  ·  [Site](https://bank848.github.io/Claude-Abo/)  ·  [Catalog](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#caveat-this-is-one-persons-setup)

<p align="center"><img src="assets/audit-demo.gif" alt="Terminal recording of the audit command on a sample setup: estimated tokens, what to cut first, safety checklist" width="820"/></p>

## Claude picks, you don't

Claude reads each skill's one-line `description` and loads the skill whose description fits your request. Write that line as a trigger: say when to use the skill.

- **Prompt (illustrative):** "Write the launch post for this project."
- **Skill that fits:** `english-writing-anti-ai-tell`, described as "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **Why:** the post is English text written for readers, which is what the description names.

This is an illustration, not a measurement. The description fits the task, and that fit is what Claude matches on; it does not prove the description alone triggers the skill. The audit flags descriptions that are too long or too short to match.

## What the audit checks

- **Fixed context:** CLAUDE.md, skill descriptions, custom agents and MCP tool lists, summed as an estimate in tokens. Compare it with `/context`; an estimate is not a measurement ([method](docs/audit-method.md#what-is-counted)).
- **Listing cap:** whether your skill descriptions fit the budget Claude Code reserves for the skill list ([method](docs/audit-method.md#estimate-and-listing-cap)).
- **Usage:** which skills you have no record of calling in recent sessions, so you can decide what to cut (`--usage`).
- **Safety hook:** runs your user-level hooks against a fake `git push --force` and a harmless control command (`--probe-hooks`).
- **Sharing:** `--export` renames everything that is not in the catalog and refuses if it finds an email, IP or home path.

Details, limits and the checklist: [docs/audit-method.md](docs/audit-method.md).

## Use the template

1. Clone the repo and open it in Claude Code.
2. Run `/adopt`. It interviews you, copies only the pieces you pick and records progress in a journal.
3. Prefer to do it by hand? See the [guide](docs/guide.md).

Nothing here runs as-is: read it, then adapt it. The steps assume Claude Code; `global-config/AGENTS.md` is the portable subset for other agents.

## Skills

<details>
<summary>Every bundled skill and where the rest come from</summary>

<!-- gen:skills-count-2:start -->68<!-- gen:skills-count-2:end --> curated `SKILL.md` folders (plus supporting scripts/reference/data files where a skill has them) covering writing/marketing craft (copywriting, copy-editing, hallmark, marketing-council, pricing...), engineering process (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), design (design-system, ui-ux-pro-max, banner-design, mobbin-references...), and meta-skills for managing Claude Code itself (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...). `poka-yoke`, `plan-pro`, and `shipping-a-branch` are self-authored from scratch; `graphify`, `dembrandt`, `markitdown`, and `mobbin-references` are self-written wrapper skills whose SKILL.md is original but whose underlying tools are third-party (credited in `ATTRIBUTION.md` and version-tracked in `sources.json`); `deslop-defaults` is adapted (harvested from `ibelick/ui-skills` and rewritten stack-agnostic); the rest are adopted from upstream repos — see `sources.json` for per-skill provenance and `ATTRIBUTION.md` for upstream credits. These are genuinely reusable prompt-engineering artifacts, not just descriptions of skills — copy them into `~/.claude/skills/` and they work immediately.

Every bundled skill is listed below. The tables are generated from `catalog/skills.json` (run `npm run gen`); do not edit them by hand.

<!-- gen:skills-table:start -->
**Engineering (13)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `domain-modeling` | Pins down domain terms and records ADRs while a plan is being stress-tested. | adopted | MIT | experimental | 54 |
| `git-retro` | Turns recent git history into a short retrospective of what changed and what keeps breaking. | adapted | MIT | experimental | 95 |
| `github-pr-review-draft` | Pending-review PR workflow: findings wait in the GitHub UI, nothing posts silently. | self-authored | MIT | experimental | 64 |
| `grill-with-docs` | Stress-tests a plan against the repo docs and records decisions as ADRs. | adopted | MIT | experimental | 27 |
| `plan-pro` | Implementation-plan writer with a spawned multi-agent review loop and an HTML before/after output. | self-authored | MIT | experimental | 107 |
| `poka-yoke` | Mistake-proofing review — makes a bad state impossible/obvious at the source instead of catching it after the fact. | self-authored | MIT | experimental | 136 |
| `ponytail` | Writes the least code that is still correct: climbs a ladder before adding anything. | adapted | MIT | experimental | 125 |
| `project-bootstrap` | One-shot repo scaffold: thin CLAUDE.md router, docs/log/, docs/adr/, conventions. | self-authored | MIT | experimental | 131 |
| `pruning-branches` | Periodic branch and worktree cleanup with a survey first and a log entry after. | self-authored | MIT | experimental | 50 |
| `review-specialists` | Splits a code review into specialist passes (security, performance, testing, API contract, migration and more). | adapted | MIT | experimental | 113 |
| `shipping-a-branch` | Drives commit → push → PR → review → merge end to end, confirming each risky step separately. | self-authored | MIT | experimental | 58 |
| `test-audit` | Rates which tests are worth their cost: a value bar, a low-value catalog and a regression-proof rule. | adapted | MIT | experimental | 100 |
| `wizard` | Generates an interactive bash wizard for steps only a human can perform (credentials, dashboards, migrations). | adopted | MIT | experimental | 79 |

**Design (11)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `banner-design` | Designs social/ad/web/print banners across many art-direction styles. | adopted | MIT | experimental | 124 |
| `dembrandt` | Extracts a live website's actual design tokens (colors, type, spacing) via DOM/CSS inspection. | wrapper | MIT | experimental | 141 |
| `design` | Broad design skill — logos, CIP mockups, slides, banners, icons, social photos. | adopted | MIT | experimental | 154 |
| `design-system` | Three-layer design-token architecture (primitive → semantic → component) plus slide generation. | adopted | MIT | experimental | 70 |
| `deslop-defaults` | Structural defaults that stop AI-generated UI from looking averaged-out (z-index, accent restraint, states). | adapted | MIT | experimental | 112 |
| `hallmark` | Anti-AI-slop design skill for greenfield pages, redesigns, and design extraction from URLs/screenshots. | adopted | MIT | experimental | 65 |
| `image` | Generates/edits/optimizes marketing images (heroes, social graphics, mockups, OG images). | adopted | MIT | experimental | 205 |
| `mobbin-references` | Pulls real-app reference screenshots (onboarding, paywalls, empty states...) before a UI is designed. | wrapper | MIT | experimental | 86 |
| `slides` | Builds strategic HTML presentations with Chart.js and design-token theming. | adopted | MIT | experimental | 35 |
| `ui-ux-pro-max` | Searchable UI/UX database — styles, palettes, font pairings, UX guidelines, motion presets, chart types. | adopted | MIT | experimental | 149 |
| `web-motion` | Restrained motion for web pages: token values, a motion budget and a scroll-reveal recipe. | adapted | Apache-2.0 | experimental | 130 |

**Marketing (12)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `brand` | Brand voice, visual identity, messaging frameworks, and consistency checks. | adopted | MIT | experimental | 46 |
| `community-marketing` | Community-led growth strategy (Discord/Slack/forum, ambassador programs, advocacy). | adopted | MIT | experimental | 158 |
| `content-strategy` | Decides what content to create — topic clusters, editorial calendars, content pillars. | adopted | MIT | experimental | 165 |
| `copy-editing` | Edits/tightens/refreshes existing marketing copy. | adopted | MIT | experimental | 149 |
| `copywriting` | Writes new marketing copy for landing/pricing/feature/about pages. | adopted | MIT | experimental | 189 |
| `launch` | Plans a product launch, feature announcement, or go-to-market checklist. | adopted | MIT | experimental | 138 |
| `marketing-council` | Simulated advisory board of named marketers debating a positioning question. | adopted | MIT | experimental | 205 |
| `marketing-ideas` | Growth/marketing idea generator for SaaS and software products. | adopted | MIT | experimental | 141 |
| `marketing-psychology` | Applies behavioral-science principles (anchoring, social proof, framing) to marketing decisions. | adopted | MIT | experimental | 150 |
| `pricing` | Pricing/packaging strategy and pricing-page audits. | adopted | MIT | experimental | 217 |
| `product-marketing` | Builds the reusable product/audience/positioning context doc other marketing skills reference. | adopted | MIT | experimental | 138 |
| `social` | Social content creation, scheduling, repurposing, and social listening across platforms. | adopted | MIT | experimental | 252 |

**Research (8)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `agent-reach` | Web research across sources an agent can reach. | adopted | MIT | experimental | 298 |
| `browserclaw` | Drives a signed-in agent browser (BrowserOS integration instructions). | adopted | MIT | experimental | 126 |
| `deep-research` | Multi-source, multi-pass research brief with citations, contradictions, and gaps. | adopted | MIT | experimental | 221 |
| `graphify` | Turns any input (code/docs/papers/images) into a clustered knowledge graph with an audit report. | wrapper | MIT | experimental | 29 |
| `grilling` | Interviews the user relentlessly to stress-test a plan before building it. | adopted | MIT | experimental | 51 |
| `markitdown` | Converts PDFs/slides/sheets/audio/HTML/etc. into clean Markdown for LLM/RAG use. | wrapper | MIT | experimental | 140 |
| `second-brain` | Capture/compile/query/lint/connect workflow for a personal Obsidian-style knowledge vault. | adopted | MIT | experimental | 245 |
| `watch-video` | Extracts transcript/visual/multimodal content from any yt-dlp-supported video source. | adopted | MIT | experimental | 234 |

**Writing (4)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `english-writing-anti-ai-tell` | Checklist that keeps English drafts from reading as AI-written. | self-authored | MIT | experimental | 74 |
| `i-have-adhd` | Output style for readers who want the next action first; ships an optional always-on hook. | adopted | MIT | experimental | 61 |
| `thai-no-quote-emphasis` | Rule against quote marks for emphasis in Thai text. | self-authored | MIT | workflow-specific | 38 |
| `thai-writing-anti-ai-tell` | Checklist that keeps Thai drafts from reading as AI-written. | self-authored | MIT | workflow-specific | 94 |

**Documents (4)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `close-out-log` | End-of-task ritual: append a dated entry to docs/log/ so the next session inherits the reasons. | self-authored | MIT | experimental | 147 |
| `docx-human-sounding-report` | Fixes for a .docx report that should not read as machine-made. | self-authored | MIT | workflow-specific | 54 |
| `docx-python-docx-justify` | python-docx: never justify formulas or code blocks that break their own lines. | self-authored | MIT | workflow-specific | 49 |
| `docx-th-sarabun-sizing` | Thai Sarabun sizing scale for Word, fixing the base style instead of per-run sizes. | self-authored | MIT | workflow-specific | 56 |

**Meta (managing Claude Code itself) (10)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `codeburn-cost-check` | Breaks down AI spend per project and model from local usage data. | wrapper | MIT | experimental | 75 |
| `council-deliberate` | Adds an anonymized cross-exam round and a hand-computed weighted tally to a four-voice decision council. | self-authored | MIT | experimental | 209 |
| `decide` | Structured decision workflow (37signals-style question set) that also archives the rationale. | adopted | MIT | experimental | 214 |
| `instruction-lint` | Audits auto-loaded instruction files for byte bloat and says which rules can stop being resident. | self-authored | MIT | experimental | 93 |
| `memory-lint` | Read-only health check of a project's memory files. | self-authored | MIT | experimental | 90 |
| `prompt-master` | Writes and tunes prompts for other AI tools. | adopted | MIT | experimental | 84 |
| `skillify` | Creates, adapts, or updates a Claude Code skill (from chat, video, dump, or an external repo). | adopted | MIT | experimental | 318 |
| `teach` | Teaches the user a new concept/skill within the current workspace. | adopted | MIT | experimental | 16 |
| `unstuck` | Lateral-thinking technique bank for cracking a roadblock instead of reporting "not possible". | adopted | MIT | experimental | 309 |
| `wait-what` | Flags a message that didn't land and re-pitches it. | adopted | MIT | experimental | 14 |

**Security (6)**

| Skill | What it does | Origin | License | Status | ~Tokens |
|---|---|---|---|---|---|
| `dependency-audit` | Checks project dependencies for known CVEs and supply-chain risks. | adopted | MIT | experimental | 112 |
| `git-guardrails-claude-code` | Blocks dangerous git commands (push, force, clean, branch deletion) with a hook. | adopted | MIT | experimental | 61 |
| `prompt-injection` | Audits apps/agents for prompt-injection and LLM permission-boundary vulnerabilities. | adopted | MIT | experimental | 124 |
| `repo-security-posture` | Phased security review of an unfamiliar repo before you run or install anything from it. | adapted | MIT | experimental | 82 |
| `secrets-audit` | Scans source, git history, and infra for leaked credentials and weak secrets-management posture. | adopted | MIT | experimental | 136 |
| `supabase-rls-safety-check` | Proactive Row Level Security and anon-key audit for Supabase projects. | self-authored | MIT | experimental | 49 |

**Not bundled, install from upstream (8)**

| Skill | Upstream | Install |
|---|---|---|
| `archify` | [tt-a1i/archify](https://github.com/tt-a1i/archify/tree/3ca198d867ce4b616332f846ff66e5c8e5e60f95/archify) | see the upstream README for install steps |
| `debug-mantra` | [thananon/9arm-skills](https://github.com/thananon/9arm-skills/tree/a1fc303b274ed06c32d405ba5a6db00ded6e5663/skills/engineering/debug-mantra) | npx skills add thananon/9arm-skills |
| `diagram-design` | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design/tree/0eeda75a708f419560d5e032693618bb9954f17b/skills/diagram-design) | see the upstream README for install steps |
| `management-talk` | [thananon/9arm-skills](https://github.com/thananon/9arm-skills/tree/a1fc303b274ed06c32d405ba5a6db00ded6e5663/skills/productivity/management-talk) | npx skills add thananon/9arm-skills |
| `post-mortem` | [thananon/9arm-skills](https://github.com/thananon/9arm-skills/tree/a1fc303b274ed06c32d405ba5a6db00ded6e5663/skills/engineering/post-mortem) | npx skills add thananon/9arm-skills |
| `scroll-craft` | [nateherkai/scroll-craft](https://github.com/nateherkai/scroll-craft/tree/75d81f74e83692add18cd7a8a8e078b8a887a579/plugins/nateherk-design/skills/scroll-craft) | see the upstream README for install steps |
| `scrutinize` | [thananon/9arm-skills](https://github.com/thananon/9arm-skills/tree/a1fc303b274ed06c32d405ba5a6db00ded6e5663/skills/engineering/scrutinize) | npx skills add thananon/9arm-skills |
| `ui-styling` | [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills/tree/80113d86bc4407f105af40a2c4ea58194f7c370a/.claude/skills/ui-styling) | /plugin marketplace add mrgoonie/claudekit-skills (then install the plugin that contains ui-styling) |
<!-- gen:skills-table:end -->

</details>

## License and credits

- This repository's own content is MIT licensed: see [LICENSE](LICENSE).
- Most skills come from other people's public work. Credits and per-skill provenance: [ATTRIBUTION.md](ATTRIBUTION.md) and `global-config/tools/skill-update-check/sources.json`.
- The upstream license texts and copyright lines are collected in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). Two upstream repositories have no license file; they are listed there with a takedown note.
- Spotted a missing credit or a skill you want removed? Open an issue and it will be fixed.


## Caveat: this is one person's setup

This snapshot comes from a specific workflow: a Thai-English bilingual user on a Windows machine. That shows everywhere — the bilingual sections in CLAUDE.md, the PowerShell-vs-Bash gotchas.

Adopt what's useful, discard what isn't. None of this is prescriptive best practice — it's what worked for one person, written down well enough to be portable. The real value is the *shape* of the system (routing by cost, offloading heavy work, one home per piece of knowledge, safety gates on destructive commands), not any individual rule.
