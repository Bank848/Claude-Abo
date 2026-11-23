// @browser-safe
// Gate for public example files. `files` = [{file, text}], `realNotes` = [{body}] (empty in CI).
import { parseFrontmatter } from '../frontmatter.mjs';
import { paragraphs, similarity, words } from './similar.mjs';

export const NEAR_COPY = 0.35;
export const MIN_PARAGRAPH_WORDS = 40;
const REAL_MIN_WORDS = 20;
const RARE_MIN_LEN = 8;
const RARE_MAX_NOTES = 2;
const RARE_SHARED = 3;
const PUBLIC_DIRS = [/^examples\//, /^learn\//, /^global-config\//, /^\.claude\/commands\//];

const isMd = (f) => f.endsWith('.md');
const isMemoryExample = (f) => /^examples\/memory\/[^/]+\.md$/.test(f) && !/\/README\.md$/.test(f);

export function gate({ files, privateList: _privateList = [], realNotes = [] }) {
  const findings = [];
  const add = (file, line, rule, severity, message) => findings.push({ file, line, rule, severity, message });

  for (const f of files) {
    if (isMemoryExample(f.file) && parseFrontmatter(f.text).data.rewritten !== 'true') {
      add(f.file, 1, 'rewritten-flag', 'error', 'memory example must carry frontmatter "rewritten: true" (written from scratch, not edited from a real note)');
    }
  }
  if (realNotes.length === 0) return findings;

  const realParas = realNotes.flatMap((n) => paragraphs(n.body).filter((p) => words(p.text).length >= REAL_MIN_WORDS).map((p) => p.text));
  const noteWords = realNotes.map((n) => new Set(words(n.body).filter((w) => w.length >= RARE_MIN_LEN)));
  const freq = new Map();
  for (const s of noteWords) for (const w of s) freq.set(w, (freq.get(w) ?? 0) + 1);

  for (const f of files) {
    if (!isMd(f.file) || !PUBLIC_DIRS.some((re) => re.test(f.file))) continue;
    for (const p of paragraphs(f.text)) {
      if (words(p.text).length < MIN_PARAGRAPH_WORDS) continue;
      let best = 0;
      for (const r of realParas) best = Math.max(best, similarity(p.text, r));
      if (best >= NEAR_COPY) add(f.file, p.line, 'near-copy', 'error', `paragraph is a near copy of a real memory note (similarity ${best.toFixed(2)}); rewrite it from a lesson outline`);
    }
    if (isMemoryExample(f.file)) {
      const mine = new Set(words(f.text).filter((w) => w.length >= RARE_MIN_LEN));
      noteWords.forEach((s, i) => {
        let shared = 0;
        for (const w of mine) if (s.has(w) && (freq.get(w) ?? 0) <= RARE_MAX_NOTES) shared++;
        if (shared >= RARE_SHARED) add(f.file, 1, 'rare-term', 'warn', `shares ${shared} rare words with one real note (note #${i + 1}); check it is not a paraphrase`);
      });
    }
  }
  return findings;
}
