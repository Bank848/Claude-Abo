import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { diffSetup, formatReport, formatSummary } from '../setup-diff.mjs';

function flag(argv, name) {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
}

export default async function diffSetupCmd(argv) {
  const root = process.cwd();
  const out = flag(argv, '--out');
  if (!out) {
    process.stderr.write('usage: claude-abo diff-setup --out <file outside the repo> [--home <dir>] [--summary]\n');
    return 2;
  }
  const rel = path.relative(root, path.resolve(out));
  if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
    process.stderr.write('--out must resolve outside the repo root: the report lists private skill and hook names\n');
    return 2;
  }
  let home = flag(argv, '--home') ?? os.homedir();
  if (home === '~' || home.startsWith('~/') || home.startsWith('~\\')) home = path.join(os.homedir(), home.slice(1));
  const d = await diffSetup({ repoRoot: root, home });
  await mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await writeFile(out, formatReport(d));
  process.stdout.write(formatSummary(d));
  if (!argv.includes('--summary')) process.stdout.write('full report written to --out (names are in it)\n');
  return 0;
}
