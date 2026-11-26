import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { collectInventory, collectWithRaw } from '../src/inventory-node.mjs';

// Fixtures are built in a temp dir at test time (no absolute paths or hooks committed).
const put = (root, rel, text) => {
  mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  writeFileSync(path.join(root, rel), text);
};
const AT = '@';
const skillMd = (name, desc, extra = '') => `---\nname: ${name}\ndescription: ${desc}\n${extra}---\nbody\n`;

function basic() {
  const base = mkdtempSync(path.join(tmpdir(), 'abo-home-'));
  const home = path.join(base, 'home');
  const cwd = path.join(base, 'proj');
  mkdirSync(cwd, { recursive: true });
  const cfg = path.join(home, '.claude');
  put(cfg, 'CLAUDE.md', '# user\n' + 'x'.repeat(400));
  put(cfg, 'skills/alpha/SKILL.md', skillMd('alpha', 'Does alpha things'));
  put(cfg, 'skills/beta/SKILL.md', skillMd('beta', 'Does beta things'));
  const v1 = path.join(cfg, 'plugins/cache/p/v1.0.0');
  const v2 = path.join(cfg, 'plugins/cache/p/v1.1.0');
  put(v1, 'skills/old/SKILL.md', skillMd('old', 'old version skill'));
  put(v2, 'skills/new/SKILL.md', skillMd('new', 'new version skill'));
  put(v2, '.mcp.json', JSON.stringify({ mcpServers: { plugsrv: {} } }));
  const off = path.join(cfg, 'plugins/cache/q/v1');
  put(off, 'skills/hidden/SKILL.md', skillMd('hidden', 'disabled plugin skill'));
  put(cfg, 'plugins/installed_plugins.json', JSON.stringify({
    version: 2,
    plugins: { 'p@mk': [{ scope: 'user', installPath: v2, version: '1.1.0' }], 'q@mk': [{ scope: 'user', installPath: off }] },
  }));
  put(cfg, 'settings.json', JSON.stringify({
    enabledPlugins: { 'p@mk': true, 'q@mk': false },
    permissions: { defaultMode: 'default', ask: ['Edit(~/.claude/**)'] },
    hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'python guard-git.py --secret-token' }] }] },
  }));
  put(home, '.claude.json', JSON.stringify({ mcpServers: { usersrv: {} } }));
  put(cwd, '.mcp.json', JSON.stringify({ mcpServers: { projsrv: {} } }));
  return { base, home, cwd, cfg };
}

