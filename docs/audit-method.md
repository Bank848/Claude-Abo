# Audit method

How `claude-abo audit` counts what a setup costs. Sections for the formula, checklist and
calibration are added by later tasks; this page starts with what the official docs say
(Task 6, Step 0), read on 2026-11-23.

## What the official docs say (checked 2026-11-23)

Sources: <https://code.claude.com/docs/en/skills>, `/memory`, `/costs`, `/mcp`.
Items marked *(summary)* came from a model-extracted summary of a long page, not a verbatim read.

| Question | Finding |
|---|---|
| Is the skill listing capped by a character budget? | Yes. The budget scales at 1% of the model's context window *(summary)*. `SLASH_COMMAND_TOOL_CHAR_BUDGET` overrides it with a fixed character count; `skillListingBudgetFraction` is the settings alternative. **Default value: not found in the docs.** Over budget, descriptions of the least-invoked skills are dropped first; every skill name stays listed *(summary)*. |
| Per-skill description limit? | `description` plus `when_to_use` is cut at 1,536 characters in the listing *(summary)*; configurable with `skillListingMaxDescChars`. |
| Are MCP tool definitions lazy? | Yes, deferred by default: only tool names and server instructions enter context until a tool is used (`/costs`). `ENABLE_TOOL_SEARCH` changes this *(summary)*. |
| Memory loaded each session | `~/.claude/CLAUDE.md`, `./CLAUDE.md` or `./.claude/CLAUDE.md`, `./CLAUDE.local.md`, `.claude/rules` files without `paths` frontmatter, and the first 200 lines or 25 KB of the project's auto-memory `MEMORY.md`. |
| `@import` depth | Imports can import other files, maximum depth four hops (the first plan draft said 5; the docs win). |
| Config locations | `~/.claude/settings.json`; `.claude/settings.json` and `.claude/settings.local.json` per project; local-scope MCP servers live in `~/.claude.json`. `CLAUDE_CONFIG_DIR` behaviour and the `installed_plugins.json` location are **not documented on these pages**; the collector follows the layout observed on a real setup. |

## Decisions that follow

- `SKILL_LISTING_CHAR_BUDGET` ships as `null` (no cap modelled) until the default is confirmed
  and calibrated in Task 9. The report says so.
- The collector truncates each description (+ `when_to_use`) at 1,536 characters before estimating tokens.
- MCP is not measured offline (deferred loading); the audit reports server counts only.
- Any "reduces context by X%" claim must come from `/context` before vs after, never from the estimate.
