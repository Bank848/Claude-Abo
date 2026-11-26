# security-hooks

Three open-source projects the setup uses as extra safety nets for Claude Code. **None of their code is copied here.** Install each from its own repo and read its README and licence first.

| Project | What it does | Licence | Upstream |
|---|---|---|---|
| `agent-guard` | Local, no-telemetry hooks that block or mask secret leaks in prompts, tool inputs and outputs, and scan changed files. | MIT | https://github.com/JeongJaeSoon/agent-guard |
| `agentguard` | A guard plugin that blocks dangerous commands and protects secrets, with a trust registry. | MIT | https://github.com/GoPlusSecurity/agentguard |
| `cc-safety-net` | A hook that blocks destructive commands and secret-file access. | MIT | https://github.com/kenryu42/cc-safety-net |

Licences were read from each project's `LICENSE` file when this note was written. Check them again before you depend on them.

These tools overlap with `global-config/hooks/block-dangerous-git.py` and with each other. Pick one or two, not all three. After you wire a hook, run `npx github:Bank848/Claude-Abo audit --probe-hooks` to see whether it really blocks a force push. No tool here replaces secret scanning on your remote or a review of what a hook is allowed to do.
