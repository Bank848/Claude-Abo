import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mitTable, noLicenseList, upstreamsTable } from '../src/gen/attribution.mjs';
import { skillsBadge, skillsTable } from '../src/gen/readme-table.mjs';
import { runGen } from '../src/gen/run.mjs';
import { syncSources } from '../src/gen/sources.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const BIN = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));
const lic = (spdx, redistribution = 'allowed') => ({ spdx, redistribution, checked: '2026-01-01', evidence: 'x' });
const skill = (name, category, over = {}) => ({
  name, path: `global-config/skills/${name}`, summary: `${name} summary`, category, origin: 'adopted', upstream: 'o/r',
  license: lic('MIT'), status: 'experimental', knownIssues: [], ...over,
});
const manifest = () => ({
  schemaVersion: 1,
  upstreams: [{ repo: 'o/r', license: 'MIT', copyright: 'Copyright (c) 2026 O' }, { repo: 'x/nolic', license: 'NOASSERTION', copyright: null }],
  skills: [
    skill('zeta', 'design'), skill('alpha', 'engineering'), skill('beta', 'engineering'),
    skill('ptr', 'engineering', { path: null, status: 'pointer', upstream: 'x/nolic', license: lic('NOASSERTION', 'not-bundled'), pointer: { url: 'https://github.com/x/nolic/tree/abc/ptr', install: 'npx skills add x/nolic', note: 'n' } }),
    skill('mine', 'meta', { origin: 'self-authored', upstream: null, license: lic('MIT', 'self') }),
  ],
});

test('skills table rows are sorted by category then name', () => {
  const t = skillsTable(manifest());
  assert.ok(t.indexOf('`alpha`') < t.indexOf('`beta`'));
  assert.ok(t.indexOf('**Engineering') < t.indexOf('**Design'));
  assert.ok(t.indexOf('`beta`') < t.indexOf('`zeta`'));
});
test('badge count equals the number of bundled (non-pointer) skills', () => {
  assert.match(skillsBadge(manifest()), /skills-4%20bundled/);
});
test('pointer entries render in the not-bundled table', () => {
  const t = skillsTable(manifest());
  assert.match(t, /Not bundled, install from upstream \(1\)/);
  assert.match(t, /\| `ptr` \| \[x\/nolic\]\(https:\/\/github\.com\/x\/nolic\/tree\/abc\/ptr\) \| npx skills add x\/nolic \|/);
  assert.ok(!/\| `ptr` \|[^\n]*experimental/.test(t));
});
test('attribution tables: MIT rows need a copyright line and no-licence repos are listed', () => {
  const m = manifest();
  assert.match(mitTable(m), /o\/r.*Copyright \(c\) 2026 O/);
  assert.ok(!mitTable(m).includes('x/nolic'));
  assert.match(noLicenseList(m), /x\/nolic/);
  assert.match(upstreamsTable(m), /x\/nolic.*not bundled/);
});

const SRC = (extra = '') => `﻿{\r\n  "_README": "readme",\r\n  "git_plugins": {"a": 1},\r\n  "personal_skills": [\r\n    {\r\n      "name": "alpha",\r\n      "source_repo_url": "https://github.com/o/r",\r\n      "subpath_in_repo": "s/alpha",\r\n      "last_seen_commit": "abc",\r\n      "note": "keep me"\r\n    }\r\n  ]${extra}\r\n}\r\n`;
test('sources sync keeps BOM and CRLF', () => {
  const out = syncSources(SRC(), manifest());
  assert.ok(out.startsWith('﻿'));
  assert.ok(!/[^\r]\n/.test(out));
});
test('sources sync keeps the blocks around personal_skills byte-identical', () => {
  const before = SRC();
  const out = syncSources(before, manifest());
  const head = (t) => t.slice(0, t.indexOf('"personal_skills"'));
  assert.equal(head(out).replace(/"_README": "[^"]*"/, ''), head(before).replace(/"_README": "[^"]*"/, ''));
  assert.equal(out.slice(out.lastIndexOf(']')), before.slice(before.lastIndexOf(']')));
});
test('sources sync writes keys in the fixed order and keeps old notes', () => {
  const out = syncSources(SRC(), manifest());
  const entry = JSON.parse(out.replace(/^﻿/, '')).personal_skills.find((e) => e.name === 'alpha');
  assert.deepEqual(Object.keys(entry), ['name', 'source_repo_url', 'subpath_in_repo', 'last_seen_commit', 'note']);
  assert.equal(entry.note, 'keep me');
});
test('self-authored skills get source_repo_url self-authored', () => {
  const e = JSON.parse(syncSources(SRC(), manifest()).replace(/^﻿/, '')).personal_skills.find((x) => x.name === 'mine');
  assert.equal(e.source_repo_url, 'self-authored');
});
test('pointer entries are still written to personal_skills and _README says generated', () => {
  const j = JSON.parse(syncSources(SRC(), manifest()).replace(/^﻿/, ''));
  assert.ok(j.personal_skills.some((e) => e.name === 'ptr'));
  assert.match(j._README, /generated from catalog\/skills\.json/);
});
test('sources sync is idempotent', () => {
  const once = syncSources(SRC(), manifest());
  assert.equal(syncSources(once, manifest()), once);
});

