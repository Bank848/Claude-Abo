---
name: plan-pro
description: Use when writing an implementation plan and you want a reviewed, human-readable HTML plan. Extends superpowers:writing-plans with (1) a spawned multi-agent self-review loop that hunts gaps + critical issues, (2) HTML output with a top "for humans" section built around side-by-side before/after diagrams, and (3) a parallelization analysis that drives parallel execution + a final reviewer/simplifier pass. Trigger on /plan-pro.
---

# Plan Pro

A power-user wrapper around `superpowers:writing-plans`. It keeps everything that skill
does well (zero-context, bite-sized TDD tasks, exact paths, no placeholders) and layers
on three upgrades that a one-shot, unreviewed, wall-of-markdown plan misses.

**Announce at start:** "I'm using the plan-pro skill: writing-plans + spawned review + HTML + parallel execution."

## Why this exists (the three upgrades)

1. **Spawned self-review beats solo self-review.** A plan written and checked by the same
   context misses its own blind spots. After the plan is drafted, dispatch 1–2 fresh
   reviewer subagents whose only job is to find **gaps** and **critical** problems, then
   fold their findings back in and tell the user what changed.
2. **A plan is read by a human, not just executed.** Long markdown plans cause the reader
   (you, later) to skim, lose the thread, and drift off-plan without noticing. So the plan
   is an **HTML** doc whose top 90% is built for a human: narrative + **side-by-side
   before/after diagrams**. *Always create a diagram.* The literal implementation steps
   live below, where they belong.
3. **Implementation should exploit parallelism.** Before executing, work out which tasks
   touch disjoint files and can run concurrently, run those batches in parallel under one
   aggregating reviewer that keeps tests green, then finish with reviewer + simplifier in
   parallel.

## Workflow

### Step 0 — Generate the plan content with writing-plans

**Invoke `superpowers:writing-plans` and follow it fully** to produce the plan's substance:
file structure, bite-sized TDD tasks, exact paths, complete code in every step, no
placeholders, type consistency. Do all of its own Self-Review checklist too.

