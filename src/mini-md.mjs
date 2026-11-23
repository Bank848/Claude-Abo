// @browser-safe
// Tiny Markdown reader for the lessons. It returns a plain tree and never produces HTML, so the page
// can build DOM nodes with textContent. Supports headings, paragraphs, lists, fenced code, `code`, **bold**, [links](url).

const SAFE_HREF = /^(?:https?:\/\/[^\s]+|(?![a-z][a-z0-9+.-]*:)(?!\/\/)[^\s]*)$/i;

export function safeHref(href) {
  return typeof href === 'string' && SAFE_HREF.test(href.trim()) ? href.trim() : null;
}

export function parseInline(text) {
  const out = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
  let last = 0;
  const push = (item) => {
    const prev = out[out.length - 1];
    if (item.t === 'text' && prev?.t === 'text') prev.text += item.text;
    else out.push(item);
  };
  for (const m of text.matchAll(re)) {
    if (m.index > last) push({ t: 'text', text: text.slice(last, m.index) });
    if (m[1] !== undefined) push({ t: 'code', text: m[1] });
    else if (m[2] !== undefined) push({ t: 'bold', text: m[2] });
    else {
      const href = safeHref(m[4]);
      if (href) push({ t: 'link', text: m[3], href });
      else push({ t: 'text', text: m[3] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) push({ t: 'text', text: text.slice(last) });
  return out;
}

export function parseMarkdown(md) {
  let lines = String(md).replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1);
    if (end > 0) lines = lines.slice(end + 1);
  }
  const blocks = [];
  let para = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'para', inline: parseInline(para.join(' ')) });
    para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = /^```/.exec(line);
    if (fence) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) { flush(); blocks.push({ type: 'heading', level: h[1].length, text: h[2].trim() }); continue; }
    const li = /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(line);
    if (li) {
      flush();
      const ordered = /^\s*\d+\./.test(line);
      const items = [parseInline(li[1])];
      while (i + 1 < lines.length) {
        const nx = /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(lines[i + 1]);
        if (!nx) break;
        items.push(parseInline(nx[1]));
        i++;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    if (line.trim() === '') { flush(); continue; }
    para.push(line.trim());
  }
  flush();
  return blocks;
}
