// Everything under site/ must build the DOM with textContent/createElement only.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { walk } from '../walk.mjs';

const BAD = [
  [/\binnerHTML\b/, 'innerHTML'],
  [/\bouterHTML\b/, 'outerHTML'],
  [/\binsertAdjacentHTML\b/, 'insertAdjacentHTML'],
  [/\bdocument\.write\b/, 'document.write'],
  [/\beval\s*\(/, 'eval('],
];

export default async function siteDom(root) {
  const findings = [];
  const files = (await walk(root, 'site')).filter((f) => /\.(mjs|js|html)$/.test(f));
  for (const rel of files) {
    const lines = (await readFile(path.join(root, rel), 'utf8')).split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const [re, name] of BAD) {
        if (re.test(line)) {
          findings.push({ file: rel, line: i + 1, rule: 'site-dom', severity: 'error', message: `site code uses ${name}` });
        }
      }
    });
  }
  return findings;
}
