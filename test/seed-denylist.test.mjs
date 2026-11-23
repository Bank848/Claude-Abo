import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));

function setup() {
  const d = mkdtempSync(path.join(tmpdir(), 'abo-'));
  const gh = path.join(d, 'fakegh.mjs');
  writeFileSync(gh, `
const a = process.argv.slice(2).join(' ');
if (a.startsWith('repo list')) console.log(JSON.stringify([{ name: 'secret-proj-one' }]));
`);
  const ssh = path.join(d, 'ssh_config');
  writeFileSync(ssh, 'Host *\n  ForwardAgent no\nHost vps-main\n  HostName box.internal.test\n');
  const cfg = path.join(d, 'cfg');
  mkdirSync(path.join(cfg, 'projects', 'D--Secret-Client-Site'), { recursive: true });
  mkdirSync(path.join(cfg, 'projects', 'C--Downloads'), { recursive: true });
  const out = path.join(d, 'deny.txt');
  const repoDir = path.join(d, 'repo');
  mkdirSync(repoDir);
  const run = () => spawnSync(process.execPath, [bin, 'seed-denylist', '--out', out, '--gh-cmd', gh, '--ssh-config', ssh, '--config-dir', cfg], { cwd: repoDir, encoding: 'utf8' });
  return { out, run };
}

test('adds private repo names and ssh hosts, skips generic folder names', () => {
  const { out, run } = setup();
  run();
  const text = readFileSync(out, 'utf8');
  assert.match(text, /^repo:secret-proj-one$/m);
  assert.match(text, /^host:vps-main$/m);
  assert.match(text, /^host:box\.internal\.test$/m);
  assert.match(text, /^repo:Secret-Client-Site$/m);
  assert.doesNotMatch(text, /Downloads/);
  assert.doesNotMatch(text, /^host:\*/m);
});
test('never overwrites existing entries, second run adds nothing', () => {
  const { out, run } = setup();
  writeFileSync(out, 'person:Someone Real\nrepo:SECRET-PROJ-ONE\n');
  run();
  const text = readFileSync(out, 'utf8');
  assert.match(text, /^person:Someone Real$/m);
  assert.equal((text.match(/secret-proj-one/gi) ?? []).length, 1);
  const before = text;
  run();
  assert.equal(readFileSync(out, 'utf8'), before);
});
test('prints counts only, never a value', () => {
  const { run } = setup();
  const r = run();
  assert.match(r.stdout, /added .*repo=\d+/);
  for (const v of ['secret-proj-one', 'vps-main', 'Secret-Client-Site']) assert.ok(!r.stdout.includes(v));
});
test('refuses an --out path inside the repo other than the gitignored file', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'abo-'));
  const r = spawnSync(process.execPath, [bin, 'seed-denylist', '--out', path.join(d, 'tracked.txt')], { cwd: d, encoding: 'utf8' });
  assert.equal(r.status, 2);
});
