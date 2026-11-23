---
name: council-deliberate
description: High-stakes extension of ecc:council — adds an anonymized cross-exam round and a hand-computed weighted tally on top of the same four-voice (Architect/Skeptic/Pragmatist/Critic) deliberation. Use when a decision is consequential enough that ecc:council's single-round synthesis isn't enough and you want independent positions that can't anchor on each other, then a blind second round that votes on options rather than identities. Not a replacement for ecc:council or decide — decide triages down to 2-3 options first; ecc:council handles ordinary ambiguous calls in one round; this skill is the escalation for the rare high-stakes ones. Triggers only on explicit request ("council deliberate," "run the full council with tally," "anonymized council") or when decide's own high-stakes branch recommends it. Never runs by default.
metadata:
  version: 1.0.0
  origin: personal, extends ecc:council
---

# council-deliberate — anonymized cross-exam + weighted tally

Validated live 2026-09-25 against a real decision (adopt Hister y/n). Round 2 produced position-specific critiques (not generic agreement) and one lens genuinely flipped its vote after seeing the anonymized positions — the anonymization does real work, not theater.

## When to use

Only for decisions where **all** of these hold:
- `ecc:council`'s single round already feels insufficient — the four voices split hard and none is clearly right
- the decision is consequential enough to justify ~8 Haiku calls and the wait
- you want a defensible, legible tally, not just a synthesized recommendation

For everything else, use `ecc:council` directly (cheaper, faster, no tally needed). For narrowing a vague decision to 2-3 concrete options first, use `decide`.

## Step 0 — Set weights before Round 1

Before launching anything, assign each of the four lenses a domain-relevance weight: **0.5, 1, or 1.5**. Default is 1 for all four (general decisions). Raise a lens's weight only when the decision specifically calls for that lens's expertise (e.g. weight Critic 1.5 for a security-adjacent call, weight Pragmatist 1.5 for a "ship now vs wait" call). **Write the weights down before Round 1 starts and do not change them afterward** — this is the anti-gaming rule. If you catch yourself wanting to adjust a weight after seeing Round 1 positions, that's the signal you're about to bias the tally — don't.

## Step 1 — Round 1: independent positions

Spawn four `haiku-batch` agents in parallel (real separate context each — this is what makes the later anonymization meaningful; do not run all four roles in one call or one context). Roles: Architect, Skeptic, Pragmatist, Critic — same lenses as `ecc:council`. Each gets only the decision question and compact necessary context, nothing about the other roles' output.

Prompt shape per role:

```text
You are the [ROLE] on a four-voice decision council. Lens: [role lens from ecc:council].

Question: [decision question]

Context: [compact, only what's needed]

Respond with:
1. Position — 1-2 sentences
2. Reasoning — 3 concise bullets
3. Risk — biggest risk in your recommendation
4. Surprise — one thing the other voices may miss

Be direct. No hedging. Under 300 words. Return as JSON: {option, rationale: [3 strings], key_risk, confidence 1-5}
```

## Step 2 — Anonymize

In the main context (never delegate this step), strip every marker of who said what:
- drop role names and role-flavored phrasing
- shuffle into labels A-D with an order that does **not** match the Round 1 launch order
- keep the substance (option, rationale, risk, confidence) verbatim

## Step 3 — Round 2: cross-exam and vote

Spawn four more `haiku-batch` agents in parallel, one per original lens (Architect-lens, Skeptic-lens, Pragmatist-lens, Critic-lens), each seeing all four anonymized positions A-D and none of their own Round 1 identity. Ask each to:
1. Name the single weakest point of each position A-D, one sentence each
2. Vote for the **option** they find most defensible from their lens — describe it in their own words, not by citing a letter (voting by option, not position identity, is what keeps this from just re-confirming labels)
3. State confidence 1-5

If a lens's Round 2 vote differs from its Round 1 position, that's a real signal the cross-exam worked — don't smooth it over in the synthesis.

## Step 4 — Weighted tally (compute this yourself, never delegate to an LLM)

```
score(option) = Σ over lenses that voted for that option of (weight_lens × confidence_lens)
```

Group Round 2 votes by the option they actually describe (paraphrases of the same option count as one bucket — use judgment, but don't force a merge that changes the meaning). Compute each option's score and its share of the total.

**Consensus check:** if the leading option's share doesn't beat the runner-up's share by at least 15 points, report "no consensus" and show both options with their strongest supporting argument — do not force a single verdict.

## Step 5 — Present

```markdown
## Council-deliberate: [decision title]

### Round 1 (independent)
- Architect: [position, confidence]
- Skeptic: [position, confidence]
- Pragmatist: [position, confidence]
- Critic: [position, confidence]

### Round 2 (anonymized cross-exam)
[per-position weakest-point critiques, grouped by position not by voter]

### Weighted tally
| Option | Lenses voting | Score | Share |
|---|---|---|---|
...

### Verdict
- **Consensus:** [option + margin, or "no consensus — see both options above"]
- **What flipped:** [any lens whose Round 2 vote differs from its Round 1 position, and why — this is the signal that anonymization mattered]
- **Weights used:** [the four weights and why, if any were non-default]
```

## Cost

8 `haiku-batch` calls total (4 Round 1 + 4 Round 2), no Sonnet/Opus in the loop unless a lens's Round 2 critique is clearly too shallow to trust — if that happens, re-run just that lens's Round 2 call on `sonnet-worker` rather than upgrading the whole council.

This mode is never the default path. It only runs on explicit request or when `decide` recommends escalating to it for a high-stakes decision after its own triage.

## Persistence

Same rule as `ecc:council`: don't write ad-hoc notes to shadow paths. Persist only if the verdict changes something real — use the project's own decision-log convention, or `decide`'s archive if this was reached via a `decide` escalation.

## Related

- `ecc:council` — the base four-voice workflow this extends; use it directly for ordinary ambiguous decisions
- `decide` — triages a vague decision to 2-3 concrete options; escalates here only for high-stakes ones
- `ecc:council-multi-model` — a different extension of `ecc:council` (adds one external-model critique post-draft); composable with this one if truly warranted, but that's rare
