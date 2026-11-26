import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMemoryDir } from '../src/memory/read.mjs';
import { classify } from '../src/memory/classify.mjs';
import { generalize } from '../src/memory/generalize.mjs';
import { similarity } from '../src/memory/similar.mjs';
import { gate } from '../src/memory/gate.mjs';
import memoryExamples from '../src/checks/memory-examples.mjs';

const BIN = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));
const AT = '@';
const SSH = '.ssh';
const IP = ['10', '1', '2', '3'].join('.');
const tmp = () => mkdtempSync(path.join(os.tmpdir(), 'abo-mem-'));
const NOW = new Date('2026-11-23T00:00:00Z');

function folder(files, index) {
  const dir = tmp();
  for (const [name, text] of Object.entries(files)) writeFileSync(path.join(dir, name), text);
  if (index !== undefined) writeFileSync(path.join(dir, 'MEMORY.md'), index);
  return dir;
}
const note = (name, type, body, extra = '') => `---\nname: ${name}\ndescription: d\nmetadata:\n  type: ${type}\n${extra}---\n\n${body}\n`;
const listing = (...files) => `${files.map((f) => `- [${f}](${f}) hook`).join('\n')}\n`;
const verdictOf = (res, file) => res.find((c) => c.file === file);

function hashTree(dir) {
  const h = createHash('sha256');
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else h.update(e.name).update(readFileSync(p));
    }
  };
  walk(dir);
  return h.digest('hex');
}

// ---------- read
test('readMemoryDir reads type from metadata.type, index flag and links', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'see [b](b.md)'), 'b.md': note('b', 'reference', 'text') }, listing('a.md'));
  const notes = await readMemoryDir(dir);
  const a = notes.find((n) => n.file === 'a.md');
  assert.equal(a.type, 'feedback');
  assert.equal(a.indexed, true);
  assert.deepEqual(a.links, ['b.md']);
  assert.equal(notes.find((n) => n.file === 'b.md').indexed, false);
});

