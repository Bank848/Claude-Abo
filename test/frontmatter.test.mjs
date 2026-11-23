import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from '../src/frontmatter.mjs';

test('parses LF', () => {
  const r = parseFrontmatter('---\nname: a\ndescription: "hi there"\n---\nbody\n');
  assert.deepEqual(r.data, { name: 'a', description: 'hi there' });
  assert.equal(r.body, 'body\n');
});
test('parses CRLF', () => {
  assert.equal(parseFrontmatter('---\r\nname: a\r\n---\r\nx').data.name, 'a');
});
test('strips UTF-8 BOM', () => {
  assert.equal(parseFrontmatter('\uFEFF---\nname: a\n---\n').data.name, 'a');
});
test('multi-line description with indentation', () => {
  const r = parseFrontmatter('---\nname: a\ndescription: first line\n  second line\nother: x\n---\n');
  assert.equal(r.data.description, 'first line second line');
  assert.equal(r.data.other, 'x');
});
test('folded >- scalar', () => {
  const r = parseFrontmatter('---\ndescription: >-\n  one\n  two\nname: a\n---\n');
  assert.equal(r.data.description, 'one two');
  assert.equal(r.data.name, 'a');
});
test('literal | scalar keeps newlines', () => {
  assert.equal(parseFrontmatter('---\ndescription: |\n  a\n  b\n---\n').data.description, 'a\nb');
});
test('no frontmatter returns empty data', () => {
  const r = parseFrontmatter('# just text\n');
  assert.deepEqual(r.data, {});
  assert.equal(r.body, '# just text\n');
});
test('one level of nested map becomes dotted keys', () => {
  const r = parseFrontmatter('---\nname: m\nmetadata:\n  type: feedback\n  x: "y"\n---\n');
  assert.equal(r.data['metadata.type'], 'feedback');
  assert.equal(r.data['metadata.x'], 'y');
});
