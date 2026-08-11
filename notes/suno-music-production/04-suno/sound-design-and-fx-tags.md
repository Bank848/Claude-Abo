# Sound Design & FX Tags

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5, August 2026 (per web research this session, not yet independently re-tested)

## Core Concept

Beyond instruments and vocals, Suno's Style field also responds (with varying reliability) to **non-instrument texture and transition vocabulary** — risers, sweeps, impacts, surface noise (vinyl crackle, tape hiss), reverse-swell transitions, and ambient/foley texture layers. These aren't performed by a named instrument; they're production/sound-design language borrowed from mixing and film-scoring vocabulary. Research this session found two competing views on *where* this vocabulary belongs: some guides treat it as ordinary Style-field texture tags (alongside `lo-fi`, `reverb-drenched`); others specifically warn that inline lyric-field cues (bracket or asterisk syntax) are unreliable "guaranteed sound-effect commands" and recommend describing the effect in the Style field plus, at most, a short placement cue in the Lyrics field near the moment it should occur — not relying on the lyric field alone.

## Practical Application

- **Prefer Style-field description over lyric-field asterisk syntax for reliability.** Research specifically flags that brackets, parentheses, and asterisks (e.g. `*riser*`, `*whoosh*`, `*gunshots*`) placed directly in the Lyrics field can influence a generation but are not a guaranteed effect command — the more reliable pattern is to name the effect as a Style-field tag and, if precise placement matters, add a short section-adjacent cue in the Lyrics field rather than relying on the asterisk alone.
- **Where these fit the 5-layer tag structure**: sound-design/FX vocabulary belongs in the same territory as the "Production/era reference" layer (layer 5) of [style-prompt-formula.md](style-prompt-formula.md), and can also reinforce layer 4 (mood) — a `tape stop` or `vinyl crackle` tag is simultaneously a texture choice and an era/mood signal. Don't spend tag budget describing FX in more than one or two tag slots; expand a single tag with detail rather than adding many separate FX tags (same "expand, don't multiply" discipline as the rest of the Style field).
- **Where in the song's arc to use them**: transitions and builds are the natural home — a riser or white-noise sweep into a `[Build-Up]` or `[Drop]` section tag, a reverse-cymbal swell arriving on the downbeat of a new section, an impact/hit marking a structural hard cut. Intros and outros are the other common spot — vinyl crackle or tape hiss at a song's very start signals "vintage" before a single instrument plays, and a tape-stop effect is a common outro device. See [dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md) for the general build/contrast levers this vocabulary serves — FX tags are one concrete way to execute the "build tension into a payoff" and "quiet-before-huge" patterns described there.
- **Pair FX tags with the structural tag they support**, not as a standalone Style-field flourish — e.g. put the riser tag in the Style field *and* place `[Build-Up]` at the matching point in the Lyrics field, rather than expecting a Style-field-only FX tag to land at the right moment in the song without a structural anchor.

## Suno Translation

**Reported Style-field tag vocabulary** (reliability not independently confirmed — see Gotchas):

- **Transitions/builds**: `riser`, `white noise sweep`, `synth sweep`, `reverse cymbal swell`, `reverse swell`
- **Impacts**: `impact hit`, `sub-bass hit`, `cinematic impact`
- **Surface noise / era texture**: `vinyl crackle`, `tape hiss`, `tape stop`, `lo-fi crackle`
- **Ambient/foley texture**: `ambient texture`, `field recording texture`, `radio static`, `lo-fi transition`

**Lyrics-field placement**: a short cue (e.g. `(riser into chorus)`) placed on its own line immediately before the section it precedes, following the same inline-cue discipline as [metatags-and-lyric-markup.md](metatags-and-lyric-markup.md) — short, not sentence-like, and paired with (not a replacement for) the Style-field tag.

## Worked Examples

None yet in this vault's song projects — `<YOUR_SONGS_DIR>\SongA_suno_prompt.md` (arena rock) doesn't lean on sound-design/FX vocabulary beyond ordinary production tags covered in [mixing-and-production.md](../02-instruments/mixing-and-production.md). The first song using a riser, tape-stop, or similar FX tag deliberately should log here whether the Style-field tag alone was audible in the output, or whether the paired Lyrics-field cue was needed to get it to land at the right moment.

## Gotchas / Open Items

- **Research came back thin overall** — most sources covering these tags are secondary guide/blog sites (tag-glossary and "how to" content), not official Suno documentation, and none of them report a systematic test of which specific FX words are actually respected versus ignored. Treat every tag listed above as "the kind of word community guides suggest," not as confirmed-working vocabulary.
- **The asterisk-syntax reliability question is itself unsettled** — one source describes asterisks as usable "inline function calls for sound effects," while another explicitly warns they're not a guaranteed command and recommends avoiding the lyrics field for FX in favor of the Style field. This KB defers to the more cautious source (Style-field-primary) as the safer default, but the disagreement itself hasn't been resolved by direct testing.
- No source found this session ran or reported a direct before/after comparison isolating a specific FX tag's audible effect (e.g. generating the same song with and without `vinyl crackle` and confirming a difference) — the whole area is unverified pending an actual generation test, consistent with this file's "Suno version notes" hedge.
- Cross-reference: general tag-count and character-limit caution from [limits-and-gotchas.md](limits-and-gotchas.md) applies here too — FX tags compete for the same 8-15 effective tag budget as genre/instrument/mood tags, so treat them as an addition worth their slot, not a free extra.
