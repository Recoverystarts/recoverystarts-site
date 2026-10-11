// extract.mjs — every page's text into one list (wave tr1 S1; claude-home secrets-docs/WO-TRANSLATE-SITE.md).
// Writes i18n/segments/<part>.json: { id: { t, kind, pages: [path, …] } } — t is the English with its tags as numbered
// placeholders (lib.mjs toTemplate), the form a translation is written in, one file per part (core, big-book,
// daily-reflection, …). A segment is in the part where it's met first; core pages are read first, so the menu and the
// footer, which every page repeats, are in core.json once. Also i18n/segments/pages.json: path → [ids], which build.mjs
// and check.mjs use. Run from anywhere: node scripts/i18n/extract.mjs
import fs from "node:fs";
import path from "node:path";
import { ROOT, I18N, pages, partOf, segmentsOf, idOf, writeJson, toTemplate } from "./lib.mjs";

const parts = {}, pageIds = {}, seenIn = new Map();
let n = 0, words = 0;
for (const rel of pages()) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const ids = [];
  for (const s of segmentsOf(html)) {
    const id = idOf(s.en);
    ids.push(id);
    let part = seenIn.get(id);
    if (!part) {
      part = partOf(rel);
      seenIn.set(id, part);
      (parts[part] ??= {})[id] = { t: toTemplate(s.en).t, kind: s.kind, pages: [] };
      n++; words += s.en.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    }
    const seg = parts[part][id];
    if (seg.pages.length < 5 && !seg.pages.includes(rel)) seg.pages.push(rel); // a few, for context; pages.json has all
  }
  pageIds[rel] = [...new Set(ids)];
}
fs.rmSync(path.join(I18N, "segments"), { recursive: true, force: true });
for (const [part, segs] of Object.entries(parts)) writeJson(path.join(I18N, "segments", `${part}.json`), segs);
writeJson(path.join(I18N, "segments", "pages.json"), pageIds);
const per = Object.entries(parts).map(([p, s]) => `${p} ${Object.keys(s).length}`).join(" · ");
console.log(`${Object.keys(pageIds).length} pages · ${n} unique segments · ${words.toLocaleString("en")} words · ${per}`);
