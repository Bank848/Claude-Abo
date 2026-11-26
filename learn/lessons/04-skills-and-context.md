---
id: 04-skills-and-context
title: What your skills cost in context
order: 4
minutes: 12
uses:
  - docs/audit-method.md
  - catalog/skills.json
---

# What your skills cost in context

## Why

Every installed skill puts its name and description into the context window at the start of each session, whether you use it or not. A hundred skills with long descriptions can take a noticeable share of the window before you type anything.

## How the owner does it

The audit estimates that fixed cost. It counts the description of each skill, agent and `CLAUDE.md` file, adds them up and shows a likely range. The number is an estimate with a stated error, not a measurement: for exact figures run `/context` inside Claude Code. The method and its limits are in `docs/audit-method.md`.

To cut, start from the largest descriptions and the skills you have not called lately. Remove or disable one at a time and compare `/context` before and after. Do not use the audit estimate to claim a saving.

A catalog entry in `catalog/skills.json` tells you more than a name. Read these fields:

- **license:** the SPDX id and whether redistribution is allowed. A skill marked as a pointer is not bundled; you install it from upstream.
- **tested:** a date, or empty. Empty means nobody has run it yet.
- **knownIssues:** problems recorded so far.
- **security:** the date of the last static scan and how many errors it found.

## Try it

Run `npx github:Bank848/Claude-Abo audit` and read the "What to cut first" list. Pick one skill you do not use. Note the `/context` total, disable that skill, start a new session and note the total again.

## Check

A skill has no tested date and a pointer status. What does each of those tell you before you install it?
