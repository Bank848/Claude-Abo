import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { loadManifest, validateManifest } from '../manifest.mjs';

export default async function manifestCheck(root) {
  const file = path.join(root, 'catalog', 'skills.json');
  try {
    await stat(file);
  } catch {
    return [{ file: 'catalog/skills.json', line: 1, rule: 'manifest-missing', severity: 'warn', message: 'catalog/skills.json missing' }];
  }
  let m;
  try {
    m = await loadManifest(file);
  } catch (e) {
    return [{ file: 'catalog/skills.json', line: 1, rule: 'manifest-parse', severity: 'error', message: `cannot parse: ${e.message}` }];
  }
  const base = path.join(root, 'global-config', 'skills');
  let dirs = [];
  try {
    dirs = (await readdir(base, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => `global-config/skills/${d.name}`);
  } catch { /* no skills folder */ }
  return validateManifest(m, dirs);
}
