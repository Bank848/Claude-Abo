import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { analyze } from '../src/audit-core.mjs';
import { exportInventory } from '../src/inventory-export.mjs';
import { collectInventory } from '../src/inventory-node.mjs';
import { makeHome, put } from './helpers/home.mjs';

const BIN = fileURLToPath(new URL('../bin/claude-abo.mjs', import.meta.url));
const NO_NET = pathToFileURL(fileURLToPath(new URL('./helpers/no-net.mjs', import.meta.url))).href;
const audit = (h, args = [], env = {}) => spawnSync(process.execPath, [BIN, 'audit', '--home', h.home, '--cwd', h.cwd, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
const emptyInv = (over) => ({ source: 'node', skills: [], agents: [], plugins: [], mcpServers: [], hooks: [], problems: [], usage: null, ...over });

test('prints the headline, the MCP not-measured line, and no score or grade', () => {
  const r = audit(makeHome());
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Estimated fixed context: ~\d[\d,]* tokens per session/);
  assert.match(r.stdout, /likely range [\d,]+ to [\d,]+/);
  assert.match(r.stdout, /MCP servers .*not measured/);
  assert.doesNotMatch(r.stdout, /\bscore\b|\bgrade\b/i);
});
test('--context-tokens prints the real figure and the percent difference', () => {
  assert.match(audit(makeHome(), ['--context-tokens', '1000']).stdout, /real \/context figure: 1,000 tokens \(estimate is [+-]?\d+% off\)/);
});
test('--json is valid JSON with Report keys', () => {
  const j = JSON.parse(audit(makeHome(), ['--json']).stdout);
  for (const k of ['totals', 'estimate', 'checks', 'cuts', 'notes']) assert.ok(k in j, k);
});
test('--export renames non-catalog skills and keeps token counts', () => {
  const h = makeHome({ skills: ['zz-private-one', 'zz-private-two'] });
  const out = path.join(mkdtempSync(path.join(tmpdir(), 'abo-exp-')), 'inv.json');
  const r = audit(h, ['--export', out]);
  assert.equal(r.status, 0, r.stderr);
  const text = readFileSync(out, 'utf8');
  assert.ok(!text.includes('zz-private'));
  const inv = JSON.parse(text);
  assert.equal(inv.source, 'paste');
  assert.deepEqual(inv.skills.map((s) => s.name), ['skill-1', 'skill-2']);
  assert.ok(inv.skills.every((s) => s.descTokens > 0));
});
test('export refuses when a leak rule still matches', () => {
  const leak = ['bob', 'corp.org'].join('@');
  const { hits } = exportInventory(emptyInv({ extra: leak }), null);
  assert.ok(hits.includes('email'));
});
test('an exported inventory gives the same totals and cut sizes as the direct run', async () => {
  const h = makeHome({ skills: ['zz-a', 'zz-b', 'zz-c'] });
  const inv = await collectInventory({ home: h.home, cwd: h.cwd, env: {} });
  const direct = analyze(inv, null);
  const viaExport = analyze(exportInventory(inv, null).inventory, null);
  assert.deepEqual(viaExport.totals, direct.totals);
  assert.deepEqual(viaExport.cuts.map((c) => c.estTokens), direct.cuts.map((c) => c.estTokens));
});
test('never opens a socket', () => {
  const r = audit(makeHome(), [], { NODE_OPTIONS: `--import ${NO_NET}` });
  assert.equal(r.status, 0, r.stderr);
});
test('--usage adds the no-record note', () => {
  const h = makeHome();
  put(h.cfg, 'projects/p/s.jsonl', '{"name":"Skill","skill":"alpha"}\n');
  assert.match(audit(h, ['--usage']).stdout, /no record/);
});
test('--probe-hooks passes a real force-push blocker', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'abo-gh-'));
  put(dir, 'g.mjs', 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{process.exit(JSON.parse(d).tool_input.command.includes("git push")?2:0)});');
  const h = makeHome({ hookCommand: `"${process.execPath}" "${path.join(dir, 'g.mjs')}" git` });
  const j = JSON.parse(audit(h, ['--probe-hooks', '--json']).stdout);
  assert.equal(j.checks.find((c) => c.id === 'git-hook').status, 'pass');
});
test('invalid flag values exit 1', () => {
  assert.equal(audit(makeHome(), ['--days', '-3']).status, 1);
});