function root() {
  const r = mkdtempSync(path.join(os.tmpdir(), 'abo-gen-'));
  const put = (rel, text) => { mkdirSync(path.dirname(path.join(r, rel)), { recursive: true }); writeFileSync(path.join(r, rel), text); };
  put('catalog/skills.json', JSON.stringify(manifest()));
  for (const n of ['zeta', 'alpha', 'beta', 'mine']) put(`global-config/skills/${n}/SKILL.md`, `---\nname: ${n}\ndescription: does ${n}\n---\n`);
  const badge = '<!-- gen:skills-count-badge:start -->old<!-- gen:skills-count-badge:end -->';
  put('README.md', `${badge}\n<!-- gen:skills-table:start -->\n<!-- gen:skills-table:end -->\n`);
  for (const l of ['de', 'es', 'fr', 'ja', 'ko', 'pt-BR', 'ru', 'th', 'zh-Hans']) put(`README.${l}.md`, `${badge}\n`);
  put('docs/guide.md', 'tree <!-- gen:skills-count:start -->0<!-- gen:skills-count:end --> and <!-- gen:skills-count-4:start -->0<!-- gen:skills-count-4:end -->\n');
  put('ATTRIBUTION.md', '<!-- gen:upstreams-table:start -->\n<!-- gen:upstreams-table:end -->\n');
  put('THIRD_PARTY_LICENSES.md', '<!-- gen:mit-table:start -->\n<!-- gen:mit-table:end -->\n<!-- gen:no-license-list:start -->\n<!-- gen:no-license-list:end -->\n');
  put('global-config/tools/skill-update-check/sources.json', SRC());
  return r;
}

test('check mode returns changed files and writes nothing', async () => {
  const r = root();
  const before = readFileSync(path.join(r, 'README.md'), 'utf8');
  const { changed } = await runGen({ root: r, check: true });
  assert.ok(changed.includes('README.md') && changed.includes('ATTRIBUTION.md'));
  assert.equal(readFileSync(path.join(r, 'README.md'), 'utf8'), before);
});
test('gen writes, then check reports nothing to change', async () => {
  const r = root();
  await runGen({ root: r });
  assert.deepEqual((await runGen({ root: r, check: true })).changed, []);
  assert.match(readFileSync(path.join(r, 'README.md'), 'utf8'), /skills-4%20bundled/);
});
test('a hand edit of a generated region is reported by --check', async () => {
  const r = root();
  await runGen({ root: r });
  const p = path.join(r, 'README.md');
  writeFileSync(p, readFileSync(p, 'utf8').replace('alpha summary', 'edited by hand'));
  assert.deepEqual((await runGen({ root: r, check: true })).changed, ['README.md']);
});
test('a missing region is an error on purpose', async () => {
  const r = root();
  writeFileSync(path.join(r, 'README.de.md'), 'no markers here\n');
  await assert.rejects(runGen({ root: r }), /marker skills-count-badge missing/);
});
test('CLI gen --check exits 1 when out of date and 0 after gen', () => {
  const r = root();
  const run = (...a) => spawnSync(process.execPath, [BIN, 'gen', ...a], { cwd: r, encoding: 'utf8' });
  assert.equal(run('--check').status, 1);
  assert.equal(run().status, 0);
  assert.equal(run('--check').status, 0);
});
