// Builds _site/: static site files, the browser-safe src modules and data/catalog.json. No bundler.
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '../src/frontmatter.mjs';
import { loadManifest } from '../src/manifest.mjs';
import { estimateTokens } from '../src/tokens.mjs';

async function descTokens(root, skill) {
  if (!skill.path) return null;
  try {
    const { data } = parseFrontmatter(await readFile(path.join(root, skill.path, 'SKILL.md'), 'utf8'));
    return estimateTokens(`${data.description ?? ''} ${data.when_to_use ?? ''}`.trim());
  } catch { return null; }
}

export async function buildSite({ root, out }) {
  await mkdir(path.join(out, 'data'), { recursive: true });
  await cp(path.join(root, 'site'), out, { recursive: true });

  await mkdir(path.join(out, 'src'), { recursive: true });
  for (const f of (await readdir(path.join(root, 'src'))).filter((n) => n.endsWith('.mjs'))) {
    const text = await readFile(path.join(root, 'src', f), 'utf8');
    if (text.split(/\r?\n/, 1)[0].trim() === '// @browser-safe') await writeFile(path.join(out, 'src', f), text);
  }

  const manifest = await loadManifest(path.join(root, 'catalog/skills.json'));
  const skills = [];
  for (const s of manifest.skills) skills.push({ ...s, descTokens: await descTokens(root, s) });
  const tourClip = existsSync(path.join(root, 'site/media/tour.mp4'));
  await writeFile(path.join(out, 'data/catalog.json'), `${JSON.stringify({ skills, count: skills.length, tourClip })}\n`);

  // Lessons arrive with the /learn module; the file always exists so the page can fetch it.
  const lessons = [];
  try {
    const dir = path.join(root, 'learn/lessons');
    const names = (await readdir(dir)).filter((n) => n.endsWith('.md')).sort();
    await mkdir(path.join(out, 'learn'), { recursive: true });
    for (const [i, n] of names.entries()) {
      const text = await readFile(path.join(dir, n), 'utf8');
      await writeFile(path.join(out, 'learn', n), text);
      const { data } = parseFrontmatter(text.split(String.fromCharCode(13)).join(''));
      lessons.push({ id: n.replace(/\.md$/, ''), title: String(data.title ?? /^#\s+(.+)$/m.exec(text)?.[1] ?? n).trim(), order: Number.isFinite(Number(data.order)) && String(data.order ?? '').trim() !== '' ? Number(data.order) : i + 1, minutes: Number(data.minutes) || null });
    }
  } catch { /* no lessons yet */ }
  await writeFile(path.join(out, 'data/lessons.json'), `${JSON.stringify(lessons)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  await buildSite({ root, out: path.join(root, '_site') });
  process.stdout.write('site built in _site/\n');
}
