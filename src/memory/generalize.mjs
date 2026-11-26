// @browser-safe
// Replace identifiers in a memory note with placeholders. Only matched identifiers change;
// every other byte (including Thai text) is preserved.
import { RULES } from '../private-patterns.mjs';

const CATEGORY_PLACEHOLDER = {
  repo: '<PRIVATE_REPO>', person: '<COLLABORATOR>', team: '<TEAM>', account: '<ACCOUNT>', host: '<HOST>', email: '<EMAIL>', other: '<PRIVATE>',
};
const rule = (id) => RULES.find((r) => r.id === id);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Strip the Claude Code metadata block: originSessionId lines and metadata children other than `type`.
export function stripMetadata(text) {
  const m = /^(﻿?---[ \t]*\r?\n)([\s\S]*?)(\r?\n---[ \t]*(?:\r?\n|$))/.exec(text);
  if (!m) return text;
  const eol = m[2].includes('\r\n') ? '\r\n' : '\n';
  const out = [];
  let inMeta = false;
  for (const line of m[2].split(/\r?\n/)) {
    if (/^originSessionId:/.test(line)) continue;
    if (/^metadata:[ \t]*$/.test(line)) { inMeta = true; out.push(line); continue; }
    if (inMeta) {
      if (/^[ \t]+/.test(line)) { if (/^[ \t]+type:/.test(line)) out.push(line); continue; }
      inMeta = false;
    }
    out.push(line);
  }
  const cleaned = out.filter((l, i) => !(l === 'metadata:' && !/^[ \t]+type:/.test(out[i + 1] ?? '')));
  return m[1] + cleaned.join(eol) + m[3] + text.slice(m[0].length);
}

export function generalize(input, { privateList = [] } = {}) {
  let text = stripMetadata(String(input));
  const counts = new Map();
  const sub = (id, re, fn) => {
    text = text.replace(re, (...a) => {
      const matched = a[0];
      const except = rule(id)?.except;
      if (except && except(matched, text)) return matched;
      counts.set(id, (counts.get(id) ?? 0) + 1);
      return typeof fn === 'function' ? fn(matched) : fn;
    });
  };
  const fresh = (id) => new RegExp(rule(id).re.source, rule(id).re.flags);

  // GitHub URLs of private repos, then every private-list literal by category.
  const repos = privateList.filter((d) => d.category === 'repo').map((d) => d.literal).sort((a, b) => b.length - a.length);
  for (const r of repos) {
    sub('denylist', new RegExp(`https://github\\.com/[A-Za-z0-9_.-]+/${esc(r)}\\b`, 'gi'), 'https://github.com/<OWNER>/<PRIVATE_REPO>');
  }
  for (const d of [...privateList].sort((a, b) => b.literal.length - a.literal.length)) {
    if (!d.literal) continue;
    sub('denylist', new RegExp(esc(d.literal), 'gi'), CATEGORY_PLACEHOLDER[d.category] ?? '<PRIVATE>');
  }

  sub('ssh-target', fresh('ssh-target'), (m) => (/\s-i\s/.test(m) ? 'ssh -i ~/.ssh/<KEY> <USER>@<HOST>' : 'ssh <USER>@<HOST>'));
  sub('ssh-key-path', fresh('ssh-key-path'), '~/.ssh/<KEY>');
  sub('email', fresh('email'), '<EMAIL>');
  sub('ipv4', fresh('ipv4'), '<SERVER_IP>');
  sub('win-path', fresh('win-path'), (m) => {
    const home = /^[A-Za-z]:\\Users\\[^\\]+(\\.*)?$/i.exec(m);
    if (home) return `<YOUR_HOME>${home[1] ?? ''}`;
    const rest = m.replace(/^[A-Za-z]:\\[^\\]*/, '');
    return `<PROJECT_DIR>${rest}`;
  });
  sub('posix-home', fresh('posix-home'), '~');
  sub('uuid', fresh('uuid'), '<UUID>');

  return { text, replacements: [...counts].map(([r, count]) => ({ rule: r, count })) };
}
