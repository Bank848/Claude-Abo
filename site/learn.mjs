export function mount(el) {
  const h = document.createElement('h2');
  h.id = 'learn-h';
  h.textContent = 'Learn';
  const p = document.createElement('p');
  p.textContent = 'Short lessons on what a Claude Code setup costs and how to trim it are listed here once they are written.';
  el.append(h, p);
}
