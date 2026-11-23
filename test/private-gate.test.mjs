import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkHooksPath } from '../src/private-gate.mjs';

const repo = () => {
  const d = mkdtempSync(path.join(tmpdir(), 'abo-'));
  execFileSync('git', ['init', '-q'], { cwd: d });
  return d;
};

test('fails when core.hooksPath is unset and CI is not set', () => {
  const f = checkHooksPath({ root: repo(), env: {} });
  assert.equal(f.length, 1);
  assert.equal(f[0].rule, 'private-gate');
});

test('passes when core.hooksPath is .githooks', () => {
  const d = repo();
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: d });
  assert.deepEqual(checkHooksPath({ root: d, env: {} }), []);
});

test('is skipped when CI is set', () => {
  assert.deepEqual(checkHooksPath({ root: repo(), env: { CI: 'true' } }), []);
});

test('this clone has the pre-push hook enabled (run: git config core.hooksPath .githooks)', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  assert.deepEqual(checkHooksPath({ root }), []);
});
