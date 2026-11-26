// Pre-fills the local private-identifier list. Prints counts only, never a value.
import { execFileSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseDenylist } from '../private-patterns.mjs';

const GENERIC = new Set(['downloads', 'src', 'tmp', 'temp', 'desktop', 'documents', 'home', 'work', 'projects', 'code', 'app', 'test']);

function flag(argv, name) {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
}

function runGh(ghCmd, args) {
  try {
    return /\.m?js$/.test(ghCmd)
      ? execFileSync(process.execPath, [ghCmd, ...args], { encoding: 'utf8' })
      : execFileSync(ghCmd, args, { encoding: 'utf8' });
  } catch {
    return '';
  }
}

function privateRepoNames(ghCmd) {
  const names = [];
  const list = (args) => {
    try {
      for (const r of JSON.parse(runGh(ghCmd, args) || '[]')) if (r.name) names.push(r.name);
    } catch { /* ignore */ }
  };
  list(['repo', 'list', '--visibility', 'private', '--json', 'name', '--limit', '1000']);
  for (const org of runGh(ghCmd, ['api', 'user/orgs', '--jq', '.[].login']).split('\n').filter(Boolean)) {
    list(['repo', 'list', org, '--visibility', 'private', '--json', 'name', '--limit', '1000']);
  }
  return names;
}

async function projectFolderNames(configDir) {
  let dirs = [];
  try {
    dirs = (await readdir(path.join(configDir, 'projects'), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch { return []; }
  const out = [];
  for (const d of dirs) {
    // Claude Code encodes a project path by turning separators into "-": keep the part after the drive.
    const rest = d.replace(/^[A-Za-z]--/, '').replace(/^-+/, '');
    if (rest.length >= 4 && !GENERIC.has(rest.toLowerCase())) out.push(rest);
  }
  return out;
}

async function sshHosts(file) {
  let text = '';
  try { text = await readFile(file, 'utf8'); } catch { return []; }
  const hosts = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(?:Host|HostName)\s+(\S+)/i.exec(line);
    if (m && !/[*?!]/.test(m[1])) hosts.push(m[1]);
  }
  return hosts;
}

export default async function seedDenylist(argv) {
  const root = process.cwd();
  const out = path.resolve(root, flag(argv, '--out') ?? '.public-denylist.txt');
  const rel = path.relative(root, out);
  const inside = !rel.startsWith('..') && !path.isAbsolute(rel);
  if (inside && rel !== '.public-denylist.txt') {
    process.stderr.write('--out must be the gitignored .public-denylist.txt or a path outside the repo\n');
    return 2;
  }
  const home = os.homedir();
  const configDir = process.env.CLAUDE_CONFIG_DIR ?? path.join(home, '.claude');
  const candidates = [
    ...privateRepoNames(flag(argv, '--gh-cmd') ?? 'gh').map((l) => ['repo', l]),
    ...(await projectFolderNames(flag(argv, '--config-dir') ?? configDir)).map((l) => ['repo', l]),
    ...(await sshHosts(flag(argv, '--ssh-config') ?? path.join(home, '.ssh', 'config'))).map((l) => ['host', l]),
  ];
  let existing = '';
  try { existing = await readFile(out, 'utf8'); } catch { /* new file */ }
  const have = new Set(parseDenylist(existing).map((d) => d.literal.toLowerCase()));
  for (const m of existing.matchAll(/^# short-literal, not active: [a-z]+:(.+)$/gm)) have.add(m[1].trim().toLowerCase());
  const counts = {};
  let add = '';
  for (const [category, literal] of candidates) {
    if (have.has(literal.toLowerCase())) continue;
    have.add(literal.toLowerCase());
    if (literal.length < 6) {
      // Too short to match safely as a substring (it would hit ordinary words); the owner decides.
      add += `# short-literal, not active: ${category}:${literal}\n`;
      counts.short = (counts.short ?? 0) + 1;
      continue;
    }
    add += `${category}:${literal}\n`;
    counts[category] = (counts[category] ?? 0) + 1;
  }
  if (!existing) existing = '# Private identifiers, one per line as category:literal. Local only, never commit.\n# Categories: repo person team account host email other. Review and add what no tool can know.\n';
  else if (!existing.endsWith('\n')) existing += '\n';
  await writeFile(out, existing + add);
  const summary = Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(' ') || 'nothing new';
  process.stdout.write(`seed-denylist: added ${summary}\n`);
  return 0;
}
