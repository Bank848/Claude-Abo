---
name: anti-ai-tell-english-detail
description: "Full vocab tables + before/after examples backing CLAUDE.md's \"English writing anti-AI-tell rules\" — companion to anti-ai-tell-thai-detail.md"
metadata:
  node_type: memory
  type: reference
---

Companion to [[anti-ai-tell-thai-detail]] and the "English writing anti-AI-tell rules" section in CLAUDE.md. English GPT-isms are heavily documented territory, so this is built from direct model knowledge rather than web search the way the Thai companion file was. Not a translation of the Thai ruleset — many patterns (rule-of-three, copula avoidance, negative parallelism, hedge-then-emphasize, vague attribution, elegant variation, promotional inflation, formatting overkill) are shared/model-level and already appear in both files; this file adds English-specific vocabulary and register mechanics that don't map onto Thai (contractions, semicolons, title case).

## 1. GPT-ism vocabulary table

### Verbs
| Avoid | Use instead |
|---|---|
| delve (into) | look at, dig into, examine |
| leverage | use |
| utilize | use |
| foster | encourage, build |
| facilitate | help, make easier |
| showcase | show |
| boasts (a feature/vibrant X) | has |
| underscore / highlight (as reflex) | show, point out, or just state the point |
| navigate (challenges/complexities) | deal with, handle |
| embark (on a journey) | start |
| harness | use |
| elevate | improve, raise |
| unlock (potential/value) | rewrite to say what actually happens |
| streamline | simplify, speed up |
| bolster | support, strengthen |
| garner | get, win |
| resonate (with audiences) | connect, land, people liked it |
| empower | let, enable (sparingly) |
| cultivate | build, grow |
| illuminate / shed light on | explain, show |
| revolutionize / transform (reflexive) | change, improve, with the concrete change named |
| ensure (every sentence) | make sure, or drop it |
| encompass | include, cover |
| epitomize / exemplify | is a good example of |

### Adjectives / adverbs
| Avoid | Notes |
|---|---|
| crucial, pivotal, vital, essential | default intensifiers, usually deletable |
| intricate, multifaceted, nuanced | say what the parts actually are |
| robust, comprehensive, holistic | corporate filler |
| seamless(ly), effortlessly | almost never literally true |
| vibrant, bustling, stunning, breathtaking | travel-brochure inflation |
| innovative, cutting-edge, state-of-the-art | name the actual feature instead |
| profound, remarkable, notable(ly) | show, don't label |
| meticulous(ly), diligent(ly) | flattery-adverbs |
| ever-evolving, rapidly changing, dynamic | landscape-adjacent filler |
| invaluable, indispensable | overclaimed |
| significantly, notably, importantly (sentence adverbs) | usually deletable |
| myriad, plethora, a wealth of | many, lots of |

### Filler nouns / noun phrases
| Avoid | Notes |
|---|---|
| tapestry, mosaic (metaphorical) | #1 creative-writing tell |
| landscape, realm, arena, sphere (metaphorical) | "the AI landscape" etc. |
| journey (non-literal) | "your learning journey" |
| testament (a testament to) | classic tell |
| cornerstone, bedrock, linchpin | say "key part" and name why |
| synergy, paradigm shift | corporate zombie words |
| insights (as empty plural) | say the actual finding |
| stakeholders (outside real PM contexts) | name who |
| beacon, treasure trove, goldmine | inflated metaphor |
| game-changer | banned outright |
| a deep dive | "a closer look" or restructure |

### Transitions / discourse markers (throttle, don't rotate)
- Moreover / Furthermore / Additionally — max one per piece total, never opening consecutive paragraphs
- However opening a paragraph — fine once; rotating it with the above family is the tell
- "That said," / "With that in mind," / "It's worth noting that" / "It's important to note that" — delete, the sentence survives without them
- "Here's the thing:" / "Let's break it down:" / "Let's dive in" — chatty-AI transitions, ban
- "In essence" / "Essentially" / "At its core" — delete
- "Whether you're a beginner or an expert..." — audience-straddling opener, ban

## 2. Structural / rhetorical patterns (before → after)

**Negative parallelism ("not just X, but Y")**
- Before: "This isn't just a tool; it's a fundamental shift in how teams work."
- After: "Teams that switched stopped holding the Monday planning meeting entirely."
- Max once per piece. "It's not about X. It's about Y." is banned outright.

**Rule of three**
- Before: "The app is fast, intuitive, and reliable."
- After: "The app is fast. It also hasn't crashed on me in two months."
- Break symmetry: 2 or 4 items, unequal lengths, or one item developed properly.

**Copula avoidance**
- Before: "The library serves as the central hub for the community and stands as a testament to local investment."
- After: "The library is where most community events happen. The city spent $2M renovating it in 2019."

**Hedge-then-emphasize closer**
- Before: "While challenges remain, the project continues to show promise for the future."
- After: "The migration is half done. The auth rewrite is the part most likely to slip."

**Restate-everything conclusion**
- Before: "In conclusion, we have seen that X improves A, B, and C, making it a crucial tool..."
- After: end on the single strongest point or a forward-looking specific, one or two sentences, no "In conclusion".

**Vague attribution**
- Before: "Experts agree that remote work boosts productivity."
- After: "A 2023 Stanford study of 1,600 workers found a 13% productivity gain." If no real source: "I think remote work makes me more productive because..." or ask the user for the source.

