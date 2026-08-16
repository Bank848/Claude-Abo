# Bookmarked repos (2026-08) — trendshift.io, not relevant to current workflow yet

Someday/maybe list. Sourced from a batch of 37 trendshift.io trending repos originally cross-referenced
against the installed Claude Code skill/plugin set (see [[claude-skills-trendshift-project]] — the
`<YOUR_VAULT_PATH>\projects\claude-skills-trendshift-2026-08\` work). 6 of the 37 (plus `Nutlope/hallmark`, added
separately) matched the actual workflow closely enough to get a real evaluation — those live in
`projects/claude-skills-trendshift-2026-08/LINK-VERIFICATION.md` and `CANDIDATE-EVALUATION.md`, one was
adopted (`hallmark`).

These 31 didn't match anything currently in use (Claude Code skill library, design/UI,
this Obsidian vault, cost-aware model routing) — but no reason to lose the pointer. If a future need shows
up that matches one of these, come back here first before re-researching from scratch.

Metadata (description · language · ★) as fetched 2026-08-08/09 — stars will have drifted since.

## AI/agent infra & tooling
- **ifixai-ai/iFixAi** — Independent auditing of AI agents ("is the agent doing what it's supposed to?") · Python · 7,053★
- **cloudflare/computer** — "Give your agent a computer" (agent computer-use sandbox) · TypeScript · 6,125★
- **h4ckf0r0day/obscura** — Headless browser for AI agents and web scraping · Rust · 20,680★ (alt to Scrapling if that one's ever inadequate)
- **cloudflare/cloudflare-os** — Agent workspace on Cloudflare Workers for docs/apps/agents with company context · TypeScript · 6,417★
- **esengine/DeepSeek-Reasonix** — DeepSeek-native AI coding agent for the terminal, prefix-cache-stable · Go · 32,988★ (alt agent CLI, not Claude Code)
- **huangruiteng/loopx** — Lightweight loop-engineering state kernel for long-running agent teams (Codex/Claude Code agnostic), durable goals + quota-aware auto-wake · Python · 3,486★ (possible future `/loop` companion if session-durability needs grow)
- **666ghj/MiroFish** — General-purpose swarm-intelligence prediction engine · Python · 70,674★

## Document/content processing
- **magicrew/doc7** — Turns documents into AI-ready Markdown with visual understanding · Go · 719★ (overlaps `markitdown`, revisit only if markitdown hits a wall)
- **huohua325/Memslides** — Hierarchical memory framework for personalized presentation agents · Python · 1,087★
- **LiamGvchi/gc-minimal-zine-poster** — Codex skill for minimal zine-style editorial poster prompts/images · (no language listed) · 4,507★

## LLM inference / local model engineering
- **lyogavin/airllm** — Run 70B-parameter LLM inference on a single 4GB GPU · Jupyter Notebook · 30,007★
- **FareedKhan-dev/kimi-k3-in-c** — 2.78T-parameter Kimi K3 inference on a single CPU in 8.24GB RAM, portable C99 · C · 3,479★

## Infra / self-hosted tools (no current need, but generically useful)
- **aceberg/WatchYourLAN** — Lightweight network IP scanner with notifications/history/Grafana export · Go · 7,353★
- **floci-io/floci** — Free AWS Local Emulator alternative · Java · 18,802★
- **pranshuparmar/witr** — Traces any process/port/container/file back to what started it, CLI+TUI · Go · 19,985★
- **goauthentik/authentik** — Self-hosted authentication/identity provider · Python · 23,776★
- **trycompai/crm** — Open-source, agentic-first CRM · TypeScript · 7,596★
- **usekaneo/kaneo** — Open-source project management tool · TypeScript · 7,660★
- **block/buzz** — "A hive mind communication platform" · Rust · 25,119★
- **bashalarmistalt/decimen-optical-transfer** — no description available at fetch time · TypeScript · 5,216★ (unverified, check again before trusting)

## Consumer / one-off apps
- **ronaldo-avalos/Maya** — Wraps iPhone screen recordings in a device frame with cinematic zoom, exports shareable video · Swift · 628★
- **Shrey113/Android-Dex** — Full desktop experience from any Android device over Wi-Fi, scrcpy-powered · HTML · 883★
- **genspark-ai/genoffice** — AI-native office suite (word/spreadsheet/presentation/PDF) for macOS/Windows · TypeScript · 2,210★

## Education / reading material (nothing to install, just worth knowing exists)
- **rasbt/LLMs-from-scratch** — Implement a ChatGPT-like LLM in PyTorch step by step · Jupyter Notebook · 101,100★
- **microsoft/AI-For-Beginners** — 12-week, 24-lesson AI course · Jupyter Notebook · 63,359★
- **microsoft/generative-ai-for-beginners** — 21-lesson generative AI course · Jupyter Notebook · 116,996★
- **bojieli/ai-agent-book** — Chinese-language book on AI agent design/engineering practice, source+PDF+code · Python · 34,533★
- **xdash/FDE-the-Guidance-Book-of-Forward-Deployed-Engineer** — Chinese-language guide to becoming a "Forward Deployed Engineer" · (no language listed) · 3,570★

## Deliberately out-of-scope categories (listed for completeness, not endorsement)
These two were excluded by the *original* spec on purpose, not just "not relevant right now" — kept here
only so the full 37 are accounted for somewhere, not because they're candidates:
- **opa334/Dopamine** — semi-untethered iOS 15-26 jailbreak · C · 5,669★ (jailbreak tooling, out of scope on principle)
- **TauricResearch/TradingAgents** — multi-agent LLM financial trading framework · Python · 96,125★ (trading bot, out of scope — this assistant doesn't execute trades or give investment advice regardless)
