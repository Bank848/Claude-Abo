---
name: context-bloat-trim-risk-tolerance
description: "User's risk tolerance when trimming context bloat — willing to disconnect unused MCP connectors/plugins, but not to compress CLAUDE.md/rules files"
metadata:
  node_type: memory
  type: feedback
---

When context window bloat comes up, the user is willing to disconnect confirmed-unused MCP connectors/plugins (verified via session transcript search first) since that's zero-risk, reversible, and was the single biggest lever available.

The user declined to compress their global CLAUDE.md or delete engineering-rule files, even though an analysis pass estimated meaningful token savings from doing so.

**Why:** worried that shrinking the global instruction file risks "making Claude dumber or forgetful" — losing the causal "why" behind hard-won rules (many were written after real incidents) isn't worth the token savings once the bigger, safer win (unused connectors) is already banked. Diminishing returns past the easy wins.

**How to apply:** don't re-propose CLAUDE.md/rules compression as a context-savings measure unless the user brings it up again or the file grows enough that the calculus changes. If future context-bloat audits come up, lead with connector/plugin-level cuts (reversible, no information loss) before touching the instruction file itself.
