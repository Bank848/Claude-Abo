---
name: codeburn-cost-check
description: Use when the user asks how much they've spent on AI coding tools (Claude Code, Cursor, Codex, etc.), wants a token/cost breakdown by model/project/task, or asks to check today's/this month's AI spend. Also use proactively before recommending an expensive model for a task if recent spend is unknown.
---

# codeburn cost check

`codeburn` is installed globally (`npm i -g codeburn`). It reads local session files from 41 AI coding tools — no API keys, nothing leaves the machine.

## Commands

- `codeburn status` — compact today + month spend and call count. Use for a quick answer.
- `codeburn overview` — plain-text, copy-pasteable summary (defaults to this month).
- `codeburn today` / `codeburn month` — fuller breakdown for that period.
- `codeburn export --format json` — structured data if you need to compute/filter further.
- `codeburn optimize` — finds token waste and suggests concrete fixes (useful when the user wants to cut spend, not just see it).

Run the command directly via Bash and summarize the result in the user's language — don't just dump raw output.
