# Sharing memory notes safely

Memory notes are the most private thing in a Claude Code setup: names, servers, habits, and the reasons behind
decisions. This page is the checklist for turning a few of them into public examples without leaking anything.
The tools only suggest and stage. Nothing here edits your real memory folders.

## Why examples are written from scratch

Replacing names in a real note leaves its sentences, numbers and anecdotes behind. Those are what identify you.
So a staged or sanitized copy is a reading aid only. A public example is always a new text written from a short
lesson outline.

## Checklist

1. **Fill the private list.** Run `claude-abo seed-denylist`, then read `.public-denylist.txt` and add what no tool
   can know (people, teams, accounts). It stays local and is never committed.
2. **Classify each folder.** `claude-abo memory classify <memory-dir> --out <file outside the repo>`.
   Verdicts: `keep-private`, `shareable-as-example`, `merge`, `stale`. They are suggestions; the report names
   files, which is why `--out` must be outside the repo.
3. **Confirm the verdicts yourself.** Only `shareable-as-example` notes go forward, and only if you agree.
4. **Write a lesson outline** for each: the rule, why, how to apply, one sentence each. Copy no sentences, names,
   numbers or anecdotes. Keep the outline outside the repo.
5. **Write the example from the outline** with an invented scenario. Do it without the real note open, and never by
   editing a staged copy. Add `rewritten: true` to its frontmatter.
6. **Run the gate against your real folders.** `claude-abo memory gate --real <dir> [--real <dir2>]` must show no
   errors. Warnings (`rare-term`) mean a paraphrase may remain: reread the example.
7. **Only then** put the file in `examples/memory/`.

## The tools

| Command | What it does |
|---|---|
| `memory classify <dir> --out <file>` | Writes the verdict table. Prints counts only. |
| `memory sanitize <dir> --stage <dir>` | Writes generalized copies (placeholders such as `<EMAIL>`, `<PRIVATE_REPO>`, `<YOUR_HOME>`) and strips the Claude Code metadata block. The stage must be outside the repo and outside the source folder. |
| `memory gate [--real <dir>...]` | Checks tracked Markdown against your real notes. |

Real memory folders for `check --local` come from the gitignored `.abo-local.json`:

```json
{ "memoryDirs": ["<path to a memory folder>"] }
```

## What the gate checks

- `rewritten-flag` (error, also in CI): every file in `examples/memory/` except `README.md` has `rewritten: true`.
- `near-copy` (error, local): a paragraph of 40 words or more in `examples/`, `learn/`, `global-config/` or
  `.claude/commands/` is at least 0.35 similar (word 5-gram overlap) to a paragraph of a real note. This is a
  backstop. It misses paraphrases; the rewrite step is the real protection.
- `rare-term` (warn, local): an example shares three or more rare words with one real note.

`claude-abo check --local` fails if `.abo-local.json` is missing, so a forgotten setup cannot pass silently.
