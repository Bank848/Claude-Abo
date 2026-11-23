import { access } from 'node:fs/promises';
import path from 'node:path';
import { runGen } from '../gen/run.mjs';

// Generated files must match the manifest. Skipped until the manifest exists (the manifest check reports that).
export default async function genCheck(root) {
  try { await access(path.join(root, 'catalog/skills.json')); } catch { return []; }
  let changed = [];
  try {
    ({ changed } = await runGen({ root, check: true }));
  } catch (e) {
    return [{ file: 'catalog/skills.json', line: 1, rule: 'gen', severity: 'error', message: `generation failed: ${String(e.message).split('\n')[0]}` }];
  }
  return changed.map((f) => ({ file: f, line: 1, rule: 'gen', severity: 'error', message: 'generated region is out of date; run: npm run gen' }));
}
