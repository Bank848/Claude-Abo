export function mount(el) {
  const h = document.createElement('h2');
  h.id = 'about-h';
  h.textContent = 'About';
  const p = document.createElement('p');
  p.textContent = 'Claude-Abo is one person\'s Claude Code setup, turned into a catalog and an audit. The command below estimates what your own setup costs in context.';
  const cmd = document.createElement('code');
  cmd.className = 'cmd';
  cmd.textContent = 'npx github:Bank848/Claude-Abo audit';
  const a = document.createElement('a');
  a.href = 'https://github.com/Bank848/Claude-Abo';
  a.rel = 'noopener noreferrer';
  a.textContent = 'Source on GitHub';
  const p2 = document.createElement('p');
  p2.append(a);
  el.append(h, p, cmd, p2);
}
