---
name: anti-ai-tell-thai-detail
description: "Full detail + before/after examples backing CLAUDE.md's \"Thai writing anti-AI-tell rules\" — structural/rhetorical patterns adapted from Wikipedia:Signs_of_AI_writing plus Thai-specific GPT-ism vocabulary"
metadata:
  node_type: memory
  type: reference
---

Backing detail for the CLAUDE.md global rules "Thai writing anti-AI-tell rules" and "Don't wrap emphasized words/phrases in quote marks". Researched via web search (Pantip threads, Thai teacher forum posts, Wikipedia's crowd-sourced AI-writing-tell catalog) since the general English-language literature on GPT-isms is much richer than Thai-specific sources — most of what follows is the English pattern translated/adapted into Thai, since the underlying rhetorical habits are model-level, not language-level.

## Source quality note
Direct Thai-language sources on this topic are thin — searches for Pantip/teacher discussions mostly surfaced generic "AI can write Thai but sounds a bit off" commentary, not itemized pattern lists. The one concrete find: a Pantip thread (topic 43582248) about students using AI for homework named "ภาษาสละสลวยเกินระดับชั้น" (prose too polished for the student's grade level) and "คำที่เบี่ยงเบนจากรูปแบบการเขียนเดิมของนักเรียน" (vocabulary that deviates from the student's established writing habits) as the actual tells teachers use — i.e. mismatch against a known baseline, not a fixed checklist. That's worth remembering: the single best AI-tell for homework specifically is comparing against the student's *own* prior writing, not a universal pattern list.

The structural/rhetorical catalog below is adapted from Wikipedia:Signs of AI writing (en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), which is the most thorough crowd-sourced catalog available (originally for English Wikipedia editors screening AI-written drafts) — filtered down to the patterns that generalize across languages and make sense for Thai prose (not wiki-specific markup/citation bugs).

## Structural/rhetorical patterns (language-agnostic, adapted)

- **Copula avoidance**: AI systematically replaces plain "is/are" (Thai: "เป็น/คือ") with dressier verbs — "serves as," "marks," "represents" in English; "ทำหน้าที่เป็น," "ถือเป็น," "สะท้อนให้เห็นถึง," "นับว่าเป็น" in Thai. A human writer says "ร้านนี้คือร้านที่ผมชอบที่สุด" (this shop is my favorite); AI tends toward "ร้านนี้ถือเป็นร้านที่สะท้อนให้เห็นถึงรสนิยม..." — needlessly indirect.
- **Negative parallelism** ("not just X, but Y" / Thai "ไม่ใช่แค่ X แต่ยังเป็น Y"): creates false depth/contrast for simple statements. One genuine occurrence per piece is fine; used as the default sentence template it's a strong tell.
- **Rule of three**: three parallel items/adjectives/clauses, roughly equal length, is AI's default list rhythm. Already covered in the main rule as "list สมมาตร 3 ข้อ" — the Wikipedia catalog confirms this is one of the most reliable single tells across languages.
- **Elegant variation / synonym chains**: avoiding word repetition by cycling through near-synonyms for the same referent within one paragraph, e.g. calling a dog "หมา" then "สุนัขตัวนั้น" then "เพื่อนสี่ขา" in three consecutive sentences. Human writers repeat the plain word; only formal edited prose varies deliberately and sparingly.
- **Rigid hedge-then-emphasize conclusion**: "Despite X, faces challenges" formula. English: "Despite its popularity, the app faces significant challenges." Thai: "แม้จะได้รับความนิยม แต่แอปนี้ก็ยังคงเผชิญกับความท้าทายอยู่หลายด้าน." Reads as balanced/analytical but is actually a template filled with generic content.
- **Vague/unnamed attribution**: "industry reports," "observers have cited," "experts argue" without a specific named source. Thai equivalent: "ผู้เชี่ยวชาญระบุว่า," "มีการศึกษาพบว่า," "จากรายงานชี้ให้เห็นว่า" — sounds authoritative, cites nothing checkable.
- **Undue significance inflation / promotional tone**: generic superlatives replacing specific facts, travel-brochure language even in neutral contexts. English: "vibrant," "rich," "groundbreaking." Thai: "งดงาม," "เต็มไปด้วยเสน่ห์," "มีชีวิตชีวา," "น่าประทับใจอย่างยิ่ง" — watch for these appearing on mundane subjects that weren't asked to be sold.
- **Absence of idiosyncratic voice**: consistent, even syntax regardless of subject matter; no genuine hesitations, false starts, or personal quirks. Real human writing (especially conversational or narrative registers) has some roughness — mid-sentence pivots, a pet phrase repeated because that's just how the person talks, an aside that doesn't perfectly track. Polishing every sentence to the same smooth register is itself a tell.
- **Nominalization (English-calque)**: turning a plain verb into "มีความสามารถในการ + verb" or padding with "อย่างมีประสิทธิภาพ/อย่างมีนัยสำคัญ" instead of using a direct Thai verb — this is a translation artifact from English academic phrasing, not native Thai rhythm. "ระบบนี้มีความสามารถในการประมวลผลข้อมูลได้อย่างมีประสิทธิภาพ" vs. the plain "ระบบนี้ประมวลผลข้อมูลได้เร็ว." Legitimate only in genuine technical/academic register where the padded form is the field's convention.
- **Restate-everything conclusion**: closing with "สรุปได้ว่า / กล่าวโดยสรุป / ท้ายที่สุดแล้ว" followed by a rehash of every point already made — distinct from the hedge-then-emphasize pattern above (that one balances a positive against a caveat; this one just re-lists). A human closer states the single strongest remaining point or a forward-looking specific, not a table of contents in prose form.
- **Hedging stack**: piling up multiple hedge words in one sentence — "อาจจะ," "โดยทั่วไปแล้ว," "ในระดับหนึ่ง," "ในบางกรณี" stacked together — as if covering every possible exception at once. A human writer commits to a claim; the model hedges reflexively. E.g. "โดยทั่วไปแล้ว วิธีนี้อาจจะให้ผลลัพธ์ที่ดีขึ้นได้ในระดับหนึ่ง" vs. the plain "วิธีนี้ให้ผลดีขึ้น."
- **Both-sidesism**: reflexively presenting a counterpoint immediately followed by a counter-to-the-counterpoint in opinion/ความเห็น pieces, even when the writer has an actual stance. A Thai opinion piece that keeps circling back to "แต่ในขณะเดียวกันก็ต้องยอมรับว่า..." on every point never actually lands anywhere. Opinion writing should have an opinion.
- **Answer-shaped chat replies**: restating or praising the question before answering it — "คำถามดีมากค่ะ/ครับ! มีหลายปัจจัยที่ต้องพิจารณา..." — arguably even more common in Thai AI chatbot output than in English. A human just answers.

## Formatting-level patterns (apply when Thai output is chat/document, not just prose)
- Excessive **boldface** for emphasis scattered through running text (vs. the ban on quote-marks-for-emphasis already in the main rule — bold overuse is the same impulse, different mechanism)
- **Emoji used as structural bullets/separators** rather than for genuine tone
- **Horizontal rules or headers inserted for rhythm** rather than because the content actually breaks into sections
- **Tables built for content that reads fine as prose** — a tell when done in a chat reply or short answer where no one asked for a table
- These matter most for chat/document output; skip worrying about them for narrative/essay prose, where the earlier rhetorical patterns matter more.

## Transitions / discourse markers (throttle, don't rotate)
Backing the CLAUDE.md rule against opening paragraphs with these five connectives more than once per piece:
- **อย่างไรก็ตาม** — fine once as a genuine contrast; opening consecutive paragraphs with it is the tell
- **นอกจากนี้** — AI's default "additionally" reflex; a human just starts the next point without flagging it as an addition
- **ในขณะเดียวกัน** — used to manufacture a parallel/contrast that often isn't really there
- **ทั้งนี้** — vague formal hedge-connector, frequently deletable with no loss of meaning
- **ดังนั้น** — fine when a real logical conclusion follows; overused as a paragraph-opening reflex regardless of whether the prior paragraph actually supports a conclusion
Same throttle logic as the English "Moreover/Furthermore/Additionally" family: rotating through this set to avoid repeating one word is itself the tell, not the individual words.

## Thai-specific GPT-ism vocabulary (own-knowledge list, not web-sourced — use judgment, these words are fine when the meaning is genuinely intended)
| Thai word/phrase | English analog | Overused for |
|---|---|---|
| เจาะลึก | delve | "explore in depth" used reflexively on any topic |
| พลิกโฉม / เปลี่ยนโฉม | revolutionize/transform | inflating minor changes |
| ยกระดับ | elevate | inflating minor improvements |
| ตอกย้ำ | underscore | any supporting evidence |
| ตกผลึก | (no direct EN equivalent — "crystallize") | used outside genuine "arrived at an insight after reflection" contexts |
| หลากหลายมิติ / รอบด้าน | multifaceted | filler when nothing multifaceted was actually shown |
| โอบรับ | embrace | literal-translation feel, rarely how Thai speakers naturally phrase acceptance |
| องค์รวม | holistic | filler adjective attached to plans/approaches without cashing out what it means |

## Practical priority order when reviewing a Thai draft for AI-tell
1. Register match first (does it sound like the stated context — homework/chat/essay/report?) — biggest single tell, per the Pantip teacher observation
2. Sentence-template repetition (negative parallelism, rule-of-three, hedge-then-emphasize closers) — second biggest, structural
3. Vocabulary (Thai GPT-isms table, em dash, quote-marks-for-emphasis) — smallest but easiest for a casual reader to spot instantly
4. Formatting overkill — only relevant for chat/document output, not prose
