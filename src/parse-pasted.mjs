// @browser-safe
// Turns pasted text into an Inventory: either JSON from `audit --export` or a plain list of skill names.
// Pasted JSON is never trusted: only known fields are copied, into fresh objects.

export const MAX_BYTES = 1024 * 1024;
export const MAX_ITEMS = 5000;
export const MAX_NAME = 100;
export const UNKNOWN_DESC_TOKENS = 120;
export const TOO_BIG = 'Paste is over 1 MB; use audit --export instead.';
const LONG_NAME = 'Some names were longer than 100 characters and were cut.';

const num = (v, d = 0) => (Number.isFinite(v) && v >= 0 ? Math.min(Math.round(v), 10_000_000) : d);
const bool = (v) => v === true;
const str = (v, notices) => {
  const s = typeof v === 'string' ? v : '';
  if (s.length > MAX_NAME) { notices.add(LONG_NAME); return s.slice(0, MAX_NAME); }
  return s;
};
const list = (v, notices) => {
  if (!Array.isArray(v)) return [];
  if (v.length > MAX_ITEMS) { notices.add(`Lists were cut to the first ${MAX_ITEMS} entries.`); return v.slice(0, MAX_ITEMS); }
  return v;
};
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

function fromJson(raw, notices) {
  const r = rec(raw);
  if (!Array.isArray(r.skills)) return null;
  const perm = rec(r.permissions);
  const inv = {
    source: 'paste',
    claudeMd: list(r.claudeMd, notices).map((c) => ({ tokens: num(rec(c).tokens) })),
    skills: list(r.skills, notices).map((s) => {
      const o = rec(s);
      return { name: str(o.name, notices), origin: str(o.origin, notices) || 'paste', descChars: num(o.descChars), descTokens: num(o.descTokens) };
    }),
    agents: list(r.agents, notices).map((a) => ({ name: str(rec(a).name, notices), origin: 'paste', descTokens: num(rec(a).descTokens) })),
    plugins: list(r.plugins, notices).map((p) => {
      const o = rec(p);
      return { id: str(o.id, notices), enabled: bool(o.enabled), skillCount: num(o.skillCount), mcpCount: num(o.mcpCount) };
    }),
    mcpServers: list(r.mcpServers, notices).map((m) => ({ name: str(rec(m).name, notices) })),
    hooks: list(r.hooks, notices).map((h) => {
      const o = rec(h);
      return { event: str(o.event, notices), bashMatcher: bool(o.bashMatcher), mentionsGit: bool(o.mentionsGit) };
    }),
    permissions: { configGuard: bool(perm.configGuard), defaultMode: typeof perm.defaultMode === 'string' ? str(perm.defaultMode, notices) : null },
    problems: list(r.problems, notices).map((p) => ({ where: str(rec(p).where, notices), message: str(rec(p).message, notices) })),
    usage: null,
    hookProbe: null,
    contextTokens: r.contextTokens == null ? null : num(r.contextTokens, null),
  };
  if (r.usage && typeof r.usage === 'object') {
    const u = rec(r.usage);
    const calls = Object.create(null);
    for (const [k, v] of Object.entries(rec(u.skillCalls)).slice(0, MAX_ITEMS)) calls[k.slice(0, MAX_NAME)] = num(v);
    inv.usage = { windowDays: num(u.windowDays), sessionsScanned: num(u.sessionsScanned), skillCalls: calls, partial: bool(u.partial) };
  }
  if (r.hookProbe && typeof r.hookProbe === 'object') {
    const p = rec(r.hookProbe);
    inv.hookProbe = { tested: num(p.tested), blocked: num(p.blocked), blocksEverything: bool(p.blocksEverything), controlBlocked: bool(p.controlBlocked), skippedProject: num(p.skippedProject) };
  }
  return inv;
}

function fromList(text, catalog, notices) {
  const known = new Map();
  for (const s of catalog?.skills ?? []) if (typeof s.name === 'string' && Number.isFinite(s.descTokens)) known.set(s.name, s.descTokens);
  const seen = new Set();
  const skills = [];
  for (const line of text.split(/\r?\n/)) {
    const name = line.trim().replace(/^[-*+]\s+/, '').replace(/\/+$/, '').split(/\s+/)[0] ?? '';
    if (!name || seen.has(name) || !/^[\w.:@-]+$/.test(name)) continue;
    if (skills.length >= MAX_ITEMS) { notices.add(`The list was cut to the first ${MAX_ITEMS} names.`); break; }
    seen.add(name);
    if (name.length > MAX_NAME) notices.add(LONG_NAME);
    const shown = name.slice(0, MAX_NAME);
    if (known.has(name)) skills.push({ name: shown, origin: 'paste', descChars: known.get(name) * 4, descTokens: known.get(name) });
    else skills.push({ name: shown, origin: 'paste', descChars: UNKNOWN_DESC_TOKENS * 4, descTokens: UNKNOWN_DESC_TOKENS, unknown: true });
  }
  if (skills.length === 0) return null;
  return {
    source: 'paste', claudeMd: [], skills, agents: [], plugins: [], mcpServers: [], hooks: [],
    permissions: { configGuard: false, defaultMode: null }, problems: [], usage: null, hookProbe: null, contextTokens: null,
  };
}

// Returns {inventory, error, partial, notices}. partial = true for a plain list (hooks and CLAUDE.md are invisible).
export function parsePasted(text, catalog) {
  const fail = (error) => ({ inventory: null, error, partial: false, notices: [] });
  if (typeof text !== 'string' || text.trim() === '') return fail('Nothing was pasted. Paste the JSON from audit --export, or one skill name per line.');
  if (text.length > MAX_BYTES) return fail(TOO_BIG);
  if (text.includes('\u0000')) return fail('That looks like a binary file, not text.');
  const notices = new Set();
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let raw;
    try { raw = JSON.parse(trimmed); } catch { return fail('That looks like JSON but could not be read. Paste the file from audit --export unchanged.'); }
    const inventory = fromJson(raw, notices);
    if (!inventory) return fail('That JSON is not an audit export (no skills list). Run audit --export and paste its file.');
    return { inventory, error: null, partial: false, notices: [...notices] };
  }
  const inventory = fromList(text, catalog, notices);
  if (!inventory) return fail('No skill names found. Put one name per line, for example the output of ls ~/.claude/skills.');
  return { inventory, error: null, partial: true, notices: [...notices] };
}
