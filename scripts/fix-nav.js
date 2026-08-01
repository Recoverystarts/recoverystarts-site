#!/usr/bin/env node
/**
 * fix-nav.js — one header, one footer, one floating pill. On every page.
 *
 * The site grew in layers and the chrome drifted; this stamps the SAME
 * header/footer/pill on all ~1200 pages. Run it after any generator
 * (build-all.js runs it for you).
 *
 * v3 (First Light): restructured nav — Daily Reflection + Daily Tradition
 * keep their month dropdowns; Big Book and The Program (12 Steps, 12
 * Traditions, AA Info, Find a Meeting) become dropdowns; Claude's Lab moves
 * to the footer; a day/night theme toggle joins the header; the footer is
 * now also canonical and carries the standing 988 safety line.
 *
 * Tradition months come from data/traditions-daily.json, so publishing a new
 * month updates the menu with zero template work.
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
// sub items: [href|null, label, isToday?]
// Desktop parents open on CLICK (app.js), so each submenu must carry a link
// to its hub page — the parent link no longer navigates there on desktop.
const reflectionSub = [
  ["/daily-reflection/today/", "Today's Reflection →", true],
  ...MONTHS.map((m) => [`/daily-reflection/${m}/`, CAP(m)]),
  ["/daily-reflection/", "All of Daily Reflection →", "hub"],
];
// "T8" read as noise — spell out the Tradition. Month on the first line,
// "Tradition N" beneath it.
const traditionSub = [
  ["/daily-tradition/today/", "Today's Tradition →", true],
  ...MONTHS.map((m, i) =>
    tradLive.has(m)
      ? [`/daily-tradition/${m}/`, `${CAP(m)}<small>Tradition ${i + 1}</small>`]
      : [null, `${CAP(m)}<small>Tradition ${i + 1} · coming</small>`]
  ),
  ["/daily-tradition/", "All of Daily Traditions →", "hub"],
];
const bigBookSub = [
  ["/big-book/search/", "Search the Big Book"],
  ["/big-book/pages/", "Page by Page"],
  ["/big-book/", "Get the Big Book"],
];
const programSub = [
  ["/12-steps/", "The 12 Steps"],
  ["/12-traditions/", "The 12 Traditions"],
  ["/aa-info/", "AA Info"],
  ["/meetings/", "Find a Meeting"],
];

const NAV_ITEMS = [
  { href: "/daily-reflection/", label: "Daily Reflection", sub: reflectionSub, style: "months" },
  { href: "/daily-tradition/", label: "Daily Tradition", sub: traditionSub, style: "months" },
  { href: "/big-book/", label: "Big Book", sub: bigBookSub, style: "list" },
  { href: "/aa-info/", label: "The Program", sub: programSub, style: "list" },
  { href: "/about/", label: "About" },
];

/** Which top-level item should light up for a page at this URL path?
 *  Longest matching href wins, searching submenu targets too. */
function activeFor(urlPath) {
  let bestTop = "";
  let bestLen = 0;
  for (const item of NAV_ITEMS) {
    const candidates = [item.href, ...(item.sub || []).map(([h]) => h).filter(Boolean)];
    for (const h of candidates) {
      if (urlPath.startsWith(h) && h.length > bestLen) { bestLen = h.length; bestTop = item.href; }
    }
  }
  return bestTop;
}

function subHtml(label, items, style) {
  const lis = items.map(([href, text, kind]) => {
    if (!href) return `        <li class="sub-soon">${text}</li>`;
    const cls = kind === true ? ' class="sub-today"' : kind === "hub" ? ' class="sub-hub"' : "";
    return `        <li${cls}><a href="${href}">${text}</a></li>`;
  }).join("\n");
  const menuCls = style === "list" ? "sub-menu sub-menu-list" : "sub-menu";
  return `<button class="sub-toggle" aria-expanded="false" aria-label="Browse ${label}">▾</button>
      <ul class="${menuCls}">
${lis}
      </ul>`;
}

