import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { candidateName, intakeCandidate } from '../intake.mjs';

export default async function intake(argv) {
  const root = process.cwd();
  const i = argv.indexOf('--only');
  const only = i === -1 ? null : argv[i + 1];
  let list = [];
  try {
    const raw = JSON.parse((await readFile(path.join(root, 'intake', 'candidates.json'), 'utf8')).replace(/^﻿/, ''));
    list = Array.isArray(raw) ? raw : raw.candidates ?? [];
  } catch {
    process.stderr.write('intake/candidates.json is missing or not valid JSON\n');
    return 2;
  }
  if (only) list = list.filter((c) => candidateName(c) === only);
  if (list.length === 0) {
    process.stdout.write('intake: no candidates (the owner fills intake/candidates.json)\n');
    return 0;
  }
  let failed = 0;
  for (const c of list) {
    try {
      const r = await intakeCandidate(c, { root, outDir: path.join(root, 'intake', 'reports') });
      process.stdout.write(`intake: ${r.name} licence=${r.license.verdict} (${r.license.spdx}) scan=${r.scan.length} finding(s) -> intake/reports/${r.name}.md\n`);
    } catch (e) {
      failed++;
      process.stderr.write(`intake: ${c.repo} failed: ${String(e.message).split('\n')[0]}\n`);
    }
  }
  return failed ? 1 : 0;
}
