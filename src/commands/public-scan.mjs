import path from 'node:path';
import publicScanCheck, { loadAllow } from '../checks/public-scan.mjs';
import { loadDenylist, scanHistory } from '../public-scan.mjs';

export default async function publicScan(argv) {
  const root = process.cwd();
  const history = argv.includes('--history');
  const opts = { local: argv.includes('--local') };
  const i = argv.indexOf('--local-denylist');
  if (i !== -1) opts.denylistFile = argv[i + 1];
  let findings;
  if (history) {
    let denylist = [];
    const file = opts.denylistFile ?? (opts.local ? path.join(root, '.public-denylist.txt') : null);
    if (file) denylist = await loadDenylist(file).catch(() => []);
    findings = scanHistory(root, { denylist, allow: await loadAllow(root) });
  } else {
    findings = await publicScanCheck(root, opts);
  }
  for (const f of findings) process.stdout.write(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}\n`);
  process.stdout.write(`${findings.length} finding(s)\n`);
  return findings.some((f) => f.severity === 'error') ? 1 : 0;
}
