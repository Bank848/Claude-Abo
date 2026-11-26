# Contributing

Thanks for looking. This repo is one person's Claude Code setup turned into a catalog and an audit, so the rules below keep it small and safe to publish.

## Propose a skill

Open a **Skill request** issue with the upstream repo, the folder that holds the skill, and one line on why it is useful. Do not open a pull request that copies a skill in.

A maintainer runs the intake step on it: a shallow clone outside this repo, a licence check (the skill folder first, the repo root second) and a static security scan. The result is a short report. Then one of three things happens:

- the licence allows redistribution and the scan is clean, so the skill may be bundled after a manual read of every file;
- the licence is missing or forbids copying, so the catalog gets a link to the upstream folder and nothing is copied;
- the scan finds something that needs a human decision, and the issue says what.

Every entry in the catalog records where it came from, its licence, a test date (empty until it has been run) and known issues.

## Report a wrong audit result

Open an **Audit looks wrong** issue and attach the output of `npx github:Bank848/Claude-Abo audit --export audit.json`. That file holds counts and names of skills only. It is checked against the same leak rules as the repo before it is written. Never paste file paths, tokens or your `CLAUDE.md`.

## Change code or docs

- Node 22 or newer, no dependencies, no build step.
- `npm test` runs the tests. `npm run check` runs the repo checks, including the public-data scan. Run both before you push.
- Anything between `<!-- gen:... -->` markers is generated. Change `catalog/skills.json` and run `npm run gen`; do not edit generated regions by hand.
- Keep personal data out of every file, fixture and commit message: names, emails, hosts, private repo names, and paths from your own machine.
- Commit messages look like `feat: add x`, `fix: handle y`, `docs: explain z`.
- Open pull requests as drafts.

## Translated READMEs

`README.md` is the source. Each translated README stores a short hash of the English top section. When the English text changes, `npm run check` warns that translations have drifted. Re-read the translation, update it if the meaning changed, then run `node bin/claude-abo.mjs readme-hash --fix-hash` to record that you reviewed it. A native-speaker fix to a translation is welcome as a pull request.

## Security

Do not open a public issue for a leaked secret or a vulnerability. Use the repository's private security reporting if it is enabled, or contact the maintainer through the profile page.
