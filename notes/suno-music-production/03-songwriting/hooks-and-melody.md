# Hooks & Melody

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent

## Core Concept

A **hook** is any element — melodic, rhythmic, lyrical, or instrumental — designed to grab attention and lodge in memory. The psychology behind it: the brain rewards pattern recognition, so a phrase that repeats in a predictable-but-pleasing way gets learned quickly and feels satisfying each time it returns. Repetition + simplicity is the core formula behind both "hooks" and "earworms" — an earworm is just a hook that's succeeded completely.

**Hook taxonomy** (a song usually layers more than one):
- **Melodic hook** — a memorable pitch contour (the tune itself).
- **Rhythmic hook** — a memorable rhythm pattern, independent of exact pitches.
- **Lyric hook** — a memorable phrase/title, often the most-repeated line.
- **Chant/title hook** — a lyric hook specifically designed for group participation (short, simple, shoutable).
- **Instrumental hook** — a riff, lick, or figure (guitar, bass, brass) that defines the song's identity.

## Practical Application

**Singability rules** (what makes a melody easy for a crowd to join on first listen):
- Small note counts per phrase — long, busy runs don't get learned in one pass.
- "Leap then hold" shapes — a bigger interval jump followed by a sustained note is easier to remember and physically easier to sing along to than constant small stepwise motion.
- Phrases starting on the downbeat (beat 1), not syncopated — see [rhythm-and-meter.md](../01-theory/rhythm-and-meter.md) — so a crowd can predict when to come in.
- Put your **strongest line first** in any section — the opening line of a chorus gets disproportionate melodic weight/attention from a listener (and, per research, from Suno's own generation behavior — see [style-prompt-formula.md](../04-suno/style-prompt-formula.md)).

**Verse vs. chorus melody contrast**: verse melodies are typically low and conversational (near-spoken); chorus melodies jump higher and hold longer notes. This contrast is itself a hook mechanism — the chorus's arrival is felt as a melodic event, not just a lyrical one.

**Repetition without monotony**: repeat the hook, but change the surrounding texture each time (add harmony on the 2nd chorus, strip to just chant on a post-chorus, add ad-libs on the final chorus) — see [dynamics-and-arrangement.md](dynamics-and-arrangement.md). The words repeat; the sound around them doesn't.

**Call-and-response**: splitting a line between a lead voice and an answering voice (crowd, backing vocal, or instrument) teaches participation — it implicitly shows the listener how to join in, which is part of why it's such a reliable technique for anthem material.

## Suno Translation

Keep choruses to 2-4 lines (longer choruses spread melodic weight too thin, per research on how the model treats section length). Write the title/hook word early and often. Use inline cues like `(call and response)` and `(gang vocals)` at the exact lines meant for crowd-style delivery — see [metatags-and-lyric-markup.md](../04-suno/metatags-and-lyric-markup.md).

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — title repeated 40+ times across the song, every hook kept to ≤4 notes, explicit call-and-response placement, texture-change-per-repeat structure documented in the "why it's catchy" section.

## Gotchas / Open Items

- The "2-4 line chorus, strongest line first" guidance is reported from external research on Suno's generation behavior specifically, not a general songwriting universal — flagged as Suno-specific, not yet self-verified by this project.

## Reference Listening

- "Seven Nation Army" — The White Stripes (melodic/instrumental riff hook)
- "Smoke on the Water" — Deep Purple (instrumental hook that defines the song's identity)
- "Hey Jude" — The Beatles (chant hook — the "na-na-na" outro)
- "Livin' on a Prayer" — Bon Jovi (call-and-response "whoa-oh" gang vocals)
