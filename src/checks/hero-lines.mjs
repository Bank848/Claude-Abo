// The static hero lines in site/index.html copy skill summaries from the manifest.
// Fail when a listed skill is gone or its summary changed, so the page cannot go stale.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadManifest } from '../manifest.mjs';

const ITEM = /<li[^>]*><b>([^<]+)<\/b>\s*<span class="t">([^<]*)<\/span><\/li>/g;
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export default async function heroLines(root) {
  const file = 'site/index.html';
  let html;
  try { html = await readFile(path.join(root, file), 'utf8'); } catch { return []; }
  const start = html.indexOf('id="pick-list"');
  if (start < 0) return [];
  const end = html.indexOf('</ol>', start);
  const block = html.slice(start, end);
  const manifest = await loadManifest(path.join(root, 'catalog/skills.json'));
  const bySkill = new Map(manifest.skills.map((s) => [s.name, s]));
  const findings = [];
  const line = html.slice(0, start).split('\n').length;
  for (const m of block.matchAll(ITEM)) {
    const name = decode(m[1]);
    const text = decode(m[2]).trim();
    const skill = bySkill.get(name);
    if (!skill) findings.push({ file, line, rule: 'hero-lines', severity: 'error', message: `hero lists "${name}", which is not in the manifest` });
    else if ((skill.summary ?? '').trim() !== text) findings.push({ file, line, rule: 'hero-lines', severity: 'error', message: `hero line for "${name}" differs from its manifest summary` });
  }
  return findings;
}
