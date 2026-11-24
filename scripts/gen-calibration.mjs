// Builds a synthetic Claude Code config dir for audit calibration (Task 9). No real content.
// Usage: node scripts/gen-calibration.mjs <outDir> small|medium
// Then: CLAUDE_CONFIG_DIR=<outDir> claude   (run /context in an empty folder)
//       node bin/claude-abo.mjs audit --home <outDir>/.. --cwd <emptyDir> --json --context-tokens <figure>
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [out, size] = process.argv.slice(2);
const SIZES = { small: { skills: 10, claudeMdLines: 30 }, medium: { skills: 60, claudeMdLines: 120 } };
if (!out || !SIZES[size]) {
  process.stderr.write('usage: node scripts/gen-calibration.mjs <outDir> small|medium\n');
  process.exit(2);
}
const { skills, claudeMdLines } = SIZES[size];
const topics = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel'];
const sentence = (i) => `Rule ${i}: keep the ${topics[i % topics.length]} step small, check it once, and write down what changed.`;

mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, 'CLAUDE.md'), `# Synthetic setup (${size})\n\n${Array.from({ length: claudeMdLines }, (_, i) => `- ${sentence(i)}`).join('\n')}\n`);
for (let i = 0; i < skills; i++) {
  const name = `synthetic-${size}-${String(i).padStart(2, '0')}`;
  const dir = path.join(out, 'skills', name);
  mkdirSync(dir, { recursive: true });
  const desc = `Use when working on the ${topics[i % topics.length]} task number ${i}. ${sentence(i)} ${sentence(i + 3)}`;
  writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: ${desc}\n---\n\n# ${name}\n\nSteps for task ${i}.\n`);
}
process.stdout.write(`wrote ${skills} skills and CLAUDE.md (${claudeMdLines} lines) to ${out}\n`);
