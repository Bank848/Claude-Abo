#!/usr/bin/env python3
"""PostToolUse(Write|Edit) hook: keep graphify-out/graph.json in sync automatically.

graphify has no built-in file-watcher, so its graph goes stale after every
edit unless someone remembers to run `graphify update .`. This hook launches
it detached and returns immediately, so Write/Edit is never blocked waiting
for graphify to finish. Only fires in projects that already have a graph
(never triggers a fresh full build).
"""
import json
import os
import subprocess
import sys


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return

    cwd = payload.get("cwd") or os.getcwd()
    graph_path = os.path.join(cwd, "graphify-out", "graph.json")
    if not os.path.isfile(graph_path):
        return

    try:
        creationflags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
        graphify_cmd = "graphify.exe" if os.name == "nt" else "graphify"
        subprocess.Popen(
            [graphify_cmd, "update", "."],
            cwd=cwd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL,
            shell=False,
            creationflags=creationflags,
            close_fds=True,
        )
    except Exception:
        pass


if __name__ == "__main__":
    main()
