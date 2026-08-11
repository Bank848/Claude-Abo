# Attribution

Most of `global-config/skills/` in this repo is **adopted from other people's public work**, not written by the owner of this template. This file credits the upstream sources. Per-skill provenance (subpath, commit baseline) lives in `global-config/tools/skill-update-check/sources.json`.

Seven skills are self-authored: `poka-yoke`, `plan-pro`, and `shipping-a-branch` were written from scratch, and `graphify`, `dembrandt`, `markitdown`, and `mobbin-references` are self-written wrapper skills around third-party tools or services (the underlying tools are credited below and version-tracked in `global-config/tools/skill-update-check/sources.json`). One skill, `deslop-defaults`, is adapted — harvested from an upstream skill repo and rewritten. Everything else is adopted.

## Upstream repos the adopted skills came from

| Upstream repo | License (as adopted) | Skills taken |
|---|---|---|
| [`thananon/9arm-skills`](https://github.com/thananon/9arm-skills) | **no license file upstream** — all rights reserved by default; redistributed here on assumed permissive intent, contact upstream before reuse elsewhere | `debug-mantra`, `post-mortem`, `scrutinize`, `management-talk` |
| [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT (per upstream) | `ui-ux-pro-max`, `design`, `design-system`, `banner-design`, `brand`, `slides` |
| [`mrgoonie/claudekit-skills`](https://github.com/mrgoonie/claudekit-skills) | **no license file upstream** — all rights reserved by default; redistributed here on assumed permissive intent, contact upstream before reuse elsewhere | `ui-styling` |
| [`coreyhaines31/makerskills`](https://github.com/coreyhaines31/makerskills) | MIT | `second-brain`, `decide`, `unstuck`, `skillify`, `deep-research`, `watch-video` |
| [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) | MIT | `product-marketing`, `launch`, `copywriting`, `copy-editing`, `social`, `community-marketing`, `content-strategy`, `image`, `marketing-ideas`, `marketing-psychology`, `pricing`, `marketing-council` |
| [`mattpocock/skills`](https://github.com/mattpocock/skills) | MIT (per upstream) | `grilling`, `teach`, `wait-what`, `wizard` |
| [`briiirussell/cybersecurity-skills`](https://github.com/briiirussell/cybersecurity-skills) | MIT | `prompt-injection`, `secrets-audit`, `dependency-audit` |
| [`Nutlope/hallmark`](https://github.com/Nutlope/hallmark) | MIT (per upstream) | `hallmark` |

## Self-written wrappers around third-party tools

The SKILL.md prose for these is self-authored, but each one drives a third-party engine that deserves its own credit:

- `graphify` — wrapper around the `graphifyy` pip package ([safishamsi/graphify](https://github.com/safishamsi/graphify)).
- `markitdown` — wrapper around Microsoft's [MarkItDown](https://github.com/microsoft/markitdown) (pip dist `markitdown`).
- `dembrandt` — wrapper around the third-party [`dembrandt`](https://github.com/dembrandt/dembrandt) CLI (`npx dembrandt <url>`).
- `mobbin-references` — wrapper around the (paid, third-party) [Mobbin](https://mobbin.com) MCP server.

## Adapted, no single fixed upstream

- `deslop-defaults` — harvested from [`ibelick/ui-skills`](https://github.com/ibelick/ui-skills) (baseline-ui), rewritten stack-agnostic. Neither self-authored nor a verbatim adoption.

## A note on completeness

This list was compiled from `global-config/tools/skill-update-check/sources.json` plus a manual pass over the skills that weren't in that manifest. If you spot a missing or incorrect credit, please open an issue or PR — this repo wants to get attribution right, not just look like it does.

Each upstream repo retains its own license. Check the linked repo before redistributing its skill folder outside this template. The MIT license in this repo's `LICENSE` file covers this repo's own original content only (see the note at the bottom of that file).
