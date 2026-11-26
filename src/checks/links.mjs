// Every relative markdown link target must exist. Bundled skills (upstream text) and local plans are out of scope.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SKIP = [/^global-config\/skills\//, /^docs\/superpowers\//, /^intake\/reports\//, /^node_modules\//];
const LINK = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export default async function links(root) {
  let files;
  try {
    files = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '*.md'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
  const out = [];
  for (const f of files.filter((x) => !SKIP.some((re) => re.test(x)))) {
    let text;
    try { text = readFileSync(path.join(root, f), 'utf8'); } catch { continue; }
    let fence = false;
    text.split(/\r?\n/).forEach((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return; }
      if (fence) return;
      const plain = line.replace(/`[^`]*`/g, '');
      for (const m of plain.matchAll(LINK)) {
        const t = m[1];
        if (/^(https?:|mailto:|#|\/|data:)/i.test(t) || /[<>{}]/.test(t)) continue;
        const target = decodeURIComponent(t.split('#')[0]);
        if (!target) continue;
        if (!existsSync(path.join(root, path.dirname(f), target))) {
          out.push({ file: f, line: i + 1, rule: 'broken-link', severity: 'error', message: `relative link target does not exist: ${target}` });
        }
      }
    });
  }
  return out;
}
