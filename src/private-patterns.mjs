// @browser-safe
// One rule table for "does this text leak something private?". Shared by public-scan
// and the memory pipeline. Each rule: { id, re (global), except?: (match, line) => boolean }.

const ZERO_UUID = /^0{8}-0{4}-0{4}-0{4}-0{12}$/;
const DOC_UUID = /^00000000-0000-4000-8000-[0-9a-f]{12}$/i;
const DOC_IP = /^(?:192\.0\.2|198\.51\.100|203\.0\.113)\.\d+$/;

export const RULES = [
  { id: 'win-path', re: /\b[A-Za-z]:\\(?!<)(?!Users\\<)[^\s"'`)]+/g },
  { id: 'posix-home', re: /\/(?:home|Users)\/(?!<)[A-Za-z0-9._-]+/g },
  {
    id: 'email',
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    except: (m) => /^noreply@/i.test(m) || /@example\./i.test(m) || /@users\.noreply\.github\.com$/i.test(m),
  },
  { id: 'gh-token', re: /\b(?:ghp|gho|ghu|ghs)_[A-Za-z0-9]{36}\b|github_pat_[A-Za-z0-9_]{22,}/g },
  { id: 'anthropic-key', re: /sk-ant-[A-Za-z0-9_-]{20,}/g },
  { id: 'openai-key', re: /\bsk-(?:proj-)?[A-Za-z0-9]{20,}/g },
  { id: 'aws-key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { id: 'slack-token', re: /xox[baprs]-[A-Za-z0-9-]{10,}/g },
  { id: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  {
    id: 'ipv4',
    re: /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g,
    except: (m) => m === '127.0.0.1' || m === '0.0.0.0' || DOC_IP.test(m),
  },
  { id: 'ssh-target', re: /\bssh\s+(?:-\S+\s+\S+\s+)*[A-Za-z0-9._-]+@[A-Za-z0-9.-]+/g },
  { id: 'ssh-key-path', re: /~?[/\\]\.ssh[/\\]id_[A-Za-z0-9_]+/g },
  {
    id: 'uuid',
    re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
    except: (m) => ZERO_UUID.test(m) || DOC_UUID.test(m),
  },
];

export const DENY_CATEGORIES = ['repo', 'person', 'team', 'account', 'host', 'email', 'other'];

// Parse "category:literal" lines. Comments (#) and blank lines are ignored; a line
// without a known category prefix is category "other".
export function parseDenylist(text) {
  const out = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf(':');
    const prefix = i > 0 ? line.slice(0, i) : '';
    if (DENY_CATEGORIES.includes(prefix) && line.slice(i + 1).trim()) {
      out.push({ category: prefix, literal: line.slice(i + 1).trim() });
    } else {
      out.push({ category: 'other', literal: line });
    }
  }
  return out;
}

// Never put the matched text in a message: rule, first two characters, length.
export function redact(rule, matched) {
  return `${rule}: ${Array.from(matched).slice(0, 2).join('')}… (${matched.length} chars)`;
}

// Find every match of every rule in one line. Returns [{rule, matched}].
export function matchLine(line, denylist = []) {
  const hits = [];
  for (const r of RULES) {
    r.re.lastIndex = 0;
    for (const m of line.matchAll(r.re)) {
      if (r.except && r.except(m[0], line)) continue;
      hits.push({ rule: r.id, matched: m[0] });
    }
  }
  const lower = line.toLowerCase();
  for (const d of denylist) {
    if (d.literal && lower.includes(d.literal.toLowerCase())) hits.push({ rule: 'denylist', matched: d.literal });
  }
  return hits;
}