**Before drafting:** if the feature likely has a reusable cross-project pattern (not tied to this
repo — e.g. a general game-engine idiom, a Python pattern, a UX approach used elsewhere), glance at
`<YOUR_VAULT_PATH>\notes\` for an existing note first instead of re-deriving it from scratch.

**Override these two things from writing-plans:**
- **Output format:** write **HTML**, not `.md` (see Step 2). Save to
  `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.html`.
  (User preferences for plan location still override this default.)
- **Execution handoff:** defer it — Steps 1 and 3 here replace the plain handoff.

### Step 1 — Spawned review loop (gaps + critical)

After the plan content is drafted, dispatch reviewers **in parallel** using the Task tool
(`general-purpose`). Use `references/plan-reviewer-prompt.md`.

- **1 reviewer** for a focused/small plan; **2 reviewers** for a large or multi-subsystem
  plan (give each a different lens — e.g. one "spec coverage + gaps", one "critical
  correctness + sequencing/risk"). Run them in a single message so they execute concurrently.
- Each reviewer returns: **Status**, **Gaps**, **Critical issues**, **Recommendations**.
- **Aggregate** the findings yourself. Fix every Gap and Critical issue inline in the plan.
  Recommendations are advisory — apply the cheap, clearly-right ones; skip the rest.
- If a reviewer surfaced something fundamental (a missing requirement, a wrong sequencing
  assumption), fix it; you do not need a second review round unless the fix was large.

**Then tell the user what the review changed** — a short "Review fixed:" list. This is the
payoff of the loop; do not skip reporting it.

### Step 2 — Emit the HTML plan

Build a single self-contained HTML file from `references/html-plan-template.html`. Structure:

- **Section A — "Read this" (top, ~90% of attention):**
  - One-paragraph goal + the key decisions/tradeoffs in plain language.
  - **Side-by-side before/after diagrams** in a two-column layout: *Current* on the left,
    *Proposed* on the right, so the change is visible at a glance. Use **Mermaid** (loaded
    from CDN in the template) — `graph`/`flowchart` for architecture/data-flow, `sequenceDiagram`
    for interaction changes. **Always include at least one before/after diagram pair.** Add
    more diagrams if the change has several distinct moving parts.
  - A compact "what's changing" summary (files added/modified/removed, new interfaces).
  - For architecture diagrams where a **structural diff between two typed specs** matters
    more than a quick sketch (e.g. a big infra/service-topology change), `archify`
    (external, not installed — `tt-a1i/archify` on GitHub, Node CLI) has a schema-validated
    `delta` mode built specifically for base-vs-head architecture comparison. Heavier
    (Node toolchain, separate HTML output, not Artifact-embedded) than the Mermaid default
    here — reach for it only when the delta itself is the point, not for routine plans.
- **Section B — "Implementation plan" (bottom):**
  - The full writing-plans output: header (Goal/Architecture/Tech Stack), File Structure,
    and every Task with its bite-sized `- [ ]` steps and complete code blocks. Render
    faithfully — this is the executable contract, nothing dropped or summarized.

Keep it one file, no build step, opens in a browser by double-click. Diagram source must
be real and renderable, not pseudo-art.

### Step 3 — Parallelization analysis + execution handoff

Before handing off to execution, add a **Parallelization Analysis** (put it in Section A so
the human sees it):

- Build the task dependency view: which tasks touch **disjoint files** (safe to run
  concurrently) vs. which **must be sequential** (shared files, or B depends on A's output).
- Group into **parallel batches**: "Batch 1: Tasks 2,4,5 in parallel (no file overlap) →
  Batch 2: Task 6 (needs Task 2) ...". Call out the longest sequential chain (the critical path).
- Note any task that edits a file another task also edits — those **cannot** be parallel.

Then offer execution. Mark option 1 "(recommended)" when the current session already has
substantial history/cost or the user has other work queued; otherwise mark option 2:

> **Plan complete and saved to `docs/superpowers/plans/<filename>.html`. Execution options:**
>
> **1. Spawn to background session** — commit the plan file first if untracked, then create
> a `spawn_task` chip; one click opens a fresh session (own billing, own worktree) that
> executes the plan end-to-end and finishes with `shipping-a-branch`. This conversation
> stays free for other work.
>
> **2. Parallel subagent execution (recommended for multi-task plans)** — dispatch one
> subagent per task within each parallel batch (isolated, non-overlapping files), with a
> single **aggregating reviewer** that merges results and keeps tests green after each batch.
> When all batches pass, run **`/code-review` and `/simplify` in parallel** as the final pass.
>
> **3. Subagent-Driven** — `superpowers:subagent-driven-development`, fresh subagent per task,
> two-stage review (best when tasks are highly sequential).
>
> **4. Inline Execution** — `superpowers:executing-plans`, batch execution with checkpoints.
>
> **Which approach?**

**If Spawn to background session chosen:**
- If the plan file (and anything it depends on) is untracked/uncommitted, commit it first —
  a new worktree session cannot see uncommitted changes. Note the commit hash and branch.
- Call `spawn_task` with `cwd` at the repo root and this self-contained `prompt` (the new
  session has no memory of this conversation — it must be complete on its own):

  ```
  Execute the approved implementation plan at docs/superpowers/plans/<filename>.html
  (committed at <hash> on branch <branch>). The plan's task list, parallel batches, and
  acceptance criteria are all in that file — read it fully before starting.

  Execution: follow the plan's batch structure. If it has parallel batches, dispatch one
  subagent per task per batch with an aggregating reviewer keeping tests green between
  batches (plan-pro parallel execution); otherwise use superpowers:executing-plans.
  After all tasks pass, run /code-review and /simplify and apply findings.

  When everything is green, run the shipping-a-branch skill (/ship) to
  commit -> push -> PR -> review -> merge, confirming each step with the user.
  Honor CLAUDE.md TDD and commit conventions.
  ```
- Tell the user: "Chip created — click it to launch. I can't auto-start it."

**If Parallel subagent execution chosen:**
- For each batch, dispatch the batch's tasks concurrently (one Task subagent each). Use
  `isolation: "worktree"` only if subagents would otherwise write the same files — the batch
  design should already prevent that.
- After each batch, the **aggregating reviewer** integrates the changes and runs the test
  suite; do not start the next batch until tests are green.
- Final pass: run `/code-review` and `/simplify` **in parallel**, then apply their findings.
- Honor the user's TDD / commit conventions (CLAUDE.md) throughout.

**After execution completes (options 2-4):** once the final review/simplify pass is green,
do not stop silently — offer in one line:

> All tasks complete and reviews green. Run `/ship` (`shipping-a-branch`) to
> commit → push → PR → merge?

(Option 1's spawned session never reads this file, so its ship step comes from the chip's
`prompt` above, which already includes it.)

## Remember
- The three upgrades are the point — if you skip the spawned review, the diagrams, or the
  parallel analysis, you've just run writing-plans. Do all three.
- Diagrams are mandatory: always create at least one before/after pair.
- The spawned review's value is only realized when you **report** what it fixed.
