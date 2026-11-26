#!/usr/bin/env python3
"""
graphify-structural-diff — classify changed files as NONE / COSMETIC / STRUCTURAL
before feeding them to a graphify semantic-extraction (haiku-batch) pass.

Not part of graphify itself (graphify is a third-party pip package; its own
source under site-packages gets overwritten on `pip install -U`). This is a
standalone external filter: run it on the set of files a haiku-batch chunk is
about to process, drop NONE/COSMETIC files from that chunk, keep STRUCTURAL +
new files. Ported idea from Understand-Anything's fingerprint.ts
(content hash + structural fingerprint -> ChangeLevel), simplified for a
Python/regex-based implementation with no tree-sitter dependency.

Classification:
  NONE       — byte-identical content (nothing to do)
  COSMETIC   — content changed but structural fingerprint (function/class/
               signature surface) did not — safe to skip semantic re-extraction
  STRUCTURAL — structural fingerprint changed, or the file couldn't be
               confidently parsed (conservative fallback — never silently
               under-classify)

Usage:
  structural_diff.py --repo <path> [--since <git-ref>] [file ...]
  structural_diff.py --repo <path> --old-file <a> --new-file <b>   (single-pair mode)

Output: JSON {"<path>": "NONE"|"COSMETIC"|"STRUCTURAL", ...} to stdout.
"""

import argparse
import ast
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

# --- structural fingerprint extraction -------------------------------------

def _py_fingerprint(source: str) -> "list[str] | None":
    """Function/class signatures + import surface, order-independent. None on parse failure."""
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return None

    sig: "list[str]" = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            args = [a.arg for a in node.args.args]
            decorators = [ast.dump(d) for d in node.decorator_list]
            sig.append(f"def:{node.name}({','.join(args)}):deco={decorators}")
        elif isinstance(node, ast.ClassDef):
            bases = [ast.dump(b) for b in node.bases]
            sig.append(f"class:{node.name}:bases={bases}")
        elif isinstance(node, (ast.Import, ast.ImportFrom)):
            names = sorted(n.name for n in node.names)
            mod = getattr(node, "module", None)
            sig.append(f"import:{mod}:{names}")
    return sorted(sig)


# Regex-based best-effort for JS/TS/JSX/TSX — no tree-sitter dependency on
# this machine. Deliberately loose: it exists only to catch "signature
# surface changed", not to be a real parser. Any content this regex set
# doesn't recognize with reasonable confidence falls through to STRUCTURAL.
_JS_SIG_PATTERNS = [
    re.compile(r"^\s*(export\s+)?(default\s+)?(async\s+)?function\s*\*?\s*(\w+)?\s*\(([^)]*)\)", re.M),
    re.compile(r"^\s*(export\s+)?(default\s+)?class\s+(\w+)(\s+extends\s+[\w.]+)?", re.M),
    re.compile(r"^\s*(export\s+)?const\s+(\w+)\s*=\s*(async\s*)?\(([^)]*)\)\s*=>", re.M),
    re.compile(r"^\s*(export\s+)?(interface|type)\s+(\w+)", re.M),
    re.compile(r"^\s*import\s+.+?\s+from\s+['\"]([^'\"]+)['\"]", re.M),
    re.compile(r"^\s*export\s+\{[^}]*\}", re.M),
]


def _js_fingerprint(source: str) -> "list[str] | None":
    sig: "list[str]" = []
    for pat in _JS_SIG_PATTERNS:
        for m in pat.finditer(source):
            sig.append(pat.pattern + "::" + "|".join(g or "" for g in m.groups()))
    if not sig:
        # No recognizable declarations at all (empty file, pure config, or
        # a shape this regex set can't see) — don't claim COSMETIC on a file
        # we can't actually read. Conservative fallback.
        return None
    return sorted(sig)


_FINGERPRINTERS = {
    ".py": _py_fingerprint,
    ".js": _js_fingerprint,
    ".jsx": _js_fingerprint,
    ".ts": _js_fingerprint,
    ".tsx": _js_fingerprint,
    ".mjs": _js_fingerprint,
    ".cjs": _js_fingerprint,
}


