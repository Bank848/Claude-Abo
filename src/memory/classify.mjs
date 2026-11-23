// Suggests a verdict per memory note. Suggestion only: it never reads or writes outside the notes it is given.
import { similarity } from './similar.mjs';
import { generalize } from './generalize.mjs';

const DAY = 86_400_000;
const MERGE_SIMILARITY = 0.45;
const STALE_DAYS = 180;
const ENTANGLED = 5;
const DATE_SUFFIX = /-\d{4}-\d{2}-\d{2}$/;

function dates(text) {
  return [...text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)].map((m) => Date.UTC(+m[1], +m[2] - 1, +m[3])).filter((t) => !Number.isNaN(t));
}

export function classify(notes, { privateList = [], now = new Date() } = {}) {
  const t0 = now.getTime();
  const results = [];
  for (const missing of notes.indexMissing ?? []) {
    results.push({ file: 'MEMORY.md', verdict: 'stale', reasons: [`index line points to a missing file: ${missing}`] });
  }
  const inbound = new Set(notes.flatMap((n) => n.links));
  for (const n of notes) {
    const stale = [];
    const merge = [];
    const priv = [];
    if (!n.indexed && !inbound.has(n.file)) stale.push('not listed in MEMORY.md and nothing links to it');
    if (/(superseded|deprecated|no longer)/i.test(n.body) && (/(replaced by|superseded by|instead|see )/i.test(n.body) || n.links.length || /\[\[/.test(n.body))) {
      stale.push('says it is superseded or deprecated and names a replacement');
    }
    const ds = dates(n.raw);
    if (n.type === 'project' && ds.length && ds.every((t) => t0 - t > STALE_DAYS * DAY)) stale.push(`type project and every date is older than ${STALE_DAYS} days`);

    const partners = [];
    for (const o of notes) {
      if (o === n) continue;
      const sameStem = DATE_SUFFIX.test(n.name) && DATE_SUFFIX.test(o.name) && n.name.replace(DATE_SUFFIX, '') === o.name.replace(DATE_SUFFIX, '') && n.name.replace(DATE_SUFFIX, '') !== '';
      const sim = similarity(n.body, o.body);
      if (sameStem) { partners.push(o.file); merge.push(`same name prefix as ${o.file}`); } else if (sim >= MERGE_SIMILARITY) { partners.push(o.file); merge.push(`similarity ${sim.toFixed(2)} with ${o.file}`); }
    }

    if (n.type === 'project' || n.type === 'user') priv.push(`type ${n.type} is about the owner or one project`);
    const g = generalize(n.raw, { privateList });
    const heavy = g.replacements.filter((r) => ['denylist', 'ipv4', 'ssh-target', 'email'].includes(r.rule)).reduce((a, r) => a + r.count, 0);
    if (heavy > ENTANGLED) priv.push(`${heavy} identifiers would need replacing; too entangled to share`);

    let verdict = 'shareable-as-example';
    let reasons = ['general habit, nothing private after generalizing'];
    if (stale.length) { verdict = 'stale'; reasons = stale; } else if (merge.length) { verdict = 'merge'; reasons = merge; } else if (priv.length) { verdict = 'keep-private'; reasons = priv; }
    const extra = [...stale, ...merge, ...priv].filter((r) => !reasons.includes(r));
    const c = { file: n.file, verdict, reasons: [...reasons, ...extra.map((r) => `also: ${r}`)] };
    if (verdict === 'merge') c.mergeWith = partners;
    results.push(c);
  }
  return results;
}

export function formatClassification(list) {
  const lines = ['# Memory classification (suggestions only, private: keep outside the repo)', '', '| file | verdict | reasons |', '|---|---|---|'];
  for (const c of list) lines.push(`| ${c.file} | ${c.verdict} | ${c.reasons.join('; ').replace(/\|/g, '/')} |`);
  return `${lines.join('\n')}\n`;
}
