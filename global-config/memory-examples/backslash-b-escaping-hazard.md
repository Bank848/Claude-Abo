---
name: backslash-b-escaping-hazard
description: A vault-style path (e.g. <YOUR_VAULT_PATH>) gets corrupted by inline python -c / shell string literals that interpret \b as a backspace escape — use script files or the Edit tool instead
metadata:
  node_type: memory
  type: feedback
---

Never edit text containing a `\b`-adjacent path or string (e.g. `<YOUR_VAULT_PATH>` on a machine where that path happens to start with a letter following a backslash, or any similar path that reads as a recognized escape) using an inline `python -c "..."` snippet or shell string literal for the replacement text. `\b` gets silently interpreted as a backspace control byte (0x08/0x0B) instead of a literal backslash-b, corrupting the file in a way that's invisible in normal terminal display (reads as a truncated path with the first letter eaten) and only shows up under a hex dump or the Edit/Read tool's exact byte view.

**Why:** Reproduced live while handing this exact template off to another adopter — their session first introduced this corruption into their own `CLAUDE.md`'s vault-path section via shell quoting on a `python -c` fix, then had to catch it via direct file read (not trusting the "replaced N occurrences" success message) and redo the fix through a script file to sidestep the quoting layer entirely.

**How to apply:** on a machine where a vault-style path constantly appears in `CLAUDE.md`, memory files, and skill docs, any inline snippet (Bash `python -c`, PowerShell one-liners) that touches such text should be treated as suspect. Prefer the Edit/Write tools (which operate on exact string content, no shell/interpreter re-parsing) or a heredoc/script-file approach over inline `-c`/`-Command` snippets whenever the text contains `\b`, `\n`, `\t`, or other backslash-letter sequences that a language's string literal parser could misinterpret. After any such edit, verify via a direct Read of the file, not the tool's own success message.
