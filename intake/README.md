# Skill intake

How a community skill gets checked before it is considered for this repo. The pipeline never copies a skill
into `global-config/skills/`; it only produces a report. Copying is a separate, reviewed step.

## Add a candidate

Edit `candidates.json`, one object per skill:

```json
[{ "repo": "owner/name", "subpath": "skills/example", "why": "one line: why you want it" }]
```

`subpath` is the skill folder inside the repo (empty if the repo root is the skill). Then run:

```
node bin/claude-abo.mjs intake            # every candidate
node bin/claude-abo.mjs intake --only example
```

Each run does a shallow clone into a temporary folder outside this repo (git hooks off, no submodules), records
the commit, checks the licence, runs `skill-scan`, and writes `reports/<name>.md`.

## Licence verdicts

The licence is read from the skill folder first and the repo root second, because a monorepo can hold a
different licence per skill. The report says which level answered and links the file at the recorded commit.

| Verdict | Meaning | What happens next |
|---|---|---|
| `allowed` | MIT, Apache-2.0, BSD-2/3-Clause, ISC, 0BSD, Unlicense, CC0-1.0, CC-BY-4.0 | May be bundled; keep the upstream licence file and copyright line. |
| `review` | MPL-2.0, LGPL, GPL, AGPL, CC-BY-SA, or a licence the tool does not recognise | The owner decides. Copyleft must ship its licence and may not fit this repo's MIT claim. |
| `blocked` | No licence file, CC-BY-NC, "all rights reserved", or a licence that forbids redistribution | Do not copy. Use the pointer entry draft in the report, or get permission in writing (store the link as `license.evidence`, `redistribution: permission-granted`). |

The detector is a keyword match, not a lawyer. A `review` or surprising `allowed` verdict means: open the
licence file from the report link and read it.

## Manual review checklist

The scan is static and finds known patterns only. Before accepting any candidate:

1. Read the whole `SKILL.md` and every script in the folder.
2. Check that its triggers do not hijack common phrases (a skill that fires on "fix" or "write" will).
3. Check the description length; long descriptions cost tokens in every session.
4. Note any paid service, account or OS limit as a known issue.
5. Only then fill the `security` fields in `catalog/skills.json`, and test it in a throwaway config folder.
