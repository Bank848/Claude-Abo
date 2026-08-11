# Meta-Tags & Lyric Markup

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5, 2026-08 (per web research this session; not yet independently re-tested)

## Core Concept

Suno's Lyrics field accepts two kinds of markup, both bracketed but syntactically distinct:

- **Section tags** — square brackets `[Verse]`, `[Chorus]`, on their own line, marking structural sections (see [song-structure.md](../03-songwriting/song-structure.md) for what each section's job is). Can be extended with a short qualifier: `[Bridge - stripped, half-time]`.
- **Inline performance cues** — round-bracket parentheses `(belted)`, `(whispered)`, `(gang vocals)`, placed on their own line **immediately before** the line/section they apply to. These are directions, not sung text.

**Critical syntax rule**: cues must stay short (1-4 words) and must NOT read like a sentence — a long, sentence-like bracket instruction confuses the model about what's a direction vs. what's meant to be sung, and makes it hard to isolate which specific instruction changed a result when iterating.

## Practical Application

**Core structure tags** (reliable): `[Intro]`, `[Verse 1]`/`[Verse 2]`, `[Pre-Chorus]`, `[Chorus]`, `[Post-Chorus]`, `[Bridge]`, `[Instrumental Break]`, `[Guitar Solo]`, `[Drum Break]`, `[Build-Up]`, `[Drop]`, `[Breakdown]`, `[Outro]`, `[End]`.

**Second-pass corroboration**: this core structure list (`[Intro]`/`[Verse]`/`[Pre-Chorus]`/`[Chorus]`/`[Bridge]`/`[Instrumental Break]`/`[Guitar Solo]`/`[Outro]`/`[End]`) is described as "most reliable" consistently across multiple independent 2026 guide sites researched this session (several running 150-1000+ tag compilations) — this is the highest-confidence subset of tags found. Beyond structure tags, guides distinguish additional tag *categories* also worth tracking:
- **Voice/vocal tags**: `[Female Vocal]`, `[Male Vocal]`, `[Whisper]`, `[Falsetto]` — gender, style, and vocal-effect descriptors.
- **Instrument tags**: `[Piano]`, `[808s]`, `[Distorted Guitar]` — naming a specific instrument/sound directly as a bracket tag (distinct from folding instrumentation into the Style field — see [style-prompt-formula.md](style-prompt-formula.md)).
- **Mood/energy tags**: `[Mood: Uplifting]`, `[Energy: High]` — a labeled key:value bracket format some guides report as working, distinct from bare adjective cues.

These broader category tags (voice/instrument/mood-energy) are reported by fewer independent sources than the core structure list and use a labeled `[Key: Value]` syntax not seen elsewhere in this file's existing content — treat as a second-tier, less-corroborated claim until tested.

**Common inline cues**: `(whispered)`, `(belted)`, `(spoken word)`, `(harmonized)`, `(ad-lib)`, `(falsetto)`, `(building intensity)`, `(stripped back)`, `(call and response)`, `(group vocal)` / `(gang vocals)`, `(half-time feel)`.

**On tag reliability generally**: multiple 2026 guides converge on framing tags as "probabilistic hints, not commands" — Suno follows a given tag most of the time but can ignore it, and the reported fix when a tag is ignored is to regenerate or simplify/reword the tag rather than assume the tag is unsupported outright. This is a useful general expectation-setter layered on top of the per-tag reliability notes above.

**Placement discipline**: one concise cue directly before the moment it applies to — don't stack multiple vague cues, and don't bury an instruction inside a bracket that also contains structural info. Test one revision at a time when iterating (this pairs with the audition workflow in [iteration-strategy.md](iteration-strategy.md)).

**A separate Exclude field** exists for negatives — put unwanted elements there (`trap hi-hats, auto-tune, EDM drops`), not buried as negations inside the Style field, which reportedly causes "meaningful conflicts" in how the model weighs the prompt.

## Suno Translation

(This file IS the syntax reference — see [song-structure.md](../03-songwriting/song-structure.md) and [dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md) for the *musical* reasoning behind where to place these tags.)

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — full lyric sheet using section tags, extended qualifiers, and inline performance cues throughout.

## Gotchas / Open Items

- Which specific tags Suno "respects" vs. silently ignores is reported from external guides, not exhaustively self-tested. Treat any tag not seen working in an actual generation as unconfirmed. **As of this second research pass**: the core structure-tag list is corroborated across 3+ independent guide sites (higher confidence); the voice/instrument/mood-energy `[Key: Value]`-style tags are sourced more thinly (fewer independent confirmations, and no primary Suno-help-center source found for this specific syntax) — keep these two tiers distinct when deciding how much to trust a given tag before testing it.
- The `[Mood: Value]` / `[Energy: Value]` labeled-tag syntax specifically has not been cross-checked against Suno's own documentation — flag as the most speculative addition from this research pass.
- **⚠️ Contested (raised 2026-08-09, Japanese research pass): the "inline cues go in parentheses" rule above may be wrong.** A separate body of sources — several English Suno-formatting guides *and*, independently, multiple Japanese-language practitioner posts — consistently describe `( )` as the **sung backing-vocal / ad-lib / echo channel**, not a direction channel ("anything inside parentheses is sung as a backing vocal"), with `[ ]` as the only non-sung instruction channel. The Japanese sources arrive at this from a completely different angle: they warn that writing furigana as `時間（とき）` makes Suno sing *both* the kanji's reading and the parenthesized reading, one as a backing layer. Two unrelated communities converging on the same mechanism is stronger evidence than the single-community sourcing behind the cues-in-parentheses convention documented above. **Working interpretation until tested:** a one-word non-lexical cue like `(whispered)` may survive because the model doesn't read it as singable text, but anything in `( )` that looks like real words should be assumed sung. Put genuine directions in `[ ]`; reserve `( )` for text you actually want sung as a backing layer. Source trail: [japanese-language-lyrics.md](japanese-language-lyrics.md) § "Assigning a non-standard reading."
