import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import links from '../src/checks/links.mjs';

function repo(files) {
  const r = mkdtempSync(path.join(os.tmpdir(), 'abo-links-'));
  execFileSync('git', ['init', '-q'], { cwd: r });
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(r, rel)), { recursive: true });
    writeFileSync(path.join(r, rel), text);
  }
  return r;
}

test('a broken relative link is an error with file and line', async () => {
  const r = repo({ 'README.md': 'a\n[x](docs/missing.md)\n' });
  const f = await links(r);
  assert.equal(f.length, 1);
  assert.deepEqual([f[0].file, f[0].line, f[0].rule], ['README.md', 2, 'broken-link']);
});
test('existing targets, anchors, urls and fenced or inline code are fine', async () => {
  const r = repo({
    'README.md': '[a](docs/g.md#top) [b](#x) [c](https://example.com/z)\n`[d](nope.md)`\n```\n[e](nope.md)\n```\n',
    'docs/g.md': '[back](../README.md)\n',
  });
  assert.deepEqual(await links(r), []);
});
test('bundled skills are out of scope', async () => {
  const r = repo({ 'global-config/skills/a/SKILL.md': '[x](nope.md)\n' });
  assert.deepEqual(await links(r), []);
});
