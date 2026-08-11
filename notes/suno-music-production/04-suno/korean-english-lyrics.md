# Korean-Language Lyrics with English Code-Switching in Suno

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-08
> **Suno version notes:** Suno v5 reported best for Korean pronunciation (per web research this session — NOT yet self-verified; needs an actual Korean-language generation test)

## Core Concept

This file covers the **K-pop pattern**, not word-for-word bilingual alternation: a song written primarily in Korean, with English phrases deliberately inserted at specific structural points (most often the hook/chorus). That's a distinct thing from evenly mixing two languages throughout — the point of the pattern is that Korean carries narrative/nuance and English carries the internationally-singable hook.

Two separate problems stack here:
1. **Songwriting problem** — *where* and *how much* English to code-switch in, so it reads as authentic K-pop rather than a translated pastiche. See Practical Application.
2. **Suno-generation problem** — getting Suno to pronounce Korean correctly *and* switch cleanly into English pronunciation within the same song, without either language's phonemes bleeding into the other. See Suno Translation. This is the thinner, less-verified half.

Related: [genre-blending.md](../03-songwriting/genre-blending.md) for the general theory of combining separable genre/language components, [thai-language-lyrics.md](thai-language-lyrics.md) for the sibling file on a different Suno non-English-language case (useful for comparing what's genuinely language-specific vs. generic multilingual advice).

## Practical Application — the code-switching pattern itself

Sourced from academic analysis of actual charting K-pop songs (Billboard Hot 100/Global 200), not Suno-specific:

- **English anchors the hook/chorus; Korean carries the verse narrative.** This is the dominant, named pattern — English phrases are placed where non-Korean-speaking fans need to be able to sing along with confidence; Korean lines are placed where cultural nuance and emotional detail matter.
- **Single words/short phrases, not full sentences.** Research on actual lyrics found code-switches skew toward individual English words or short phrases dropped into an otherwise-Korean line, rather than whole English sentences. Think "fake love," "so good," "love me," "you like" — bigram-level insertions — rather than paragraph-length English verses.
- **It's frequent but bounded.** Measured code-switch counts (word-level language alternations) across charting songs: ~19/song for boy groups, ~17/song for girl groups on the Hot 100, up to ~25/song for girl groups on the more internationally-weighted Global 200 chart. That's roughly one switch every few lines, not a two-language wall of text — useful as a density calibration point when drafting.
- **It's a deliberate aesthetic/commercial choice, not filler.** The academic framing: code-switching in K-pop functions to signal global appeal while keeping Korean cultural identity intact, and to add musicality/rhythm variation English syllables provide against Korean's more even syllable timing.
- **What research did NOT establish**: no systematic grammatical "rule" for exactly which phrase types switch, and no confirmed claim about switches clustering in pre-chorus specifically vs. elsewhere beyond the general chorus/hook tendency above. Treat any more granular rule as songwriter's-ear judgment, not a documented convention.

## Suno Translation

**Contradictory guidance found — flagged, not resolved:**

- One source (hookgenius.app, Suno-specific Korean prompt guide) states plainly: **"Always use Hangul (한글), never romanized Korean"** — reasoning given is that Korean has consistent syllable structure and Suno's model handles the native script well, producing more natural phrasing.
- A second source (openmusicprompt.com, Suno K-pop guide) recommends the **opposite**: write Korean words in **romanized form with English-phonetic spelling** (e.g. "Sa-rang-hae" rather than 사랑해), using hyphens to control syllable timing, on the reasoning that this gives more precise control over pronunciation and timing when mixed with English lines.
- This directly mirrors the Mandarin characters-vs-pinyin and Thai script-vs-romanization tension noted in [thai-language-lyrics.md](thai-language-lyrics.md) — it may be a real trade-off (native script = better default phonemes; romanization = more manual control for problem syllables) rather than one source simply being wrong. **Until tested: default to Hangul for the bulk of the lyric, and fall back to romanized/phonetic respelling only for specific words that come out mispronounced** — this follows the general Suno "repair ladder" pattern (see below) rather than picking a side outright.

Practices consistent across sources:

- **Keep lines short.** Korean syllables (with batchim/받침 final consonants) carry more phonetic weight per character than English syllables; shorter lines are reported to sound more natural than long crowded ones.
- **Label language per section explicitly** if a section is meant to switch wholesale (as opposed to word-level code-switching within a line): `[Verse – Korean]`, `[Chorus – English]` as organizational markers in the lyric sheet. Note this is for section-level switches; word-level code-switches within one section are just written inline as normal.
- **Use the standard Suno mispronunciation repair ladder** (from general multilingual guidance, not Korean-specific, but plausibly transferable): try the normal spelling first → if a specific word mispronounces, respell only that word phonetically → split hard syllables with hyphens → keep the corrected spelling identical every time that word/hook repeats. Change one variable at a time per regeneration; pairs with [iteration-strategy.md](iteration-strategy.md).
- **Add clarity tags**: `[Clear Vocals]` or `[High Fidelity Vocals]` in the Style field is reported to help pronunciation clarity generally, not Korean-specific.
- **Section tags and inline performance cues stay in English** even when the sung lyric is Korean — same pattern as reported for Thai/Mandarin; these are instructions to the model, not sung text.

## Style-Field Tags for K-Pop

For calibrating the K-pop Style-field layer (works alongside the general 5-layer formula in [style-prompt-formula.md](style-prompt-formula.md)):

- **Be specific about K-pop subgenre**, not just "K-pop" — e.g. "K-Pop girl group, aggressive EDM trap beat, sassy vocals, powerful chant chorus, heavy bass drop" reads very differently from "K-Pop boy group, bright synth pop, funky guitar riff, youthful vocals, layered harmonies." Generic "K-pop" tags are reported to under-deliver on the genre's characteristic production polish.
- **Production-polish tags matter disproportionately for this genre**: "polished mix," "high production value," "idol-quality recording," "crisp high-end," "punchy beat" — K-pop's genre identity leans heavily on mix polish as a signifier.
- **Structural/arrangement tags specific to the form**: "point choreography beat drop," "addictive pre-chorus," "powerful dance break" — K-pop has a recognizable structural vocabulary (dance break, pre-chorus hook build) worth naming explicitly rather than relying on generic pop-song structure tags.
- **Vocal-arrangement tags for group sound** (if writing for a group rather than solo vocal): "mixed group vocals," "layered harmonies," "gang vocals" / "group chant," "rap and vocals" for hybrid rap/sung hybrid sections, "high note belt" for a bridge climax.
- Korean genre terms can reportedly be mixed alongside English genre terms in the Style field (e.g. "발라드" for ballad, "한국 힙합" for Korean hip-hop) — unverified whether Suno's tag parser actually weights Korean-script genre terms as reliably as English ones.

## Worked Examples

None yet — no Korean-language Suno song project exists in this vault's project folders as of this writing. The first real attempt should log here: Hangul-vs-romanized choice made (and whether it was uniform or mixed per-word), where English was code-switched in (which section, how many switches), and any mispronunciation or language-bleed observed at the Korean/English boundary within a line.

## Gotchas / Open Items — Unverified-Claim Log

**Status: everything below is "reported by external web sources, not yet self-verified"** by this project actually generating and inspecting Suno output. Promote to "self-verified" with date + observation the first time a song project tests it:

- [ ] Hangul vs. romanized Korean for Suno pronunciation quality — **actively contradictory guidance found** (see Suno Translation above), needs a direct side-by-side test to resolve, not just a single source's claim
- [ ] Whether Suno v5 specifically produces measurably better Korean pronunciation than earlier versions (claim found, no version-over-version comparison seen)
- [ ] Whether the reported English/Korean phoneme "bleed" risk at a code-switch boundary (e.g. the tail of a Korean word rolling into an English word's onset) is a real, audible Suno artifact — not found addressed directly by any source; inferred concern only, worth listening for specifically in the first test generation
- [ ] Whether `[Verse – Korean]` / `[Chorus – English]` section-language labels are actually parsed/respected by Suno's model, or just conventional lyric-sheet organization with no model effect — source presents it as a technique but doesn't demonstrate the model reliably obeying it
- [ ] Density calibration (~17-25 code-switches/song measured in real K-pop charting songs) — untested whether replicating this density in a Suno prompt actually produces a K-pop-authentic *feel*, since the measurement is about real human-written/performed songs, not about what reads well as a generation prompt
- [ ] Korean-script genre tags (발라드, 한국 힙합 etc.) in the Style field steering output as reliably as their English equivalents — unverified

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
