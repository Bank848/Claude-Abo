// Shared helpers for the `memory` subcommands.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseDenylist } from '../private-patterns.mjs';

export function flagValues(argv, name) {
  const out = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === name && argv[i + 1] !== undefined) out.push(argv[i + 1]);
  return out;
}

export function positional(argv, valueFlags) {
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    if (valueFlags.includes(argv[i])) { i++; continue; }
    if (!argv[i].startsWith('--')) out.push(argv[i]);
  }
  return out;
}

export function isInside(parent, target) {
  const rel = path.relative(path.resolve(parent), path.resolve(target));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// Output paths must be outside the repo root: they can name private notes.
export function requireOutside(root, target, label) {
  if (isInside(root, target)) {
    process.stderr.write(`${label} must resolve outside the repo root\n`);
    return false;
  }
  return true;
}

export async function loadPrivateList(root, argv) {
  const file = flagValues(argv, '--denylist')[0] ?? path.join(root, '.public-denylist.txt');
  try {
    return parseDenylist((await readFile(file, 'utf8')).replace(/^﻿/, ''));
  } catch {
    return [];
  }
}

export async function localConfig(root) {
  try {
    const raw = JSON.parse((await readFile(path.join(root, '.abo-local.json'), 'utf8')).replace(/^﻿/, ''));
    return { memoryDirs: Array.isArray(raw.memoryDirs) ? raw.memoryDirs : [] };
  } catch {
    return null;
  }
}