**Elegant variation**
- Before: "The report... the document... the analysis... the study..." (all the same report)
- After: call it "the report" every time. English tolerates repetition; synonym-cycling is the tell.

**Promotional inflation in neutral contexts**
- Before: "Chiang Mai boasts a vibrant night market scene nestled in the heart of the old city."
- After: "Chiang Mai has several night markets; the Sunday one on Ratchadamnoen Road is the biggest."

**Formatting overkill**
- Before (a DM): "**Option 1: Refactor** — pros: ... **Option 2: Rewrite** — pros: ..."
- After: "Two ways to go: refactor the module (slower, safer) or rewrite it (risky but the code's a mess anyway). I'd refactor."
- Bold-term-colon bullet lists ("**Scalability:** The system...") are the #1 formatting tell in prose contexts.

**"In today's..." openers**
- Banned: "In today's fast-paced digital world...", "In an era of...", "Now more than ever...". Open with the actual subject or a concrete scene/fact.

## 3. Register-specific guidance

**Casual chat / DM:** contractions mandatory; sentence fragments fine ("yeah makes sense", "ugh, that build"); no lists, no bold, no colons-introducing-structure; rhythm over polish; never "I hope this message finds you well" energy.

**Professional email:** contractions still fine (their absence is stiff); get to the point in the first sentence; no "I hope this finds you well", "I wanted to reach out", "Please don't hesitate to"; sign-offs plain ("Thanks," "Best,"); one ask per email stated plainly; short paragraphs ok but no headers/bullets unless listing genuinely list-like items.

**Essay / report:** formal register legitimate here, so the vocab table + structure rules do the heavy lifting; must contain concrete specifics (names, numbers, dates, places), at least one per major section — ask the user rather than write generic; thesis stated as the writer's own stance ("I argue"), not both-sides mush; transitions earned by logic, not rotated from the Moreover-family; conclusion short and non-restating.

**Creative writing:** biggest tells are "tapestry/testament/nestled", over-adjectivized description (three adjectives per noun), emotion named instead of shown ("she felt a profound sense of loss"), and every paragraph the same length; permit fragments, odd rhythm, unglamorous concrete detail; banned imagery: eyes "sparkling/glinting", "a shiver ran down", "little did she know", air "thick with tension".

## 4. English-specific tells (no Thai equivalent)

- **Contraction avoidance** — "do not / it is / cannot" throughout a casual piece is a tell. Default to contractions everywhere except legal/academic.
- **Semicolon overuse** — LLMs sprinkle semicolons in casual prose; humans in chat basically never use them. Allow in formal writing only, sparingly.
- **Title Case Headers In Emails/Docs** where a human would write a plain sentence.
- **Perfectly balanced paragraphs** — every paragraph 3–5 sentences, near-equal length. Humans write a one-line paragraph sometimes. Do that.
- **The colon-subtitle habit** — "X: Why Y Matters" title format, and colon-led expansions inside sentences.
- **Curly-quote / punctuation hyper-correctness** in casual contexts (straight, sloppy punctuation reads more human in chat).

## 4b. Shared model-level tells with a Thai equivalent (see anti-ai-tell-thai-detail.md for the Thai-language versions)

- **Hedging stack** — "arguably", "generally speaking", "in many cases", "to some extent" stacked in one sentence is the model covering all bases. Commit to the claim. (Thai: อาจจะ/โดยทั่วไปแล้ว/ในระดับหนึ่ง/ในบางกรณี stacked the same way.)
- **Both-sidesism** — reflexively presenting counterpoint + counterpoint-to-the-counterpoint in opinion contexts. Opinion pieces should have an opinion. (Thai: "แต่ในขณะเดียวกันก็ต้องยอมรับว่า..." circling every point in ความเห็น pieces.)
- **Answer-shaped replies in chat** — restating the question before answering ("Great question! There are several factors to consider..."). Just answer. (Thai: "คำถามดีมากค่ะ/ครับ! มีหลายปัจจัยที่ต้องพิจารณา..." — arguably even more common in Thai AI chat output than English.)

## 5. Practical priority order (when reviewing an English draft)

1. **Vocabulary sweep + em dashes** — highest signal, mechanical to fix (delve/tapestry/boasts/leverage/crucial + all em dashes).
2. **Promotional inflation & copula avoidance** — "serves as a testament to the vibrant..." constructions; readers smell these instantly.
3. **"Not just X but Y" + rule-of-three symmetry** — scan for parallel triplets and negative parallelism.
4. **Opener/closer formulas + vague attribution** — first and last paragraphs get disproportionate reader attention.
5. **Contractions & register match** — is the piece stiffer than a human would be in this context?
6. **Rhythm** — sentence-length variance, one short punch sentence somewhere, uneven paragraphs, at least one concrete specific detail.
7. **Formatting** — strip bold/bullets/headers from anything conversational.

Rationale: 1–2 are per-word detectable by casual readers and AI-detectors alike; 3–4 are per-sentence patterns a suspicious reader checks next; 5–7 are whole-piece properties that only matter once the surface is clean.

## Judgment calls made during research (surface if the user wants to tighten)
- "Not just X, but Y" allowed once per piece rather than banned outright, since it's occasionally the honest construction — the Thai rule made the same call for its equivalent pattern. Tighten to zero-tolerance if the user prefers.
