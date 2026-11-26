import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../src/audit-core.mjs';
import { exportInventory } from '../src/inventory-export.mjs';
import { collectInventory } from '../src/inventory-node.mjs';
import { parsePasted, TOO_BIG } from '../src/parse-pasted.mjs';
import { makeHome } from './helpers/home.mjs';

const catalog = { skills: [{ name: 'alpha', descTokens: 30 }, { name: 'beta', descTokens: 50 }] };

test('export JSON round-trips to the same totals and cuts as the CLI', async () => {
  const h = makeHome({ skills: ['alpha', 'zz-private'] });
  const inv = await collectInventory({ home: h.home, cwd: h.cwd, env: {} });
  const exported = exportInventory(inv, catalog).inventory;
  const parsed = parsePasted(JSON.stringify(exported), catalog);
  assert.equal(parsed.error, null);
  assert.equal(parsed.partial, false);
  const a = analyze(exported, catalog);
  const b = analyze(parsed.inventory, catalog);
  assert.deepEqual(b.totals, a.totals);
  assert.deepEqual(b.cuts, a.cuts);
  assert.deepEqual(b.checks, a.checks);
});
test('plain list matches catalog names', () => {
  const r = parsePasted('alpha\nbeta\n', catalog);
  assert.equal(r.partial, true);
  assert.deepEqual(r.inventory.skills.map((s) => [s.name, s.descTokens, Boolean(s.unknown)]), [['alpha', 30, false], ['beta', 50, false]]);
});
test('unknown names are flagged and estimated at 120', () => {
  const s = parsePasted('alpha\nmystery', catalog).inventory.skills[1];
  assert.equal(s.descTokens, 120);
  assert.equal(s.unknown, true);
});
test('bullets and ls output parse', () => {
  const r = parsePasted('- alpha\n* beta\nfoo/\n# comment\n', catalog);
  assert.deepEqual(r.inventory.skills.map((s) => s.name), ['alpha', 'beta', 'foo']);
});
test('over 1 MB is rejected with the exact message', () => {
  assert.equal(parsePasted('a\n'.repeat(600_000), catalog).error, TOO_BIG);
  assert.equal(TOO_BIG, 'Paste is over 1 MB; use audit --export instead.');
});
test('binary-looking input is rejected', () => {
  assert.match(parsePasted('abc\u0000def', catalog).error, /binary/);
});
test('empty or unreadable input gives a helpful error', () => {
  assert.match(parsePasted('   \n', catalog).error, /Nothing was pasted/);
  assert.match(parsePasted('{"a":1}', catalog).error, /not an audit export/);
  assert.match(parsePasted('{oops', catalog).error, /could not be read/);
});
test('duplicate lines are counted once', () => {
  assert.equal(parsePasted('alpha\nalpha\nalpha', catalog).inventory.skills.length, 1);
});
test('__proto__, constructor and prototype keys are ignored and Object.prototype stays clean', () => {
  const evil = '{"__proto__":{"polluted":1},"skills":[{"name":"constructor","descTokens":5,"__proto__":{"polluted":2}}],"usage":{"windowDays":3,"skillCalls":{"__proto__":4,"constructor":2,"prototype":1}},"permissions":{"__proto__":{"polluted":3}}}';
  const r = parsePasted(evil, catalog);
  assert.equal(r.error, null);
  assert.equal({}.polluted, undefined);
  assert.equal(Object.prototype.polluted, undefined);
  assert.equal(r.inventory.skills[0].name, 'constructor');
  assert.equal(Object.getPrototypeOf(r.inventory.usage.skillCalls), null);
  assert.doesNotThrow(() => analyze(r.inventory, catalog));
});
test('huge arrays and very long names are truncated with a notice', () => {
  const skills = Array.from({ length: 6000 }, (_, i) => ({ name: i === 0 ? 'x'.repeat(500) : `s${i}`, descTokens: 1 }));
  const r = parsePasted(JSON.stringify({ skills }), catalog);
  assert.equal(r.inventory.skills.length, 5000);
  assert.equal(r.inventory.skills[0].name.length, 100);
  assert.ok(r.notices.length >= 2);
});
test('wrong field types are coerced, not trusted', () => {
  const r = parsePasted(JSON.stringify({ skills: [{ name: 5, descTokens: 'big', descChars: -2 }], claudeMd: 'x', contextTokens: 'nope' }), catalog);
  assert.deepEqual(r.inventory.skills[0], { name: '', origin: 'paste', descChars: 0, descTokens: 0 });
  assert.equal(r.inventory.contextTokens, null);
  assert.doesNotThrow(() => analyze(r.inventory, catalog));
});
