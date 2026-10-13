// rtl.mjs — a right-to-left language's pages (wave tr4, Persian). The English pages and their CSS are left exactly as they
// are; an rtl copy (build.mjs, a language whose LANGS dir is "rtl") is mirrored here, at build time:
//   - /style.rtl.css: style.css mirrored by rtlcss (margins, padding, left/right, text-align, borders, transforms), plus
//     the script's font (Vazirmatn, Google Fonts, the way style.css loads its own) and what Persian type needs (no
//     italics, no letter-spacing — both break the joined letters — and a little more line height on headings). The page's
//     link to /style.css points here instead.
//   - the page's own <style> blocks and style="" attributes, mirrored the same way (a "Next →" link's text-align:right).
//   - arrows in the text point the way the page reads: "Next →" becomes "← Next" in meaning ("بعدی ←"), the order of
//     pages doesn't change (next is still the higher page), only which way the arrow points.
//   - digits in the text as the language writes them (LANGS digits: Persian ۰–۹), except where a reader types or dials
//     them: a tel: link, a phone number, anything joined to Latin letters (P-17, 4th, a URL), code.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "parse5";
import rtlcss from "rtlcss";
import { ROOT } from "./lib.mjs";

const FONT = {
  fa: { url: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap", family: "'Vazirmatn'" },
};
const flip = (css) => rtlcss.process(css);

// style.css → style.rtl.css (written once per build; the version is its hash, as style.css?v= is)
let sheet = null;
export function rtlSheet() {
  if (sheet) return sheet;
  let css = flip(fs.readFileSync(path.join(ROOT, "style.css"), "utf8"));
  const imports = Object.values(FONT).map((f) => `@import url('${f.url}');`).join("\n");
  // the @imports must come before any rule: after style.css's own
  const at = css.match(/^[\s\S]*?@import[^;]+;\s*\n/);
  css = at ? at[0] + imports + "\n" + css.slice(at[0].length) : imports + "\n" + css;
  css += "\n/* ---- right-to-left type (scripts/i18n/rtl.mjs) ---- */\n" + Object.entries(FONT).map(([l, f]) => `html:lang(${l}){--font-display:${f.family},'Fraunces',Georgia,serif;--font-body:${f.family},system-ui,-apple-system,sans-serif;--font-ui:${f.family},system-ui,-apple-system,sans-serif}`).join("\n") + `
html[dir="rtl"] *{letter-spacing:0!important}
html:lang(fa) ol{list-style-type:persian}
html[dir="rtl"] em,html[dir="rtl"] i,html[dir="rtl"] cite,html[dir="rtl"] blockquote{font-style:normal}
html[dir="rtl"] em,html[dir="rtl"] i{font-weight:600}
html[dir="rtl"] h1,html[dir="rtl"] h2,html[dir="rtl"] h3,html[dir="rtl"] h4{line-height:1.45}
html[dir="rtl"] body{line-height:1.9}
html[dir="rtl"] input,html[dir="rtl"] textarea,html[dir="rtl"] select,html[dir="rtl"] button{font-family:var(--font-ui)}
html[dir="rtl"] .pb.br{right:auto;left:clamp(12px,3vw,24px)}
@media (min-width:900px){html[dir="rtl"] .pb.tl{right:auto;left:16px}}
html[dir="rtl"] .rs-langs a[lang],html[dir="rtl"] .rs-here,html[dir="rtl"] bdi{unicode-bidi:isolate}
`;
  fs.writeFileSync(path.join(ROOT, "style.rtl.css"), css);
  sheet = `/style.rtl.css?v=${crypto.createHash("sha1").update(css).digest("hex").slice(0, 10)}`;
  return sheet;
}

const ARROWS = { "→": "←", "←": "→", "›": "‹", "‹": "›", "⟶": "⟵", "⟵": "⟶", "▸": "◂", "◂": "▸", "▶": "◀", "◀": "▶", "↗": "↖", "↖": "↗" };
const swapArrows = (s) => s.replace(/[→←›‹⟶⟵▸◂▶◀↗↖]/g, (c) => ARROWS[c]);
const DIGITS = { fa: "۰۱۲۳۴۵۶۷۸۹" };
// numbers a reader dials, left in Latin digits (the crisis lines: 988 Canada and U.S., Iran's 123 / 1480 / 115) —
// unless the words just before make it a page ("صفحهٔ ۱۲۳")
const PHONE = /^(?:988|9-8-8|911|112|110|115|123|1480|1-\d{3}-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;
const PAGEWORD = /(صفحه|صفحات|ص\.|ص)\S*\s*$/;
function localDigits(s, lang) {
  const D = DIGITS[lang];
  if (!D) return s;
  return s.replace(/\d+(?:-\d+)*/g, (tok, at, all) => {
    const prev = all[at - 1] ?? "", prev2 = all[at - 2] ?? "", next = all[at + tok.length] ?? "";
    if (/[A-Za-z\/:@#?=&_%+]/.test(prev) || /[A-Za-z\/@_%]/.test(next)) return tok;
    if (/[-.]/.test(prev) && /[A-Za-z0-9]/.test(prev2)) return tok;
    if (PHONE.test(tok) && !PAGEWORD.test(all.slice(Math.max(0, at - 14), at))) return tok;
    return tok.replace(/\d/g, (d) => D[+d]);
  });
}
export const localText = (s, lang) => localDigits(swapArrows(s), lang);

const SKIP = new Set(["script", "style", "code", "pre", "kbd", "samp", "var", "textarea", "svg", "math"]);
const META = new Set(["description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"]);
const ATTRS = ["alt", "title", "aria-label", "placeholder"];
const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
// the places in a page whose text a reader sees: text nodes and the readable attributes, as [start, end, kind] ranges
function textRanges(html) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const out = [];
  const valueRange = (n, k) => {
    const l = n.sourceCodeLocation?.attrs?.[k];
    if (!l) return;
    const text = html.slice(l.startOffset, l.endOffset), m = /^[^=]+=\s*(["']?)/.exec(text);
    if (m) out.push([l.startOffset + m[0].length, l.endOffset - (m[1] ? 1 : 0), "attr"]);
  };
  const visit = (n, keep) => {
    if (n.tagName) {
      if (SKIP.has(n.tagName) || attr(n, "translate") === "no" || /\bnotranslate\b/.test(attr(n, "class") ?? "")) return;
      if (n.tagName === "a" && /^tel:/i.test(attr(n, "href") ?? "")) keep = true;
      for (const k of ATTRS) if (attr(n, k) != null) valueRange(n, k);
      if (n.tagName === "meta" && META.has(attr(n, "name") ?? attr(n, "property") ?? "")) valueRange(n, "content");
    }
    if (n.nodeName === "#text" && n.sourceCodeLocation) out.push([n.sourceCodeLocation.startOffset, n.sourceCodeLocation.endOffset, keep ? "keep" : "text"]);
    for (const c of n.childNodes ?? n.content?.childNodes ?? []) visit(c, keep);
  };
  visit(doc, false);
  return out.sort((a, b) => b[0] - a[0]);
}

// one built page in a right-to-left language → mirrored (call after everything else has been put in)
export function rtlPage(html, lang) {
  // its text
  for (const [s, e, kind] of textRanges(html)) {
    const t = html.slice(s, e);
    const v = kind === "keep" ? swapArrows(t) : localText(t, lang);
    if (v !== t) html = html.slice(0, s) + v + html.slice(e);
  }
  // the readings a page's script draws from its JSON data
  html = html.replace(/(<script\b[^>]*\btype="application\/json"[^>]*>)([\s\S]*?)(<\/script>)/gi, (m, open, body, close) => {
    let data; try { data = JSON.parse(body); } catch { return m; }
    const walk = (v) => Array.isArray(v) ? v.map(walk) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : typeof v === "string" && /\p{L}/u.test(v) && !/^(\/|https?:|#|[\w.-]+\.(?:png|jpe?g|webp|svg|pdf)$)/.test(v) ? v.replace(/(<[^>]*>)|([^<]+)/g, (x, tag, txt) => tag ?? localText(txt, lang)) : v;
    return open + JSON.stringify(walk(data)).replace(/<\//g, "<\\/") + close;
  });
  // its stylesheet, its own <style> blocks and style="" attributes, mirrored
  html = html.replace(/(href=")\/style\.css(?:\?v=[^"]*)?"/g, `$1${rtlSheet()}"`);
  html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, open, css, close) => open + flip(css) + close);
  html = html.replace(/(\sstyle=")([^"]*)"/g, (m, a, css) => { const f = flip(`x{${css}}`).replace(/^x\{|\}$/g, ""); return `${a}${f}"`; });
  return html;
}
