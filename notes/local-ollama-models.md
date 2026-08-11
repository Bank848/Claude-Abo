# Local Ollama models (D:\ollama)

Ollama server + model store live on the D: drive, not the default `%USERPROFILE%\.ollama`. Server is normally running as a background Windows process (`ollama app.exe` + `ollama.exe`).

- **Model store:** `D:\ollama\models\` (blobs + manifests) — 42 GB used as of 2026-08-10
- **Staging folder:** `D:\ollama\gguf-downloads\` — currently empty, presumably meant for manually-downloaded GGUF files before `ollama create`/import. Not wired to anything yet.
- **Logs:** `D:\ollama\pull.log`, `serve-out.log`, `serve-err.log`
- **Disk headroom:** D: drive at 89% full, 77 GB free (2026-08-10) — worth watching before pulling more multi-GB models.
- **Invoke:** `ollama run <name>` (interactive) or pipe stdin: `Get-Content <file> | ollama run <name> "<instruction>"`. No tool access, no repo context — text in, text out only.

## Installed models (`ollama list`, 2026-08-10)

| Name | Params | Quant | Context | Capabilities | What it's for |
|---|---|---|---|---|---|
| `huihui-qwen3-6-27b-abliterated:latest` | 27.3B | Q4_K_M | 262144 | tools, thinking, completion | Largest local model. Abliterated (safety-training removed) Qwen3.5. Best local reasoning/quality tradeoff on this machine; heaviest (16 GB), slowest. |
| `qwen3-5-9b-abliterated:latest` | 9.0B | Q4_K_M | 262144 | tools, thinking, completion | Abliterated mid-size Qwen3.5. Faster than the 27B, still has thinking/tool-call support. |
| `qwen3-5-9b:latest` | 9.2B | Q4_K_M | 262144 | tools, thinking, completion | Non-abliterated counterpart to the above — standard safety training intact. Default choice when abliteration isn't needed/wanted. Verified responsive. |
| `deepseek-r1-distill-qwen-7b-q5:latest` | 7.6B | Q5_K_M | 131072 | tools, thinking, completion | R1-distilled reasoning model on a Qwen2 base. Use for chain-of-thought-style tasks at smaller size than the Qwen3.5 line. |
| `qwen2.5-coder-7b-instruct-q5:latest` | 7.6B | Q5_K_M | 32768 | tools, completion (no "thinking") | Code-specialized instruct model. Best local pick for code-shaped digest/summarize tasks. Verified responsive. |
| `llava:7b` | 7B (+ 311M CLIP projector) | Q4_0 | 32768 | completion, **vision** | Only vision-capable local model — can take images as input. Llama-based, Apache-2.0. Uses `[INST]`/`[/INST]` stop tokens (Llama/Mistral-style prompt format, not ChatML). |

All six respond to a basic prompt — confirmed working, not just pulled-but-broken.

## Known gap: `ollama-digest.ps1` points at a model that isn't installed

[[ollama-digest-tool]] (`<YOUR_VAULT_PATH>\.claude\tools\ollama-digest.ps1`) defaults to `-Model qwen2.5:7b-instruct`. That exact tag is **not** in `ollama list` — the closest installed model is `qwen2.5-coder-7b-instruct-q5:latest` (different tag, coder-tuned, Q5 quant). The script has a guard that refuses to run instead of auto-pulling, so as of 2026-08-10 it will hard-fail (`Model 'qwen2.5:7b-instruct' is not pulled locally`) if invoked with its default. Fix by either:
- pulling `qwen2.5:7b-instruct` to match the script, or
- pointing the script's default (or the `-Model` arg at call time) at `qwen2.5-coder-7b-instruct-q5:latest` or `qwen3-5-9b:latest` instead.

Not fixed yet — flagging so it doesn't silently fail next time it's invoked.

## Picking a model

- General low-stakes text digest, non-code → `qwen3-5-9b:latest`
- Code-shaped text (logs with stack traces, diffs, source dumps) → `qwen2.5-coder-7b-instruct-q5:latest`
- Needs an image described/read → `llava:7b` (only vision option)
- Reasoning/chain-of-thought heavy, still cheap → `deepseek-r1-distill-qwen-7b-q5:latest`
- Want the best quality this machine can do locally, size/speed no object → `huihui-qwen3-6-27b-abliterated:latest`
- Abliterated variants (`*-abliterated`) have safety training stripped — use only where that's actually wanted (e.g. deliberately unfiltered creative/red-team text), not as a default.

All of these remain **advisory-only / lossy pre-compression** per [[ollama-digest-tool]]'s existing rule — never treat local-model output as source of truth; re-read the original file for anything that matters.
