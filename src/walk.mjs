// Node-only helper: list files under a directory, skipping vendored/VCS folders.
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const SKIP = new Set(['.git', 'node_modules', '_site']);

export async function walk(root, rel = '') {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(path.join(root, rel), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walk(root, r)));
    else if (e.isFile()) out.push(r);
  }
  return out;
}
