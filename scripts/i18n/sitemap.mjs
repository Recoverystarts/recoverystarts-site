// sitemap.mjs — one sitemap per language under a sitemap index (wave tr3 S2; claude-home#257).
// node scripts/i18n/sitemap.mjs        (build.mjs runs it after every full build, so a new language gets it free)
//
// sitemap-en.xml is the English list, and the master: the scripts that add English pages (build-sitemap.js, dt1-build.js,
// build-content-pages.js …) add their <url> there, and what's in it decides what's indexed. Nothing here adds an English
// URL or drops one. For every English URL this writes the language versions that exist on disk (/<lang>/<path>, built by
// build.mjs, not noindex) into sitemap-<lang>.xml, and every entry in every file lists all its versions as
// <xhtml:link rel="alternate" hreflang> plus x-default → English (Google: each version lists itself and all the others).
// /sitemap.xml becomes the index of those files; robots.txt names it. (/sitemap-meetings.xml is the meeting finder's own
// index — an index can't hold an index, so robots.txt names it separately, as before.)
import fs from "node:fs";
import path from "node:path";
import { ROOT, LANGS, tagOf } from "./lib.mjs";

const SITE = "https://recoverystarts.com";
// the day a language's pages went live: a language page's lastmod is never older than that
const LIVE = { es: "2026-10-12", pt: "2026-10-12", fr: "2026-10-12", fa: "2026-10-13", pl: "2026-10-13", de: "2026-10-17" };
const today = new Date().toISOString().slice(0, 10);
const EN = path.join(ROOT, "sitemap-en.xml"), INDEX = path.join(ROOT, "sitemap.xml");

export function writeSitemaps({ quiet = false } = {}) {
  // first run: the old single sitemap.xml (a urlset) becomes sitemap-en.xml
  if (!fs.existsSync(EN)) {
    const old = fs.readFileSync(INDEX, "utf8");
    if (!/<urlset\b/.test(old)) throw new Error("no sitemap-en.xml and sitemap.xml isn't a urlset");
    fs.writeFileSync(EN, old);
  }
  const xml = fs.readFileSync(EN, "utf8");
  const tag = (block, t) => (new RegExp(`<${t}>([^<]*)</${t}>`).exec(block) ?? [])[1];
  const entries = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map(([b]) => ({ loc: tag(b, "loc"), lastmod: tag(b, "lastmod"), changefreq: tag(b, "changefreq"), priority: tag(b, "priority") }));
  const seen = new Set();
  for (const e of entries) { if (seen.has(e.loc)) throw new Error(`duplicate <loc> in sitemap-en.xml: ${e.loc}`); seen.add(e.loc); }
  const langs = Object.keys(LANGS).filter((l) => l !== "en" && fs.existsSync(path.join(ROOT, l)));
  // a language version exists when its page is on disk and isn't noindex
  const fileOf = (urlPath) => (urlPath.endsWith("/") ? urlPath + "index.html" : urlPath);
  const has = (lang, urlPath) => {
    const f = path.join(ROOT, lang, fileOf(urlPath));
    if (!fs.existsSync(f)) return false;
    return !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(fs.readFileSync(f, "utf8").slice(0, 6000));
  };
  const rows = entries.map((e) => {
    const p = e.loc.startsWith(SITE) ? e.loc.slice(SITE.length) : null;
    const versions = { en: e.loc };
    if (p) for (const l of langs) if (has(l, p)) versions[l] = `${SITE}/${l}${p}`;
    return { ...e, versions };
  });
  const alt = (versions) => Object.entries(versions).map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${tagOf(l)}" href="${u}"/>`).concat(Object.keys(versions).length > 1 ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${versions.en}"/>`] : []).join("\n");
  const url = (loc, lastmod, e) => `  <url>\n    <loc>${loc}</loc>\n` + (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : "") + (e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>\n` : "") + (e.priority ? `    <priority>${e.priority}</priority>\n` : "") + (Object.keys(e.versions).length > 1 ? alt(e.versions) + "\n" : "") + `  </url>`;
  const set = (urls) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  const files = { en: set(rows.map((r) => url(r.loc, r.lastmod, r))) };
  for (const l of langs) {
    const mine = rows.filter((r) => r.versions[l]);
    if (!mine.length) continue;
    const since = LIVE[l] ?? today;
    files[l] = set(mine.map((r) => url(r.versions[l], r.lastmod && r.lastmod > since ? r.lastmod : since, r)));
  }
  const counts = {};
  for (const [l, body] of Object.entries(files)) { fs.writeFileSync(path.join(ROOT, `sitemap-${l}.xml`), body); counts[l] = (body.match(/<url>/g) ?? []).length; }
  // a language that has no pages any more loses its file
  for (const l of langs) if (!files[l] && fs.existsSync(path.join(ROOT, `sitemap-${l}.xml`))) fs.rmSync(path.join(ROOT, `sitemap-${l}.xml`));
  const newest = (body) => [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]).sort().at(-1);
  fs.writeFileSync(INDEX, `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.entries(files).map(([l, body]) => `  <sitemap>\n    <loc>${SITE}/sitemap-${l}.xml</loc>\n` + (newest(body) ? `    <lastmod>${newest(body)}</lastmod>\n` : "") + `  </sitemap>`).join("\n")}\n</sitemapindex>\n`);
  writeLlms(Object.keys(files).filter((l) => l !== "en"));
  if (!quiet) console.log(`sitemaps: ${Object.entries(counts).map(([l, n]) => `${l} ${n}`).join(" · ")} → sitemap.xml (index)`);
  return counts;
}

