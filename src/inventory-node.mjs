// Node-only collector: reads Claude Code config files and returns an Inventory.
// It reads config only (no network, no execution). No absolute path, hook command or
// permission string ever enters the returned Inventory; labels are short names.
import { readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';
import { estimateTokens } from './tokens.mjs';

// Docs (code.claude.com/docs/en/skills, memory): description + when_to_use is cut at 1536
// characters in the listing; @imports go at most 4 hops deep; auto-memory MEMORY.md loads
// its first 200 lines. See docs/audit-method.md.
export const DESC_CHAR_CAP = 1536;
export const IMPORT_MAX_HOPS = 4;
export const MEMORY_INDEX_LINES = 200;

const exists = async (p) => stat(p).then(() => true, () => false);
const isDir = async (p) => stat(p).then((s) => s.isDirectory(), () => false);

async function readText(file) {
  try {
    return (await readFile(file, 'utf8')).replace(/^﻿/, '');
  } catch {
    return null;
  }
}

async function mdFiles(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await mdFiles(p)));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

const norm = (p) => path.resolve(p).replace(/\\/g, '/').replace(/\/$/, '').toLowerCase();

export async function collectWithRaw(opts = {}) {
  const env = opts.env ?? process.env;
  const home = opts.home ?? os.homedir();
  const cwd = opts.cwd ?? process.cwd();
  const config = env.CLAUDE_CONFIG_DIR ? env.CLAUDE_CONFIG_DIR : path.join(home, '.claude');
  const statePath = env.CLAUDE_CONFIG_DIR ? path.join(config, '.claude.json') : path.join(home, '.claude.json');

  const inv = {
    source: 'node', claudeMd: [], skills: [], agents: [], plugins: [], mcpServers: [], hooks: [],
    permissions: { configGuard: false, defaultMode: null }, problems: [], usage: null, hookProbe: null,
    contextTokens: null,
  };
  const problem = (where, message) => inv.problems.push({ where, message });
  const rawHooks = [];

  async function readJson(file, label) {
    const text = await readText(file);
    if (text === null) return null;
    try {
      const v = JSON.parse(text);
      return v && typeof v === 'object' ? v : null;
    } catch {
      problem(label, 'invalid JSON');
      return null;
    }
  }

  const anyConfig = (await exists(config)) || (await exists(statePath));
  if (!anyConfig) problem('config', 'no Claude Code config found');

  // ---- settings (user, project, local merged in that order)
  const settingsFiles = [
    [path.join(config, 'settings.json'), 'user settings.json', true],
    [path.join(cwd, '.claude', 'settings.json'), 'project settings.json', false],
    [path.join(cwd, '.claude', 'settings.local.json'), 'local settings.json', false],
  ];
  const enabledPlugins = {};
  const askDeny = [];
  for (const [file, label, userLevel] of settingsFiles) {
    const s = await readJson(file, label);
    if (!s) continue;
    Object.assign(enabledPlugins, s.enabledPlugins ?? {});
    if (typeof s.permissions?.defaultMode === 'string') inv.permissions.defaultMode = s.permissions.defaultMode;
    for (const k of ['ask', 'deny']) if (Array.isArray(s.permissions?.[k])) askDeny.push(...s.permissions[k].filter((x) => typeof x === 'string'));
    for (const [event, groups] of Object.entries(s.hooks ?? {})) {
      for (const g of Array.isArray(groups) ? groups : []) {
        const matcher = typeof g?.matcher === 'string' ? g.matcher : '';
        let bashMatcher = false;
        if (event === 'PreToolUse' || event === 'PostToolUse') {
          if (matcher === '' || matcher === '*') bashMatcher = true;
          else {
            try { bashMatcher = new RegExp(`^(?:${matcher})$`).test('Bash'); } catch { bashMatcher = false; }
          }
        }
        for (const h of Array.isArray(g?.hooks) ? g.hooks : []) {
          const cmd = typeof h?.command === 'string' ? h.command : '';
          inv.hooks.push({ event, bashMatcher, mentionsGit: /git/i.test(cmd) });
          if (userLevel) rawHooks.push({ event, matcher, command: cmd });
        }
      }
    }
  }
  inv.permissions.configGuard = askDeny.some((p) => /\.claude|settings\.json/i.test(p));

  // ---- memory loaded every session
  const seen = new Set();
  async function addMemory(file, label, maxLines) {
    const key = norm(file);
    if (seen.has(key)) return null;
    let text = await readText(file);
    if (text === null) return null;
    seen.add(key);
    if (maxLines) text = text.split(/\r?\n/).slice(0, maxLines).join('\n');
    inv.claudeMd.push({ label, chars: text.length, tokens: estimateTokens(text) });
    return text;
  }
  async function followImports(text, fromFile, hop) {
    if (hop > IMPORT_MAX_HOPS) return;
    for (const m of text.matchAll(/(?:^|\s)@(~?[^\s@`'"()<>]+\.[A-Za-z0-9]+)/gm)) {
      const raw = m[1];
      const target = raw.startsWith('~/') ? path.join(home, raw.slice(2)) : path.resolve(path.dirname(fromFile), raw);
      const body = await addMemory(target, `import: ${path.basename(target)}`);
      if (body !== null) await followImports(body, target, hop + 1);
    }
  }
  const memFiles = [
    [path.join(config, 'CLAUDE.md'), 'user CLAUDE.md'],
    [path.join(cwd, 'CLAUDE.md'), 'project CLAUDE.md'],
    [path.join(cwd, '.claude', 'CLAUDE.md'), 'project .claude/CLAUDE.md'],
    [path.join(cwd, 'CLAUDE.local.md'), 'local CLAUDE.md'],
  ];
  for (const [file, label] of memFiles) {
    const body = await addMemory(file, label);
    if (body !== null) await followImports(body, file, 1);
  }
  for (const [dir, label] of [[path.join(config, 'rules'), 'user rules'], [path.join(cwd, '.claude', 'rules'), 'project rules']]) {
    for (const f of await mdFiles(dir)) {
      const body = await addMemory(f, `${label}/${path.relative(dir, f).split(path.sep).join('/')}`);
      if (body !== null) await followImports(body, f, 1);
    }
  }
  const projectKey = path.resolve(cwd).replace(/[^A-Za-z0-9]/g, '-');
  await addMemory(path.join(config, 'projects', projectKey, 'memory', 'MEMORY.md'), 'auto-memory index', MEMORY_INDEX_LINES);

  // ---- skills and agents
  async function collectSkills(dir, origin, dirLabel) {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return 0;
    }
    let n = 0;
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (!e.isDirectory()) continue;
      const text = await readText(path.join(dir, e.name, 'SKILL.md'));
      if (text === null) { problem(`${dirLabel}/${e.name}`, 'skill folder without SKILL.md'); continue; }
      const { data } = parseFrontmatter(text);
      const desc = `${data.description ?? ''} ${data.when_to_use ?? ''}`.trim();
      const hidden = String(data['disable-model-invocation'] ?? '').toLowerCase() === 'true';
      const shown = desc.slice(0, DESC_CHAR_CAP);
      inv.skills.push({ name: data.name || e.name, origin, descChars: desc.length, descTokens: hidden ? 0 : estimateTokens(shown) });
      n++;
    }
    return n;
  }
  await collectSkills(path.join(config, 'skills'), 'user', 'user skills');
  await collectSkills(path.join(cwd, '.claude', 'skills'), 'project', 'project skills');

  try {
    for (const e of await readdir(path.join(config, 'agents'), { withFileTypes: true })) {
      if (!e.isFile() || !e.name.endsWith('.md')) continue;
      const text = await readText(path.join(config, 'agents', e.name));
      const { data } = parseFrontmatter(text ?? '');
      inv.agents.push({ name: data.name || e.name.replace(/\.md$/, ''), origin: 'user', descTokens: estimateTokens(data.description ?? '') });
    }
  } catch { /* no agents folder */ }

  // ---- plugins (only the installPath listed in installed_plugins.json)
  const installed = await readJson(path.join(config, 'plugins', 'installed_plugins.json'), 'installed_plugins.json');
  for (const [id, entries] of Object.entries(installed?.plugins ?? {})) {
    const enabled = enabledPlugins[id] === true;
    const first = Array.isArray(entries) ? entries[0] : null;
    const installPath = typeof first?.installPath === 'string' ? first.installPath : null;
    let skillCount = 0;
    let mcpCount = 0;
    if (installPath && (await isDir(installPath))) {
      const before = inv.skills.length;
      await collectSkills(path.join(installPath, 'skills'), `plugin:${id}`, `plugin ${id}`);
      skillCount = inv.skills.length - before;
      if (!enabled) inv.skills.length = before; // listed, but not counted while disabled
      const mcp = await readJson(path.join(installPath, '.mcp.json'), `plugin ${id} .mcp.json`);
      const servers = mcp?.mcpServers ?? mcp ?? {};
      for (const name of Object.keys(servers)) {
        mcpCount++;
        if (enabled) inv.mcpServers.push({ name, scope: 'plugin' });
      }
    } else if (installPath) {
      problem(`plugin ${id}`, 'install folder not found');
    }
    inv.plugins.push({ id, enabled, skillCount, mcpCount });
  }

  // ---- MCP servers
  const state = await readJson(statePath, '.claude.json');
  for (const name of Object.keys(state?.mcpServers ?? {})) inv.mcpServers.push({ name, scope: 'user' });
  let disabled = [];
  for (const [p, proj] of Object.entries(state?.projects ?? {})) {
    if (norm(p) !== norm(cwd)) continue;
    for (const name of Object.keys(proj?.mcpServers ?? {})) inv.mcpServers.push({ name, scope: 'local' });
    disabled = Array.isArray(proj?.disabledMcpjsonServers) ? proj.disabledMcpjsonServers : [];
  }
  const projMcp = await readJson(path.join(cwd, '.mcp.json'), 'project .mcp.json');
  for (const name of Object.keys(projMcp?.mcpServers ?? {})) {
    if (!disabled.includes(name)) inv.mcpServers.push({ name, scope: 'project' });
  }

  return { inventory: inv, rawHooks };
}

export async function collectInventory(opts = {}) {
  return (await collectWithRaw(opts)).inventory;
}
