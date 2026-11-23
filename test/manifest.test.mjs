import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateManifest } from '../src/manifest.mjs';

const UP = { repo: 'acme/skills', license: 'MIT', copyright: 'x', licenseUrl: null };
const bundled = (over = {}) => ({
  name: 'alpha',
  path: 'global-config/skills/alpha',
  summary: 'Does a thing.',
  category: 'engineering',
  origin: 'adopted',
  upstream: 'acme/skills',
  source: { subpath: 'skills/alpha', commit: 'a'.repeat(40), note: 'n' },
  license: { spdx: 'MIT', redistribution: 'allowed', checked: '2026-11-24', evidence: 'https://example.com/e' },
  tested: { date: null, claudeCode: null, how: null },
  status: 'experimental',
  knownIssues: [],
  security: { scanned: null, scanner: null, errors: null, reviewed: false },
  ...over,
});
const pointer = (over = {}) => ({
  ...bundled(),
  name: 'beta',
  path: null,
  license: { spdx: 'NOASSERTION', redistribution: 'not-bundled', checked: '2026-11-23', evidence: 'x' },
  pointer: { url: 'https://github.com/acme/skills/tree/abc/skills/beta', install: 'copy the folder', note: 'n' },
  status: 'pointer',
  ...over,
});
const man = (skills, upstreams = [{ ...UP }]) => ({ schemaVersion: 1, upstreams, skills });
const DIRS = ['global-config/skills/alpha'];
const rules = (m, dirs = DIRS) => validateManifest(m, dirs).map((f) => f.rule);
const one = (m, rule, dirs = DIRS) => assert.deepEqual(rules(m, dirs), [rule]);

test('valid manifest has no findings', () => assert.deepEqual(rules(man([bundled()])), []));
test('missing required field', () => { const s = bundled(); delete s.summary; one(man([s]), 'required-field'); });
test('bad category enum', () => one(man([bundled({ category: 'nope' })]), 'enum'));
test('bad status enum', () => one(man([bundled({ status: 'nope' })]), 'enum'));
test('bad name format', () => one(man([bundled({ name: 'Alpha_X', path: 'global-config/skills/Alpha_X' })]), 'name-format', ['global-config/skills/Alpha_X']));
test('name must equal last path segment', () => one(man([bundled({ name: 'gamma' })]), 'name-path-mismatch'));
test('duplicate names', () => one(man([bundled(), bundled()]), 'name-duplicate'));
test('path not in skill dirs', () => assert.ok(rules(man([bundled()]), []).includes('path-missing')));
test('skill dir without entry', () => one(man([bundled()]), 'dir-unlisted', [...DIRS, 'global-config/skills/orphan']));
test('upstream format', () => assert.ok(rules(man([bundled({ upstream: 'bad' })])).includes('upstream-format')));
test('upstream not in upstreams', () => one(man([bundled({ upstream: 'x/y' })]), 'upstream-unknown'));
test('license mismatch with upstream', () => one(man([bundled({ license: { spdx: 'GPL-3.0', redistribution: 'allowed', checked: null, evidence: null } })]), 'license-mismatch'));
test('license mismatch ok for self-authored', () => assert.deepEqual(rules(man([bundled({ origin: 'self-authored', license: { spdx: 'MIT', redistribution: 'self' }, upstream: null })])), []));
test('skill-level licence file evidence overrides upstream license', () => {
  const lic = { spdx: 'Apache-2.0', redistribution: 'allowed', checked: '2026-11-24', evidence: 'https://api.github.com/repos/acme/skills/contents/skills/alpha/LICENSE.txt' };
  assert.deepEqual(rules(man([bundled({ license: lic })])), []);
});
test('bundled skill with redistribution not-bundled fails', () => one(man([bundled({ license: { spdx: 'MIT', redistribution: 'not-bundled' } })]), 'bundled-redistribution'));
test('bundled skill with pointer status fails', () => assert.ok(rules(man([bundled({ status: 'pointer' })])).includes('bundled-pointer')));
test('permission-granted without evidence fails', () => one(man([bundled({ license: { spdx: 'MIT', redistribution: 'permission-granted', evidence: null } })]), 'permission-evidence'));
test('pointer without install fails', () => one(man([bundled(), pointer({ pointer: { url: 'https://github.com/acme/skills/x', install: '', note: 'n' } })]), 'pointer-shape'));
test('pointer with a path fails', () => assert.ok(rules(man([bundled(), pointer({ path: 'global-config/skills/beta' })]), [...DIRS, 'global-config/skills/beta']).includes('pointer-shape')));
test('pointer whose url is outside its upstream fails', () => one(man([bundled(), pointer({ pointer: { url: 'https://github.com/evil/other/x', install: 'i', note: 'n' } })]), 'pointer-shape'));
test('valid pointer passes and needs no skill folder', () => assert.deepEqual(rules(man([bundled(), pointer()])), []));
test('adopted without upstream needs a source-not-recorded issue', () => {
  one(man([bundled({ upstream: null })]), 'origin-upstream');
  assert.deepEqual(rules(man([bundled({ upstream: null, knownIssues: ['source not recorded: older import'] })])), []);
});
test('bad date format', () => one(man([bundled({ tested: { date: '24/11/2026', claudeCode: null, how: null } })]), 'date-format'));
test('summary over 120 chars or with a pipe fails', () => {
  one(man([bundled({ summary: 'x'.repeat(121) })]), 'summary');
  one(man([bundled({ summary: 'a | b' })]), 'summary');
});
test('stable without tested.date warns', () => {
  const f = validateManifest(man([bundled({ status: 'stable' })]), DIRS);
  assert.equal(f.length, 1);
  assert.equal(f[0].severity, 'warn');
  assert.equal(f[0].rule, 'stable-untested');
});
