import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rank } from '../site/pick.mjs';

const skills = [
  { name: 'english-writing-anti-ai-tell', summary: 'Checklist that keeps English drafts from reading as AI-written.' },
  { name: 'markitdown', summary: 'Converts PDFs and slides into clean Markdown.' },
  { name: 'dependency-audit', summary: 'Checks project dependencies for known CVEs.' },
];

test('rank puts the best word overlap first', () => {
  assert.equal(rank('make my english draft stop reading as ai-written', skills)[0].name, 'english-writing-anti-ai-tell');
  assert.equal(rank('convert a pdf to markdown', skills)[0].name, 'markitdown');
});

test('rank returns nothing for empty or unrelated input', () => {
  assert.deepEqual(rank('', skills), []);
  assert.deepEqual(rank('zzz qqq', skills), []);
  assert.deepEqual(rank('anything', undefined), []);
});
