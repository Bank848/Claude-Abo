import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setHashLine, sourceHash } from '../readme-hash.mjs';

// Prints the hash; --fix-hash rewrites only the hash line of each translation (call it after reviewing them).
export default async function readmeHash(argv) {
  const root = process.cwd();
  const h = sourceHash(await readFile(path.join(root, 'README.md'), 'utf8'));
  if (!argv.includes('--fix-hash')) { process.stdout.write(`${h}\n`); return 0; }
  for (const f of (await readdir(root)).filter((n) => /^README\.[A-Za-z-]+\.md$/.test(n)).sort()) {
    const before = await readFile(path.join(root, f), 'utf8');
    const after = setHashLine(before, h);
    if (after !== before) { await writeFile(path.join(root, f), after); process.stdout.write(`hash line set: ${f}\n`); }
  }
  return 0;
}
