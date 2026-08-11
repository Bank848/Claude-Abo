# Japanese Lyric Craft (作詞)

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-09
> **Suno version notes:** version-independent (this is craft, not platform mechanics)

## Why this file exists

[lyric-craft.md](lyric-craft.md) is written almost entirely from English/Western-pop assumptions — stress-based prosody, end-rhyme schemes, "universal language" for singalongs. Several of those are **properties of English, not universals**. The largest divergence: **end-rhyme is not a primary device in Japanese lyrics.** A writer who imports the English rhyme-scheme habit into a Japanese lyric produces something that reads as either childish or translated.

This file covers the Japanese-specific half. It pairs with:

- [japanese-language-lyrics.md](../04-suno/japanese-language-lyrics.md) — the *mechanics* half: getting Japanese out of Suno correctly, plus mora-to-note fitting and vowel placement (which are craft, but live there because they're inseparable from the mora/pronunciation material).
- The J-Pop / Anime Ballad profile in [genre-conventions.md](genre-conventions.md) — genre-level conventions (Aメロ/Bメロ/サビ, 王道進行, ochi-sabi).

**Honesty status: researched only, not self-verified.** No song in this project has yet been written to these conventions. Source strength is graded inline throughout, because it varies enormously here — some claims rest on peer-reviewed corpus linguistics, others on a single blogger's argument, and several things a reader might expect to find were **not found at all** and are marked as such.

⚠️ **Recovery note, stated for auditability:** the research for this file was done in two stages and the intermediate report was lost before it reached this file. The citations below were **re-verified directly** against source pages, but a few quantitative results were only available as PDFs whose text could not be extracted — those are marked "citation confirmed, figures not extracted." Do not treat those as though numbers were checked.

## Core Concept — rhyme (韻) works differently, and this is the big one

### End-rhyme is structurally weak in Japanese, and this is not a matter of taste

The mechanism is grammatical, not aesthetic. Japanese is **agglutinative and verb-final**: sentences overwhelmingly end in a small closed set of predictable inflections — 〜た, 〜ない, 〜てる, 〜だろう, 〜けど, 〜から, copula 〜だ/です. End-rhyme is therefore **trivially easy and consequently meaningless**: two lines ending in 〜た "rhyme" by grammatical accident, so a listener reads the match as grammar, not as craft. Contrast English, where line-final words are lexical (open class), so a rhyme is a *choice* the writer had to hunt for and the listener hears as one.

Two further structural facts compound it: Japanese has only **five vowels** (so vowel coincidence is cheap), and its **CV mora structure** means almost every line ends on one of those five open vowels anyway.

> **Practical rule:** do not build a Japanese lyric around an end-rhyme scheme (ABAB, AABB). It is not a device Japanese pop uses as a load-bearing structure, and imposing one tends to force grammatically parallel line-endings, which sounds like a list.

*(Source strength: this is standard descriptive linguistics about Japanese morphology, and it is the explicit premise of 細川貴英's book chapter titled, in effect, "why rhyming in Japanese is hard" — see below. Treat the mechanism as solid; treat "therefore J-pop doesn't do it" as the contested part, immediately below.)*

### What Japanese uses instead: 母音踏み — vowel-sequence matching, positioned anywhere

The Japanese device is **matching the sequence of vowels across a span**, not matching a final syllable. Because each mora is (C)V, you can strip a phrase to its vowel skeleton and match *that*:

- しんじゅく (shi-n-ju-ku) → i-u-u
- Any other phrase whose vowel skeleton is i-u-u rhymes with it, regardless of consonants.

Consequences that make this a genuinely different craft from English rhyme:

- **It is length-scalable.** Matching 2 morae is trivial; matching 5–7 morae across a whole phrase is the impressive version. The unit of rhyme is a *phrase*, not a word-ending.
- **Position is free.** Because the match is a vowel sequence, it can sit at the head of a line, in the middle, or straddle a word boundary. Head-position and internal matching are the normal cases, not exceptions.
- **Consonants are a similarity gradient, not a binary.** ⭐ **Strongest single finding in this file:** Kawahara Shigeto, *"Half rhymes in Japanese rap song lyrics and knowledge of similarity,"* **Journal of East Asian Linguistics 16: 113–144 (2007)** — a large-scale corpus study showing that when Japanese rappers rhyme imperfectly, **the likelihood that two consonants are allowed to pair correlates with their phonetic similarity**: similar pairs like {m–n}, {t–s}, {r–n} rhyme frequently; dissimilar pairs like {m–ʃ}, {w–k}, {n–p} rarely do. So a Japanese "half rhyme" is a measurable, gradient thing, and speakers evidently have tacit knowledge of consonant similarity. *(Peer-reviewed; the highest-authority source in this file.)*

### Japanese hip-hop vs. J-pop — a real split, not a spectrum

Japanese hip-hop **did** import rhyme as an explicit, foregrounded value (韻を踏む as a named skill, evaluated by listeners, subject to the density and length one-upmanship Kawahara's corpus measures). J-pop did not adopt it on the same terms — in J-pop, vowel-matching where it occurs is largely **submerged**: a texture the listener feels rather than an achievement the listener scores.

**Practical read:** if you're writing something hip-hop-adjacent, rhyme is a foreground device and denser/longer is better. If you're writing a J-pop ballad, rhyme should be **inaudible as technique** — you may use it, but the moment the listener notices you rhyming, the register has shifted toward comedy or rap.

### ⚠️ The one genuine unresolved disagreement — keep it open

- **Dominant position:** end-rhyme is structurally weak and historically near-absent in Japanese verse (classical Japanese poetry is built on **mora counting** — 5-7-5, 5-7-5-7-7 — not on rhyme; rhyme was never a formal feature of the tradition the way meter was).
- **The dissent:** **細川貴英, 『声に出して踏みたい韻』(オーム社)** — a dedicated rhyme researcher whose whole thesis is that J-pop is in fact **full of rhyme that listeners don't consciously notice**, with Mr.Children and Ozawa Kenji singled out in interviews as exceptionally skilled at it. Notably, his own book contains a chapter on *why Japanese rhyming is difficult* — so he is not denying the structural problem, he's claiming writers solve it more often than anyone gives them credit for.
- **Reconciliation this file adopts (and labels as a reading, not a source's conclusion):** both sides agree that **end-rhyme-as-a-declared-scheme is not a J-pop device.** They disagree about how much of the *internal vowel assonance* in existing hits is deliberate craft versus a statistical inevitability of five vowels and open syllables. **Nobody found has settled that**, and it probably requires a corpus study comparing observed assonance rates against a chance baseline. Left open.

⚠️ **Not found:** any tradition of **alliteration/head-rhyme** as a named J-pop device. **折句** (acrostic — hiding a word in the initial morae of successive lines) exists as a classical device and survives as wordplay, but no source presented it as current pop-lyric craft.

## What makes a サビ hooky, if not rhyme

The one clearly-attested, actionable mechanism found is **phonetic**, not structural — and it's strong enough to use directly.

### The あ-vowel chorus-head rule ⭐

**Mizuno Yoshiki (水野良樹, いきものがかり)** states that he deliberately places **あ-vowel words at the head of the chorus**, with an explicit reason: 「路上ライブでお客さんの心をつかむために強い音をあてる」 — assign a *strong sound* to grab an audience at street performances. あ requires the widest mouth opening and is heard as 力強い/明るい. Cited examples of his own: ありがとう, 会いにいくよ, SAKURA.

The same practice is attributed to **Matsui Goro (松井五郎)** and **Kusano Masamune (草野マサムネ, Spitz)**. Matsui reportedly sometimes **fixes the phoneme first and writes the content around it** — deciding to use the sound が, then finding words that contain it. One 2019 Spitz album opens 9 of 12 songs on あ-row kana.

*(Source strength: attributed statements by named professional lyricists, reported in industry/interview writeups — strong for "practitioners do this deliberately," not a corpus study of the whole genre.)*

**A complementary phoneme ranking** from a lyric-writing industry column *(single trade source — useful heuristic, not established)*:

| | Strong / use at chorus head | Weak / avoid in intense sections |
|---|---|---|
| **Vowel row** | あ段, い段, お段 | う段, え段 — **except** え段 is specifically recommended for the *chorus-ending long tone* |
| **Consonant row** | か行, た行 (powerful) | さ行, は行 (pleasant but breathy, low impact); な行, ま行, や行 (gentle — ballad-suited); **ら行 sings poorly and is avoided** |

Their composite rule: the most effective chorus word starts with か行/さ行 and carries an あ段/い段/お段 vowel.

**Where this connects to the rest of the KB:** this is the Japanese analogue of [lyric-craft.md](lyric-craft.md)'s "chant-ability — short, phonetically simple, high-vowel words shout more easily." The English version is intuition; the Japanese version is a stated professional method with a named practitioner behind it. See also the vowel/singing material in [japanese-language-lyrics.md](../04-suno/japanese-language-lyrics.md), which carries the vocal-pedagogy side (including a flagged contradiction about whether close vowels are genuinely hard to belt).

### Other candidate hookiness mechanisms — what held up and what didn't

**Held up:**
- **Title-phrase placement and repetition** in the サビ — same as the Western convention; nothing Japanese-specific found, so [hooks-and-melody.md](hooks-and-melody.md) transfers.
- **語呂の良さ** (mouthfeel / how good a phrase feels to say) is treated in Japanese lyric-writing sources as a first-class criterion in its own right, sometimes overriding semantic precision — which is exactly what the Matsui "phoneme first, meaning second" method implies. This is a genuine register difference from English-language lyric advice, which almost never licenses choosing a word purely for its sound.
- **Mora-count symmetry between chorus lines** — see the mora/note material in the Suno file; parallel mora counts are the Japanese equivalent of parallel syllable counts.

⚠️ **Explicitly NOT FOUND — do not let these become assertions:**
- **命令形 / 呼びかけ (imperative or direct address) as a chorus device.** Plausible, common in actual songs, but **no source was found stating it as a convention.** Unsupported.
- **Onomatopoeia (擬音語/擬態語) as specifically a サビ device.** Japanese has a far larger and more grammatically integrated mimetic vocabulary than English — that much is uncontroversial linguistics — but **no source was found claiming it functions as a chorus-hook mechanism.** The size of the vocabulary is a fact; the chorus application is not sourced.
- Any claim that **starting the サビ on a high note or a melodic leap** is a Japanese-specific convention. (It's a general pop observation; nothing Japanese-specific found.)

## Register control: 漢語 / 和語 / 外来語

Japanese gives a lyricist **three parallel vocabularies for the same concept**, each carrying a different register. This is the resource English mostly lacks (its nearest analogue is the Anglo-Saxon/Latinate split, which is real but shallower).

| Layer | What it is | Feel | Example (roughly "eternity" / "wish" / "alone") |
|---|---|---|---|
| **漢語** | Sino-Japanese compounds, *on'yomi*, usually 2 kanji | Dense, formal, abstract, hard-edged, intellectual. Shorter in morae — packs more meaning per note | 永遠, 希望, 孤独 |
| **和語** | Native Japanese, *kun'yomi*, often with okurigana or written in kana | Soft, warm, emotional, colloquial, concrete. Longer in morae — costs more notes | とわ, ねがい, ひとり |
| **外来語** | Loanwords in katakana, mostly from English | Modern, cosmopolitan, stylish, sometimes deliberately weightless | エターナル, ドリーム, アローン |

Two consequences worth writing down because they interact with everything else in this KB:

1. **Register choice is also a mora-budget choice.** 永遠 = 4 morae (え-い-え-ん); とわ = 2. Swapping 漢語 for 和語 to soften a line will usually *lengthen* it, and vice versa. So register and melody-fit are not independent decisions — see the mora-to-note material in [japanese-language-lyrics.md](../04-suno/japanese-language-lyrics.md).
2. **Register choice is also a Suno-risk choice.** 漢語 compounds are the highest-risk items for kanji misreading (multiple on-readings, no okurigana to disambiguate); 和語 written in kana is the safest. A ballad that leans 和語 is *both* softer and mechanically safer to generate.

⚠️ **Honesty flag on this section.** The three-layer description is **standard Japanese-language reference knowledge** (the 和語/漢語/外来語 distinction, and the general "和語 = softer/longer, 漢語 = harder/shorter/denser" characterization, are uncontroversial). But **no lyric-writing source was found that prescribes a J-pop convention for mixing them** — no "use 和語 in verses and 漢語 at the climax" rule, or anything like it. The two numbered consequences above are **this file's own reasoning**, not a source's. If you want a rule, derive it from the song, don't cite one.

## English in J-pop lyrics — a different phenomenon from K-pop code-switching

This is the section most likely to be got wrong by analogy, so state the contrast first:

> **K-pop code-switching** (see [korean-english-lyrics.md](../04-suno/korean-english-lyrics.md)) is **functional and structural**: English anchors the hook so international listeners can sing along, Korean carries verse narrative. The English is *load-bearing* and semantically meant.
>
> **J-pop English is largely formal and decorative**: a few English words or phrases per song, sporadically inserted into a Japanese lyric, chosen substantially for **sound, rhythm and image** rather than for a message an English speaker is expected to parse. Its intended audience is domestic.

**Sources:**
- **Calica, David & Takahashi, Mariko (2023)**, *"A Statistical Analysis of English in Contemporary J-pop: Time Series of Lyrics and Identity, 2012–2021,"* Proceedings of the 29th Annual Meeting of the ANLP (言語処理学会) — a decade-scale time-series of English use in charting J-pop. **Citation confirmed; the paper's numeric results could not be extracted from the PDF and are NOT reproduced here.** If you need the actual percentages, read the paper.
- **Takahashi, Mariko**, *"'Shūmatsu not yet': Analyzing the use of English in Japanese popular music"* — reports that **most songs do contain English, but typically only a few English words or phrases per song, sporadically inserted into the main body of Japanese lyrics.** This is the finding that most directly establishes the "decoration, not code-switching" characterization. *(Peer-reviewed/academic; figures beyond this qualitative summary not extracted.)*
- Earlier academic work on English in Japanese popular culture and J-pop exists (Moody and others) — noted as a real literature, not read this pass.

**Functions it serves** *(mechanism-level reasoning, partly this file's own — flagged):*
- **Phonetic/rhythmic.** English supplies **closed syllables and consonant clusters that Japanese does not have**. A line of Japanese is a chain of open CV morae; an English word gives you a hard consonant-final stop. That is a rhythmic tool with no native equivalent. ⚠️ *This is this file's inference. No source found states it in these terms* — and note the opposite finding recorded in the Suno file, where Azechi's corpus data shows Japanese acquires English-like rhythm through mora-cramming rather than through borrowing English phonology.
- **Stylistic signalling** — modern, urban, cosmopolitan.
- **雰囲気英語 ("atmosphere English")** — English whose semantic content is secondary or borderline nonsensical to a native English speaker, present for feel. Widely observed; treat as a well-known characterization rather than a sourced technical claim.

**Placement conventions:** the frequently-observed locations are the **title**, the **first line of the サビ**, and a **hook tail**. ⚠️ **This positional claim was not confirmed by a source this pass** — treat as a hypothesis to check against actual songs before relying on it.

**Practical translation for a Suno lyric:** if the English is decorative, you may want it *sung in English* (leave it in Latin script and accept the phoneme switch) or *sung Japanese-style* (write it in katakana — ドリーム). That is a deliberate choice, and the Suno file records that mixing scripts **inside a single line** is reported to destabilize pronunciation — so if you code-switch, do it at line boundaries.

## Pronouns as characterization

Japanese pronoun choice does work that English pronoun choice cannot: **it characterizes the narrator** (gender, age, formality, toughness, era) in a single word, before any content arrives.

### First person

| Pronoun | Signals |
|---|---|
| **僕** | The J-pop default. Soft, young, sincere, slightly formal-polite masculine. Reads as gentle rather than assertive |
| **俺** | Masculine, rough, assertive, informal — rock and hip-hop register |
| **私 / わたし** | Neutral-formal; in a pop lyric context reads as **feminine** (a male narrator using 私 reads as formal/distant, not neutral) |
| **あたし** | Feminine, colloquial, casual — younger/breezier than 私 |

### The 僕-by-female-singers convention (ボク少女) is real and worth knowing

**僕 is used by female vocalists in J-pop routinely**, and this is not read as gender-bending. Attested points:

- It is **not recent**: Nakajima Miyuki used 僕 in a 1979 song, and by the 2000s major female artists (Hamasaki Ayumi cited) used it without comment.
- It is **especially associated with female idol lyrics**, frequently attributed to producer **Akimoto Yasushi** and the AKB48 lineage.
- The stated *reason* is the useful part: **僕 makes the narrator a generic, unnamed character rather than the performer herself** — it signals "these are feelings about love in general," not "this is my diary." It's a distancing/universalizing device, functionally similar to what [lyric-craft.md](lyric-craft.md) calls universal language, achieved through a single pronoun.

*(Source strength: Japanese music-culture blogs and columns — multiple independent ones agreeing, but not academic. The 1979/2000s datapoints are the kind of detail worth re-checking before citing.)*

### Second person, and the pairing rule ⭐

The single most practically useful finding in this section: **first and second person come in conventional pairs.**

| First person | Conventional partner |
|---|---|
| 僕 | **君** |
| 俺 | **お前** |
| 私 | **あなた** |

君 is intimate/equal/warm and is the J-pop default addressee; あなた is more distant, more adult, and (in a female-narrator lyric) can carry a spousal/mature-relationship colour; お前 is rough-intimate and matches 俺's register.

**Practical rule:** mismatching the pair (僕 + お前, 私 + 君) is *marked* — it will read as a deliberate character choice, so only do it on purpose.

### The pro-drop dimension

Japanese normally **omits pronouns entirely** when context supplies them. That means:

- **An explicitly stated pronoun is itself a choice** carrying emphasis or contrast — it foregrounds the person. A Japanese lyric that states 僕 in every line reads as insistent or translated-from-English; the natural texture states the pronoun once and lets it ride.
- ⚠️ **NOT FOUND:** any source establishing **deliberate pro-drop for gender ambiguity** as a named lyric technique — i.e. omitting pronouns so the narrator's gender stays unspecified. It's a widely-repeated idea informally; **no source was found stating it as a convention**, so it is recorded here as unsupported.
- ⚠️ **NOT FOUND:** any rule or convention about **keeping the same pronoun throughout a song.** [lyric-craft.md](lyric-craft.md) has a POV-consistency rule for English; **no Japanese source was found either asserting or denying an equivalent.** Do not assume it transfers. (Its *narrative* cousin — POV and tense consistency — probably does transfer, but that's the narrative-architecture material, not the pronoun material.)

### Academic corpus work exists but was not extracted

A data-driven corpus study of gendered first-person pronoun use in Japanese popular music exists as a University of Toronto thesis (*"Gendered Voices in Japanese Popular Music: A Data-Driven Analysis"*), reporting frequency of 私/あたし/僕/俺 in a lyrics corpus and statistical association with singer gender — one reported finding being that feminine first-person forms appear more often in **object** position in a clause. **The PDF's text could not be extracted this pass, so no frequencies or coefficients from it are reproduced here.** Anyone who wants the numbers should read it directly. Recorded so the citation isn't lost, and flagged so nobody mistakes this file for having checked it.

## Suno Translation

- Everything here is **100% author-controlled text** in the Lyrics field — like narrative architecture, it is never a generation-quality problem to fix by regenerating (see [controllability-map.md](../04-suno/controllability-map.md)).
- **Register and safety interact**: 和語 written in kana is simultaneously the softest register and the lowest kanji-misreading risk; 漢語 compounds are the densest register and the highest risk. See [japanese-language-lyrics.md](../04-suno/japanese-language-lyrics.md).
- **The あ-vowel chorus-head rule is directly actionable in Suno** and costs nothing — it's a lyric-writing choice, not a tag.
- **Vowel-matching (韻) survives kana respelling perfectly**, since it's defined on vowels — the repair ladder in the Suno file cannot damage it. End-rhyme-style thinking, by contrast, has nothing to protect.

## Worked Examples

- None yet. `<YOUR_SONGS_DIR>\SongC_suno_prompt.md` is a **cover** — its lyric is an existing published text, so it can be *analyzed* against this file but not credited as applying it. (It does happen to illustrate several conventions: 僕-free, uses 私 with a female narrator, pairs with 君, and its chorus is 和語-dominant.)
- Promote a real example here the first time an original Japanese lyric is written in this project.

## Gotchas / Open Items

- [ ] **The rhyme disagreement** (dominant "structurally weak / historically absent" vs. 細川貴英's "J-pop is full of unnoticed internal rhyme") — **genuinely open.** Both sides agree end-rhyme-as-scheme isn't a J-pop device; they differ on whether observed internal assonance is craft or chance. Would need a corpus study against a chance baseline
- [ ] Kawahara (2007)'s consonant-similarity gradient is peer-reviewed but is about **rap**; whether it describes J-pop assonance too is an extrapolation
- [ ] The あ-vowel chorus rule is attested as **practitioner intent**, not as a measured property of the genre — no corpus check found
- [ ] The 漢語/和語 register table is reference-grade linguistics, but **no lyric-writing convention for mixing them was found** — the two "consequences" drawn from it are this file's own reasoning
- [ ] Calica & Takahashi (2023) and the Toronto pronoun thesis: **citations confirmed, figures NOT extracted.** Nothing numeric from either is reproduced above
- [ ] **NOT FOUND, and must not drift into assertion:** 命令形/呼びかけ as a サビ device · onomatopoeia as specifically a サビ device · any within-song pronoun-consistency rule · deliberate pro-drop for gender ambiguity · alliteration as a J-pop device · the claim that J-pop English clusters at title/サビ-head/hook-tail
- [ ] Nothing in this file has been tested by writing a song

## Reference Listening

Named by sources rather than personally curated — treat as pointers, not a canon:

- **Mr.Children**, **Ozawa Kenji** — named by 細川貴英 as exceptionally skilled at (submerged) rhyme
- **いきものがかり** — 水野良樹's あ-vowel chorus heads ("ありがとう", "SAKURA")
- **Spitz** — 草野マサムネ's phoneme-led writing
- **Nakajima Miyuki**, **Hamasaki Ayumi**, AKB48-lineage idol material — the 僕-by-female-narrator convention across four decades
