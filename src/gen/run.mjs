// Regenerates every generated region from catalog/skills.json. With check:true it writes nothing.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontmatter } from '../frontmatter.mjs';
import { loadManifest } from '../manifest.mjs';
import { hasRegion, replaceRegion } from '../markers.mjs';
import { estimateTokens } from '../tokens.mjs';
import { mitTable, noLicenseList, upstreamsTable } from './attribution.mjs';
import { skillsBadge, skillsCount, skillsTable } from './readme-table.mjs';
import { syncSources } from './sources.mjs';

const SOURCES = 'global-config/tools/skill-update-check/sources.json';
const README_TRANSLATIONS = ['de', 'es', 'fr', 'ja', 'ko', 'pt-BR', 'ru', 'th', 'zh-Hans'];

async function read(root, rel) {
  return readFile(path.join(root, rel), 'utf8');
}

async function descTokens(root, manifest) {
  const out = {};
  for (const s of manifest.skills) {
    if (!s.path) continue;
    try {
      const { data } = parseFrontmatter(await read(root, `${s.path}/SKILL.md`));
      out[s.name] = estimateTokens(`${data.description ?? ''} ${data.when_to_use ?? ''}`.trim());
    } catch { /* manifest check reports a missing SKILL.md */ }
  }
  return out;
}

// Inline count regions are optional: a README only needs the ones it carries.
function applyRegions(text, regions) {
  let out = text;
  for (const [name, content, required] of regions) {
    if (!required && !hasRegion(out, name)) continue;
    out = replaceRegion(out, name, content);
  }
  return out;
}

export async function runGen({ root, check = false } = {}) {
  const manifest = await loadManifest(path.join(root, 'catalog/skills.json'));
  const tokens = await descTokens(root, manifest);
  const count = skillsCount(manifest);
  const jobs = [];

  jobs.push(['README.md', (t) => applyRegions(t, [
    ['skills-table', skillsTable(manifest, tokens), true],
    ['skills-count-badge', skillsBadge(manifest), true],
    ['skills-count', count, false],
    ['skills-count-2', count, false],
    ['skills-count-3', count, false],
  ])]);
  jobs.push(['docs/guide.md', (t) => applyRegions(t, [
    ['skills-count', count, false],
    ['skills-count-3', count, false],
    ['skills-count-4', manifest.skills.length, false],
    ['skills-count-5', manifest.skills.length, false],
  ])]);
  for (const l of README_TRANSLATIONS) {
    jobs.push([`README.${l}.md`, (t) => applyRegions(t, [['skills-count-badge', skillsBadge(manifest), true], ['skills-count', count, false]])]);
  }
  jobs.push(['ATTRIBUTION.md', (t) => applyRegions(t, [['upstreams-table', upstreamsTable(manifest), true]])]);
  jobs.push(['THIRD_PARTY_LICENSES.md', (t) => applyRegions(t, [['mit-table', mitTable(manifest), true], ['no-license-list', noLicenseList(manifest), true]])]);
  jobs.push([SOURCES, (t) => syncSources(t, manifest)]);

  const changed = [];
  for (const [rel, fn] of jobs) {
    const before = await read(root, rel);
    const after = fn(before);
    if (after !== before) {
      changed.push(rel);
      if (!check) await writeFile(path.join(root, rel), after);
    }
  }
  return { changed };
}
