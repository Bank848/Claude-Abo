# Vocals

> **Pillar:** 2 — Instrument Technique · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent physiology; Suno-translation section verified against Suno v5.5, 2026-08

## Core Concept

**Registers**: chest voice (the "speaking voice" register, powerful but limited range before straining), head voice (lighter, higher, less powerful-sounding), **mixed voice** (a blend that carries chest-voice power into higher notes without the strain of pushing pure chest too high), falsetto (breathy, disconnected high register, distinct sound from mixed voice). Arena/anthem vocals want a **chest-dominant mix** — pure chest dragged too high cracks or sounds like shouting; pure head sounds weak for the genre.

**The passaggio**: the transition zone between chest and head registers. Singing *in* this zone in mixed voice is what reads as "reaching/heroic" to a listener — it's audibly effortful in a way that communicates power, which is why chorus melodies for this genre are often written to peak right in this zone rather than staying safely in the middle of the range.

**Grit/rasp physiology**: NOT vocal-fold damage. It's produced by the **false folds (ventricular folds)**, positioned above the true vocal folds, vibrating or rattling loosely against the airflow *on top of* a cleanly, fully-supported note underneath. A well-produced gritty note has a clean tone as its foundation with grit layered on top — audibly, the grit can "switch on" partway through a sustained note. **Vocal fry** (a low, creaky texture) is a related but distinct technique used at phrase *onsets* for attitude, not sustained through a belted note.

**Breath support (appoggio)**: inhaling low and wide (ribs expand sideways, belly releases) then *resisting* the ribcage's natural collapse throughout the phrase, keeping air pressure steady rather than squeezed. Counter-intuitively, grit needs *moderate, steady* pressure — pushing harder air at a gritty note causes strain, not more power.

## Vocal Harmony Arranging

**Stacking intervals**: a harmony line is defined by its interval from the lead melody, and the interval choice changes the emotional color. **Parallel 3rds** (harmony a third above or below, moving in lockstep with the lead) is the default, warmest, most consonant choice — the sound of most pop/rock backing vocals. **Parallel 6ths** (equivalent to a 3rd inverted, harmony below moving in the same lockstep) reads slightly more open/spacious than a 3rd above. **Parallel 5ths** are starker, more open and less "sweet" — associated with rock power and, in some contexts, a deliberately colder or more ancient-sounding texture; used sparingly compared to 3rds. **Octave doubling** (same melody, one octave up or down) adds size and weight without adding harmonic color at all — this is closer to double-tracking (see Practical Application below) than to true harmony.

**Two arranging shapes**: **block harmony** (a full chord — 2 to 4+ distinct pitches stacked at once, moving together, "choir" texture) vs. **two-part harmony** (a single added line, lead + one harmony, the lightest and most common backing-vocal texture in verses-to-choruses). Block harmony is the heavier, more "produced/gospel" texture; two-part is the default first move for any chorus that needs lift without becoming a wall of sound.

**Backing-vocal roles distinct from harmony-on-the-melody**: **response/echo lines** (a short backing phrase answering the end of the lead's line, call-and-response — see [dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md)) don't harmonize the lead simultaneously, they alternate with it. **Oohs/aahs pads** (wordless, sustained backing vocals used as a textural bed, functionally closer to a synth pad than a lyric — see [keys-and-synths.md](keys-and-synths.md) for the patch-role parallel) sit under the lead rather than answering or doubling it. **Word-doubling** (backing vocalist sings the *same* words as the lead, slightly under it in volume) reinforces a key line (often a title/hook phrase) without adding harmonic color.

**Genre defaults**: pop/rock choruses default to two-part 3rds; gospel/soul favor full block harmony (see the R&B/Soul row in [genre-conventions.md](../03-songwriting/genre-conventions.md)); doo-wop-lineage ballads use block harmony as a genre-defining signature (see the Ballad/Acoustic row); arena rock's "gang vocals" (already covered below) are a unison/loose-doubling texture, not a harmonized one — don't confuse the two when tagging.

## Practical Application

- **Range mapping**: for a typical male rock tenor, conversational verse melody sits low (roughly B3-E4), chorus peaks land in the passaggio (roughly F#4-A4), with one true "money note" sustained near the top (G4/A4) — not the whole chorus at peak, since a sustained peak needs surrounding contrast to register as a peak.
- **Delivery styles**: belt (full-voice, powerful, sustained), spoken word (rhythmic speech, no pitched melody), chant (simple, repeated, crowd-joinable), whisper (intimate, used for maximum contrast before a loud section).
- **Vocal production choices**: double-tracking (same vocal recorded/generated twice, layered) adds size; harmonies reserved for choruses only (not verses) make the hook feel like a payoff rather than a constant; gang vocals (multiple looser, layered voices) simulate a crowd/band-mates joining in, distinct from tight studio harmony.
- **Dynamic arc across a song**: verse held back/intimate → pre-chorus climbing → first chorus strong but not maximal → bridge/breakdown pulled back hard (even to a whisper) → final chorus at full power with ad-libs. The quiet moment right before the final chorus is what makes it land as "huge" — see [dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md).

## Suno Translation

Style-field tags: `powerful gritty male lead vocals`, `double-tracked lead vocal`, `backing harmonies on the chorus` (ask for this explicitly by name — research indicates Suno tends to keep verses vocally lean and only adds layered harmonies when told to). Inline lyric cues: `(belted)`, `(whispered)`, `(spoken word)`, `(falsetto)`, `(ad-lib)`, `(gang vocals)`, `(call and response)` — placed on their own line immediately before the line/section they apply to.

**Harmony-specific tags**: `stacked harmonies in 3rds` or `two-part harmony in 3rds on the chorus` for the default lockstep sweetening; `open 5th harmonies` when a starker texture is wanted; `octave-doubled vocal` for size without color; `full block harmony, gospel choir` for the heaviest texture; `wordless oohs and aahs backing vocal pad` for the textural-bed role; `(harmonies)` as an inline cue on its own line to mark exactly where a stacked line should enter, same placement convention as the other inline cues above.

Judging output: does the chorus vocal sound like it's "reaching" (passaggio effort) rather than comfortably sitting in the middle of the range? Does grit sound like a texture on a supported note, or like strain/shouting? Strain is a signal to regenerate with adjusted vocal-character tags, not a signal the song itself is wrong.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — full dynamic map by section, range targets, and explicit vocal-coach-level grit/breath-support explanation in the addendum.

## Gotchas / Open Items

- Whether Suno's vocal model is actually simulating true chest/mixed/head-voice mechanics or just pattern-matching on training audio labeled with these words is unknown/unverified — treat the tags as "the words that produce the closest output," not proof the underlying model understands vocal physiology.
- Whether Suno reliably distinguishes a specific named interval (3rds vs. 5ths vs. octave) in its harmony output, or just produces "some form of harmony" regardless of which interval is named, is unverified — the Vocal Harmony Arranging section above is researched theory, not yet checked against a real generation.

## Reference Listening

- "Livin' on a Prayer" — Bon Jovi (mixed-voice belting through the passaggio)
- "Don't Stop Believin'" — Journey (Steve Perry's grit layered on a clean, supported tone)
- "Nothing Else Matters" — Metallica (whisper-to-belt dynamic arc across a song)
