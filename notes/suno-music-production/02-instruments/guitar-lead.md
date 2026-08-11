# Guitar — Lead / Solo

> **Pillar:** 2 — Instrument Technique · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent technique; Suno-translation section verified against Suno v5.5, 2026-08

## Core Concept

Lead guitar in rock draws primarily from the **minor pentatonic scale** (see [scales-and-keys.md](../01-theory/scales-and-keys.md)) because every note in it sounds "safe" over the underlying chord changes — it's why pentatonic soloing is the default vocabulary rather than something requiring careful note-by-note chord-matching.

**"Chord-safe" playing**: choosing scale notes that work across the whole progression rather than changing scale per chord — pentatonic scales are chosen precisely because they stay safe across an entire chorus's chord changes without the player needing to track each chord individually.

**Expressive techniques** (what makes a note read as "guitar-y" rather than just correct pitch):
- **Bend** — physically pushing a string sideways to raise its pitch smoothly into the next note (half-step or whole-step bends are most common). The single most "arena rock" gesture that exists.
- **Vibrato** — rapid small pitch oscillation on a held note, adds sustain/emotion.
- **Slide** — sliding a fretted finger from one note to another without re-picking.
- **Hammer-on/pull-off** — sounding a note by fretting-hand motion alone (no pick), for fast, fluid runs.

## Practical Application

- **Solo construction**: state a short 1-2 bar phrase, then repeat it (often an octave higher) rather than playing continuously different material — repetition-with-variation is what makes a solo memorable rather than "impressive noodling."
- **Melodic vs. shred**: a solo that quotes or answers the chorus vocal melody is more memorable to a general listener than pure technical display — melodic solos serve the song, shred solos serve the guitarist.
- **Call-and-response with vocal**: leave gaps in the vocal line for the guitar to "answer," and vice versa — this is the same call-and-response principle as [hooks-and-melody.md](../03-songwriting/hooks-and-melody.md), applied to an instrumental voice.

## Suno Translation

Style-field tags: `pentatonic guitar solo`, `melodic guitar solo` (vs. `shred guitar solo` if that's actually wanted), `soaring lead guitar`. Section tag `[Guitar Solo]` on its own line marks where it happens structurally — see [metatags-and-lyric-markup.md](../04-suno/metatags-and-lyric-markup.md).

Judging output: a good arena-rock solo should be hummable, not just technically busy — if a generated solo sounds like scales run up and down without a clear repeated phrase, that's a signal to regenerate with `melodic guitar solo` weighted higher or push more toward vocal-melody-quoting language in the prompt.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — solo specified as E minor pentatonic, 12th position, built around a whole-step bend with vibrato, quoting the chorus melody shape.

## Gotchas / Open Items

- None currently flagged; revisit after the first generated solo is judged against this file's criteria.

## Reference Listening

- "Sweet Child O' Mine" — Guns N' Roses (Slash's solo — melodic, bend-driven, quotes the riff)
- "Comfortably Numb" — Pink Floyd (Gilmour's bends/vibrato, melodic over shred)
- "Free Bird" — Lynyrd Skynyrd (pentatonic solo building in intensity)
- "Hotel California" — Eagles (harmonized melodic solo, call-and-response phrasing)
