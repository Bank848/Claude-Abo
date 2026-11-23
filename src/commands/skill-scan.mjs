import { scanSkillDir } from '../skill-scan.mjs';

export default async function skillScan(argv) {
  const json = argv.includes('--json');
  const dirs = argv.filter((a) => !a.startsWith('--'));
  if (dirs.length === 0) {
    process.stderr.write('usage: claude-abo skill-scan <dir>... [--json]\n');
    return 2;
  }
  const all = {};
  let failed = false;
  for (const d of dirs) {
    const findings = await scanSkillDir(d);
    all[d] = findings;
    if (findings.some((f) => f.severity === 'error')) failed = true;
    if (!json) {
      for (const f of findings) process.stdout.write(`${f.severity} ${f.rule} ${d}/${f.file}:${f.line} ${f.message}\n`);
      process.stdout.write(`${d}: ${findings.length} finding(s)\n`);
    }
  }
  if (json) process.stdout.write(`${JSON.stringify(all, null, 2)}\n`);
  return failed ? 1 : 0;
}
