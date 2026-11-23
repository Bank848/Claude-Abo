import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
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
  return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
    .split('\n').filter(Boolean);
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
