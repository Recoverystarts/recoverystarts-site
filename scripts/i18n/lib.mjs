// lib.mjs — the shared half of the translation pipeline (WO-TRANSLATE-SITE v2, claude-home secrets-docs; wave tr1).
//
// A page's text is cut into SEGMENTS: the inside of the innermost element that holds text and nothing but text and
// inline tags (a paragraph, a heading, a list item, a button, a link, the <title>), plus the words in a few attributes
// (alt, title, aria-label, placeholder) and the description/social meta tags. Inline tags (a link, bold) stay INSIDE the
// segment, so a translator sees the whole sentence and puts the link where Spanish needs it. A segment's id is a hash of
// its English with the whitespace folded, so a sentence used on 1,401 pages (the menu, the footer) is one id.
//
// extract.mjs writes every segment to i18n/segments/<part>.json; a language is i18n/<lang>/*.json (id → translation);
// build.mjs writes /<lang>/<path>/index.html for every page whose segments are all translated.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "parse5";

export const ROOT = path.resolve(import.meta.dirname, "..", "..");
export const I18N = path.join(ROOT, "i18n");

// the languages the site can be built in (code → its own name, direction; en: its English name, where the own name is in
// another script (llms.txt names it both ways); tag: the BCP-47 tag a page and its hreflang
// carry when it's more than the code — pt is built at /pt/ and marked pt-BR). A language is live on a page only when
// i18n/<code>/ covers every segment of that page.
export const LANGS = {
  en: { name: "English", dir: "ltr" },
  es: { name: "Español", dir: "ltr" },
  pt: { name: "Português", dir: "ltr", tag: "pt-BR" },
  fr: { name: "Français", dir: "ltr" },
  fa: { name: "فارسی", dir: "rtl", en: "Persian" },
  pl: { name: "Polski", dir: "ltr", en: "Polish" },
  de: { name: "Deutsch", dir: "ltr", en: "German" },
};

const SKIP_TAGS = new Set(["script", "style", "noscript", "svg", "template", "code", "pre", "math", "iframe", "canvas", "video", "audio"]);
const INLINE = new Set(["a", "b", "strong", "em", "i", "span", "small", "br", "sup", "sub", "abbr", "cite", "q", "mark", "u", "time", "s", "wbr", "bdi", "bdo", "kbd", "var", "dfn", "data", "img"]);
const ATTRS = ["alt", "title", "aria-label", "placeholder"];
const META = new Set(["description", "og:title", "og:description", "og:image:alt", "twitter:title", "twitter:description", "twitter:image:alt"]);
const LETTER = /\p{L}/u;

// the tag a language is marked with in <html lang>, hreflang and the 🌐 (pt → pt-BR; es → es)
export const tagOf = (code) => LANGS[code]?.tag ?? code;
export const fold = (s) => s.replace(/\s+/g, " ").trim();
export const idOf = (s) => crypto.createHash("sha1").update(fold(s)).digest("hex").slice(0, 12);
// a page's "part": its first path folder; the root page and the few small folders are "core"
const CORE = new Set(["", "about", "aa-info", "meetings", "add-meeting", "download", "404.html", "index.html"]);
export const partOf = (rel) => { const top = rel.split("/")[0]; return CORE.has(top) || !rel.includes("/") ? "core" : top; };

// every page a language can be built from: the English pages, never a built /<lang>/ copy
export function pages() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name), rel = path.relative(ROOT, p).split(path.sep).join("/");
      if (e.isDirectory()) {
        if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "scripts" || e.name === "i18n" || e.name === "functions" || e.name === "assets" || e.name === "data" || e.name === "grok-handoff") continue;
        if (dir === ROOT && LANGS[e.name] && e.name !== "en") continue; // a built language folder
        walk(p);
      } else if (e.name.endsWith(".html") && !/^google[0-9a-f]+\.html$/.test(e.name)) out.push(rel);
    }
  };
  walk(ROOT);
  // core first, so the menu and footer land in core.json, then by path
  return out.sort((a, b) => (partOf(a) === "core") - (partOf(b) === "core") ? (partOf(a) === "core" ? -1 : 1) : a.localeCompare(b));
}

const hasText = (n) => (n.nodeName === "#text" ? LETTER.test(n.value) : (n.childNodes ?? []).some(hasText));
const attr = (n, k) => n.attrs?.find((a) => a.name === k)?.value;
// …and the language globe (globe.mjs), whose every word is already in its own language
const skipped = (n) => SKIP_TAGS.has(n.nodeName) || attr(n, "translate") === "no" || /\b(notranslate|rs-globe)\b/.test(attr(n, "class") ?? "") || attr(n, "type") === "application/ld+json";

