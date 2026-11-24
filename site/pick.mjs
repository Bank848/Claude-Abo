// Hero picker: a rough illustration of matching a request to one-line skill descriptions.
// It scores word overlap against the manifest summaries. It is NOT how Claude chooses a skill.

const STOP = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'make', 'want', 'done', 'what', 'you', 'your', 'how', 'are', 'has', 'not', 'but', 'can', 'get', 'out', 'please']);

const words = (s) => String(s ?? '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w));

export function rank(query, skills, limit = 5) {
  const q = [...new Set(words(query))];
  if (!q.length) return [];
  const scored = [];
  (skills ?? []).forEach((s, i) => {
    const toks = words(`${s.name} ${s.summary ?? ''}`);
    const score = q.filter((w) => toks.some((t) => t === w || (w.length >= 4 && t.startsWith(w)))).length;
    if (score > 0) scored.push({ s, score, i });
  });
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.slice(0, limit).map((x) => x.s);
}

function line(skill, picked) {
  const li = document.createElement('li');
  if (picked) li.setAttribute('aria-current', 'true');
  const b = document.createElement('b');
  b.textContent = skill.name;
  const t = document.createElement('span');
  t.className = 't';
  t.textContent = skill.summary ?? '';
  li.append(b, document.createTextNode(' '), t);
  return li;
}

export function mount(sec, data = {}) {
  const input = sec?.querySelector('#pick-q');
  const list = sec?.querySelector('#pick-list');
  const live = sec?.querySelector('#pick-live');
  if (!input || !list) return;
  const start = [...list.children].map((li) => li.cloneNode(true));
  const skills = (data.skills ?? []).filter((s) => s.status !== 'deprecated');
  let timer = null;
  function show() {
    const q = input.value.trim();
    if (!q) {
      list.replaceChildren(...start.map((li) => li.cloneNode(true)));
      if (live) live.textContent = '';
      return;
    }
    const hits = rank(q, skills);
    if (!hits.length) {
      const li = document.createElement('li');
      li.textContent = 'No close match. Try words that describe what the skill does.';
      list.replaceChildren(li);
      if (live) live.textContent = 'No close match';
      return;
    }
    list.replaceChildren(...hits.map((s, i) => line(s, i === 0)));
    if (live) live.textContent = `Best match: ${hits[0].name}`;
  }
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(show, 120);
  });
}
