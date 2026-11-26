// Generators for the README regions. Pure functions of the manifest (plus optional description tokens).
import { byText } from './order.mjs';
import { CATEGORIES } from '../manifest.mjs';

const TITLES = {
  engineering: 'Engineering', design: 'Design', marketing: 'Marketing', research: 'Research',
  writing: 'Writing', docs: 'Documents', meta: 'Meta (managing Claude Code itself)', security: 'Security',
};

export const bundled = (m) => m.skills.filter((s) => s.status !== 'pointer');
export const pointers = (m) => m.skills.filter((s) => s.status === 'pointer');

const originLabel = { 'self-authored': 'self-authored', wrapper: 'wrapper', adapted: 'adapted', adopted: 'adopted', vendor: 'vendor' };

export function skillsCount(m) {
  return String(bundled(m).length);
}

export function skillsBadge(m) {
  return `[![Skills](https://img.shields.io/badge/skills-${bundled(m).length}%20bundled-brightgreen)](#global-configskills)`;
}

export function skillsTable(m, tokens = {}) {
  const lines = [];
  const withTokens = Object.keys(tokens).length > 0;
  const rows = bundled(m).slice().sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || byText(a.name, b.name));
  for (const cat of CATEGORIES) {
    const list = rows.filter((s) => s.category === cat);
    if (!list.length) continue;
    lines.push(`**${TITLES[cat]} (${list.length})**`, '');
    lines.push(`| Skill | What it does | Origin | License | Status |${withTokens ? ' ~Tokens |' : ''}`);
    lines.push(`|---|---|---|---|---|${withTokens ? '---|' : ''}`);
    for (const s of list) {
      lines.push(`| \`${s.name}\` | ${s.summary} | ${originLabel[s.origin] ?? s.origin} | ${s.license.spdx} | ${s.status} |${withTokens ? ` ${tokens[s.name] ?? ''} |` : ''}`);
    }
    lines.push('');
  }
  const ptr = pointers(m);
  if (ptr.length) {
    lines.push(`**Not bundled, install from upstream (${ptr.length})**`, '');
    lines.push('| Skill | Upstream | Install |', '|---|---|---|');
    for (const s of ptr.slice().sort((a, b) => byText(a.name, b.name))) {
      const install = s.pointer.install.replace(/\|/g, '/');
      lines.push(`| \`${s.name}\` | [${s.upstream}](${s.pointer.url}) | ${install} |`);
    }
    lines.push('');
  }
  return lines.join('\n').replace(/\n+$/, '');
}
