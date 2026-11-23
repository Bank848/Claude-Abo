# Attribution

Most of `global-config/skills/` in this repo is **adopted from other people's public work**, not written by the owner of this template. This file credits the upstream sources. Per-skill provenance (subpath, commit baseline) lives in `global-config/tools/skill-update-check/sources.json`.

Of the original 45, seven skills are self-authored: `poka-yoke`, `plan-pro`, and `shipping-a-branch` were written from scratch, and `graphify`, `dembrandt`, `markitdown`, and `mobbin-references` are self-written wrapper skills around third-party tools or services (the underlying tools are credited below and version-tracked in `global-config/tools/skill-update-check/sources.json`). One skill, `deslop-defaults`, is adapted — harvested from an upstream skill repo and rewritten. Everything else is adopted.

## Upstream repos the adopted skills came from

<!-- gen:upstreams-table:start -->
| Upstream repo | License (as adopted) | Skills taken |
|---|---|---|
| [`ayghri/i-have-adhd`](https://github.com/ayghri/i-have-adhd) | MIT | `i-have-adhd` |
| [`briiirussell/cybersecurity-skills`](https://github.com/briiirussell/cybersecurity-skills) | MIT | `dependency-audit`, `prompt-injection`, `secrets-audit` |
| [`coreyhaines31/makerskills`](https://github.com/coreyhaines31/makerskills) | MIT | `decide`, `deep-research`, `second-brain`, `skillify`, `unstuck`, `watch-video` |
| [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) | MIT | `community-marketing`, `content-strategy`, `copy-editing`, `copywriting`, `image`, `launch`, `marketing-council`, `marketing-ideas`, `marketing-psychology`, `pricing`, `product-marketing`, `social` |
| [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) | MIT | `ponytail` (adapted) |
| [`ibelick/ui-skills`](https://github.com/ibelick/ui-skills) | MIT | `deslop-defaults` (adapted) |
| [`idan-rubin/browserclaw`](https://github.com/idan-rubin/browserclaw) | MIT | `browserclaw` |
| [`mattpocock/skills`](https://github.com/mattpocock/skills) | MIT | `domain-modeling`, `grilling`, `grill-with-docs`, `teach`, `wait-what`, `wizard` |
| [`mrgoonie/claudekit-skills`](https://github.com/mrgoonie/claudekit-skills) | no licence at repo level; **not bundled**: listed as a pointer, install from the upstream repo | `ui-styling` |
| [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-ux-pro-max` |
| [`nidhinjs/prompt-master`](https://github.com/nidhinjs/prompt-master) | MIT | `prompt-master` |
| [`Nutlope/hallmark`](https://github.com/Nutlope/hallmark) | MIT | `hallmark` |
| [`Panniantong/Agent-Reach`](https://github.com/Panniantong/Agent-Reach) | MIT | `agent-reach` |
| [`thananon/9arm-skills`](https://github.com/thananon/9arm-skills) | no licence at repo level; **not bundled**: listed as a pointer, install from the upstream repo | `debug-mantra`, `management-talk`, `post-mortem`, `scrutinize` |
| [`utarn/engineer-skills`](https://github.com/utarn/engineer-skills) | MIT | `git-guardrails-claude-code` |
<!-- gen:upstreams-table:end -->

## Self-written wrappers around third-party tools

The SKILL.md prose for these is self-authored, but each one drives a third-party engine that deserves its own credit:

- `graphify` — wrapper around the `graphifyy` pip package ([safishamsi/graphify](https://github.com/safishamsi/graphify)).
- `markitdown` — wrapper around Microsoft's [MarkItDown](https://github.com/microsoft/markitdown) (pip dist `markitdown`).
- `dembrandt` — wrapper around the third-party [`dembrandt`](https://github.com/dembrandt/dembrandt) CLI (`npx dembrandt <url>`).
- `mobbin-references` — wrapper around the (paid, third-party) [Mobbin](https://mobbin.com) MCP server.

## Adapted

- `ponytail` — adapted from the idea and workflow in [`DietrichGebert/ponytail`](https://github.com/DietrichGebert/ponytail) (MIT), rewritten without the permanent persona.
- `deslop-defaults` — harvested from [`ibelick/ui-skills`](https://github.com/ibelick/ui-skills) (baseline-ui), rewritten stack-agnostic. Neither self-authored nor a verbatim adoption.

## Self-authored bonus skills

Of the 21 skills in the October 2026 patch, 13 are self-authored (12 written from scratch, plus the `codeburn-cost-check` wrapper): `close-out-log`, `codeburn-cost-check`, `docx-human-sounding-report`, `docx-python-docx-justify`, `docx-th-sarabun-sizing`, `english-writing-anti-ai-tell`, `github-pr-review-draft`, `memory-lint`, `project-bootstrap`, `pruning-branches`, `supabase-rls-safety-check`, `thai-no-quote-emphasis`, `thai-writing-anti-ai-tell`. `codeburn-cost-check` wraps the third-party `codeburn` CLI. `domain-modeling` and `grill-with-docs` come from `mattpocock/skills` and `ponytail` is adapted from `DietrichGebert/ponytail` (see the tables above); `agent-reach`, `git-guardrails-claude-code`, and `prompt-master` come from the upstream repos listed above. `browserclaw` (from `idan-rubin/browserclaw`) and `i-have-adhd` (from `ayghri/i-have-adhd`) come from upstream repos under MIT. Five skills (`debug-mantra`, `post-mortem`, `scrutinize`, `management-talk`, `ui-styling`) are not bundled because their upstream has no usable licence or by owner choice: the manifest lists them as pointers to the author. In total, 20 of the 66 skills are self-authored (7 of the original 45 plus these 13): 15 written from scratch and 5 self-written wrappers. Two more, `deslop-defaults` and `ponytail`, are adapted.

## A note on completeness

This list was compiled from `global-config/tools/skill-update-check/sources.json` plus a manual pass over the skills that weren't in that manifest. If you spot a missing or incorrect credit, please open an issue or PR — this repo wants to get attribution right, not just look like it does.

Each upstream repo retains its own license. Check the linked repo before redistributing its skill folder outside this template. The MIT license in this repo's `LICENSE` file covers this repo's own original content only (see the note at the bottom of that file).

Full upstream license texts and copyright lines are collected in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
