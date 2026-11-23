// Reads a Claude Code memory folder (MEMORY.md index + one note per file). Read-only.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseFrontmatter } from '../frontmatter.mjs';

const LINK_MD = /\]\(([^)\s#]+\.md)(?:#[^)]*)?\)/g;
const LINK_WIKI = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;

export function extractLinks(text) {
  const out = new Set();
  for (const m of text.matchAll(LINK_MD)) out.add(path.basename(m[1]));
  for (const m of text.matchAll(LINK_WIKI)) out.add(`${m[1].trim()}.md`);
  return [...out];
}

// Returns MemoryNote[]; the array also carries `indexMissing` (files MEMORY.md lists that do not exist).
export async function readMemoryDir(dir) {
  let names = [];
  try {
    names = (await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name).sort();
  } catch {
    names = [];
  }
  let indexText = '';
  try {
    indexText = (await readFile(path.join(dir, 'MEMORY.md'), 'utf8')).replace(/^﻿/, '');
  } catch { /* no index */ }
  const indexed = new Set(extractLinks(indexText));
  const notes = [];
  for (const file of names) {
    if (file === 'MEMORY.md') continue;
    const raw = (await readFile(path.join(dir, file), 'utf8')).replace(/^﻿/, '');
    const { data, body } = parseFrontmatter(raw);
    notes.push({
      file,
      name: data.name ?? file.replace(/\.md$/, ''),
      description: data.description ?? '',
      type: data.type ?? data['metadata.type'] ?? null,
      body,
      raw,
      bytes: Buffer.byteLength(raw),
      indexed: indexed.has(file),
      links: extractLinks(body),
    });
  }
  const present = new Set(names);
  Object.defineProperty(notes, 'indexMissing', { value: [...indexed].filter((f) => !present.has(f)), enumerable: false });
  return notes;
}
