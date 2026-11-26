import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { analyze } from '../src/audit-core.mjs';
import { collectInventory } from '../src/inventory-node.mjs';
import { makeHome, put, skillMd } from './helpers/home.mjs';

test('audit of 600 skills and 50 plugins x 10 skills finishes under 30000 ms', async () => {
  const h = makeHome({ skills: [] });
  for (let i = 0; i < 600; i++) put(h.cfg, `skills/s${i}/SKILL.md`, skillMd(`s${i}`, `Skill number ${i} does a typical thing for the user`));
  const plugins = {};
  const enabled = {};
  for (let p = 0; p < 50; p++) {
    const ip = path.join(h.cfg, `plugins/cache/p${p}/v1`);
    for (let k = 0; k < 10; k++) put(ip, `skills/k${k}/SKILL.md`, skillMd(`p${p}k${k}`, 'plugin skill description text'));
    plugins[`p${p}@mk`] = [{ scope: 'user', installPath: ip }];
    enabled[`p${p}@mk`] = true;
  }
  put(h.cfg, 'plugins/installed_plugins.json', JSON.stringify({ version: 2, plugins }));
  put(h.cfg, 'settings.json', JSON.stringify({ enabledPlugins: enabled }));
  const t0 = Date.now();
  const inv = await collectInventory({ home: h.home, cwd: h.cwd, env: {} });
  analyze(inv, null);
  const ms = Date.now() - t0;
  console.log(`perf: ${inv.skills.length} skills in ${ms} ms`);
  assert.equal(inv.skills.length, 1100);
  assert.ok(ms < 30_000);
});