// The segments of one HTML string: [{ kind: "html"|"attr", start, end, en }] with source offsets, in document order.
export function segmentsOf(html) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  const segs = [];
  const add = (start, end, kind) => {
    if (start == null || end == null || end <= start) return;
    const raw = html.slice(start, end);
    // trim, keeping offsets
    const lead = raw.length - raw.trimStart().length, trail = raw.length - raw.trimEnd().length;
    const s = start + lead, e = end - trail;
    if (e <= s) return;
    const en = html.slice(s, e);
    if (!LETTER.test(en.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, ""))) return;
    segs.push({ kind, start: s, end: e, en });
  };
  const attrs = (n) => {
    const loc = n.sourceCodeLocation?.attrs;
    if (!loc) return;
    for (const k of ATTRS) if (loc[k] && LETTER.test(attr(n, k) ?? "")) valueRange(n, k, loc[k]);
    if (n.nodeName === "meta" && loc.content && META.has(attr(n, "name") ?? attr(n, "property") ?? "")) valueRange(n, "content", loc.content);
  };
  const valueRange = (n, k, l) => {
    const text = html.slice(l.startOffset, l.endOffset); // k="value"
    const m = /^[^=]+=\s*(["']?)/.exec(text);
    if (!m) return;
    const s = l.startOffset + m[0].length, e = l.endOffset - (m[1] ? 1 : 0);
    add(s, e, "attr");
  };
  const inlineOnly = (n) => (n.childNodes ?? []).every((c) => c.nodeName === "#text" || c.nodeName === "#comment" || (INLINE.has(c.nodeName) && inlineOnly(c)));
  const visit = (n) => {
    if (n.nodeName && n.nodeName !== "#text" && n.nodeName !== "#comment" && n.nodeName !== "#document" && skipped(n)) return;
    if (n.tagName) attrs(n);
    const kids = n.childNodes ?? (n.content?.childNodes ?? []);
    if (n.tagName && kids.length && hasText(n) && inlineOnly(n)) {
      // the whole inside is one segment; its inline children's attributes too
      const first = kids[0].sourceCodeLocation, last = kids[kids.length - 1].sourceCodeLocation;
      add(first?.startOffset, last?.endOffset, "html");
      const deep = (c) => { if (c.tagName) { attrs(c); (c.childNodes ?? []).forEach(deep); } };
      kids.forEach(deep);
      return;
    }
    for (const c of kids) {
      if (c.nodeName === "#text") { if (LETTER.test(c.value)) add(c.sourceCodeLocation?.startOffset, c.sourceCodeLocation?.endOffset, "html"); }
      else visit(c);
    }
  };
  visit(doc);
  return segs.sort((a, b) => a.start - b.start);
}

export const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
export const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 1) + "\n"); };
// every translation for a language, all files merged: id → text
export function translations(lang) {
  const dir = path.join(I18N, lang), out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".json") && !f.startsWith("_")) Object.assign(out, readJson(path.join(dir, f), {}));
  return out;
}
// the tags inside a segment, in order, by name (a translation must keep the same set)
export const tagsOf = (s) => [...s.matchAll(/<\/?([a-zA-Z][\w-]*)\b[^>]*>/g)].map((m) => (m[0][1] === "/" ? "/" : "") + m[1].toLowerCase()).sort();
export const hrefsOf = (s) => [...s.matchAll(/\bhref\s*=\s*"([^"]*)"/g)].map((m) => m[1]).sort();

// ---- the translator's form of a segment: tags as numbered placeholders, so nobody retypes a class or a URL.
// "Call or text <a href=\"tel:988\">988</a>.<br>" ⇄ "Call or text <0>988</0>.<1/>". A translation is written in this form;
// build.mjs puts the original tags back (fromTemplate). The same tag numbers must appear in a translation, in whatever
// order the language needs.
const VOID = new Set(["br", "img", "wbr", "hr", "input"]);
export function toTemplate(en) {
  const tags = [], stack = [];
  const t = en.replace(/<(\/?)([a-zA-Z][\w-]*)\b[^>]*?(\/?)>/g, (m, close, name, self) => {
    name = name.toLowerCase();
    if (close) { const i = stack.pop(); if (i == null) return m; tags[i].close = m; return `</${i}>`; }
    const i = tags.length;
    tags.push({ open: m, close: `</${name}>` });
    if (VOID.has(name) || self) return `<${i}/>`;
    stack.push(i);
    return `<${i}>`;
  });
  return { t: t.replace(/\s+/g, " ").trim(), tags };
}
export const placeholdersOf = (t) => [...String(t).matchAll(/<\/?(\d+)\/?>/g)].map((m) => m[0]).sort();
export function fromTemplate(tr, en) {
  const { tags } = toTemplate(en);
  // anything that isn't a placeholder is text: escape a stray < > and a bare &
  const safe = String(tr).replace(/<(\/?\d+\/?)>|[<>]|&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, (m, ph) => (ph ? m : m === "<" ? "&lt;" : m === ">" ? "&gt;" : "&amp;"));
  return safe.replace(/<(\/?)(\d+)(\/?)>/g, (m, close, i, self) => { const g = tags[+i]; if (!g) return ""; return close ? g.close : g.open; });
}
