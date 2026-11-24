import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildSite } from '../scripts/build-site.mjs';

test('build inlines <!-- include:assets/... --> into index.html', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'abo-inc-'));
  await mkdir(path.join(root, 'site/assets'), { recursive: true });
  await mkdir(path.join(root, 'src'), { recursive: true });
  await mkdir(path.join(root, 'catalog'), { recursive: true });
  await cp(new URL('../catalog/skills.json', import.meta.url), path.join(root, 'catalog/skills.json'));
  await writeFile(path.join(root, 'site/assets/x.svg'), '<svg id="x"></svg>\n');
  await writeFile(path.join(root, 'site/index.html'), '<p><!-- include:assets/x.svg --></p><p><!-- include:../secret --></p>');
  const out = path.join(root, '_site');
  await buildSite({ root, out });
  assert.equal(await readFile(path.join(out, 'index.html'), 'utf8'), '<p><svg id="x"></svg></p><p></p>');
});
