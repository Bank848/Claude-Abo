# Song Structure

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent

## Core Concept

A song's structure is a sequence of sections, each with a distinct **job**:

- **Intro** — establishes mood/energy before vocals fully commit; often shorter than people assume (don't make listeners wait).
- **Verse** — narrative/detail section; lower energy, sets up contrast for the chorus.
- **Pre-chorus** — a short transitional ramp that builds tension pointing at the chorus (not always present, but powerful when used — see [dynamics-and-arrangement.md](dynamics-and-arrangement.md)).
- **Chorus** — the emotional/melodic peak and the section most likely to be remembered; carries the hook.
- **Post-chorus** — an optional short tag after the chorus, often chant-like, extending the hook.
- **Bridge** — a contrasting section, harmonically and/or texturally different, placed late in the song to avoid the final choruses feeling like pure repetition.
- **Breakdown** — a stripped-back, low-density section, usually used as a contrast-reset before a final build.
- **Build** — rising energy/density leading into a climax.
- **Solo** — instrumental feature section.
- **Outro** — wind-down or, in anthem material, a final full-energy tag.

## Practical Application

**Common full templates**:
- Pop/rock standard: Intro → Verse 1 → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Bridge → Chorus (x2, often with a key change) → Outro.
- Anthem/arena variant: adds a stripped-back Breakdown before the final Build → double Chorus, to maximize contrast before the climax (see [dynamics-and-arrangement.md](dynamics-and-arrangement.md)).

**Section-length norms**: verses and choruses are typically 4-8 bars; pre-choruses shorter (2-4 bars) since their job is a quick ramp, not a destination. Total runtime for this genre typically 3-4 minutes — listeners expect the first chorus within roughly 45-60 seconds.

**Where listeners expect payoffs**: the first chorus is the first promise-keeping moment; if it's delayed too long (long intro, long first verse), the song risks losing casual listeners before it pays off.

## Suno Translation

Structure is expressed directly with bracketed section tags — see [metatags-and-lyric-markup.md](../04-suno/metatags-and-lyric-markup.md) for exact syntax. Deciding structure *before* writing lyric-cue tags is the right order of operations: pick the template, place the sections, THEN fill in performance cues within them.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — full tagged structure: Intro → Verse 1 → Pre-Chorus → Chorus x2 → Post-Chorus → Verse 2 → Pre-Chorus → Chorus → Guitar Solo → Breakdown → Build-Up → Chorus x2 → Outro.

## Gotchas / Open Items

- None currently flagged.

## Reference Listening

- "Don't Stop Believin'" — Journey (canonical verse/pre-chorus/chorus template)
- "Livin' on a Prayer" — Bon Jovi (pre-chorus ramp, bridge, key-change final choruses)
- "Radioactive" — Imagine Dragons (breakdown-into-build-into-climax arc)
