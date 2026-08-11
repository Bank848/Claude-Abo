---
name: grilling
description: Interview the user relentlessly about a plan or design, asking questions in dependency-ordered batches. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases.
---

Interview me about every aspect of this plan until we reach a shared understanding. Walk down the design tree, resolving dependencies between decisions branch by branch.

**Batching protocol:**
- Ask questions in batches of 4-5. For each question give your recommended answer and one line of reasoning.
- A batch may only contain questions that are independent of each other and of any still-unanswered question. If Q2 depends on Q1's answer, Q2 waits for the next batch. When a whole branch is blocked on one pivotal decision, a batch of 1-2 is correct — never pad a batch with dependent or filler questions.
- After each batch: restate my answers in one line each, note anything that invalidates a planned question, then form the next batch.
- Number questions continuously across batches (Q1..Qn) so answers like "Q3: yes, rest as recommended" work — tell me I can answer that way. If I skip a question in a batch, treat it as accepted per your recommendation.

**Before putting a question in a batch:**
- If it can be answered by exploring the codebase, explore instead and state the finding — don't ask.
- For cross-project patterns (not specific to this repo), check `<YOUR_VAULT_PATH>\notes\` for an existing note before asking or re-deriving it.

**Risky-state branches:** when a branch touches state that could be lost, cheated, or mistyped (data model, user input, anti-cheat, build pipeline), apply `poka-yoke`'s gold-rule test: ask why the bad state is representable at all before accepting a validator as the answer. Flag such questions in the batch with **[poka-yoke]**.

End when open branches are exhausted: summarize all decisions in a final list and ask for one confirmation.
