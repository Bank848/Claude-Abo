---
name: project-bootstrap
description: One-shot scaffold that wires a repo into the docs-driven continuity system (thin CLAUDE.md router + docs/log/ + docs/adr/ + docs/conventions.md + memory pointer) so a brand-new session inherits context without chat history. Trigger on /project-bootstrap, or proactively when starting substantial multi-session work in a repo that has neither a project-root CLAUDE.md nor docs/log/. Skip for throwaway/single-session work, or if the repo already has CLAUDE.md + docs/log/ (already bootstrapped; use close-out-log instead).
---

# Project Bootstrap: install a system that does not forget across sessions

> One goal: a brand-new session (chat history gone) asked about an earlier decision must answer correctly from docs/memory, not from chat memory.

Ported from the pattern of repos that genuinely "don't forget" (the same pattern also shows up in other projects: `.claude/docs/*_CONTRACT.md` + memory per worktree). This job only **instantiates** things that already have templates. Nothing needs to be designed from scratch.

## Check first (do not redo work)
- `CLAUDE.md` at the root **and** `docs/log/` already exist → this repo is already bootstrapped, skip and use `close-out-log` as usual.
- The work about to be done is throwaway/single-session → skip, setting up the structure is not worth it.

## Steps
1. **Survey the repo before filling in blanks**: stack (Python/Node/game engine etc.), existing gate commands (`justfile`, `package.json` scripts, `Makefile`), and whether git is present.
2. **Copy `~/.claude/templates/project-CLAUDE.md`** → `<repo>/CLAUDE.md` and fill the `<...>` slots for the real stack (see the PRESETs inside the template: PRESET A for Python web, PRESET B for the game engine preset). It must be **at most 45 lines**, and do not dump conventions content in again.
   - While scaffolding, plant tier-1 guardrails (poka-yoke) from day one: generated artifacts → gitignore immediately, config that breaks when missing → make the build/hook fail loudly, and anything you would write as a "don't forget" note in the template → turn it into a hook/check instead if possible.
3. **Copy `~/.claude/templates/conventions.md`** → `<repo>/docs/conventions.md` (or whatever filename the repo already uses, e.g. `docs/03-Conventions.md`) and fill in the gate command + negative fixture for the real stack.
4. **Create `docs/log/` + the first entry** via the `close-out-log` skill. Write the repo's current state (why now / existing decisions / watch out / not done) to seed the "read the log before starting a session" loop.
5. **Create a short `.claude/docs/README.md`** explaining the convention: one topic per file, named `TOPIC_CONTRACT.md` (a standing agreement) or `TOPIC_HANDOFF_YYYY-MM-DD.md` (a daily hand-off).
6. **Write a single memory pointer** (type `project`, through the normal memory system) saying this repo is bootstrapped and where the docs are. It is the discovery path for other sessions.
7. **Add your own line to `~/.claude/SKILLS_INDEX.md`** if it is not there yet (following the existing file format).

## Acceptance criteria ("behaves like a repo that doesn't forget")
1. `CLAUDE.md` is at most 45 lines, sits at the root, and does not duplicate content already in memory/docs.
2. `docs/log/` has at least 1 entry, and the next session really reads it before starting work (not just a file that exists).
3. Existing decisions (if any) are converted into `.claude/docs/` or `docs/adr/`, one topic per file.
4. That session's/project's `MEMORY.md` has a pointer to the place to start reading.
5. **Cold-session test:** open a new session and ask about a decision made before bootstrap → it answers correctly from docs/memory alone.

## Notes
- **flexible:** the number/names of doc files adjust to the stack. **rigid:** the 45-line ceiling on CLAUDE.md and "one topic, one place" (P1, avoids duplicating close-out-log/ADR).
- Always do this in main (like close-out-log). The job needs to read the real repo to fill in the slots correctly, so it is not mechanical work that can be spawned.
- If the repo already has part of `.claude/docs/` or ADRs, fill in only what is missing. Do not overwrite.
