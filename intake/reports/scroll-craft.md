# Intake report: scroll-craft

- Upstream: nateherkai/scroll-craft (plugins/nateherk-design/skills/scroll-craft)
- Commit: 75d81f74e83692add18cd7a8a8e078b8a887a579
- Why (owner): scroll-driven landing pages

## Licence

- Verdict: **allowed** (MIT)
- Answered at: repo (LICENSE)
- Evidence: https://github.com/nateherkai/scroll-craft/blob/75d81f74e83692add18cd7a8a8e078b8a887a579/LICENSE
- Read from the clone; `gh` was not needed.

## Security scan

- warn network engine/scrollcraft.css:383 other hosts: www.w3.org
- warn network references/template.html:22 other hosts: www.w3.org
- warn network scripts/kie.mjs:5 other hosts: api.kie.ai
- warn network scripts/kie.mjs:6 other hosts: api.kie.ai
- error cred-read scripts/kie.mjs:20 reads credentials in a file that also makes network calls
- warn network scripts/kie.mjs:26 other hosts: api.kie.ai
- warn network scripts/kie.mjs:27 other hosts: kieai.redpandaai.co

## Size

- SKILL.md description: about 215 tokens

## Manual review still required

Read the whole SKILL.md and every script before accepting (see intake/README.md).