test('counts 2 user skills', async () => {
  const { home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.equal(inv.skills.filter((s) => s.origin === 'user').length, 2);
});
test('counts plugin skills from installPath only', async () => {
  const { home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  const names = inv.skills.filter((s) => s.origin.startsWith('plugin:')).map((s) => s.name);
  assert.deepEqual(names, ['new']);
});
test('ignores disabled plugin skills but lists the plugin', async () => {
  const { home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.ok(!inv.skills.some((s) => s.name === 'hidden'));
  const q = inv.plugins.find((p) => p.id === 'q@mk');
  assert.deepEqual([q.enabled, q.skillCount], [false, 1]);
});
test('reads user, project and plugin MCP servers', async () => {
  const { home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  const scopes = Object.fromEntries(inv.mcpServers.map((m) => [m.name, m.scope]));
  assert.deepEqual(scopes, { plugsrv: 'plugin', usersrv: 'user', projsrv: 'project' });
});
test('reads hooks and permissions', async () => {
  const { home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.deepEqual(inv.hooks, [{ event: 'PreToolUse', bashMatcher: true, mentionsGit: true }]);
  assert.deepEqual(inv.permissions, { configGuard: true, defaultMode: 'default' });
});
test('labels never contain the fixture absolute path', async () => {
  const { base, home, cwd } = basic();
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.ok(!JSON.stringify(inv).includes(path.basename(base)));
});
test('inventory never contains a hook command or permission string', async () => {
  const { home, cwd } = basic();
  const s = JSON.stringify(await collectInventory({ home, cwd, env: {} }));
  assert.ok(!s.includes('secret-token'));
  assert.ok(!s.includes('Edit(~'));
});
test('raw hook list for probing contains user-level hooks only', async () => {
  const { home, cwd } = basic();
  put(cwd, '.claude/settings.json', JSON.stringify({ hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ command: 'evil-project-hook' }] }] } }));
  const { inventory, rawHooks } = await collectWithRaw({ home, cwd, env: {} });
  assert.equal(inventory.hooks.length, 2);
  assert.equal(rawHooks.length, 1);
  assert.ok(!JSON.stringify(rawHooks).includes('evil-project-hook'));
});
test('settings.local.json hooks are merged', async () => {
  const { home, cwd } = basic();
  put(cwd, '.claude/settings.local.json', JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ command: 'x' }] }] } }));
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.ok(inv.hooks.some((h) => h.event === 'SessionStart' && !h.bashMatcher));
});
test('invalid settings.json becomes a problem, not a throw', async () => {
  const { home, cwd, cfg } = basic();
  put(cfg, 'settings.json', '{not json');
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.ok(inv.problems.some((p) => p.where === 'user settings.json'));
});
test('BOM-prefixed JSON parses', async () => {
  const { home, cwd, cfg } = basic();
  put(cfg, 'settings.json', '﻿' + JSON.stringify({ permissions: { defaultMode: 'plan' } }));
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.equal(inv.permissions.defaultMode, 'plan');
  assert.deepEqual(inv.problems, []);
});
test('skill dir without SKILL.md becomes a problem', async () => {
  const { home, cwd, cfg } = basic();
  mkdirSync(path.join(cfg, 'skills', 'empty'));
  const inv = await collectInventory({ home, cwd, env: {} });
  assert.ok(inv.problems.some((p) => p.where === 'user skills/empty'));
});
test('CLAUDE_CONFIG_DIR overrides home, including where .claude.json is read', async () => {
  const { base, home, cwd } = basic();
  const alt = path.join(base, 'alt');
  put(alt, 'skills/solo/SKILL.md', skillMd('solo', 'only skill'));
  put(alt, '.claude.json', JSON.stringify({ mcpServers: { altsrv: {} } }));
  const inv = await collectInventory({ home, cwd, env: { CLAUDE_CONFIG_DIR: alt } });
  assert.deepEqual(inv.skills.map((s) => s.name), ['solo']);
  assert.deepEqual(inv.mcpServers.filter((m) => m.scope === 'user').map((m) => m.name), ['altsrv']);
});
test('rules/*.md and CLAUDE.local.md are counted', async () => {
  const { home, cwd, cfg } = basic();
  put(cfg, 'rules/a.md', 'rule a');
  put(cwd, 'CLAUDE.local.md', 'local notes');
  put(cwd, '.claude/rules/b.md', 'rule b');
  const labels = (await collectInventory({ home, cwd, env: {} })).claudeMd.map((c) => c.label);
  for (const l of ['user rules/a.md', 'local CLAUDE.md', 'project rules/b.md']) assert.ok(labels.includes(l), l);
});
test('@import chain of 3 hops is followed, a cycle stops', async () => {
  const { home, cwd } = basic();
  put(cwd, 'CLAUDE.md', `start\n${AT}one.md\n`);
  put(cwd, 'one.md', `one\n${AT}two.md\n`);
  put(cwd, 'two.md', `two\n${AT}three.md\n`);
  put(cwd, 'three.md', `three\n${AT}one.md\n`);
  const labels = (await collectInventory({ home, cwd, env: {} })).claudeMd.map((c) => c.label);
  assert.deepEqual(labels.filter((l) => l.startsWith('import:')), ['import: one.md', 'import: two.md', 'import: three.md']);
});
test('disable-model-invocation skill costs 0', async () => {
  const { home, cwd, cfg } = basic();
  put(cfg, 'skills/quiet/SKILL.md', skillMd('quiet', 'never listed', 'disable-model-invocation: true\n'));
  const s = (await collectInventory({ home, cwd, env: {} })).skills.find((x) => x.name === 'quiet');
  assert.equal(s.descTokens, 0);
  assert.ok(s.descChars > 0);
});
test('empty home returns empty inventory with a no-config problem', async () => {
  const base = mkdtempSync(path.join(tmpdir(), 'abo-home-'));
  const inv = await collectInventory({ home: path.join(base, 'h'), cwd: path.join(base, 'c'), env: {} });
  assert.deepEqual(inv.skills, []);
  assert.deepEqual(inv.problems, [{ where: 'config', message: 'no Claude Code config found' }]);
});
