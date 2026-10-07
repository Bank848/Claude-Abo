<!--
  TEMPLATE — copy to CLAUDE.md at the project root, then fill in the <...> slots
  Source: ported from CLAUDE.md of the some-other-project/link repo (the original is ~40 lines)
  This file = a "router" that only points the way, not a content store
  Don't duplicate the global CLAUDE.md (cost-routing / planning workflow / TDD already exist at global level) —
  keep only things specific to this project

  ── examples of filling the slots by stack (full PRESET in docs/conventions.md) ──
  Python web:  gate = `just check` (ruff·pyright·import-linter·pytest·alembic)
               tooling = <uv pin py3.12> · schema = a single alembic command
  (other stacks with their own custom authoring tool/MCP — write an extra preset following this pattern:
   gate command, negative-proof pattern, rules for editing files through the dedicated tool instead of direct Edit/Write)
-->

# <PROJECT> — <one line on what this project is>

> This file is **≤45 lines** — new knowledge goes to ADR/log/conventions; only pointers may be added here
> (when it bloats = it starts duplicating docs = drift)

## Start of every session — read first
- `docs/log/` **latest file** — what is outstanding, what to watch out for (a log that gets read is a log that gets written)
- `docs/adr/README.md` — before touching any area, read the relevant ADRs (each has a "why")
- `docs/conventions.md` — code/design rules + the gate definition

## The one principle that covers everything
> **code = what · docs = why · test = must be — never let two of them say the same thing**

## DoD — must be green before commit
- `<gate command>` = `<format · lint · type strict · layers · test>`
- **A rule without a test is a request** · the gate must have been seen red on a bad fixture (see conventions)

## Before closing out any work
- Write `docs/log/<today>.md`: **why now / decisions / ⚠️watch-out / not done**
- Before writing "not done", ask yourself out loud: **"Am I hiding anything?"** (surface debt, no over-claiming)

## Rules never to forget (fill from this project's real bugs — tie each to a test)
1. <rule #1 that came from a real bug → which test enforces it>
2. <rule #2 ...>
3. <...>

## After review / audit
- Before fixing per a finding: verify the claim with the **adversarial-verify** workflow (CONFIRMED = has a real quoted line only) → fix blockers first, log the rest in the register (end of log) · a CONFIRMED reproducible bug → add a bad fixture (see conventions)

## Project-specific tools / prohibitions
- `<tooling: package manager, runtime pin, etc.>`
- `<specific prohibitions, e.g.: git = the real thing, VPS = a copy, never edit on the server>`
