// Applies the browser-safe rules to every file whose first line is `// @browser-safe`.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { walk } from '../walk.mjs';

const BUILTINS = 'fs|path|os|url|util|child_process|crypto|stream|http|https|net|zlib|events|buffer|readline|module|assert|worker_threads|vm|tty|dns';
const RULES = [
  [/\bimport\s[^'"]*['"]node:/, 'imports a node: module'],
  [new RegExp(String.raw`\bfrom\s*['"](?:${BUILTINS})(?:/[^'"]*)?['"]`), 'imports a bare Node built-in'],
  [new RegExp(String.raw`\bimport\s*['"](?:${BUILTINS})['"]`), 'imports a bare Node built-in'],
  [/\bimport\s*\(/, 'uses dynamic import('],
  [/\brequire\s*\(/, 'uses require('],
  [/\bfetch\s*\(/, 'uses fetch('],
  [/\bXMLHttpRequest\b/, 'uses XMLHttpRequest'],
  [/\bprocess\./, 'uses process.'],
  [/\bBuffer\b/, 'uses Buffer'],
];

function stripComments(line) {
  return line.replace(/(^|\s)\/\/.*$/, '$1');
}

export default async function browserSafe(root) {
  const findings = [];
  const files = (await walk(root)).filter((f) => /\.(mjs|js)$/.test(f));
  for (const rel of files) {
    const text = await readFile(path.join(root, rel), 'utf8');
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
    if (lines[0].trim() !== '// @browser-safe') continue;
    let inBlock = false;
    lines.forEach((raw, i) => {
      if (i === 0) return;
      let line = raw;
      if (inBlock) {
        const end = line.indexOf('*/');
        if (end === -1) return;
        inBlock = false;
        line = line.slice(end + 2);
      }
      line = line.replace(/\/\*.*?\*\//g, '');
      if (line.includes('/*')) {
        inBlock = true;
        line = line.slice(0, line.indexOf('/*'));
      }
      line = stripComments(line);
      for (const [re, what] of RULES) {
        if (re.test(line)) {
          findings.push({ file: rel, line: i + 1, rule: 'browser-safe', severity: 'error', message: `@browser-safe file ${what}` });
        }
      }
    });
  }
  return findings;
}
