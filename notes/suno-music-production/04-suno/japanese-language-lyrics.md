# Japanese-Language Lyrics in Suno

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-09 (second, deeper research pass — see "What changed in pass 2")
> **Suno version notes:** claims below reference Suno v5.5 (released 2026-03-26 per `suno.com/release-notes`). Still NOT self-verified by this project; needs an actual Japanese-language generation test. **Version-sensitivity warning specific to this topic:** Japanese advice ages faster than most Suno advice, because the single biggest variable — how much kanji you can safely leave in — is reported to have *changed* at v5.5. Date-check every external source before following it.

## What changed in pass 2 (2026-08-09)

A second research pass, weighted toward Japanese-language practitioner sources, plus academic linguistics for the melody-fit half, closed or substantially narrowed all four open gaps from pass 1:

- **Kanji-vs-kana is no longer "two irreconcilable camps."** It's a *stability-vs-naturalness ladder*, and the apparent contradiction largely dissolves once you (a) see the rungs and (b) date-check the sources — pre-v5.5 advice pushed much harder toward all-kana than current advice does. Pass 1 also missed the two mechanics that make the kana approaches actually work: **long-vowel normalization** and **文節-boundary spaces**. See § Script choice.
- **Non-standard singing readings (運命→さだめ): answered, and the answer is "you can only produce the sound, not the sight."** See § Assigning a non-standard reading.
- **Particles は/へ/を: the three-way split is now a clear majority + a discredited minority.** Hiragana わ/え/お wins; romaji is the *worst* option and has a named failure mode. See § The particle problem.
- **Mora-to-melody fit** — see § Mora-timing.
- **One pass-1 claim is retracted** (editing tools being useless for pronunciation repair) and **one KB-wide claim is now contested** (that `( )` is a direction channel). Both flagged in-place below.

## Core Concept

Japanese has a problem neither of this KB's other non-English language files has: **the written form does not determine the spoken form.** Two mechanisms cause this, and they're independent:

1. **Kanji reading ambiguity.** A single kanji carries multiple readings — Chinese-derived *on'yomi* and native *kun'yomi*, plus irregular whole-word readings (熟字訓). 空 can be そら / くう / から; 月 can be つき / げつ / がつ; 七夕 is read たなばた, which is not derivable from either character's normal readings. Song lyrics make this worse on purpose: lyricists routinely assign a non-standard reading to a kanji for meaning-vs-sound effect (write 運命, sing さだめ), which no text-to-phoneme model can be expected to guess. There is **no Korean or Thai equivalent of this risk** — Hangul and Thai script are (broadly) phonemic, so their failure mode is *mispronunciation of a known target*, whereas Japanese's failure mode is *the model choosing a different, also-valid word-sound*.
2. **Orthographic particles.** The particles は / へ / を are written with the kana for *ha / he / wo* but pronounced *wa / e / o*. This is a spelling convention, not a phonetic fact, and it is reported to trip Suno regularly.

On top of that, Japanese is **mora-timed** rather than stress-timed (English) or syllable-timed — which changes how you count a line for melody fit. See Practical Application.

**Companion craft file:** this file covers *getting Japanese out of Suno correctly*. For *writing good Japanese lyrics in the first place* — rhyme (or its absence), what makes a サビ hooky, 漢語/和語 register, English in J-pop, pronoun choice — see [japanese-lyric-craft.md](../03-songwriting/japanese-lyric-craft.md).

Related: [korean-english-lyrics.md](korean-english-lyrics.md) and [thai-language-lyrics.md](thai-language-lyrics.md) are the sibling non-English-language files — useful for separating what is genuinely Japanese-specific here from generic multilingual-Suno advice. Genre-side companion: the J-Pop / Anime Ballad profile in [genre-conventions.md](../03-songwriting/genre-conventions.md).

**Honesty note on research depth:** unlike Thai, this topic *is* reasonably documented — there is a substantial Japanese-language blogging/note.com community writing about Suno specifically, and their advice is concrete and repeated across sources. That makes the findings below better-sourced than the Thai file's, but they are still *reported*, not verified by this project.

**Source-strength note (pass 2).** The sources behind this file are not equal and the file tries to say which is which inline. Roughly, strongest first: (1) **peer-reviewed linguistics/musicology** — used only for the mora/phonology sections, and genuinely strong there; (2) **Suno's own release notes** — used only for version dates; (3) **Japanese practitioners who describe an actual comparison they ran** (chiefly one note.com author who tested five input formats against the same lyric); (4) **Japanese guide sites and corporate note accounts** — concrete and mutually consistent, but they cite each other and should not be counted as fully independent; (5) **English-language Suno guide/SEO sites** — used only where they corroborate a mechanism from a different direction. **No Suno help-centre page documents Japanese behaviour or any pronunciation notation at all** — checked, not found. Nothing in this file is self-verified.

## Practical Application

### Mora-timing and how to count a line

- A **mora** is the timing unit of Japanese: every mora is nominally equal in length. Counting rules:
  - each plain kana = 1 mora (か, す, ん…)
  - **ん is its own full mora** — it is not a tacked-on consonant *(⚠️ but see the note-setting data below: being a mora does **not** mean it gets its own note)*
  - **っ (sokuon / geminate pause) is its own mora** — a silent beat *(⚠️ and it is the mora **least** likely to get its own note — see below)*
  - **a long vowel is 2 morae** (おかあさん = o-ka-a-sa-n = 5)
  - **youon (きゃ/きょ/しゅ…) is 1 mora, not 2** — the small kana fuses
