import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze } from '../audit-core.mjs';
import { exportInventory } from '../inventory-export.mjs';
import { collectInventory } from '../inventory-node.mjs';
import { loadManifest } from '../manifest.mjs';
import { formatText } from '../report-text.mjs';

function flag(argv, name) {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
}

export default async function audit(argv) {
  const num = (name) => {
    const v = flag(argv, name);
    return v === null ? null : Number(v);
  };
  const contextTokens = num('--context-tokens');
  const days = num('--days') ?? 30;
  if ((contextTokens !== null && !(contextTokens > 0)) || !(days > 0)) {
    process.stderr.write('--context-tokens and --days must be positive numbers\n');
    return 1;
  }
  let catalog = null;
  try { catalog = await loadManifest(fileURLToPath(new URL('../../catalog/skills.json', import.meta.url))); } catch { /* optional */ }
  const inv = await collectInventory({
    home: flag(argv, '--home') ?? undefined,
    cwd: flag(argv, '--cwd') ?? undefined,
    usage: argv.includes('--usage'),
    days,
    probeHooks: argv.includes('--probe-hooks'),
    log: (m) => process.stderr.write(m),
  });
  if (contextTokens !== null) inv.contextTokens = contextTokens;

  const exportFile = flag(argv, '--export');
  if (exportFile) {
    const { inventory, hits } = exportInventory(inv, catalog);
    if (hits.length) {
      process.stderr.write(`export refused: leak rule(s) still match: ${hits.join(', ')}\n`);
      return 1;
    }
    await writeFile(path.resolve(exportFile), `${JSON.stringify(inventory, null, 2)}\n`);
    process.stdout.write('exported a renamed inventory (names not in the public catalog replaced, token counts kept)\n');
    return 0;
  }

  const report = analyze(inv, catalog, { contextTokens });
  process.stdout.write(argv.includes('--json') ? `${JSON.stringify(report, null, 2)}\n` : formatText(report));
  return 0;
}
