---
description: Interview the person who cloned this template, then copy/customize the pieces they want into their own Claude Code (~/.claude/) setup, or a portable AGENTS.md if they're on a different AI coding agent.
argument-hint: (no arguments)
---

# /adopt — guided setup for this template

You are walking a new user through adopting this repo (`claude-clone-template`) into their own Claude Code setup. This replaces the manual "How to adopt this" steps in `README.md` with an interactive flow — but the README stays the source of truth for what each piece does; read it now if you have not already (`README.md`, especially the "What's in here" and "How to adopt this" sections).

**Scope discipline — this command does NOT do:** auto-translating Thai content to English, scaffolding a new second-brain vault structure, regenerating `SKILLS_INDEX.md`, writing a "first" memory entry on the user's behalf, or creating command aliases (`/setup`, `/onboard`, etc.). If the user asks for any of those, say it's out of scope for `/adopt` and point at the relevant README section to do by hand.

## Step 0 — resume check

Before asking anything, check whether `.claude-adopt-journal.md` exists in the current directory (this repo's clone). If it does, read it: it records which steps a previous `/adopt` run already completed and with what answers. Summarize that to the user and ask whether to resume from the next unfinished step or start over. If starting over, keep the old journal entries and append a new "restarted" marker rather than deleting the file.

If no journal exists, create it now with a header (timestamp placeholder is fine as text, you don't need a real clock) and append one line per step as you complete it, e.g. `- [done] copied CLAUDE.md -> ~/.claude/CLAUDE.md`. This is what makes a crash mid-way resumable and idempotent — always check the journal before writing a file, so re-running never duplicates or clobbers a step that already succeeded.

## Step 1 — which agent is this for (branches which steps run)

Ask: **"Is this setup for Claude Code, or for a different AI coding agent (Codex CLI, ChatGPT, Cursor, Gemini CLI, etc.)?"**

- **Claude Code** → continue to Step 1a and the rest of this file as written.
- **A different agent** → skip straight to "Non-Claude-Code path" below. Everything else in this file (skills, hooks, subagent files, `settings.json`, the ecc rules, the model-routing ladder) is Claude Code-only and won't do anything for another tool — don't run those steps, and don't waste the user's time being asked about them.

### Non-Claude-Code path

1. Ask which project root to set up (an `AGENTS.md` lives at a project root, not in a home-directory config folder like `~/.claude/`).
2. Ask which of these two the user wants:
   - **Copy `global-config/AGENTS.md` as-is (recommended)** — it's already the portable, Claude Code-agnostic subset (coding style, git workflow, testing, code review, security, common patterns), with every Claude Code-only mechanism stripped out. Most people should pick this.
   - **Use `global-config/CLAUDE.md` as a reference instead** — for someone who wants to hand-pick and reword rules from the fuller file rather than take the curated subset. If they pick this, point them at both files (`global-config/CLAUDE.md` for the source material, `global-config/AGENTS.md` for what "already stripped of Claude Code-only mechanisms" looks like) and stop — writing a custom `AGENTS.md` from that reference is manual work for the user, not something this command auto-generates. Offer to help draft it interactively if they ask, but don't just copy `CLAUDE.md` verbatim; it still references `spawn_task`, the `Skill` tool, and other mechanisms with no meaning outside Claude Code.
3. If they picked "copy as-is": copy `global-config/AGENTS.md` to `<project-root>/AGENTS.md`. If a file already exists there, don't overwrite — show a diff-style summary and ask whether to merge (append distinct sections by hand, not a blind overwrite), same rule as the `CLAUDE.md` copy step below.
4. Report what was copied (or what reference material was pointed to) and stop — the rest of this file's steps don't apply.

## Step 1a — quick persona check (Claude Code path only; affects tone only, not which steps run)

Ask one question: **"Have you used Claude Code before — skills, agents, CLAUDE.md, hooks?"**

- If yes: move fast, use the terms above without defining them.
- If no: briefly define each term the first time you use it (one clause, not a lecture) as you go. Do not create a separate "beginner path" with different files or steps — the actions taken are identical either way, only the explanation depth changes.

## Step 2 — the interview

Ask these questions together (one message, not one-by-one back-and-forth) so the user can answer in one pass. Accept "skip"/"later" for any of them — a skipped answer means "leave the placeholder in place," not "fail."

1. **Target `~/.claude` directory** — confirm the actual path to use (default: detect the real home directory for the current OS/user rather than asking blindly; just show the detected path and ask them to confirm or correct it).
2. **Ollama section** — keep or delete? (See README "Optional: Local AI (Ollama) pre-compression".)
3. **Second-brain vault path** — for `<YOUR_VAULT_PATH>`. "Skip" is fine.
4. **Username / home path** — for `<YOUR_USERNAME>` / `<YOUR_HOME>`. Prefer auto-detecting from the environment and just confirming, same as Q1.
5. **Which of these plugins do you already have installed (or plan to install right now)?** List them explicitly: `superpowers`, `ecc` (everything-claude-code), `pordee`, `lazyweb`, `andrej-karpathy-skills`. This answer controls what the copied CLAUDE.md is allowed to claim — see Step 3 item 5's plugin-honesty fix, which is the most important correctness step in this whole command.
6. **What Claude subscription plan are you on — Max, or something without Fable 5.1 access (Pro, etc.)?** The model-routing ladder in CLAUDE.md tops out at a `fable-medium` subagent (Fable 5.1), which only Max-tier plans can spawn. If the answer isn't Max, see Step 3 item 5b — the ladder gets capped at `opus` instead and the `fable-medium` agent file doesn't get copied.
7. **Which browser automation tool do you want as the default, if any** — the built-in one your Claude Code app ships with, your regular browser via an extension/MCP, a separate agent-only browser, or "none set up yet / decide later"? See the "Browser tool choice" section in `global-config/CLAUDE.md` for what each option trades off. "Decide later" is fine — leave the section's placeholder as-is if so.

## Step 3 — apply, in this order (safe-first, per journal)

Do the low-risk, easily-reversible steps first, and check off each one in the journal immediately after it succeeds — not batched at the end — so a crash after step N leaves N clean journal entries to resume from.

1. Copy `global-config/skills/*` into `<target>/skills/`. Additive only (skip any folder that already exists at the destination and note it in the journal + final report rather than overwriting someone's existing skill).
2. Copy `global-config/agents/*.md` into `<target>/agents/` — **except `fable-medium.md` if Step 2 Q6's answer was not Max** (note the skip in the journal).
3. Copy `global-config/hooks/block-dangerous-git.py` into `<target>/hooks/`.
4. If ecc plugin answer was yes: copy `global-config/rules/ecc-common/` into `<target>/rules/`. If no, skip and say why in the final report.
5. Copy `global-config/CLAUDE.md` into `<target>/CLAUDE.md` **after** applying the two edits below to the copy (do not paste it in verbatim, this is the step the earlier draft plan got wrong):
   - **Delete the Ollama paragraphs from CLAUDE.md** if the Ollama answer was "delete".
   - **Rewrite the "Installed Plugins" section** to list only the plugins the user actually confirmed in Step 2 Q5, in their own words if useful ("not yet installed" is fine as a line item) — never leave in a claim that a plugin is enabled that the user didn't confirm. This section is what makes Claude tell the user the truth about available tooling; getting it wrong is worse than leaving it out, so when in doubt, prefer under-claiming (say "ask the user" for anything unconfirmed) over repeating the template's original claims.
   - If a target `CLAUDE.md` already exists, do not overwrite — show a diff-style summary of what the copy would add and ask whether to merge, and if merging, merge by hand (append distinct sections) rather than a blind file overwrite.
   - **If Step 2 Q6's answer was not Max:** before writing the copy, delete the `fable-medium` paragraphs and the "สุดบันได"/top-of-ladder bullet from the model-routing section, and change the ladder's ceiling to stop at `opus` (the escalate-on-hard-work logic stays, it just has no level above Opus to go to). Note this edit in the journal and final report so the user knows the ladder was capped, not just silently left in a broken state.
   - **Fill in the "Browser tool choice" section's placeholder** with Step 2 Q7's answer — replace the HTML comment with a one-line note naming the chosen tool (or leave the comment as-is if the answer was "decide later").
6. Merge `global-config/settings.example.json` into `<target>/settings.json`: read the existing file if present, merge in the `hooks.PreToolUse` entry (on macOS/Linux, change the hook command's `py` launcher to `python3` first) and whichever `enabledPlugins` entries match Step 2 Q5's answer — the example file only has ready-made entries for `superpowers`/`ecc`, so for `pordee`/`lazyweb`/`andrej-karpathy-skills` note in the final report that there's nothing to merge and the user should add their own `enabledPlugins` entry once installed. Do not blind-overwrite an existing settings.json. After writing, **parse the result as JSON before considering the step done**; if it fails to parse, revert to the pre-edit content, report the failure, and stop (do not continue to later steps with a broken settings.json).
7. Copy `global-config/memory-examples/*.md` into the target project's auto-memory folder only if the user names a specific project to apply them to; otherwise leave them where they are and mention them in the final report as optional reading.
8. Copy `global-config/templates/*` into wherever the user is about to start a new project, only if they ask — this is a "use later" set of files, not part of the core adopt flow.
9. Copy `global-config/tools/skill-update-check/` into `<target>/tools/skill-update-check/` always (it's what `check.ps1 -Ack` in the final report depends on). Copy `global-config/tools/ollama/` too, only if the Ollama answer was "keep".
10. If a vault path was given: copy `notes/` there, EXCEPT `notes/local-ollama-models.md` if the Ollama answer was "delete" (skip the whole vault-copy step if the user only wanted content you're excluding — ask if unsure).
11. Ask if the user also works with other AI coding agents (Codex CLI, Cursor, Gemini CLI, etc.) on any of their projects. If yes, ask which project root(s), and copy `global-config/AGENTS.md` to `<project-root>/AGENTS.md` for each one — same no-overwrite rule as the `CLAUDE.md` copy in item 5 above. This is additive and optional; skip silently (no need to ask) if the user only ever uses Claude Code.
12. Apply the remaining placeholder find-and-replace (`<YOUR_USERNAME>`, `<YOUR_HOME>`, `<YOUR_VAULT_PATH>`) across whatever was actually copied in steps 1-10 — do not touch files that were skipped/deleted per the user's yes/no answers. `AGENTS.md` from item 11 has no placeholders to replace, so it's out of scope for this step. Before running a broad find-and-replace, `grep` the target files first so you know the real count going in — don't trust any number written in this file or in README.md, they can go stale; verify live, every time.

## Step 4 — final report

List: what was copied, what was skipped and why, which placeholders still have unresolved values (and where), and the manual follow-ups that are genuinely out of this command's scope — installing the plugins themselves, running `check.ps1 -Ack` once to set their own `sources.json` baseline, and reconciling `SKILLS_INDEX.md` with whatever they actually installed. Close the journal with a `[complete]` marker line.
