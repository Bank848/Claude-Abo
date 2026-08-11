# Editing Workflow

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5-era UI, 2026-08 (per web research this session; feature naming/placement may shift with future versions — not yet independently re-tested)

## Core Concept

Once a Persona is locked (see [personas-and-voice-locking.md](personas-and-voice-locking.md)), Suno offers targeted editing tools instead of only "regenerate the whole song and hope":

- **Replace Section** — re-roll just one tagged section (e.g., just the chorus), keeping everything else fixed. Functionally equivalent to punch-in recording / vocal comping in a real studio.
- **Extend** — continue a song from a specific timestamp with new instructions, useful for retrying a specific late-song moment (like a modulation) without re-rolling the whole track.
- **Crop** — trim unwanted material (e.g., a rambling outro or an overlong intro).
- **Cover** — re-render the same song (same melody/lyric identity) in a different Style prompt — effectively "same song, new band/production," and can be combined with a Persona to keep the same singer while changing the instrumental backing.
- **Remaster** — a polish pass on a chosen take.

**Second-pass corroboration**: multiple independent 2025-2026 guide sites (researched this session) describe a unified "song editor" interface where Replace, Extend, Crop, and Fade In/Fade Out tools are grouped together at the top of the editor, plus separate Fade In/Fade Out icons in the corners of the first/last sections — consistent with, and more specific than, the first-pass description. Crop is independently described as **lossless and subtractive** (trims audio without introducing new generated artifacts), which distinguishes it clearly from Replace Section (which re-generates new material).

## Practical Application — the producer's loop

1. **Audition** — generate several full takes with locked lyrics, judging only voice + band feel (see [iteration-strategy.md](iteration-strategy.md)).
2. **Persona-lock** the best-voiced take.
3. **Replace Section** to punch in weak sections one at a time (e.g., chorus doesn't lift, bridge meanders) — best-take-wins per section, exactly like vocal comping.
4. **Cover** to re-track the band around a good vocal (or vice versa) if the vocal is right but the instrumental isn't, or as a fallback if a modulation/structural change didn't render correctly the first time.
5. **Extend + Crop** for structural surgery — fixing a specific late-song section or trimming excess without touching earlier parts.
6. **Comp and master** — shortlist 2-3 near-final takes, judge the winner (see criteria in [iteration-strategy.md](iteration-strategy.md)), then Remaster for final polish.

**Discipline rule**: change **one variable per generation** (the singer, one section, or the style) — never multiple at once, or you can't tell what caused an improvement or regression.

## Suno Translation

(This file is itself the Suno-specific workflow layer.)

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — iteration-strategy section lays out this exact producer's-loop sequence for the SongA song specifically.

## Gotchas / Open Items

- Feature names and exact menu placement (Replace Section / Extend / Crop / Cover / Remaster) are reported from research, not yet confirmed by hands-on use in this project — update this file with corrections the first time it's actually used. **Corroborated by 2+ independent guide sources** as of this second pass for Replace/Extend/Crop specifically (naming and grouping into a unified editor panel agree across sources); Cover and Remaster naming corroborated less strongly (fewer independent sources surfaced describing them by these exact names in this pass) — treat Cover/Remaster naming as thinner-sourced than Replace/Extend/Crop.
- **New, reported-not-yet-verified**: Replace Section and Crop are described (one detailed third-party source, not cross-checked against a second) as **Pro/Premier-tier-only features** — free-tier accounts reportedly can Extend a track but cannot do in-place section replacement or cropping. If true, this affects planning: don't assume Replace Section is available on every account tier. Single-source claim, flagged for verification against Suno's actual pricing page or account UI.
- **New, reported-not-yet-verified**: large/whole-section Replace Section operations are described as needing more trial-and-error than small replacements — i.e., replacing a small tagged region is more reliable than replacing a large span in one shot. Single-source claim from this pass, not yet cross-checked or hands-on tested; if true it argues for the existing "one variable per generation" discipline extending down to "small section per Replace Section call" too.
