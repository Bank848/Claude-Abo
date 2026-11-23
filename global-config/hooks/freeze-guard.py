"""PreToolUse guard: while a freeze is active, block Edit/Write/NotebookEdit outside the frozen directory.

Toggle:  py ~/.claude/hooks/freeze-guard.py on <dir> | off | status
State:   ~/.claude/freeze-dir.txt (one line, absolute path). No file = no freeze.
Covers Edit/Write/NotebookEdit only; Bash writes are NOT covered (use permissions for that).
"""
import json
import os
import sys

STATE = os.path.expanduser("~/.claude/freeze-dir.txt")
ALWAYS_OK = [os.path.expanduser("~/.claude/projects"), os.environ.get("TEMP", "")]


def norm(p):
    return os.path.normcase(os.path.realpath(os.path.expanduser(p)))


def inside(path, root):
    root = norm(root)
    path = norm(path)
    return path == root or path.startswith(root + os.sep)


def cli(argv):
    cmd = argv[0] if argv else "status"
    if cmd == "on" and len(argv) > 1:
        with open(STATE, "w", encoding="utf-8") as f:
            f.write(norm(argv[1]))
        print("freeze ON:", norm(argv[1]))
    elif cmd == "off":
        if os.path.exists(STATE):
            os.remove(STATE)
        print("freeze OFF")
    else:
        print(open(STATE, encoding="utf-8").read().strip() if os.path.exists(STATE) else "no freeze")


def main():
    if len(sys.argv) > 1:
        return cli(sys.argv[1:])
    if not os.path.exists(STATE):
        return 0
    root = open(STATE, encoding="utf-8").read().strip()
    if not root:
        return 0
    try:
        data = json.load(sys.stdin)
    except ValueError:
        return 0
    inp = data.get("tool_input") or {}
    target = inp.get("file_path") or inp.get("notebook_path")
    if not target:
        return 0
    if inside(target, root) or any(a and inside(target, a) for a in ALWAYS_OK):
        return 0
    print(f"freeze active: edits are limited to {root}. Blocked: {target}. "
          f"Ask the user to run `py ~/.claude/hooks/freeze-guard.py off` or change the dir.", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
