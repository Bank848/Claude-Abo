# Chord Construction

> **Pillar:** 1 — Music Theory · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent

## Core Concept

A **triad** is a 3-note chord built by stacking two 3rds on a root note (root, 3rd, 5th). The 3rd determines major (bright) vs. minor (dark) quality. A **power chord** drops the 3rd entirely — just root and 5th — which removes the major/minor color and stays clean under heavy distortion (a distorted 3rd creates dissonant overtones/"mud"; a bare 5th doesn't). This is why rock rhythm guitar is written in power chords, not full triads.

**Roman-numeral naming** describes a chord's role relative to the key, not its absolute pitch — this lets you talk about progressions independent of what key they're actually in. Uppercase = major, lowercase = minor. In a major key: I-ii-iii-IV-V-vi-vii°. In a minor key: i-ii°-III-iv-v-VI-VII. This is how `progressions-by-genre.md` describes patterns that work in any key.

**Chord function** — every chord in a key has a role:
- **Tonic** (I or i) — home, resolved, stable.
- **Dominant** (V) — maximum tension, wants to resolve back to tonic. A V→I move is the strongest resolution in tonal music.
- **Subdominant** (IV or iv) — a step away from home, sets up the dominant.

**Suspended chords** (sus2/sus4) replace the 3rd with the 2nd or 4th degree — no major/minor color, just tension, and they almost always resolve back to the plain triad a beat later (Dsus4 → D is a classic move).

**Borrowed chords** — a chord pulled from the parallel key (e.g., borrowing minor iv from G minor while the song is in G major) for a color that doesn't naturally belong. Used sparingly for a single emotional gut-punch, not as a structural pillar.

## Practical Application

- Rock rhythm guitar = power chords (5ths) almost exclusively, especially under distortion. Save full triads for clean/acoustic sections.
- The Dsus4→D move at the end of a pre-chorus (four-beat suspension resolving right on the chorus downbeat) is one of the cheapest, most reliable tension-into-release devices in the genre — see [key-relationships-and-modulation.md](key-relationships-and-modulation.md).
- A single borrowed minor chord (e.g., swapping IV for iv once near the end of a song) reads as "bittersweet" — use it once, not as a hook.

## Suno Translation

Suno doesn't take chord symbols as input — you can't type "G-D-Em-C" into the Style field and get that progression. Chord knowledge here is for:
1. **Communicating genre/mood accurately** in your Style tags (e.g., knowing that "power chords" is a real, meaningful instrument-technique tag, not filler — see [guitar-rhythm.md](../02-instruments/guitar-rhythm.md)).
2. **Judging output** — if a chorus doesn't have the expected V→I resolution feel, that's a signal to regenerate rather than a signal you did something wrong in the prompt.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — full verse/pre-chorus/chorus progression written out with function analysis (Dsus4→D, borrowed Cm).

## Gotchas / Open Items

- None — this file is stable music theory, not Suno-version-dependent.

## Reference Listening

- "Smells Like Teen Spirit" — Nirvana (power-chord rhythm guitar under distortion)
- "Iron Man" — Black Sabbath (bare root-5th power chords, no 3rd)
- "Pinball Wizard" — The Who (suspended-chord riff resolving to the triad)
- "Creep" — Radiohead (borrowed chord — the non-diatonic Cm for a gut-punch)
