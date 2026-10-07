---
name: poka-yoke
description: Mistake-proofing by design — make the bad state impossible or self-evident at the source instead of detecting-and-punishing it later. Use BEFORE/DURING any design or review of features, game mechanics, minigames, UI flows, anti-cheat, input handling, build pipelines, or data models — and whenever you catch yourself about to write a "remember to / don't forget" note (that itch means a guardrail is missing). Trigger on /poka-yoke and proactively when designing, reviewing, auditing, hardening, or "how do we stop users/devs from doing X".
---

# Poka-Yoke — mistake-proofing at design time

> **Don't chase mistakes after the fact. Design so the mistake "can't happen" or is "obvious immediately" at the source.**

Shigeo Shingo / Toyota. Core idea: shift effort from *detection* (catch + punish) to *prevention* (make the mistake impossible). Applies to code, UX, anti-cheat, builds, and even the devs' own working habits.

## Two-tier ladder — know which tier you are about to build

| Tier | Name | Meaning | Examples |
|---|---|---|---|
| **1 (target)** | **Prevention / Shutout** | The mistake is **structurally impossible** | A USB plug that won't go in backwards · money stored as an append-only ledger (a number edited mid-air no longer matches) · enum instead of a raw string · buttons that don't overlap a hotspot |
| **2** | **Detection / Attention** | The mistake can happen, but it warns/blocks immediately and is recoverable | validation + error · a car that won't start unless the brake is pressed · lint gate · assertion |

**Golden rule:** if you are about to add a tier-2 validator/detector — **stop and ask first:** "Why can this bad state be *stored/shown* in the first place?" If you can make it **unrepresentable**, do tier 1 instead; it is cheaper in the long run (no false positives, no whack-a-mole, no self-heal code to protect your own detector).

## 3 classic methods (a direct fit for UI/flow/input)

| Method | Principle | Ask yourself |
|---|---|---|
| **Contact** | Shape/position/type forces it so a wrong fit is impossible | Do hotspots overlap? Are elements that can be mixed up separated by type/shape? |
| **Fixed-value** | Pass only when the count is complete / once | Must N be reached before moving on? Is the reward/side-effect "once only" (idempotent guard)? |
| **Motion-step** | Enforce an order, with a single exit that always commits | How many ways out of this flow? Does every one commit/clean up fully? Is there a forgotten "side door"? |

## Decision flow — when you hit a problem/hole/repeat mistake

```
found a bug / cheat hole / dev repeats a mistake / about to write "don't forget X"
        │
        ▼
1. "Why can this bad state occur/be stored in the first place?"
        │
        ├─ can be made unrepresentable → ✅ tier 1 (redesign data/type/layout/flow) ← always choose first
        │
        └─ truly unavoidable (client-side, external factors, etc.)
                 │
                 ▼
        2. detect it so it is "obvious immediately + recoverable, no excessive punishment"
           (self-heal before brick · no false positives · no stuck latch)
```

## Checklist, 3 areas

**Guard against slips (UI / interaction / flow):**
- [ ] No overlapping hotspots/zones (elements that swallow each other's events get separate areas; don't write disambiguation logic)
- [ ] A button that can't be pressed right now is disabled/hidden, not pressable-then-error
- [ ] Mashing/double-click doesn't repeat the effect or skip a step
- [ ] **Exactly one exit, and it always commits** — close every "side door" (system menu, back, shortcuts that bypass the flow)
- [ ] Leaving midway doesn't corrupt state (safe default)

**Guard against cheating / integrity:**
- [ ] Important values are **derivable**, not a raw value that ends the matter once edited (ledger > balance int · progress > raw bool)
- [ ] **Symmetric durability** — what you gain and the price you pay must persist/vanish together (don't make one side permanent and the other revertible, or it can be farmed)
- [ ] Side effects that pay money/give rewards are idempotent (pay-once guard)
- [ ] If you must detect: **self-heal before brick**, sign only the surfaces that need it (don't sign transient state, or you get false positives)

**Guard against yourself (dev guardrail):**
- [ ] **Every "must remember / write a note not to forget" marks where a guardrail should exist** — move the knowledge from your head into a build/hook/test that enforces it
- [ ] Build/CI **fails** when conditions aren't met (files don't match, duplicate values, missing config) instead of relying on memory
- [ ] Artifacts that go stale and break things are gitignored / generated fresh, never left in the tree
- [ ] Checklists are **derived from code** (a scanning script), not lists maintained by hand

## How to use in a session
1. When designing/reviewing: walk through the decision flow + the checklist area that matches the work
2. Every time you are about to add a tier-2 detector/validator, recite the golden rule ("why can the bad state be stored in the first place?") first
3. Every time you are about to write a memory/comment saying "don't forget X", ask whether X can become a guardrail (tier 1/build)
4. Report findings by tier (1 vs 2) and name the fix that lifts it to tier 1, with the trade-off

## Notes
- This is a **flexible** skill: adapt the principles to the context; it is not a rigid checklist where every item is mandatory
- Project-specific cases (e.g. the scorecard of the game being built) go in that project's own memory/docs; this skill is the shared frame

## Related — real examples of this principle in other skills
- `shipping-a-branch` = **Motion-step** in practice: enforces the order push→PR→review→merge and closes the risky "side doors" (no force-push instead of fixing a rejection, no approving your own PR). Every exit must confirm first; there is no silent bypass
