// @browser-safe
// Pure analysis of an Inventory. No fs, no network, no clock. The CLI and the site both import it.
// There is no score and no grade: the headline is estimated tokens plus a cut list.

export const SKILL_LISTING_CHAR_BUDGET = null; // unverified default (see docs/audit-method.md); null = no cap modelled
export const ESTIMATE_ERROR = { low: 0.25, high: 0.25 }; // placeholder until Task 9 publishes the measured range
export const LONG_DESCRIPTION_CHARS = 1024;
export const BIG_CLAUDEMD_TOKENS = 8000;
export const DESC_CHAR_CAP = 1536;
export const MAX_CUTS = 15;

const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
const pct = (n) => `${n >= 0 ? '+' : ''}${Math.round(n)}%`;

export function analyze(inv, catalog = null, opts = {}) {
  const budget = opts.listingCharBudget !== undefined ? opts.listingCharBudget : SKILL_LISTING_CHAR_BUDGET;
  const err = opts.estimateError ?? ESTIMATE_ERROR;
  const partial = Boolean(opts.partial);
  const contextTokens = opts.contextTokens ?? inv.contextTokens ?? null;
  const catalogStatus = new Map((catalog?.skills ?? []).map((s) => [s.name, s.status]));

  // ---- tokens
  const claudeMdTokens = sum(inv.claudeMd, (c) => c.tokens);
  const skillTokensUncapped = sum(inv.skills, (s) => s.descTokens);
  const dropped = new Set();
  let skillTokens = skillTokensUncapped;
  if (typeof budget === 'number') {
    let used = 0;
    skillTokens = 0;
    inv.skills.forEach((s, i) => {
      const chars = Math.min(s.descChars, DESC_CHAR_CAP);
      if (s.descTokens > 0 && used + chars > budget) dropped.add(i);
      else { used += chars; skillTokens += s.descTokens; }
    });
  }
  const listingCapApplied = dropped.size > 0;
  const agentTokens = sum(inv.agents, (a) => a.descTokens);
  const fixedTokens = claudeMdTokens + skillTokens + agentTokens;
  const totals = {
    fixedTokens, claudeMdTokens, skillTokensUncapped, skillTokens, agentTokens,
    skills: inv.skills.length, mcpServers: inv.mcpServers.length,
  };
  const estimate = {
    low: Math.round(fixedTokens * (1 - err.low)), mid: fixedTokens, high: Math.round(fixedTokens * (1 + err.high)),
    listingCapApplied, contextTokens,
  };

  // ---- checklist
  const skip = (id, title) => ({ id, status: 'skip', title, detail: 'not visible in a pasted skill list' });
  let checks;
  if (partial) {
    checks = [skip('git-hook', 'Git push guard hook'), skip('config-guard', 'Config files guarded'),
      skip('no-bypass', 'Permission mode'), skip('hygiene', 'Hygiene'), skip('claudemd-size', 'CLAUDE.md size')];
  } else {
    checks = [];
    const staticGit = inv.hooks.some((h) => h.event === 'PreToolUse' && h.bashMatcher && h.mentionsGit);
    const probe = inv.hookProbe;
    if (probe && probe.controlBlocked) {
      checks.push({ id: 'git-hook', status: 'fail', title: 'Git push guard hook', detail: 'a user hook blocked the harmless control command too' });
    } else if (probe) {
      checks.push(probe.blocked > 0
        ? { id: 'git-hook', status: 'pass', title: 'Git push guard hook', detail: `blocked ${probe.blocked} of ${probe.tested} dangerous test commands` }
        : { id: 'git-hook', status: 'fail', title: 'Git push guard hook', detail: `none of ${probe.tested} dangerous test commands was blocked` });
    } else if (staticGit) {
      checks.push({ id: 'git-hook', status: 'warn', title: 'Git push guard hook', detail: 'a Bash hook that mentions git exists; run --probe-hooks to verify it blocks a force push' });
    } else {
      checks.push({ id: 'git-hook', status: 'fail', title: 'Git push guard hook', detail: 'no Bash hook that mentions git' });
    }
    checks.push(inv.permissions.configGuard
      ? { id: 'config-guard', status: 'pass', title: 'Config files guarded', detail: 'an ask/deny rule covers .claude or settings.json' }
      : { id: 'config-guard', status: 'warn', title: 'Config files guarded', detail: 'no ask/deny rule covers .claude/** or settings.json' });
    checks.push(inv.permissions.defaultMode === 'bypassPermissions'
      ? { id: 'no-bypass', status: 'warn', title: 'Permission mode', detail: 'default mode is bypassPermissions' }
      : { id: 'no-bypass', status: 'pass', title: 'Permission mode', detail: 'default mode does not bypass permissions' });
    const hyg = [];
    const byName = new Map();
    for (const s of inv.skills) byName.set(s.name, (byName.get(s.name) ?? new Set()).add(s.origin));
    const dups = [...byName].filter(([, o]) => o.size > 1).map(([n]) => n);
    if (dups.length) hyg.push(`${dups.length} skill name(s) exist in more than one place: ${dups.slice(0, 5).join(', ')}`);
    const long = inv.skills.filter((s) => s.descChars > LONG_DESCRIPTION_CHARS).length;
    if (long) hyg.push(`${long} skill description(s) longer than ${LONG_DESCRIPTION_CHARS} characters`);
    if (inv.problems.length) hyg.push(`${inv.problems.length} unreadable or invalid file(s)`);
    checks.push({ id: 'hygiene', status: hyg.length ? 'warn' : 'pass', title: 'Hygiene', detail: hyg.length ? hyg.join('; ') : 'no duplicates, long descriptions or unreadable files' });
    checks.push(claudeMdTokens > BIG_CLAUDEMD_TOKENS
      ? { id: 'claudemd-size', status: 'warn', title: 'CLAUDE.md size', detail: `about ${claudeMdTokens} tokens loaded every session (over ${BIG_CLAUDEMD_TOKENS})` }
      : { id: 'claudemd-size', status: 'pass', title: 'CLAUDE.md size', detail: `about ${claudeMdTokens} tokens` });
  }

  // ---- cuts
  const cuts = [];
  const tag = (name) => (catalogStatus.has(name) ? ` (catalog status: ${catalogStatus.get(name)})` : '');
  const indexed = inv.skills.map((s, i) => ({ s, i })).filter(({ s }) => s.descTokens > 0);
  const addSkillCut = ({ s, i }, reason) => {
    const past = dropped.has(i);
    cuts.push({ kind: 'skill', name: s.name, estTokens: past ? 0 : s.descTokens, reason: past ? 'already past the listing cap; cutting it saves nothing' : reason + tag(s.name) });
  };
  if (inv.usage) {
    const calls = inv.usage.skillCalls ?? {};
    indexed.filter(({ s }) => !calls[s.name]).sort((a, b) => b.s.descTokens - a.s.descTokens)
      .forEach((x) => addSkillCut(x, `no calls in the last ${inv.usage.windowDays} days`));
  } else {
    indexed.sort((a, b) => b.s.descTokens - a.s.descTokens).slice(0, 10)
      .forEach((x) => addSkillCut(x, 'largest description; check if you use it'));
  }
  const pluginTokens = new Map();
  for (const s of inv.skills) if (s.origin.startsWith('plugin:')) pluginTokens.set(s.origin.slice(7), (pluginTokens.get(s.origin.slice(7)) ?? 0) + s.descTokens);
  for (const p of inv.plugins.filter((x) => x.enabled)) {
    cuts.push({ kind: 'plugin', name: p.id, estTokens: pluginTokens.get(p.id) ?? 0, reason: `enabled plugin with ${p.skillCount} skill(s)` });
  }
  if (inv.mcpServers.length > 5) {
    cuts.push({ kind: 'mcp', name: `${inv.mcpServers.length} MCP servers`, estTokens: 0, reason: 'count only; measure tokens with /context' });
  }
  if (claudeMdTokens > BIG_CLAUDEMD_TOKENS) {
    cuts.push({ kind: 'claudemd', name: 'CLAUDE.md files', estTokens: claudeMdTokens, reason: 'split rarely-needed rules into a file read on demand' });
  }
  cuts.sort((a, b) => b.estTokens - a.estTokens);
  cuts.length = Math.min(cuts.length, MAX_CUTS);

  // ---- notes
  const notes = ['Token numbers are estimates (see docs/audit-method.md); run /context in Claude Code for exact numbers. To measure a saving, compare /context before and after; do not use these estimates for that.'];
  if (inv.mcpServers.length || inv.plugins.some((p) => p.mcpCount)) notes.push('MCP tool schemas and claude.ai connectors are not measured offline.');
  if (typeof budget !== 'number') notes.push('Skill listing cap not modelled (unverified); large skill sets may be overcounted.');
  if (inv.usage) {
    notes.push('Usage comes from transcripts that Claude Code prunes (cleanupPeriodDays), and skills typed as slash commands may not appear as Skill calls, so "0 calls" means "no record", not "never used".');
    if (inv.usage.partial) notes.push('The transcript scan hit its time budget; call counts are partial.');
  }
  if (inv.hookProbe?.skippedProject > 0) notes.push(`${inv.hookProbe.skippedProject} project-level hook(s) were not run by the probe.`);
  if (partial) notes.push('Partial input: only skill names were pasted, so checks are skipped.');

  return { totals, estimate, checks, cuts, notes };
}
