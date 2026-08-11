# Knowledge Base Index

Reusable reference material for song production with Suno AI — cross-project knowledge, not tied to any single song folder. Originally built for `<YOUR_SONGS_DIR>\`, kept here in the vault since it's general music/Suno knowledge, not project-specific. Read this file first, then load only the 2-3 topic files relevant to the song task at hand — don't load the whole KB into context at once.

**Scope note (v2):** arena-rock/80s-stadium content is fully worked and cross-checked against a real generated song (sourced from `<YOUR_SONGS_DIR>\SongA_suno_prompt.md` — see note below). **Update (2026-08-07):** that song's actual audio has now been measured (BPM/key-arc/loudness-arc/lyrics), not just planned — result is *partial* self-verification: lyrics/structure/late-key-lift held up, but measured BPM ran faster than tagged and the claimed sharp verse/chorus dynamic contrast didn't clearly show up in the loudness data. See the prompt file's "🎧 ผลวิเคราะห์เสียงจริง" section for the full comparison before treating every Arena Rock claim below as proven. Pop/Anthem, Blues/Classic Rock, Ballad/Acoustic, Hip-Hop/Trap, EDM/Electronic, Country, R&B/Soul, Metal/Hard Rock, Luk Thung, and Mor Lam profiles are now also fully worked but **researched only, not yet self-verified** by producing an actual song in those genres — see [genre-conventions.md](03-songwriting/genre-conventions.md). The KB grows only through songs: each new song promotes its general lessons here (and upgrades a genre from "researched" to "self-verified") rather than staying trapped in a song-specific file.

**Scope note (v3, 2026-08-07):** added conceptual-gap coverage identified in a dedicated research pass — genre-blending theory, a Suno controllability map, keys/synth technique vocabulary, vocal-harmony arranging, arrangement roles (the vertical/register axis of arrangement), named-groove rhythm vocabulary, a unified tension-and-release model, song-level lyric narrative architecture, and two Thai genre profiles (Luk Thung, Mor Lam). All new/expanded files below are marked accordingly.

**Scope note (v4, 2026-08-07):** added Suno-the-platform operational mechanics not previously covered — credits/economics, audio-upload/reference-audio workflows, stem export & remix, API/programmatic access (and its ToS risk), mobile vs. web feature gaps, and a version-changelog-tracking section appended to [limits-and-gotchas.md](04-suno/limits-and-gotchas.md). All five new files are researched-only (not self-verified hands-on) and several flag genuinely contradictory findings between Suno's own help-center pages — see each file's Gotchas section before relying on tier-gating or limit claims.

## Start-here reading order for a new song

0. [00-workflow/song-brief-template.md](00-workflow/song-brief-template.md) — fill this out first; it produces an adaptive reading-order checklist for the rest of this list based on your specific song.
1. [03-songwriting/genre-conventions.md](03-songwriting/genre-conventions.md) — check if your genre has a worked profile or is a stub. Blending two genres, or a genre this KB hasn't worked yet? Read [genre-blending.md](03-songwriting/genre-blending.md) too.
2. [04-suno/style-prompt-formula.md](04-suno/style-prompt-formula.md) — the tag-writing formula. Cross-check any tag you're unsure about against [04-suno/controllability-map.md](04-suno/controllability-map.md) before finalizing the prompt.
3. [03-songwriting/song-structure.md](03-songwriting/song-structure.md) + [hooks-and-melody.md](03-songwriting/hooks-and-melody.md) — plan the skeleton and the hook.
4. Relevant [01-theory](01-theory/) + [02-instruments](02-instruments/) files for the chords/technique you're specifying, including [02-instruments/mixing-and-production.md](02-instruments/mixing-and-production.md) for production-quality tags.
5. [04-suno/metatags-and-lyric-markup.md](04-suno/metatags-and-lyric-markup.md) — write the tagged lyric sheet. Writing in a non-English language? Read the matching file first: [Thai](04-suno/thai-language-lyrics.md) · [Korean](04-suno/korean-english-lyrics.md) · [Japanese](04-suno/japanese-language-lyrics.md). For Japanese, also read [japanese-lyric-craft.md](03-songwriting/japanese-lyric-craft.md) **before** [lyric-craft.md](03-songwriting/lyric-craft.md) — the latter's rhyme/prosody guidance is English-specific and does not transfer.
6. [04-suno/iteration-strategy.md](04-suno/iteration-strategy.md) + [editing-workflow.md](04-suno/editing-workflow.md) — the generate/refine loop once you're in Suno.

## Pillar 0 — Workflow (`00-workflow/`)

| File | Covers |
|---|---|
| [song-brief-template.md](00-workflow/song-brief-template.md) | Fill-in-the-blank song brief worksheet; produces a per-song adaptive reading-order checklist across all 4 pillars |

## Pillar 1 — Music Theory (`01-theory/`)

| File | Covers |
|---|---|
| [scales-and-keys.md](01-theory/scales-and-keys.md) | Major/minor/pentatonic scales, relative major/minor, key selection |
| [chord-construction.md](01-theory/chord-construction.md) | Triads, power chords, Roman-numeral naming, chord function, sus/borrowed chords |
| [progressions-by-genre.md](01-theory/progressions-by-genre.md) | Workhorse progressions (i-VI-VII, I-V-vi-IV, 12-bar blues...); Arena Rock, Pop, Blues/Classic Rock, Ballad/Acoustic worked (Arena Rock self-verified, rest researched-only) |
| [key-relationships-and-modulation.md](01-theory/key-relationships-and-modulation.md) | Relative-major pivot mechanism, pivot chords, truck-driver modulation |
| [rhythm-and-meter.md](01-theory/rhythm-and-meter.md) | Time signature, backbeat, syncopation, BPM ranges, half/double-time, **named groove vocabulary (four-on-the-floor, boom-bap, dembow, motorik...)** |
| [tension-and-release.md](01-theory/tension-and-release.md) *(new)* | Unified tension model beyond chord progressions — harmonic rhythm, rhythmic subdivision, textural density/register, silence |

## Pillar 2 — Instrument Technique (`02-instruments/`)

| File | Covers |
|---|---|
| [guitar-rhythm.md](02-instruments/guitar-rhythm.md) | Power chords, palm muting, gain staging, double-tracking |
| [guitar-lead.md](02-instruments/guitar-lead.md) | Pentatonic soloing, bends/vibrato/slides, solo construction |
| [bass.md](02-instruments/bass.md) | Root vs. walking bass, approach notes, kick-lock, tone |
| [drums.md](02-instruments/drums.md) | Kit vocabulary, backbeat, fills, ghost notes, stomp-clap patterns |
| [keys-and-synths.md](02-instruments/keys-and-synths.md) *(new)* | Patch taxonomy (pad/pluck/stab/arp/lead/808), comping vs. sustain vs. arpeggio roles, per-genre synth/keys defaults |
| [vocals.md](02-instruments/vocals.md) | Registers/mixed voice, passaggio, grit physiology, breath support, dynamic arc, **vocal-harmony arranging (3rds/5ths/6ths stacking, block vs. two-part, backing-vocal roles)** |
| [mixing-and-production.md](02-instruments/mixing-and-production.md) | EQ frequency ranges, compression, reverb/delay types, gain staging, and their Suno Style-field tag proxies |

## Pillar 3 — Songwriting Craft (`03-songwriting/`)

| File | Covers |
|---|---|
| [song-structure.md](03-songwriting/song-structure.md) | Section types and their jobs, common templates, section-length norms |
| [hooks-and-melody.md](03-songwriting/hooks-and-melody.md) | Hook taxonomy, singability rules, repetition-without-monotony |
| [dynamics-and-arrangement.md](03-songwriting/dynamics-and-arrangement.md) | Quiet/huge contrast levers (horizontal/time axis), build techniques, ear candy |
| [arrangement-roles.md](03-songwriting/arrangement-roles.md) *(new)* | Vertical/register axis of arrangement — the 5 arrangement roles, register allocation, vocal-pocket clearing, counterpoint-lite (countermelody, instrumental call-and-response) |
| [genre-blending.md](03-songwriting/genre-blending.md) *(new)* | Genre-as-separable-components model, compatibility checks, worked hybrid archetypes (country-trap, EDM-pop, funk-rock, city-pop/R&B) |
| [lyric-craft.md](03-songwriting/lyric-craft.md) | Prosody, rhyme, universal language, chant-ability, **song-level narrative architecture (scene→development→bridge-turn→recontextualized final chorus, POV/tense consistency, imagery funnel)**. ⚠️ **English-shaped** — carries a scope warning; use the Japanese file below when writing in Japanese |
| [japanese-lyric-craft.md](03-songwriting/japanese-lyric-craft.md) *(new)* | Japanese lyric convention (作詞) where it **diverges from** `lyric-craft.md`'s English assumptions — why end-rhyme is marginal and what 韻/母音踏み actually is, what carries サビ hookiness instead, 漢語/和語/外来語 register control, English-in-J-pop as decoration rather than K-pop-style code-switching, and pronoun choice (僕/私/俺/君/あなた) as characterization |
| [genre-conventions.md](03-songwriting/genre-conventions.md) | Per-genre profile table — Arena Rock, Pop, Blues/Classic Rock, Ballad/Acoustic, Hip-Hop/Trap, EDM/Electronic, Country, R&B/Soul, Metal/Hard Rock, Luk Thung, Mor Lam, **J-Pop/Anime Ballad** worked (Arena Rock self-verified, rest researched-only) |

## Pillar 4 — Suno Mastery (`04-suno/`)

| File | Covers |
|---|---|
| [style-prompt-formula.md](04-suno/style-prompt-formula.md) | 5-layer Style field structure, tag budget/expansion |
| [controllability-map.md](04-suno/controllability-map.md) *(new)* | Lookup table — which musical parameters Suno reliably controls, through which channel (Style tag / Lyrics field / slider), and fallbacks when uncontrollable |
| [metatags-and-lyric-markup.md](04-suno/metatags-and-lyric-markup.md) | Section tags, inline performance cues, Exclude field syntax |
| [personas-and-voice-locking.md](04-suno/personas-and-voice-locking.md) | Persona workflow for consistent vocalist across generations |
| [editing-workflow.md](04-suno/editing-workflow.md) | Replace Section / Extend / Crop / Cover / Remaster, the producer's loop |
| [sliders-and-excludes.md](04-suno/sliders-and-excludes.md) | Style Influence / Weirdness / Audio Influence, Exclude list building |
| [model-version-selection.md](04-suno/model-version-selection.md) *(new)* | v3.5→v5.5 version ladder — obedience-vs-fidelity tradeoff, v5's "fewer instructions" inversion of normal prompt advice, per-genre version fit (heavy genres favor v4.5), free-vs-paid gating — researched-only |
| [iteration-strategy.md](04-suno/iteration-strategy.md) | One-variable-per-generation discipline, audition protocol, judgment criteria |
| [limits-and-gotchas.md](04-suno/limits-and-gotchas.md) | Character/tag limits, version changelog, unverified-claim tracking |
| [thai-language-lyrics.md](04-suno/thai-language-lyrics.md) | Thai tonal-language singing challenges, script vs. romanization, community-reported quirks — all unverified pending a real generation test |
| [korean-english-lyrics.md](04-suno/korean-english-lyrics.md) *(new)* | K-pop Korean+English code-switching pattern (English on hook/chorus, Korean on verse narrative, density ~17-25 switches/song), Hangul-vs-romanization for Suno (contradictory sources — flagged unresolved), K-pop Style-tag vocabulary — researched-only, pending a real generation test |
| [japanese-language-lyrics.md](04-suno/japanese-language-lyrics.md) | Japanese kanji-reading ambiguity as a Suno failure mode with no Korean/Thai equivalent; native-script-over-romaji; the **kana-respelling ladder** (rung 0–4) with long-vowel normalization and 文節 spacing; why furigana/parentheses fail and what that means for the 運命→さだめ device; the は/へ/を particle fix (hiragana wins); numbers/loanwords; **mora-to-note fitting and vowel placement backed by peer-reviewed sources** — researched-only, pending a real generation test. *Substantially expanded in a second pass 2026-08-09* |
| [duets-and-multiple-vocalists.md](04-suno/duets-and-multiple-vocalists.md) | Duet/call-and-response tag vocabulary, per-line speaker labels, distinct-voice consistency across a song |
| [instrumental-tracks.md](04-suno/instrumental-tracks.md) | Generating vocal-free tracks — toggle/tag/lyrics-field mechanisms and Style-field adjustments |
| [sound-design-and-fx-tags.md](04-suno/sound-design-and-fx-tags.md) | Style-field vocabulary for risers, sweeps, impacts, tape stop, and other non-instrument FX |
| [credits-and-economics.md](04-suno/credits-and-economics.md) *(new)* | Subscription tiers, credit costs per action, no-rollover/fallback behavior, budgeting advice for heavy iteration |
| [audio-upload-and-reference.md](04-suno/audio-upload-and-reference.md) *(new)* | Upload Audio feature, Cover-from-upload, the Audio Influence slider, upload length-limit contradictions in Suno's own docs |
| [stems-and-remix.md](04-suno/stems-and-remix.md) *(new)* | Suno Studio stem separation (Auto/Split-from-Mix/Advanced Split), credit costs, DAW-handoff claims, in-app remix vs. external stem export |
| [api-and-automation.md](04-suno/api-and-automation.md) *(new)* | No official self-serve API yet (partner program only); ToS risk of third-party "Suno API" wrapper services |
| [mobile-vs-web.md](04-suno/mobile-vs-web.md) *(new)* | Confirmed desktop-only tools (Studio, Crop/Edit Details), account sync, which surface to use for detailed prompt-crafting |

## Song files (not part of this vault — case studies)

Song-specific prompt files live in `<YOUR_SONGS_DIR>\` (a separate, non-vault project folder), not here. This KB cites them as worked examples but doesn't duplicate their content.

- `<YOUR_SONGS_DIR>\SongA_suno_prompt.md` — arena rock anthem, the source worked example cited throughout this KB.
- `<YOUR_SONGS_DIR>\SongB_suno_prompt.md` — Korean ballad, male/female duet; planned, not yet generated.
- `<YOUR_SONGS_DIR>\SongC_suno_prompt.md` — Japanese cinematic-orchestral cover ("Orange" by 7!!); the first Japanese-language test in this project, planned, not yet generated.
- `<YOUR_SONGS_DIR>\SongD_suno_prompt.md` (renamed 2026-08-09 from KaenPenPhayan — song title changed to พิณเป็นพยาน to match the phin-lead instrumentation) — Mor lam sing pop-crossover, male/female duet with mixed Isan-dialect vocabulary; the first Thai-language test in this project, planned, not yet generated.

**Scope note (v6, 2026-08-09):** second, deeper Japanese research pass. [japanese-language-lyrics.md](04-suno/japanese-language-lyrics.md) roughly tripled — three of pass 1's four open contradictions are now resolved or properly characterized, one pass-1 claim is **retracted** (that Suno's editing tools can't repair a mispronounced word), and the mora/melody half is now backed by peer-reviewed linguistics rather than inference. New file [japanese-lyric-craft.md](03-songwriting/japanese-lyric-craft.md) (Pillar 3) covers Japanese lyric convention proper. Two knock-on findings affect files outside the Japanese pair: (1) **[metatags-and-lyric-markup.md](04-suno/metatags-and-lyric-markup.md)'s "performance cues go in parentheses" rule is now contested** — converging evidence from two unrelated communities says `( )` is Suno's *sung* backing-vocal channel and `[ ]` is the only instruction channel; (2) **[lyric-craft.md](03-songwriting/lyric-craft.md) is English-shaped** and now carries a scope warning — its rhyme/prosody guidance does not transfer to Japanese, and Thai/Korean have not been audited for the same problem.

**Scope note (v5, 2026-08-09):** added Japanese-language coverage — [japanese-language-lyrics.md](04-suno/japanese-language-lyrics.md) (Pillar 4) and a J-Pop/Anime Ballad profile in [genre-conventions.md](03-songwriting/genre-conventions.md) (Pillar 3). Both researched-only. Notable: for Japanese the native-script-over-romanization question came back *uncontradicted* (unlike Korean), but a second, Japanese-only question opened in its place — how much to pre-respell kanji into kana — where sources genuinely conflict.
