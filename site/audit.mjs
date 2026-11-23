export function mount(el) {
  const h = document.createElement('h2');
  h.id = 'audit-h';
  h.textContent = 'Audit';
  const p = document.createElement('p');
  p.textContent = 'Run the audit on your own machine. It reads your Claude Code config locally and prints an estimate of the fixed context in tokens, a list of what to cut and a safety checklist.';
  const cmd = document.createElement('code');
  cmd.className = 'cmd';
  cmd.textContent = 'npx github:Bank848/Claude-Abo audit';
  el.append(h, p, cmd);
}
