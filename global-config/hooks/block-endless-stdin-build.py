#!/usr/bin/env python3
"""PreToolUse(Bash) guardrail: refuse an endless stdin stream piped into a build tool.

Piping `yes` into an Android build once made every Gradle daemon log a DEBUG
`ForwardInput` line forever (about 60 GB in ~/.gradle/daemon, system drive full).
The hook only sees the Bash command, so it also reads local scripts the command
runs (`bash x.sh`, `./x.sh`, Git Bash `/d/x.sh`, `cd sub && bash x.sh`) and the
scripts those call, two levels deep.

Known gaps (stated, not hidden): the PowerShell tool, mcp terminal tools and
Monitor do not go through this matcher; a build tool hidden inside a Python or
Makefile target is not followed. Any internal error lets the command through.
Pure stdlib, works through the `py` launcher.
"""
import json
import os
import re
import sys

TOOLS = (r"(?<![\w.-])(?:gradlew?(?:\.bat)?|android_build|android\.py|rapt|launcher|build|"
         r"bundletool|sdkmanager)(?![\w-])")
# endless sources: `yes` (also /usr/bin/yes, `command yes`, `sudo yes`, `{ yes; }`),
# /dev/zero, /dev/urandom, `while true ... done`, process substitution `< <(yes)`
SOURCE = (r"(?:(?<![\w.-])(?:\S*/)?yes\b[^|\n;&]*"
          r"|\bcat\s+/dev/(?:zero|urandom)\b[^|\n;&]*"
          r"|while\s+(?:true|:)\b[^\n]*?\bdone\b[^|\n;&]*)")
# `yes | head ...` or `yes | dd ...` makes the stream finite: allowed wherever it sits after
PIPED = re.compile(SOURCE + r"\|(?![ \t]*(?:head|dd)\b)[^\n;&]*" + TOOLS, re.IGNORECASE)
# quoted text (commit messages, echo) is not a pipeline; keep it only after `-c` (bash -c "yes | gradle")
QUOTED = re.compile(r"(-c\s+)?(\"[^\"\n]*\"|'[^'\n]*')")
PROCSUB = re.compile(r"<\s*<\(\s*(?:\S*/)?yes\b[^)]*\)", re.IGNORECASE)

SCRIPT_RUN = re.compile(
    r"\"([^\"\n]+\.(?:sh|bash))\"|'([^'\n]+\.(?:sh|bash))'|"
    r"(?:^|[;&|(\s])([^\s'\"|;&]+\.(?:sh|bash))(?=$|[\s;&|)'\"])")
CD = re.compile(r"\bcd\s+(?:\"([^\"\n]+)\"|'([^'\n]+)'|([^\s;&|]+))")
HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)['\"]?[^\n]*\n.*?\n\s*\1\b", re.DOTALL)


def clean(text: str) -> str:
    """Join line continuations, drop heredoc bodies and whole-line comments."""
    text = re.sub(r"\\\r?\n", " ", text)
    text = HEREDOC.sub("", text)
    return "\n".join(l for l in text.splitlines() if not l.lstrip().startswith("#"))


def endless(text: str) -> bool:
    text = QUOTED.sub(lambda m: m.group(0) if m.group(1) else " ", clean(text))
    return bool(PIPED.search(text)) or (
        bool(PROCSUB.search(text)) and bool(re.search(TOOLS, text, re.IGNORECASE)))


def resolve(path: str, bases) -> str:
    path = os.path.expandvars(os.path.expanduser(path))
    m = re.match(r"^/([a-zA-Z])/(.*)$", path)  # Git Bash /d/x -> D:/x
    if m:
        path = f"{m.group(1).upper()}:/{m.group(2)}"
    cands = [path] if os.path.isabs(path) else [os.path.join(b, path) for b in bases]
    for c in cands:
        if os.path.isfile(c) and os.path.getsize(c) < 1_000_000:
            return c
    return ""


def scan_scripts(command: str, bases, depth=2, seen=None):
    seen = seen if seen is not None else set()
    cds = [next(g for g in m.groups() if g) for m in CD.finditer(command)]
    bases = list(bases) + [resolve(c, bases) or c for c in cds]
    for m in SCRIPT_RUN.finditer(command):
        path = resolve(next(g for g in m.groups() if g), bases)
        if not path or path in seen:
            continue
        seen.add(path)
        try:
            with open(path, encoding="utf-8", errors="replace") as f:
                text = f.read()
        except OSError:
            continue
        if endless(text):
            return path
        if depth > 1:
            inner = scan_scripts(text, [os.path.dirname(path)] + bases, depth - 1, seen)
            if inner:
                return inner
    return ""


def deny(where: str) -> int:
    reason = (
        f"Blocked: an endless stream (yes, /dev/zero, while true) feeds a build tool ({where}). "
        "Gradle daemons then log ForwardInput forever and fill the disk (one real run wrote about 60 GB). "
        "Use a finite answer list instead, for example: printf 'y\\ny\\ny\\n' | <build command>."
    )
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse", "permissionDecision": "deny",
        "permissionDecisionReason": reason}}))
    return 0


def main() -> int:
    try:
        data = json.loads(sys.stdin.buffer.read().decode("utf-8", errors="replace"))
        tool_input = data.get("tool_input") or {}
        command = tool_input.get("command", "")
        if not isinstance(command, str) or not command:
            return 0
        bases = [d for d in (data.get("cwd"), os.getcwd()) if isinstance(d, str) and d]
        if endless(command):
            return deny("in the command")
        path = scan_scripts(command, bases)
        if path:
            return deny(f"in script {path}")
    except Exception:  # fail open on any internal error, never block normal work by accident
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