def _content_hash(source: str) -> str:
    return hashlib.sha256(source.encode("utf-8", errors="surrogateescape")).hexdigest()


def classify(old_source: "str | None", new_source: "str | None", ext: str) -> str:
    """Classify a single file's change. old_source is None for a new file."""
    if old_source is None:
        return "STRUCTURAL"  # new file — always needs extraction
    if new_source is None:
        return "STRUCTURAL"  # deleted — let the caller's own delete handling deal with it

    if _content_hash(old_source) == _content_hash(new_source):
        return "NONE"

    fp = _FINGERPRINTERS.get(ext)
    if fp is None:
        return "STRUCTURAL"  # unsupported language — never guess COSMETIC

    old_fp = fp(old_source)
    new_fp = fp(new_source)
    if old_fp is None or new_fp is None:
        return "STRUCTURAL"  # parse failure on either side — conservative

    return "COSMETIC" if old_fp == new_fp else "STRUCTURAL"


# --- git integration ---------------------------------------------------------

def _git_show(repo: Path, ref: str, relpath: str) -> "str | None":
    try:
        out = subprocess.run(
            ["git", "show", f"{ref}:{relpath}"],
            cwd=repo, capture_output=True, check=True,
        )
        return out.stdout.decode("utf-8", errors="surrogateescape")
    except subprocess.CalledProcessError:
        return None  # didn't exist at that ref (new file)


def classify_changed_files(repo: Path, since_ref: str, paths: "list[str] | None") -> dict:
    diff_args = ["git", "diff", "--name-only", since_ref, "--"]
    if paths:
        diff_args += paths
    result = subprocess.run(diff_args, cwd=repo, capture_output=True, check=True)
    changed = [p for p in result.stdout.decode("utf-8").splitlines() if p.strip()]

    out = {}
    for relpath in changed:
        ext = Path(relpath).suffix.lower()
        old_source = _git_show(repo, since_ref, relpath)
        full_path = repo / relpath
        new_source = full_path.read_text(encoding="utf-8", errors="surrogateescape") if full_path.exists() else None
        out[relpath] = classify(old_source, new_source, ext)
    return out


def _untracked_files(repo: Path) -> "list[str]":
    result = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard"],
        cwd=repo, capture_output=True, check=True,
    )
    return [p for p in result.stdout.decode("utf-8").splitlines() if p.strip()]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", type=Path, default=Path("."))
    ap.add_argument("--since", default="HEAD", help="git ref to diff against (default: HEAD)")
    ap.add_argument("--old-file", type=Path, help="single-pair mode: old file path")
    ap.add_argument("--new-file", type=Path, help="single-pair mode: new file path")
    ap.add_argument(
        "--emit-chunk", action="store_true",
        help="print only the files a haiku-batch semantic chunk should include "
             "(STRUCTURAL + new/untracked), one per line, instead of the full "
             "classification JSON -- this is the single command a dispatch step "
             "should call, so 'build the file list' and 'apply the filter' can't "
             "drift apart into two steps where the second gets skipped",
    )
    ap.add_argument("paths", nargs="*", help="restrict to these paths (git diff pathspec)")
    args = ap.parse_args()

    if args.old_file and args.new_file:
        ext = args.new_file.suffix.lower()
        old_source = args.old_file.read_text(encoding="utf-8", errors="surrogateescape") if args.old_file.exists() else None
        new_source = args.new_file.read_text(encoding="utf-8", errors="surrogateescape") if args.new_file.exists() else None
        print(json.dumps({str(args.new_file): classify(old_source, new_source, ext)}, indent=2))
        return 0

    repo = args.repo.resolve()
    result = classify_changed_files(repo, args.since, args.paths or None)

    if args.emit_chunk:
        needs_extraction = sorted(
            path for path, level in result.items() if level == "STRUCTURAL"
        )
        needs_extraction += sorted(_untracked_files(repo))
        for path in needs_extraction:
            print(path)
        return 0

    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
