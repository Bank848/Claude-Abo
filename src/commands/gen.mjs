import { runGen } from '../gen/run.mjs';

export default async function gen(argv) {
  const check = argv.includes('--check');
  const { changed } = await runGen({ root: process.cwd(), check });
  if (check) {
    for (const f of changed) process.stdout.write(`out of date: ${f}\n`);
    if (changed.length) process.stdout.write('run: npm run gen\n');
    return changed.length ? 1 : 0;
  }
  process.stdout.write(changed.length ? `gen: updated ${changed.join(', ')}\n` : 'gen: nothing to change\n');
  return 0;
}
