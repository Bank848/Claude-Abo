// @browser-safe
// Plain-text report, 80 columns, no absolute paths (the Report never holds any).

const WIDTH = 80;
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function wrap(text, indent = '', first = indent) {
  const out = [];
  let line = first;
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const w = word.length > WIDTH - indent.length ? `${word.slice(0, WIDTH - indent.length - 3)}...` : word;
    const sep = line.trim() === '' ? '' : ' ';
    if (line.length + sep.length + w.length > WIDTH) {
      out.push(line);
      line = indent + w;
    } else line += sep + w;
  }
  out.push(line);
  return out;
}

export function formatText(report) {
  const { totals, estimate, checks, cuts, notes } = report;
  const lines = [];
  lines.push(`Estimated fixed context: ~${fmt(estimate.mid)} tokens per session`);
  lines.push(`  likely range ${fmt(estimate.low)} to ${fmt(estimate.high)} (an estimate, not a measurement)`);
  if (estimate.contextTokens != null) {
    const diff = ((estimate.mid - estimate.contextTokens) / estimate.contextTokens) * 100;
    lines.push(`  real /context figure: ${fmt(estimate.contextTokens)} tokens (estimate is ${diff >= 0 ? '+' : ''}${Math.round(diff)}% off)`);
  }
  lines.push('');
  lines.push(`  CLAUDE.md and memory   ${fmt(totals.claudeMdTokens)}`);
  lines.push(`  skills (${totals.skills})${' '.repeat(Math.max(1, 15 - String(totals.skills).length))}${fmt(totals.skillTokens)}${estimate.listingCapApplied ? ` (uncapped ${fmt(totals.skillTokensUncapped)})` : ''}`);
  lines.push(`  agents                 ${fmt(totals.agentTokens)}`);
  lines.push(`  MCP servers            ${totals.mcpServers} (not measured, run /context)`);
  lines.push('');
  lines.push('What to cut first');
  if (cuts.length === 0) lines.push('  nothing obvious');
  for (const c of cuts) {
    lines.push(...wrap(`${c.kind} ${c.name}: ~${fmt(c.estTokens)} tokens. ${c.reason}`, '      ', '  - '));
  }
  lines.push('');
  lines.push('Safety checklist');
  const mark = { pass: '[ok]  ', warn: '[warn]', fail: '[FAIL]', skip: '[skip]' };
  for (const c of checks) lines.push(...wrap(`${c.title}: ${c.detail}`, '         ', `  ${mark[c.status]} `));
  lines.push('');
  for (const n of notes) lines.push(...wrap(n, '  ', '* '));
  return lines.join('\n') + '\n';
}
