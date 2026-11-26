// @browser-safe
// Minimal frontmatter reader for SKILL.md and memory files. It is NOT a YAML parser:
// it handles `key: value`, quoted values, `key: |` / `key: >-` blocks, indented
// plain-scalar continuation lines, and one level of nested map (becomes dotted keys).

function unquote(v) {
  const t = v.trim();
  if (t.length >= 2 && ((t[0] === '"' && t.at(-1) === '"') || (t[0] === "'" && t.at(-1) === "'"))) {
    return t.slice(1, -1);
  }
  return t;
}

export function parseFrontmatter(text) {
  const src = String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const m = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(src);
  if (!m) return { data: {}, body: src };
  const body = src.slice(m[0].length);
  const lines = m[1].split('\n');
  const data = {};
  let i = 0;
  const indentOf = (l) => /^[ \t]*/.exec(l)[0].length;
  while (i < lines.length) {
    const line = lines[i];
    const km = /^([A-Za-z0-9_.-]+):[ \t]*(.*)$/.exec(line);
    if (!km || indentOf(line) > 0) { i++; continue; }
    const key = km[1];
    const rest = km[2];
    i++;
    const block = [];
    while (i < lines.length && (lines[i].trim() === '' || indentOf(lines[i]) > 0)) block.push(lines[i++]);
    while (block.length && block.at(-1).trim() === '') block.pop();
    if (/^[|>][+-]?$/.test(rest)) {
      const strip = Math.min(...block.filter((l) => l.trim()).map(indentOf), Infinity);
      const parts = block.map((l) => (l.trim() ? l.slice(strip) : ''));
      data[key] = rest[0] === '|' ? parts.join('\n') : parts.join(' ').replace(/\s+/g, ' ').trim();
    } else if (rest === '' && block.length && block.every((l) => !l.trim() || /^[ \t]+[A-Za-z0-9_.-]+:/.test(l))) {
      for (const l of block) {
        const nm = /^[ \t]+([A-Za-z0-9_.-]+):[ \t]*(.*)$/.exec(l);
        if (nm) data[`${key}.${nm[1]}`] = unquote(nm[2]);
      }
    } else {
      const joined = [rest, ...block.map((l) => l.trim())].filter((s) => s !== '').join(' ');
      data[key] = unquote(joined);
    }
  }
  return { data, body };
}
