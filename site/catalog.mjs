// Filterable skill catalog. Every manifest string reaches the DOM through textContent only.

const REPO = /^[\w.-]+\/[\w.-]+$/;

export function filterSkills(skills, { q = '', category = '', status = '', license = '', bundled = false } = {}) {
  const needle = q.trim().toLowerCase();
  return skills.filter((s) => {
    if (needle && !`${s.name} ${s.summary ?? ''}`.toLowerCase().includes(needle)) return false;
    if (category && s.category !== category) return false;
    if (status && s.status !== status) return false;
    if (license && s.license?.spdx !== license) return false;
    if (bundled && s.status === 'pointer') return false;
    return true;
  });
}

export function sortSkills(skills, key = 'name') {
  const out = [...skills];
  if (key === 'descTokens') out.sort((a, b) => (b.descTokens ?? -1) - (a.descTokens ?? -1) || a.name.localeCompare(b.name));
  else out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

// Links are built only from a validated owner/repo; a pointer URL must sit under that repo.
export function upstreamUrl(s) {
  return typeof s.upstream === 'string' && REPO.test(s.upstream) ? `https://github.com/${s.upstream}` : null;
}
export function pointerUrl(s) {
  const base = upstreamUrl(s);
  const u = s.pointer?.url;
  return base && typeof u === 'string' && u.startsWith(`${base}/`) ? u : null;
}

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function link(href, text) {
  const a = el('a', text);
  a.href = href;
  a.rel = 'noopener noreferrer';
  return a;
}
const uniq = (skills, f) => [...new Set(skills.map(f).filter(Boolean))].sort();

function select(id, label, values) {
  const wrap = el('div', null, 'cat-field');
  const l = el('label', label);
  l.htmlFor = id;
  const s = document.createElement('select');
  s.id = id;
  const all = el('option', 'All');
  all.value = '';
  s.append(all);
  for (const v of values) { const o = el('option', v); o.value = v; s.append(o); }
  wrap.append(l, s);
  return { wrap, s };
}

function detail(s) {
  const d = el('div', null, 'cat-detail');
  const dl = el('dl');
  const add = (k, v) => { dl.append(el('dt', k)); const dd = el('dd'); if (typeof v === 'string') dd.textContent = v; else dd.append(v); dl.append(dd); };
  add('Summary', s.summary ?? '');
  add('Tested', s.tested?.date ?? 'not tested');
  add('Category', s.category ?? '');
  add('Licence', s.license?.spdx ?? 'unknown');
  add('Origin', s.origin ?? 'unknown');
  const up = upstreamUrl(s);
  if (up) {
    const span = el('span');
    span.append(link(up, s.upstream));
    if (s.source?.commit) span.append(document.createTextNode(` at ${String(s.source.commit).slice(0, 12)}`));
    add('Upstream', span);
  }
  add('Known issues', s.knownIssues?.length ? s.knownIssues.join('; ') : 'none recorded');
  add('Security scan', s.security?.scanned ? `${s.security.scanner}, ${s.security.scanned}, ${s.security.errors} error(s)${s.security.reviewed ? ', reviewed by hand' : ', not reviewed by hand'}` : 'not scanned (not bundled)');
  add('Licence checked', s.license?.checked ?? 'unknown');
  if (s.status === 'pointer') {
    add('Not bundled', 'Install from upstream:');
    const code = el('code', s.pointer?.install ?? 'see the upstream repo');
    code.className = 'cmd';
    d.append(dl, code);
    const pu = pointerUrl(s);
    if (pu) { const p = el('p'); p.append(link(pu, 'Upstream skill folder')); d.append(p); }
    if (s.pointer?.note) d.append(el('p', s.pointer.note));
  } else d.append(dl);
  return d;
}

export function mount(sec, data) {
  const skills = data.skills ?? [];
  const h = el('h2', `Catalog (${skills.length})`);
  h.id = 'catalog-h';
  sec.append(h);
  sec.append(el('p', 'Every skill in this repo with where it came from, its licence and how well it has been checked. Tested dates stay empty until a skill has actually been run.'));
  sec.append(el('p', "Claude picks a skill by matching your request against its one-line description, so a good description says when to use the skill. The Summary column is a short version of it."));

  const search = el('div', null, 'cat-field');
  const sl = el('label', 'Search name or summary');
  sl.htmlFor = 'cat-q';
  const q = document.createElement('input');
  q.id = 'cat-q';
  q.type = 'search';
  q.autocomplete = 'off';
  search.append(sl, q);
  const cat = select('cat-category', 'Category', uniq(skills, (s) => s.category));
  const st = select('cat-status', 'Status', uniq(skills, (s) => s.status));
  const lic = select('cat-license', 'Licence', uniq(skills, (s) => s.license?.spdx));
  const sortF = select('cat-sort', 'Sort by', []);
  sortF.s.replaceChildren(...[['name', 'Name'], ['descTokens', 'Token cost']].map(([v, t]) => { const o = el('option', t); o.value = v; return o; }));
  const bwrap = el('div', null, 'cat-field cat-check');
  const bundled = document.createElement('input');
  bundled.type = 'checkbox';
  bundled.id = 'cat-bundled';
  const bl = el('label', 'Bundled only (hide pointers)');
  bl.htmlFor = 'cat-bundled';
  bwrap.append(bundled, bl);
  const controls = el('div', null, 'cat-controls');
  controls.append(search, cat.wrap, st.wrap, lic.wrap, sortF.wrap, bwrap);

  const count = el('p', null, 'cat-count');
  count.setAttribute('aria-live', 'polite');
  const wrap = el('div', null, 'table-wrap');
  const table = document.createElement('table');
  const head = table.createTHead().insertRow();
  for (const t of ['Skill', 'Summary', 'Category', 'Licence', 'Status', 'Tested', 'Tokens']) {
    const th = el('th', t);
    th.scope = 'col';
    head.append(th);
  }
  const body = table.createTBody();
  wrap.append(table);
  sec.append(controls, count, wrap);

  function render() {
    const rows = sortSkills(filterSkills(skills, { q: q.value, category: cat.s.value, status: st.s.value, license: lic.s.value, bundled: bundled.checked }), sortF.s.value);
    count.textContent = `${rows.length} of ${skills.length} skills`;
    body.replaceChildren();
    for (const s of rows) {
      const row = body.insertRow();
      const nameCell = row.insertCell();
      const btn = el('button', s.name, 'cat-toggle');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      nameCell.append(btn);
      row.insertCell().textContent = s.summary ?? '';
      row.insertCell().textContent = s.category ?? '';
      row.insertCell().textContent = s.license?.spdx ?? '';
      row.insertCell().append(el('span', s.status ?? '', `badge badge-${s.status}`));
      row.insertCell().textContent = s.tested?.date ?? 'not tested';
      row.insertCell().textContent = s.descTokens == null ? 'n/a' : `~${s.descTokens}`;
      let open = null;
      btn.addEventListener('click', () => {
        if (open) { open.remove(); open = null; btn.setAttribute('aria-expanded', 'false'); return; }
        open = body.insertRow(row.rowIndex);
        const cell = open.insertCell();
        cell.colSpan = 7;
        const w = el('div', null, 'cat-detail-wrap');
        w.append(detail(s));
        cell.append(w);
        btn.setAttribute('aria-expanded', 'true');
      });
    }
  }
  for (const c of [q, cat.s, st.s, lic.s, sortF.s, bundled]) c.addEventListener('input', render);
  render();
}
