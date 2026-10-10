---
name: english-writing-anti-ai-tell
description: Use when drafting English-language text for the user (chat, email, essays, reports) to avoid GPT-ism vocabulary, em dashes, rule-of-three lists, copula avoidance, opener/closer formulas, and other AI-writing tells. Also use when the user asks to "humanize" existing AI-written English text/file.
---

## English writing anti-AI-tell rules (codified 2026-08-12, expanded 2026-08-13 from fable-medium research)
When helping draft English text (chat, email, DM, essay, report, post), avoid these patterns that are signatures of AI-generated English. Full details, the vocab table, and before/after examples live in the reference file `english-anti-ai-tell-reference.md` in your memory folder:
- **Em dash (original rule):** never use an em dash to join sentences, especially the "X — because Y" pattern. Use a comma, start a new sentence with a period, or a connector like "and"/"so" instead.
- **GPT-ism vocabulary:** never use "delve", "tapestry", "boasts", "underscore(s)", "landscape" (figurative), "realm", "crucial/pivotal/vital" as a default intensifier, "intricate", "multifaceted", "leverage" (verb), "seamless(ly)", "robust", "foster", "navigate (challenges)", "embark", "elevate", "unlock", "game-changer", "in today's fast-paced world". Many more second-tier words are in the reference file. If unsure, use a simple verb or word instead ("use" not "utilize", "help" not "facilitate").
- **"not just X, but Y"**: never use it more than once per piece, and never "It's not about X. It's about Y." at all.
- **Rule-of-three throttle**: never write a three-item list with parallel sentence structure ("clear, concise, and compelling") as a reflex. Use 2 or 4 items, of unequal length, or expand a single item tightly.
- **Copula avoidance**: write "is/are/has" directly. Never swap in "serves as", "stands as", "represents", "acts as", "functions as".
- **Opener/closer formula**: never open with "In today's world / digital age / ever-evolving landscape". Never close with "In conclusion / Ultimately / At the end of the day" followed by a restatement of every point. Never hedge-then-emphasize ("While challenges remain, X continues to..."). End on a specific detail, or a short opinion, at the point where you want to stop.
- **Vague attribution**: never write "experts say / studies show / many believe" without a real, nameable source. If there is no source, ask the user or state it directly as an opinion.
- **Elegant variation**: repeating the same word is natural. Never swap in synonyms (dog → canine → four-legged friend) to avoid repetition.
- **Promotional inflation**: use neutral language for neutral context and facts. Never use "vibrant", "stunning", "rich cultural heritage", "must-see", "nestled" outside genuine advertising.
- **Formatting overkill**: use plain prose for chat/DM/email. No bold-term-colon lists, headers, emoji bullets, divider lines, or tables unless the user really asks for structure.
- **Contractions**: conversational work (chat, DM, casual email, blog) must use contractions ("don't/it's/I'll"). Zero contractions is itself a tell. Also vary sentence and paragraph length so it is not too even.
- **Register first, always**: decide chat / professional email / essay / creative before writing, then match it (the breakdown by register is in the reference file). Defaulting to a polished-neutral-formal tone every time is the biggest meta-tell.
- **English-specific extras (not in the Thai rule)**: semicolon overuse in casual contexts, title case headers in emails/documents that should be plain sentences, evenly sized paragraphs throughout, the colon-subtitle habit ("X: Why Y Matters"), hedging stacks that pile several hedges into one sentence ("arguably", "generally speaking", "to some extent"), both-sidesism in opinion pieces that should take a position, and answer-shaped chat replies that restate the question before answering ("Great question! There are several factors...").
- **Priority order when checking a draft**: (1) GPT-ism vocab + em dash, (2) promotional inflation + copula avoidance, (3) "not just X but Y" + rule-of-three, (4) opener/closer formula + vague attribution, (5) contractions + register match, (6) sentence/paragraph rhythm, (7) formatting overkill
- Reason: expands the original em dash rule, which only caught things at the punctuation level. This set comes from fable-medium research (2026-08-13) and covers vocabulary plus the structural/rhetorical GPT-isms that are densely documented in English.
- Applies to every project, every time English text is drafted.

## Draft-critique-revise workflow (codified 2026-09-04, adapted from blader/humanizer)
This skill used to be single-pass (write while checking against the checklist). A separate critique/revise step is now **mandatory** for work where polish and credibility matter (essays, reports, PR/issue replies, documents that will be sent or posted for others to see). It is **not optional** for that group, and only short chat / ordinary question answers may stay single-pass:
1. **Draft**: write without a rigid structure and let content and facts come first, but **lock register/contractions at this step** (per the "Register first, always" rule above). Polish only wording/vocabulary/sentence structure afterward.
2. **Critique**: compare the draft with (a) the checklist above, item by item in priority order, and (b) the source/original facts (check that meaning and details have not drifted from the draft), then note flags only where they clash.
3. **Revise**: fix only the flagged spots. Do not rewrite the whole piece (this protects tone and details that are already good).
- Short chat / ordinary answers in conversation → the original single-pass is enough, no separate steps.

## Humanize existing text (codified 2026-09-04)
When the user asks to "humanize this text / fix it so it doesn't read like AI wrote it" for **text/a file that already exists** (not drafting new), do this:
1. Read the whole original and keep all of its meaning/claims/facts as a baseline. Never change the meaning.
2. Run the draft-critique-revise workflow above, with the critique step comparing against the original instead of your own draft.
3. If the file mixes in code/data/frontmatter (e.g. a .md with YAML frontmatter and code blocks), **never touch**: fenced code blocks, inline code, YAML frontmatter, URLs/paths, numbers/proper nouns. **Ask before editing**: code comments, docstrings, literal UI strings (a careless edit can affect build/tests). Edit freely only ordinary prose.
4. Show the diff or a summary of what was changed to the user first, rather than replacing silently.