// ---------- classify
test('a note missing from MEMORY.md with no inbound link is stale', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'alpha beta gamma delta epsilon zeta') }, listing());
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'stale');
});
test('missing file named in MEMORY.md is stale and reported on the index line', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'one two three four five six') }, listing('a.md', 'gone.md'));
  const res = classify(await readMemoryDir(dir), { now: NOW });
  assert.equal(verdictOf(res, 'MEMORY.md').verdict, 'stale');
});
test('a superseded note that names a replacement is stale', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'This is superseded by [[b]] now.'), 'b.md': note('b', 'feedback', 'completely different words here for it') }, listing('a.md', 'b.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'stale');
});
test('an old project note with only old dates is stale', async () => {
  const dir = folder({ 'a.md': note('a', 'project', 'Started 2026-01-05 and finished 2026-02-01 with plenty of text.') }, listing('a.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'stale');
});
test('two dated notes with the same prefix suggest merge', async () => {
  const dir = folder({
    'foo-2026-10-01.md': note('foo-2026-10-01', 'feedback', 'alpha topic words one'),
    'foo-2026-11-02.md': note('foo-2026-11-02', 'feedback', 'unrelated sentence about something else entirely'),
  }, listing('foo-2026-10-01.md', 'foo-2026-11-02.md'));
  const c = verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'foo-2026-10-01.md');
  assert.equal(c.verdict, 'merge');
  assert.deepEqual(c.mergeWith, ['foo-2026-11-02.md']);
});
test('notes with similarity at or above 0.45 suggest merge', async () => {
  const body = 'always run the full test suite before you push so that the build stays green for everybody on the team today';
  const dir = folder({ 'a.md': note('a', 'feedback', body), 'b.md': note('b', 'feedback', `${body} please`) }, listing('a.md', 'b.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'merge');
});
test('project note is keep-private', async () => {
  const dir = folder({ 'a.md': note('a', 'project', 'Working on the roadmap since 2026-11-01 with the team.') }, listing('a.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'keep-private');
});
test('a note with too many private identifiers is keep-private', async () => {
  const body = Array.from({ length: 7 }, (_, i) => `server ${['10', '0', '0', i + 1].join('.')} is the box`).join('\n');
  const dir = folder({ 'a.md': note('a', 'reference', body) }, listing('a.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'keep-private');
});
test('generic feedback note is shareable', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'Prefer small commits because review is faster.\n\n**Why:** easier to revert.') }, listing('a.md'));
  assert.equal(verdictOf(classify(await readMemoryDir(dir), { now: NOW }), 'a.md').verdict, 'shareable-as-example');
});
test('classify never modifies any file', async () => {
  const dir = folder({ 'a.md': note('a', 'feedback', 'some body text here') }, listing('a.md'));
  const before = hashTree(dir);
  classify(await readMemoryDir(dir), { now: NOW });
  assert.equal(hashTree(dir), before);
});

// ---------- generalize
const gen = (t, privateList = []) => generalize(t, { privateList }).text;
test('email becomes <EMAIL>', () => assert.equal(gen(`mail bob${AT}corp.org now`), 'mail <EMAIL> now'));
test('ipv4 becomes <SERVER_IP>', () => assert.equal(gen(`host ${IP} up`), 'host <SERVER_IP> up'));
test('ssh command keeps shape with placeholders and a key placeholder', () => {
  const out = gen(`ssh -i ~/${SSH}/id_x bob${AT}${IP}`);
  assert.equal(out, 'ssh -i ~/.ssh/<KEY> <USER>@<HOST>');
});
test('Windows profile path becomes <YOUR_HOME>', () => {
  assert.equal(gen(`open ${'C:'}${'\\Users\\bob\\notes'} please`), 'open <YOUR_HOME>\\notes please');
});
test('other drive path becomes <PROJECT_DIR>', () => {
  assert.match(gen(`see ${'D:'}${'\\work\\app\\x.txt'}`), /see <PROJECT_DIR>\\app\\x\.txt/);
});
test('posix home path becomes ~', () => assert.equal(gen(`at ${'/home'}/bob/x`), 'at ~/x'));
test('private repo literal becomes <PRIVATE_REPO>', () => {
  const list = [{ category: 'repo', literal: 'secret-project' }];
  assert.equal(gen('work on Secret-Project today', list), 'work on <PRIVATE_REPO> today');
});
test('GitHub URL of a private repo is generalized', () => {
  const list = [{ category: 'repo', literal: 'secret-project' }];
  assert.equal(gen('https://github.com/someone/secret-project/issues', list), 'https://github.com/<OWNER>/<PRIVATE_REPO>/issues');
});
test('person literal becomes <COLLABORATOR>', () => {
  assert.equal(gen('asked Zorbulon', [{ category: 'person', literal: 'Zorbulon' }]), 'asked <COLLABORATOR>');
});
test('originSessionId line and metadata block except type are stripped', () => {
  const src = '---\nname: a\noriginSessionId: abc\nmetadata:\n  type: feedback\n  source: cli\n  other: x\n---\nbody\n';
  assert.equal(gen(src), '---\nname: a\nmetadata:\n  type: feedback\n---\nbody\n');
});
test('metadata block without type is removed entirely', () => {
  assert.equal(gen('---\nname: a\nmetadata:\n  source: cli\n---\nbody\n'), '---\nname: a\n---\nbody\n');
});
test('a bare UUID becomes <UUID>', () => {
  const u = ['1b2c3d4e', '1111', '2222', '3333', '444455556666'].join('-');
  assert.equal(gen(`id ${u} end`), 'id <UUID> end');
});
test('Thai text around identifiers is preserved byte-for-byte', () => {
  const out = gen(`ส่งอีเมลไปที่ bob${AT}corp.org ทันที ขอบคุณครับ`);
  assert.equal(out, 'ส่งอีเมลไปที่ <EMAIL> ทันที ขอบคุณครับ');
});

// ---------- similarity
test('identical texts have similarity 1', () => assert.equal(similarity('a b c d e f g', 'a b c d e f g'), 1));
test('disjoint texts have similarity 0', () => assert.equal(similarity('a b c d e f g', 'h i j k l m n'), 0));
test('one changed sentence in ten stays above 0.6', () => {
  const s = Array.from({ length: 10 }, (_, i) => `sentence number ${i} talks about topic ${i} in some detail here.`);
  const t = [...s];
  t[4] = 'completely replaced wording appears in this single line instead.';
  assert.ok(similarity(s.join(' '), t.join(' ')) > 0.6);
});

// ---------- gate
const para = 'Always read the failing output before you change anything because the first error usually explains the rest of the chain and guessing wastes more time than reading ever will during a long debugging session at work, so slow down, read each line of the report carefully, and only then decide what to touch first';
const realNote = (body) => [{ body }];
const ex = (file, text) => ({ file, text });
test('near-copy fails at 0.35', () => {
  const f = gate({ files: [ex('examples/memory/x.md', `---\nrewritten: true\n---\n\n${para}\n`)], realNotes: realNote(para) });
  assert.ok(f.some((x) => x.rule === 'near-copy' && x.severity === 'error'));
});
test('a rewritten example passes', () => {
  const mine = 'When a job fails, start from the log, not from a hunch. Early errors tend to cause the later ones, so fixing the first usually clears the whole cascade, and that saves a surprising amount of effort over a long afternoon of tinkering';
  const f = gate({ files: [ex('examples/memory/x.md', `---\nrewritten: true\n---\n\n${mine}\n`)], realNotes: realNote(para) });
  assert.deepEqual(f.filter((x) => x.severity === 'error'), []);
});
test('a paraphrase with 3 shared rare words raises the rare-term warning', () => {
  const real = [{ body: 'The migration orchestrator requires idempotent rollbacks.' }, { body: 'Other unrelated note about lunch.' }, { body: 'Third note about walking.' }];
  const mine = 'Our orchestrator design wants idempotent behaviour and safe migration steps overall.';
  const f = gate({ files: [ex('examples/memory/x.md', `---\nrewritten: true\n---\n${mine}\n`)], realNotes: real });
  assert.ok(f.some((x) => x.rule === 'rare-term' && x.severity === 'warn'));
});
test('missing rewritten: true fails', () => {
  const f = gate({ files: [ex('examples/memory/x.md', '---\nname: x\n---\nbody\n')], realNotes: [] });
  assert.ok(f.some((x) => x.rule === 'rewritten-flag' && x.severity === 'error'));
});
test('README.md in examples/memory needs no flag', () => {
  assert.deepEqual(gate({ files: [ex('examples/memory/README.md', 'Intro text.\n')], realNotes: [] }), []);
});
test('lesson files need no flag', () => {
  assert.deepEqual(gate({ files: [ex('learn/lessons/one.md', 'Lesson text.\n')], realNotes: [] }), []);
});
test('near-copy also covers global-config markdown', () => {
  const f = gate({ files: [ex('global-config/CLAUDE.md', `${para}\n`)], realNotes: realNote(para) });
  assert.ok(f.some((x) => x.rule === 'near-copy'));
});
test('findings never contain the matched text', () => {
  const f = gate({ files: [ex('examples/memory/x.md', `---\nrewritten: true\n---\n\n${para}\n`)], realNotes: realNote(para) });
  for (const x of f) assert.ok(!x.message.includes('failing output'));
});

// ---------- check --local and CLI
function gitRepo() {
  const root = tmp();
  execFileSync('git', ['init', '-q'], { cwd: root });
  return root;
}
test('memory-examples check with --local fails when .abo-local.json is missing', async () => {
  const f = await memoryExamples(gitRepo(), { local: true });
  assert.ok(f.some((x) => x.rule === 'abo-local-missing' && x.severity === 'error'));
});
test('memory-examples check without --local runs rewritten-flag only', async () => {
  const root = gitRepo();
  mkdirSync(path.join(root, 'examples', 'memory'), { recursive: true });
  writeFileSync(path.join(root, 'examples', 'memory', 'a.md'), 'no flag\n');
  const f = await memoryExamples(root, {});
  assert.deepEqual(f.map((x) => x.rule), ['rewritten-flag']);
});
test('memory-examples --local compares against memoryDirs from .abo-local.json', async () => {
  const root = gitRepo();
  const real = folder({ 'r.md': note('r', 'feedback', para) }, listing('r.md'));
  writeFileSync(path.join(root, '.abo-local.json'), JSON.stringify({ memoryDirs: [real] }));
  mkdirSync(path.join(root, 'examples', 'memory'), { recursive: true });
  writeFileSync(path.join(root, 'examples', 'memory', 'a.md'), `---\nrewritten: true\n---\n\n${para}\n`);
  const f = await memoryExamples(root, { local: true });
  assert.ok(f.some((x) => x.rule === 'near-copy'));
});

const run = (cwd, ...args) => spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' });
test('sanitize never writes inside the source dir and stages generalized copies', () => {
  const repo = gitRepo();
  const src = folder({ 'a.md': note('a', 'feedback', `mail bob${AT}corp.org`) }, listing('a.md'));
  const stage = path.join(tmp(), 'stage');
  const before = hashTree(src);
  const r = run(repo, 'memory', 'sanitize', src, '--stage', stage);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(hashTree(src), before);
  assert.match(readFileSync(path.join(stage, 'a.md'), 'utf8'), /<EMAIL>/);
  const bad = run(repo, 'memory', 'sanitize', src, '--stage', path.join(src, 'inner'));
  assert.equal(bad.status, 2);
});
test('sanitize and classify with an output inside the repo root exit 2', () => {
  const repo = gitRepo();
  const src = folder({ 'a.md': note('a', 'feedback', 'text body here') }, listing('a.md'));
  assert.equal(run(repo, 'memory', 'sanitize', src, '--stage', path.join(repo, 'stage')).status, 2);
  assert.equal(run(repo, 'memory', 'classify', src, '--out', path.join(repo, 'out.md')).status, 2);
});
test('classify writes the report outside the repo and prints counts only', () => {
  const repo = gitRepo();
  const src = folder({ 'zz-private-name.md': note('zz-private-name', 'project', 'text body here') }, listing('zz-private-name.md'));
  const out = path.join(tmp(), 'report.md');
  const r = run(repo, 'memory', 'classify', src, '--out', out);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.stdout.includes('zz-private-name'));
  assert.ok(statSync(out).size > 0);
});
test('memory gate runs against --real folders and exits 1 on a near copy', () => {
  const repo = gitRepo();
  mkdirSync(path.join(repo, 'examples', 'memory'), { recursive: true });
  writeFileSync(path.join(repo, 'examples', 'memory', 'a.md'), `---\nrewritten: true\n---\n\n${para}\n`);
  const real = folder({ 'r.md': note('r', 'feedback', para) }, listing('r.md'));
  const r = run(repo, 'memory', 'gate', '--real', real);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /near-copy/);
});
