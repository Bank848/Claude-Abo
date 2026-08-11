---
name: ollama-digest-tool
description: "Callable PowerShell helper (.claude/tools/ollama-digest.ps1) for piping a file through local qwen2.5-coder-7b-instruct-q5 on demand — not a hook, invoked deliberately."
metadata: 
  node_type: memory
  type: reference
  originSessionId: ab22e91f-8570-49d2-b5fd-31ae3d61a0d6
  modified: 2026-08-10T02:41:43.987Z
---

`<YOUR_VAULT_PATH>\.claude\tools\ollama-digest.ps1` — formalizes the manual "pipe a
large low-stakes file through local Ollama before it eats paid-model tokens"
pattern into a reusable script Claude can invoke via Bash/PowerShell when it
judges a specific file worth it.

Usage: `powershell -NoProfile -ExecutionPolicy Bypass -File .claude\tools\ollama-digest.ps1 -Path <file> [-Instruction "..."] [-Model qwen2.5-coder-7b-instruct-q5:latest] [-TimeoutSec 30]`

Default model fixed 2026-08-10: was `qwen2.5:7b-instruct`, a tag that was
never actually pulled locally, so the script hard-failed on its own default.
Now defaults to `qwen2.5-coder-7b-instruct-q5:latest` — deliberately not
`qwen3-5-9b:latest` (the other reasonable candidate) because that model has
"thinking" capability and took 60s+ emitting chain-of-thought before
answering even a one-line test file, blowing past the 30s default timeout.
See [[local-ollama-models]] in the vault for full model inventory.

Rules for using it:
- Deliberate only — never wire this into a hook (SessionStart/PreToolUse/etc).
  An automated version was designed and explicitly rejected after adversarial
  review found: near-zero real workload in this vault, a block-reread loop
  bug, and — the decisive issue — unattended prompt-injection risk from
  auto-splicing untrusted (possibly web-scraped) content into context before
  a human looks at it. See `<YOUR_VAULT_PATH>\projects\ollama-hook-offload\spec.md`
  for the full rejected design and reasoning.
- Output is always prefixed `ADVISORY - lossy local-model output, not source
  of truth`. Never quote or act on specifics from it — re-read the original
  file for anything that matters.
- Script refuses to run if `ollama` isn't on PATH or the model isn't already
  pulled (no auto-pull, avoids hanging on a multi-GB download).
- Only reach for this on genuinely large (tens of KB+), low-stakes text
  (long logs, scratch dumps) — most files in this vault are small enough
  that reading them directly is cheaper and more reliable than this detour.
