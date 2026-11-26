import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replaceRegion } from '../src/markers.mjs';

const S = '<!-- gen:t:start -->';
const E = '<!-- gen:t:end -->';

test('replaces only inside the region', () => {
  const out = replaceRegion(`before\n${S}\nold\n${E}\nafter\n`, 't', 'a\nb');
  assert.equal(out, `before\n${S}\na\nb\n${E}\nafter\n`);
});
test('inline single-line content stays inline', () => {
  assert.equal(replaceRegion(`x ${S}1${E} y`, 't', '61'), `x ${S}61${E} y`);
});
test('preserves CRLF line endings of the file', () => {
  const out = replaceRegion(`a\r\n${S}\r\nold\r\n${E}\r\nz\r\n`, 't', 'one\ntwo');
  assert.equal(out, `a\r\n${S}\r\none\r\ntwo\r\n${E}\r\nz\r\n`);
  assert.ok(!/[^\r]\n/.test(out));
});
test('throws on a missing end marker', () => {
  assert.throws(() => replaceRegion(`${S}\nx\n`, 't', 'y'), /marker t missing/);
});
test('throws on a missing region', () => {
  assert.throws(() => replaceRegion('nothing', 't', 'y'), /marker t missing/);
});
test('throws on a duplicate region', () => {
  assert.throws(() => replaceRegion(`${S}a${E}\n${S}b${E}`, 't', 'y'), /marker t duplicated/);
});
test('running twice gives the same text', () => {
  const once = replaceRegion(`${S}\nold\n${E}\n`, 't', 'a\nb');
  assert.equal(replaceRegion(once, 't', 'a\nb'), once);
});
