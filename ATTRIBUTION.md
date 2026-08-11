# Attribution

Most of `global-config/skills/` in this repo is **adopted from other people's public work**, not written by the owner of this template. This file credits the upstream sources. Per-skill provenance (subpath, commit baseline) lives in `global-config/tools/sources.json`.

Only `poka-yoke` is self-authored. `graphify` is a self-written wrapper skill around the third-party `graphifyy` pip package (credited separately below).

## Upstream repos the adopted skills came from

| Upstream repo | License (as adopted) | Skills taken |
|---|---|---|
| [`thananon/9arm-skills`](https://github.com/thananon/9arm-skills) | see upstream repo | `debug-mantra`, `post-mortem`, `scrutinize`, `management-talk` |
| [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT (per upstream) | `ui-ux-pro-max`, `design`, `design-system`, `banner-design`, `brand`, `slides` |
| [`mrgoonie/claudekit-skills`](https://github.com/mrgoonie/claudekit-skills) | see upstream repo | `ui-styling` |
| [`coreyhaines31/makerskills`](https://github.com/coreyhaines31/makerskills) | MIT | `second-brain`, `decide`, `unstuck`, `skillify`, `deep-research`, `watch-video` |
| [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) | MIT | `product-marketing`, `launch`, `copywriting`, `copy-editing`, `social`, `community-marketing`, `content-strategy`, `image`, `marketing-ideas`, `marketing-psychology`, `pricing`, `marketing-council` |
| [`mattpocock/skills`](https://github.com/mattpocock/skills) | see upstream repo | `grilling`, `teach`, `wait-what`, `wizard` |
| [`briiirussell/cybersecurity-skills`](https://github.com/briiirussell/cybersecurity-skills) | MIT | `prompt-injection`, `secrets-audit`, `dependency-audit` |
| [`Nutlope/hallmark`](https://github.com/Nutlope/hallmark) | see upstream repo | `hallmark` |

## Adapted, no single fixed upstream

- `deslop-defaults` — harvested from `ibelick/ui-skills` (baseline-ui), rewritten stack-agnostic.
- `dembrandt` — a wrapper skill around the third-party `dembrandt` CLI (`npx dembrandt`); the wrapper itself has no separate upstream skill repo.
- `mobbin-references` — a wrapper skill around the (paid, third-party) Mobbin MCP server; no separate upstream skill repo.
- `graphify` — self-written wrapper; the underlying engine is the `graphifyy` pip package ([safishamsi/graphify](https://github.com/safishamsi/graphify)).

## A note on completeness

This list was compiled from `global-config/tools/sources.json` plus a manual pass over the skills that weren't in that manifest. If you spot a missing or incorrect credit, please open an issue or PR — this repo wants to get attribution right, not just look like it does.

Each upstream repo retains its own license. Check the linked repo before redistributing its skill folder outside this template. The MIT license in this repo's `LICENSE` file covers this repo's own original content only (see the note at the bottom of that file).
