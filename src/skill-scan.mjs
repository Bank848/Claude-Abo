// Static security scan of a skill folder. Reads files as text, never executes anything.
import { lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BINARY_EXT = new Set(['.exe', '.dll', '.so', '.dylib', '.zip', '.7z', '.jar']);
const OK_HOSTS = ['github.com', 'githubusercontent.com', 'npmjs.com', 'pypi.org'];
const SIZE_LIMIT = 5 * 1024 * 1024;

const NET = /\b(?:curl|wget|fetch\s*\(|requests\.|urllib|http\.client|axios|Invoke-WebRequest|iwr\b|Invoke-RestMethod|XMLHttpRequest|nc\s+-)/i;
const CRED = /(?:~[/\\]\.ssh|\bid_rsa\b|\.aws[/\\]credentials|(?:cat|type|read|open|Get-Content|source|cp)\b[^\n]*\.env\b)/i;

const LINE_RULES = [
  { id: 'remote-exec', severity: 'error', re: /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/i },
  { id: 'remote-exec', severity: 'error', re: /\b(?:iwr|Invoke-WebRequest|Invoke-RestMethod)\b[^\n|]*\|\s*(?:iex|Invoke-Expression)\b/i },
  { id: 'remote-exec', severity: 'error', re: /\b(?:iex|Invoke-Expression)\b[^\n]*(?:DownloadString|Invoke-WebRequest|\biwr\b|\bcurl\b|\bwget\b)/i },
  { id: 'hidden-unicode', severity: 'error', re: /[​-‏‪-‮⁦-⁩\u{E0000}-\u{E007F}]/u },
  { id: 'prompt-override', severity: 'warn', re: /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions|do not tell the user|without asking the user/i },
  { id: 'prompt-override', severity: 'warn', re: /system prompt[^\n]*\breveal|\breveal[^\n]*system prompt/i },
  { id: 'hook-install', severity: 'warn', re: /settings\.json[^\n]*\bhooks\b|\bhooks\b[^\n]*settings\.json|~[/\\]\.claude[/\\]settings/i },
  { id: 'destructive', severity: 'warn', re: /\brm\s+-[a-z]*r[a-z]*f[a-z]*\s+(?:\/|~)(?:\s|$|\/\*)|\brm\s+-[a-z]*f[a-z]*r[a-z]*\s+(?:\/|~)(?:\s|$|\/\*)/ },
  { id: 'destructive', severity: 'warn', re: /Remove-Item\b[^\n]*-Recurse[^\n]*-Force[^\n]*(?:\$HOME|~|%USERPROFILE%|\$env:USERPROFILE)|Remove-Item\b[^\n]*(?:\$HOME|~|%USERPROFILE%|\$env:USERPROFILE)[^\n]*-Recurse/i },
  { id: 'destructive', severity: 'warn', re: /git\s+push\b[^\n]*--force/i },
  { id: 'blob', severity: 'warn', re: /[A-Za-z0-9+/]{400,}={0,2}/ },
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    yield path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(path.join(dir, e.name));
  }
}

function hostAllowed(host) {
  const h = host.toLowerCase();
  return OK_HOSTS.some((ok) => h === ok || h.endsWith(`.${ok}`)) || h === 'localhost';
}

export async function scanSkillDir(dir) {
  const findings = [];
  let total = 0;
  const add = (file, line, rule, severity, message) => findings.push({ file, line, rule, severity, message });
  for await (const full of walk(dir)) {
    const rel = path.relative(dir, full).split(path.sep).join('/');
    const st = await lstat(full);
    if (st.isSymbolicLink()) { add(rel, 1, 'symlink', 'error', 'symlink in skill folder'); continue; }
    if (!st.isFile()) continue;
    total += st.size;
    if (BINARY_EXT.has(path.extname(full).toLowerCase())) { add(rel, 1, 'binary', 'error', 'executable or archive file'); continue; }
    const buf = await readFile(full);
    if (buf.subarray(0, 8192).includes(0)) { add(rel, 1, 'binary', 'error', 'binary file'); continue; }
    const text = buf.toString('utf8');
    const lines = text.split(/\r?\n/);
    const fileHasNet = lines.some((l) => NET.test(l));
    lines.forEach((line, i) => {
      const seen = new Set();
      for (const r of LINE_RULES) {
        if (r.re.test(line) && !seen.has(r.id)) { seen.add(r.id); add(rel, i + 1, r.id, r.severity, `${r.id} pattern`); }
      }
      if (fileHasNet && CRED.test(line)) add(rel, i + 1, 'cred-read', 'error', 'reads credentials in a file that also makes network calls');
      const hosts = new Set();
      for (const m of line.matchAll(/https?:\/\/([A-Za-z0-9.-]+)/g)) if (!hostAllowed(m[1])) hosts.add(m[1]);
      if (hosts.size) add(rel, i + 1, 'network', 'warn', `other hosts: ${[...hosts].join(', ')}`);
    });
  }
  if (total > SIZE_LIMIT) add('.', 1, 'size', 'warn', `folder is ${(total / 1048576).toFixed(1)} MB (over 5 MB)`);
  return findings;
}
