# Personas & Voice Locking

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5-era UI, 2026-08 (per web research this session; feature naming/placement may shift with future versions — not yet independently re-tested)

## Core Concept

Each fresh Suno generation, by default, can produce a **different singer** even with the same Style/Lyrics input — vocal identity is not stable across regenerations unless explicitly locked. **Persona** is the feature that solves this: creating a Persona from a generation you like freezes that vocal identity (and core stylistic DNA) so future generations reuse the same "singer" instead of re-rolling a new one each time.

This is the single highest-leverage workflow move available — it converts Suno from "gambling on a new vocalist every generation" into "directing a consistent session vocalist across many takes," which is what makes iterative refinement of a specific performance possible at all.

## Practical Application

- **When to lock**: once a generation has the right grit/range/character (even if the rest of the song isn't perfect yet), create a Persona from it immediately — don't wait for a "perfect" take, since the voice and the arrangement can be iterated independently once the voice is locked.
- **What inherits the locked voice**: same-track operations — Extend, Replace Section, Cover (when combined with the Persona) — inherit the voice. **What does NOT inherit it**: a completely fresh generation without explicitly attaching the Persona.
- **Cross-song reuse**: a Persona can, in principle, be reused across multiple songs to build a consistent "artist" identity for a project — useful if a whole EP/series of songs wants the same vocalist.
- **Creation flow (per Suno's own "Introducing Personas" blog post and multiple 2025-2026 third-party guides, second research pass)**: select a generated song you like → click "create" → choose "make a persona" → set the Persona public or private. As of the guides reviewed, Persona creation draws from your own generated tracks (not arbitrary uploaded/third-party audio) — treat this as the reported mechanism, not confirmed by this project's own use.
- **v5.5 approach per Suno's own framing**: rather than a simple audio fingerprint, v5.5-era Personas are described as building "a persistent voice profile" capturing timbral qualities, resonance characteristics, and vocal texture, applied when generating new songs — a more deliberate voice-identity model than earlier versions reportedly used.

## Suno Translation

(This file is Suno-workflow-specific by nature.) Practical sequence: generate several candidates with locked lyrics (see [iteration-strategy.md](iteration-strategy.md)) → identify the best vocal take → Create Persona from it → use that Persona for all subsequent section fixes and re-tracks (see [editing-workflow.md](editing-workflow.md)).

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — iteration strategy section recommends Persona-locking after the baseline generation round.

## Gotchas / Open Items

- Exact menu location and feature name ("Persona") reflect the researched state as of this session (Suno v5.5-era) — reported, not yet independently confirmed by using the actual UI. Re-verify the workflow steps the first time this is actually used, and update this file with what's actually found.
- **Persona drift is a reported, corroborated-by-multiple-sources problem, not yet hands-on tested here**: community discussion (forums, third-party guides, second research pass) describes Personas "drifting" or being partially "ignored" over repeated generations — i.e. the locked voice is not perfectly stable even after creating a Persona, contradicting the naive expectation that Persona = guaranteed 100% voice consistency forever. Multiple independent sources (forum threads + guide sites) raise this independently, which raises confidence the phenomenon is real, but the *severity/frequency* of drift is still unmeasured by this project. Budget for occasional off-model takes even with a Persona locked, and don't assume a bad take means the Persona failed entirely.
- Persona creation being limited to the user's own prior Suno generations (vs. any uploaded audio) is reported from guide content, not confirmed against Suno's actual account UI or terms — flag for hands-on check.
- Persona feature access tier (free vs. paid-only) is inconsistently described across sources found (some call it beta/paid-exclusive, others describe general availability by 2026) — do not assume either without checking the live account UI at time of use.
