// build.mjs — write /<lang>/… copies of every page whose text is all translated (wave tr1 S1; WO-TRANSLATE-SITE v2).
// node scripts/i18n/build.mjs <lang> [--only <path-prefix>,…]
// For each English page: every segment (lib.mjs segmentsOf) is swapped for its translation in i18n/<lang>/*.json; a page
// with even one segment missing is NOT written (the 🌐 then doesn't offer that language there — no half-translated page).
// The copy gets <html lang dir>, its own canonical, hreflang alternates for the languages it exists in, og:locale and
// og:url, and its links to pages that exist in the same language point at those (/es/about/, not /about/).
// The folder /<lang>/ is rebuilt from scratch each run, so it's always exactly what the translation files cover.
import fs from "node:fs";
import path from "node:path";
import { ROOT, I18N, LANGS, segmentsOf, idOf, translations, readJson, fromTemplate } from "./lib.mjs";
import { stampGlobe } from "./globe.mjs";

const lang = process.argv[2];
if (!lang || !LANGS[lang] || lang === "en") { console.error(`usage: build.mjs <${Object.keys(LANGS).filter((x) => x !== "en").join("|")}> [--only prefix,…]`); process.exit(2); }
const only = (() => { const i = process.argv.indexOf("--only"); return i > 0 ? process.argv[i + 1].split(",").map((s) => s.replace(/^\//, "")) : null; })();
const SITE = "https://recoverystarts.com";
const OG = { es: "es_LA", "pt-BR": "pt_BR", fr: "fr_CA", de: "de_DE", fa: "fa_IR", en: "en_US" };

const pageIds = readJson(path.join(I18N, "segments", "pages.json"), null);
if (!pageIds) { console.error("run extract.mjs first"); process.exit(2); }
const tr = translations(lang);
// a page path → its URL path, and back
const urlOf = (rel) => "/" + rel.replace(/(^|\/)index\.html$/, "$1");
const relOf = (url) => { const u = url.replace(/[?#].*$/, ""); if (!u.startsWith("/")) return null; const r = u.slice(1); return r === "" ? "index.html" : r.endsWith("/") ? r + "index.html" : r.endsWith(".html") ? r : r + "/index.html"; };

// which pages this language can have, and which every other built language already has (for hreflang)
const ready = new Set(Object.entries(pageIds).filter(([rel, ids]) => ids.every((id) => tr[id] != null)).map(([rel]) => rel));
const other = {};
for (const l of Object.keys(LANGS)) if (l !== "en" && l !== lang) { const t = translations(l); other[l] = new Set(Object.entries(pageIds).filter(([, ids]) => ids.length && ids.every((id) => t[id] != null)).map(([r]) => r)); }

// the phrasebook for script-written words, if the language has one (i18n/<lang>/_phrases.json — not a segment file)
const ph = readJson(path.join(I18N, lang, "_phrases.json"), null);
const book = ph ? JSON.stringify({ p: ph.p, r: ph.r ?? [], skip: ph.skip ?? "" }).replace(/</g, "\\u003c") : null;
const outDir = path.join(ROOT, lang);
if (!only) fs.rmSync(outDir, { recursive: true, force: true });
const L = LANGS[lang];
let built = 0;
const globes = new Map();
for (const rel of Object.keys(pageIds)) {
  if (!ready.has(rel)) continue;
  if (only && !only.some((p) => rel.startsWith(p))) continue;
  let html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const segs = segmentsOf(html);
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], t = tr[idOf(s.en)];
    if (t == null) throw new Error(`${rel}: segment ${idOf(s.en)} has no ${lang} (extract is out of date — run extract.mjs)`);
    html = html.slice(0, s.start) + (s.kind === "attr" ? t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) : fromTemplate(t, s.en)) + html.slice(s.end);
  }
  // links to pages that exist in this language
  // …and the meeting finder (the same origin, its own language switch: ?hl=<lang>)
  html = html.replace(/(\shref=")(\/[^"]*)"/g, (m, a, url) => {
    const r = relOf(url);
    if (r && ready.has(r)) return `${a}/${lang}${url}"`;
    if (/^\/(meetings|online)(\/|$)/.test(url) && !/[?&]hl=/.test(url)) { const [p, h = ""] = url.split("#"); return `${a}${p}${p.includes("?") ? "&amp;" : "?"}hl=${lang}${h ? "#" + h : ""}"`; }
    return m;
  });
  // the head: language, direction, canonical, alternates, og
  const url = `${SITE}/${lang}${urlOf(rel)}`;
  html = html.replace(/<html\b[^>]*>/i, `<html lang="${lang}"${L.dir === "rtl" ? ' dir="rtl"' : ""}>`);
  html = html.replace(/^[ \t]*<link rel="(?:canonical|alternate)"[^>]*>[ \t]*\r?\n/gim, "").replace(/<link rel="(?:canonical|alternate)"[^>]*>/gi, "");
  const alts = [["en", `${SITE}${urlOf(rel)}`], [lang, url], ...Object.entries(other).filter(([, s]) => s.has(rel)).map(([l]) => [l, `${SITE}/${l}${urlOf(rel)}`])];
  const head = [`<link rel="canonical" href="${url}">`, ...alts.map(([l, u]) => `<link rel="alternate" hreflang="${l}" href="${u}">`), `<link rel="alternate" hreflang="x-default" href="${SITE}${urlOf(rel)}">`].map((x) => `  ${x}\n`).join("");
  html = html.replace(/<\/head>/i, () => `${head}</head>`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*"/i, `$1${OG[lang] ?? lang}"`);
  if (!/property="og:locale"/i.test(html)) html = html.replace(/(<meta property="og:type"[^>]*>)/i, `$1\n  <meta property="og:locale" content="${OG[lang] ?? lang}">`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/i, `$1${url}"`);
  // words the site's own scripts write in the browser (donate.js, play-badge.js): the phrasebook, /rs-t.js
  if (book) { const tag = `<script>window.RS_T=${book};</script><script src="/rs-t.js?v=1"></script>\n</body>`; html = html.replace(/<\/body>/i, () => tag); }
  // the 🌐: English, this language, and every other language this page is built in
  const avail = { en: urlOf(rel), [lang]: `/${lang}${urlOf(rel)}`, ...Object.fromEntries(Object.entries(other).filter(([, s]) => s.has(rel)).map(([l]) => [l, `/${l}${urlOf(rel)}`])) };
  html = stampGlobe(html, lang, avail);
  globes.set(rel, avail);
  const dest = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  built++;
}
// …and on the English page itself, so a reader can switch from where they are (the English page gets the globe and its
// hreflang alternates; nothing else in it changes). A page with no translation loses a globe it no longer needs.
if (!only) for (const rel of Object.keys(pageIds)) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, "utf8");
  const avail = globes.get(rel) ?? { en: urlOf(rel), ...Object.fromEntries(Object.entries(other).filter(([, s]) => s.has(rel)).map(([l]) => [l, `/${l}${urlOf(rel)}`])) };
  let out = stampGlobe(html, "en", avail);
  out = out.replace(/^[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*" data-i18n>\r?\n/gm, "");
  if (Object.keys(avail).length > 1) {
    const alts = Object.entries(avail).map(([l, u]) => `<link rel="alternate" hreflang="${l}" href="${SITE}${u}" data-i18n>`).concat(`<link rel="alternate" hreflang="x-default" href="${SITE}${urlOf(rel)}" data-i18n>`);
    out = out.replace(/<\/head>/i, () => alts.map((x) => `  ${x}\n`).join("") + "</head>");
  }
  if (out !== html) fs.writeFileSync(file, out);
}
const total = Object.keys(pageIds).length;
console.log(`${lang}: ${built} pages written to /${lang}/ (${ready.size} of ${total} pages fully translated; ${Object.keys(tr).length} translated segments)`);
