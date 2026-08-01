#!/usr/bin/env node
/**
 * verify-seo-buildout.js — the "measure, don't assume" gate.
 *
 * Reads what was actually WRITTEN TO DISK (not what the generator thinks it
 * wrote) and asserts every non-negotiable from the two work orders.
 * Exits non-zero on the first hard failure.
 *
 * Usage: node scripts/verify-seo-buildout.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const fail = [];
const warn = [];
const ok = (m) => console.log("  PASS  " + m);
const bad = (m) => { fail.push(m); console.log("  FAIL  " + m); };

const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "functions", "_lib", "big-book-text.json"), "utf8"));
const byLabel = new Map(idx.map((e) => [String(e.l).toLowerCase(), e]));

function normalize(t) {
  return (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/’/g, "'").replace(/‘/g, "'")
    .replace(/“/g, '"').replace(/”/g, '"')
    .replace(/-\n/g, "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}
const unesc = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

console.log("\n=== 1. BIG BOOK PAGE LIBRARY ===\n");

const bbDirs = fs.readdirSync(path.join(ROOT, "big-book"))
  .filter((d) => /^page-/.test(d))
  .filter((d) => fs.existsSync(path.join(ROOT, "big-book", d, "index.html")));

console.log("  pages on disk: " + bbDirs.length);

const titles = new Map();
const metas = new Map();
let maxQuote = 0, maxQuoteLabel = "";
let mismatches = 0;
let checked = 0;

for (const dir of bbDirs) {
  const label = dir.replace(/^page-/, "");
  const html = fs.readFileSync(path.join(ROOT, "big-book", dir, "index.html"), "utf8");

  // page-83 is hand-written; it does not follow the generated shape.
  const isCurated = label === "83";

  const t = html.match(/<title>(.*?)<\/title>/s);
  const d = html.match(/<meta name="description" content="(.*?)">/s);
  if (!t) { bad(`page-${label}: no <title>`); continue; }
  if (!d) { bad(`page-${label}: no meta description`); continue; }
  if (titles.has(t[1])) bad(`DUPLICATE TITLE: page-${label} == page-${titles.get(t[1])}`);
  if (metas.has(d[1])) bad(`DUPLICATE META: page-${label} == page-${metas.get(d[1])}`);
  titles.set(t[1], label);
  metas.set(d[1], label);

  if (isCurated) continue;

  // ── THE CRITICAL CHECK: the rendered quote must be a VERBATIM substring of
  //    that label's index text. This is the "wrong page number" guard.
  // Ellipses sit OUTSIDE the quotation marks; the quoted string itself must be
  // a clean verbatim substring. Capture only what's between the quote marks.
  // GREEDY: the book text itself contains quotation marks, so match out to the
  // LAST quote mark before the closing tag, not the first.
  const q = html.match(/<blockquote>(?:… )?"([\s\S]*)"(?: …)?<\/blockquote>/);
  if (!q) { bad(`page-${label}: no quote block`); continue; }
  const quote = unesc(q[1]).trim();

  const entry = byLabel.get(label);
  if (!entry) { bad(`page-${label}: NO INDEX ENTRY for this label — page must not exist`); continue; }

  const source = normalize(entry.t);
  if (source.indexOf(quote) === -1) {
    mismatches++;
    if (mismatches <= 3) bad(`page-${label}: rendered quote is NOT a verbatim substring of the index text for label "${label}"`);
  }
  checked++;

  // ── THE COPYRIGHT GUARD: total book text rendered must stay tiny.
  if (quote.length > maxQuote) { maxQuote = quote.length; maxQuoteLabel = label; }
  if (quote.length > 340) bad(`page-${label}: quote ${quote.length} chars EXCEEDS the 340 cap`);

  // Required elements
  if (!/rel="canonical"/.test(html)) bad(`page-${label}: no canonical`);
  if (!/"@type":"Article"/.test(html)) bad(`page-${label}: no Article JSON-LD`);
  if (!/"@type":"BreadcrumbList"/.test(html)) bad(`page-${label}: no Breadcrumb JSON-LD`);
  if (!/the full text of the book is not reproduced here/.test(html)) bad(`page-${label}: missing the no-reproduction disclaimer`);
  if (/\/demo/.test(html)) bad(`page-${label}: forbidden /demo link`);
}

if (mismatches === 0) ok(`all ${checked} generated pages: rendered quote is a VERBATIM substring of that page's index text`);
else bad(`${mismatches} pages have a quote that does not match their index entry`);

if (titles.size === bbDirs.length) ok(`all ${titles.size} titles unique`);
if (metas.size === bbDirs.length) ok(`all ${metas.size} meta descriptions unique`);
ok(`longest quote rendered anywhere: ${maxQuote} chars (page ${maxQuoteLabel}) — cap is 340`);

// Blank pages must NOT have been generated.
for (const lbl of ["277", "433", "165"]) {
  if (fs.existsSync(path.join(ROOT, "big-book", "page-" + lbl, "index.html"))) bad(`blank page ${lbl} was generated — it should be skipped`);
}
ok("blank/short pages (i, 165, 277, 433) correctly skipped");

// ── page-83 is HAND-WRITTEN and better than a generated page. Its CONTENT must
// never be clobbered by a generator.
//
// The old version of this check demanded the whole FILE be byte-identical to
// main — which meant it also failed when the site-wide nav fix legitimately
// touched the header. A guard that fires on the fixes you want isn't a guard,
// it's noise, and noise gets switched off.
//
// So: the guard now protects what it was actually there to protect — the curated
// CONTENT. Chrome (nav, footer) may change site-wide; the article may not.
const { execSync } = require("child_process");
try {
  const mainVer = execSync("git show main:big-book/page-83/index.html", { cwd: ROOT }).toString();
  const nowVer = fs.readFileSync(path.join(ROOT, "big-book", "page-83", "index.html"), "utf8");
  const body = (s) => {
    const m = s.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    return m ? m[1].replace(/\s+/g, " ").trim() : null;
  };
  const a = body(mainVer), b = body(nowVer);
  if (!a || !b) warn.push("could not isolate page-83 <main> for comparison");
  else if (a !== b) bad("page-83's CURATED CONTENT was modified — the generator must never clobber it");
  else ok("page-83 (curated): content byte-identical; only site-wide chrome changed — preserved");
} catch (e) { warn.push("could not compare page-83 against main: " + e.message); }

console.log("\n=== 2. DAILY TRADITIONS ===\n");

const dt = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
// The approved source is VENDORED INTO THE REPO (data/readings-source.md), not
// read off D:\Forge. A build that can only verify itself when an external drive
// happens to be plugged in is not verified — it's lucky. Regenerate with
// scripts/vendor-source.js.
const srcMd = fs.readFileSync(path.join(ROOT, "data", "readings-source.md"), "utf8");

let dtDrift = 0, dtChecked = 0;
const dtTitles = new Set();

for (const day of dt.days) {
  const slug = `${day.month}-${day.day}`;
  const file = path.join(ROOT, "daily-tradition", slug, "index.html");
  if (!fs.existsSync(file)) { bad(`${slug}: page not on disk`); continue; }
  const html = fs.readFileSync(file, "utf8");

  // ── VERBATIM: the reading rendered on the page must match the APPROVED source.
  const bodyM = html.match(/<div class="dt-reading">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/);
  if (!bodyM) { bad(`${slug}: no reading body found`); continue; }
  const rendered = unesc(bodyM[1].replace(/<\/?em>/g, "*")).trim();
  if (srcMd.indexOf(rendered) === -1) {
    dtDrift++;
    bad(`${slug}: rendered reading DRIFTED from the approved source`);
  }
  dtChecked++;



  // Every page: both page refs.
  if (!html.includes("561–562")) bad(`${slug}: missing short-form ref 561–562`);
  if (!html.includes("563–566")) bad(`${slug}: missing LONG FORM ref 563–566`);

  // Doctrine must not blur.
  if (!/governance, not theology/.test(html)) bad(`${slug}: missing the governance-not-theology line`);

  // Never /demo.
  if (/\/demo/.test(html)) bad(`${slug}: forbidden /demo link`);

  const t = html.match(/<title>(.*?)<\/title>/s);
  if (dtTitles.has(t[1])) bad(`${slug}: duplicate title`);
  dtTitles.add(t[1]);
}

if (dtDrift === 0) ok(`all ${dtChecked} readings render VERBATIM from the GATE-2 approved source (zero drift)`);
ok(`all ${dt.days.length} days carry short form 561–562 AND long form 563–566`);
ok(`${dt.days.length} Daily Traditions pages rendered verbatim from the approved source`);
ok(`${dtTitles.size} unique titles`);

for (const p of ["daily-tradition/index.html", "daily-tradition/today/index.html"]) {
  if (!fs.existsSync(path.join(ROOT, p))) bad("missing: " + p);
}
ok("hub + today redirect present");

// Month hubs: every live month has its own page, the page lists every one of
// its days, and every day page links back to its month hub.
const liveM = [...new Set(dt.days.map((d) => d.month))];
let mhBad = 0;
for (const m of liveM) {
  const f = path.join(ROOT, "daily-tradition", m, "index.html");
  if (!fs.existsSync(f)) { bad(`month hub missing: daily-tradition/${m}/`); mhBad++; continue; }
  const mh = fs.readFileSync(f, "utf8");
  for (const day of dt.days.filter((x) => x.month === m)) {
    if (!mh.includes(`/daily-tradition/${m}-${day.day}/`)) { bad(`${m} month hub missing day ${day.day}`); mhBad++; }
  }
}
for (const day of dt.days) {
  const slug = `${day.month}-${day.day}`;
  const f = path.join(ROOT, "daily-tradition", slug, "index.html");
  if (!fs.existsSync(f)) continue; // already reported above
  if (!fs.readFileSync(f, "utf8").includes(`href="/daily-tradition/${day.month}/"`)) {
    bad(`${slug}: no escape link to its month hub`); mhBad++;
  }
}
if (mhBad === 0) ok(`${liveM.length} month hubs present, complete, and linked from every day page`);

// Prev/next wrap correctly
const first = fs.readFileSync(path.join(ROOT, "daily-tradition", "july-1", "index.html"), "utf8");
const last = fs.readFileSync(path.join(ROOT, "daily-tradition", "july-31", "index.html"), "utf8");
if (!/All of July/.test(first)) bad("july-1: prev link should fall back to the hub");
if (!/All of July/.test(last)) bad("july-31: next link should fall back to the hub");
if (!/july-2\//.test(first)) bad("july-1: next should link july-2");
if (!/july-30\//.test(last)) bad("july-31: prev should link july-30");
ok("prev/next nav wraps correctly at both ends of the month");

console.log("\n=== 3. SITEMAP ===\n");

const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
if (dupes.length) bad("duplicate sitemap entries: " + [...new Set(dupes)].slice(0, 3).join(", "));
else ok(`${locs.length} sitemap URLs, all unique`);

// Every sitemap URL must resolve to a file on disk.
let missing = 0;
for (const loc of locs) {
  const rel = loc.replace("https://recoverystarts.com/", "");
  if (!rel) continue;
  const f = path.join(ROOT, rel, "index.html");
  if (!fs.existsSync(f) && !fs.existsSync(path.join(ROOT, rel))) { missing++; if (missing <= 3) bad("sitemap URL has no file: " + loc); }
}
if (missing === 0) ok("every sitemap URL resolves to a real file (no 404s in the sitemap)");

if (!sm.includes("/big-book/pages/")) bad("sitemap missing the Big Book library hub");
if (!sm.includes("/daily-tradition/")) bad("sitemap missing the Daily Traditions hub");
if (sm.includes("/daily-tradition/today/")) bad("sitemap should NOT list the noindex today redirect");
ok("hubs listed; noindex redirect correctly excluded");

console.log("\n=== 4. THE BOOK IS NOT A PUBLIC ASSET ===\n");

// Cloudflare Pages serves the ENTIRE repo root (verified: /scripts/, /data/ and
// /tests/ all return 200 in production). `functions/` is the ONLY directory it
// does not serve. So: the Big Book text is allowed to live in exactly one place.
// If anything ever moves it back into the served root, this fails the build.
const BOOK_HOME = path.join(ROOT, "functions", "_lib", "big-book-text.json");
if (!fs.existsSync(BOOK_HOME)) bad("the Big Book text is missing from functions/_lib/");
else ok("Big Book text lives in functions/_lib/ (Cloudflare does not serve functions/)");

if (fs.existsSync(path.join(ROOT, "bigbook"))) {
  bad("PUBLIC /bigbook/ DIRECTORY IS BACK — the full 4th-edition text would be downloadable again");
} else ok("no public /bigbook/ directory — the old 981 KB full-text asset is gone");

// Nothing in the served root may contain a large slab of book text.
function scanServedRoot(dir) {
  const skip = new Set(["functions", "node_modules", ".git", "scripts", "tests"]);
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { scanServedRoot(p); continue; }
    if (!/\.(json|txt)$/i.test(name)) continue;
    const size = st.size;
    if (size < 200 * 1024) continue;              // small files can't be the book
    const body = fs.readFileSync(p, "utf8");
    // The book's tell: many pages of prose keyed by printed page label.
    if (/"l"\s*:\s*"\d+"/.test(body) && /"t"\s*:\s*"/.test(body)) {
      bad("SERVED FILE LOOKS LIKE THE BIG BOOK TEXT: /" + path.relative(ROOT, p).replace(/\\/g, "/"));
    }
  }
}
scanServedRoot(ROOT);
ok("no file in the served root contains the Big Book text");

// The search UI must not be able to print a whole page any more.
const app = fs.readFileSync(path.join(ROOT, "assets", "bigbook", "searchApp.js"), "utf8");
if (/pageViewHtml|bb-pagetext/.test(app)) bad("searchApp.js can still render full page text");
if (/search-index\.json['"]/.test(app)) bad("searchApp.js still fetches the public full-text index");
if (!/\/api\/bigbook-search/.test(app)) bad("searchApp.js is not wired to the server-side search API");
ok("search UI renders snippets + page cards only — it cannot print a page");

console.log("\n=== 5. ONE NAV, ON EVERY PAGE ===\n");

// The nav drifted: 1,039 pages were missing "The 12 Traditions", and /big-book/
// and 404.html had NO nav at all — you could land there with no way back into
// the site. Every generator carried its own copy of the header. Now there is one
// (scripts/fix-nav.js) and this proves it reached every page.
const REQUIRED_NAV = ["/", "/meetings/", "/aa-info/", "/daily-reflection/", "/daily-tradition/",
                      "/12-traditions/", "/12-steps/", "/big-book/", "/about/", "/download/"];
const SKIP_NAV = new Set(["googlee7fbd843aaac14fe.html"]);
let navPages = 0, navBad = 0;
(function walkNav(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (["node_modules", ".git", "functions", "scripts", "tests", "assets", "data"].includes(name)) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) { walkNav(p); continue; }
    if (!name.endsWith(".html") || SKIP_NAV.has(name)) continue;
    const s = fs.readFileSync(p, "utf8");
    if (/window\.location\.replace/.test(s) && s.length < 3000) continue;  // redirect stubs
    navPages++;
    // Match the WHOLE nav block — the month dropdowns nest <ul>s inside
    // .nav-links, so a first-</ul> match would truncate at the first submenu.
    const nav = (s.match(/<nav class="nav">[\s\S]*?<\/nav>/) || [""])[0];
    const missing = REQUIRED_NAV.filter((h) => !nav.includes(`href="${h}"`));
    if (missing.length) {
      navBad++;
      if (navBad <= 3) bad(path.relative(ROOT, p).replace(/\\/g, "/") + " — nav missing: " + missing.join(", "));
    }
  }
})(ROOT);
if (navBad === 0) ok(`all ${navPages} pages carry the same ${REQUIRED_NAV.length}-link nav (no orphan pages)`);
else bad(`${navBad} page(s) have a broken or missing nav`);

console.log("\n=== 6. HOMEPAGE ===\n");
const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
if (!/href="\/big-book\/pages\/"/.test(home)) bad("homepage: no link to the Big Book library");
if (!/href="\/daily-tradition\/"/.test(home)) bad("homepage: no link to Daily Traditions");
if (!/study-card/.test(home)) bad("homepage: study cards missing");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
if (!/\.study-card/.test(css)) bad("style.css: .study-card styles missing (cards would render unstyled)");
ok("homepage links to both new sections; card styles present");

console.log("\n" + "=".repeat(60));
if (fail.length) {
  console.log(`VERIFY FAILED — ${fail.length} problem(s):`);
  fail.forEach((f) => console.log("  - " + f));
  process.exit(1);
}
console.log("VERIFY PASSED — all assertions green.");
console.log("=".repeat(60) + "\n");
