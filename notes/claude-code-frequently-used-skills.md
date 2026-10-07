---
name: claude-code-frequently-used-skills
description: Summary of the Claude Code skills actually used often in day-to-day work, grouped by category, with how to invoke each and when to use it
metadata:
  type: reference
---

# Frequently used skills (Claude Code)

Summarized from `~/.claude/SKILLS_INDEX.md` (full index, 200+ skills). This file keeps only the 11 skills picked up in routine work (feature planning, review, UI, ship). Update whenever the usage pattern changes

---

## 🧠 Feature planning / design

| Skill | What it does | How to use |
|---|---|---|
| `superpowers:brainstorming` | Explore intent + requirements + design before any creative work; mandatory before touching code | Automatic when starting new work that isn't settled yet |
| `/plan-pro` | Writes an implementation plan, building on `writing-plans`: spawns a review agent to hunt for gaps before handing off, outputs HTML with before/after diagrams (Mermaid) for easy reading, includes a parallelization analysis | Always use instead of bare `writing-plans`; if the design is already approved in chat and the work is small-to-medium, skip the separate spec.md |
| `/grilling` | Has the AI relentlessly "grill" the plan before work starts, walking every branch of the design tree one question at a time and suggesting answers | Say "grill"/"stress-test" or `/grilling`; works for games/translation/general work (writes no files to the repo) |

---

## 🔍 Review / Debug

| Skill | What it does | How to use |
|---|---|---|
| `/scrutinize` | Outsider-perspective review: first checks whether a simpler way exists, then traces the actual code (not just the diff) | Use to check a plan/PR/diff before sending it for real |
| `/debug-mantra` + `superpowers:systematic-debugging` | Forces reciting the 4 steps before proposing a fix: reproduce → trace fail path → falsify hypothesis → cross-reference | Triggers automatically on a bug/error/stack trace |
| `adversarial-verify` (workflow, **not included in this template**) | Verify a code review's claims before actually fixing; a claim is trusted only if CONFIRMED with a quoted file:line | Feeds on from `receiving-code-review` |
| `superpowers:verification-before-completion` | Forces running real verification before claiming "done" | Use every time before saying the work is finished |

---

## 🎨 UI / Design

| Skill | What it does | How to use |
|---|---|---|
| `ui-ux-pro-max` → `ui-styling` | Design new UI: DB of 50+ styles, 161 palettes, 57 font pairs, 99 UX guidelines → implement for real with shadcn/Tailwind | Call in order: design first, then implement |
| `make-interfaces-feel-better` + `deslop-defaults` | Polish UI that is "functional but not pretty": the first is optical craft (spacing/type/shadow), the second is structural restraint (z-index, a single accent, no AI-slop look) | Use together when reviewing/generating UI |

---

## 🚀 Git / Ship

| Skill | What it does | How to use |
|---|---|---|
| `shipping-a-branch` (`/ship`) | Full flow commit → push → PR → review → merge; every risky action (push/PR/merge/delete branch) is confirmed separately, one at a time | Use instead of directly saying "commit and open a PR" |

---

## 🛠️ Meta / personal tooling

| Skill | What it does | How to use |
|---|---|---|
| `update-config` | Edit `settings.json`: hooks, permissions, env vars | Use when setting up automation or an allowlist |
| `/graphify` | Turn any input → knowledge graph (HTML/JSON + audit) | `/graphify` |

---

## 💰 Cost routing (applies to every task; not a skill but a rule)

The main loop is Opus 5.5 or Sonnet 5.5 (your choice) and acts as orchestrator (plans, decides, checks work) → mechanical work spawns `haiku-batch` → reading many files spawns `Explore` → big chunks of standard work (main=Opus) spawn `sonnet-worker` → genuinely hard work (main=Sonnet) spawns `opus` → the highest-stakes work where opus still wavers spawns `fable-medium` (medium effort). Full rules live in `~/.claude/CLAUDE.md`

---

## See also

- Full index of 200+ skills: `~/.claude/SKILLS_INDEX.md`
- Agent orchestration/git/testing rules: `~/.claude/rules/ecc/common/*.md`
