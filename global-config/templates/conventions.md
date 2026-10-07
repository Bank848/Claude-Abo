<!--
  TEMPLATE — copy to docs/conventions.md in a real project, then fill in the <...> slots
  Source: green-gate + negative-fixture ported from the some-other-project/link repo
  What duplicates existing skills (ADR = ecc:architecture-decision-records ·
  gate = ecc:quality-gate) is left out — this file keeps only "what doesn't exist yet" + the boundary rules
  Ceiling: body (outside comments) ≤40 lines — new content goes to ADR/log, not here

  ── pick a PRESET for your stack and fill the <...> slots (delete the other preset) ──
  PRESET A — Python web:
    gate: `just check` = ruff format --check · ruff check · pyright strict ·
          import-linter (layer) · pytest
    negative proof: a deliberately bad fixture in tests/fixtures/bad/ (kept permanently) +
          a test asserting the checker "rejects" the fixture → test passes = gate stays green permanently
    tooling: <uv/poetry pin py version> · schema change = a single alembic command

  (If the stack is something else, e.g. a game engine with its own custom MCP/authoring tool —
   write an extra PRESET following A above: gate command, negative-proof pattern,
   special rules for editing files through the dedicated tool instead of direct Edit/Write)
-->

# <PROJECT> — Conventions

## The one principle that covers everything
> **Code says "what" · docs say "why" · tests say "it must be like this" — never let two of them say the same thing**
> The day they conflict you won't know which one is lying → when you hit a duplicate, lift it to one place (single source)

## Green-gate = DoD (Definition of Done)
- **One command every commit must pass:** `<gate command e.g. just check / npm run check / ./check.ps1>`
  covers: `<format · lint · type-check strict · boundary/layer · test>`
- **"A rule without a test is a request"** — every rule you want enforced needs a test in the gate, or it gets relaxed the first day someone is lazy

## Negative-fixture — the gate must have been seen to "reject bad input" with your own eyes (P3)
A rule you have never seen a test reject bad input for may be silently doing nothing (green-washing). So:
1. For each rule → keep a **deliberately bad fixture** permanently in `tests/fixtures/bad/` (never delete) + write a test that **asserts the checker rejects that fixture** — test passes = rejection succeeded → **gate stays green permanently** (not permanently red) · **(fixture style depends on the stack — some stacks use tamper→restore instead of leaving a broken file in the tree)**
2. **Before wiring that assertion**, run the checker directly on the fixture and **see it rejected with your own eyes once** (or write the test TDD-red first, before implementing the rule) — otherwise you can't tell whether the assertion is green because it truly guards or because it never catches anything
3. Record in docs/log: _"saw the checker reject fixture <X>"_
4. A CONFIRMED finding from review/verify that is a reproducible bug → **ends its life as a bad fixture** (the gate grows from real work)

## ADR — use `ecc:architecture-decision-records`, with extra requirements
- Every record must have a field **"what the old way / rejected alternative got wrong"** — this field is what makes ADRs actually get read (it keeps the lesson, not just the verdict)
- **ADRs are never edited** · changing your mind = write a new record `Supersedes: ADR-XXXX` (the history of thinking must stay)
- Index at `docs/adr/README.md`, **≤1 screen**, one line per record

## What to write where (routing — keeps P1 intact)
| Content | Location |
|---|---|
| Why the code here is like this / "don't" | comment/docstring in the code |
| Architecture-level decisions | `docs/adr/` (immutable) |
| What was done today + watch-outs + outstanding debt | `docs/log/` |
| Register of debt/non-blocker findings | end of the latest log (one bucket) |
| User matters / glossary / cross-project | global memory system |
