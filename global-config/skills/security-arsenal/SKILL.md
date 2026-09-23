---
name: security-arsenal
description: Quick-lookup cheatsheet during an active bug bounty hunt — per-vuln-class "try first, in order" checklists (IDOR, XSS, SSRF, open redirect, SQLi, CSRF, OAuth, race conditions, file upload, subdomain takeover, MFA bypass), high-EV recon one-liners, and a curated list of external playbook/wordlist/tool repos to grep next when the in-tool methodology runs short. Use when actively probing a specific vuln class and want the fastest checks first, or when you need a pointer to a deeper external reference.
---

# Security Arsenal

Two files:

- `METHODOLOGY_CHEATSHEET.md` — per-vuln-class quick checks in priority order, high-EV recon one-liners, and an "always check even when target looks dead" list. Read this first during an active hunt.
- `REFERENCES.md` — curated external GitHub repos (methodology playbooks, payload/bypass lists, wordlists, subdomain-takeover fingerprints, API-key verification tools) to mirror or grep when the cheatsheet doesn't cover the case in front of you.

Extracted from the `security-arsenal` skill of [Awarexone/Agentic-Bug-Hunter](https://github.com/Awarexone/Agentic-Bug-Hunter) (MIT), which itself distills `KathanP19/HowToHunt`, `HolyBugx/HolyTips`, `daffainfo/AllAboutBugBounty`, and `KingOfBugbounty/KingOfBugBountyTips`. Companion skills from the same source: `bb-methodology` (workflow/mindset), `triage-validation` (7-Question Gate before reporting), `web2-vuln-classes` (deep per-class reference), `report-writing` (H1/Bugcrowd/Intigriti/Immunefi templates).
