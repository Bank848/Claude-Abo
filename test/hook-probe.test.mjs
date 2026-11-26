import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { collectWithRaw } from '../src/inventory-node.mjs';
import { probeHooks } from '../src/hook-probe.mjs';
import { makeHome, put } from './helpers/home.mjs';

const dir = mkdtempSync(path.join(tmpdir(), 'abo-hooks-'));
const node = (file) => `"${process.execPath}" "${path.join(dir, file)}"`;
put(dir, 'deny.mjs', 'process.stdout.write(JSON.stringify({hookSpecificOutput:{permissionDecision:"deny"}}));');
put(dir, 'exit2.mjs', 'process.exit(2);');
put(dir, 'allow.mjs', 'process.exit(0);');
put(dir, 'hang.mjs', 'setInterval(()=>{},1000);');
// Blocks only commands containing "git push".
put(dir, 'git.mjs', 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{process.exit(JSON.parse(d).tool_input.command.includes("git push")?2:0)});');
const pre = (command, matcher = 'Bash', event = 'PreToolUse') => ({ event, matcher, command });
const markerScript = (marker) => `import { writeFileSync } from 'node:fs'; writeFileSync(${JSON.stringify(marker)}, 'x');`;

test('deny output and exit 2 count as blocked', async () => {
  const r = await probeHooks([pre(node('deny.mjs')), pre(node('git.mjs'))]);
  assert.equal(r.tested, 2);
  assert.equal(r.blocked, 2);
  assert.equal(r.blocksEverything, true); // deny.mjs denies the control command too
});
test('a hook that blocks only git push is not flagged', async () => {
  const r = await probeHooks([pre(node('git.mjs'))]);
  assert.equal(r.blocked, 1);
  assert.equal(r.blocksEverything, false);
});
test('exit 2 on everything is flagged by the control command', async () => {
  const r = await probeHooks([pre(node('exit2.mjs'))]);
  assert.equal(r.blocksEverything, true);
});
test('allow does not count as blocked', async () => {
  const r = await probeHooks([pre(node('allow.mjs'))]);
  assert.equal(r.blocked, 0);
  assert.equal(r.blocksEverything, false);
});
test('a hanging hook is killed at timeoutMs and counted as not blocked', async () => {
  const t0 = Date.now();
  const r = await probeHooks([pre(node('hang.mjs'))], { timeoutMs: 300 });
  assert.equal(r.blocked, 0);
  assert.ok(Date.now() - t0 < 10_000);
});
test('only PreToolUse hooks with a Bash matcher are run', async () => {
  const marker = path.join(dir, 'ran-marker');
  put(dir, 'marker.mjs', markerScript(marker));
  const r = await probeHooks([pre(node('marker.mjs'), 'Bash', 'PostToolUse'), pre(node('marker.mjs'), 'Edit')]);
  assert.equal(r.tested, 0);
  assert.equal(existsSync(marker), false);
});
test('a project-level hook is never executed and is reported as skipped', async () => {
  const { home, cwd } = makeHome();
  const marker = path.join(dir, 'project-marker');
  put(dir, 'pm.mjs', markerScript(marker));
  put(cwd, '.claude/settings.json', JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: node('pm.mjs') }] }] } }));
  const { inventory, rawHooks } = await collectWithRaw({ home, cwd, env: {}, probeHooks: true });
  assert.equal(existsSync(marker), false);
  assert.equal(rawHooks.length, 0);
  assert.equal(inventory.hookProbe.skippedProject, 1);
});
