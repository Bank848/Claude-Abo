// Manifest loader and validator. validateManifest is pure (no fs).
import { readFile } from 'node:fs/promises';

export const CATEGORIES = ['engineering', 'design', 'marketing', 'research', 'writing', 'docs', 'meta', 'security'];
export const ORIGINS = ['self-authored', 'wrapper', 'adapted', 'adopted', 'vendor'];
export const REDISTRIBUTION = ['self', 'allowed', 'permission-granted', 'not-bundled'];
export const STATUSES = ['stable', 'experimental', 'workflow-specific', 'pointer', 'deprecated'];

export async function loadManifest(file) {
  const text = (await readFile(file, 'utf8')).replace(/^﻿/, '');
  return JSON.parse(text);
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REPO = /^[\w.-]+\/[\w.-]+$/;
const NAME = /^[a-z0-9][a-z0-9-]*$/;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function validateManifest(m, skillDirs = []) {
  const out = [];
  const err = (rule, message, severity = 'error') =>
    out.push({ file: 'catalog/skills.json', line: 1, rule, severity, message });
  if (!isObj(m)) {
    err('shape', 'manifest must be an object');
    return out;
  }
  if (m.schemaVersion !== 1) err('shape', 'schemaVersion must be 1');
  if (!Array.isArray(m.upstreams)) err('shape', 'upstreams must be an array');
  if (!Array.isArray(m.skills)) err('shape', 'skills must be an array');
  if (!Array.isArray(m.upstreams) || !Array.isArray(m.skills)) return out;

  const upstreams = new Map();
  for (const u of m.upstreams) {
    if (!isObj(u) || typeof u.repo !== 'string' || !REPO.test(u.repo) || typeof u.license !== 'string') {
      err('upstream-shape', `bad upstream entry ${JSON.stringify(u?.repo ?? null)}`);
      continue;
    }
    upstreams.set(u.repo, u);
  }

  const seen = new Set();
  const listed = new Set();
  for (const s of m.skills) {
    if (!isObj(s)) { err('required-field', 'skill entry is not an object'); continue; }
    const id = typeof s.name === 'string' ? s.name : '?';
    const e = (rule, message, sev) => err(rule, `${id}: ${message}`, sev);

    const req = (key, ok) => {
      if (!(key in s) || !ok(s[key])) { e('required-field', `missing or mistyped "${key}"`); return false; }
      return true;
    };
    const nameOk = req('name', (v) => typeof v === 'string');
    req('path', (v) => v === null || typeof v === 'string');
    req('summary', (v) => typeof v === 'string');
    req('category', (v) => typeof v === 'string');
    req('origin', (v) => typeof v === 'string');
    req('upstream', (v) => v === null || typeof v === 'string');
    req('license', isObj);
    req('tested', isObj);
    req('status', (v) => typeof v === 'string');
    req('knownIssues', Array.isArray);
    req('security', isObj);
    if (!nameOk) continue;

    if (!NAME.test(s.name)) e('name-format', 'name must match ^[a-z0-9][a-z0-9-]*$');
    if (seen.has(s.name)) e('name-duplicate', 'duplicate name');
    seen.add(s.name);
    if (typeof s.category === 'string' && !CATEGORIES.includes(s.category)) e('enum', `bad category ${s.category}`);
    if (typeof s.origin === 'string' && !ORIGINS.includes(s.origin)) e('enum', `bad origin ${s.origin}`);
    if (typeof s.status === 'string' && !STATUSES.includes(s.status)) e('enum', `bad status ${s.status}`);
    const lic = isObj(s.license) ? s.license : {};
    if (isObj(s.license) && lic.redistribution !== undefined && !REDISTRIBUTION.includes(lic.redistribution)) {
      e('enum', `bad license.redistribution ${lic.redistribution}`);
    }

    if (typeof s.summary === 'string') {
      if (s.summary.length > 120) e('summary', 'summary longer than 120 characters');
      if (s.summary.includes('|')) e('summary', 'summary contains a pipe character');
    }
    const testedDate = isObj(s.tested) ? s.tested.date : null;
    for (const [label, d] of [['license.checked', lic.checked], ['tested.date', testedDate]]) {
      if (d !== null && d !== undefined && !(typeof d === 'string' && DATE.test(d))) e('date-format', `${label} must be YYYY-MM-DD`);
    }

    if (typeof s.path === 'string') {
      listed.add(s.path);
      if (!skillDirs.includes(s.path)) e('path-missing', `path ${s.path} is not a skill folder`);
      if (s.path.split('/').at(-1) !== s.name) e('name-path-mismatch', 'name must equal the last segment of path');
      if (!['self', 'allowed', 'permission-granted'].includes(lic.redistribution)) {
        e('bundled-redistribution', 'bundled skill needs redistribution self|allowed|permission-granted');
      }
      if (s.status === 'pointer') e('bundled-pointer', 'bundled skill cannot have status pointer');
    }
    if (lic.redistribution === 'permission-granted' && !(typeof lic.evidence === 'string' && /^https?:\/\//.test(lic.evidence))) {
      e('permission-evidence', 'permission-granted needs a license.evidence URL');
    }

    if (typeof s.upstream === 'string') {
      if (!REPO.test(s.upstream)) e('upstream-format', 'upstream must be owner/repo');
      else if (!upstreams.has(s.upstream)) e('upstream-unknown', `upstream ${s.upstream} is not in upstreams`);
    }
    if (s.status === 'pointer') {
      const p = s.pointer;
      if (s.path !== null) e('pointer-shape', 'pointer must have path null');
      else if (lic.redistribution !== 'not-bundled') e('pointer-shape', 'pointer needs redistribution not-bundled');
      else if (typeof s.upstream !== 'string') e('pointer-shape', 'pointer needs an upstream');
      else if (!isObj(p) || typeof p.install !== 'string' || p.install.trim() === '') e('pointer-shape', 'pointer needs a non-empty install line');
      else if (typeof p.url !== 'string' || !p.url.startsWith(`https://github.com/${s.upstream}/`)) {
        e('pointer-shape', 'pointer url must start with https://github.com/<upstream>/');
      }
    } else if (typeof s.upstream === 'string' && upstreams.has(s.upstream)) {
      const u = upstreams.get(s.upstream);
      const skillLevel = typeof lic.evidence === 'string' && /\/(LICENSE|COPYING)[^/]*$/i.test(lic.evidence) &&
        typeof s.source?.subpath === 'string' && lic.evidence.includes(s.source.subpath);
      if (!['self-authored', 'wrapper'].includes(s.origin) && lic.spdx !== u.license && !skillLevel) {
        e('license-mismatch', `license ${lic.spdx} differs from upstream ${u.license}`);
      }
    }
    if ((s.origin === 'adopted' || s.origin === 'adapted') && s.upstream === null &&
        !(Array.isArray(s.knownIssues) && s.knownIssues.some((k) => typeof k === 'string' && k.startsWith('source not recorded')))) {
      e('origin-upstream', 'adopted/adapted skill needs an upstream or a "source not recorded" known issue');
    }
    if (s.status === 'stable' && !(isObj(s.tested) && s.tested.date)) e('stable-untested', 'stable skill has no tested.date', 'warn');
  }
  for (const d of skillDirs) {
    if (!listed.has(d)) err('dir-unlisted', `skill folder ${d} has no manifest entry`);
  }
  return out;
}
