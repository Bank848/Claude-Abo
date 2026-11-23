// Tour: three steps beside an optional clip. The clip is shown only when media/tour.mp4 was shipped,
// so the page never carries a broken player.

const STEPS = [
  ['Run the audit', 'One command reads your Claude Code folder and estimates what it costs in context every session.', 'npx github:Bank848/Claude-Abo audit'],
  ['See what to cut', 'The report lists the biggest skills, hooks and rules first, with the estimated tokens each one saves.', null],
  ['Pick skills from the catalog', 'Every skill shows its licence, when it was last tested and what is known to go wrong.', null],
];

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

async function hasClip() {
  try {
    const res = await fetch('media/tour.mp4', { method: 'HEAD' });
    return res.ok;
  } catch { return false; }
}

export async function mount(sec) {
  const h = el('h2', 'Tour');
  h.id = 'tour-h';
  sec.append(h);
  const wrap = el('div', null, 'tour-wrap');
  const ol = el('ol', null, 'tour-steps');
  for (const [title, text, cmd] of STEPS) {
    const li = el('li');
    li.append(el('strong', title), el('span', text));
    if (cmd) li.append(el('code', cmd, 'cmd'));
    ol.append(li);
  }
  wrap.append(ol);
  if (await hasClip()) {
    const v = document.createElement('video');
    v.controls = true;
    v.preload = 'none';
    v.poster = 'media/tour-poster.webp';
    v.className = 'tour-video';
    const src = document.createElement('source');
    src.src = 'media/tour.mp4';
    src.type = 'video/mp4';
    v.append(src);
    v.setAttribute('aria-label', 'Short recording of the audit');
    wrap.append(v);
  }
  sec.append(wrap);
}
