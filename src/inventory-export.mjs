// @browser-safe
// Makes an Inventory safe to paste: names that are not in the public catalog become skill-1, agent-1, ...
// Token counts are kept. Refuses (returns hits) if any leak rule still matches.
import { RULES } from './private-patterns.mjs';

export function exportInventory(inv, catalog = null) {
  const known = new Set((catalog?.skills ?? []).map((s) => s.name));
  const maps = { skill: new Map(), agent: new Map(), mcp: new Map(), plugin: new Map() };
  const alias = (kind, name) => {
    if (kind === 'skill' && known.has(name)) return name;
    const m = maps[kind];
    if (!m.has(name)) m.set(name, `${kind}-${m.size + 1}`);
    return m.get(name);
  };
  const out = {
    ...inv,
    source: 'paste',
    skills: inv.skills.map((s) => {
      const origin = s.origin.startsWith('plugin:') ? `plugin:${alias('plugin', s.origin.slice(7))}` : s.origin;
      return { ...s, name: alias('skill', s.name), origin };
    }),
    agents: inv.agents.map((a) => ({ ...a, name: alias('agent', a.name) })),
    mcpServers: inv.mcpServers.map((m) => ({ ...m, name: alias('mcp', m.name) })),
    plugins: inv.plugins.map((p) => ({ ...p, id: alias('plugin', p.id) })),
    problems: inv.problems.map((p) => ({ ...p, where: String(p.where).split(/[ /]/)[0] })),
    usage: inv.usage ? { ...inv.usage, skillCalls: Object.fromEntries(Object.entries(inv.usage.skillCalls ?? {}).map(([k, v]) => [alias('skill', k), v])) } : null,
  };
  const json = JSON.stringify(out);
  const hits = [];
  for (const r of RULES) {
    r.re.lastIndex = 0;
    for (const m of json.matchAll(r.re)) {
      if (r.except && r.except(m[0], json)) continue;
      if (!hits.includes(r.id)) hits.push(r.id);
    }
  }
  return { inventory: out, hits };
}
