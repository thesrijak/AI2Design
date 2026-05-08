/**
 * Tiny JSON syntax highlighter.
 * Takes a raw JSON string and returns an HTML string with
 * <span class="tok-*"> wrappers for syntax colouring.
 * No external dependencies.
 *
 * Token classes (mapped to CSS vars in code.css):
 *   tok-key     — object keys
 *   tok-string  — string values
 *   tok-number  — numeric values
 *   tok-bool    — true / false
 *   tok-null    — null
 *   tok-brace   — { } [ ]
 *   tok-colon   — :
 */

const TOKENS = [
  // Keys  (must come before strings)
  {
    re: /"((?:[^"\\]|\\.)*)"\s*(?=:)/g,
    fn: (m, k) => `<span class="tok-key">"${escHtml(k)}"</span>`,
  },
  // String values
  {
    re: /"((?:[^"\\]|\\.)*)"/g,
    fn: (m, v) => `<span class="tok-string">"${escHtml(v)}"</span>`,
  },
  // Numbers
  {
    re: /\b(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
    fn: (m) => `<span class="tok-number">${m}</span>`,
  },
  // Booleans
  {
    re: /\b(true|false)\b/g,
    fn: (m) => `<span class="tok-bool">${m}</span>`,
  },
  // Null
  {
    re: /\bnull\b/g,
    fn: () => `<span class="tok-null">null</span>`,
  },
  // Braces / brackets
  {
    re: /([{}[\]])/g,
    fn: (m) => `<span class="tok-brace">${m}</span>`,
  },
];

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Highlight a JSON string.
 * @param {string} json
 * @returns {string} HTML string safe for innerHTML
 */
export function highlight(json) {
  // Escape the full string first, then apply regex replacements.
  // We work on the raw string and escape per-token to avoid double-escaping.
  let out = escHtml(json);

  // Re-run replacements on plain text; regex can still find patterns
  // because escaping only affects <, >, &, " — not the JSON structure chars.
  // Reset regex lastIndex before each run.
  out = out
    .replace(
      // Keys
      /&quot;((?:[^&]|&(?!quot;))*?)&quot;\s*(?=:)/g,
      (m, k) => `<span class="tok-key">&quot;${k}&quot;</span>`,
    )
    .replace(
      // String values (not followed by colon)
      /&quot;((?:[^&]|&(?!quot;))*?)&quot;(?!\s*:)/g,
      (m, v) => `<span class="tok-string">&quot;${v}&quot;</span>`,
    )
    .replace(
      /\b(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
      (m) => `<span class="tok-number">${m}</span>`,
    )
    .replace(/\b(true|false)\b/g, (m) => `<span class="tok-bool">${m}</span>`)
    .replace(/\bnull\b/g, `<span class="tok-null">null</span>`)
    .replace(/([{}[\]])/g, (m) => `<span class="tok-brace">${m}</span>`);

  return out;
}
