import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { scanUsage } from '../src/usage-scan.mjs';
import { put } from './helpers/home.mjs';

const call = (skill) => `${JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill } }] } })}\n`;
function projects() {
  const dir = mkdtempSync(path.join(tmpdir(), 'abo-usage-'));
  put(dir, 'p1/a.jsonl', `${call('alpha')}${call('alpha')}${call('beta')}{"type":"user","message":"hello"}\n`);
  put(dir, 'p1/old.jsonl', call('gamma'));
  const old = new Date(Date.now() - 90 * 86_400_000);
  utimesSync(path.join(dir, 'p1/old.jsonl'), old, old);
  return dir;
}

test('counts Skill tool calls by skill name', async () => {
  const r = await scanUsage(projects(), { days: 30 });
  assert.deepEqual(r.skillCalls, { alpha: 2, beta: 1 });
  assert.equal(r.windowDays, 30);
});
test('ignores files older than the window', async () => {
  const r = await scanUsage(projects(), { days: 30 });
  assert.equal(r.skillCalls.gamma, undefined);
  assert.equal(r.sessionsScanned, 1);
});
test('stops at budgetMs and reports a partial count', async () => {
  const r = await scanUsage(projects(), { days: 30, budgetMs: 0 });
  assert.equal(r.partial, true);
  assert.equal(r.sessionsScanned, 0);
});
test('a missing projects folder gives an empty result', async () => {
  const r = await scanUsage(path.join(tmpdir(), 'abo-nope-dir'), {});
  assert.deepEqual(r.skillCalls, {});
});
test('message text is never kept', async () => {
  assert.ok(!JSON.stringify(await scanUsage(projects(), {})).includes('hello'));
});
