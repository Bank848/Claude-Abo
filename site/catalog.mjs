// Plain table of every skill; the filterable version replaces this.
export function mount(el, data) {
  const h = document.createElement('h2');
  h.id = 'catalog-h';
  h.textContent = `Catalog (${data.skills.length})`;
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');
  const head = table.createTHead().insertRow();
  for (const t of ['Skill', 'Summary', 'Category', 'Status']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = t;
    head.append(th);
  }
  const body = table.createTBody();
  for (const s of data.skills) {
    const row = body.insertRow();
    for (const v of [s.name, s.summary, s.category, s.status]) row.insertCell().textContent = v ?? '';
  }
  wrap.append(table);
  el.append(h, wrap);
}
