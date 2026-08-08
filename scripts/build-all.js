#!/usr/bin/env node
/**
 * build-all.js — the whole site, in the right order, with the gates.
 *
 * The nav drifted across 1,041 pages because each generator carried its own copy
 * of the header. Now there is ONE nav (scripts/fix-nav.js) and it runs LAST,
 * after every generator, so nothing can drift again. Run this instead of running
 * the generators by hand.
 *
 * Any gate that fails stops the build. That's the point.
 */
const { execSync } = require("child_process");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const STEPS = [
  ["Extract the Traditions from the book", "node scripts/extract-longform.js"],
  ["Parse the approved readings",          "node scripts/parse-traditions.js"],
  ["Vendor the approved source into repo", "node scripts/vendor-source.js"],
  ["Build the Big Book page library",      "node scripts/build-bigbook-pages.js"],
  ["Build Daily Traditions",               "node scripts/build-traditions-pages.js"],
  ["Build the 12 Traditions page",         "node scripts/build-traditions-truth.js"],
  ["Extract the Concepts from the manual", "node scripts/extract-concepts.js"],
  ["Build the 12 Concepts page",           "node scripts/build-concepts-truth.js"],
  ["Build the sitemap",                    "node scripts/build-sitemap.js"],
  ["Normalise the nav on EVERY page",      "node scripts/fix-nav.js"],
  ["Reflection day pages: month escape",   "node scripts/patch-reflection-nav.js"],
  ["GATE: every quotation is real",        "node scripts/audit-readings.js"],
  ["GATE: verify the whole build",         "node scripts/verify-seo-buildout.js"],
];

let n = 0;
for (const [name, cmd] of STEPS) {
  n++;
  process.stdout.write(`\n[${n}/${STEPS.length}] ${name}\n`);
  try {
    const out = execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString();
    const last = out.trim().split("\n").filter((l) => l.trim()).slice(-3);
    last.forEach((l) => console.log("   " + l.trim()));
  } catch (e) {
    console.error("\n   BUILD STOPPED — " + name + " failed:\n");
    console.error((e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : ""));
    process.exit(1);
  }
}
console.log("\n" + "=".repeat(60));
console.log("  BUILD COMPLETE — every gate green.");
console.log("=".repeat(60));
