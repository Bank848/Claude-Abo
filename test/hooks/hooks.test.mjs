import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const hook = (name) => path.join(ROOT, 'global-config/hooks', name);

// Find a Python 3 once; every test is skipped with a message when there is none.
const PY = [['py', ['-3']], ['python3', []], ['python', []]].find(([cmd, pre]) => {
  const r = spawnSync(cmd, [...pre, '-c', 'import sys; sys.exit(0 if sys.version_info[0] == 3 else 1)'], { encoding: 'utf8' });
  return r.status === 0;
});
const opts = PY ? {} : { skip: 'no Python 3 found (py, python3 or python); hook tests skipped' };

const tmpHome = () => mkdtempSync(path.join(os.tmpdir(), 'abo-hook-home-'));
function run(file, { input = '', args = [], home = tmpHome() } = {}) {
  const [cmd, pre] = PY;
  const env = { ...process.env, HOME: home, USERPROFILE: home };
  const r = spawnSync(cmd, [...pre, hook(file), ...args], { input, encoding: 'utf8', env });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}
const bash = (command, extra = {}) => JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command }, ...extra });
const decision = (r) => { try { return JSON.parse(r.stdout).hookSpecificOutput.permissionDecision; } catch { return null; } };

test('block-dangerous-git asks before a push and stays quiet for ls', opts, () => {
  assert.equal(decision(run('block-dangerous-git.py', { input: bash('git push origin main') })), 'ask');
  assert.equal(decision(run('block-dangerous-git.py', { input: bash('ls') })), null);
});

test('block-endless-stdin-build denies yes piped into a build tool', opts, () => {
  assert.equal(decision(run('block-endless-stdin-build.py', { input: bash('yes | ./gradlew assembleDebug') })), 'deny');
  assert.equal(decision(run('block-endless-stdin-build.py', { input: bash('yes | android_build --release') })), 'deny');
});
test('block-endless-stdin-build allows finite input and unrelated commands', opts, () => {
  for (const c of ['ls -la', 'yes | head -3', "printf 'y\\ny\\n' | ./gradlew build", 'git commit -m "yes | gradle build"']) {
    const r = run('block-endless-stdin-build.py', { input: bash(c) });
    assert.equal(r.status, 0, c);
    assert.equal(decision(r), null, c);
  }
});
test('block-endless-stdin-build follows a local script one level down', opts, () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'abo-hook-script-'));
  writeFileSync(path.join(dir, 'go.sh'), '#!/bin/sh\nyes | gradle build\n');
  assert.equal(decision(run('block-endless-stdin-build.py', { input: bash('bash go.sh', { cwd: dir }) })), 'deny');
});
test('block-endless-stdin-build lets a command through on garbage input', opts, () => {
  const r = run('block-endless-stdin-build.py', { input: 'not json' });
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), '');
});

test('freeze-guard does nothing while no freeze is active', opts, () => {
  const input = JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: path.join(os.tmpdir(), 'x.txt') } });
  assert.equal(run('freeze-guard.py', { input }).status, 0);
});
test('freeze-guard blocks edits outside the frozen directory and allows inside', opts, () => {
  const home = tmpHome();
  mkdirSync(path.join(home, '.claude'), { recursive: true });
  const frozen = mkdtempSync(path.join(os.tmpdir(), 'abo-frozen-'));
  assert.match(run('freeze-guard.py', { args: ['on', frozen], home }).stdout, /freeze ON/);
  const edit = (file) => JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: file } });
  const outside = run('freeze-guard.py', { input: edit(path.join(ROOT, 'other.txt')), home });
  assert.equal(outside.status, 2);
  assert.match(outside.stderr, /freeze active/);
  assert.equal(run('freeze-guard.py', { input: edit(path.join(frozen, 'a.txt')), home }).status, 0);
  assert.match(run('freeze-guard.py', { args: ['off'], home }).stdout, /freeze OFF/);
  assert.equal(run('freeze-guard.py', { input: edit(path.join(ROOT, 'other.txt')), home }).status, 0);
});
