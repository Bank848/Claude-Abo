#!/usr/bin/env python3
"""PreToolUse(Bash) guardrail: gate risky git commands behind a confirmation.

Reads the Claude Code hook JSON from stdin, inspects tool_input.command,
and — when it matches a risky git pattern — asks the user for permission
via a PreToolUse `ask` decision instead of hard-blocking. The user can
approve (push goes through) or deny (Claude is told no) per invocation.

Pure stdlib — no jq/bash dependency, so it works on Windows via the `py`
launcher.
"""
import json
import re
import sys

# Risky git commands. Each is gated behind a user confirmation prompt.
# (pattern, short human-readable label used in the confirmation message)
RISKY_PATTERNS = [
    (r"git\s+push.*--force-with-lease", "force push (with lease)"),
    (r"git\s+push.*(--force|-f)\b", "FORCE push (overwrites remote history)"),
    (r"git\s+push", "push to a remote"),
    (r"git\s+reset\s+--hard", "hard reset (discards uncommitted work)"),
    (r"git\s+clean\s+-[a-z]*f", "clean -f (deletes untracked files)"),
    (r"git\s+branch\s+-D", "force-delete a branch"),
    (r"git\s+checkout\s+\.", "checkout . (discards changes)"),
    (r"git\s+restore\s+\.", "restore . (discards changes)"),
]
COMPILED = [(re.compile(p), label) for p, label in RISKY_PATTERNS]


def extract_command(raw: str) -> str:
    """Get tool_input.command from hook JSON; fall back to raw text."""
    try:
        data = json.loads(raw)
        cmd = data.get("tool_input", {}).get("command", "")
        if isinstance(cmd, str) and cmd:
            return cmd
    except (json.JSONDecodeError, AttributeError, TypeError):
        pass
    # Malformed/unexpected input: scan the raw payload so we still fail safe.
    return raw


def ask(command: str, label: str) -> int:
    """Emit a PreToolUse `ask` decision so Claude Code prompts the user."""
    reason = (
        f"This command would {label}:\n  {command.strip()}\n\n"
        "Approve to let it run, or deny to stop it."
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": reason,
        }
    }))
    return 0


def main() -> int:
    raw = sys.stdin.read()
    command = extract_command(raw)
    for rx, label in COMPILED:
        if rx.search(command):
            return ask(command, label)
    return 0


if __name__ == "__main__":
    sys.exit(main())
