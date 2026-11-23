---
id: 03-hooks-and-safety
title: Hooks, draft-first PRs and a clean public repo
order: 3
minutes: 15
uses:
  - global-config/hooks/block-dangerous-git.py
  - examples/memory/confirmed-commands-ask-not-deny.md
  - examples/memory/force-with-lease-explicit-sha.md
  - examples/memory/guardrail-beside-the-rule.md
---

# Hooks, draft-first PRs and a clean public repo

## Why

A rule written in prose depends on the model remembering it. A hook is code that runs on every tool call, so it cannot forget. Use prose for judgement and hooks for things that must never be skipped, such as pushing to a remote.

## How the owner does it

`global-config/hooks/block-dangerous-git.py` is a small `PreToolUse` hook for the Bash tool. It reads the command from stdin and checks it against a list of risky git patterns: any push, force push, hard reset, `clean -f`, forced branch delete and `checkout .`. On a match it returns an `ask` decision, so you see a prompt and approve or refuse each time. It asks instead of hard blocking, which is the idea in `examples/memory/confirmed-commands-ask-not-deny.md`. It uses only the Python standard library.

Three more habits sit around it:

- **Guardrail beside the rule.** When a prose rule keeps being forgotten, add a hook or a test next to it. See `examples/memory/guardrail-beside-the-rule.md`.
- **Force pushes name the commit.** Use `--force-with-lease` with an explicit SHA, as in `examples/memory/force-with-lease-explicit-sha.md`.
- **Draft-first PRs.** Open pull requests as drafts and mark them ready as a separate step you confirm.

For a public repo, run `npx github:Bank848/Claude-Abo public-scan` before any push. It looks for private paths, emails and other strings that should not be published.

## Try it

1. Run `npx github:Bank848/Claude-Abo audit --probe-hooks`. It feeds a test force-push command to your own user-level PreToolUse Bash hooks as input (the command itself is never run) and reports whether one blocked it. It never runs hooks that live inside the project you are in.
2. Read the checklist in the output. If no git guard is found, copy `block-dangerous-git.py` into `~/.claude/hooks/` and register it in your settings yourself; the lesson does not do that for you.

## Check

Why is `ask` safer than a silent block for a command you sometimes do want to run?
