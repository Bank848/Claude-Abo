---
name: confirmed-commands-ask-not-deny
description: A safety hook should ask for risky commands the owner has approved, not hard-deny them
metadata:
  type: feedback
rewritten: true
---

Configure the git safety hook to return "ask" for destructive commands (force push, hard reset, branch delete), not "deny".

**Why:** In the acme-shop repo a hard deny blocked a force push the owner had just approved in chat, and the only way through was editing the hook, which defeats its purpose. An ask prompt keeps the stop and still lets a confirmed command run.

**How to apply:** Keep deny for commands that are never right (for example pushing to the default branch with `--force` without a lease). Use ask for everything the owner might legitimately want. Test the hook with a fake command and a harmless control command before trusting it; a hook that blocks everything is as broken as one that blocks nothing.
