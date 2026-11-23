import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gate } from '../memory/gate.mjs';
import { localConfig } from '../memory/cli-util.mjs';
import { readMemoryDir } from '../memory/read.mjs';
import { listFiles } from './public-scan.mjs';

export async function runMemoryGate(root, { dirs = [], privateList = [] } = {}) {
  const files = [];
  for (const rel of listFiles(root).filter((f) => f.endsWith('.md'))) {
    try { files.push({ file: rel, text: await readFile(path.join(root, rel), 'utf8') }); } catch { /* removed */ }
  }
  const realNotes = [];
  for (const d of dirs) realNotes.push(...(await readMemoryDir(d)));
  return gate({ files, privateList, realNotes });
}

// CI runs the rewritten-flag rule only; --local adds near-copy and rare-term against the owner's real notes.
export default async function memoryExamples(root, opts = {}) {
  if (!opts.local) return runMemoryGate(root);
  const cfg = await localConfig(root);
  if (!cfg) {
    return [{ file: '.abo-local.json', line: 1, rule: 'abo-local-missing', severity: 'error', message: 'create .abo-local.json with {"memoryDirs": [...]} so near-copy can compare against real notes' }];
  }
  const findings = await runMemoryGate(root, { dirs: cfg.memoryDirs });
  if (cfg.memoryDirs.length === 0) {
    findings.push({ file: '.abo-local.json', line: 1, rule: 'memory-dirs-empty', severity: 'warn', message: 'memoryDirs is empty: near-copy has nothing to compare against' });
  }
  return findings;
}
