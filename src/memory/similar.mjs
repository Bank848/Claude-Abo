// @browser-safe
// Jaccard similarity over word 5-gram shingles (lowercased, punctuation stripped).

const SHINGLE = 5;

export function words(text) {
  return String(text).toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/).filter(Boolean);
}

export function shingles(text) {
  const w = words(text);
  const out = new Set();
  if (w.length === 0) return out;
  if (w.length < SHINGLE) { out.add(w.join(' ')); return out; }
  for (let i = 0; i + SHINGLE <= w.length; i++) out.add(w.slice(i, i + SHINGLE).join(' '));
  return out;
}

export function similarity(a, b) {
  const A = shingles(a);
  const B = shingles(b);
  if (A.size === 0 && B.size === 0) return 1;
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const s of A) if (B.has(s)) inter++;
  return inter / (A.size + B.size - inter);
}

export function paragraphs(text) {
  const out = [];
  let line = 1;
  for (const chunk of String(text).split(/\n\s*\n/)) {
    const lead = /^\s*/.exec(chunk)[0].split('\n').length - 1;
    out.push({ text: chunk.trim(), line: line + lead });
    line += chunk.split('\n').length + 1;
  }
  return out.filter((p) => p.text);
}
