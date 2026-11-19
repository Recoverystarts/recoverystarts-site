// restamp.mjs — give every built language page the current 🌐 and hreflang alternates without rebuilding its text.
// node scripts/i18n/restamp.mjs [lang …]   (default: every built language)
// Touches only the 🌐 (globe.mjs stampGlobe) and the <link rel="alternate" hreflang> lines, taking which languages a
// page exists in from the folders on disk, so older translated pages are kept. Running it twice changes nothing.
import fs from "node:fs";
import path from "node:path";
import { ROOT, I18N, LANGS, tagOf, readJson } from "./lib.mjs";
import { stampGlobe } from "./globe.mjs";
import { flip } from "./rtl.mjs";

const SITE = "https://recoverystarts.com";
const pageIds = readJson(path.join(I18N, "segments", "pages.json"), null);
const urlOf = (rel) => "/" + rel.replace(/(^|\/)index\.html$/, "$1");
const codes = Object.keys(LANGS).filter((l) => l !== "en");
const want = process.argv.slice(2).length ? process.argv.slice(2) : codes;
const onDisk = (l, rel) => fs.existsSync(path.join(ROOT, l, rel));
let changed = 0, seen = 0;
for (const lang of want) {
  if (!LANGS[lang] || lang === "en") throw new Error(`not a built language: ${lang}`);
  for (const rel of Object.keys(pageIds)) {
    const file = path.join(ROOT, lang, rel);
    if (!fs.existsSync(file)) continue;
    seen++;
    const html = fs.readFileSync(file, "utf8");
    const others = codes.filter((l) => l !== lang && onDisk(l, rel));
    // the head, in build.mjs's order: en, this language, the others in LANGS order, then x-default
    const alts = [["en", `${SITE}${urlOf(rel)}`], [lang, `${SITE}/${lang}${urlOf(rel)}`], ...others.map((l) => [l, `${SITE}/${l}${urlOf(rel)}`])];
    const lines = [...alts.map(([l, u]) => `<link rel="alternate" hreflang="${tagOf(l)}" href="${u}">`), `<link rel="alternate" hreflang="x-default" href="${SITE}${urlOf(rel)}">`].map((x) => `  ${x}\n`).join("");
    let out = html.replace(/^[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*">[ \t]*\r?\n/gm, "");
    out = out.replace(/(^[ \t]*<link rel="canonical"[^>]*>[ \t]*\r?\n)/m, (m) => m + lines);
    const avail = { en: urlOf(rel), [lang]: `/${lang}${urlOf(rel)}`, ...Object.fromEntries(others.map((l) => [l, `/${l}${urlOf(rel)}`])) };
    out = stampGlobe(out, lang, avail);
    // a right-to-left page: the 🌐's own style block mirrored, as build.mjs's rtlPage does for every <style>
    if (LANGS[lang].dir === "rtl") out = out.replace(/(<style id="rs-globe-css">)([\s\S]*?)(<\/style>)/, (m, a, css, b) => a + flip(css) + b);
    if (out !== html) { fs.writeFileSync(file, out); changed++; }
  }
}
console.log(`restamp: ${changed} of ${seen} built page(s) changed (${want.join(", ")})`);
