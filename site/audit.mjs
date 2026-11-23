// In-browser audit: paste skill names or an `audit --export` file, get an estimate. Nothing leaves the browser.
import { analyze } from './src/audit-core.mjs';
import { parsePasted } from './src/parse-pasted.mjs';

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const MARK = { pass: 'ok', warn: 'warn', fail: 'FAIL', skip: 'skip' };

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

function renderReport(report, parsed) {
  const box = el('div', null, 'audit-result');
  const { estimate: est, totals } = report;
  box.append(el('p', `Estimated fixed context: ~${fmt(est.mid)} tokens per session`, 'audit-head'));
  box.append(el('p', `Likely range ${fmt(est.low)} to ${fmt(est.high)}. This is an estimate, not a measurement.`, 'audit-sub'));
  if (est.contextTokens != null) {
    const diff = Math.round(((est.mid - est.contextTokens) / est.contextTokens) * 100);
    box.append(el('p', `Your /context total: ${fmt(est.contextTokens)} tokens (the estimate is ${diff >= 0 ? '+' : ''}${diff}% off).`, 'audit-sub'));
  }
  const dl = el('dl', null, 'audit-parts');
  const part = (k, v) => { dl.append(el('dt', k), el('dd', v)); };
  if (!parsed.partial) part('CLAUDE.md and memory', fmt(totals.claudeMdTokens));
  part(`Skills (${totals.skills})`, fmt(totals.skillTokens));
  if (!parsed.partial) { part('Agents', fmt(totals.agentTokens)); part('MCP servers', `${totals.mcpServers} (not measured)`); }
  box.append(dl);
  const unknown = parsed.inventory.skills.filter((s) => s.unknown).length;
  if (unknown) box.append(el('p', `${unknown} name(s) are not in the catalog and were counted at 120 tokens each.`, 'audit-sub'));

  box.append(el('h3', 'What to cut first'));
  if (report.cuts.length === 0) box.append(el('p', 'Nothing obvious.'));
  else {
    const ul = el('ul');
    for (const c of report.cuts) ul.append(el('li', `${c.kind} ${c.name}: ~${fmt(c.estTokens)} tokens. ${c.reason}`));
    box.append(ul);
  }

  box.append(el('h3', 'Safety checklist'));
  const ul = el('ul', null, 'audit-checks');
  for (const c of report.checks) {
    const li = el('li');
    li.append(el('strong', `[${MARK[c.status]}] `, `st-${c.status}`), document.createTextNode(`${c.title}: ${c.detail}`));
    ul.append(li);
  }
  box.append(ul);
  if (parsed.partial) box.append(el('p', 'A plain name list cannot show hooks or CLAUDE.md, so those checks were skipped. Run the audit command and paste its --export file for the full result.'));

  for (const n of [...parsed.notices, ...report.notes]) box.append(el('p', n, 'audit-note'));
  return box;
}

export function mount(sec, data) {
  const h = el('h2', 'Audit');
  h.id = 'audit-h';
  sec.append(h);
  sec.append(el('p', 'Find out roughly what your setup costs in context before you type anything. Nothing leaves your browser: the page makes no requests while it analyses, and its security policy blocks them.'));
  const how = el('ol');
  const a = el('li');
  a.append(document.createTextNode('Full result: run '), el('code', 'npx github:Bank848/Claude-Abo audit --export setup.json'), document.createTextNode(' and paste the file here. Names that are not in the public catalog are renamed first.'));
  how.append(a, el('li', 'Quick result: paste your skill names, one per line (for example the output of ls ~/.claude/skills).'));
  sec.append(how);

  const label = el('label', 'Your paste', 'audit-label');
  label.htmlFor = 'audit-input';
  const input = document.createElement('textarea');
  input.id = 'audit-input';
  input.rows = 8;
  input.spellcheck = false;
  input.autocomplete = 'off';
  const ctxLabel = el('label', 'Real /context total (optional)', 'audit-label');
  ctxLabel.htmlFor = 'audit-ctx';
  const ctx = document.createElement('input');
  ctx.id = 'audit-ctx';
  ctx.type = 'number';
  ctx.min = '1';
  ctx.inputMode = 'numeric';
  const btn = el('button', 'Analyze');
  btn.type = 'button';
  const out = el('div');
  out.setAttribute('aria-live', 'polite');

  btn.addEventListener('click', () => {
    out.replaceChildren();
    const parsed = parsePasted(input.value, data);
    if (parsed.error) { out.append(el('p', parsed.error, 'audit-error')); return; }
    const n = Number(ctx.value);
    const report = analyze(parsed.inventory, data, { partial: parsed.partial, contextTokens: Number.isFinite(n) && n > 0 ? n : null });
    out.append(renderReport(report, parsed));
  });

  const row = el('div', null, 'audit-row');
  row.append(ctxLabel, ctx, btn);
  sec.append(label, input, row, out);
}
