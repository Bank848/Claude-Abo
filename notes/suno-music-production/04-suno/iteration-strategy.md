# Iteration Strategy

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5, 2026-08 (per web research this session; not yet independently re-tested)

## Core Concept

Because Suno generations vary even from the same prompt, getting a great result is an **iterative search process**, not a one-shot prompt-and-done process. The discipline that makes iteration actually converge (rather than randomly wander): **change exactly one variable per generation**, so any difference in the result can be attributed to that one change.

Reported field data: roughly 70% of initial tracks in community discussion required 3+ regenerations before the genre/feel actually "stuck" — treat multiple rounds as the normal path, not a sign something's wrong with the prompt. **Second-pass note**: this specific "70%, 3+ regenerations" figure is repeated across multiple 2026 guide sites, but tracing it back, the sources point to the same underlying origin — an analysis of roughly 150 r/SunoAI threads from late 2025 — rather than to independent measurements. That means it is **repeated by many sources but not independently corroborated**; treat it as one data point that has been widely cited, not as confirmed by convergent independent evidence. The associated framing — that the failures were mostly caused by vague/unspecific prompts, not a Suno limitation — is consistent with this file's own emphasis on the one-variable-per-round discipline.

## Practical Application

**Defined iteration axes** (pick ONE to vary per round):
- **Vocal axis** — swap vocal-character tags (e.g., `polished 80s rock production` ↔ `raw modern rock production`, or `gritty male lead vocals` ↔ `raspy powerful male vocals`).
- **Energy axis** — swap tempo/intensity tags (e.g., `128 BPM` ↔ `140 BPM`, `stomp-clap stadium drums` ↔ `pounding double-time stadium drums`).
- **Style axis** — swap broader genre/era descriptors.

**Audition-round protocol**: generate 6-10 takes with locked lyrics and the baseline Style/Exclude prompt. In this first pass, judge ONLY voice quality and overall band feel — not song quality yet. This separates "did we cast the right singer" from "is the song good," which are different questions with different fixes (see [personas-and-voice-locking.md](personas-and-voice-locking.md) and [editing-workflow.md](editing-workflow.md) respectively).

**Judgment criteria** for picking a winner:
- Hummable after one listen (tests the melodic hook — see [hooks-and-melody.md](../03-songwriting/hooks-and-melody.md)).
- Chorus survives at low volume (tests whether the "lift" is real harmonic/melodic contrast, not just loudness — see [dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md)).
- Crowd-chantable (tests the chant/hook layer specifically, relevant for anthem-style material).

## Suno Translation

(This file is itself the Suno-specific process reference — see [editing-workflow.md](editing-workflow.md) for the full producer's-loop sequence that follows the initial audition round.)

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — 3-generation audition plan (baseline, vocal-axis variant, energy-axis variant) with explicit judgment criteria.

## Gotchas / Open Items

- The "70% need 3+ regenerations" statistic is reported from community discussion research, not measured directly by this project — treat as a rough expectation-setter, not a precise figure. **As of this second research pass**: the figure is cited by multiple 2026 guide sites, but all traced sources appear to derive from a single underlying analysis (~150 r/SunoAI threads, late 2025) rather than from independently repeated measurements — so despite appearing "corroborated by many sources," it is more accurately a single-origin statistic that has been widely repeated. Downgrade confidence accordingly versus a claim with genuinely independent sources; still not self-verified by this project.
