// Turns the plain tree from parseMarkdown into DOM nodes. Text only reaches the page through
// textContent, so markup in a lesson shows up as visible text and never becomes an element.
// `doc` is passed in so the same code runs in the page and in tests.

const HEADING_BASE = 3; // the section title is h2 and the lesson title is h3, so body headings start at h4

function make(doc, tag, text) {
  const e = doc.createElement(tag);
  if (text != null) e.textContent = text;
  return e;
}

export function renderInline(doc, items) {
  return items.map((it) => {
    if (it.t === 'code') return make(doc, 'code', it.text);
    if (it.t === 'bold') return make(doc, 'strong', it.text);
    if (it.t === 'link') {
      const a = make(doc, 'a', it.text);
      a.href = it.href;
      a.rel = 'noopener noreferrer';
      return a;
    }
    return doc.createTextNode(it.text);
  });
}

export function renderBlocks(doc, blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.type === 'heading') {
      out.push(make(doc, `h${Math.min(6, Math.max(HEADING_BASE + 1, b.level + HEADING_BASE - 1))}`, b.text));
    } else if (b.type === 'para') {
      const p = make(doc, 'p');
      p.append(...renderInline(doc, b.inline));
      out.push(p);
    } else if (b.type === 'code') {
      const pre = make(doc, 'pre');
      pre.append(make(doc, 'code', b.text));
      out.push(pre);
    } else if (b.type === 'list') {
      const list = make(doc, b.ordered ? 'ol' : 'ul');
      for (const item of b.items) {
        const li = make(doc, 'li');
        li.append(...renderInline(doc, item));
        list.append(li);
      }
      out.push(list);
    }
  }
  return out;
}
