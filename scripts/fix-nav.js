#!/usr/bin/env node
/**
 * fix-nav.js — one nav, on every page.
 *
 * The site grew in layers and the header drifted: some pages carry the full nav,
 * some are missing "Daily Tradition" and "Big Book", and /big-book/ has no nav
 * at all — you land there and there is no way back into the site.
 *
 * This makes every page carry the SAME header. Run it after any generator.
 *
 * v2: "Daily Reflection" and "Daily Tradition" are dropdowns. Every month is
 * one hover/tap away from EVERY page on the site — nobody is stranded inside
 * a reading again. Tradition months come from data/traditions-daily.json, so
 * publishing a new month updates the menu with zero template work.
 *
 * Usage: node scripts/fix-nav.js [--dry]
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DRY = process.argv.includes("--dry");

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const CAP = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Which Tradition months are actually published — read from the data, never assumed.
const TRAD = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
const tradLive = new Set(TRAD.days.map((d) => d.month));

// THE nav. One definition. Everything else is generated from it.
// [href, label, submenu?] — submenu items are [href|null, label].
const reflectionSub = [
  ["/daily-reflection/today/", "Today's Reflection →"],
  ...MONTHS.map((m) => [`/daily-reflection/${m}/`, CAP(m)]),
];
const traditionSub = [
  ["/daily-tradition/today/", "Today's Tradition →"],
  ...MONTHS.map((m, i) =>
    tradLive.has(m)
      ? [`/daily-tradition/${m}/`, `${CAP(m)} · T${i + 1}`]
      : [null, `${CAP(m)} · T${i + 1}`]
  ),
];

const LINKS = [
  ["/", "Home"],
  ["/meetings/", "Meetings"],
  ["/aa-info/", "AA Info"],
  ["/daily-reflection/", "Daily Reflection", reflectionSub],
  ["/daily-tradition/", "Daily Tradition", traditionSub],
  ["/12-traditions/", "The 12 Traditions"],
  ["/12-steps/", "The 12 Steps"],
  ["/big-book/", "Big Book"],
  ["/about/", "About"],
];

/** Which nav item should be highlighted for a page at this URL path? */
function activeFor(urlPath) {
  let best = "";
  for (const [href] of LINKS) {
    if (href === "/") continue;
    if (urlPath.startsWith(href) && href.length > best.length) best = href;
  }
  if (!best && (urlPath === "/" || urlPath === "")) best = "/";
  // Big Book sub-pages (/big-book/pages/, /big-book/page-64/) light up "Big Book"
  return best;
}

function subHtml(label, items) {
  const lis = items.map(([href, text], i) => {
    const cls = i === 0 ? ' class="sub-today"' : "";
    if (!href) return `        <li class="sub-soon">${text}</li>`;
    return `        <li${cls}><a href="${href}">${text}</a></li>`;
  }).join("\n");
  return `<button class="sub-toggle" aria-expanded="false" aria-label="Browse ${label} by month">▾</button>
      <ul class="sub-menu">
${lis}
      </ul>`;
}

function navHtml(urlPath) {
  const active = activeFor(urlPath);
  const items = LINKS.map(([href, label, sub]) => {
    const cls = href === active ? ' class="active"' : "";
    if (sub) {
      return `      <li class="has-sub"><a href="${href}"${cls}>${label}</a>${subHtml(label, sub)}</li>`;
    }
    return `      <li><a href="${href}"${cls}>${label}</a></li>`;
  }).join("\n");
  return `  <nav class="nav"><div class="nav-inner">
    <a href="/" class="nav-brand">Recovery Starts</a>
    <button class="nav-toggle" aria-label="Toggle menu" onclick="document.querySelector('.nav-links').classList.toggle('open')">☰</button>
    <ul class="nav-links">
${items}
      <li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li>
      <li><a href="/download/" class="nav-cta">Get the App</a></li>
    </ul>
  </div></nav>`;
}

// ── Walk every HTML page ────────────────────────────────────────────────────
const SKIP_DIRS = new Set(["node_modules", ".git", "functions", "scripts", "tests", "assets", "data"]);
// Search Console's verification file is a bare token, not a page. Touching it
// would break GSC verification and silently delist the site.
const SKIP_FILES = new Set(["googlee7fbd843aaac14fe.html"]);
const pages = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (name.endsWith(".html") && !SKIP_FILES.has(name)) pages.push(p);
  }
})(ROOT);

const NAV_RX = /[ \t]*<nav class="nav">[\s\S]*?<\/nav>/;

let fixed = 0, added = 0, already = 0, skipped = 0;
const noNav = [];

for (const file of pages) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const urlPath = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "");
  let html = fs.readFileSync(file, "utf8");

  // Redirect stubs and the 404 page have no chrome by design.
  if (/window\.location\.replace/.test(html) && html.length < 3000) { skipped++; continue; }

  const want = navHtml(urlPath === "//" ? "/" : urlPath);

  if (NAV_RX.test(html)) {
    const current = html.match(NAV_RX)[0];
    if (current.trim() === want.trim()) { already++; continue; }
    html = html.replace(NAV_RX, want);
    fixed++;
  } else {
    // No nav at all. Inject it right after <body> (and after the skip-link /
    // background div if they're there), so it lands where every other page has it.
    noNav.push(rel);
    const anchor = html.match(/<body[^>]*>[\s\S]{0,300}?(?=\n\s*<(?:main|div class="container"|section))/);
    if (!anchor) {
      const bodyM = html.match(/<body[^>]*>/);
      if (!bodyM) { console.warn("  no <body>: " + rel); continue; }
      html = html.replace(bodyM[0], bodyM[0] + "\n" + want);
    } else {
      html = html.replace(anchor[0], anchor[0].replace(/\s*$/, "") + "\n" + want + "\n");
    }
    added++;
  }

  if (!DRY) fs.writeFileSync(file, html);
}

console.log("NAV NORMALISED" + (DRY ? " (DRY RUN)" : "") + "\n");
console.log("  pages scanned      : " + pages.length);
console.log("  nav REPLACED       : " + fixed + "   (was missing links or out of date)");
console.log("  nav ADDED          : " + added + "   (had NO nav at all)");
console.log("  already correct    : " + already);
console.log("  redirect stubs     : " + skipped + "   (no chrome by design)");
if (noNav.length) {
  console.log("\n  pages that had NO NAV — you could land there and not get back:");
  noNav.forEach((p) => console.log("    " + p));
}
console.log("\n  every page now carries: " + LINKS.map((l) => l[1]).join(" · ") + " · Claude's Lab · Get the App");
console.log("  dropdowns          : Daily Reflection (12 months) · Daily Tradition (" + tradLive.size + " live months)");