- Practical consequence for lyric writing: **count morae, not "syllables", and count them off the kana spelling, not the kanji spelling.** 東京 looks like 2 characters and is 4 morae (と-う-きょ-う). If you plan syllable-to-note fit off the kanji, every count is wrong.
- Haiku's 5-7-5 is a mora count, not a syllable count — that's the everyday proof that Japanese verse meter runs on morae.
- Because morae are nominally equal-length, Japanese lyric lines default toward **even, unstressed, machine-gun-regular** rhythm compared to English, where stress creates the strong/weak alternation a melody usually leans on. Practical read: the melody has to supply the accent pattern that the language does not.

### Mora-to-note fitting — how Japanese lyricists actually do it (researched pass 2; ⚠️ corrects pass 1)

Pass 1 flagged its own application of mora-counting to melody as unverified inference. It is now researched, and **pass 1's implied rule — "one mora, one note, therefore count morae to count notes" — is materially wrong** as a description of modern J-pop practice. The mora count is the *grid*, not the note count.

**1音1文字 is the historical default, and it has measurably eroded.** *(strong: peer-reviewed + corroborating industry sources)*

- The academic baseline (Vance 1987, as summarized in Hirata 2023) for children's songs and 唱歌: **one note is generally assigned to each mora**; where two morae share a note it is usually a two-mora heavy syllable.
- **Azechi Nozomi (2007),『J-pop：リズムと歌詞の入れ込みルールの変遷』**, *Japanese Journal of Music Education Practice* 5(1) — 200 chart songs, 50 each per decade 1960s–1990s, 3,760 phrase tokens. Classifying phrases as わらべ歌-typical / variant / new-"cramming" type: **typical+variant fell from 83% in the 1960s to 17% in the 1990s**, exactly inverted; the cramming type rose 17% → 60%. Phrase length inflated in parallel (7-mora phrases 251→91; 10-mora 28→148; 13-mora 1→52), and the basic beat moved from quarter note to eighth.
- Industry lyric-writing sources say the same in craft language: 1音1文字 was 「鉄則」, broken open by English-language influence and specifically by Southern All Stars and Mr. Children; today multiple characters per note is unremarkable.

**So the working rule is:** *the mora is the reference grid you deviate from deliberately, not a quota.* Sparse (near 1:1) reads traditional/Japanese; dense (crammed) reads modern, driving, English-like. One industry source names this explicitly as a period/genre-signalling lever.

**字余り (cramming) is a device, not an error.** In 和歌/短歌/俳句 it is a named formal device with documented effects (making a key image land harder; 破調 for deliberate metrical disruption). In J-pop, **no source treats cramming as a defect** — it is described as producing 疾走感 (drive/speed). ⚠️ **字足らず (too few morae) was explicitly not found as a J-pop craft category** — pop sources only discuss the practical fix (lengthen a vowel, or insert a rest), which is also the mechanism that generates anacrusis/弱起 phrases.

**Special morae do NOT reliably get their own note — this is the biggest pass-1 correction.** *(strong: Hirata, Shu (2023), "Special Morae in Japanese Popular Songs from 2019–2022," The Basis 13:71–84 — published scores, counted per artist)*

Pass 1 said ん and っ "each take a whole beat." Linguistically they are full morae; **musically they often are not**. Hirata's independence rates (how often the special mora gets its own note):

| | ん (/N/) | っ (/Q/) | 2nd half of long vowel (/R/) | 2nd mora of diphthong (/J/) |
|---|---|---|---|---|
| Hoshino Gen | **97.5%** | 78.4% | 76.1% | 95.5% |
| Official Hige Dandism | 73.8% | **14.5%** | 58.5% | 81.9% |
| Yonezu Kenshi | 40.5% | 26.7% | 36.8% | 40.5% |
| Yorushika | 27.0% | **2.6%** | 36.3% | 42.7% |

Read-outs that matter for writing:

- **っ is the least note-bearing mora in the language** (2.6%–78%, bottom of the hierarchy for nearly every artist). Hirata's explanation: っ has no consonantal quality of its own (it copies the following consonant), so CVっ is easily one rhythmic unit. Treat **っ as a rhythmic articulation/stop inside a phrase, not a beat.** Corroborating engineering evidence: the NEUTRINO singing-synthesis FAQ notes that replacing っ with an actual *rest* makes the span silent and splits the phrase, whereas keeping っ preserves phrase flow — i.e. っ ≠ rest either.
- **ん is genuinely variable, 27%–97.5%, and it is an artist-level stylistic choice.** There is no single correct answer; decide per song.
- **The second half of a long vowel is usually a tied sustain, not a second note** (36%–78%): a composer can freely extend a vowel, so おかあさん's second あ tends to be absorbed.
- **拗音 きゃ/しゅ/きょ is reliably one note** — and it was never a special-mora case to begin with (small ゃゅょ are not independent morae). Pass 1 was right here.
- Underlying hierarchy (Tanaka 2008 via Hirata): two competing criteria — **sonority** (/J/,/R/ > /N/ > /Q/) and **stability** (/J/,/N/ > /R/,/Q/); different artists follow different ones. The *rank order* has been stable across ~90 years of corpora; only the absolute independence rate has fallen.

