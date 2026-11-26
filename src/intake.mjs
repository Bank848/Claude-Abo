// Intake of a community skill: shallow clone outside the repo, licence check (skill level first,
// repo level second), static security scan, report. Never copies anything into global-config/.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { scanSkillDir } from './skill-scan.mjs';
import { estimateTokens } from './tokens.mjs';

const ALLOWED = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', '0BSD', 'Unlicense', 'CC0-1.0', 'CC-BY-4.0']);
const REVIEW = /^(MPL-2\.0|LGPL|GPL|AGPL|CC-BY-SA|OTHER)/;

// Order matters: the first match wins.
const DETECT = [
  ['CC-BY-NC', /NonCommercial/i],
  ['CC-BY-SA', /ShareAlike/i],
  ['CC-BY-4.0', /Attribution 4\.0/i],
  ['CC0-1.0', /CC0 1\.0|Creative Commons Zero/i],
  ['LGPL', /GNU Lesser General Public License/i],
  ['AGPL-3.0', /GNU Affero General Public License/i],
  ['GPL', /GNU General Public License/i],
  ['MPL-2.0', /Mozilla Public License,? (?:Version |v\.? ?)2\.0/i],
  ['Apache-2.0', /Apache License[\s\S]{0,80}Version 2\.0/i],
  ['BSD-3-Clause', /Redistribution and use in source and binary forms[\s\S]*Neither the name/i],
  ['BSD-2-Clause', /Redistribution and use in source and binary forms/i],
  ['ISC', /Permission to use, copy, modify, and\/or distribute/i],
  ['0BSD', /Permission to use, copy, modify, and\/or distribute[\s\S]*without fee/i],
  ['Unlicense', /free and unencumbered software released into the public domain/i],
  ['MIT', /Permission is hereby granted, free of charge/i],
];

export function detectLicense(text) {
  for (const [id, re] of DETECT) if (re.test(text)) return id;
  if (/all rights reserved/i.test(text) || /may not (?:copy|redistribute|distribute)|no permission/i.test(text)) return 'ALL-RIGHTS-RESERVED';
  return 'OTHER';
}

export function verdictFor(spdx) {
  if (spdx === 'NONE' || spdx === 'ALL-RIGHTS-RESERVED' || spdx.startsWith('CC-BY-NC')) return 'blocked';
  if (ALLOWED.has(spdx)) return 'allowed';
  if (REVIEW.test(spdx)) return 'review';
  return 'review';
}

function findLicenseFile(dir) {
  let names = [];
  try { names = readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name); } catch { return null; }
  const hit = names.sort().find((n) => /^(LICENSE|LICENCE|COPYING)(\..+)?$/i.test(n));
  return hit ? { name: hit, text: readFileSync(path.join(dir, hit), 'utf8') } : null;
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function candidateName(c) {
  const base = path.posix.basename((c.subpath || c.repo).replace(/\/+$/, ''));
  return base || c.repo.replace(/\W+/g, '-');
}

export function formatReport(r) {
  const L = [];
  L.push(`# Intake report: ${r.name}`, '');
  L.push(`- Upstream: ${r.repo}${r.subpath ? ` (${r.subpath})` : ''}`);
  L.push(`- Commit: ${r.commit}`);
  if (r.why) L.push(`- Why (owner): ${r.why}`);
  L.push('', '## Licence', '');
  L.push(`- Verdict: **${r.license.verdict}** (${r.license.spdx})`);
  L.push(`- Answered at: ${r.license.level}${r.license.file ? ` (${r.license.file})` : ''}`);
  if (r.license.evidence) L.push(`- Evidence: ${r.license.evidence}`);
  if (r.license.note) L.push(`- Note: ${r.license.note}`);
  L.push('- Read from the clone; `gh` was not needed.');
  L.push('', '## Security scan', '');
  if (r.scan.length === 0) L.push('No findings.');
  for (const f of r.scan) L.push(`- ${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}`);
  L.push('', '## Size', '', `- SKILL.md description: about ${r.descTokens} tokens`);
  if (r.license.verdict === 'blocked') {
    L.push('', '## Pointer entry draft (do not copy the folder)', '', '```json', JSON.stringify(r.pointerDraft, null, 2), '```');
  }
  L.push('', '## Manual review still required', '', 'Read the whole SKILL.md and every script before accepting (see intake/README.md).', '');
  return L.join('\n');
}

