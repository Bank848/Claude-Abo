// Hash of the English README above its <details> block, with generated regions stripped (what translations mirror).
import { createHash } from 'node:crypto';

const REGION = /(<!-- gen:([\w-]+):start -->)[\s\S]*?(<!-- gen:\2:end -->)/g;

export function sourceHash(readmeText) {
  const lf = readmeText.replace(/\r\n/g, '\n');
  const cut = lf.indexOf('<details>');
  const top = (cut === -1 ? lf : lf.slice(0, cut)).replace(REGION, '$1$3');
  return createHash('sha256').update(top).digest('hex').slice(0, 12);
}

export const HASH_LINE = /^<!-- abo:source-hash:([0-9a-f]{12}) -->\s*$/m;
export const hashLine = (h) => `<!-- abo:source-hash:${h} -->`;

// Puts the hash line right under the language nav line (line 1); replaces an existing one.
export function setHashLine(text, h) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const at = lines.findIndex((l) => HASH_LINE.test(l));
  if (at !== -1) lines[at] = hashLine(h);
  else lines.splice(1, 0, hashLine(h));
  return lines.join(eol);
}