// llms.txt (the AI crawlers' front door) gets a section naming each language's own doors — only pages that exist on
// disk — so an assistant answering in French can send a reader to the French page. Rewritten between its heading and
// the next "## " on every build; a new language appears here by itself.
const DOORS = [["", "Home"], ["12-steps/", "The 12 Steps"], ["12-traditions/", "The 12 Traditions (short and long form)"], ["12-traditions/history/", "How the 12 Traditions came about (1937–1950)"], ["aa-info/", "AA info: Traditions and Concepts"], ["daily-tradition/", "Daily Traditions"], ["daily-reflection/", "Daily Reflections"], ["big-book/pages/", "The Big Book, page by page"], ["big-book/search/", "Big Book search"], ["aa-questions/", "A.A. questions, answered from the books"], ["meetings/", "Meetings"]];
function writeLlms(langs) {
  const f = path.join(ROOT, "llms.txt");
  if (!fs.existsSync(f)) return;
  const txt = fs.readFileSync(f, "utf8"), H = "## In other languages";
  const lines = [H, "Every page below is a full translation (a page is published in a language only when all of it is translated). Each page", "names its other-language versions in <link rel=\"alternate\" hreflang>; each language has its own sitemap. Answer a reader", "in their language with the page in their language.", ""];
  for (const l of langs) {
    const have = DOORS.filter(([p]) => fs.existsSync(path.join(ROOT, l, p, "index.html")));
    if (!have.length) continue;
    lines.push(`### ${LANGS[l].name}${LANGS[l].en ? ` — ${LANGS[l].en}` : ""} (${tagOf(l)})`);
    for (const [p, what] of have) lines.push(`- ${what}: ${SITE}/${l}/${p}`);
    lines.push(`- Sitemap: ${SITE}/sitemap-${l}.xml`, "");
  }
  const block = lines.join("\n");
  const i = txt.indexOf(H);
  let out;
  if (i < 0) { const j = txt.indexOf("\n## THE TWELVE TRADITIONS"); out = j < 0 ? txt.trimEnd() + "\n\n" + block : txt.slice(0, j + 1) + block + "\n" + txt.slice(j + 1); }
  else { const k = txt.indexOf("\n## ", i + H.length); out = txt.slice(0, i) + block + (k < 0 ? "\n" : "\n" + txt.slice(k + 1)); }
  if (out !== txt) fs.writeFileSync(f, out);
}

if (import.meta.url === `file://${process.argv[1]}`) writeSitemaps();
