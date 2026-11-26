// Builds a throwaway, fully synthetic Claude Code config for the audit demo GIF. Usage: node make-demo-home.mjs <dir>
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const out = path.resolve(process.argv[2] ?? '');
if (!process.argv[2]) { console.error('usage: node make-demo-home.mjs <dir>'); process.exit(2); }
const put = (rel, text) => { mkdirSync(path.dirname(path.join(out, rel)), { recursive: true }); writeFileSync(path.join(out, rel), text); };

const cfg = '.claude';
put(`${cfg}/CLAUDE.md`, `# Working rules\n${'Prefer small commits and explain the why in the message.\n'.repeat(60)}`);
const topics = ['api design', 'database migrations', 'release notes', 'code review', 'test planning', 'log triage', 'docker setup', 'css layout',
  'sql tuning', 'incident write-up', 'changelog', 'email drafts', 'spreadsheet formulas', 'regex help', 'shell scripting', 'git history cleanup',
  'accessibility checks', 'security review', 'performance profiling', 'meeting notes', 'translation', 'data cleaning', 'chart design', 'onboarding docs'];
topics.forEach((t, i) => {
  const name = t.replace(/ /g, '-');
  put(`${cfg}/skills/${name}/SKILL.md`, `---\nname: ${name}\ndescription: Use when the user asks for help with ${t}. ${'Covers the usual steps, checks and common mistakes for this kind of task. '.repeat(1 + (i % 4))}\n---\nBody.\n`);
});
put('guard.mjs', 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{process.exit(JSON.parse(d).tool_input.command.includes("git push")?2:0)});');
put(`${cfg}/settings.json`, JSON.stringify({
  permissions: { defaultMode: 'default' },
  hooks: { PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: `node "${path.join(out, 'guard.mjs')}"` }] }] },
}, null, 2));
mkdirSync(path.join(out, 'project'), { recursive: true });
console.log(out);
