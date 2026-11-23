---
name: one-fact-per-file
description: Keep each memory note to a single fact so recall can match it by its description line
metadata:
  type: feedback
rewritten: true
---

Write one fact per memory file, with a description that says what the fact is in one line.

**Why:** On the acme-shop project a single `notes.md` grew to 40 lines of unrelated facts. Recall matches on the description line, so a file about "checkout, staging URL and the flaky test" matched nothing well, and the staging URL was missed twice.

**How to apply:** Before saving, ask whether the fact has its own name. If two facts would be recalled for different questions, they are two files. Check for an existing file on the same topic first and update it instead of adding a near-duplicate. Add one line to the index file per memory, never the memory text itself.
