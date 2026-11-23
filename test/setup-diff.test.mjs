import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { diffSetup } from '../src/setup-diff.mjs';

const BIN = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));
const tmp = () => mkdtempSync(path.join(os.tmpdir(), 'abo-diff-'));
function put(base, files) {
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(base, rel)), { recursive: true });
    writeFileSync(path.join(base, rel), text);
  }
}
function fixture() {
  const repoRoot = tmp();
  const home = tmp();
  put(path.join(repoRoot, 'global-config'), {
    'skills/same/SKILL.md': 'one\n', 'skills/changed/SKILL.md': 'old\n', 'skills/repo-only-skill/SKILL.md': 'r\n',
    'hooks/guard.py': 'print(1)\n', 'agents/a.md': 'agent\n', 'tools/t/run.sh': 'echo\n', 'CLAUDE.md': '12345',
  });
  put(path.join(home, '.claude'), {
    'skills/same/SKILL.md': 'one\n', 'skills/changed/SKILL.md': 'new\n', 'skills/zz-local-secret-name/SKILL.md': 'l\n',
    'hooks/guard.py': 'print(2)\n', 'hooks/extra.py': 'x\n', 'agents/a.md': 'agent\n', 'tools/t/run.sh': 'echo\n',
    'CLAUDE.md': '1234567890', 'CLAUDE-detail.md': 'd',
  });
  return { repoRoot, home };
}

test('reports local-only, repo-only, changed and same skills', async () => {
  const d = await diffSetup(fixture());
  assert.deepEqual(d.skills.localOnly, ['zz-local-secret-name']);
  assert.deepEqual(d.skills.repoOnly, ['repo-only-skill']);
  assert.deepEqual(d.skills.changed, ['changed']);
  assert.equal(d.skills.same, 1);
});
test('hooks, agents and tools are compared too', async () => {
  const d = await diffSetup(fixture());
  assert.deepEqual(d.hooks.changed, ['guard.py']);
  assert.deepEqual(d.hooks.localOnly, ['extra.py']);
  assert.equal(d.agents.same, 1);
  assert.equal(d.tools.same, 1);
});
test('CLAUDE.md sizes and sibling files', async () => {
  const d = await diffSetup(fixture());
  assert.equal(d.claudeMd.repoBytes, 5);
  assert.equal(d.claudeMd.localBytes, 10);
  assert.deepEqual(d.claudeMd.localExtraFiles, ['CLAUDE-detail.md']);
});
test('CRLF-only difference counts as same', async () => {
  const f = fixture();
  put(path.join(f.home, '.claude'), { 'skills/same/SKILL.md': 'one\r\n' });
  assert.equal((await diffSetup(f)).skills.same, 1);
});
test('__pycache__ and .pyc are ignored', async () => {
  const f = fixture();
  put(path.join(f.home, '.claude'), { 'skills/same/__pycache__/x.pyc': 'junk', 'skills/same/a.pyc': 'junk' });
  const d = await diffSetup(f);
  assert.deepEqual(d.skills.changed, ['changed']);
  assert.equal(d.skills.same, 1);
});
test('a missing home yields empty local sides', async () => {
  const d = await diffSetup({ repoRoot: fixture().repoRoot, home: tmp() });
  assert.equal(d.skills.localOnly.length, 0);
  assert.equal(d.skills.repoOnly.length, 3);
});

const run = (cwd, ...args) => spawnSync(process.execPath, [BIN, 'diff-setup', ...args], { cwd, encoding: 'utf8' });
test('--out inside the repo root exits 2', () => {
  const f = fixture();
  assert.equal(run(f.repoRoot, '--home', f.home, '--out', path.join(f.repoRoot, 'r.md')).status, 2);
});
test('--out is required', () => {
  const f = fixture();
  assert.equal(run(f.repoRoot, '--home', f.home).status, 2);
});
test('--summary output contains no names, the report file does', () => {
  const f = fixture();
  const out = path.join(tmp(), 'diff.md');
  const r = run(f.repoRoot, '--home', f.home, '--out', out, '--summary');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.stdout.includes('zz-local-secret-name') && !r.stdout.includes('CLAUDE-detail'));
  assert.match(r.stdout, /skills: 1 local-only, 1 repo-only, 1 changed, 1 same/);
  assert.ok(readFileSync(out, 'utf8').includes('zz-local-secret-name'));
});
test('default output does not print names either', () => {
  const f = fixture();
  const r = run(f.repoRoot, '--home', f.home, '--out', path.join(tmp(), 'd.md'));
  assert.ok(!r.stdout.includes('zz-local-secret-name'));
});
