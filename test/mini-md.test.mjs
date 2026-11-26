import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown } from '../src/mini-md.mjs';

test('parseMarkdown keeps <script> as plain text', () => {
  const [b] = parseMarkdown('Hello <script>alert(1)</script> <img src=x onerror=alert(1)>');
  assert.equal(b.type, 'para');
  assert.deepEqual(b.inline, [{ t: 'text', text: 'Hello <script>alert(1)</script> <img src=x onerror=alert(1)>' }]);
});
test('fenced code is a code block with the raw text', () => {
  const blocks = parseMarkdown('Intro\n\n```js\nconst a = "<b>x</b>"; // **not bold**\n```\n\nAfter');
  assert.deepEqual(blocks[1], { type: 'code', text: 'const a = "<b>x</b>"; // **not bold**' });
  assert.equal(blocks.length, 3);
});
test('links keep an href only for http(s) and relative URLs', () => {
  const href = (md) => parseMarkdown(md)[0].inline.find((i) => i.t === 'link')?.href ?? null;
  assert.equal(href('[a](https://example.com/x)'), 'https://example.com/x');
  assert.equal(href('[a](docs/guide.md)'), 'docs/guide.md');
  assert.equal(href('[a](javascript:alert(1))'), null);
  assert.equal(href('[a](JaVaScRiPt:alert(1))'), null);
  assert.equal(href('[a](data:text/html,x)'), null);
  assert.equal(href('[a](//evil.example/x)'), null);
  assert.equal(href('[a](vbscript:x)'), null);
  const [b] = parseMarkdown('[click](javascript:alert(1))');
  assert.deepEqual(b.inline, [{ t: 'text', text: 'click' }]);
});
test('headings, lists, inline code and bold', () => {
  const blocks = parseMarkdown('---\nid: x\n---\n# Title\n\nUse `ls` and **care**.\n\n- one\n- two\n\n1. first\n2. second');
  assert.deepEqual(blocks[0], { type: 'heading', level: 1, text: 'Title' });
  assert.deepEqual(blocks[1].inline.map((i) => i.t), ['text', 'code', 'text', 'bold', 'text']);
  assert.equal(blocks[2].type, 'list');
  assert.equal(blocks[2].ordered, false);
  assert.equal(blocks[2].items.length, 2);
  assert.equal(blocks[3].ordered, true);
});
test('never returns a string of markup', () => {
  const walk = (v) => { if (typeof v === 'string') return; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  assert.doesNotThrow(() => walk(parseMarkdown('# <b>x</b>\n\n- <i>y</i>')));
  assert.equal(parseMarkdown('# <b>x</b>')[0].text, '<b>x</b>');
});
