---
name: route-model-by-difficulty
description: Pick the cheapest model that can do the task; spawn a stronger one only for hard decisions
metadata:
  type: feedback
rewritten: true
---

Do routine work on the mid-tier model, send mechanical batch jobs to the smallest one, and spawn the strongest model only for design calls or a second opinion.

**Why:** A week of renaming and formatting jobs on the top model cost roughly four times what the same jobs cost on the small model, with no difference in the result. Each spawn also carries a fixed context cost, so a task the main loop can finish in a few turns is cheaper done in place.

**How to apply:** Announce each spawn in one line (agent, task, reason). Give the subagent a short self-contained brief in English with the goal, constraints, file paths and what is already tried. Ask for a summary back, not raw output. A reviewer model returns findings only and never edits files; a worker model applies the fixes. If a subagent is stuck, message the same one instead of starting a new one.
