// Loads the catalog data and fills each section slot with its module's mount(el, data).
const SLOTS = ['tour', 'catalog', 'audit', 'learn', 'about'];

async function main() {
  let data = { skills: [], count: 0 };
  try {
    const res = await fetch('data/catalog.json');
    if (res.ok) data = await res.json();
  } catch { /* the page still renders with empty data */ }
  for (const id of SLOTS) {
    const el = document.getElementById(id);
    if (!el) continue;
    try {
      const mod = await import(`./${id}.mjs`);
      mod.mount(el, data);
    } catch {
      const p = document.createElement('p');
      p.textContent = 'This section could not be loaded.';
      el.append(p);
    }
  }
}
main();