**Word boundaries vs. phrase boundaries — a documented, quantified J-pop device.** *(strong: Azechi 2007)*

Azechi measures whether the last note of a lyric unit is longer or shorter than the first note of the next. Where it is **shorter**, the musical grouping actively overrides the word boundary and the whole run is heard as one crammed unit. That boundary-destroying case rose from **22% (1970s) to 73–75% (1980s–90s)**. She names the resulting effect 配字シンコペーション — syncopation created purely by *text placement*, specifically by landing 弱化モーラ (ん, っ, diphthong tails) on metrically strong beats; frequency rose 1% → 6% across the four decades.

Craft sources warn about the failure version of the same thing: breaking a phrase where the *meaning* breaks wrongly makes the listener hear a different sentence. And there's a deliberate-misalignment tradition too (Shiina Ringo's phrasing is analyzed this way; 句またがり is the haiku/tanka equivalent). **So: misalignment is a technique when controlled and a bug when accidental — the same distinction English prosody makes.**

**Pitch accent (高低アクセント) vs. melody — genuinely contested, left open.** *(both sides academic)*

- **Accent matters:** musicologist Noriko Manabe documents that a melody straying far from pitch accent can make a line "not only awkward to sing but also unintelligible, given the large number of homonyms," and cites the linguist Kindaichi *mishearing an entire wartime song's subject* because the composer set the wrong morae high. Yamada Kōsaku built a whole art-song style (from 1922, setting Kitahara Hakushū) on reflecting Japanese pitch accent in melody — to the point of changing meter to fit the 7-5 mora structure.
- **Accent doesn't matter:** Kubozono & Mizoguchi (2023, ICPhS, NINJAL) tested 20 Tokyo speakers, 109 names, 2,180 tokens singing "Happy Birthday" and found **"lexical pitch accent in Japanese plays no role in the alignment, resulting in tonal neutralizations"** — accent-contrasting pairs showed *no* difference in segmentation or tune. Vowel-length contrasts were neutralized too.
- **Craft practice sits in between:** J-pop lyric columns treat accent as a live but soft concern — align the accent nucleus with the strong beat/snare; check accent in **OJAD (Online Japanese Accent Dictionary)** before writing; and several warn that accent placement can make a word be *heard as a different word*.
- **Honest reading (this file's, not any source's):** the two academic results may be answering different questions — Kubozono tests text alignment onto a *fixed* tune, Manabe/Yamada concern *composing* a contour. Nobody says this. **Left in the unverified-claim log as unresolved.**

### Vowel structure and where the singable notes are (researched pass 2)

**Japanese is ~90% open syllables** (only ん and っ close), grouping it with Spanish and Italian rather than English. Consequences documented:

- **Legato is the default affordance.** Vocal-school material describes Japanese legato as achieved by sustaining and blending the vowels — every mora ends open, so any note can be extended.
- **The "sound cost" problem — the sharpest framing found, though it's one essayist's argument.** Japanese needs more notes per unit of meaning: English "I" = 1 note, ワタシハ = 4. Under a Western melodic grid that means **fewer meanings per bar**, and the corollary the essayist draws is that Japanese lyrics 「ありきたりな（無駄な）ことを言っている余裕はない」 — you cannot afford English's "oh baby / come on" filler, because every note costs meaning. *(individual note.com essay, well-argued, single-author)*
- ⚠️ **Explicitly not found:** any source claiming English consonant clusters give rhythmic punch Japanese lacks. The nearest real finding is the reverse framing — Azechi shows Japanese *acquires* English-like syllabic rhythm precisely when cramming breaks mora isochrony.

**Yes, lyricists consciously control which vowel lands on the money note. This is the clearest new craft finding in the file.** *(industry columns + attributed practitioner statements; no corpus study exists)*

- **Mizuno Yoshiki (水野良樹, いきものがかり)** is on record deliberately putting **あ-vowel words at the head of the chorus**, stated reason: 「路上ライブでお客さんの心をつかむために強い音をあてる」 — assign a strong sound to grab listeners at street shows. あ requires the widest mouth opening and reads 力強い/明るい. Cited examples: ありがとう, 会いにいくよ, SAKURA.
- The same practice is reported for **Matsui Goro (松井五郎)** and **Kusano Masamune (Spitz)**. Matsui reportedly sometimes **fixes the phoneme first and writes content around it** (deciding to use the sound が, then finding words) — sound-before-meaning as deliberate method. One 2019 Spitz album opens 9 of 12 songs on あ-row kana.
- **Complementary rule from a lyric-writing industry column:** あ段/い段/お段 = strongest, best for chorus openings; う段/え段 = weaker, avoid in intense sections — **except** え段, specifically recommended for the chorus-ending long tone. Consonant side: か行/た行 powerful (good chorus starts); さ行/は行 pleasant but breathy/low-impact; な行/ま行/や行 gentle, ballad-suited; **ら行 sings poorly and is avoided**. Their composite rule: the most effective chorus word starts with か行/さ行 and has an あ段/い段/お段 vowel.
- **Contradiction, flagged:** Japanese vocal schools uniformly say い and え are the hardest vowels for Japanese singers to project on high notes (mouth spread horizontally, cavity narrowed, 「音が響きにくくなってしまう」) — but at least one pedagogy source argues the opposite for trained classical technique, where /e/ and /i/ ring most brilliantly and *ease* high notes. Best read: "close vowels are bad for belting" is a claim about untrained Japanese habit, not about the vowels. **Do not treat it as established.**
- Independent evidence the mechanism is real: pedagogy sources document a singer failing the high note **only in verse 2** because the vowel under it differs — i.e. which vowel sits under a high note materially changes singability.

