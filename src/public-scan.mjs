// Leak scanner for a public repo. Findings never contain the matched text.
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { matchLine, parseDenylist, redact } from './private-patterns.mjs';

// The allow file lists example strings on purpose, so it is exempt from the shape rules
// (paths, emails, ...) but not from tokens or the denylist.
const SELF_EXEMPT = new Set(['win-path', 'posix-home', 'email', 'ipv4', 'uuid', 'ssh-target', 'ssh-key-path']);

export async function loadDenylist(file) {
  return parseDenylist(await readFile(file, 'utf8'));
}

export function isTextBuffer(buf) {
  return !buf.subarray(0, 8192).includes(0);
}

// opts: { denylist: DenyEntry[], allow: AllowEntry[], used?: Set<AllowEntry> }
export function scanText(relPath, text, opts = {}) {
  const { denylist = [], allow = [], used } = opts;
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const h of matchLine(line, denylist)) {
      if (relPath === '.public-allow.json' && SELF_EXEMPT.has(h.rule)) continue;
      const entry = allow.find((a) => a.file === relPath && a.rule === h.rule && h.matched.includes(a.match));
      if (entry) {
        used?.add(entry);
        continue;
      }
      findings.push({ file: relPath, line: idx + 1, rule: h.rule, severity: 'error', message: redact(h.rule, h.matched) });
    }
  });
  return findings;
}

export function staleAllowFindings(allow, used) {
  return allow
    .filter((a) => !used.has(a))
    .map((a) => ({
      file: '.public-allow.json', line: 1, rule: 'stale-allow', severity: 'warn',
      message: `allow entry for ${a.file} (${a.rule}) matched nothing${a.reason ? `: ${a.reason}` : ''}`,
    }));
}

const git = (root, args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024 });

// Scan added lines of every commit, every commit message, tag messages and author/committer identity.
export function scanHistory(root, opts = {}) {
  const findings = [];
  const push = (label, line, text) => {
    for (const f of scanText(label.file, text, opts)) findings.push({ ...f, file: `${label.hash}:${label.file}`, line });
  };
  const M = '@@COMMIT@@';
  const D = '@@DIFF@@';
  const out = git(root, ['log', '--all', '-p', '--no-color', '--no-ext-diff', `--format=${M}%h%n%an <%ae>%n%cn <%ce>%n%B%n${D}`]);
  let hash = '';
  let state = 'idle';
  let meta = 0;
  let file = '';
  let newLine = 0;
  for (const line of out.split('\n')) {
    if (line.startsWith(M)) { hash = line.slice(M.length); state = 'meta'; meta = 0; continue; }
    if (state === 'meta') {
      if (line === D) { state = 'diff'; continue; }
      const label = meta === 0 ? '(author)' : meta === 1 ? '(committer)' : '(message)';
      push({ hash, file: label }, 1, line);
      meta++;
      continue;
    }
    if (state !== 'diff') continue;
    if (line.startsWith('diff --git ')) { file = line.split(' b/').at(-1) ?? ''; continue; }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(line);
    if (hunk) { newLine = Number(hunk[1]); continue; }
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) { push({ hash, file }, newLine, line.slice(1)); newLine++; }
    else if (!line.startsWith('-') && !line.startsWith('\\')) newLine++;
  }
  const tags = git(root, ['for-each-ref', 'refs/tags', '--format=%(refname:short)%00%(contents)%00%(taggername) %(taggeremail)']);
  for (const rec of tags.split('\n').filter(Boolean)) {
    const [name, contents = '', tagger = ''] = rec.split('\0');
    push({ hash: `tag:${name}`, file: '(tag)' }, 1, `${contents} ${tagger}`);
  }
  return findings;
}
