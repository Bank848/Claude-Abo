---
name: standing-secret-file
description: Secrets live in one file outside every repo; check it before asking the owner for a key
metadata:
  type: feedback
rewritten: true
---

Keep every key and token in one folder outside all repositories, one file per service, plus a short index that lists file names and which variables each holds (never values).

**Why:** During the acme-shop payment sandbox work the owner was asked for the same API key in three different sessions, and one copy ended up in a job folder next to the code. A single standing location removes both the repeated question and the stray copy.

**How to apply:** Before asking for any secret, list that folder and check the file size. If it is non-empty, load it inside the command and never print it. If it is missing, create the empty file yourself, give the full path, and ask the owner to paste one line and say "done". Never ask for the value in chat. Using a stored secret does not widen permission: writes to production and anything that spends money still need a yes in chat.
