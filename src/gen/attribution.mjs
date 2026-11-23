// Generators for ATTRIBUTION.md and THIRD_PARTY_LICENSES.md regions.

const link = (repo) => `[\`${repo}\`](https://github.com/${repo})`;
const isMit = (u) => u.license === 'MIT';

export function upstreamsTable(m) {
  const rows = ['| Upstream repo | License (as adopted) | Skills taken |', '|---|---|---|'];
  for (const u of m.upstreams.slice().sort((a, b) => a.repo.toLowerCase().localeCompare(b.repo.toLowerCase()))) {
    const skills = m.skills.filter((s) => s.upstream === u.repo);
    const bundledSkills = skills.filter((s) => s.status !== 'pointer');
    const lic = bundledSkills.length === 0
      ? 'no licence at repo level; **not bundled**: listed as a pointer, install from the upstream repo'
      : u.license === 'NOASSERTION' ? 'no licence file; bundled only where the skill folder carries its own' : u.license;
    const names = skills.map((s) => `\`${s.name}\`${s.origin === 'adapted' ? ' (adapted)' : ''}`).join(', ');
    rows.push(`| ${link(u.repo)} | ${lic} | ${names} |`);
  }
  return rows.join('\n');
}

export function mitTable(m) {
  const rows = ['| Upstream | Copyright line from upstream LICENSE |', '|---|---|'];
  for (const u of m.upstreams.filter((x) => isMit(x) && x.copyright).sort((a, b) => a.repo.toLowerCase().localeCompare(b.repo.toLowerCase()))) {
    rows.push(`| ${link(u.repo)} | ${u.copyright} |`);
  }
  return rows.join('\n');
}

export function noLicenseList(m) {
  return m.upstreams.filter((u) => !isMit(u)).sort((a, b) => a.repo.toLowerCase().localeCompare(b.repo.toLowerCase())).map((u) => `- ${link(u.repo)}`).join('\n');
}
