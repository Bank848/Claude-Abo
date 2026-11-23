import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import browserSafe from '../src/checks/browser-safe.mjs';
import siteDom from '../src/checks/site-dom.mjs';

function fixture(files) {
  const d = mkdtempSync(path.join(tmpdir(), 'abo-'));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
    writeFileSync(path.join(d, rel), text);
  }
  return d;
}
const M = '// @browser-safe\n';

test('flags node: import in a file marked @browser-safe', async () => {
  const f = await browserSafe(fixture({ 'src/a.mjs': M + "import fs from 'node:fs';\n" }));
  assert.equal(f.length, 1);
  assert.equal(f[0].rule, 'browser-safe');
});
test("flags bare 'fs' import", async () => {
  assert.equal((await browserSafe(fixture({ 'a.mjs': M + "import { readFile } from 'fs';\n" }))).length, 1);
});
test('flags dynamic import(', async () => {
  assert.equal((await browserSafe(fixture({ 'a.mjs': M + "const m = await import('./x.mjs');\n" }))).length, 1);
});
test('flags fetch(', async () => {
  assert.equal((await browserSafe(fixture({ 'a.mjs': M + "await fetch('x');\n" }))).length, 1);
});
test('flags process.', async () => {
  assert.equal((await browserSafe(fixture({ 'a.mjs': M + 'const e = process.env;\n' }))).length, 1);
});
test('ignores unmarked Node files', async () => {
  assert.deepEqual(await browserSafe(fixture({ 'a.mjs': "import fs from 'node:fs';\nprocess.exit(0);\n" })), []);
});
test('passes clean marked file, ignoring comments', async () => {
  const text = M + "// uses process. only in a comment\n/* fetch( too */\nexport const x = 1;\n";
  assert.deepEqual(await browserSafe(fixture({ 'a.mjs': text })), []);
});

test('site-dom flags innerHTML, outerHTML, insertAdjacentHTML, document.write, eval under site/', async () => {
  const d = fixture({
    'site/a.mjs': 'el.innerHTML = x;\nel.outerHTML = x;\nel.insertAdjacentHTML("a", x);\ndocument.write(x);\neval("1");\n',
    'src/b.mjs': 'el.innerHTML = x;\n',
  });
  const f = await siteDom(d);
  assert.equal(f.length, 5);
  assert.ok(f.every((x) => x.file === 'site/a.mjs'));
});
test('site-dom passes textContent code', async () => {
  assert.deepEqual(await siteDom(fixture({ 'site/a.mjs': 'el.textContent = x;\n' })), []);
});
