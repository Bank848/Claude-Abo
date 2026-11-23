# graphify-structural-diff

Classifies changed files as `NONE` / `COSMETIC` / `STRUCTURAL` before a graphify
semantic-extraction (haiku-batch) pass, so comment/whitespace-only edits don't
burn a Haiku call re-extracting a file whose actual structure didn't change.

Ported idea from Understand-Anything's `fingerprint.ts` (content hash +
structural fingerprint → change level), reviewed 2026-09-25. **Not a patch to
graphify itself** — graphify is a third-party pip package (`graphifyy` on
PyPI, installed in your Python site-packages) and editing its source directly
would get silently overwritten on `pip install -U`. This is a standalone
external filter you run yourself before assembling a haiku-batch chunk.

## Why this exists

graphify already has a sophisticated cache layer (`cache.py`: content hashing,
prompt fingerprinting, stat-based freshness) that skips semantic re-extraction
when a file's bytes are unchanged. But it's whole-content hashing — any byte
change (even a comment edit) invalidates the cache and triggers a real
re-extraction. This tool adds the missing middle tier: "content changed, but
the function/class/import surface didn't" → safe to skip.

## Usage

```bash
# the command to actually call before building a haiku-batch chunk:
# prints exactly the files that need semantic (re-)extraction, one per line
# (STRUCTURAL changes + new/untracked files) -- nothing else to filter yourself
python3 structural_diff.py --repo <path> [--since <ref>] --emit-chunk

# full classification JSON (for inspection / debugging, not for dispatch)
python3 structural_diff.py --repo <path> [--since <ref>]

# restrict to specific paths
python3 structural_diff.py --repo <path> path/to/file1.py path/to/file2.ts

# single-pair mode (no git involved)
python3 structural_diff.py --old-file old.py --new-file new.py
```

`--emit-chunk` is the intended dispatch entry point: it merges "list what
changed" and "apply the COSMETIC/NONE filter" into one command, so building a
haiku-batch file list and filtering it can't drift into two steps where the
filter step gets skipped. Without `--emit-chunk` you get the full JSON
(`{"path": "NONE"|"COSMETIC"|"STRUCTURAL"}`) for inspection — but that's the
debugging path, not the one to wire into an actual dispatch.

## Coverage

| Language | Method | Confidence |
|---|---|---|
| Python (`.py`) | real `ast` module — function/class signatures, decorators, base classes, import surface | high |
| JS/TS/JSX/TSX/MJS/CJS | regex-based best-effort (no tree-sitter dependency on this machine) | best-effort — falls back to STRUCTURAL if nothing recognizable matches |
| Anything else | always `STRUCTURAL` | conservative — never guesses COSMETIC for a language it can't parse |

Parse failures (syntax errors, unparseable JS) always fall back to
`STRUCTURAL` rather than risk a false COSMETIC that causes a real change to
get silently skipped.

## Tested

Smoke-tested 2026-09-25:
- Unit cases: Python cosmetic/structural/identical, JS cosmetic/structural,
  unsupported extension, new file, syntax-error fallback — all classified
  correctly.
- End-to-end against a real temp git repo (`git diff --name-only HEAD`
  integration): comment-only `.py` edit → `COSMETIC`, signature-changed `.js`
  edit → `STRUCTURAL`.
- `--emit-chunk` (added 2026-09-25 per a poka-yoke pass — merges list+filter
  into one command instead of a "don't forget to filter" prose reminder):
  verified a cosmetic-only tracked edit is excluded and a new untracked file
  is included in the same run.

Still not wired into an automated pipeline — graphify's own semantic
extraction is dispatched by Claude's own judgment call each session (prose
instruction in CLAUDE.md's graphify section), not a fixed script/cron, so
there is no true shutout-tier guardrail available here. `--emit-chunk` is the
closest practical guardrail: it collapses "remember to filter" into "call
this one command," rather than leaving the filter as a separate step to skip.
