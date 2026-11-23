import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../scripts/build-site.mjs';
import siteDom from '../src/checks/site-dom.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const out = mkdtempSync(path.join(os.tmpdir(), 'abo-site-'));
await buildSite({ root: ROOT, out });
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'catalog/skills.json'), 'utf8'));
const catalog = JSON.parse(readFileSync(path.join(out, 'data/catalog.json'), 'utf8'));

test('catalog.json has the manifest skill count and a descTokens value for bundled skills', () => {
  assert.equal(catalog.count, manifest.skills.length);
  assert.equal(catalog.skills.length, manifest.skills.length);
  const bundled = catalog.skills.filter((s) => s.path);
  assert.ok(bundled.length > 0 && bundled.every((s) => Number.isInteger(s.descTokens) && s.descTokens > 0));
  assert.ok(catalog.skills.filter((s) => !s.path).every((s) => s.descTokens === null));
});
test('build copies only browser-safe src files', () => {
  const copied = readdirSync(path.join(out, 'src'));
  assert.ok(copied.includes('tokens.mjs'));
  for (const f of copied) assert.equal(readFileSync(path.join(out, 'src', f), 'utf8').split(/\r?\n/, 1)[0].trim(), '// @browser-safe');
  assert.ok(!copied.includes('intake.mjs'));
});
test('index.html has the five slot ids', () => {
  const html = readFileSync(path.join(out, 'index.html'), 'utf8');
  for (const id of ['tour', 'catalog', 'audit', 'learn', 'about']) assert.match(html, new RegExp(`<section id="${id}"`));
});
test('CSP allows no external origin and no external URL is loaded by the site files', () => {
  const html = readFileSync(path.join(out, 'index.html'), 'utf8');
  const csp = /Content-Security-Policy" content="([^"]+)"/.exec(html)[1];
  assert.match(csp, /default-src 'self'/);
  assert.ok(!/https?:/.test(csp));
  for (const f of ['index.html', 'style.css', 'app.mjs']) {
    const t = readFileSync(path.join(out, f), 'utf8');
    assert.ok(!/(src|href)=["']https?:/.test(t.replace(/<a [^>]*href="https:\/\/github\.com[^"]*"[^>]*>/g, '')), f);
    assert.ok(!/@import|url\(\s*["']?https?:/.test(t), f);
  }
});
test('site-dom check passes on the real site folder', async () => {
  assert.deepEqual(await siteDom(ROOT), []);
});
test('lessons.json lists every lesson file in order', async () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'abo-lessons-'));
  for (const d of ['site', 'src', 'catalog', 'learn/lessons']) mkdirSync(path.join(root, d), { recursive: true });
  writeFileSync(path.join(root, 'site/index.html'), '<html></html>');
  writeFileSync(path.join(root, 'catalog/skills.json'), readFileSync(path.join(ROOT, 'catalog/skills.json')));
  writeFileSync(path.join(root, 'learn/lessons/02-b.md'), '# Second\n');
  writeFileSync(path.join(root, 'learn/lessons/01-a.md'), '# First\n');
  const o = mkdtempSync(path.join(os.tmpdir(), 'abo-site2-'));
  await buildSite({ root, out: o });
  const l = JSON.parse(readFileSync(path.join(o, 'data/lessons.json'), 'utf8'));
  assert.deepEqual(l.map((x) => [x.id, x.title, x.order]), [['01-a', 'First', 1], ['02-b', 'Second', 2]]);
});
