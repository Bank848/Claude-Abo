# API & Programmatic Access

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** as of 2026-08 (per web research this session)

## Core Concept

There is currently **no self-serve official Suno API** — no "generate an API key in account settings" flow like OpenAI/Anthropic offer. As of July 2026, Suno's CPO publicly stated they're *exploring* a developer API starting with a curated partner group, not a public launch. Meanwhile, a thriving ecosystem of **unofficial third-party "Suno API" wrapper services** exists, built by reverse-engineering/automating Suno's private web app — these work today but operate against Suno's own Terms of Service. This file exists to keep those two facts clearly separated, since third-party wrapper sites deliberately brand themselves to look official.

## Practical Application

**If you want batch/scripted song generation today, there are exactly two real paths, both with real caveats:**

1. **Apply for Suno's partner program.** On 2026-07-01, Suno CPO Jack Brody posted (LinkedIn) that Suno is exploring a developer API via a curated partner group, feeding into what press coverage described as a "partner-powered model" — with a Typeform intake for interested developers, not a public API-key signup. No endpoints, pricing, auth mechanism, or launch date have been published anywhere found. Realistic for a business/app proposing a real integration, not for a hobbyist wanting quick scripted access; no timeline or acceptance guarantee. This entire data point rests on a single executive social-media post plus press coverage of it — no official Suno blog/docs page confirms it independently, so treat the *existence of a plan* as reasonably solid (3 independent press outlets covered it) but every detail beyond "they're exploring this" as unconfirmed.

2. **Use a third-party "Suno API" reseller** (e.g. sunoapi.org, apiframe.ai, evolink.ai, sunor.cc, and others). These work right now, are cheap (reported $0.014–$0.111/song across resellers, single-source pricing comparisons, treat as indicative only), and offer generate/extend/lyrics/stem/cover endpoints with Bearer-token auth. **This is not something to use without understanding the ToS risk below.**

## Suno Translation

**ToS risk — direct and explicit, verified against Suno's own Terms of Service (suno.com/terms-of-service):**
- Suno's Conditions of Access and Use prohibit "data mining, robots, scraping, or similar data gathering or extraction methods," reverse engineering, and using Output or the Services to "power, enable or train other artificial intelligence and machine learning models, tools or technologies" or build competing products.
- Third-party "Suno API" wrapper services necessarily operate by scraping or automating the Suno web app at scale (or reusing session credentials) — i.e., they inherently conflict with the letter of these clauses. This conclusion is independently echoed by third-party commentary describing every such wrapper as "a reverse-engineered workaround, not a product Suno ships or supports."
- **Practical consequence**: accounts used behind these wrappers risk suspension/ban, and the services themselves depend on scraping techniques that can break whenever Suno changes its site — no stability guarantee. If you use one anyway, understand you're accepting both risks; this file doesn't recommend it, only describes what exists.
- One specific red flag: the docs for at least one such wrapper (docs.sunoapi.org) carry **no disclaimer** clarifying it's unaffiliated with Suno Inc. — the branding is designed to read as official, which is itself worth treating with suspicion when evaluating any "Suno API" product you encounter.

## Worked Examples

None — no song project in this vault has used any form of programmatic/scripted Suno access, official or unofficial. This file is pure landscape-mapping for a decision that hasn't come up yet.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** unless marked officially confirmed. Sourced from press coverage, Suno's own ToS text, and third-party wrapper-service documentation during this session:

- [x] No official self-serve Suno API exists as of Aug 2026 — **confirmed** by absence of any such offering across all sources checked, and by the framing of Suno's own CPO statement (exploring, partner-only, not yet launched).
- [x] Suno's ToS prohibits scraping, reverse engineering, and using output to train competing AI/ML tools — **directly confirmed** by reading the ToS text itself (primary source).
- [ ] The July 2026 partner-API exploration — existence is reasonably solid (3 independent press outlets), but whether it has since progressed (launched, expanded, scrapped) beyond the initial announcement is **unconfirmed** — this research pass found nothing more recent than the initial July 3 coverage. Re-check before relying on this as a near-term path.
- [ ] Whether using a third-party "Suno API" wrapper as an end-user (rather than operating one) carries meaningful account-level risk, vs. the risk sitting mainly with the wrapper operator — legally ambiguous, not resolved by any source found; treat conservatively (i.e., assume some risk to your own account) rather than assuming safety.
- [ ] Specific per-song pricing figures for third-party wrappers ($0.014–$0.111/song) — single-source comparison articles, some of which read as marketing for specific resellers; not independently verified.

When a claim is tested (e.g., the partner program opens publicly, or ToS enforcement against wrapper users is observed), move it out of this checklist into the relevant section above with a confirmation note and date.
