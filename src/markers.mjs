// Generated regions inside hand-written files: <!-- gen:NAME:start --> ... <!-- gen:NAME:end -->.
// Multi-line content goes on its own lines; single-line content stays inline.

const startOf = (name) => `<!-- gen:${name}:start -->`;
const endOf = (name) => `<!-- gen:${name}:end -->`;

function count(text, needle) {
  let n = 0;
  for (let i = text.indexOf(needle); i !== -1; i = text.indexOf(needle, i + needle.length)) n++;
  return n;
}

export function hasRegion(text, name) {
  return count(text, startOf(name)) > 0;
}

export function replaceRegion(text, name, content) {
  const s = startOf(name);
  const e = endOf(name);
  const ns = count(text, s);
  const ne = count(text, e);
  if (ns === 0 || ne === 0) throw new Error(`marker ${name} missing`);
  if (ns > 1 || ne > 1) throw new Error(`marker ${name} duplicated`);
  const a = text.indexOf(s);
  const b = text.indexOf(e);
  if (b < a) throw new Error(`marker ${name} missing`);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const clean = String(content).replace(/\r\n/g, '\n').replace(/\n+$/, '');
  const body = clean.includes('\n') ? `${eol}${clean.replace(/\n/g, eol)}${eol}` : clean;
  return text.slice(0, a + s.length) + body + text.slice(b);
}