// candidate = {repo, subpath?, why?, url?}; url overrides the clone source (tests, non-GitHub hosts).
export async function intakeCandidate(candidate, { root, outDir, keepClone = false } = {}) {
  const url = candidate.url ?? `https://github.com/${candidate.repo}.git`;
  const sub = (candidate.subpath ?? '').replace(/^\/+|\/+$/g, '');
  const work = mkdtempSync(path.join(os.tmpdir(), 'abo-intake-'));
  const rel = path.relative(path.resolve(root), work);
  if (!rel.startsWith('..') && !path.isAbsolute(rel)) throw new Error('clone dir must be outside the repo root');
  const emptyHooks = mkdtempSync(path.join(os.tmpdir(), 'abo-nohooks-'));
  const clone = path.join(work, 'clone');
  try {
    git(['-c', `core.hooksPath=${emptyHooks}`, 'clone', '--depth', '1', '--no-recurse-submodules', '--quiet', url, clone], work);
    const commit = git(['rev-parse', 'HEAD'], clone);
    const skillDir = sub ? path.join(clone, sub) : clone;
    if (!existsSync(skillDir)) throw new Error(`subpath not found in the clone: ${sub}`);

    const skillLic = sub ? findLicenseFile(skillDir) : null;
    const repoLic = findLicenseFile(clone);
    const skillSpdx = skillLic ? detectLicense(skillLic.text) : null;
    const repoSpdx = repoLic ? detectLicense(repoLic.text) : null;
    const web = (p) => `https://github.com/${candidate.repo}/blob/${commit}/${p}`;
    let license;
    if (skillLic) {
      license = {
        spdx: skillSpdx, level: 'skill', file: `${sub}/${skillLic.name}`, evidence: web(`${sub}/${skillLic.name}`),
        note: repoLic && repoSpdx !== skillSpdx ? `skill-level licence (${skillSpdx}) overrides the different repo-level licence (${repoSpdx})` : repoLic ? '' : 'the repo has no root licence file; the skill folder carries its own',
      };
    } else if (repoLic) {
      license = { spdx: repoSpdx, level: 'repo', file: repoLic.name, evidence: web(repoLic.name), note: '' };
    } else {
      license = { spdx: 'NONE', level: 'none', file: null, evidence: null, note: 'no licence file at skill or repo level' };
    }
    license.verdict = verdictFor(license.spdx);

    const scan = await scanSkillDir(skillDir);
    let descTokens = 0;
    try {
      const { data } = parseFrontmatter(readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8'));
      descTokens = estimateTokens(`${data.description ?? ''} ${data.when_to_use ?? ''}`);
    } catch { /* no SKILL.md: the scan reports it */ }

    const name = candidateName(candidate);
    const result = {
      name, repo: candidate.repo, subpath: sub, why: candidate.why ?? '', commit, license, scan, descTokens,
      cloneDir: clone,
      pointerDraft: {
        name, upstream: candidate.repo, path: null, status: 'pointer',
        pointer: { url: `https://github.com/${candidate.repo}/tree/${commit}${sub ? `/${sub}` : ''}`, install: 'TODO: copy the install line from the upstream README', note: 'Not bundled: no redistribution licence.' },
      },
    };
    mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${name}.md`);
    writeFileSync(file, formatReport(result));
    result.reportFile = file;
    return result;
  } finally {
    rmSync(emptyHooks, { recursive: true, force: true });
    if (!keepClone) rmSync(work, { recursive: true, force: true });
  }
}
