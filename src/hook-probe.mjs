// Runs the user's own PreToolUse Bash hooks against a dangerous test command and a harmless control.
// Hooks defined at project level are never run (the collector never puts them in rawHooks).
import { spawn, spawnSync } from 'node:child_process';

const DANGER = 'git push --force origin main';
const CONTROL = 'ls';

function matchesBash(matcher) {
  if (matcher === '' || matcher === '*') return true;
  try { return new RegExp(`^(?:${matcher})$`).test('Bash'); } catch { return false; }
}

export function isBlocked(code, stdout) {
  if (code === 2) return true;
  try {
    const j = JSON.parse(stdout.trim());
    const d = j?.hookSpecificOutput?.permissionDecision;
    return d === 'deny' || d === 'ask' || j?.decision === 'block';
  } catch {
    return false;
  }
}

function runHook(command, command2, timeoutMs) {
  const payload = JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: command2 } });
  return new Promise((resolve) => {
    const child = spawn(command, { shell: true, stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true });
    let out = '';
    let done = false;
    const finish = (blocked) => { if (!done) { done = true; clearTimeout(timer); resolve(blocked); } };
    const timer = setTimeout(() => {
      if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      else child.kill('SIGKILL');
      finish(false); // a hook that hangs did not block anything
    }, timeoutMs);
    child.stdout.on('data', (d) => { out += d; });
    child.on('error', () => finish(false));
    child.on('close', (code) => finish(isBlocked(code, out)));
    child.stdin.on('error', () => {});
    child.stdin.end(payload);
  });
}

// rawHooks: [{event, matcher, command}] (user level only). -> {tested, blocked, blocksEverything, controlBlocked}
export async function probeHooks(rawHooks, { timeoutMs = 5000, log = () => {} } = {}) {
  const hooks = rawHooks.filter((h) => h.event === 'PreToolUse' && matchesBash(h.matcher ?? '') && h.command);
  if (hooks.length) log(`hook probe will run ${hooks.length} user-level PreToolUse hook(s) with a fake Bash command (nothing real executes):\n${hooks.map((h) => `  ${h.command}`).join('\n')}\n`);
  let blocked = 0;
  let controlBlocked = false;
  for (const h of hooks) {
    if (await runHook(h.command, DANGER, timeoutMs)) blocked++;
    if (await runHook(h.command, CONTROL, timeoutMs)) controlBlocked = true;
  }
  return { tested: hooks.length, blocked, blocksEverything: controlBlocked, controlBlocked };
}
