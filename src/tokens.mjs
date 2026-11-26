// @browser-safe
// Token estimate. A labelled estimate, not a tokenizer: ASCII ~4 chars per token,
// other scripts (Thai, CJK, ...) ~1.5 chars per token. Task 9 calibrates the constants.
export const ASCII_CHARS_PER_TOKEN = 4;
export const OTHER_CHARS_PER_TOKEN = 1.5;

export function estimateTokens(text) {
  let ascii = 0;
  let other = 0;
  for (const ch of String(text ?? '')) {
    if (ch.codePointAt(0) < 128) ascii++;
    else other++;
  }
  return Math.ceil(ascii / ASCII_CHARS_PER_TOKEN + other / OTHER_CHARS_PER_TOKEN);
}
