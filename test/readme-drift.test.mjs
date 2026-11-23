import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readmeDrift from '../src/checks/readme-drift.mjs';
import readmeHash from '../src/commands/readme-hash.mjs';
import { hashLine, setHashLine, sourceHash } from '../src/readme-hash.mjs';

const EN = 'nav\n\ntop <!-- gen:skills-count:start -->61<!-- gen:skills-count:end -->\n\n<details>\nlong\n</details>\n';

test('hash ignores generated regions, CRLF and everything after <details>', () => {
  const h = sourceHash(EN);
  assert.equal(sourceHash(EN.replace('>61<', '>99<')), h);
  assert.equal(sourceHash(EN.replace(/\n/g, '\r\n')), h);
  assert.equal(sourceHash(EN.replace('long', 'other')), h);
  assert.notEqual(sourceHash(EN.replace('top', 'changed')), h);
  assert.match(h, /^[0-9a-f]{12}$/);
});
function repo(tr) {
  const r = mkdtempSync(path.join(os.tmpdir(), 'abo-drift-'));
  writeFileSync(path.join(r, 'README.md'), EN);
  writeFileSync(path.join(r, 'README.th.md'), tr);
  return r;
}
test('matching hash passes', async () => {
  assert.deepEqual(await readmeDrift(repo(`nav\n${hashLine(sourceHash(EN))}\nx\n`)), []);
});
test('stale hash warns and names the file', async () => {
  const f = await readmeDrift(repo(`nav\n${hashLine('0'.repeat(12))}\nx\n`));
  assert.deepEqual([f[0].file, f[0].severity], ['README.th.md', 'warn']);
});
test('missing hash line is an error', async () => {
  const f = await readmeDrift(repo('nav\nx\n'));
  assert.equal(f[0].severity, 'error');
});
test('fix-hash rewrites only the hash line', async () => {
  const r = repo(`nav\n${hashLine('0'.repeat(12))}\nprose stays\n`);
  const cwd = process.cwd();
  process.chdir(r);
  try { await readmeHash(['--fix-hash']); } finally { process.chdir(cwd); }
  assert.equal(readFileSync(path.join(r, 'README.th.md'), 'utf8'), `nav\n${hashLine(sourceHash(EN))}\nprose stays\n`);
});
test('setHashLine inserts under the nav line when absent and keeps CRLF', () => {
  assert.equal(setHashLine('nav\r\nbody\r\n', 'abcdefabcdef'), 'nav\r\n<!-- abo:source-hash:abcdefabcdef -->\r\nbody\r\n');
});
