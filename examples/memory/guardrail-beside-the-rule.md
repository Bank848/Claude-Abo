---
name: guardrail-beside-the-rule
description: A "don't forget X" rule written only as prose will be forgotten; add a script, hook or test next to it
metadata:
  type: feedback
rewritten: true
---

When writing a rule of the form "always remember to check X", also add something that enforces it: a script, a hook, a test or an assert. Keep the prose as the explanation.

**Why:** The rule "run the linter before committing" was in the project instructions, and a commit with lint errors still reached the acme-shop main branch three times. A pre-commit hook fixed it on the first day; the sentence alone never did.

**How to apply:** Before saving a prose-only reminder, ask whether a machine can check it. If yes, build that check and have the rule point at it. If a bug that was already fixed comes back, treat it as a missing guardrail. Fall back to prose only when no check is possible, and say so in the note.
