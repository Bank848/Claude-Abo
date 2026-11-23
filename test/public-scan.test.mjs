import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { scanText, scanHistory } from '../src/public-scan.mjs';
import { parseDenylist } from '../src/private-patterns.mjs';
import publicScanCheck from '../src/checks/public-scan.mjs';

// Every positive sample is assembled at runtime so this file never trips the scan itself.
const BS = '\\';
const drive = (rest) => ['C', ':', BS, rest].join('');
const rules = (text, opts = {}) => scanText('x.md', text, opts).map((f) => f.rule);
const tmp = () => mkdtempSync(path.join(tmpdir(), 'abo-'));

test('win-path flags a drive path', () => assert.deepEqual(rules(`see ${drive('work')}${BS}notes`), ['win-path']));
test('win-path ignores the <YOUR_USERNAME> placeholder path', () =>
  assert.deepEqual(rules(['C', ':', BS, 'Users', BS, '<YOUR_USERNAME>', BS, 'Downloads'].join('')), []));
test('posix-home flags a home path and ignores the placeholder', () => {
  assert.deepEqual(rules('/Users/' + 'jdoe' + '/x'), ['posix-home']);
  assert.deepEqual(rules('/Users/<name>/x'), []);
  assert.deepEqual(rules('/home/' + 'jdoe'), ['posix-home']);
});
test('email flags a sample address, ignores noreply@ and example.com', () => {
  assert.deepEqual(rules(['jdoe', 'corp.test'].join('@')), ['email']);
  assert.deepEqual(rules(['noreply', 'github.com'].join('@')), []);
  assert.deepEqual(rules(['jdoe', 'example.com'].join('@')), []);
});
test('messages never contain the matched text', () => {
  const secret = ['jdoe', 'corp.test'].join('@');
  const [f] = scanText('x.md', `mail ${secret}`);
  assert.ok(!f.message.includes(secret));
  assert.match(f.message, /^email: jd… \(\d+ chars\)$/);
});
test('each token rule flags its sample', () => {
  const samples = {
    'gh-token': 'ghp_' + 'a'.repeat(36),
    'anthropic-key': 'sk-ant-' + 'a'.repeat(24),
    'openai-key': 'sk-' + 'a'.repeat(24),
    'aws-key': 'AKIA' + 'A'.repeat(16),
    'slack-token': 'xoxb-' + '1234567890',
    'private-key': '-----BEGIN ' + 'RSA PRIVATE KEY-----',
  };
  for (const [rule, s] of Object.entries(samples)) assert.ok(rules(`k ${s}`).includes(rule), rule);
});
test('allow entry suppresses exactly one file+rule+match', () => {
  const text = drive('work');
  const allow = [{ file: 'x.md', rule: 'win-path', match: text, reason: 'test' }];
  assert.deepEqual(rules(text, { allow }), []);
  assert.deepEqual(rules(drive('other'), { allow }), ['win-path']);
});
test('allow entry for another file does not suppress', () => {
  const text = drive('work');
  const allow = [{ file: 'y.md', rule: 'win-path', match: text, reason: 'test' }];
  assert.deepEqual(rules(text, { allow }), ['win-path']);
});
test('denylist literal is case-insensitive and category prefix is stripped', () => {
  const denylist = parseDenylist('# c\n\nrepo:ZzPrivateThing\nplainword\n');
  assert.deepEqual(denylist.map((d) => d.category), ['repo', 'other']);
  assert.deepEqual(rules('about zzprivatething here', { denylist }), ['denylist']);
  assert.deepEqual(rules('about PLAINWORD', { denylist }), ['denylist']);
  assert.deepEqual(rules('repo: not matched', { denylist }), []);
});
test('line numbers are 1-based', () => {
  const f = scanText('x.md', `ok\nok\n${drive('w')}`);
  assert.equal(f[0].line, 3);
});
test('ipv4 flags a private-range address and ignores loopback and the documentation range', () => {
  assert.deepEqual(rules('host ' + [10, 20, 30, 40].join('.')), ['ipv4']);
  assert.deepEqual(rules('127.0.0.1 and 203.0.113.5'), []);
});
test('ssh-target flags an ssh command with a real-looking user@host and ignores placeholders', () => {
  assert.ok(rules('ssh ' + ['jdoe', 'box.test'].join('@')).includes('ssh-target'));
  assert.deepEqual(rules('ssh <USER>@<HOST>'), []);
});
test('ssh-key-path flags a key path under .ssh', () => assert.deepEqual(rules('key ~/.ssh/' + 'id_ed25519'), ['ssh-key-path']));
test('uuid flags an originSessionId-style value and ignores the documentation form', () => {
  assert.deepEqual(rules(['12345678', '1234', '1234', '1234', '123456789abc'].join('-')), ['uuid']);
  assert.deepEqual(rules('00000000-0000-4000-8000-000000000001'), []);
});

function repo() {
  const d = tmp();
  const run = (args, env = {}) => execFileSync('git', args, { cwd: d, env: { ...process.env, ...env }, stdio: 'pipe' });
  run(['init', '-q']);
  return { d, run };
}
const author = { GIT_AUTHOR_NAME: 'T', GIT_AUTHOR_EMAIL: 'noreply@example.com', GIT_COMMITTER_NAME: 'T', GIT_COMMITTER_EMAIL: 'noreply@example.com' };

test('untracked new file is scanned', async () => {
  const { d } = repo();
  writeFileSync(path.join(d, 'new.md'), drive('work'));
  const f = await publicScanCheck(d);
  assert.deepEqual(f.map((x) => x.rule), ['win-path']);
});
test('history scan flags a leak that exists only in an old commit', () => {
  const { d, run } = repo();
  writeFileSync(path.join(d, 'a.md'), `x ${drive('work')}\n`);
  run(['add', '.']); run(['commit', '-q', '-m', 'one'], author);
  writeFileSync(path.join(d, 'a.md'), 'clean\n');
  run(['commit', '-qam', 'two'], author);
  const f = scanHistory(d);
  assert.equal(f.length, 1);
  assert.equal(f[0].rule, 'win-path');
  assert.match(f[0].file, /:a\.md$/);
  assert.equal(f[0].line, 1);
});
test('history scan covers commit messages and author emails', () => {
  const { d, run } = repo();
  writeFileSync(path.join(d, 'a.md'), 'clean\n');
  run(['add', '.']);
  run(['commit', '-q', '-m', 'see ' + ['jdoe', 'corp.test'].join('@')], { ...author, GIT_AUTHOR_EMAIL: ['jdoe', 'corp.test'].join('@') });
  const f = scanHistory(d);
  assert.deepEqual(f.map((x) => x.rule), ['email', 'email']);
  assert.ok(f.some((x) => x.file.endsWith('(author)')) && f.some((x) => x.file.endsWith('(message)')));
});
test('history output never contains the matched text', () => {
  const { d, run } = repo();
  const secret = drive('hidden');
  writeFileSync(path.join(d, 'a.md'), `${secret}\n`);
  run(['add', '.']); run(['commit', '-q', '-m', 'm'], author);
  for (const f of scanHistory(d)) assert.ok(!JSON.stringify(f).includes('hidden'));
});
