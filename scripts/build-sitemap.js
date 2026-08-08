#!/usr/bin/env node
/**
 * build-sitemap.js — additive sitemap builder.
 *
 * Reads the EXISTING sitemap.xml, keeps every URL already in it, and adds the
 * new Big Book page-library and Daily Traditions URLs. Additive by design: this
 * script can never silently drop a URL that was already being indexed.
 *
 * It also refuses to list a URL whose index.html doesn't exist on disk — a
 * sitemap entry pointing at a 404 is worse than no entry at all.
 *
 * Usage: node scripts/build-sitemap.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";
const TODAY = "2026-07-12";
const DRY = process.argv.includes("--dry");
const SITEMAP = path.join(ROOT, "sitemap.xml");

// ── 1. Keep everything already indexed ──────────────────────────────────────
const existingXml = fs.readFileSync(SITEMAP, "utf8");
const existing = [...existingXml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);
const existingLocs = new Set(
  [...existingXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
);
console.log("existing sitemap URLs : " + existingLocs.size);

// ── 2. Collect the new URLs ─────────────────────────────────────────────────
const additions = [];

function addUrl(loc, priority, changefreq, diskPath) {
  if (existingLocs.has(loc)) return "dupe";
  const file = path.join(ROOT, diskPath, "index.html");
  if (!fs.existsSync(file)) {
    console.warn("  SKIP (no file on disk): " + loc);
    return "missing";
  }
  additions.push(
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  );
  existingLocs.add(loc);
  return "added";
}

// Big Book page library
const bb = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "bigbook-pages.json"), "utf8"));
addUrl(`${SITE}/big-book/pages/`, "0.8", "monthly", "big-book/pages");
let bbAdded = 0;
for (const p of bb.pages) {
  const slug = "page-" + String(p.label).toLowerCase();
  if (addUrl(`${SITE}/big-book/${slug}/`, "0.5", "yearly", path.join("big-book", slug)) === "added") bbAdded++;
}

// The canonical Traditions correction page — the highest-priority page on the
// site for the mission (it's what we want AI to lift), so it gets top priority.
addUrl(`${SITE}/12-traditions/`, "1.0", "monthly", "12-traditions");

// The Concepts are the other half of the same constitution, and the open web
// carries the short form only — same mission, same priority.
addUrl(`${SITE}/12-concepts/`, "1.0", "monthly", "12-concepts");

// Daily Traditions
const dt = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
addUrl(`${SITE}/daily-tradition/`, "0.9", "daily", "daily-tradition");
let dtAdded = 0;
// Month hubs — one per live month, same shape as /daily-reflection/<month>/.
for (const m of [...new Set(dt.days.map((d) => d.month))]) {
  if (addUrl(`${SITE}/daily-tradition/${m}/`, "0.8", "monthly", path.join("daily-tradition", m)) === "added") dtAdded++;
}
for (const d of dt.days) {
  const slug = `${d.month}-${d.day}`;
  if (addUrl(`${SITE}/daily-tradition/${slug}/`, "0.7", "yearly", path.join("daily-tradition", slug)) === "added") dtAdded++;
}
// NOTE: /daily-tradition/today/ is deliberately NOT in the sitemap — it's a
// noindex redirect, same as /daily-reflection/today/.

// ── 3. Write ────────────────────────────────────────────────────────────────
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  existing.join("\n") + "\n" +
  additions.join("\n") + "\n" +
  "</urlset>\n";

if (!DRY) fs.writeFileSync(SITEMAP, xml);

const total = existing.length + additions.length;
console.log("big book pages added  : " + bbAdded + " (+1 hub)");
console.log("daily tradition added : " + dtAdded + " (+1 hub)");
console.log("total sitemap URLs    : " + total + (DRY ? "  (DRY RUN — not written)" : ""));

// Sanity: no duplicate <loc> in the output.
const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
if (dupes.length) throw new Error("Duplicate <loc> in sitemap: " + [...new Set(dupes)].slice(0, 5).join(", "));
console.log("duplicate check       : PASS (" + locs.length + " unique)");
