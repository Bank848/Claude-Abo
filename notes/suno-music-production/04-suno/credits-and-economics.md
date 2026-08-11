# Credits & Economics

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5-era pricing/credit system, 2026-08 (per web research this session — NOT yet self-verified against an actual account's credit ledger)

## Core Concept

Every Suno action — generate, Extend, Cover, Remaster, stem export — draws from a **credit pool** that resets on a schedule tied to your subscription tier, not a per-song dollar cost. Knowing the shape of that pool matters directly for [iteration-strategy.md](iteration-strategy.md)'s "change one variable per generation, expect 3+ rounds" discipline: that discipline assumes iteration is cheap enough to do liberally. It usually is, but re-rolls, Extends, and Covers all draw from the same pool as a fresh generation, so a session that leans heavily on those operations burns credits faster than the naive "credits ÷ 5 per song" math suggests.

## Practical Application

**Subscription tiers** (officially confirmed, help.suno.com):

| Tier | Monthly | Annual (per mo) | Credits/period |
|---|---|---|---|
| Free | $0 | — | 50/day, resets daily (UTC), strictly use-it-or-lose-it |
| Pro | $10 | $8 | 2,500/month |
| Premier | $30 | $24 | 10,000/month |

- A suno.com/pricing fetch during this research pass returned prices ~20% lower ($8/$6.40 Pro, $24/$19.20 Premier) than every other source checked — likely a stale cache, region-specific price, or a promo caught mid-flight. **Treat $10/$30 (monthly) and $8/$24 (annual) as the reliable figures**, but re-check the live pricing page before budgeting, since Suno changes pricing/promos often.
- **No rollover**: subscription credits do not carry over month to month or day to day (officially confirmed). Purchased top-up credits do persist, but require an active subscription to spend.
- **Fallback behavior**: once Pro/Premier monthly credits run out, the account drops to the same 50/day free-tier allotment until the next billing cycle — but commercial-use rights on songs made during that fallback period stay intact while the subscription remains active (officially confirmed).

**Cost per action** (baseline generation cost is corroborated/derived; other actions are thin):
- Standard generation (2 clips): **~10 credits total (~5 credits/clip)**. Not stated as a single fixed number in Suno's own docs, but derivable and consistent across 3+ third-party sources, and matches the tier math (2,500 credits ÷ 5 ≈ "up to ~500 songs" as advertised for Pro; 10,000 ÷ 5 ≈ "up to ~2,000 songs" for Premier).
- **Extend, Cover, Remaster, Upload-based generation: exact credit costs are NOT confirmed anywhere.** The only substantive source found (a third-party blog, single-source) describes them only as "roughly the same ballpark as a fresh generation" — hedged language, not hard numbers. No official Suno source gives exact figures for these four actions. Budget for these as if they cost about as much as a full generation until verified otherwise.
- Stem export costs ARE documented with specific numbers — see [stems-and-remix.md](stems-and-remix.md) (Auto Split 50 credits, Split from Mix / Advanced Split 10 credits/stem).

**Budgeting advice for someone iterating a lot** (mostly single-source, third-party opinion — flagged as such):
- Track *clips*, not *songs* — re-rolls and regenerations are the actual credit drain, not the "final" song count.
- Scout ideas cheaply first (locking in style/lyrics direction) before chasing final-take polish, so expensive iteration rounds aren't spent on a direction that gets abandoned.
- Prefer Replace Section / Extend over full regeneration once a take is mostly right (see [editing-workflow.md](editing-workflow.md)) — a full regenerate re-spends the whole ~10-credit cost on parts of the song that were already fine.
- Pro's ~500-songs/month ceiling sounds generous but shrinks fast once Extend/Cover/re-roll costs (each roughly another full generation's worth of credits, per the thin sourcing above) are counted against it — don't plan a heavy-iteration project assuming the full 500 is available for *finished* songs.

## Suno Translation

(This file is itself the Suno-specific economics reference — see [iteration-strategy.md](iteration-strategy.md) for the audition/regeneration discipline this budget constrains, and [editing-workflow.md](editing-workflow.md) for which operations are credit-cheaper than a full regenerate.)

## Worked Examples

None yet — no song project in this vault has tracked actual credit spend against a generation session. The first project that does should log here: tier used, rough credits spent per finished song (including re-rolls/Extends/Covers), and whether the ~5-credit/song baseline held up in practice.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** unless marked officially confirmed. Sourced from Suno's own help-center articles plus third-party pricing/guide sites during this session, not confirmed by this project spending actual credits and checking the resulting balance:

- [x] Subscription prices ($10/$30 monthly, $8/$24 annual) and credit allowances (2,500 Pro / 10,000 Premier / 50-daily Free) — **officially confirmed** by help.suno.com, corroborated by 4+ independent third-party sources.
- [x] No-rollover policy and monthly/daily refresh timing — **officially confirmed** by help.suno.com.
- [x] Fallback-to-free-tier behavior when monthly credits are exhausted, with commercial rights preserved — **officially confirmed** by help.suno.com.
- [ ] ~5 credits/song (~10 credits/generation) baseline — corroborated across 3+ third-party sources and consistent with official tier math, but not a number Suno states directly anywhere found; treat as strongly-derived, not officially confirmed.
- [ ] Exact credit cost of Extend, Cover, Remaster, and Upload-based generation — **thin, single-source, hedged language only** ("roughly the same ballpark"). This is the single biggest gap in this file — worth a direct in-app check (generate something, note credit balance before/after each action type) the first time a song project has spare budget to spend on the experiment.
- [ ] Top-up credit pricing (~$8 per 2,500 credits / ~$24 per 10,000 credits) and whether top-up credits expire — single-source, plausible (matches subscription per-credit rate) but not officially confirmed.

When a claim is tested, move it out of this checklist into the "Practical Application" section above with a confirmation note and date.
