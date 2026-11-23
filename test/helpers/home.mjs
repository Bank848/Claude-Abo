// Builds throwaway Claude Code config trees at test time (nothing private is committed).
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const put = (root, rel, text) => {
  mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  writeFileSync(path.join(root, rel), text);
};
export const skillMd = (name, desc) => `---\nname: ${name}\ndescription: ${desc}\n---\nbody\n`;

export function makeHome({ hookCommand = null, skills = ['alpha', 'beta'] } = {}) {
  const base = mkdtempSync(path.join(tmpdir(), 'abo-audit-'));
  const home = path.join(base, 'home');
  const cwd = path.join(base, 'proj');
  mkdirSync(cwd, { recursive: true });
  const cfg = path.join(home, '.claude');
  put(cfg, 'CLAUDE.md', `# user\n${'x'.repeat(400)}`);
  for (const s of skills) put(cfg, `skills/${s}/SKILL.md`, skillMd(s, `Does ${s} things in a typical session`));
  const settings = { permissions: { defaultMode: 'default', ask: ['Edit(~/.claude/**)'] } };
  if (hookCommand) settings.hooks = { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: hookCommand }] }] };
  put(cfg, 'settings.json', JSON.stringify(settings));
  return { base, home, cwd, cfg };
}
