export function mount(el) {
  const h = document.createElement('h2');
  h.id = 'tour-h';
  h.textContent = 'Tour';
  const p = document.createElement('p');
  p.textContent = 'Three steps: run the audit, see what to cut, pick skills from the catalog. A short recording of the audit is added here.';
  el.append(h, p);
}
