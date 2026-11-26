// Rewrites only the personal_skills array of sources.json (keeps BOM, CRLF, and every other block byte-identical).
import { byText } from './order.mjs';

const NOTE = ' personal_skills is generated from catalog/skills.json in the Claude-Abo repo; do not run -Ack here.';

// Index of the "]" that closes the array opening at `open`, skipping string contents.
function closeBracket(text, open) {
  let depth = 0;
  let inStr = false;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return i;
  }
  throw new Error('unbalanced personal_skills array');
}

export function syncSources(text, manifest) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const key = text.indexOf('"personal_skills"');
  if (key === -1) throw new Error('personal_skills missing');
  const open = text.indexOf('[', key);
  const close = closeBracket(text, open);
  const existing = new Map(JSON.parse(text.slice(open, close + 1)).map((e) => [e.name, e]));

  // Keep the file's existing order (stable diffs); new skills go last, alphabetically.
  const order = [...existing.keys()];
  const rank = (n) => (order.includes(n) ? order.indexOf(n) : order.length);
  const ordered = manifest.skills.slice().sort((a, b) => rank(a.name) - rank(b.name) || byText(a.name, b.name));
  const entries = ordered.map((s) => {
    const old = existing.get(s.name) ?? {};
    const upstream = s.upstream ? `https://github.com/${s.upstream}` : (old.source_repo_url === 'unknown' ? 'self-authored' : old.source_repo_url ?? 'self-authored');
    return {
      name: s.name,
      source_repo_url: s.upstream ? upstream : (upstream.startsWith('http') ? 'self-authored' : upstream),
      subpath_in_repo: s.source?.subpath ?? old.subpath_in_repo ?? '',
      last_seen_commit: s.source?.commit ?? (s.upstream ? old.last_seen_commit ?? 'unknown' : old.last_seen_commit ?? ''),
      note: s.source?.note ?? old.note ?? '',
    };
  });
  const body = entries.map((e) => `    ${JSON.stringify(e, null, 2).replace(/\n/g, `${eol}    `)}`).join(`,${eol}`);
  let out = `${text.slice(0, open)}[${eol}${body}${eol}  ]${text.slice(close + 1)}`;

  // _README must say the array is generated (once).
  const m = /^(\s*"_README": )("(?:[^"\\]|\\.)*")/m.exec(out);
  if (m) {
    const val = JSON.parse(m[2]);
    if (!val.includes('generated from catalog/skills.json')) out = out.replace(m[0], `${m[1]}${JSON.stringify(val + NOTE)}`);
  }
  return out;
}
