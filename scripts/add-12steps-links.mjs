#!/usr/bin/env node
/**
 * WO-einstein-max-reach Phase 6 — wire /12-steps/ into the site:
 *  1. Add "The 12 Steps" to the main nav (after Daily Reflection) on every
 *     page that carries the shared nav. Idempotent.
 *  2. Add a "Go deeper" chip to the 12 step-guide pages linking /12-steps/.
 *  3. Add /12-steps/ to sitemap.xml (after the aa-info entry).
 * Node (not PowerShell) for byte-faithful UTF-8.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith(".html")) yield p;
  }
}

const NAV_RX = /(<li><a href="\/daily-reflection\/"(?: class="active")?>Daily Reflection<\/a><\/li>)/;
const NAV_ADD = '<li><a href="/12-steps/">The 12 Steps</a></li>';

let navTouched = 0, navSkipped = 0;
for (const f of htmlFiles(root)) {
  let html = readFileSync(f, "utf8");
  if (!NAV_RX.test(html)) continue;
  if (html.includes('href="/12-steps/"')) { navSkipped++; continue; } // already linked (incl. the page itself)
  html = html.replace(NAV_RX, `$1\n      ${NAV_ADD}`);
  writeFileSync(f, html);
  navTouched++;
}

// Step-guide "Go deeper" chips
let chips = 0;
for (let n = 1; n <= 12; n++) {
  const f = path.join(root, "steps", `step-${n}`, "index.html");
  let html = readFileSync(f, "utf8");
  if (html.includes('The 12 Steps, page by page')) continue;
  html = html.replace(
    '<span class="lbl">Go deeper</span>',
    '<span class="lbl">Go deeper</span>\n        <a href="/12-steps/">The 12 Steps, page by page</a>'
  );
  writeFileSync(f, html);
  chips++;
}

// Sitemap
const smPath = path.join(root, "sitemap.xml");
let sm = readFileSync(smPath, "utf8");
if (!sm.includes("https://recoverystarts.com/12-steps/")) {
  const entry = `  <url>
    <loc>https://recoverystarts.com/12-steps/</loc>
    <lastmod>2026-07-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
  sm = sm.replace(/(  <url>\n    <loc>https:\/\/recoverystarts\.com\/aa-info\/<\/loc>[\s\S]*?<\/url>\n)/, `$1${entry}`);
  writeFileSync(smPath, sm);
}

console.log(`nav added on ${navTouched} pages (skipped ${navSkipped} already linked)`);
console.log(`go-deeper chips added on ${chips} step guides`);
console.log(`sitemap urls: ${(sm.match(/<url>/g) || []).length}`);
