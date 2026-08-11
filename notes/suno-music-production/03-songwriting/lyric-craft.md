# Lyric Craft

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent

## Core Concept

> **⚠️ Scope warning (added 2026-08-09).** Everything in this file is written from **English / Western-pop assumptions** — stress-based prosody, end-rhyme, "universal language" for singalongs. Several of these are not universals; they are properties of English. Most conspicuously, **end-rhyme is not a primary device in Japanese lyrics at all**, and Japanese is mora-timed rather than stress-timed, so "stressed syllables on strong beats" has no direct Japanese equivalent. If you're writing in Japanese, read [japanese-lyric-craft.md](japanese-lyric-craft.md) **instead of**, not after, the Rhyme and Prosody guidance here; the narrative-architecture material below is the part that does transfer. No comparable audit has been done for Thai or Korean lyric convention — assume this file is English-shaped there too.

**Prosody** is the fit between a lyric's natural speech stress and the music's rhythmic stress — stressed syllables should land on strong beats (typically 1 and 3, or the backbeat 2/4 depending on phrasing), and line lengths should fit comfortably within the bar structure rather than being crammed or padded. Bad prosody is the most common reason a technically-fine lyric "doesn't sing well."

**Rhyme** creates a sense of closure/predictability at line ends; breaking an expected rhyme scheme (deliberately, once) can create a moment of surprise or emphasis — but unpredictable rhyme throughout just reads as clumsy, not artistic.

**Universal language**: anthem/rock lyrics lean heavily on "I" (personal empowerment) and "we/you" in the collective sense — language a large group of strangers can all project their own meaning onto and sing together sincerely. Highly specific, narrow imagery works against sing-along-ability even if it's more "literary."

## Narrative Architecture

Everything above is line-level craft. **Narrative architecture** is the song-level design question: what does each section's lyric *do* in the story, and how does the story move across the whole song rather than just within one verse.

**The default arc**: Verse 1 establishes the scene/situation in concrete terms (who, where, what's happening) → Verse 2 develops or complicates it (new information, escalation, a "but then...") rather than restating verse 1 in different words → Bridge is the turn — a reveal, a perspective shift, or the emotional low/high point that recontextualizes everything before it → Final chorus is sung with the same (or nearly the same) words as earlier choruses, but now lands differently because of what the bridge revealed. This last point is the highest-leverage, most underused device: **repeating the chorus lyric unchanged while the listener's understanding of it has changed** is often more powerful than writing a "bigger" final chorus lyric — see [dynamics-and-arrangement.md](dynamics-and-arrangement.md) for the parallel principle in the music (same section, heavier arrangement).

**POV and tense consistency**: decide once, at the top, whether the song is first-person present ("I am"), first-person past/reflective ("I was"), or addressed to a specific "you," and hold it — an unintentional tense or person shift mid-song (verse in past tense, chorus suddenly present tense with no reason) reads as a mistake rather than a device. Deliberate POV shifts (e.g. a bridge that switches to direct address when the rest of the song was reflective narration) are a real technique, but only work when the surrounding consistency makes the shift legible as a *choice*.

**The imagery funnel**: verses can carry concrete, specific, narrow detail (a place, an object, a specific moment) because they're doing narrative work; the chorus should pull back to more universal, abstract language (see this file's existing Universal Language guidance above) because it's the part meant to be sung along to by someone who's never lived the verse's specific story. A common lyric weakness is the reverse — vague verses and an oddly specific chorus — which undermines both the story (verses) and the sing-along (chorus) at once.

## Practical Application

- **Title placement**: put the title/hook phrase early in the chorus (ideally the first words) and repeat it — see [hooks-and-melody.md](hooks-and-melody.md) on strongest-line-first.
- **Chant-ability**: short, phonetically simple, high-vowel words shout more easily than long or consonant-heavy words — this is why chant hooks favor simple syllables.
- **Genre voice**: arena rock favors plainspoken, direct, slightly larger-than-life declarative statements ("I am alive," "give me power") over subtle or ambiguous imagery — the lyric should work shouted by a stadium, not just read on a page. Other genres will have different voice conventions — expand this section as songs in those genres are made.

## Suno Translation

Lyric text goes directly into Suno's Lyrics field with structure/performance tags interspersed — see [metatags-and-lyric-markup.md](../04-suno/metatags-and-lyric-markup.md). Prosody problems can't be fixed by tags — they need a lyric rewrite; if a generated vocal sounds awkward/cramped on a line, check whether the syllable count fits the implied bar length before assuming it's a Suno generation issue.

Narrative architecture translates through the Lyrics field alone — it's 100% author-controlled text, unlike most other musical parameters in this KB (see [controllability-map.md](../04-suno/controllability-map.md)), so a weak narrative arc is always a writing problem to fix in the lyric sheet, never a generation-quality problem to fix by regenerating or re-tagging.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — title ("SongA") repeated 40+ times, universal "I/we" empowerment language throughout, plainspoken arena-rock voice.

## Gotchas / Open Items

- Genre-voice guidance is currently arena-rock-only (a stub for other genres) — fill in as songs in other genres are produced, per the KB's "grows only through songs" rule.
- **Language-boundedness (raised 2026-08-09).** This file's Rhyme, Prosody and Chant-ability guidance is English-specific and was written as though universal. Japanese has been split out into its own file ([japanese-lyric-craft.md](japanese-lyric-craft.md)) rather than patched in here, because the divergence is large enough that mixing the two would make both harder to use. **Thai and Korean lyric convention have not been audited the same way** — the KB currently has language *mechanics* files for both ([thai](../04-suno/thai-language-lyrics.md), [korean](../04-suno/korean-english-lyrics.md)) but no equivalent *craft* file. That's a known, unfilled gap, not an oversight.

## Reference Listening

- "We Are the Champions" — Queen (universal "we" empowerment language)
- "Don't Stop Believin'" — Journey (plainspoken, large-group-singable phrasing)
- "Hey Jude" — The Beatles (simple, high-vowel chant syllables)
