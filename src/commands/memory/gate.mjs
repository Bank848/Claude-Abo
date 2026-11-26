import { flagValues, loadPrivateList, localConfig } from '../../memory/cli-util.mjs';
import { runMemoryGate } from '../../checks/memory-examples.mjs';

export default async function memoryGate(argv) {
  const root = process.cwd();
  let dirs = flagValues(argv, '--real');
  if (dirs.length === 0) dirs = (await localConfig(root))?.memoryDirs ?? [];
  const findings = await runMemoryGate(root, { dirs, privateList: await loadPrivateList(root, argv) });
  for (const f of findings) process.stdout.write(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}\n`);
  process.stdout.write(`memory gate: ${findings.length} finding(s), ${dirs.length} real folder(s) compared\n`);
  return findings.some((f) => f.severity === 'error') ? 1 : 0;
}
