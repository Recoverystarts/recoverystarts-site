#!/usr/bin/env node
/**
 * patch-one-tradition.js — re-render ONE reading's text into its existing page.
 *
 * WHY THIS EXISTS (2026-09-05): build-traditions-pages.js is STALE versus the
 * live HTML. Nav, brand icons, OG images, the floating Einstein CTA, the footer
 * and the 988 line were all patched into the generated pages by later commits
 * (fix-nav, brand pass, etc.) and never folded back into the generator. Running
 * the full build regresses all 184 pages. So a single-reading edit is applied
 * the way the Sept 14/15 rewrites were: patch the reading fields in place.
 *
 * Same rendering rules as the builder (esc / mdEm / teaser+desc, lines 106-118
 * and 379-380 there). Reads data/traditions-daily.json (already regenerated from
 * the source md by parse-traditions.js --verify).
 *
 * Usage: node scripts/patch-one-tradition.js september-6
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const key = process.argv[2];
if (!key) throw new Error("usage: patch-one-tradition.js <month-day>");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const mdEm = (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");

const all = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
const list = Array.isArray(all) ? all : all.readings || all.days || Object.values(all).flat();
const d = list.find((x) => x.key === key);
if (!d) throw new Error("no reading " + key);
const TRAD = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-traditions.json"), "utf8"));
const shortForm = TRAD.traditions.find((t) => t.n === d.tradition).short;
const monthCap = d.month[0].toUpperCase() + d.month.slice(1);

const teaser = d.body.replace(/\s+/g, " ").slice(0, 120).replace(/\s\S*$/, "");
const desc = `${monthCap} ${d.day} — "${d.title}." A daily reading on A.A.'s Tradition ${d.tradition}: ${shortForm.replace(/\.$/, "")}. ${teaser}…`.slice(0, 250);

const file = path.join(ROOT, "daily-tradition", key, "index.html");
let html = fs.readFileSync(file, "utf8");
const before = html;

function replaceOnce(rx, repl, what) {
  if (!rx.test(html)) throw new Error("could not find " + what);
  html = html.replace(rx, repl);
}

// Body: <div class="dt-reading"><p>…</p></div>
replaceOnce(/(<div class="dt-reading">\s*)<p>[\s\S]*?<\/p>(\s*<\/div>)/, `$1<p>${mdEm(d.body)}</p>$2`, "body");
// Sit with: <span class="lbl">Sit with</span><p>…</p>
replaceOnce(/(<span class="lbl">Sit with<\/span>\s*)<p>[\s\S]*?<\/p>/, `$1<p>${mdEm(d.sitWith)}</p>`, "sit with");

// Grounded in
replaceOnce(/<p class="dt-grounded">Grounded in: [^<]*<\/p>/, `<p class="dt-grounded">Grounded in: ${esc(d.groundedIn)}</p>`, "grounded");

// Meta descriptions (name=description, og:description, twitter:description)
replaceOnce(/(<meta name="description" content=")[^"]*(")/, `$1${escAttr(desc)}$2`, "meta description");
replaceOnce(/(<meta property="og:description" content=")[^"]*(")/, `$1${escAttr(desc)}$2`, "og:description");
replaceOnce(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${escAttr(desc)}$2`, "twitter:description");
// JSON-LD Article description
replaceOnce(/("@type":"Article","headline":"[^"]*","description":")(?:[^"\\]|\\.)*(")/, `$1${JSON.stringify(desc).slice(1, -1)}$2`, "ld description");

// Title: if the reading was retitled, the OLD title still sits in this page's
// <title>, og/twitter titles, <h1>, JSON-LD headline — and in the hub, the month
// page and the neighbours' prev/next links. Old title = whatever the <h1> says now.
const h1 = html.match(/<h1[^>]*>([^<]*)<\/h1>/);
if (h1 && h1[1] !== esc(d.title)) {
  const oldTitle = h1[1];
  const dir = path.join(ROOT, "daily-tradition");
  let touched = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = ent.isDirectory() ? path.join(dir, ent.name, "index.html") : (ent.name === "index.html" ? path.join(dir, ent.name) : null);
    if (!f || !fs.existsSync(f)) continue;
    const s = f === file ? html : fs.readFileSync(f, "utf8");
    if (!s.includes(oldTitle)) continue;
    const out = s.split(oldTitle).join(esc(d.title));
    if (f === file) html = out; else fs.writeFileSync(f, out);
    touched++;
  }
  console.log(`retitled "${oldTitle}" -> "${d.title}" in ${touched} file(s)`);
}

if (html === before) throw new Error("nothing changed");
fs.writeFileSync(file, html);
console.log("patched", file);
