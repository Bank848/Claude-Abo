---
name: close-out-log
description: Repo-local close-out ritual. Before finishing any substantial task, append a dated entry to docs/log/YYYY-MM-DD.md with 4 fixed headers (why-now / decisions / watch-out / not-done) so the next session (human or Claude) inherits the WHY and the gotchas. Also read the latest log at session start. Trigger on /close-out-log and proactively when wrapping up a work session, closing a task/feature/milestone, before a commit that ends a chunk of work, or when the user says done / wrap up / close out / finished. Skip only for pure Q&A or throwaway edits with no decision worth remembering.
---

# Close-Out Log: per-repo close-out notes

> **Code says "what". docs/adr says "why, for the whole project". This log says "what we did today and what to watch out for".**
> One goal: the next session (a person, or a Claude whose memory has reset) reads it and **does not lose 2 hours to a trap someone already hit**.

Ported from the `docs/log/` practice of a repo that works well across sessions. Claude stays continuous across sessions through plain files, with no extra tooling.

## Iron rule (P0): finish in about 2 minutes
A ritual that takes too long gets skipped by part-time devs, and a half-written or stale log is **worse than none** (it destroys trust until nobody reads it). So: fixed template, **ceiling of 25 lines per session**, distill by hand, never dump the whole chat.

## Before writing the header, always check the real clock (never guess or estimate from "how long it feels like it has been")
Run `date` (Bash) or `Get-Date` (PowerShell) **in this very turn** before typing any `[HH:MM]`, and use that output directly. Never type a time that did not come from real command output. Reason: models estimate elapsed time poorly from the number of turns and tool calls. Also check that the timezone matches what the user expects (a bare `date` can report the wrong timezone if the shell env differs from the machine, e.g. MSYS/WSL vs Windows local; compare against `git log --date=format-local:...` or ask the user if unsure).

## Recite before appending, verbatim every time
> **Close-out mantra:**
> 1. **Why this piece first?** Order (so the next person does not reshuffle it)
> 2. **What did we pick, what did we drop, and why?** The road not taken is not visible in the code
> 3. **What will bite the next person?** ← 🔑 the most valuable line
> 4. **Is anything being swept under the rug?** Answer honestly, do not over-claim. No debt = write "none", never leave it blank

Reciting takes about 5 seconds (does not affect P0). Then write the file using the 4 headers below.

## The 4 mandatory headers, none can be cut (paired with the mantra above)

| Header | Answers | Why it exists |
|---|---|---|
| **Why now** | Why this piece was picked before the others | Order matters, so the next person does not reshuffle it |
| **Decisions** | What was chosen along the way, and why | The rejected options are not visible in the code |
| **⚠️ Watch out** | Traps, fragile spots, assumptions currently held | 🔑 **The most valuable line. If you can only write one, write this one** |
| **Not done** | Debt and leftovers (none = write "none") | Prevents forgetting and prevents over-claiming "done" |

## Dividing lines: do not write the same thing twice (P1: one topic, one place)
| Content | Goes here instead, not in this log |
|---|---|
| User facts / cross-project knowledge / glossary / feedback | The **memory** system (`~/.claude/memory` + MEMORY.md) |
| State for resuming a session | ECC skill **save-session** |
| Architecture-level decisions (someone will ask "why" in 6 months) | **ADR** (`docs/adr/`, immutable + supersede) |
| Cross-project status of plans and UI artifacts ("how far along") | The worklog index in your notes vault: a single pointer, not content |
| **What the next session reading this repo must know to continue** | ✅ **Here** |

## File format
`docs/log/YYYY-MM-DD.md`: one file per day. **Append** under a time header for each piece of work. Never edit old entries.

```markdown
# 2026-07-17

## [HH:MM] <piece of work being closed>
Why now: ...
Decisions: ... (because ...)
Watch out: ...            ← 🔑 a real trap you caught
Not done: ...             ← after asking "is anything swept under the rug?" (none = "none")
```

If there are leftover non-blocker findings from a review/verify, drop them at the end of "Not done" in the latest log (one bucket only, see the `adversarial-verify` workflow; two buckets = drift).

## Read first at session start
**Always read the latest file in `docs/log/` before starting work.** A log that gets read is a log that gets written (if nobody reads it, it dies silently). The `project-CLAUDE.md` template already says this, **but verify that this repo's CLAUDE.md actually contains an instruction to read it, and does not merely mention `docs/log/`**. If the instruction is missing, offer to add it for the user instead of assuming it exists.

**`docs/log/INDEX.md` has been mandatory in every repo** (it used to be optional. It changed because a new repo has no way to know it should create one without a rule). At session start, open `docs/log/INDEX.md` first (it points straight at the latest file, faster than guessing with `ls`). If a project does not have this file yet (an older repo that never created one), backfill it right away in the round where you notice (see "How to use in a session" for the create/update steps).

## How to use in a session
1. Session start: read the latest log (if any) to learn what is left over and what to watch out for.
2. Closing a piece of work (or before the session ends / before a commit that ends a chunk): recite the mantra, then append the 4 headers.
3. Over 25 lines = distill it shorter. Do not stretch the file.
4. If you find a new glossary term, a cross-project lesson, or a user preference along the way, write it to **memory** immediately (type reference/feedback per the global rules), and the log gets only a "→ memory" pointer. A fact lives in one place, memory (P1).
5. If the work being closed has an open row in the worklog index in your notes vault (grep by project slug; the slug registry is at the top of that file), flip that row's status to `done`/`superseded`/`abandoned` as appropriate before writing the close-out log.
6. When creating a new `docs/log/YYYY-MM-DD.md` (the first file of that day), **also update `docs/log/INDEX.md`. This is no longer optional**:
   - `INDEX.md` already exists: add 1 line pointing at the new file (date + a short summary of what opened today) at the top (newest on top).
   - No `INDEX.md` at all (older repo / never done): **create it right now in this round**. List every existing file in `docs/log/*.md` (oldest at the bottom, newest at the top) so the INDEX is complete from the start, not just a lone pointer to the new file.
   - Skipping this = the index is out of date by the next day (P1: the one place that points must always point correctly).
7. Every time you append a new entry to the existing log file of the same day (not a new day's file), **do not touch INDEX.md**. INDEX points at the "one file per day" level only, not at individual entries inside a file.

## Remember just 3 things
> **1. 4 headers, at most 25 lines. "Watch out" is the heart**
> **2. Recite the mantra before writing, especially "is anything swept under the rug?"**
> **3. At session start, read the latest log first**

## Notes
- **rigid:** the 4 headers and the 25-line ceiling cannot be cut. **flexible:** length and language per header.
- **Always do this in main. Never spawn an agent to write the log for you** (the work context is in main; spawning costs more and knows less).
- If `docs/log/` does not exist, create it. A non-git repo can still have one (it is memory, not a VCS).
- Pure Q&A / typo fixes / throwaway edits: skip (no decision to remember).
