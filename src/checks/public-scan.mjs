import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { isTextBuffer, loadDenylist, scanText, staleAllowFindings } from '../public-scan.mjs';

export async function loadAllow(root) {
  try {
    const raw = JSON.parse((await readFile(path.join(root, '.public-allow.json'), 'utf8')).replace(/^﻿/, ''));
    return Array.isArray(raw) ? raw : raw.allow ?? [];
  } catch {
    return [];
  }
}

export function listFiles(root) {
  try {
    return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 256 * 1024 * 1024 })
      .split(String.fromCharCode(10)).filter(Boolean);
  } catch {
    return walk(root, '');
  }
}

// Not a git checkout (a bare temp folder): list every file except .git and node_modules.
function walk(root, rel) {
  const out = [];
  for (const e of readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...walk(root, r));
    else out.push(r);
  }
  return out;
}

export default async function publicScanCheck(root, opts = {}) {
  const findings = [];
  let denylist = [];
  const file = opts.local ? path.join(root, '.public-denylist.txt') : opts.denylistFile;
  if (file) {
    try {
      denylist = await loadDenylist(file);
    } catch {
      denylist = [];
    }
    if (opts.local && denylist.length === 0) {
      findings.push({ file: '.public-denylist.txt', line: 1, rule: 'denylist-missing', severity: 'error', message: 'run: claude-abo seed-denylist, then review it' });
    }
  }
  const allow = await loadAllow(root);
  const used = new Set();
  for (const rel of listFiles(root)) {
    let buf;
    try {
      buf = await readFile(path.join(root, rel));
    } catch {
      continue;
    }
    if (!isTextBuffer(buf)) continue;
    findings.push(...scanText(rel, buf.toString('utf8'), { denylist, allow, used }));
  }
  findings.push(...staleAllowFindings(allow, used));
  return findings;
}
