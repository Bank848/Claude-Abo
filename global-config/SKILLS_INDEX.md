---
name: all-skills
description: Central index of every installed skill — what each one is, how to use it, and when; update when adding or removing a skill
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4adc6dba-7324-4362-a2a5-404665f85eed
---

# All Skills Index

**Last updated:** 2026-08-09
**Locations:**
- Project skills (built-in): system
- Global user skills: `~/.claude/skills/<name>/SKILL.md`
- Plugin skills: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/`
- External cloned repos: `~/.claude/external-skills/`

**How to pick one:** Claude auto-triggers skills from each skill's description, but you can also call one by name, e.g. `/scrutinize` or say "use debug-mantra"

> **File layout:** top = ⭐ Daily drivers (what actually gets picked up every day; reading just this is enough) · below = 📚 full Library grouped by category (200+ skills, open only when needed) · end = "which one when" cheatsheet

---

## ⭐ Daily drivers — what actually gets picked up, grouped by task

> These 10-13 are the ones used repeatedly in real work (UI / planning / review / ship). If you can't remember what exists, read just this block

| Frequent task | Pick this |
|---|---|
| 🔄 **Convert files → Markdown / feed RAG** | `markitdown` |
| 🧠 **Plan a feature** | `superpowers:brainstorming` → `/plan-pro` (skip the separate spec.md for small-to-medium work) · want the AI to grill the plan live before starting → `/grilling` |
| 🔍 **Outsider-perspective review/check** | `/scrutinize` (plan/PR/diff) |
| 🐞 **Debug** | `/debug-mantra` (recite the 4 steps) + `superpowers:systematic-debugging` |
| 🎨 **Design/adjust UI** | `ui-ux-pro-max` → `ui-styling` · full-page build/anti-slop audit: `hallmark` · small polish: `make-interfaces-feel-better` + `deslop-defaults` |
| ✅ **Before claiming done** | `superpowers:verification-before-completion` |
| 🛠️ **Create/edit a skill** | `superpowers:writing-skills` or `anthropic-skills:skill-creator` |
| 🔬 **Verify a review's claims before fixing** | workflow `adversarial-verify` (`~/.claude/workflows/` — **not included in this template**, write your own or skip) — CONFIRMED needs a quoted file:line · feeds into receiving-code-review |
| 🕸️ **input → knowledge graph** | `/graphify` |
| 📚 **Tutor / learn something new (stateful across sessions)** | `/teach` |
| ⚙️ **Edit settings/hook/permission** | `update-config` |
| 🪤 **Mistake-proofing at design time** | `/poka-yoke` |
| 🚀 **Full commit→push→PR→review→merge flow** | `shipping-a-branch` (`/ship`) — every risky action (push/PR/merge/delete branch) is confirmed separately, one at a time; never one long blanket command |

**Cost routing (every task):** main = Opus 5.5 or Sonnet 5.5 (your choice) · mechanical work→`haiku-batch` · reading many files→`Explore` · big chunks of standard work (main=Opus)→`sonnet-worker` · genuinely hard (main=Sonnet)→spawn `opus` · highest stakes where Opus still wavers→spawn `fable-medium`. (Full rules in `~/.claude/CLAUDE.md`)

---

## 📚 Library — everything by category (open only when needed)

## Built-in (Claude Code core)

| Skill | What it does / when to use |
|---|---|
| `update-config` | Edit `settings.json` (hooks, permissions, env) — set up automatic hooks / add an allowlist |
| `keybindings-help` | Edit keyboard shortcuts, rebind keys, chord bindings |
| `verify` | Run the real app to check a fix works — verify a PR / fix |
| `code-review` | Review a diff for bugs (low/medium/high effort) — before push/PR |
| `fewer-permission-prompts` | Scan transcripts to add an allowlist — fewer permission prompts |
| `loop` | Re-run a prompt on an interval — poll status, recurring task |
| `schedule` | Create a cron-based remote agent — scheduled task |
| `claude-api` | Anthropic SDK work + prompt caching + migration |
| `run` | Launch the project app to see results — request a screenshot / run the app |
| `review` | review GitHub PR |
| `security-review` | Security audit — before merging anything security-sensitive |
| `init` | Init a project — fresh setup |

---

## Custom global skills

| Skill | What it does / when to use |
|---|---|
| `graphify` | any input → knowledge graph + HTML/JSON + audit report — `/graphify`. Engine = pip `graphifyy` (source: [safishamsi/graphify](https://github.com/safishamsi/graphify) — confirmed via `pip show graphifyy` Home-page, 2026-08-08; unrelated to `Graphify-Labs/graphify` seen on trendshift.io, different repo) |
| `poka-yoke` | Mistake-proofing at design time: make the bad state impossible/obvious instead of catching it afterwards. Tier 1 prevent > tier 2 detect + checklists for slips/anti-cheat/dev-guardrail. Use when designing or reviewing a feature/minigame/UI/anticheat/build, or when about to write "don't forget X" — `/poka-yoke` |
| `plan-pro` | Builds on `superpowers:writing-plans`: (1) spawn 1-2 reviewer agents to find gaps + critical issues, then fix and report (2) the plan is an **HTML** page: top section = side-by-side before/after diagram (Mermaid) for human readers, bottom = the normal plan (3) parallelization analysis → parallel execute + finish with `/code-review` + `/simplify` in parallel — `/plan-pro` |
| `markitdown` | Convert files (PDF/PPTX/DOCX/XLSX/image/audio/HTML/CSV/JSON/EPUB/ZIP/YouTube) → Markdown with Microsoft MarkItDown. Use when converting a doc to .md, prepping files to feed RAG/LLM, batch-converting a whole folder, transcribing audio. CLI `markitdown` (installed in Python313). Pairs with Claude reading PDFs directly: semantic/image-heavy work → Claude, convert/batch/index work → MarkItDown |
| `deslop-defaults` | Stack-agnostic "deslop" rules against AI UI that looks average/unfinished: z-index scale, one accent per view, no mixing primitive systems, standard destructive/loading/error/empty patterns, visual restraint. **Companion of `make-interfaces-feel-better`** (that one = optical craft, this one = structural restraint). Harvested from ibelick/ui-skills baseline-ui. Use for quick checks/small fixes — for full-page builds/audits use `hallmark` instead (see below) |
| `hallmark` | **Full anti-AI-slop design system** (Together AI, source: [Nutlope/hallmark](https://github.com/Nutlope/hallmark), installed 2026-08-09 from a trendshift.io candidate evaluation — see `projects/claude-skills-trendshift-2026-08/CANDIDATE-EVALUATION.md`). 57 numbered slop-test gates + macrostructure diversity engine (21 themes, avoids repeating a theme across sessions via `.hallmark/log.json`) + mobile-responsiveness hard floor (320/375/414/768px) + 4 verbs: default(build)/`audit`(read-only score, doesn't edit code)/`redesign`/`study`(pull the DNA from a screenshot/URL). Catches more than `deslop-defaults`: fake metrics/testimonials, re-drawn fake browser chrome, italic headers (an AI tell), token discipline, 8-state component checklist. **Use as the primary tool when building a new full page / auditing existing UI** — `deslop-defaults` stays as a light quick-check, different scope, no overlap. Compared and decided against `Leonxlnx/taste-skill` (74k★, the name looks competitive, but the content is really two specialized style generators — a brutalist theme + a brand-kit image — not a deslop checklist) |
| `grilling` | **Relentlessly grill the plan before starting** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills) — only started being tracked in `sources.json` on 2026-08-08, no baseline before that). Fires questions one at a time, walks every branch of the design tree resolving dependencies one by one, suggests an answer for each — if it can be answered from the codebase it reads the code instead of asking. **Auto-triggers** (say "grill"/stress-test) or `/grilling`. **For games/translation/general work → use this one (the bare engine)**; it writes no files to the repo. Fills the "have the AI grill us live" gap that brainstorm/plan-pro/scrutinize don't cover |
| `teach` | Personal tutor, **stateful across sessions** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills) — only started being tracked in `sources.json` on 2026-08-08, no baseline before that). Uses the current dir as a teaching workspace: `MISSION.md` (why you want to learn) + `./lessons/*.html` (nicely made lessons, one small topic at a time) + `./learning-records/*.md` (remembers what was already learned → computes the zone of proximal development) + `RESOURCES.md` + glossary. Emphasizes storage strength (retrieval/spacing/interleaving), not illusory fluency. `disable-model-invocation` → invoke `/teach <topic>` yourself. **New — doesn't overlap existing ones** |
| `wait-what` | **Stop-and-re-pitch prompt** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills), installed 2026-08-09). Just a one-line template — tells the user to briefly re-explain what was just said, using ASD-STE100 Simplified Technical English + the ubiquitous language from `CONTEXT.md`. `disable-model-invocation` → no auto-trigger; invoke it yourself when you want the AI (or yourself) to stop and re-explain clearly before continuing |
| `wizard` | **Builds an interactive bash wizard** for manual procedures the agent can't do itself (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills), installed 2026-08-09). Use when provisioning infra / setting up credentials-CI secrets / walking an unfamiliar third-party dashboard / one-off migrations. Ships `template.sh` as a ready-made library (stage progress, cross-platform `open_url` including WSL, `ask`/`ask_secret`, idempotent `write_env`, `set_secret`/`set_var` via `gh`, closing summary) — the skill's job is only to scope the steps + author the stages; never edit the library part above the `STAGES` marker yourself. **Not for steps the agent can already do itself** |
| `shipping-a-branch` | **End-to-end git ship flow** (planned by fable-medium, installed 2026-08-02). commit → confirm push → reuse-or-create PR (checks `gh pr list --head` to avoid duplicates) → choose review mode (human/self/both) → loop fixing feedback → confirm merge (method) → ask about branch cleanup. Every risky checkpoint (push/PR/merge/delete) is **confirmed separately each time**; an earlier "okay" is never used to cover a later one (per the system's instruction-priority). Use instead of `ecc:pr`/`ecc:review-pr` when you want the full flow, not just one phase. Works in every project (repo-agnostic via plain `git`/`gh`, no hardcoded branch/repo names) — invoke with `/ship` or say "ship this"/"commit and open a PR" |


## Bonus skills (October 2026 patch)

Added after the first release; see the README for caveats (several are written for the author workflow).

| Skill | What it does / when to use |
|---|---|
| `browserclaw` | Operating discipline for driving a signed-in agent browser (snapshot, act, verify loop). |
| `close-out-log` | Repo-local close-out ritual (docs/log entry with 4 fixed headers). Pattern adapted from a docs-driven continuity workflow. |
| `codeburn-cost-check` | Thin wrapper so Claude can check AI spend via the codeburn CLI (the CLI itself is a separate npm package). |
| `docx-human-sounding-report` | Structural checklist for human-sounding .docx reports. |
| `docx-python-docx-justify` | python-docx rule: do not justify formula and code blocks with manual line breaks. |
| `docx-th-sarabun-sizing` | TH Sarabun New sizing scale plus the base-style rule. |
| `domain-modeling` | Domain-modeling and ADR discipline (from mattpocock/skills). |
| `english-writing-anti-ai-tell` | English anti-AI-tell writing checklist. |
| `github-pr-review-draft` | Pending-review (draft) PR review workflow via the GitHub API. |
| `grill-with-docs` | Thin wrapper combining grilling and domain-modeling (from mattpocock/skills). |
| `i-have-adhd` | ADHD-friendly output style. Frontmatter says MIT but there is no upstream source URL in the skill folder, so it is treated as self-authored. |
| `memory-lint` | Read-only health check of a project memory folder. |
| `ponytail` | Write the least code that is still correct (YAGNI, stdlib, native, existing dependency ladder); adapted from DietrichGebert/ponytail. |
| `project-bootstrap` | One-shot scaffold for docs-driven continuity (CLAUDE.md router, docs/log, docs/adr, conventions). |
| `pruning-branches` | Periodic git branch housekeeping. |
| `supabase-rls-safety-check` | Proactive Supabase RLS and anon-key audit rule. |
| `thai-docx` | Thai .docx rendering fix (complex-script XML properties, per-language font split); ships its own scripts and references. |
| `thai-no-quote-emphasis` | Rule against quote-mark emphasis in Thai writing. |
| `thai-writing-anti-ai-tell` | Thai anti-AI-tell writing checklist. |
| `agent-reach` | Panniantong/Agent-Reach (MIT). Router for internet research across many platforms via a multi-backend CLI. Run check.ps1 -Ack once to set your own baseline. |
| `git-guardrails-claude-code` | utarn/engineer-skills (MIT). Original hook was jq/bash; a Python version is used in the author setup. Run check.ps1 -Ack once to set your own baseline. |
| `prompt-master` | nidhinjs/prompt-master (MIT). Whole-repo skill clone (root SKILL.md plus references/). Run check.ps1 -Ack once to set your own baseline. |
---

## superpowers (obra/superpowers) — process discipline

| Skill | What it does / when to use |
|---|---|
| `brainstorming` | Explore intent + requirements + design — **before any creative work** |
| `writing-plans` | Write a plan for a multi-step task — has a spec, no code touched yet |
| `executing-plans` | Execute a written plan, with checkpoints |
| `subagent-driven-development` | Execute a plan with subagents — independent tasks |
| `dispatching-parallel-agents` | Spawn 2+ agents in parallel |
| `test-driven-development` | Strict TDD (RED→GREEN→IMPROVE) |
| `systematic-debugging` | Systematic debugging — **on a bug/failing test** |
| `verification-before-completion` | Must run verification before claiming "done" |
| `requesting-code-review` | Verify the work was finished per the requirements |
| `receiving-code-review` | Receive feedback critically |
| `finishing-a-development-branch` | Finish a branch (merge/PR/cleanup) |
| `using-git-worktrees` | Manage git worktrees — several branches at once |
| `writing-skills` | Create/edit a skill |
| `using-superpowers` | Meta: how to use superpowers |

---

## Custom global skills — engineering discipline *(formerly the 9arm-skills plugin; plugin removed, now personal skills invoked by bare name)*

| Skill | What it does / when to use |
|---|---|
| `debug-mantra` | Forces reciting the 4 steps: reproduce → trace → falsify → cross-ref before proposing a fix |
| `post-mortem` | Write an RCA for engineers (root cause, mechanism, fix, validation, slip-through) |
| `scrutinize` | Outsider-perspective review + trace the real code, not just the diff |
| `management-talk` | Translate tech → VP/PM/director by channel (JIRA/Slack/email/standup) |

---

## Custom global skills — design intelligence *(formerly the ui-ux-pro-max/ckm plugin; plugin removed, now personal skills invoked by bare name)*

| Skill | What it does / when to use |
|---|---|
| `ui-ux-pro-max` | DB 50+ styles, 161 palettes, 57 font pairs, 99 UX, 25 charts, 10 stacks |
| `design` | logo + CIP + mockup + slides + banner + icon + social photo |
| `design-system` | 3-layer design tokens + CSS vars — includes the **Minimum Semantic Set (6 slots)**: bg/ink/accent/surface/line/muted, no hardcoded hex in components (added 2026-08-03) |
| `ui-styling` | shadcn/ui + Tailwind + canvas — implement real UI |
| `banner-design` | banner social/ad/web/print 22 styles |
| `brand` | brand voice + messaging + asset mgmt |
| `slides` | HTML presentation + Chart.js + design tokens |
| `mobbin-references` | **New (2026-08-03).** Uses the Mobbin MCP (`https://api.mobbin.com/mcp`, paid) to pull screenshots of 600k+ real app pages as layout references before designing UI — if not connected, falls back to `lazyweb-design-research` by itself, doesn't block, doesn't warn repeatedly |
| `dembrandt` | **New (2026-08-08, planned by fable-medium).** Pulls the real design tokens of a given website (colors/fonts/spacing/components) from the DOM/CSS via `npx dembrandt <url> --design-md --save-output` (no install, Node 18+). Use when auditing/benchmarking/migrating an existing site — **not** a direct site clone, and not 100% complete if the site is Canvas-heavy/login-walled/anti-bot/complexly rendered. Different role from `mobbin-references`/`lazyweb-design-research` (those = inspiration from many apps, this = tokens from the one given site). Known Failure Modes cross-references [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) (added 2026-08-08) as a fallback for Canvas-heavy/anti-bot sites — not installed as a separate skill |
| *(reference source, not a skill)* [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) | **New (2026-08-09).** A library of ready-made `DESIGN.md` files for 73 well-known brands (Stripe, Linear, Notion, Vercel, Apple, Figma, Supabase, etc.) — plain text files, no executable code, no risk. Use when you want generated UI to have the real "feel" of an existing brand (not just inspiration like `mobbin-references`/`lazyweb-design-research`) — fetch a single file from `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md` (see the slug list in the repo link), drop it in the project root for the agent to read directly before asking it to build UI; no need to clone the whole repo (the library updates often, so fetch live to avoid stale data) |

---

## pordee (kerlos/pordee) — Thai compression

| Skill | What it does / when to use |
|---|---|
| `pordee:pordee` | Short Thai+English mode, cuts tokens 60-75% — `/pordee` |
| `pordee:pordee-stats` | Token stats for the session — `/pordee-stats` |

---

## lazyweb (aboul3ata/lazyweb-skill) — design research

| Skill | What it does / when to use |
|---|---|
| `lazyweb-design-research` | Design research + download reference screenshots |
| `lazyweb-quick-references` | Quickly find app screenshots/UI references |
| `lazyweb-design-improve` | Screenshot our work + find comparisons → ideas for improvement |
| `lazyweb-design-brainstorm` | Cross-domain brainstorm (outside the category) |
| `lazyweb-add-inspo-source` | connect Mobbin/Savee/Dribbble/Behance |
| `lazyweb-remove-inspo-source` | Remove a connected source |

---

## andrej-karpathy-skills

| Skill | What it does / when to use |
|---|---|
| `karpathy-guidelines` | guidelines to reduce LLM coding mistakes (surgical, surface assumptions) |

---

## anthropic-skills (official) — productivity

| Skill | What it does / when to use |
|---|---|
| `internal-comms` | status report, leadership update, FAQ, incident report |
| `brand-guidelines` | apply Anthropic brand color/typography |
| `consolidate-memory` | reflective pass over memory files (merge/prune) |
| `doc-coauthoring` | Structured workflow for writing a doc/spec/proposal |
| `algorithmic-art` | p5.js generative art |
| `canvas-design` | visual art .png/.pdf |
| `docx` | Word — create/read/edit |
| `pdf` | PDF — read/merge/split/OCR/form |
| `xlsx` | Excel — create/edit/clean data |
| `pptx` | PowerPoint deck |
| `slack-gif-creator` | animated GIF for Slack |
| `mcp-builder` | Build an MCP server (FastMCP / TS SDK) |
| `web-artifacts-builder` | claude.ai HTML artifact (React+Tailwind+shadcn) |
| `theme-factory` | apply theme (10 presets) artifact |
| `skill-creator` | Create/edit a skill + eval + benchmark |
| `setup-cowork` | guided Cowork setup |

---

## ECC (affaan-m/everything-claude-code) — 284 skills (per CLAUDE.md's "Installed Plugins" section; this list below covers a subset, not all of them)

### Agentic / agent systems

| Skill | Use when |
|---|---|
| `agent-architecture-audit` | Full-stack diagnostic for agent + LLM apps. Audits 12-layer stack for wrapper regression, memory pollution, tool failures, repair loops, rendering corruption |
| `agent-eval` | Head-to-head comparison of coding agents (Claude Code, Aider, Codex) — pass rate, cost, time, consistency |
| `agent-harness-construction` | Design + optimize AI agent action spaces, tool definitions, observation formatting |
| `agent-introspection-debugging` | Structured self-debugging for agent failures (capture, diagnosis, contained recovery, reports) |
| `agent-payment-x402` | Add x402 payment to agents — per-task budgets, non-custodial wallets (Base, X Layer) |
| `agent-sort` | Sort ECC skills/commands/rules/hooks into DAILY vs LIBRARY for a specific repo |
| `agentic-engineering` | Operate as agentic engineer — eval-first execution, decomposition, cost-aware routing |
| `agentic-os` | Build persistent multi-agent OS on Claude Code (kernel, specialists, slash commands, file memory) |
| `ai-first-engineering` | Engineering operating model for teams where AI generates most output |
| `autonomous-agent-harness` | Transform Claude Code into autonomous agent — persistent memory, scheduled ops, computer use, queues |
| `autonomous-loops` | Patterns for autonomous Claude Code loops (sequential pipelines → RFC-driven multi-agent DAG) |
| `claude-devfleet` | Orchestrate multi-agent coding via Claude DevFleet — parallel agents in isolated worktrees |
| `continuous-agent-loop` | Continuous autonomous loops with quality gates, evals, recovery |
| `continuous-learning-v2` | Instinct-based learning — observes sessions via hooks, scores confidence, evolves into skills (project-scoped) |
| `continuous-learning` | [DEPRECATED] v1 stop-hook extractor — use v2 |
| `dmux-workflows` | Multi-agent orchestration via dmux (tmux pane manager) — parallel sessions |
| `enterprise-agent-ops` | Long-lived agent workloads — observability, security boundaries, lifecycle |
| `eval-harness` | Formal eval framework for Claude Code (EDD principles) |
| `gan-style-harness` | Generator-Evaluator agent harness (Anthropic Mar 2026 paper) |
| `nanoclaw-repl` | Operate + extend NanoClaw v2 (zero-dependency session-aware REPL) |
| `plan-orchestrate` | Read plan → decompose → design agent chain → emit `/orchestrate` prompts |
| `ralphinho-rfc-pipeline` | RFC-driven multi-agent DAG with quality gates + merge queues |
| `santa-method` | Adversarial multi-agent verification — 2 reviewers must both pass |
| `team-builder` | Interactive picker for composing parallel agent teams |
| `iterative-retrieval` | Pattern for progressively refining context retrieval (subagent context problem) |

### LLM cost / model routing / context

| Skill | Use when |
|---|---|
| `cost-aware-llm-pipeline` | Cost optimization — model routing by complexity, budget tracking, retry, prompt caching |
| `cost-tracking` | Track Claude Code token usage / spending / budgets from local DB |
| `context-budget` | Audit Claude Code context window — bloat, redundancy, token-savings recs |
| `strategic-compact` | Manual context compaction at logical intervals (vs auto-compact) |
| `token-budget-advisor` | Token budget guidance |

### Coding standards / patterns (cross-cutting)

| Skill | Use when |
|---|---|
| `coding-standards` | Baseline cross-project conventions (naming, readability, immutability, code-quality) |
| `error-handling` | Robust error handling — TypeScript/Python/Go; typed errors, boundaries, retries, circuit breakers |
| `architecture-decision-records` | Capture decisions as structured ADRs auto-detected |
| `hexagonal-architecture` | Ports & Adapters — domain boundaries, dependency inversion (TS/Java/Kotlin/Go) |
| `api-design` | REST patterns — resource naming, codes, pagination, filtering, errors, versioning, rate limit |
| `api-connector-builder` | Build new API connector matching repo's existing integration pattern |
| `content-hash-cache-pattern` | Cache expensive file results via SHA-256 — path-independent, auto-invalidate |

### Languages — Python

| Skill | Use when |
|---|---|
| `python-patterns` | Pythonic idioms, PEP 8, type hints |
| `python-testing` | pytest, TDD, fixtures, mocking, coverage |

### Languages — Go

| Skill | Use when |
|---|---|
| `golang-patterns` | Idiomatic Go conventions |
| `golang-testing` | Table-driven, subtest, benchmark, fuzz, coverage |

### Languages — Rust

| Skill | Use when |
|---|---|
| `rust-patterns` | Ownership, error handling, traits, concurrency |
| `rust-testing` | Unit, integration, async, property-based, mocking, coverage |

### Languages — Java / Kotlin

| Skill | Use when |
|---|---|
| `java-coding-standards` | Spring Boot + Quarkus conventions (immutability, Optional, streams, CDI, reactive) |
| `springboot-patterns` | Spring Boot — REST, layered services, data access, caching, async |
| `springboot-tdd` | JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo |
| `springboot-security` | authn/authz, validation, CSRF, headers, rate limit |
| `springboot-verification` | build + analysis + tests + security + diff review |
| `quarkus-patterns` | Quarkus 3.x LTS with Camel — messaging, REST, CDI, Panache |
| `quarkus-tdd` | JUnit 5, Mockito, REST Assured, Camel testing, JaCoCo |
| `quarkus-security` | JWT/OIDC, RBAC, validation, secrets |
| `quarkus-verification` | build + analysis + tests + security + native + diff |
| `jpa-patterns` | Spring Boot JPA/Hibernate — entity design, queries, transactions, auditing |
| `kotlin-patterns` | Idiomatic Kotlin — coroutines, null safety, DSL builders |
| `kotlin-testing` | Kotest, MockK, coroutine test, property-based, Kover |
| `kotlin-coroutines-flows` | Structured concurrency, Flow operators, StateFlow |
| `kotlin-ktor-patterns` | Routing DSL, plugins, auth, Koin DI, kotlinx.serialization, WebSockets |
| `kotlin-exposed-patterns` | Exposed ORM — DSL queries, DAO, transactions, HikariCP, Flyway |
| `android-clean-architecture` | Android + KMP clean arch — modules, UseCases, Repositories |
| `compose-multiplatform-patterns` | Compose Multiplatform + Jetpack Compose — state, nav, theme, platform UI |

### Languages — Swift / Apple

| Skill | Use when |
|---|---|
| `swiftui-patterns` | SwiftUI — @Observable state, view composition, nav, performance |
| `swift-concurrency-6-2` | Swift 6.2 Approachable Concurrency — single-threaded default, @concurrent, isolated conformances |
| `swift-actor-persistence` | Actor-based thread-safe persistence (in-memory + file) |
| `swift-protocol-di-testing` | Protocol-based DI — mock FS/network/APIs, Swift Testing |
| `foundation-models-on-device` | Apple FoundationModels — on-device LLM, @Generable, tool calling (iOS 26+) |
| `liquid-glass-design` | iOS 26 Liquid Glass material — blur, reflection, morphing |
| `ios-icon-gen` | iOS app icons from SF Symbols (5000+) or Iconify (275k+) |

### Languages — C / C++ / C# / F# / .NET / Perl

| Skill | Use when |
|---|---|
| `cpp-coding-standards` | C++ Core Guidelines — modern, safe, idiomatic |
| `cpp-testing` | GoogleTest/CTest, sanitizers, coverage |
| `csharp-testing` | xUnit, FluentAssertions, mocking, integration |
| `fsharp-testing` | xUnit, FsUnit, Unquote, FsCheck property-based |
| `dotnet-patterns` | Idiomatic C#/.NET — DI, async/await |
| `perl-patterns` | Modern Perl 5.36+ idioms |
| `perl-testing` | Test2::V0, Test::More, Devel::Cover, TDD |
| `perl-security` | Taint mode, validation, safe exec, DBI, web security |

### Web — frontend frameworks

| Skill | Use when |
|---|---|
| `frontend-patterns` | React, Next.js, state mgmt, perf, UI |
| `frontend-design-direction` | Set ECC-specific frontend design direction for production UI |
| `frontend-slides` | Animation-rich HTML presentations, convert PPT to web |
| `nextjs-turbopack` | Next.js 16+ Turbopack — bundling, caching, dev speed |
| `nuxt4-patterns` | Nuxt 4 — hydration safety, perf, route rules, SSR-safe fetch |
| `angular-developer` | Angular code + arch guidance — signals, forms, DI, routing, SSR, a11y |
| `vite-patterns` | Vite — config, plugins, HMR, env, SSR, library mode |
| `ui-to-vue` | Convert UI screenshots → Vue 3 (Vant, Element Plus, Ant Design Vue) |
| `motion-foundations` | Motion tokens + spring presets + perf rules + a11y + SSR safety (React/Next) |
| `motion-patterns` | Production animations — button/modal/toast/stagger/page transitions |
| `motion-advanced` | Drag & drop, gestures, text anim, SVG paths, custom hooks, useAnimate |
| `motion-ui` | Production-ready UI motion system for React/Next |

### Web — backend frameworks

| Skill | Use when |
|---|---|
| `backend-patterns` | Backend arch — API, DB optimization, server-side (Node/Express/Next API) |
| `nestjs-patterns` | NestJS — modules, controllers, providers, DTO, guards, interceptors |
| `fastapi-patterns` | Async APIs, DI, Pydantic, OpenAPI, tests, security |
| `django-patterns` | Django + DRF — REST API, ORM, caching, signals, middleware |
| `django-tdd` | pytest-django, factory_boy, mocking, DRF tests |
| `django-security` | authn/authz, CSRF, SQLi, XSS, secure deploy |
| `django-celery` | Async tasks — config, beat, retries, canvas workflows |
| `django-verification` | Migrations + lint + tests + security + deploy ready |
| `laravel-patterns` | Routing/controllers, Eloquent, services, queues, events, caching |
| `laravel-tdd` | PHPUnit + Pest, factories, DB testing, fakes, coverage |
| `laravel-security` | authn/authz, validation, CSRF, mass assignment, uploads |
| `laravel-verification` | env + lint + analysis + tests + security + deploy |
| `laravel-plugin-discovery` | Find Laravel packages via LaraPlugins.io MCP |
| `tinystruct-patterns` | tinystruct Java framework — Application, @Action routes, HTTP/CLI dual, SSE |

### Web — runtime / build / deploy

| Skill | Use when |
|---|---|
| `bun-runtime` | Bun as runtime/PM/bundler/test — when vs Node, Vercel support |
| `flox-environments` | Reproducible cross-platform dev environments via Flox (Nix-based) |
| `docker-patterns` | Docker + Compose — local dev, security, networking, volumes, orchestration |
| `deployment-patterns` | CI/CD pipelines, Docker, health checks, rollback, prod readiness |
| `git-workflow` | Branching, commits, merge vs rebase, conflict resolution |
| `database-migrations` | Schema changes, data migrations, rollbacks, zero-downtime (PG/MySQL/ORMs) |

### Mobile — Flutter / Dart

| Skill | Use when |
|---|---|
| `dart-flutter-patterns` | Null safety, immutable state, async, widget arch, BLoC/Riverpod/Provider, GoRouter, Dio, Freezed |
| `flutter-dart-code-review` | Code review checklist — widget, state mgmt, Dart idioms, perf, a11y, security |

### Databases

| Skill | Use when |
|---|---|
| `postgres-patterns` | Query opt, schema design, indexing, security (Supabase best practices) |
| `mysql-patterns` | MySQL/MariaDB schema, query, indexing, transactions, replication |
| `clickhouse-io` | ClickHouse — query opt, analytics for high-perf analytical workloads |
| `prisma-patterns` | Prisma TypeScript — schema, query opt, transactions, pagination, traps |
| `redis-patterns` | Data structures, caching, distributed locks, rate limit, pub/sub |

### AI / ML / RecSys

| Skill | Use when |
|---|---|
| `mle-workflow` | Production ML — data contracts, reproducible training, eval, deploy, monitor, rollback |
| `pytorch-patterns` | PyTorch — training pipelines, model arch, data loading |
| `recsys-pipeline-architect` | Recommendation/ranking/feed pipelines — Source→Hydrator→Filter→Scorer→Selector→SideEffect |
| `mcp-server-patterns` | Build MCP servers with Node/TS SDK — tools, resources, prompts, Zod |
| `llm-trading-agent-security` | Autonomous trading agents — prompt injection, spend limits, simulation, circuit breakers, MEV |
| `safety-guard` | Prevent destructive ops on prod / autonomous agents |
| `gateguard` | Fact-forcing gate blocks Edit/Write/Bash until investigation (+2.25 quality) |
| `ai-regression-testing` | Sandbox API testing, automated bug-check, catch AI blind spots |

### Testing / QA / verification

| Skill | Use when |
|---|---|
| `tdd-workflow` | Test-driven dev, 80%+ coverage (unit + integration + E2E) |
| `e2e-testing` | Playwright — POM, config, CI/CD, artifacts, flaky strategies |
| `browser-qa` | Automated visual + UI interaction verification after deploy |
| `windows-desktop-e2e` | Windows desktop apps (WPF/WinForms/Win32/Qt) via pywinauto |
| `ui-demo` | Polished UI demo videos via Playwright |
| `verification-loop` | Comprehensive verification system for Claude Code sessions |
| `canary-watch` | Monitor deployed URL after release — HTTP/SSE/assets/console/perf |
| `click-path-audit` | Trace every button's full state-change sequence to find UI bugs |
| `production-audit` | Local-evidence prod readiness audit (no external service) |
| `repo-scan` | Cross-stack source audit — classify files, detect embedded libs, 4-level verdicts |
| `benchmark` | Measure perf baselines, detect regressions, compare stacks |
| `accessibility` | WCAG 2.2 Level AA — inclusive design for Web + native |
| `security-review` | Security checklist for authn / input / secrets / API / payments |
| `security-scan` | Scan `.claude/` for vulnerabilities (AgentShield) |
| `security-bounty-hunter` | Hunt exploitable bounty-worthy issues — remotely reachable vulns |

### Network / homelab / infra

| Skill | Use when |
|---|---|
| `cisco-ios-patterns` | Cisco IOS/IOS-XE — show commands, config hierarchy, ACL, change-window verify |
| `netmiko-ssh-automation` | Python Netmiko — read-only collection, batch SSH, TextFSM, guarded changes |
| `network-bgp-diagnostics` | BGP troubleshooting — neighbor state, route exchange, prefix policy |
| `network-config-validation` | Pre-deploy checks — dangerous commands, dup addresses, subnet overlaps |
| `network-interface-health` | Interface errors, drops, CRCs, duplex, flapping, speed negotiation |
| `homelab-network-readiness` | Checklist before VLAN/DNS/WG changes |
| `homelab-network-setup` | Gateways, switches, APs, IP, DHCP, DNS, cabling |
| `homelab-vlan-segmentation` | VLANs for IoT/guest/trusted/server (UniFi/pfSense/MikroTik) |
| `homelab-pihole-dns` | Pi-hole install, blocklists, DoH, DHCP, local DNS |
| `homelab-wireguard-vpn` | WireGuard server, peer config, split vs full tunnel |

### Healthcare

| Skill | Use when |
|---|---|
| `healthcare-cdss-patterns` | CDSS — drug interactions, dose validation, NEWS2/qSOFA, alert severity |
| `healthcare-emr-patterns` | EMR/EHR — clinical safety, encounters, prescriptions, a11y-first UI |
| `healthcare-phi-compliance` | PHI/PII — classification, access control, audit, encryption, leak vectors |
| `healthcare-eval-harness` | Patient safety eval — CDSS accuracy, PHI exposure, workflow integrity |
| `hipaa-compliance` | HIPAA / PHI / BAA / breach posture / US healthcare compliance |

### Scientific

| Skill | Use when |
|---|---|
| `scientific-thinking-literature-review` | Lit review — search planning, screening, synthesis, citations |
| `scientific-thinking-scholar-evaluation` | Evaluate papers/proposals/reviews/methods/evidence |
| `scientific-db-pubmed-database` | PubMed + NCBI E-utilities — MeSH, PMID, citations |
| `scientific-db-uspto-database` | USPTO patent/trademark — PatentSearch, TSDR, assignment |
| `scientific-pkg-gget` | gget CLI — genomic queries, sequence, BLAST, enrichment |

### DeFi / blockchain

| Skill | Use when |
|---|---|
| `defi-amm-security` | Solidity AMM audit — reentrancy, CEI, donation, oracle, slippage, integer math |
| `evm-token-decimals` | Prevent decimal mismatch across EVM chains |
| `nodejs-keccak256` | Prevent Node sha3-256 vs Ethereum Keccak-256 mixup (selectors/signatures/storage) |
| `agent-payment-x402` | (see Agentic above) |

### Business / ops / sales / marketing

| Skill | Use when |
|---|---|
| `customer-billing-ops` | Stripe — subscriptions, refunds, churn triage, billing portal |
| `customs-trade-compliance` | (TH/CH desc) Customs docs, HS classification, Incoterms, FTA, penalty mitigation |
| `carrier-relationship-management` | Carrier portfolio, RFP, scorecards, freight allocation |
| `energy-procurement` | Electricity + gas procurement, tariff opt, demand charges, PPA eval |
| `inventory-demand-planning` | (similar ops domain) |
| `production-scheduling` | Production scheduling expertise |
| `quality-nonconformance` | QA non-conformance handling |
| `returns-reverse-logistics` | Returns / reverse logistics |
| `logistics-exception-management` | Logistics exception handling |
| `finance-billing-ops` | Revenue, pricing, refunds, team billing, billing-model truth |
| `ecc-tools-cost-audit` | ECC Tools burn + billing audit — quota bypass, premium leakage |
| `investor-materials` | Pitch decks, one-pagers, memos, accelerator apps, financial models |
| `investor-outreach` | Cold email, warm intro, follow-up, update email |
| `market-research` | Market sizing, competitor comparison, fund/tech scans |
| `lead-intelligence` | AI-native lead intel — signal scoring, mutual ranking, warm path, outreach |
| `content-engine` | Platform-native content — X/LinkedIn/TikTok/YouTube/newsletter |
| `crosspost` | Multi-platform distribution — X/LinkedIn/Threads/Bluesky |
| `brand-voice` | Source-derived writing style profile for voice consistency |
| `article-writing` | Long-form content with distinctive voice |
| `seo` | Technical SEO, on-page, schema, Core Web Vitals, content strategy |
| `social-graph-ranker` | Weighted graph ranking — warm intro, bridge scoring, gap analysis |
| `connections-optimizer` | Reorganize X + LinkedIn network — pruning, recommendations, warm outreach |
| `x-api` | X/Twitter API — post, threads, timeline, search, analytics |

### Productivity / ops surfaces

| Skill | Use when |
|---|---|
| `email-ops` | Mailbox triage, draft, send verify, sent-mail follow-up |
| `messages-ops` | Live messaging — read texts/DMs, recover OTP, inspect thread |
| `unified-notifications-ops` | Notifications across GitHub/Linear/desktop/hooks |
| `google-workspace-ops` | Drive + Docs + Sheets + Slides as one surface |
| `github-ops` | gh CLI — issues, PRs, CI, releases, security |
| `terminal-ops` | Repo execution — run command, check repo, debug CI, narrow fix |
| `knowledge-ops` | Knowledge base mgmt — ingest, sync, dedupe, search across stores |
| `research-ops` | Evidence-first current-state research |
| `automation-audit-ops` | Inventory + overlap audit — jobs/hooks/connectors/MCP/wrappers |
| `project-flow-ops` | GitHub + Linear — backlog, PR triage, GitHub↔Linear coordination |
| `dashboard-builder` | Grafana/SigNoz dashboards that answer real operator questions |

### Media / content tools

| Skill | Use when |
|---|---|
| `fal-ai-media` | fal.ai — text-to-image (Nano Banana), video (Seedance/Kling/Veo 3), TTS, video-to-audio |
| `manim-video` | Manim explainers for technical concepts, diagrams, walkthroughs |
| `remotion-video-creation` | Remotion in React — 3D, anim, audio, captions, charts, transitions |
| `video-editing` | Video pipeline — FFmpeg, Remotion, ElevenLabs, fal.ai, Descript, CapCut |
| `videodb` | See/Understand/Act on video + audio — indexes, search, transcode, edits |
| `visa-doc-translate` | Translate visa docs → bilingual PDF |
| `nutrient-document-processing` | Convert/OCR/extract/redact/sign/fill docs via Nutrient DWS |

### Search / research / docs

| Skill | Use when |
|---|---|
| `search-first` | Search existing tools/libs/patterns before writing custom (researcher agent) |
| `documentation-lookup` | Up-to-date library docs via Context7 MCP (not training data) |
| `exa-search` | Neural search via Exa MCP — web/code/company/people |
| `deep-research` | Multi-source via firecrawl + exa — cited reports |
| `codebase-onboarding` | Analyze codebase → onboarding guide + arch map + CLAUDE.md |
| `code-tour` | CodeTour `.tour` files — persona-targeted walkthroughs |

### ECC self-management / meta

| Skill | Use when |
|---|---|
| `configure-ecc` | Interactive installer for ECC — select + install skills/rules |
| `ecc-guide` | Guide ECC's agents/skills/commands/hooks from live repo |
| `everything-claude-code` | Conventions for everything-claude-code repo itself |
| `ck` | Persistent per-project memory for Claude Code — auto-load context |
| `workspace-surface-audit` | Audit repo + MCP + plugins + connectors → recommend skills/hooks/agents |
| `skill-scout` | Search existing local/marketplace/GitHub/web skill sources |
| `skill-stocktake` | Audit Claude skills + commands for quality (Quick / Full) |
| `skill-comply` | Visualize if skills/rules are followed — 3 strictness levels, full timeline |
| `rules-distill` | Scan skills, extract cross-cutting principles, distill into rules |
| `hookify-rules` | Create hookify rule, write hook rule, hookify syntax guidance |
| `hermes-imports` | Convert Hermes operator workflows → sanitized ECC skills |
| `opensource-pipeline` | Fork + sanitize + package private projects for public release |

### Product / planning

| Skill | Use when |
|---|---|
| `product-capability` | PRD → implementation-ready capability plan (constraints, invariants, interfaces) |
| `product-lens` | Validate "why" before building, product diagnostics, pressure-test direction |
| `blueprint` | One-line goal → multi-session multi-agent build plan with adversarial gates |
| `data-scraper-agent` | Automated AI data collection — scrape on schedule, enrich, store, learn |

### Design (ECC)

| Skill | Use when |
|---|---|
| `design-system` (ecc) | Generate/audit design systems, visual consistency, review styling PRs |
| `make-interfaces-feel-better` | Polish details — spacing, type, borders, shadows, motion, hit areas |

### Decision / collaboration

| Skill | Use when |
|---|---|
| `council` | Convene 4-voice council for ambiguous decisions, tradeoffs, go/no-go |
| `plankton-code-quality` | Write-time enforcement — auto-format + lint + Claude fixes on edit |

### Other

| Skill | Use when |
|---|---|
| `jira-integration` | Jira ticket retrieval/analysis/update via MCP or REST |
| `regex-vs-llm-structured-text` | Decision framework — regex vs LLM for structured text parsing |

---

## Quick "which one when" cheatsheet

| Situation | Main skill + extras |
|---|---|
| Starting new creative work | `superpowers:brainstorming` |
| Have requirements → plan | `superpowers:writing-plans` or `ecc:plan` |
| Plan done → execute | `superpowers:executing-plans` or `ecc:prp-implement` |
| New feature (TDD) | `superpowers:test-driven-development` + `ecc:<lang>-test` |
| Hit a bug | `superpowers:systematic-debugging` + `debug-mantra` |
| Fixed it, closing the ticket | `post-mortem` (→ `management-talk` if escalating upward) |
| Review PR/plan | `scrutinize` + `ecc:code-review` |
| Before commit | `superpowers:verification-before-completion` + `ecc:checkpoint` |
| Build fails | `ecc:build-fix` or `ecc:<lang>-build` |
| Design new UI | `ui-ux-pro-max` → `ui-styling` |
| Build a new full page / audit AI-slop | `hallmark` (57-gate anti-slop system, has a read-only `audit` mode) |
| Polish/deslop UI (works but not pretty) | `make-interfaces-feel-better` (optical craft) + `deslop-defaults` (structural restraint) |
| Research design | `lazyweb:lazyweb-design-research` |
| Create slides | `slides` or `anthropic-skills:pptx` |
| Doc/spec work | `anthropic-skills:doc-coauthoring` |
| Convert files (PDF/office/audio) → Markdown / feed RAG / batch | `markitdown` |
| Reduce tokens | `pordee:pordee` |
| Create a new skill | `superpowers:writing-skills` or `anthropic-skills:skill-creator` |
| Audit context bloat | `ecc:context-budget` + `ecc:strategic-compact` |
| Production audit | `ecc:production-audit` + `ecc:canary-watch` |
| UI bug after a refactor | `ecc:click-path-audit` |

---

## ECC Commands (slash) — use directly

`/plan`, `/plan-prd`, `/feature-dev`, `/code-review`, `/review-pr`, `/checkpoint`, `/build-fix`, `/quality-gate`, `/pr`, `/prp-plan`, `/prp-implement`, `/prp-prd`, `/prp-pr`, `/prp-commit`, `/test-coverage`, `/refactor-clean`, `/hookify`, `/hookify-list`, `/hookify-configure`, `/hookify-help`, `/learn`, `/learn-eval`, `/instinct-import`, `/instinct-export`, `/instinct-status`, `/promote`, `/prune`, `/projects`, `/save-session`, `/resume-session`, `/sessions`, `/loop-start`, `/loop-status`, `/multi-plan`, `/multi-execute`, `/multi-frontend`, `/multi-backend`, `/multi-workflow`, `/gan-build`, `/gan-design`, `/santa-loop`, `/cost-report`, `/model-route`, `/harness-audit`, `/agent-architecture-audit`, `/security-scan`, `/security-review`, `/update-codemaps`, `/update-docs`, `/project-init`, `/configure-ecc`, `/ecc-guide`, `/jira`, `/skill-create`, `/skill-health`, `/skill-comply`, `/skill-scout`, `/skill-stocktake`

Per-language build/review/test commands: `/cpp-build`, `/cpp-review`, `/cpp-test`, `/go-build`, `/go-review`, `/go-test`, `/rust-build`, `/rust-review`, `/rust-test`, `/kotlin-build`, `/kotlin-review`, `/kotlin-test`, `/flutter-build`, `/flutter-review`, `/flutter-test`, `/python-review`, `/fastapi-review`, `/gradle-build`, `/pm2`

---

## Reference tools (not skills)

| Use when | Tool |
|--------|-----------|
| Checking whether skills/plugins have new updates (weekly, automatic, deterministic 0-token, reports only, never updates by itself) | `~/.claude/tools/skill-update-check/check.ps1` (manifest: `sources.json`, report: `~/.claude/skill-update-report.md`) |

- Checks git plugins (ecc/superpowers) with `git fetch`+`rev-list`, pip (graphifyy/markitdown/ifixai) with `pip list --outdated`, personal skills with `git ls-remote` against the baseline in `sources.json`.
- Runs via Task Scheduler every Sunday 10:00 (`schtasks /Query /TN ClaudeSkillUpdateCheck`). Manual run: `powershell -NoProfile -ExecutionPolicy Bypass -File ~/.claude/tools/skill-update-check/check.ps1`
- **review-before-apply:** read the report and update each item yourself → after updating, run `check.ps1 -Ack` to reset the baseline.
- **⚠️ Known limitation (2026-08-08):** `claude plugin update` does not `git pull` in the existing folder — it creates a new version dir (e.g. `ecc/2.2.0`) with no `.git` at all (extracted from a release archive) and leaves the old version dir, which still has `.git`, behind. `check.ps1` only finds `.git` in the old dir, so it reports ecc/superpowers as "hundreds of commits behind" forever **even though they are actually updated** (verify with `claude plugin list`). Permanent fix: delete the old version dirs (e.g. `~/.claude/plugins/cache/ecc/ecc/2.0.0-rc.1`, `.../superpowers/superpowers/5.1.0`) — not yet deleted (this session was blocked by the permission classifier when trying `rm -rf`), waiting for the user to delete them or allow it next time. Does not affect `-Ack`/`sources.json` because `git_plugins` has no baseline to break.

---

## Standalone CLI tools/agents installed (not Claude Code skills — separate programs on the machine, 2026-08-09)

| Tool | What it does / when to use | How it was installed |
|---|---|---|
| [`witr`](https://github.com/pranshuparmar/witr) | "Why is this running?" — traces a process/port/container/file back to the chain that started it (`witr nginx`, `witr --port 5432`, `witr --tree`). Use when debugging why a process is still running | Release binary, SHA256 verified, placed at `~/bin/witr.exe` (already on PATH) — call `witr` from anywhere |
| [`ifixai-ai/iFixAi`](https://github.com/ifixai-ai/iFixAi) | Audit/score an AI agent or LLM endpoint by chosen provider+judge+suite (`ifixai setup` → `ifixai run`) — use when you want another agent's output checked against a standard | `pip install "ifixai[anthropic]"` — **tested 2026-08-09**: `ifixai run --provider mock --strategic` runs, but even mock still needs a real key for the judge model — there is no `ANTHROPIC_API_KEY` (only `ANTHROPIC_BASE_URL`), so a full run isn't possible. Not broken, just missing a key |
| [`earendil-works/pi`](https://github.com/earendil-works/pi) | Agent-building toolkit (unified multi-provider LLM API + agent runtime + TUI + coding CLI) | `npm` package `@earendil-works/pi-coding-agent` — **tested 2026-08-09: works.** The old shim had disappeared (from an interrupted npm operation); reinstalled pinned at v0.74.2 (`@latest`/0.84.1 needs Node ≥22.19.0 but the machine has v22.12.0) — `pi --version`, `pi --help`, `pi -p "..."` all behave correctly (correct file-not-found error, correctly detects a missing API key and points to `/login`). Only a provider key or OAuth login is still needed for real use |

**Uninstalled after testing showed they don't actually work (2026-08-09):**
- **`anomalyco/opencode`** (`opencode-ai`) — reinstalled 3+ times, the postinstall failed to fetch the platform binary (`EIDLETIMEOUT` every time against registry.npmjs.org). `opencode --version` unusable → uninstalled
- **`magnitudedev/magnitude`** (`@magnitudedev/cli`) — confirmed broken on Windows: alpha version 0.0.1-alpha.37 ships no Windows CLI binary (`release has 0 matching cli artifacts`) → uninstalled

**Declined to install even though the user asked directly (2026-08-09):**
- **`ultraworkers/claw-code`** — engagement stats show clear star-farming signals: 195,013★ but 109,249 forks (56%, normally 5-15%), only 1,952 watchers (~1%), repo is 4 months old + framing of "no human control at all" = a direct supply-chain risk
- **`PrimeIntellect-ai/prime-agent`** — no npm/pip package, only a `curl \| sh` installer that can install system Node/npm automatically if missing; too complex to audit with confidence — violates the rule "never run files from unvetted sources" even though the user allowed it

Full provenance + all the research (73 repos from trendshift.io): `<YOUR_VAULT_PATH>\projects\claude-skills-trendshift-2026-08\FULL-LEDGER.md`

---

## makerskills / cybersecurity-skills / marketingskills — adopted 2026-08-09

From 3 repos by Corey Haines / briiirussell that the user asked to add (a subset only, not the whole sets — see `sources.json` personal_skills for each one's baseline commit):

- **makerskills** (`coreyhaines31/makerskills`, hand-picked 6/19): `second-brain`, `decide`, `unstuck`, `skillify`, `deep-research`, `watch-video` — chosen because they fit the `<YOUR_VAULT_PATH>` vault workflow + the user's own skill-curation habits
- **cybersecurity-skills** (`briiirussell/cybersecurity-skills`, via fable-medium review 3/29): `prompt-injection`, `secrets-audit`, `dependency-audit` — skipped `threat-modeling` (borderline, not installed) and 25 others that assume a team/compliance obligations the user doesn't have
- **marketingskills** (`coreyhaines31/marketingskills`, via fable-medium review 12/46): `product-marketing`, `launch`, `copywriting`, `copy-editing`, `social`, `community-marketing`, `content-strategy`, `image`, `marketing-ideas`, `marketing-psychology`, `pricing`, `marketing-council` — picked for an indie game dev with no live SaaS/ad budget yet (skipped 34 that assume funnel/paid-ads/B2B sales infra)

---

## Identification notes (not skills, identified against trendshift.io 2026-08-08)

- **`NousResearch/hermes-agent`** (227k★) — probably the `hermes.exe` CLI that `jarvis_hermes_unified.py`
  (in `C:\Users\<YOUR_USERNAME>\Downloads\EP.6 - Hermes Integrations\`) calls. Reference only, not installed.
- **`openclaw/openclaw`** (385k★) — matches the "OpenClaw" infra mentioned in the same course material. Reference only, not installed.
- **`affaan-m/ECC`** vs `affaan-m/everything-claude-code`** — **the same repo**, GitHub renamed it (`gh repo view`
  resolves both names to the same owner ID/URL/description). `sources.json`'s `git_plugins.ecc` still points to
  `everything-claude-code.git` (works via redirect) — no need to change it, but the current name is `ECC`.

---

## How to install more skills

1. **Plugin marketplace** (has marketplace.json): `/plugin marketplace add <owner/repo>` + `/plugin install <plugin>@<marketplace>`
2. **Single-plugin repo** (has plugin.json): clone to `~/.claude/external-skills/<name>/` then copy the skill folder to `~/.claude/skills/`
3. **Standalone SKILL.md**: place it directly at `~/.claude/skills/<name>/SKILL.md`

**After installing:** Claude Code loads the skill automatically, no restart needed — then add an entry to this file
