import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { HASH_LINE, sourceHash } from '../readme-hash.mjs';

// Translations must carry the hash of the English top section; stale = warn, missing = error.
export default async function readmeDrift(root) {
  let english;
  try { english = await readFile(path.join(root, 'README.md'), 'utf8'); } catch { return []; }
  const current = sourceHash(english);
  const out = [];
  for (const f of (await readdir(root)).filter((n) => /^README\.[A-Za-z-]+\.md$/.test(n)).sort()) {
    const m = HASH_LINE.exec(await readFile(path.join(root, f), 'utf8'));
    if (!m) out.push({ file: f, line: 1, rule: 'readme-drift', severity: 'error', message: 'missing <!-- abo:source-hash:... --> line' });
    else if (m[1] !== current) out.push({ file: f, line: 1, rule: 'readme-drift', severity: 'warn', message: 'English README top section changed since this translation was reviewed; re-review, then run: claude-abo readme-hash --fix-hash' });
  }
  return out;
}
