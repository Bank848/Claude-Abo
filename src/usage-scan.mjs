// Counts Skill tool calls in Claude Code transcripts. Streams lines, keeps only skill names, never message text.
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const DAY = 86_400_000;

async function jsonlFiles(dir, minMtime, out = []) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await jsonlFiles(p, minMtime, out);
    else if (e.isFile() && e.name.endsWith('.jsonl')) {
      try { if ((await stat(p)).mtimeMs >= minMtime) out.push(p); } catch { /* vanished */ }
    }
  }
  return out;
}

// -> {windowDays, sessionsScanned, skillCalls, partial}
export async function scanUsage(projectsDir, { days = 30, budgetMs = 10_000, now = Date.now() } = {}) {
  const t0 = Date.now();
  const over = () => Date.now() - t0 >= budgetMs;
  const files = await jsonlFiles(projectsDir, now - days * DAY);
  const skillCalls = {};
  let sessionsScanned = 0;
  let partial = false;
  outer: for (const file of files) {
    if (over()) { partial = true; break; }
    const rl = readline.createInterface({ input: createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
    let n = 0;
    for await (const line of rl) {
      if (++n % 2000 === 0 && over()) { partial = true; rl.close(); break outer; }
      if (!line.includes('"name":"Skill"')) continue;
      const m = /"skill":"([^"]+)"/.exec(line);
      if (m) skillCalls[m[1]] = (skillCalls[m[1]] ?? 0) + 1;
    }
    sessionsScanned++;
  }
  return { windowDays: days, sessionsScanned, skillCalls, partial };
}
