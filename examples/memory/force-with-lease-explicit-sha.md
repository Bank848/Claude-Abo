---
name: force-with-lease-explicit-sha
description: When a force push is unavoidable, pin the expected remote commit so it fails if someone else pushed
metadata:
  type: feedback
rewritten: true
---

If a branch must be force-pushed (after a rebase, say), use `--force-with-lease=<branch>:<expected-sha>` with the commit you last saw on the remote, never a bare `--force`.

**Why:** A teammate pushed a fix to the shared `feature/cart` branch while a rebase was in progress. A plain force push would have erased that commit silently. With the sha pinned, the push was rejected and the fix was merged in first.

**How to apply:** Run `git fetch` and `git rev-parse origin/<branch>` just before the push, and pass that value. Never force-push the default branch. After the push, confirm with `git log origin/<branch> -1` that the remote holds what you intended.
