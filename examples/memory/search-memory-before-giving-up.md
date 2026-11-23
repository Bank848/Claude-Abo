---
name: search-memory-before-giving-up
description: Before saying "I can't find it" or "I don't know", search memory and the notes index first
metadata:
  type: feedback
rewritten: true
---

Search the project memory index and the notes index before telling the user you are stuck, cannot find something, or have no information.

**Why:** The staging URL for acme-shop was saved in memory two weeks earlier, yet a session told the user it had no record of one and asked for it again. The answer was one grep away.

**How to apply:** Grep the memory index and the notes index by keyword (and by the project name) first. If something is found, use it and say where it came from. If nothing is found, say which places you searched. Only then ask the user. This applies to every domain, not just code.
