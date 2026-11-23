// Compares the repo's global-config/ with a live ~/.claude. Read-only on both sides.
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const IGNORE_DIR = new Set(['__pycache__', 'node_modules', '.git']);
const IGNORE_FILE = new Set(['.DS_Store', 'Thumbs.db']);
const ignored = (name) => IGNORE_DIR.has(name) || IGNORE_FILE.has(name) || name.endsWith('.pyc');

const isBinary = (buf) => buf.includes(0);
const normalize = (buf) => (isBinary(buf) ? buf : Buffer.from(buf.toString('utf8').replace(/^﻿/, '').replace(/\r\n?/g, '\n')));

async function filesUnder(dir, rel = '') {
  const out = [];
  let entries = [];
  try { entries = await readdir(path.join(dir, rel), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (ignored(e.name)) continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await filesUnder(dir, r)));
    else if (e.isFile()) out.push(r);
  }
  return out.sort();
}

// sha256 over sorted relative path + normalized content; works for a file or a folder.
export async function hashEntry(p) {
  const h = createHash('sha256');
  let s;
  try { s = await stat(p); } catch { return null; }
  if (s.isFile()) {
    h.update(normalize(await readFile(p)));
    return h.digest('hex');
  }
  for (const rel of await filesUnder(p)) {
    h.update(rel).update('\0').update(normalize(await readFile(path.join(p, rel)))).update('\0');
  }
  return h.digest('hex');
}

async function entries(dir, { dirsOnly = false, ext = null } = {}) {
  const map = new Map();
  let list = [];
  try { list = await readdir(dir, { withFileTypes: true }); } catch { return map; }
  for (const e of list) {
    if (ignored(e.name)) continue;
    if (dirsOnly && !e.isDirectory()) continue;
    if (ext && !(e.isFile() && e.name.endsWith(ext))) continue;
    map.set(e.name, await hashEntry(path.join(dir, e.name)));
  }
  return map;
}

function compare(local, repo) {
  const out = { localOnly: [], repoOnly: [], changed: [], same: 0 };
  for (const [name, h] of local) {
    if (!repo.has(name)) out.localOnly.push(name);
    else if (repo.get(name) !== h) out.changed.push(name);
    else out.same++;
  }
  for (const name of repo.keys()) if (!local.has(name)) out.repoOnly.push(name);
  for (const k of ['localOnly', 'repoOnly', 'changed']) out[k].sort();
  return out;
}

async function size(file) {
  try { return (await stat(file)).size; } catch { return 0; }
}

export async function diffSetup({ repoRoot, home }) {
  const local = path.join(home, '.claude');
  const repo = path.join(repoRoot, 'global-config');
  const kinds = [
    ['skills', { dirsOnly: true }],
    ['hooks', {}],
    ['agents', { ext: '.md' }],
    ['tools', {}],
  ];
  const diff = {};
  const counts = {};
  for (const [kind, opts] of kinds) {
    const d = compare(await entries(path.join(local, kind), opts), await entries(path.join(repo, kind), opts));
    diff[kind] = d;
    counts[`${kind}LocalOnly`] = d.localOnly.length;
    counts[`${kind}RepoOnly`] = d.repoOnly.length;
    counts[`${kind}Changed`] = d.changed.length;
    counts[`${kind}Same`] = d.same;
  }
  let extra = [];
  try {
    extra = (await readdir(local)).filter((n) => /^CLAUDE-.+\.md$/.test(n)).sort();
  } catch { /* no local config */ }
  diff.claudeMd = { repoBytes: await size(path.join(repo, 'CLAUDE.md')), localBytes: await size(path.join(local, 'CLAUDE.md')), localExtraFiles: extra };
  diff.counts = counts;
  return diff;
}

export function formatSummary(d) {
  const lines = [];
  for (const k of ['skills', 'hooks', 'agents', 'tools']) {
    const x = d[k];
    lines.push(`${k}: ${x.localOnly.length} local-only, ${x.repoOnly.length} repo-only, ${x.changed.length} changed, ${x.same} same`);
  }
  lines.push(`CLAUDE.md: repo ${d.claudeMd.repoBytes} bytes, local ${d.claudeMd.localBytes} bytes, ${d.claudeMd.localExtraFiles.length} local sibling file(s)`);
  return `${lines.join('\n')}\n`;
}

export function formatReport(d) {
  const L = ['# Setup diff (private: names of local skills, hooks and tools; keep outside the repo)', '', '```', formatSummary(d).trimEnd(), '```', ''];
  for (const k of ['skills', 'hooks', 'agents', 'tools']) {
    for (const [title, list] of [['changed', d[k].changed], ['repo-only', d[k].repoOnly], ['local-only', d[k].localOnly]]) {
      L.push(`## ${k}: ${title} (${list.length})`, '', ...(list.length ? list.map((n) => `- ${n}`) : ['- none']), '');
    }
  }
  L.push('## CLAUDE.md siblings (local only)', '', ...(d.claudeMd.localExtraFiles.length ? d.claudeMd.localExtraFiles.map((n) => `- ${n}`) : ['- none']), '');
  return L.join('\n');
}
