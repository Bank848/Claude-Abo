---
name: memory-lint
description: "Health-check the current project's memory system (memory/*.md + MEMORY.md) for stale entries, contradictions, orphans, broken links, and broken frontmatter. Read-only: proposes fixes and asks for confirmation before changing anything. Trigger: /memory-lint, 'check memory', 'does memory contradict itself', 'clean up old memory'. Global, works in any project."
trigger: /memory-lint
metadata:
  type: reference
---

# /memory-lint: health check for the memory system (global)

Adapts the **lint workflow** from Karpathy's LLM Wiki to govern the auto-memory system in use (`~/.claude/projects/<slug>/memory/`). Purpose: a memory that has accumulated dozens of files often has outdated or overlapping entries (for example a bug workaround that was recorded, fixed, and re-recorded across several rounds). This helps catch them before they lead you astray.

## Scope: does not collide with other skills
- **memory-lint** = audits only the *personal memory store* (`memory/*.md` + `MEMORY.md`) against the rules in `~/.claude/CLAUDE.md` (memory section).
- **Not `graphify`**: graphify builds a knowledge graph from a codebase/general documents. memory-lint builds no graph and does not touch source code, it only checks memory files.
- **read-only by default**: it reports problems and proposes fixes. It does not delete or edit files itself until the user confirms (memory reflects "the truth at the time of writing", so deletion needs a person's judgment).

## Find the current project's memory dir
1. Use the path the session gave in its memory context, if there is one.
2. Otherwise derive it from cwd: change `:` `\` `_` → `-`, then look for `~/.claude/projects/<slug>/memory/`.
   For example `C:\work\my_project` → `C--work-my-project`
3. Verify with `ls ~/.claude/projects/*/memory` if the slug is unclear.

## Tier model (resident vs retrievable): understand this before checking
A project that has been migrated to the two-tier layout has a **2-tier** `memory/`:
- **`MEMORY.md`** (resident, auto-loaded every session, budget **≤4KB**): holds **category-level pointers** only (e.g. "all project notes → `memory/INDEX.md` notes section"), no longer per-file pointers.
- **`memory/INDEX.md`** (retrievable, not auto-loaded, no size limit): holds **a pointer for every file** the way MEMORY.md used to.

A project that has not migrated has only the old-style `MEMORY.md` (per-file pointers directly, no INDEX.md). Both are valid. Check against what that project actually uses, and do not complain about a missing INDEX.md if the project does not yet meet the migration criteria (see check 8).

**"Remember" (the original command) writes a retrievable file by default and no longer forces an auto-entry in MEMORY.md.** A file with no pointer is therefore a normal state, not a fault (see check 3, amended below).

## What to check (read every file in memory/ first)
1. **Stale / superseded**: an entry saying "FIXED/DONE/committed" while a newer entry overrides the same topic; or one that cites a file/flag/commit that should be verified as still existing (if you can touch the current code, check).
2. **Contradiction**: two entries saying opposite things (e.g. one says a detector is on, another says it is off).
3. **Orphan (two-tier memory)**: a file in `memory/` with no pointer line **in either `MEMORY.md` or `memory/INDEX.md` (if it exists)** is a real orphan and must be flagged. A file with no pointer in `MEMORY.md` but one in `INDEX.md` is **not an orphan**. It is the normal retrievable state by the new design (per-file pointers moved to INDEX.md and no longer live in MEMORY.md).
4. **Broken links**: a `[[slug]]` pointing at a `name:` that no file matches (a dangling link as a TODO is acceptable, but list it).
5. **Broken frontmatter**: missing `name`/`description`/`metadata.type`, or `type` is not user|feedback|project|reference.
6. **Should be in the repo, not memory**: an entry recording something the repo already records (code structure / git history / CLAUDE.md). The rules forbid storing it.
7. **MEMORY.md / INDEX.md drift**: a pointer in `MEMORY.md` or `memory/INDEX.md` whose target file has been deleted.
8. **Tier report (new)**: measure the size of `MEMORY.md` against the ≤4KB budget (`wc -c`):
   - If over budget → name **demote candidates** line by line, with reasons citing your own resident-memory criteria (trigger invisible ∨ costly if missed). An entry that fails B∨C is the one to propose demoting (squeeze to a category-level pointer in MEMORY.md + move the details to INDEX.md / the original sub-file).
   - Use `search_session_transcripts` to check the **real usage** of the topic/entry historically. The default threshold is **5 sessions** (an entry actually used in fewer than 1 of the last 5 sessions that also fails B∨C is a stronger demote candidate). Note: as tested, this tool searches back at least roughly 1 week across multiple projects/sessions. If a search returns an unusually empty result (you expected hits and found none), judge from the B/C criteria alone and tag the report **"no usage data"**. Do not guess.
   - Output as a table: `<file/entry>`, size (bytes), usage (how many of the last 5 sessions, or "no usage data"), passes B/C criteria?, verdict (resident/demote candidate).
   - **Always read-only**: propose candidates and wait for user confirmation before actually moving anything, like every other check.
9. **INDEX.md coverage (new)**: if the project has `memory/INDEX.md` (already 2-tier), check that it covers 100% of the files in `memory/*.md` (`ls memory/*.md | wc -l` against `grep -c '^- ' memory/INDEX.md`, not counting INDEX.md/MEMORY.md themselves). Any file with no pointer in either MEMORY.md or INDEX.md is flagged as an orphan per check 3.

## Output
Report as a list grouped by checks 1 to 9. For each item: `<file>`, the problem, the proposal (delete/merge/update/add pointer/fix link). Order stale + contradictory first (most dangerous, they lead you astray), then orphan/link/format, and close with the **Tier report** (checks 8-9) as a clearly separate section.

If the user says "just fix it" → go one item at a time. A deletion/merge needs a short explanation of why, then update MEMORY.md so it stays in sync.

## Pairs with existing skills
- Found memory that is a duplicated learning/feedback → merge along the lines of `consolidate-memory`.
- A good time to run it is after closing a big session, or before resuming work in the same project.
- A finding that shows up every lint round = a poka-yoke signal: ask whether that state can be made impossible when the memory is written (template / naming rule / hook) instead of waiting for lint to catch it each time.
