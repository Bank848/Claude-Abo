# Guitar — Rhythm

> **Pillar:** 2 — Instrument Technique · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent technique; Suno-translation section verified against Suno v5.5, 2026-08

## Core Concept

Rhythm guitar in rock is built almost entirely from **power chords** (root + 5th, no 3rd — see [chord-construction.md](../01-theory/chord-construction.md)) played on the low strings, because a full triad's 3rd creates dissonant mud once distortion is applied.

**Palm muting**: resting the picking-hand palm lightly on the strings near the bridge while picking, which damps the strings into a short, percussive "chug" instead of a ringing note. This is the single most important *dynamics* tool in rock rhythm guitar — not a mixing trick, a right-hand technique.

**Gain staging vocabulary**: clean (no distortion, chords ring clearly) → crunch (light overdrive, chords still distinguishable) → mid-gain (thick but chords still readable) → high-gain (heavily distorted, individual notes blur, best suited to single-note riffs or power chords, not full triads).

## Practical Application

- **Verse**: palm-muted eighth-note chugging on the open low string, punctuated by unmuted chord stabs for accents. Keeps energy driving but leaves headroom.
- **Chorus**: lift the palm mute entirely for full, ringing, open power chords. The **mute→open switch** *is* the mechanism behind "small verse, huge chorus" — it's a technique choice, not a volume/production choice.
- **Double-tracking**: recording (or requesting) the same rhythm part twice, panned left/right, is standard in rock — it's what makes a single guitarist sound like a full wall of sound.
- Strumming/picking patterns: straight eighth-note chugs are the default; "gallop" rhythms (short-short-long, borrowed from metal) add aggression; sparse stabs on strong beats only create space for vocals.

## Suno Translation

Style-field tags that reliably communicate this: `distorted power chord guitars`, `palm-muted verse riffs`, `open ringing chorus guitars`, `double-tracked rhythm guitar`. Naming the **mute→open contrast explicitly** in your tag list (rather than one generic "guitar" tag) is what separates a precise prompt from an adjective-soup one.

Judging the output: if verse and chorus guitar sound the same energy level, the dynamics device didn't land — that's a signal for a Replace Section pass on the chorus (see [editing-workflow.md](../04-suno/editing-workflow.md)), not a lyrics problem.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — Style field and production-notes section specify palm-muted verse chug vs. open chorus chords explicitly.

## Gotchas / Open Items

- Suno's actual fidelity at reproducing "palm mute vs. open" as a *within-song* dynamic contrast (vs. just picking one gain level for the whole track) is reported from research, not yet empirically confirmed across multiple generations by this project.

## Reference Listening

- "Smells Like Teen Spirit" — Nirvana (muted, tight verse riff exploding into open chorus chords)
- "Enter Sandman" — Metallica (palm-muted intro riff giving way to fuller open tone)
- "Iron Man" — Black Sabbath (chugging muted riff vs. ringing power chords)
