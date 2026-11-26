import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { flagValues, isInside, loadPrivateList, positional, requireOutside } from '../../memory/cli-util.mjs';
import { generalize } from '../../memory/generalize.mjs';
import { readMemoryDir } from '../../memory/read.mjs';

// Writes generalized COPIES to a stage dir for the owner to read. A staged copy is a reading aid,
// never a base for a public example (see docs/memory-sanitize.md).
export default async function memorySanitize(argv) {
  const root = process.cwd();
  const [dir] = positional(argv, ['--stage', '--denylist']);
  const stage = flagValues(argv, '--stage')[0];
  if (!dir || !stage) {
    process.stderr.write('usage: claude-abo memory sanitize <dir> --stage <dir>\n');
    return 2;
  }
  if (!requireOutside(root, stage, '--stage')) return 2;
  if (isInside(dir, stage)) {
    process.stderr.write('--stage must not be inside the source folder\n');
    return 2;
  }
  const privateList = await loadPrivateList(root, argv);
  const notes = await readMemoryDir(dir);
  await mkdir(stage, { recursive: true });
  let replaced = 0;
  for (const n of notes) {
    const g = generalize(n.raw, { privateList });
    replaced += g.replacements.reduce((a, r) => a + r.count, 0);
    await writeFile(path.join(stage, n.file), g.text);
  }
  process.stdout.write(`memory sanitize: ${notes.length} notes staged, ${replaced} replacements\n`);
  return 0;
}