**Devoiced vowels (好き → "ski", です → "des") — real, and it measurably shapes text-setting.** *(strong: phonology + one direct corpus measurement)*

- The rule: /i/ and /u/ devoice between voiceless consonants and phrase-finally (き・く・し・す・ち・つ・ひ・ふ・ぴ・ぷ before a voiceless consonant or at phrase end).
- **The craft-relevant fact, stated explicitly in pronunciation pedagogy:** 「母音を長く発音してしまうと、無声化は起こりません」 — **lengthening a devoiceable mora forces it back into voice.** So putting 好き's す on a sustained note produces a hyper-articulated "SU" that native ears hear as unnatural.
- **Singers avoid this, and it has been measured.** Kubozono & Mizoguchi (2023) found words ending in a devoiced vowel systematically prefer the "irregular" segmentation that pushes the final two syllables onto one note together (fe.ru.nan-**de.su̥**) rather than isolating the devoiced mora on its own note. Interpretation: singers avoid stranding a devoiced mora on a note because it forces voicing.
- ⚠️ **Not found:** any Japanese *lyric-writing* source codifying this as advice ("don't put 好き's す on a whole note"). The phenomenon is documented in singer behavior and pronunciation pedagogy only. One vocal studio goes the other way and treats deliberate voicing/devoicing control as an expressive tool.
- **Suno relevance (this file's inference, flagged):** an English-trained model has no reason to devoice these vowels at all, so Japanese output may sound over-articulated on exactly these morae regardless of note length. Worth listening for; no source addresses it.

**ん as a sung sound.** Kubozono & Mizoguchi show Japanese speakers split *jon* as jo-**n**, putting the moraic nasal alone on the second note — **the opposite of English and German speakers**, who set jo-**on**. So final ん genuinely is its own singable beat in Japanese in a way English's coda /n/ is not, and it can be held as a nasal hum (standard ハミング technique). ⚠️ **Craft literature on deliberately ending a phrase on ん was not found**; the nearest thing is a caution that giving ん its own note can produce 間延び (a draggy, stretched feel).

**Melisma / こぶし.** こぶし = momentary, irregular pitch flicks (民謡/演歌 tradition, expressing 泣き and 情); ビブラート = regular sustained oscillation. Japanese vocal schools themselves describe こぶし as the local analogue of Western melisma — treat that as a pedagogy-level approximation, not an established equivalence. R&B-style complex "fake"/melisma is described as largely outside J-pop's default clear-chest-voice aesthetic. ⚠️ **Not found:** any source claiming CV structure makes melisma technically *easier*. That's intuitive but unsourced.

### Line length

- Japanese Suno guides recommend roughly **10–20 characters per line**. Since kana ≈ mora, that is effectively a 10–20 mora line — but only if you're counting the *kana* form (see above). Short repeated phrases are reported to work especially well in the chorus.

## Suno Translation

### Script choice — two separate questions, don't conflate them

**Question 1: native Japanese script vs. romaji. Sources agree — use native script.**

- The Suno-specific Japanese prompt guide (hookgenius.app) states it flatly: *"Always use Japanese characters (ひらがな, カタカナ, 漢字) over romaji"*, on the reasoning that Suno processes native script more accurately for pronunciation and phrasing, and that romaji is lossy — one romanized spelling maps to many distinct Japanese words.
- Every Japanese-language source found simply assumes native script; the debate inside the Japanese community is about *which* native script, never about falling back to romaji.
- **This is a cleaner result than the sibling files got.** For Mandarin, native characters over pinyin is the reported best practice (see [thai-language-lyrics.md](thai-language-lyrics.md)); for Korean, this KB found *directly contradictory* guidance (Hangul-only vs. romanized-phonetic — see [korean-english-lyrics.md](korean-english-lyrics.md)). For Japanese, no source advocating romaji as the default was found at all. Treat "native script" as the strongest of the three languages' script recommendations — while noting it is still reported, not tested.

**Question 2: within native script, kanji vs. kana. Pass 1 called this "actively contradictory." Pass 2 finds it is mostly a ladder, not a contradiction.**

Eight Japanese-language sources were read this pass (note.com practitioner posts, Japanese AI-music guide sites, a JOYSOUND-affiliated corporate note account, and a hatenablog write-up with two demo songs). Once you line them up, **they agree on far more than they disagree on**, and the residual disagreement is a taste call, not a factual one.

**Agreed by essentially everyone (strongest findings in this file after "use native script"):**

1. **Full romaji is the worst option.** The one practitioner who actually tested it end-to-end (cityedge/sora_papa, note.com — the most experimental source found, who ran five input formats against the same lyric) reports it "dramatically increases the probability of English pronunciation," destroys readability so you can't diagnose what broke, and the conversion labor is unmanageable. Nobody advocates it. This *reinforces* the Question-1 answer rather than qualifying it.
2. **All-hiragana is a real failure mode, not a safe default.** Same source reports two concrete defects, both of which pass 1 did not have: particles は/へ get read literally as *ha/he* (the kana form gives the model *less* to go on, not more), and **long vowels break** — the う in a long-vowel sequence gets pronounced as a separate /u/ instead of lengthening the preceding vowel (モウヤメタ instead of モーヤメタ). Two other sources independently warn all-hiragana yields flat, un-phrased intonation.
3. **Full katakana maximizes pronunciation stability and costs prosody.** Both camps agree on this trade — they only disagree on whether to pay it. The hatenablog source (which built two full demo songs to compare) puts it plainly: 「意味の美しさは多少下がりますが、発音の安定度は最も高い傾向があります」— "semantic beauty drops somewhat, but pronunciation stability tends to be highest." The KaraGo (JOYSOUND-affiliated) and starroute guides both warn that converting *everything* to katakana produces robotic, flat intonation.
4. **Therefore: selective conversion is the current majority recommendation.** Convert the words that actually break; leave the rest in normal mixed orthography. Multiple independent sources land here (KaraGo Apr-2026, starroute, shinnexus, and pass 1's web-wing hybrid is a more prescriptive version of the same idea).

**The two mechanics pass 1 missed — these are what make the kana approaches work at all:**

- **Long-vowel normalization to ー.** If you convert to katakana, you must also convert the *spelling* of long vowels to the chōonpu: 東京 → **トーキョー** (not トウキョウ), ありがとう → **ありがとー**. The cityedge conversion pipeline treats this as a mandatory step (オ段+ウ → ー, エ段+イ → ー), with an explicit trap: do **not** apply it to negative 〜ない (〜なー is wrong). This single rule is probably why the "all-katakana" camp and the "all-kana fails" camp reported different results — a katakana respelling *without* long-vowel normalization reproduces exactly the all-hiragana long-vowel defect.
- **Half-width spaces at 文節 (clause) boundaries.** The stated objection to all-kana was "Japanese has no spaces, so you destroy word segmentation." The answer is: put the spaces in yourself. The cityedge pipeline's *first* step is inserting half-width spaces at 文節 boundaries — clause boundaries, explicitly **not** every word boundary. Two other sources recommend commas and line breaks at meaning boundaries for the same purpose. This turns "kana loses boundaries" from a fatal objection into a solvable one.

**Version drift — the reason pass 1 saw a contradiction it couldn't resolve.** A v5.5-focused note.com guide (shinnexus) states that v5.5 improved kanji recognition dramatically and **explicitly reverses the older advice**: 「適度に漢字を交えた方が発音がより自然に聞こえるレベルまで進化しました」— moderate kanji now *sounds more natural* than kana-converting everything. The "almost no mispronunciations if you write everything in kana" claim pass 1 recorded appears to be pre-v5.5 practice. **Undated Japanese Suno advice should be assumed to be pre-v5.5** and discounted accordingly.

**Resolved working default (upgrade of pass 1's, now sourced rather than inferred):**

| Rung | What you write | When to use it |
|---|---|---|
| 0 | Normal mixed orthography, unmodified | Gen 1 baseline on v5.5 — this is now the *recommended* starting point, not just the lazy one |
| 1 | Kana-respell only the words that actually came out wrong, plus particles | First repair pass. Majority recommendation. Preserves phrasing |
| 2 | Pre-emptively kana-lock the **hook / サビ / title line** even if it hasn't failed yet | Two sources specifically single out the chorus as worth converting aggressively — it's the most-repeated, most-exposed, and (per the low-context finding below) most likely to misread |
| 3 | Katakana-convert a whole section, **with** long-vowel normalization and 文節 spaces | When a section keeps breaking. Accept flatter intonation as the price |
| 4 | Whole song in katakana | Last resort. Highest stability, worst prosody. Nobody found reports this as their preferred default in 2026 |

Escalate one rung at a time, one variable per regeneration ([iteration-strategy.md](iteration-strategy.md)).

**Practical side note:** kana respelling inflates character count (東京 = 2 chars → トーキョー = 5). The Lyrics field is reported at ~5,000 characters on v4.5/v5/v5.5, so for a normal 3–5 minute song this is not a real constraint — noted only so nobody worries about it. See [limits-and-gotchas.md](limits-and-gotchas.md).

### Assigning a non-standard reading (運命 sung as さだめ) — resolved: you can produce the sound, not the sight

This was pass 1's flat "no source addressed this at all." Pass 2 answers it, though the answer is a negative result.

**There is no annotation channel.** The obvious device — furigana, `運命(さだめ)` — actively fails, and pass 2 raises the evidence for that from one source to four, including sources that reached it from unrelated directions:

- Japanese practitioner testing (cityedge) reports Suno 「漢字とふりがなを二度読む」 — **reads both the kanji and the furigana**, worst at line ends where it lands as an unintended repetition.
- The web-wing guide gives the identical warning with an example that *is* precisely this device: 時間（とき） — a non-standard reading — and says Suno sings both.
- A third Japanese source describes the parenthesized text coming out 「バックグラウンドで歌われたり、コーラスみたいになってしまう」 — sung in the background, chorus-like.
- Independently, English Suno-formatting guides state the general rule that explains all of the above: **`( )` is the sung backing-vocal / ad-lib channel; `[ ]` is the only non-sung instruction channel.** Parentheses are not an annotation channel in Suno at all, in any language.

That convergence is the real finding: the furigana failure is not a Japanese-specific bug, it's the correct behavior of a channel that was never an annotation channel. (This also **contests** this KB's own guidance in [metatags-and-lyric-markup.md](metatags-and-lyric-markup.md), which teaches short performance cues in parentheses — see the flag added there.)

**No working alternative was found.** Searched specifically for a ruby/annotation syntax, a bracketed pronunciation hint, or an IPA channel. One source suggests romaji-in-parens `辛(tsurai)い`, but states in the same breath that the parenthesized characters may be sung — i.e. it is the same failure with a different alphabet. Suno's own help centre has no pronunciation-notation documentation. **Explicit "not found," not "doesn't exist."**

**So the craft consequence — and it's a real one for anyone writing J-pop-style lyrics:**

> The 運命/さだめ device is *two* things at once: a **sound** (さだめ) and a **sight** (運命 on the lyric sheet, carrying the heavier Sino-Japanese meaning). Suno can reproduce the sound perfectly and cannot reproduce the sight at all. **Write さだめ in the Lyrics field; keep 運命(さだめ) in your human-readable lyric sheet.** You lose the semantic doubling in the Suno artifact; you lose nothing in the audio, because a listener to a real recording only ever hears さだめ anyway.

Two useful corollaries:

- **The device is effectively free in Suno.** Since the recommended repair for an ambiguous kanji is *already* "replace it with the intended reading in kana," writing a non-standard reading costs nothing extra — it's the same edit. If anything, deliberate non-standard readings are *safer* to hand Suno than standard ones, because you were going to kana-lock them regardless.
- **Do not expect the reverse to work.** Writing 運命 and hoping context steers Suno to さだめ is the worst case in this file: the low-context short-line finding below says Suno picks readings from surrounding meaning, and a deliberately unconventional reading is by definition the one context does *not* support.

### The particle problem は / へ / を — narrowed from "three answers" to "one answer plus a discredited option"

- **The defect is well attested and current.** Suno sings particle は as *ha* rather than *wa*, and へ as *he* rather than *e*. Reported across every Japanese source found, including the v5.5-specific guide, which names particles as the model's one remaining reliable weakness even after v5.5's kanji improvements. One practitioner calls it something that cannot be fully avoided in current AI voice generation.
- **Fix: rewrite the particle phonetically — は→わ, へ→え, を→お.** Unchanged from pass 1.
- **Which script: hiragana. This is now a majority position with a mechanism, not a coin flip.**
  - **Hiragana わ/え/お — 4+ independent sources**, including the two that compared options directly. web-wing: 「ひらがなで素直に『わ』『え』『お』と書く方が、Sunoにとってはずっと簡単」. cityedge, who *tested* the romaji variant, concluded the same: 「ひらがなで単に『わ』と『え』に変換するほうが、AIにとってはずっと簡単みたいですね」.
  - **Romaji wa/e/o — actively discredited, and this is the pass-2 correction.** Pass 1 recorded one guide calling romaji "very effective." The source that actually ran it reports a specific failure: romaji **`he` gets read as English "he" or as ヒー**. That is a concrete, mechanistic failure report, which outranks an unsupported "very effective." **Downgrade romaji to last resort.**
  - **Katakana ワ/エ/オ — genuine minority position, still defensible.** Two sources use it (one claiming 100% success on v5.5). Best read: if you're already katakana-converting that line, keep the particle in katakana for consistency; if the line is otherwise normal orthography, use hiragana.
- **Critical scoping rule, do not skip** (unchanged, and every Japanese source repeats it): convert only は that is *functioning as a particle*. は inside a word (葉 "leaf", 橋 "bridge", any stem-internal は) must be left alone — a blind find-and-replace corrupts real words.
- **Prioritize the chorus.** One source explicitly recommends fixing chorus particles first when you can't or won't convert everything — highest repetition, highest exposure.

### Other reported Suno-Japanese quirks

- **Numbers get anglicized or mis-read — now with concrete examples.** Reported failures: 2026年 → "twenty twenty-six 年"; 3 → サン or "three" unpredictably; 2人で → ニニンデ or "two"; 4月 → ヨンガツ instead of シガツ. **Fix: write the number as kana** (ニセンニジュウロクネン, フタリで, シガツ). Note this class overlaps the 熟字訓 problem — 一人/二人/大人 are number-words *and* irregular readings, so they are double-exposed. Persists in v5.5.
- **English words and loanwords trigger English pronunciation mid-line.** Reported fix: write them in katakana (DREAM → ドリーム; even "Suno AI" → スノーエーアイ). Optional — skip it when you *want* the English phoneme set (see the J-pop English-loanword convention in [japanese-lyric-craft.md](../03-songwriting/japanese-lyric-craft.md)). One source additionally warns that **mixing languages inside a single line** destabilizes pronunciation; if you code-switch, do it at line boundaries.
- **Low-context short lines misread worst.** Suno is described as picking kanji readings from surrounding meaning/flow, so isolated short phrases and title-like fragments are the most likely to get the wrong reading — exactly the lines (hooks, one-line refrains) you least want mangled. **This is the mechanism behind rung 2 of the ladder above** (kana-lock the hook pre-emptively): the chorus is simultaneously the shortest-context and the most-repeated text in the song.
- **Compound-verb sound changes** (rendaku / 連濁, 立ち止まる → …ドまる) are named as a known trouble class.
- **Segmentation aids beyond kana choice** *(new, pass 2)*: half-width spaces at 文節 (clause) boundaries; commas at breath points; one line per melodic phrase; blank line between sections. One source reports inserting a space before ない specifically reduces misreading. These are a *separate lever* from script choice — try them as their own variable before escalating the kana ladder.
- **Language misidentification:** including a marker like `Japanese Song` / `Japanese vocals` / `natural Japanese pronunciation` in the Style field is reported to help. One source additionally recommends marking language **inside the section tag** — `[Verse 1 日本語]`, `[Chorus 日本語＋英語]` — to signal where a switch happens. Untested, and it cuts against the otherwise-consistent "tags stay in English" rule, so treat as experimental.
- **Style field in English, lyrics in Japanese** is the consistent recommendation — English genre keywords ("J-pop", "City Pop") are reported to steer more reliably than Japanese ones.
- **Section tags and inline cues stay in English** even when the sung lyric is Japanese — same pattern reported for Thai/Korean/Mandarin. They're model instructions, not sung text.
- **Personas can lock a good pronunciation, not just a timbre** *(new, pass 2)*. A Japanese guide recommends saving a take that pronounced Japanese well as a Persona and reusing it, as part of a stack of tactics it claims gets to "90%+ as intended." Caveat from another source: a Persona applies as a **generation condition** — you cannot retroactively apply one to all sections of an existing song in the Editor; you'd re-render sections via Replace. See [personas-and-voice-locking.md](personas-and-voice-locking.md).
- **Regenerate-and-pick is an explicit part of the workflow, not a failure.** Multiple sources recommend running the same corrected lyric 3–5 times and choosing the cleanest take, because reading errors are probabilistic and *change between generations on identical input* — which also means a single bad take is not proof your respelling was wrong. This has a nasty corollary the sources state directly: **you cannot iterate reliably on a defect that moves.** Fix the deterministic things (particles, numbers, ambiguous kanji) by respelling, and treat the residue as sampling noise.
- **Standard repair ladder applies** (shared across all three language files): normal spelling → respell only the offending word in kana → adjust line length/split the phrase → keep the corrected spelling identical every time that word repeats. One variable per regeneration; see [iteration-strategy.md](iteration-strategy.md).
- **⚠️ RETRACTED from pass 1: "editing tools are useless for this fix."** Pass 1 recorded a practitioner being unable to repair a single mispronounced word via Replace Section or Remaster. A **more recent post by the most experimental Japanese source found** contradicts it: **Remaster is not read-only** — editing the lyric via *Song Details → Edit Displayed Lyrics* and then remastering reportedly fixes the text while largely preserving the song's character (with the caveat that the Displayed Lyrics must match what was actually used to generate). The same author reports that after a Replace, the replaced span **can be stretched or shrunk** to cover more than the originally selected range, and that it's better to respect the boundaries Suno itself recognizes than to hand-pick a perfect selection. **Net: surgical repair is worth trying before a full regeneration** — the opposite of pass 1's advice. Both are single-practitioner reports; the retraction is on recency and specificity, not on a test. See [editing-workflow.md](editing-workflow.md).
- **⚠️ Moderation risk when the lyric is someone else's song** *(new, pass 2 — practical blocker, not a quality issue)*. Suno's content filters are reported to reject **copyright-protected lyrics** submitted into the Lyrics field, and to reject Style fields that name a specific artist or album; false positives on users' own material are also widely reported. For a cover project that pastes an existing published Japanese lyric verbatim, **this can block generation entirely before any pronunciation question arises.** Not Japanese-specific, but it lands hardest on exactly the anime/J-pop cover use case. Separate from the downstream question of whether the *output* may be distributed.

### Style-field vocabulary (Japanese genres)

From the Suno-Japanese prompt guide — starting points, not verified to steer reliably:

| Target | Reported tag cluster |
|---|---|
| J-Pop | `upbeat female vocals, synth-pop production, anime opening energy, bright, polished, driving rhythm` |
| J-Rock | `powerful male vocals, distorted electric guitar, emotional intensity, anthemic chorus, fast tempo` |
| City Pop | `groovy bass, funky rhythm guitar, 80s synths, warm analog production, nostalgic` + a named artist-era marker (e.g. Tatsuro Yamashita influence) rather than a generic "retro Japanese" |
| Anime Ballad | `emotional female vocals, piano-driven, orchestral strings, cinematic, bittersweet` |

The guide's general point: name the *sub-style plus its production markers*, because bare "J-pop" under-delivers the genre's characteristic polish — same finding this KB recorded for K-pop.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongC_suno_prompt.md` (song project folder, separate from this vault) — cover of "Orange" by 7!! (*Your Lie in April* ED2), 100% Japanese lyric, cinematic-orchestral arrangement. **Planned, not yet generated** as of 2026-08-09. It is the first Japanese-language test in this project; when it runs, log here: whether mixed orthography was read correctly, which kanji (if any) got the wrong reading, whether particle は came out as "wa" or "ha", and whether any bracketed/parenthesized cue was sung. **Log the failure mode even if generation is refused** — because it pastes a verbatim copyrighted Japanese lyric, the moderation-block risk above is a live first-order outcome for this song, not a footnote, and a refusal is itself a data point worth recording.

Because that song's Gen 1 is deliberately run at **rung 0** (normal mixed orthography, nothing pre-converted), it is also a usable test of the pass-2 claim that v5.5 shifted the optimum toward keeping kanji — currently the weakest load-bearing claim in this file. Record *which* words broke, not just how many.

## Gotchas / Open Items — Unverified-Claim Log

**Status: everything below is "reported by external web sources, not yet self-verified"** by this project generating and inspecting Suno output. Promote to "self-verified" with date + observation the first time a song project tests it:

**Resolved or upgraded in pass 2 — moved into the body above, listed here so the change is auditable:**

- ✅ *(pass 1: "contradictory")* **Kanji-vs-kana** — reframed as a stability-vs-naturalness ladder plus source-dating. 8 Japanese sources; the disagreement is a taste call, not a factual one. Still no self-test.
- ✅ *(pass 1: "no source addressed this at all")* **Non-standard singing readings (運命→さだめ)** — answered as a negative result: no annotation channel exists; respelling in kana is the only route; the visual half of the device cannot survive into Suno. Backed by 4 sources including two independent explanations of *why*.
- ✅ *(pass 1: "three sources, three answers")* **Particle respelling target** — hiragana わ/え/お is the majority position (4+ sources, including both sources that compared options); romaji is downgraded to last resort on a specific reported failure (`he` read as English "he"/ヒー); katakana survives as a defensible minority.
- ✅ *(pass 1: "one Japanese guide")* **Parenthesized text gets sung** — now 4 sources across two unrelated communities, plus a mechanism (`( )` is Suno's backing-vocal channel in every language). Strong enough that it now **contests** [metatags-and-lyric-markup.md](metatags-and-lyric-markup.md)'s own guidance.
- ✅ *(pass 1: "this file's own inference")* **Mora-to-melody fit** — researched; pass 1's implied "one mora = one note" rule is **corrected** (see the Hirata/Azechi data above).
- ⚠️ *(pass 1: "reported")* **Editing tools useless for pronunciation repair** — **retracted**, see the quirks list.

**Still unverified — everything below remains "reported by external sources, not self-verified"** by this project generating and inspecting Suno output. Promote with date + observation the first time a song project tests it:

- [ ] Native Japanese script (kanji/kana) outperforms romaji — now *reinforced* (the one practitioner who tested full romaji reports it as the worst option), but still no published side-by-side audio
- [ ] Suno actually mispronounces ambiguous kanji at a meaningful rate (空/月/七夕 cited) — asserted by every source, **never demonstrated with audio in any source found**
- [ ] That v5.5 specifically shifted the optimum *toward* keeping kanji — a single v5.5-focused source makes this claim and it is the linchpin of the "start at rung 0" recommendation. **Weakest load-bearing claim in this file.**
- [ ] Particle は sung as "ha" — universally reported, still no audio evidence in any source
- [ ] Long-vowel normalization to ー materially improving katakana output (the pass-2 mechanism claim) — stated as a pipeline step by one source, not demonstrated
- [ ] 文節-boundary half-width spaces improving segmentation — recommended by 2–3 sources, untested; also unknown whether the full-width 全角スペース commonly used in Japanese lyric typography works the same way
- [ ] Numbers/digits read in English — reported with concrete examples, unverified
- [ ] The 10–20 characters-per-line recommendation beating longer lines
- [ ] Marking language inside a section tag (`[Verse 1 日本語]`) doing anything at all — single source, and it contradicts the otherwise-consistent "tags in English" rule
- [ ] Persona reliably carrying *pronunciation* quality (not just timbre) across generations
- [ ] Whether Suno's moderation actually blocks a verbatim copyrighted Japanese lyric — reported generally for copyrighted lyrics, never tested with Japanese specifically in this project
- [ ] **Pitch accent vs. melody — genuinely unresolved after deeper research**, and both sides are academic: Manabe documents accent violation causing real misperception (Kindaichi mishearing a whole song); Kubozono & Mizoguchi (2023) find accent has *no* role in alignment and that tonal contrasts are simply neutralized in song. This file's guess that they answer different questions (composing a contour vs. aligning to a fixed tune) is **not stated by any source**
- [ ] Whether devoiced vowels (好き's す) come out over-articulated in Suno because an English-trained model has no reason to devoice — this file's inference, no source addresses it
- [ ] Whether the J-Pop/J-Rock/City Pop/Anime Ballad tag clusters steer output as described

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
