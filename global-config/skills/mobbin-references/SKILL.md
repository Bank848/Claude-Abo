---
name: mobbin-references
description: Use before designing any UI when the user wants real reference screenshots — onboarding flows, paywalls, empty states, dashboards, or any "show me how apps actually do X" request. Checks whether Mobbin MCP is connected and pulls categorized real-app screenshots directly; falls back to manual/browse-based reference gathering when it isn't.
license: MIT
---

# Mobbin References

Real-app UI screenshots as design reference, sourced live via MCP instead of manual screenshot-and-paste.

## When to Use

- User asks to design a screen/flow "like a real app does it" (onboarding, paywall, empty state, dashboard, etc.)
- Before writing any new UI where a concrete layout reference would beat guessing
- User explicitly mentions Mobbin

## How to Use

1. Check whether `mcp__*mobbin*` tools are present (they load lazily — use ToolSearch with query "mobbin" if not already visible).
2. **If connected:** query Mobbin directly for the relevant pattern (app category, flow type, screen type) before designing. Treat the screenshots as **layout reference only** — never copy a color scheme from them (see `design-system`'s Minimum Semantic Set for why: 10 references give 10 different palettes).
3. **If not connected:** say once, plainly — *"Mobbin MCP not connected. It's a paid tier (~10 EUR/month, annual billing) and needs a one-time browser OAuth via `/mcp` in an interactive session."* Do not repeat this warning on every turn, do not block, and do not treat connecting it as something to push the user toward. Then fall through to manual reference gathering (see the `lazyweb` skills — `lazyweb-design-research` / `lazyweb-add-inspo-source`) and continue the task.

## Boundaries

- Never treat Mobbin as a required step — it's strictly an upgrade over manual screenshotting, not a gate.
- Never invoke OAuth or connection flows yourself; that's a user action via `/mcp`.
- Color decisions always come from the project's own token vocabulary (`design-system` skill), never from a Mobbin screenshot.
