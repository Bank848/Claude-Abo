---
name: ponytail
description: "Disciplined laziness: write the least code that still works correctly. Before writing anything new, always climb the ladder YAGNI → stdlib → native → existing dependency → one-liner. Trigger: /ponytail, 'lazy mode', 'minimal solution', 'it is too much / over-engineered', or proactively on small, isolated work that writes new code, and while drafting tasks in plan-pro/writing-plans (see Proactive trigger). Not a permanent persona: once the trigger condition ends, go back to normal mode."
trigger: /ponytail
metadata:
  type: reference
---

# /ponytail: disciplined laziness (global)

Adapted from the idea in DietrichGebert/ponytail, but **dropping the permanent persona and ultra mode**, because those made the model "blurry, too lazy, and silently cutting requirements". What is kept is the real core: *the decision ladder + review/audit commands*, with guardrails so it does not bite work that needs care.

The core: **"the best code is code you did not have to write"**, but "works correctly" always comes before "short".

## Scope (important)
- It is **opt-in for a single task**, not a lingering mode (when invoked by `/ponytail` itself). When the task ends, go back to normal mode. Do not carry it into other tasks on its own.
- The user types `/ponytail` or complains "that's too much / over-engineered / can you write it shorter" → turn it on.
- Turn off: the user says "enough / normal mode" or starts a new task.
- **It can also trigger proactively** under narrow conditions, see "Proactive trigger" below. Unlike opt-in, it does not wait for the user to ask, but it still ends by itself per point / per task and never lingers as a mode.

## Proactive trigger
Climb the ladder **without waiting for the user to type `/ponytail`** at 2 moments. Both must **announce "Using ponytail to ..." as with any other skill call** (per the harness's using-superpowers rule, there is no silent exception for ponytail):

**(1) Direct ad-hoc code write**: all of these must hold:
1. The work is truly small/isolated (changing or adding code in one spot, one function; not a large multi-file feature) and **did not go through** brainstorming/writing-plans/plan-pro first (see point 2).
2. About to **write something new** (a new helper/abstraction/dependency), not just edit existing code.
3. Not work that falls into the no-minimize zones (the "🚫 Never cut" section below: validation, error handling, security/integrity checks, accessibility, non-trivial tests, requirements the user asked for directly), and not a kind of work the "⚠️ Guarding against blur" section warns never to use this mode on (hard algorithms, deep debugging, security-sensitive).
4. The user did not directly ask for thoroughness/robustness in that turn.

**(2) While planning (plan-pro / writing-plans)**: when drafting each task that writes new code (a new helper/abstraction/dependency) in the plan, climb the ladder before writing that task into the plan, even if the plan as a whole is large / multi-file (the trigger criteria can still be met point by point, not for the whole plan). Purpose: stop over-engineered tasks from slipping into the plan from the start, instead of waiting to catch them at the end. The same no-minimize zones apply (point 3 above): a task that is the algorithm / security / architecture core of the plan does not meet this criterion.

For both moments: **if unsure whether it qualifies, do not trigger** (keep the criteria narrow so it does not bite work that should be thorough). If you cut something or take a shortcut for real, mark it with `# ponytail:` as usual.

## Decision ladder: ask in order before writing anything new
1. **Does this need to exist at all?** (YAGNI: work nobody asked for / hedging for a future that has not arrived = skip)
2. **Does the stdlib / language already do it?**
3. **Is it a native feature of the platform?** (e.g. a framework's built-in features: do not write your own)
4. **Can a dependency that is already installed solve it?**
5. **Can it be done in one line?**
6. If all of those pass → write the **minimum that works correctly**, with no abstraction/boilerplate nobody asked for.

Principle: **delete > add**. If the problem can be solved by deleting code, that is the better answer.

## 🚫 Never cut (no-minimize zones)
The ladder applies to "unnecessary code" only. These are not excess, so never be "lazy" about them:
- **input validation / boundary checks**
- **error handling** (never swallow errors silently to make code shorter)
- **security / integrity checks**: signing, validation and defense-in-depth work is **OFF-LIMITS**, the complete opposite of ponytail. Never use this mode to reduce security layers or thoroughness.
- **accessibility**
- **anything the user asked for directly** (a stated requirement = never cut it yourself, ask first)
- **tests/self-checks for non-trivial logic**

If you want to reduce a requirement → **propose it and ask first**. Never cut silently.

## ⚠️ Guarding against "blurry / drunk / lazy" (where the original ponytail broke)
- "Short" is not "correct". Never trade correctness/completeness for line count.
- Never answer sloppily or explain so little that the user cannot follow. Code-first is fine, but say "what was cut and why" briefly.
- Never "challenge requirements" in an extremist way (a symptom of ultra mode). If you suspect a requirement is more than needed, ask, do not delete.
- If the work is a hard algorithm / deep debugging / security-sensitive code → **do not use this mode**, it pulls toward shallow thinking.

## Mark deliberate shortcuts
If you take a shortcut and accept a trade-off, comment `# ponytail: <why + limitation>` so it can be tracked down and explained later.

## Modes (default = full, with the guardrails above)
- **lite**: build what was asked, then *offer* a lazier route to choose from (not forced).
- **full** (default): climb the ladder seriously, under the no-minimize zones.
- ~~ultra~~: **removed**. If the user really asks for ultra, warn about the risks first and only do it on small tasks that do not touch the no-minimize zones.

## review / audit (read-only, safe to use any time)
- **`/ponytail review`**: look at a diff/recently edited code, point out over-engineering (excess abstraction, code that duplicates the stdlib, dead code, hedging for the future) and propose a shorter version. It does not make the edits itself until told to.
- **`/ponytail audit`**: scan the whole project/folder for over-engineering as a ranked list.
- Pairs with existing tools: `/simplify` (fixes it for you), `/scrutinize` (questions intent), `poka-yoke` (prevents mistakes at design time).
