#!/usr/bin/env node
/**
 * check-links.js — every internal link on every page resolves to a real file.
 *
 * Crawls all HTML on disk, collects internal hrefs (skipping externals,
 * anchors-only, tel:, mailto:, and Cloudflare's email-protection stubs), and
 * verifies each target exists. A site where a stressed reader can hit a 404
 * from a real link has failed them.
 *
 * Usage: node scripts/check-links.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".git", "functions", "scripts", "tests", "assets", "data"]);

const pages = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (name.endsWith(".html")) pages.push(p);
  }
})(ROOT);

function targetExists(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true; // pure anchor / query
  let rel = clean.replace(/^\//, "");
  const p = path.join(ROOT, rel);
  if (rel === "") return true; // home
  if (fs.existsSync(p)) {
    if (fs.statSync(p).isDirectory()) return fs.existsSync(path.join(p, "index.html"));
    return true;
  }
  // extensionless path without trailing slash → directory index
  if (fs.existsSync(p + ".html")) return true;
  if (fs.existsSync(path.join(p, "index.html"))) return true;
  return false;
}

const broken = new Map(); // href -> [pages]
let checked = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    if (href.includes("' +")) continue; // JS template string inside a <script>, not a link
    if (href.startsWith("/cdn-cgi/")) continue; // Cloudflare runtime routes
    if (!href.startsWith("/")) continue;        // no relative links in this site
    checked++;
    if (!targetExists(href)) {
      if (!broken.has(href)) broken.set(href, []);
      const list = broken.get(href);
      if (list.length < 3) list.push(rel);
    }
  }
}

console.log("LINK CHECK");
console.log("  pages crawled   : " + pages.length);
console.log("  internal links  : " + checked);
console.log("  broken targets  : " + broken.size);
if (broken.size) {
  for (const [href, where] of broken) console.log("    " + href + "   (e.g. " + where.join(", ") + ")");
  process.exit(1);
}
console.log("  PASS — no page links to a missing file.");
