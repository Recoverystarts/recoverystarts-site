#!/usr/bin/env node
/**
 * raptive.js — Raptive's head tag on every page, the health tag on the routing pages, and no AdSense left.
 *
 * For every HTML page, in every language:
 *   1. Raptive's head tag (TAG below), inline in <head>, exactly as Raptive sent it (data-cfasync="false" keeps
 *      Rocket Loader off it), right after <meta charset> so the charset stays in the first 1024 bytes.
 *   2. <meta name="health-directed-treatment" content="true"> on the pages that route people to meetings or help
 *      (HEALTH below): Raptive then serves only non-personalized ads there to visitors from CA, CT, UT, VA and WA.
 *   3. the old `<script src="/ads.js" defer></script>` removed.
 *
 * Idempotent. fix-nav.js calls stamp() on every page; the language builds copy the English head, tag included.
 *
 * Usage: node scripts/raptive.js           stamp every page
 *        node scripts/raptive.js --check   change nothing; exit 1 if any page is wrong (tag missing, twice or altered;
 *                                          health tag where it shouldn't be or missing; AdSense left)
 */
const fs = require("fs");
const path = require("path");

const TAG = `<!-- Raptive Head Tag Manual --><script data-no-optimize="1" data-cfasync="false">(function(w, d) { w.adthrive = w.adthrive || {}; w.adthrive.cmd = w.adthrive.cmd || []; w.adthrive.plugin = 'adthrive-ads-manual'; w.adthrive.host = 'ads.adthrive.com'; var s = d.createElement('script'); s.async = true; s.referrerpolicy='no-referrer-when-downgrade'; s.src = 'https://' + w.adthrive.host + '/sites/6ae0f40dc893d31cf2e0eb8c/ads.min.js?referrer=' + w.encodeURIComponent(w.location.href) + '&cb=' + (Math.floor(Math.random() * 100) + 1); var n = d.getElementsByTagName('script')[0]; n.parentNode.insertBefore(s, n);})(window, document);</script><!-- End of Raptive Head Tag -->`;
const HEALTH = `<meta name="health-directed-treatment" content="true">`;
// Which pages carry it: since 2026-11-23, the pages that route people to meetings or services or give individual
// help: the home page, the static /meetings/ hub, /maps/ (the meeting-map chooser) and /download/ (the Recovery
// Einstein app), in English and under every /<lang>/ copy. The live /meetings/* and /family* pages come from the
// meeting finders (meeting-finder, al-anon-finder: server/raptive.mjs), which tag every page. The reading pages (the
// published A.A. texts and reflections: steps, traditions, concepts, history, info, questions, Big Book, daily
// readings, /start-here/) carry no tag: Raptive (Philip Sanchez, 2026-11-23) said general published texts that don't
// identify a reader's health, route to services or give individual direction likely don't need it.
// Not tagged either: /about/, /privacy/, /add-meeting/, 404.html.
const HEALTH_SECTIONS = new Set(["meetings", "maps", "download", "index.html"]);
const LANG_DIR = /^(ar|de|es|fa|fr|hi|ja|nl|pl|pt|ru|sv|tr)\//;
const ADS_JS = /<script src="\/ads\.js"[^>]*><\/script>/g;

const isHealthPage = (rel) => HEALTH_SECTIONS.has(rel.replace(LANG_DIR, "").split("/")[0]);
const count = (s, sub) => s.split(sub).length - 1;

// one page's HTML → the HTML it should be. rel = its path from the site root ("es/big-book/page-1/index.html").
function stamp(html, rel) {
  let out = html.replace(ADS_JS, "");
  const wantHealth = isHealthPage(rel);
  const add = [];
  if (wantHealth && !out.includes(HEALTH)) add.push(HEALTH);
  if (!wantHealth) out = out.replace(/\r?\n?[ \t]*<meta name="health-directed-treatment" content="true">/g, "");
  if (!out.includes(TAG)) add.push(TAG);
  if (add.length) {
    const ins = (m) => `${m}\n  ${add.join("\n  ")}`;
    if (/<meta charset[^>]*>/i.test(out)) out = out.replace(/<meta charset[^>]*>/i, ins);
    else out = out.replace(/<head\b[^>]*>/i, ins);
  }
  return out;
}

// what's wrong with a page, or [] if nothing
function problems(html, rel) {
  const p = [];
  const n = count(html, TAG);
  if (n !== 1) p.push(`Raptive tag ${n} times`);
  if (count(html, "adthrive") !== n * count(TAG, "adthrive")) p.push("an altered or extra adthrive snippet");
  const head = html.slice(0, html.search(/<\/head>/i));
  if (n === 1 && !head.includes(TAG)) p.push("Raptive tag outside <head>");
  const h = count(html, HEALTH);
  if (isHealthPage(rel) ? h !== 1 : h !== 0) p.push(`health tag ${h} times (${isHealthPage(rel) ? "routing" : "general"} page)`);
  if (h === 1 && !head.includes(HEALTH)) p.push("health tag outside <head>");
  if (/ads\.js|adsbygoogle|pagead|googlesyndication/.test(html)) p.push("AdSense left");
  return p;
}

module.exports = { TAG, HEALTH, stamp, problems, isHealthPage };

if (require.main === module) {
  const ROOT = path.join(__dirname, "..");
  const SKIP_DIRS = new Set(["node_modules", ".git", "functions", "scripts", "tests", "assets", "data", "grok-handoff", "i18n", "dist"]);
  const SKIP_FILES = new Set(["googlee7fbd843aaac14fe.html"]); // Search Console's token file, not a page
  const pages = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (SKIP_DIRS.has(name)) continue;
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) { walk(p); continue; }
      if (name.endsWith(".html") && !SKIP_FILES.has(name)) pages.push(p);
    }
  })(ROOT);
  const CHECK = process.argv.includes("--check");
  let changed = 0, bad = 0, health = 0;
  for (const file of pages) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const html = fs.readFileSync(file, "utf8");
    if (isHealthPage(rel)) health++;
    if (CHECK) {
      const p = problems(html, rel);
      if (p.length) { bad++; if (bad <= 20) console.log(`  ${rel}: ${p.join("; ")}`); }
      continue;
    }
    const out = stamp(html, rel);
    if (out !== html) { fs.writeFileSync(file, out); changed++; }
  }
  console.log(`raptive: ${pages.length} pages, ${health} pages with the health tag; ` +
    (CHECK ? `${bad} wrong` : `${changed} changed`));
  if (CHECK && bad) process.exit(1);
}
