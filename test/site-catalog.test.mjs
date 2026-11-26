import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterSkills, pointerUrl, sortSkills, upstreamUrl } from '../site/catalog.mjs';

const S = [
  { name: 'Alpha-Search', summary: 'Finds things on the web', category: 'research', status: 'experimental', license: { spdx: 'MIT' }, descTokens: 40 },
  { name: 'beta-design', summary: 'Makes banners', category: 'design', status: 'workflow-specific', license: { spdx: 'MIT' }, descTokens: 90 },
  { name: 'gamma-ptr', summary: 'Pointer to a web tool', category: 'research', status: 'pointer', license: { spdx: 'NOASSERTION' }, descTokens: null, upstream: 'o/r', pointer: { url: 'https://github.com/o/r/tree/abc/x' } },
];
const names = (a) => a.map((s) => s.name);

test('text search covers name and summary, case-insensitive', () => {
  assert.deepEqual(names(filterSkills(S, { q: 'ALPHA' })), ['Alpha-Search']);
  assert.deepEqual(names(filterSkills(S, { q: 'banners' })), ['beta-design']);
  assert.deepEqual(names(filterSkills(S, { q: 'web' })), ['Alpha-Search', 'gamma-ptr']);
});
test('category, status and licence filters', () => {
  assert.deepEqual(names(filterSkills(S, { category: 'design' })), ['beta-design']);
  assert.deepEqual(names(filterSkills(S, { status: 'pointer' })), ['gamma-ptr']);
  assert.deepEqual(names(filterSkills(S, { license: 'NOASSERTION' })), ['gamma-ptr']);
});
test('bundled hides pointers; default shows both', () => {
  assert.equal(filterSkills(S, {}).length, 3);
  assert.deepEqual(names(filterSkills(S, { bundled: true })), ['Alpha-Search', 'beta-design']);
});
test('filters combine', () => {
  assert.deepEqual(names(filterSkills(S, { q: 'web', category: 'research', bundled: true })), ['Alpha-Search']);
  assert.deepEqual(filterSkills(S, { q: 'web', category: 'design' }), []);
});
test('sort by name and by descTokens (largest first, null last)', () => {
  assert.deepEqual(names(sortSkills(S, 'name')), ['Alpha-Search', 'beta-design', 'gamma-ptr']);
  assert.deepEqual(names(sortSkills(S, 'descTokens')), ['beta-design', 'Alpha-Search', 'gamma-ptr']);
  assert.deepEqual(names(S), ['Alpha-Search', 'beta-design', 'gamma-ptr']);
});
test('links come only from a valid owner/repo and a pointer under it', () => {
  assert.equal(upstreamUrl(S[2]), 'https://github.com/o/r');
  assert.equal(pointerUrl(S[2]), 'https://github.com/o/r/tree/abc/x');
  assert.equal(upstreamUrl({ upstream: 'javascript:alert(1)' }), null);
  assert.equal(upstreamUrl({ upstream: 'a/b/../../c' }), null);
  assert.equal(pointerUrl({ upstream: 'o/r', pointer: { url: 'https://evil.example/o/r/x' } }), null);
  assert.equal(pointerUrl({ upstream: 'o/r', pointer: { url: 'https://github.com/o/rx/y' } }), null);
});
