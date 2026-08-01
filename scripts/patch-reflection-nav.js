#!/usr/bin/env node
/**
 * patch-reflection-nav.js — the month escape hatch on every reflection day page.
 *
 * The 366 Daily Reflection day pages were written as a one-time batch — there is
 * no generator to re-run, so this patches them IN PLACE, the same way regen-seo
 * did. It touches ONLY the .dr-nav block (prev/next at the foot of the page) and
 * turns it into three slots: prev day / All of <Month> / next day. The reading
 * itself is never touched.
 *
 * Idempotent: a page that already carries .dr-nav-mid is skipped, so this can
 * sit in build-all and run on every build.
 *
 * Usage: node scripts/patch-reflection-nav.js [--dry]
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DRY = process.argv.includes("--dry");
const DIR = path.join(ROOT, "daily-reflection");

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const CAP = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const NAV_RX = /(<div class="dr-nav">)\s*(<a [\s\S]*?<\/a>)\s*(<a [\s\S]*?<\/a>)\s*(<\/div>)/;

let patched = 0, already = 0, skippedNoMatch = [];

for (const name of fs.readdirSync(DIR)) {
  const m = name.match(/^([a-z]+)-(\d+)$/);
  if (!m || !MONTHS.includes(m[1])) continue;
  const month = m[1];
  const file = path.join(DIR, name, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");

  if (html.includes("dr-nav-mid")) { already++; continue; }

  const hit = html.match(NAV_RX);
  if (!hit) { skippedNoMatch.push(name); continue; }

  const mid = `<a class="dr-nav-mid" href="/daily-reflection/${month}/" style="text-align:center"><small>Daily Reflection</small>All of ${CAP(month)}</a>`;
  html = html.replace(NAV_RX, `$1\n        $2\n        ${mid}\n        $3\n      $4`);

  if (!DRY) fs.writeFileSync(file, html);
  patched++;
}

console.log("REFLECTION NAV PATCHED" + (DRY ? " (DRY RUN)" : ""));
console.log("  day pages patched  : " + patched);
console.log("  already patched    : " + already);
if (skippedNoMatch.length) {
  console.log("  NO .dr-nav MATCH (left untouched — check by hand):");
  skippedNoMatch.forEach((p) => console.log("    " + p));
}
