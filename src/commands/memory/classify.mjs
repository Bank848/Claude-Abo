import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { classify, formatClassification } from '../../memory/classify.mjs';
import { flagValues, loadPrivateList, positional, requireOutside } from '../../memory/cli-util.mjs';
import { readMemoryDir } from '../../memory/read.mjs';

export default async function memoryClassify(argv) {
  const root = process.cwd();
  const [dir] = positional(argv, ['--out', '--denylist']);
  const out = flagValues(argv, '--out')[0];
  if (!dir || !out) {
    process.stderr.write('usage: claude-abo memory classify <dir> --out <file>\n');
    return 2;
  }
  if (!requireOutside(root, out, '--out')) return 2;
  const notes = await readMemoryDir(dir);
  const result = classify(notes, { privateList: await loadPrivateList(root, argv) });
  await mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await writeFile(out, formatClassification(result));
  const counts = {};
  for (const c of result) counts[c.verdict] = (counts[c.verdict] ?? 0) + 1;
  process.stdout.write(`memory classify: ${notes.length} notes, ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(' ') || 'none'}\n`);
  return 0;
}
