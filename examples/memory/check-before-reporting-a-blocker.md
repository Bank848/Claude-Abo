---
name: check-before-reporting-a-blocker
description: Before reporting something as blocked or missing, check the main branch and what is already installed
metadata:
  type: feedback
rewritten: true
---

Before telling the user a feature is missing or a task is blocked, check the default branch and the installed version for it.

**Why:** A session reported that the acme-shop discount module was not written, but it had been merged to the default branch the day before; the working branch was simply behind. The user lost an hour re-planning work that already existed.

**How to apply:** Run `git fetch`, then look at the default branch and at what is actually installed or deployed. Say which branch and commit you looked at when you report a blocker. If the folder the user runs from is on an old branch, tell them how far behind it is instead of calling it synced.
