# Model Version Selection

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-09
> **Suno version notes:** covers the v3.5 → v5.5 timeline as of 2026-08; version list will keep growing — treat the "current" label as a snapshot, not a permanent fact

## Core Concept

"Settings" in Suno isn't just the Style/Lyrics text fields and the [sliders-and-excludes.md](sliders-and-excludes.md) sliders — **which model version generates the song is itself a setting**, and it's the one most likely to be left on default/unexamined by someone who only thinks in terms of prompt text. Different versions aren't strictly "newer = better" — they trade off obedience-to-prompt, audio fidelity, genre strengths, and max generation length differently enough that picking one deliberately is a real lever, not a housekeeping detail. This file exists because prompt-writing knowledge (the rest of this KB) is wasted if the model version underneath is fighting the prompt's intent.

## Practical Application — the version ladder

Reported from 2026 guide research (multiple independent sites), not yet self-verified against this project's own side-by-side generations:

| Version | Released | Character | Best for |
|---|---|---|---|
| v3.5 | Summer 2024 | "Dumber but more obedient" — lower audio fidelity, but follows detailed/complex instructions with more mechanical precision than newer models, which sometimes override literal instructions with their own judgment | When you need precise, unusual, or highly specific instructions followed exactly, and can tolerate lower audio polish |
| v4 | Nov 2024 | Improved vocal quality over v3.5 | Superseded by later versions for most purposes; rarely the first choice in 2026 |
| v4.5 | May 2025 | Up to 8-minute first generation, better prompt adherence than v4; reportedly tuned especially well for **heavy/dense genres** (metal, EDM, distorted/high-energy production) — described as handling these better than even v5 | Heavy genres, and any song needing the longer 8-minute generation ceiling |
| v4.5+ | Jul 2025 | Incremental production-tooling update over v4.5 | Same use case as v4.5 with minor improvements |
| v5 | Sep 2025 | Higher audio quality, more "authentic"-sounding vocals; reportedly performs *better* with fewer, clearer instructions — over-specifying can fight the model rather than help it | Professional-feeling audio quality with a cleaner, less padded prompt |
| v5.5 | Mar 2026 (current stable) | "Personalization revolution" — adds voice cloning and custom style training on top of v5's quality | Voice-cloning/persona-locked projects (see [personas-and-voice-locking.md](personas-and-voice-locking.md)); otherwise similar territory to v5 |

**Access note**: the free tier reportedly runs v4.5-all (a variant released Oct 2025), not v5 or v5.5 — those sit behind paid plans. Worth checking current account tier before assuming a version is available.

**The v3.5-vs-v5 prompt-writing tension is the one worth internalizing**: this KB's general prompt-writing guidance (detailed, layered Style-field tags per [style-prompt-formula.md](style-prompt-formula.md)) assumes a model that rewards specificity. That assumption reportedly holds for v3.5/v4.5 but **inverts for v5/v5.5**, where guide sources report the model does better with fewer, cleaner instructions and can fight an over-padded prompt. If a v5/v5.5 generation is coming out worse than expected despite a carefully detailed prompt, trimming the prompt down is a real hypothesis to test before assuming the tags themselves are wrong.

## Suno Translation

- Model version is selected in the generation UI (not a Style-field tag) — it's a setting, not something written into the prompt text itself.
- This file's guidance interacts directly with [sliders-and-excludes.md](sliders-and-excludes.md): a v3.5 generation with high Style Influence is a "maximum obedience" combination; a v5 generation with a trimmed prompt and moderate Weirdness is closer to "trust the model" territory. These aren't independent settings — version choice changes what the sliders are even doing.
- For genre-specific routing: this KB's [genre-conventions.md](../03-songwriting/genre-conventions.md) profiles don't currently note per-genre version recommendations — the one concrete signal found is heavy/distorted genres reportedly favoring v4.5 over v5. Worth testing directly rather than assuming v5.5 (the newest) is automatically right for every genre.

## Worked Examples

None yet — no song project in this vault's folders has run a controlled same-prompt, different-version comparison. The first one that does should log here: which versions were tried, what differed in the output, and whether the "v5 wants fewer instructions" claim held up in practice.

## Gotchas / Open Items — Unverified-Claim Log

- [ ] Whether v5/v5.5 actually perform worse with heavily-detailed prompts (vs. v3.5/v4.5) — reported by guide sites, not tested by this project
- [ ] Whether v4.5 genuinely outperforms v5 specifically for heavy/distorted genres, or whether this is dated guidance from before a v5 update narrowed the gap
- [ ] Exact current free-vs-paid version gating (which versions are available on which plan) — changes over time as Suno ships updates; re-check before relying on a specific version being available
- [ ] Whether voice cloning (v5.5's headline feature) changes anything about the vocal-character prompting guidance in [vocals.md](../02-instruments/vocals.md), or is purely additive

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
