import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '../src/frontmatter.mjs';
import { RULES } from '../src/private-patterns.mjs';
import { gate } from '../src/memory/gate.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = path.join(ROOT, 'learn/lessons');
const files = readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();
const lessons = files.map((f) => {
  const text = readFileSync(path.join(DIR, f), 'utf8').split('\r\n').join('\n');
  return { f, text, ...parseFrontmatter(text) };
});
const usesOf = (l) => {
  const block = /\nuses:\n((?:[ \t]+-[ \t]+\S+\n)+)/.exec(l.text);
  return block ? [...block[1].matchAll(/-[ \t]+(\S+)/g)].map((m) => m[1]) : [];
};

test('there are five lessons', () => assert.equal(lessons.length, 5));
test('every lesson has the required frontmatter and four sections', () => {
  for (const l of lessons) {
    for (const k of ['id', 'title', 'order', 'minutes']) assert.ok(l.data[k], `${l.f} missing ${k}`);
    assert.equal(l.data.id, l.f.replace(/\.md$/, ''), `${l.f} id must match the file name`);
    assert.ok(usesOf(l).length > 0, `${l.f} missing uses`);
    for (const s of ['## Why', '## How the owner does it', '## Try it', '## Check']) assert.ok(l.body.includes(`\n${s}\n`), `${l.f} missing ${s}`);
  }
});
test('every path in uses exists', () => {
  for (const l of lessons) for (const p of usesOf(l)) assert.ok(existsSync(path.join(ROOT, p)), `${l.f} uses ${p}`);
});
test('orders are unique and contiguous', () => {
  assert.deepEqual(lessons.map((l) => Number(l.data.order)), [1, 2, 3, 4, 5]);
});
test('lessons pass the memory gate and the leak rules', () => {
  assert.deepEqual(gate({ files: lessons.map((l) => ({ file: `learn/lessons/${l.f}`, text: l.text })) }), []);
  for (const l of lessons) {
    for (const r of RULES) {
      r.re.lastIndex = 0;
      for (const m of l.text.matchAll(r.re)) assert.ok(r.except?.(m[0], l.text), `${l.f} matches ${r.id}`);
    }
  }
});
