# Scales & Keys

> **Pillar:** 1 — Music Theory · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent (music theory doesn't change with software versions)

## Core Concept

A **key** is the home note (tonic) and scale a song is built from — it tells you which notes sound "right" together. A **scale** is an ordered set of notes from that home note. Two scales matter most for directing rock/pop songs:

- **Major scale** — the "happy/bright" 7-note scale (in C: C-D-E-F-G-A-B). Chorus payoffs and triumphant sections usually land in a major key or pivot toward one.
- **Natural minor scale** — the "moody/driving" 7-note scale (in A: A-B-C-D-E-F-G). Verses and tension sections usually live here.
- **Minor pentatonic** — the minor scale with the 2nd and 6th degrees removed (in E: E-G-A-B-D). This is rock's working scale: every note sounds good over the chords, which is why it's the default for riffs and guitar solos — see [guitar-lead.md](../02-instruments/guitar-lead.md).

**Relative major/minor**: every minor key has a "relative major" that shares the exact same notes, just centered on a different home note. E minor and G major share E-F#-G-A-B-C-D — same seven notes, different gravity. This relationship is the single most useful fact in this file; see [key-relationships-and-modulation.md](key-relationships-and-modulation.md) for how it's used structurally.

Modes (Dorian, Mixolydian, etc.) are the major scale started from a different degree, each with a distinct flavor (Mixolydian = major scale with a flattened 7th, gives a bluesy/classic-rock color). You don't need to derive them — just recognize the sound: Mixolydian shows up in a lot of classic rock riffs (e.g., the "not quite major, not quite bluesy" color).

## Practical Application

- Pick the key by vocal range first, not guitar convenience — see [vocals.md](../02-instruments/vocals.md) for range mapping. Then choose the guitar-friendly key nearest that range.
- **E minor / G major** is the most common home for rock: E minor lets rhythm guitar riff on the open low E string (maximum weight with minimum effort), and G major puts a belted chorus melody in a powerful part of a male rock tenor's range.
- Minor-key verse → relative-major chorus is a reusable structural trick, not a one-off: write the verse feeling grounded/tense in the minor, then let the chorus "arrive" in the relative major.

## Suno Translation

Suno's Style field treats **key loosely** — putting "E minor" in the tag string rarely locks the actual key of the generation. Spend your limited tag budget on things Suno reliably honors instead (genre, BPM, instrumentation, vocal type — see [style-prompt-formula.md](../04-suno/style-prompt-formula.md)). Key is something you judge by ear in the output, not something you can force via the Style field.

What key theory IS useful for in Suno work:
1. **Describing the melodic shape you want** in lyric-cue language (e.g., "(building intensity)" cues before a pre-chorus that should climb).
2. **Judging whether a generation nailed the "lift"** — if the chorus doesn't feel like it opened up, the model likely didn't do the relative-major pivot; try a fresh generation or a Cover pass (see [editing-workflow.md](../04-suno/editing-workflow.md)).

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — verse in E minor, chorus pivoting to G major (relative major), BPM/key reasoning section.

## Gotchas / Open Items

- Suno's actual internal handling of explicit key tags is unverified/unconfirmed by this KB — reported as unreliable based on community consensus, not empirically tested by us yet.

## Reference Listening

- "Sweet Child O' Mine" — Guns N' Roses (minor pentatonic riff/solo vocabulary)
- "Sweet Home Alabama" — Lynyrd Skynyrd (Mixolydian coloring on the main riff)
- "Zombie" — The Cranberries (natural minor verse, driving/moody)
- "Here Comes the Sun" — The Beatles (bright major-scale optimism)
