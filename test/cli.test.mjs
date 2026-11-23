import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import noPrivateFiles from '../src/checks/no-private-files.mjs';

const bin = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));
const run = (args, opts = {}) => spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8', ...opts });
const tmp = () => mkdtempSync(path.join(tmpdir(), 'abo-'));

test('unknown command exits 2 and lists commands', () => {
  const r = run(['nope']);
  assert.equal(r.status, 2);
  assert.match(r.stdout, /Commands:/);
});

test('check with no checks exits 0', () => {
  const r = run(['check'], { cwd: tmp() });
  assert.equal(r.status, 0);
});

test('nested command dir dispatches to <cmd>/<sub>.mjs', () => {
  const dir = tmp();
  mkdirSync(path.join(dir, 'grp'));
  writeFileSync(path.join(dir, 'grp', 'hi.mjs'), 'export default async (argv) => (console.log("got " + argv.join(",")), 7);');
  const r = run(['grp', 'hi', 'a', 'b'], { env: { ...process.env, ABO_COMMANDS_DIR: dir } });
  assert.equal(r.status, 7);
  assert.match(r.stdout, /got a,b/);
});

test('no-private-files flags a tracked .public-denylist.txt', async () => {
  const dir = tmp();
  execFileSync('git', ['init', '-q'], { cwd: dir });
  writeFileSync(path.join(dir, '.public-denylist.txt'), 'x');
  writeFileSync(path.join(dir, 'ok.txt'), 'x');
  execFileSync('git', ['add', '.'], { cwd: dir });
  const f = await noPrivateFiles(dir);
  assert.equal(f.length, 1);
  assert.equal(f[0].file, '.public-denylist.txt');
});
