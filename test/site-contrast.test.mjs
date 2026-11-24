import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../site/style.css', import.meta.url), 'utf8');

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[m[1]] = m[2];
  return out;
}
const light = tokens(css.slice(css.indexOf(':root {'), css.indexOf('@media (prefers-color-scheme: dark)')));
const dark = tokens(css.slice(css.indexOf(':root[data-theme="dark"]'), css.indexOf('* { box-sizing')));

const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
export function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [foreground, background, minimum]
const TEXT = [
  ['text', 'bg', 4.5], ['text', 'surface', 4.5], ['muted', 'bg', 4.5], ['muted', 'surface', 4.5],
  ['accent', 'bg', 4.5], ['accent', 'surface', 4.5], ['accent-text', 'accent', 4.5],
  ['mark-text', 'mark', 4.5], ['margin', 'surface', 4.5], ['margin', 'bg', 4.5],
  ['ok', 'bg', 4.5], ['ok', 'surface', 4.5], ['focus', 'bg', 3], ['focus', 'surface', 3],
  ['faint', 'surface', 3],
];

for (const [name, set] of [['light', light], ['dark', dark]]) {
  test(`site colours meet WCAG AA in ${name}`, () => {
    for (const [fg, bg, min] of TEXT) {
      assert.ok(set[fg] && set[bg], `${name}: missing --${fg} or --${bg}`);
      const r = ratio(set[fg], set[bg]);
      assert.ok(r >= min, `${name}: --${fg} on --${bg} is ${r.toFixed(2)}, needs ${min}`);
    }
  });
}