function navHtml(urlPath) {
  const active = activeFor(urlPath);
  const items = NAV_ITEMS.map(({ href, label, sub, style }) => {
    const cls = href === active ? ' class="active"' : "";
    if (sub) {
      return `      <li class="has-sub"><a href="${href}"${cls}>${label}</a>${subHtml(label, sub, style)}</li>`;
    }
    return `      <li><a href="${href}"${cls}>${label}</a></li>`;
  }).join("\n");
  return `  <nav class="nav"><div class="nav-inner">
    <a href="/" class="nav-brand">Recovery Starts</a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-menu" onclick="document.querySelector('.nav-links').classList.toggle('open');this.setAttribute('aria-expanded',document.querySelector('.nav-links').classList.contains('open'))">☰</button>
    <ul class="nav-links" id="nav-menu">
${items}
      <li class="nav-theme"><button class="theme-toggle" aria-label="Switch between day and night" title="Day / night">◐</button></li>
      <li><a href="/download/" class="nav-cta">Get the App</a></li>
    </ul>
  </div></nav>`;
}

// ── The floating Einstein pill — on every page, quietly ─────────────────────
// The one action the whole site points at: talking to Recovery Einstein.
// Static HTML (crawlable, no-JS safe), per-page utm_content so we can see
// which pages actually carry people over.
// Copy note: no "free" promise here — AI chat lives on paid tiers, and a
// brand of hope never makes a claim its own pricing page contradicts.
function ctaHtml(urlPath) {
  const slug = (urlPath === "/" ? "home" : urlPath.replace(/^\/+|\/+$/g, "").replace(/\//g, "-")) || "home";
  const q = `utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=floating-cta&amp;utm_content=${slug}`;
  return `  <a class="einstein-cta" href="https://app.recoverystarts.com/?${q}" target="_blank" rel="noopener" aria-label="Talk to Recovery Einstein — day or night">
    <span class="ec-dot" aria-hidden="true"></span>
    <span class="ec-text"><strong>Talk to Recovery Einstein</strong><small>You're not alone — day or night</small></span>
  </a>`;
}
const CTA_RX = /[ \t]*<a class="einstein-cta"[\s\S]*?<\/a>/;

// ── THE footer. One definition, stamped everywhere. ─────────────────────────
// The 988 line is a permanent fixture of the brand, not legal fine print.
const FOOTER_HTML = `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div><div class="footer-brand">Recovery Starts</div><p class="footer-desc">An independent recovery awareness project. Not affiliated with any fellowship. Every reading here is free, complete, and always will be.</p></div>
        <div><h4>Read</h4><ul class="footer-links"><li><a href="/daily-reflection/">Daily Reflection</a></li><li><a href="/daily-tradition/">Daily Tradition</a></li><li><a href="/big-book/pages/">The Big Book, page by page</a></li><li><a href="/big-book/search/">Search the Big Book</a></li></ul></div>
        <div><h4>The Program</h4><ul class="footer-links"><li><a href="/12-steps/">The 12 Steps</a></li><li><a href="/12-traditions/">The 12 Traditions</a></li><li><a href="/aa-info/">AA Info</a></li><li><a href="/meetings/">Find a Meeting</a></li></ul></div>
        <div><h4>Connect</h4><ul class="footer-links"><li><a href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=footer" target="_blank" rel="noopener">Recovery Einstein</a></li><li><a href="/download/">Get the App</a></li><li><a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Meet Derick</a></li><li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li></ul></div>
      </div>
      <p class="footer-safety">In crisis right now? Call or text <a href="tel:988">988</a>. You are not alone.</p>
      <div class="privacy-notice"><strong>Privacy:</strong> No cookies. No personal tracking. Anonymous, cookie-free page counts only. <strong>Independence:</strong> Not affiliated with any fellowship. <strong>No Medical Advice:</strong> Not a substitute for professional care.</div>
      <div class="footer-bottom"><p>&copy; 2026 RecoveryStarts.com. Built by <a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Addict2Influencer</a>.</p></div>
    </div>
  </footer>`;
const FOOTER_RX = /[ \t]*<footer class="footer">[\s\S]*?<\/footer>/;

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

let fixed = 0, added = 0, already = 0, skipped = 0, ctaAdded = 0, ctaFixed = 0, footFixed = 0, footAdded = 0, appJsAdded = 0;
const noNav = [];

for (const file of pages) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const urlPath = "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "");
  let html = fs.readFileSync(file, "utf8");

  // Redirect stubs and the 404 page have no chrome by design.
  if (/window\.location\.replace/.test(html) && html.length < 3000) { skipped++; continue; }

  const want = navHtml(urlPath === "//" ? "/" : urlPath);

  let changed = false;
  if (NAV_RX.test(html)) {
    const current = html.match(NAV_RX)[0];
    if (current.trim() === want.trim()) {
      already++;
    } else {
      html = html.replace(NAV_RX, want);
      fixed++;
      changed = true;
    }
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
    changed = true;
  }

  // Stamp the floating pill right after the header nav. Same idempotency
  // pattern as the nav itself: replace if drifted, add if missing.
  const wantCta = ctaHtml(urlPath === "//" ? "/" : urlPath);
  if (CTA_RX.test(html)) {
    const currentCta = html.match(CTA_RX)[0];
    if (currentCta.trim() !== wantCta.trim()) { html = html.replace(CTA_RX, wantCta); ctaFixed++; changed = true; }
  } else {
    const navEnd = html.match(NAV_RX);
    if (navEnd) { html = html.replace(navEnd[0], navEnd[0] + "\n" + wantCta); ctaAdded++; changed = true; }
  }

  // Stamp the footer. Replace if drifted, add before </body> if missing.
  if (FOOTER_RX.test(html)) {
    const currentFoot = html.match(FOOTER_RX)[0];
    if (currentFoot.trim() !== FOOTER_HTML.trim()) { html = html.replace(FOOTER_RX, FOOTER_HTML); footFixed++; changed = true; }
  } else {
    const appScript = html.match(/[ \t]*<script src="\/app\.js">/);
    if (appScript) {
      html = html.replace(appScript[0], FOOTER_HTML + "\n" + appScript[0]);
    } else {
      html = html.replace(/<\/body>/, FOOTER_HTML + "\n</body>");
    }
    footAdded++;
    changed = true;
  }

  // The chrome is dead without /app.js (dropdowns, theme toggle). Any page
  // that carries the nav must load it.
  if (!html.includes('src="/app.js"')) {
    html = html.replace(/<\/body>/, '  <script src="/app.js"></script>\n</body>');
    appJsAdded++;
    changed = true;
  }

  if (!DRY && changed) fs.writeFileSync(file, html);
}

console.log("CHROME NORMALISED" + (DRY ? " (DRY RUN)" : "") + "\n");
console.log("  pages scanned      : " + pages.length);
console.log("  nav REPLACED       : " + fixed + "   (was missing links or out of date)");
console.log("  nav ADDED          : " + added + "   (had NO nav at all)");
console.log("  already correct    : " + already);
console.log("  redirect stubs     : " + skipped + "   (no chrome by design)");
console.log("  einstein pill added: " + ctaAdded + "  fixed: " + ctaFixed);
console.log("  footer replaced    : " + footFixed + "  added: " + footAdded);
console.log("  app.js added       : " + appJsAdded);
if (noNav.length) {
  console.log("\n  pages that had NO NAV — you could land there and not get back:");
  noNav.forEach((p) => console.log("    " + p));
}
console.log("\n  every page now carries: " + NAV_ITEMS.map((l) => l.label).join(" · ") + " · theme toggle · Get the App + the 988 footer");
console.log("  dropdowns          : Daily Reflection (12 months) · Daily Tradition (" + tradLive.size + " live) · Big Book · The Program");
