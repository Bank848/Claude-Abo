import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lessonList, routeFor } from '../site/learn.mjs';
import { renderBlocks } from '../site/dom-md.mjs';
import { parseMarkdown } from '../src/mini-md.mjs';

// A tiny fake DOM: enough to see which elements get created and what text they hold.
class Node_ { constructor(tag, text) { this.tag = tag; this.children = []; this.text = text ?? ''; }
  set textContent(v) { this.text = String(v); this.children = []; }
  get textContent() { return this.text + this.children.map((c) => c.textContent).join(''); }
  append(...n) { this.children.push(...n); } }
const doc = { createElement: (t) => new Node_(t), createTextNode: (t) => new Node_('#text', t) };
const all = (nodes) => nodes.flatMap((n) => [n, ...all(n.children)]);
const tags = (nodes) => all(nodes).map((n) => n.tag);

const L = [{ id: 'b', title: 'B', order: 2 }, { id: 'a', title: 'A', order: 1 }];

test('lesson list renders in order', () => {
  assert.deepEqual(lessonList(L).map((l) => l.id), ['a', 'b']);
  assert.deepEqual(lessonList(null), []);
});
test('unknown lesson id shows the list with a notice', () => {
  const r = routeFor('#learn/nope', L);
  assert.equal(r.id, null);
  assert.match(r.notice, /does not exist/);
  assert.deepEqual(routeFor('#learn/a', L), { id: 'a', notice: null });
  assert.deepEqual(routeFor('#learn', L), { id: null, notice: null });
  assert.equal(routeFor('#learn/../x', L).id, null);
});
test('script and img markup renders as visible text, no element is created from it', () => {
  const md = 'Hello <script>alert(1)</script> and <img src=x onerror=alert(1)>\n\n```\n<script>x</script>\n```\n\n- <b>one</b>\n';
  const nodes = renderBlocks(doc, parseMarkdown(md));
  const t = tags(nodes);
  for (const bad of ['script', 'img', 'b']) assert.ok(!t.includes(bad), bad);
  const text = nodes.map((n) => n.textContent).join('\n');
  assert.match(text, /<script>alert\(1\)<\/script>/);
  assert.match(text, /<img src=x onerror=alert\(1\)>/);
});
test('javascript: links become plain text, https links keep an href', () => {
  const nodes = renderBlocks(doc, parseMarkdown('[bad](javascript:alert(1)) and [ok](https://example.com/x)'));
  const links = all(nodes).filter((n) => n.tag === 'a');
  assert.equal(links.length, 1);
  assert.equal(links[0].href, 'https://example.com/x');
  assert.ok(nodes[0].textContent.includes('bad'));
});
test('headings start below the lesson title', () => {
  const nodes = renderBlocks(doc, parseMarkdown('## Why\n\ntext\n'));
  assert.equal(nodes[0].tag, 'h4');
});
test('no innerHTML in the learn page files', () => {
  for (const f of ['learn.mjs', 'dom-md.mjs']) {
    const t = readFileSync(fileURLToPath(new URL(`../site/${f}`, import.meta.url)), 'utf8');
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(/.test(t), f);
  }
});
