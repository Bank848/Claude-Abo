---
id: 01-memory
title: Memory notes that stay useful
order: 1
minutes: 12
uses:
  - examples/memory/one-fact-per-file.md
  - examples/memory/standing-secret-file.md
  - examples/memory/search-memory-before-giving-up.md
---

# Memory notes that stay useful

## Why

Claude Code starts every session with no memory of the last one. A memory folder is how a correction you made on Tuesday still applies on Friday. It only works if each note is small, true and easy to find, because the index file is loaded every session and every extra line costs tokens.

## How the owner does it

Two words decide where a note goes. "Remember" saves a fact to the current project's memory folder. "Codify" writes a rule into the global `CLAUDE.md`, so it applies to every project. If it is unclear which one is meant, ask before saving.

Each note is one file with one fact. It has a short front matter block, then the rule, a **Why:** line and a **How to apply:** line. The index file `MEMORY.md` holds one line per note and never any note content. See `examples/memory/one-fact-per-file.md` for the shape and `examples/memory/standing-secret-file.md` for a note about keeping secrets in one place.

Before saying "I don't know" or "I can't find it", search the memory folder first. `examples/memory/search-memory-before-giving-up.md` is the note that captures that habit.

## Try it

1. Pick one of your own projects and find its memory folder, usually `~/.claude/projects/<project>/memory/`.
2. Run the classifier on it: `npx github:Bank848/Claude-Abo memory classify <folder> --out notes-report.json`. It sorts notes into groups and writes the result to a file you can read. It changes nothing in the folder.
3. Write one new feedback note about a mistake you made this week, using the shape above. Add one line for it to your `MEMORY.md`.

## Check

Why does the index file hold only one line per note, and what would go wrong if it held the full text?
