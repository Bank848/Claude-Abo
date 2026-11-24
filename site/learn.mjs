// Lessons page: a list of the lessons, one lesson body at a time, route #learn/<id>.
// Pure helpers are exported for tests; the Markdown reader is loaded inside mount().
import { renderBlocks } from './dom-md.mjs';

const STORE = 'abo-learn-done';

export function lessonList(lessons) {
  return [...(Array.isArray(lessons) ? lessons : [])].sort((a, b) => a.order - b.order);
}

// '#learn/01-memory' -> {id:'01-memory'}; '#learn' or other hashes -> {id:null}; unknown id -> notice.
export function routeFor(hash, lessons) {
  const m = /^#learn\/([\w-]+)$/.exec(hash ?? '');
  if (!m) return { id: null, notice: null };
  if (lessons.some((l) => l.id === m[1])) return { id: m[1], notice: null };
  return { id: null, notice: 'That lesson does not exist. Pick one from the list.' };
}

function readDone() {
  try { return new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]')); } catch { return new Set(); }
}
function writeDone(set) {
  try { localStorage.setItem(STORE, JSON.stringify([...set])); } catch { /* the page works without storage */ }
}

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

export async function mount(sec) {
  const h = el('h2', 'Learn');
  h.id = 'learn-h';
  sec.append(h);
  let lessons = [];
  try {
    const res = await fetch('data/lessons.json');
    if (res.ok) lessons = lessonList(await res.json());
  } catch { /* handled below */ }
  if (!lessons.length) {
    sec.append(el('p', 'No lessons are available right now.'));
    return;
  }
  sec.append(el('p', 'Six short lessons built from the files in this repo. Each takes 10 to 15 minutes.'));
  const layout = el('div', null, 'learn-layout');
  const nav = el('nav', null, 'learn-list');
  nav.setAttribute('aria-label', 'Lessons');
  const body = el('div', null, 'learn-body');
  body.setAttribute('aria-live', 'polite');
  layout.append(nav, body);
  sec.append(layout);

  const done = readDone();
  const cache = new Map();

  function drawList(activeId) {
    nav.replaceChildren();
    const ol = el('ol');
    for (const l of lessons) {
      const li = el('li');
      const a = el('a', `${l.title} (${l.minutes ?? '?'} min)`);
      a.href = `#learn/${l.id}`;
      if (l.id === activeId) a.setAttribute('aria-current', 'page');
      li.append(a);
      if (done.has(l.id)) li.append(el('span', ' done', 'learn-done'));
      ol.append(li);
    }
    nav.append(ol);
  }

  async function drawBody(id, notice) {
    body.replaceChildren();
    if (notice) body.append(el('p', notice, 'learn-notice'));
    if (!id) {
      body.append(el('p', 'Choose a lesson from the list.'));
      return;
    }
    const lesson = lessons.find((l) => l.id === id);
    body.append(el('h3', lesson.title));
    const run = el('div', null, 'learn-run');
    run.append(el('p', 'Run it in Claude Code'));
    run.append(el('code', `/learn ${id}`, 'cmd'));
    body.append(run);
    try {
      if (!cache.has(id)) {
        const res = await fetch(`learn/${id}.md`);
        if (!res.ok) throw new Error('bad status');
        const { parseMarkdown } = await import('./src/mini-md.mjs');
        cache.set(id, parseMarkdown(await res.text()));
      }
      const blocks = cache.get(id).filter((b, i) => !(i === 0 && b.type === 'heading' && b.level === 1));
      body.append(...renderBlocks(document, blocks));
    } catch {
      body.append(el('p', 'This lesson could not be loaded.'));
      return;
    }
    const btn = el('button', done.has(id) ? 'Mark as not done' : 'Mark as done', 'learn-mark');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      if (done.has(id)) done.delete(id); else done.add(id);
      writeDone(done);
      drawList(id);
      btn.textContent = done.has(id) ? 'Mark as not done' : 'Mark as done';
    });
    body.append(btn);
  }

  async function route() {
    const { id, notice } = routeFor(location.hash, lessons);
    drawList(id);
    await drawBody(id, notice);
  }
  window.addEventListener('hashchange', route);
  await route();
}
