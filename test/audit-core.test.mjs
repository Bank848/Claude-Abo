import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, ESTIMATE_ERROR, BIG_CLAUDEMD_TOKENS } from '../src/audit-core.mjs';
import { formatText } from '../src/report-text.mjs';

const inv = (over = {}) => ({
  source: 'node', claudeMd: [], skills: [], agents: [], plugins: [], mcpServers: [], hooks: [],
  permissions: { configGuard: false, defaultMode: null }, problems: [], usage: null, hookProbe: null, contextTokens: null,
  ...over,
});
const skill = (name, descTokens, over = {}) => ({ name, origin: 'user', descChars: descTokens * 4, descTokens, ...over });
const check = (r, id) => r.checks.find((c) => c.id === id);
const gitHook = { event: 'PreToolUse', bashMatcher: true, mentionsGit: true };

test('empty inventory produces zero tokens and no grade or score field', () => {
  const r = analyze(inv());
  assert.equal(r.totals.fixedTokens, 0);
  assert.ok(!('score' in r) && !('grade' in r));
});
test('report has no score or grade property anywhere', () => {
  assert.doesNotMatch(JSON.stringify(analyze(inv({ skills: [skill('a', 10)] }))), /"(score|grade)"/);
});
test('partial paste gives skip checks and skill tokens only', () => {
  const r = analyze(inv({ skills: [skill('a', 10)] }), null, { partial: true });
  assert.ok(r.checks.every((c) => c.status === 'skip'));
  assert.equal(r.totals.skillTokens, 10);
});
test('mcp servers add no tokens and are reported as a count', () => {
  const r = analyze(inv({ mcpServers: [{ name: 'a', scope: 'user' }] }));
  assert.equal(r.totals.fixedTokens, 0);
  assert.equal(r.totals.mcpServers, 1);
});
test('skillTokens equals uncapped when no cap is configured', () => {
  const r = analyze(inv({ skills: [skill('a', 10), skill('b', 5)] }));
  assert.equal(r.totals.skillTokens, 15);
  assert.equal(r.estimate.listingCapApplied, false);
});
test('with a cap set, skillTokens stops at the budget and listingCapApplied is true', () => {
  const r = analyze(inv({ skills: [skill('a', 10), skill('b', 10), skill('c', 10)] }), null, { listingCharBudget: 80 });
  assert.equal(r.totals.skillTokens, 20);
  assert.equal(r.totals.skillTokensUncapped, 30);
  assert.equal(r.estimate.listingCapApplied, true);
});
test('cuts below the cap boundary are marked as saving nothing', () => {
  const r = analyze(inv({ skills: [skill('a', 10), skill('b', 10), skill('c', 12)] }), null, { listingCharBudget: 80 });
  const c = r.cuts.find((x) => x.name === 'c');
  assert.equal(c.estTokens, 0);
  assert.match(c.reason, /saves nothing/);
});
test('estimate range uses ESTIMATE_ERROR', () => {
  const r = analyze(inv({ claudeMd: [{ label: 'x', chars: 0, tokens: 1000 }] }));
  assert.equal(r.estimate.low, Math.round(1000 * (1 - ESTIMATE_ERROR.low)));
  assert.equal(r.estimate.high, Math.round(1000 * (1 + ESTIMATE_ERROR.high)));
});
test('contextTokens echoes next to the estimate with a percent difference', () => {
  const r = analyze(inv({ claudeMd: [{ label: 'x', chars: 0, tokens: 1100 }] }), null, { contextTokens: 1000 });
  assert.equal(r.estimate.contextTokens, 1000);
  assert.match(formatText(r), /real \/context figure: 1,000 tokens \(estimate is \+10% off\)/);
});
test('PreToolUse hook with bashMatcher and mentionsGit is warn without a probe', () => {
  assert.equal(check(analyze(inv({ hooks: [gitHook] })), 'git-hook').status, 'warn');
});
test('hookProbe blocked > 0 gives pass', () => {
  assert.equal(check(analyze(inv({ hooks: [gitHook], hookProbe: { tested: 3, blocked: 3 } })), 'git-hook').status, 'pass');
});
test('hookProbe blocked 0 overrides the static match and fails', () => {
  assert.equal(check(analyze(inv({ hooks: [gitHook], hookProbe: { tested: 3, blocked: 0 } })), 'git-hook').status, 'fail');
});
test('hook that blocks the control command does not pass', () => {
  assert.equal(check(analyze(inv({ hooks: [gitHook], hookProbe: { tested: 3, blocked: 3, controlBlocked: true } })), 'git-hook').status, 'fail');
});
test('bashMatcher false does not count', () => {
  assert.equal(check(analyze(inv({ hooks: [{ ...gitHook, bashMatcher: false }] })), 'git-hook').status, 'fail');
});
test('PostToolUse hook does not count', () => {
  assert.equal(check(analyze(inv({ hooks: [{ ...gitHook, event: 'PostToolUse' }] })), 'git-hook').status, 'fail');
});
test('bypassPermissions warns', () => {
  assert.equal(check(analyze(inv({ permissions: { configGuard: false, defaultMode: 'bypassPermissions' } })), 'no-bypass').status, 'warn');
});
test('duplicate skill name across user and plugin warns', () => {
  const r = analyze(inv({ skills: [skill('same', 5), skill('same', 5, { origin: 'plugin:x@y' })] }));
  assert.equal(check(r, 'hygiene').status, 'warn');
});
test('cuts prefer zero-usage skills when usage present', () => {
  const r = analyze(inv({ skills: [skill('used', 50), skill('idle', 10)], usage: { windowDays: 30, sessionsScanned: 5, skillCalls: { used: 4 } } }));
  assert.deepEqual(r.cuts.filter((c) => c.kind === 'skill').map((c) => c.name), ['idle']);
});
test('cuts capped at 15', () => {
  const skills = Array.from({ length: 40 }, (_, i) => skill(`s${i}`, i + 1));
  const plugins = Array.from({ length: 20 }, (_, i) => ({ id: `p${i}@m`, enabled: true, skillCount: 1, mcpCount: 0 }));
  assert.equal(analyze(inv({ skills, plugins })).cuts.length, 15);
});
test('catalog marks known skills in the cut reason', () => {
  const r = analyze(inv({ skills: [skill('known', 10)] }), { skills: [{ name: 'known', status: 'experimental' }] });
  assert.match(r.cuts[0].reason, /catalog status: experimental/);
});
test('big CLAUDE.md produces a claudemd cut and a warn', () => {
  const r = analyze(inv({ claudeMd: [{ label: 'x', chars: 0, tokens: BIG_CLAUDEMD_TOKENS + 1 }] }));
  assert.equal(check(r, 'claudemd-size').status, 'warn');
  assert.ok(r.cuts.some((c) => c.kind === 'claudemd'));
});
test('formatText output has no absolute paths and fits 80 columns', () => {
  const r = analyze(inv({
    skills: [skill('x'.repeat(60), 30)], hooks: [gitHook], mcpServers: Array.from({ length: 6 }, (_, i) => ({ name: `m${i}`, scope: 'user' })),
    claudeMd: [{ label: 'user CLAUDE.md', chars: 0, tokens: 9000 }],
  }));
  const text = formatText(r);
  for (const line of text.split('\n')) assert.ok(line.length <= 80, `too long: ${line}`);
  assert.doesNotMatch(text, /[A-Za-z]:\\|\/Users\/|\/home\//);
});

test('a missing config folder is named in the hygiene check', () => {
  const r = analyze(inv({ problems: [{ where: 'config', message: 'no Claude Code config found' }] }));
  assert.match(check(r, 'hygiene').detail, /no Claude Code config found/);
  assert.doesNotMatch(check(r, 'hygiene').detail, /unreadable or invalid/);
});
test('an invalid file is counted separately from a missing config', () => {
  const r = analyze(inv({ problems: [{ where: 'user settings.json', message: 'invalid JSON' }] }));
  assert.match(check(r, 'hygiene').detail, /1 unreadable or invalid file/);
});
test('a description too short to match is flagged, a hidden skill is not', () => {
  const r = analyze(inv({ skills: [skill('tiny', 3, { descChars: 12 }), skill('ok', 30), skill('hidden', 0, { descChars: 5 })] }));
  assert.match(check(r, 'hygiene').detail, /1 skill description\(s\) under 40 characters/);
});
