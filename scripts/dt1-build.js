#!/usr/bin/env node
/**
 * dt1-build.js — publish January–June Daily Traditions (wave dt1) in one pass.
 *
 *   HISTORIAN_SOURCES=~/hist node scripts/dt1-build.js [--dry]
 *
 * 1. Reads data/dt1/D-*.md (one file per runner line). A month is published
 *    only when every one of its days is there; otherwise it stays "coming".
 * 2. Folds those months into data/traditions-source.md AND
 *    data/readings-source.md, just before July 1 (re-runnable: anything
 *    between the first January–June heading and July 1 is replaced).
 * 3. parse-traditions.js + --verify → data/traditions-daily.json.
 * 4. Renders the day pages and month pages (dt1-render.js, from live pages).
 * 5. refresh-tradition-hub.js (the hub's own copy of every reading), then the
 *    12-month strip on the hub and every month page, and the menu on every
 *    ENGLISH page (es/ and pt/ keep theirs: those languages don't have these
 *    pages yet, and fix-nav.js would stamp English onto them).
 * 6. "today"'s LIVE list (English only), the sitemap, MONTH_PUBLISHED.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const R = require("./dt1-render.js");
const ROOT = R.ROOT;
const DRY = process.argv.includes("--dry");
const rel = (...p) => path.join(ROOT, ...p);
const write = (f, s) => { if (!DRY) fs.writeFileSync(f, s); };
const NEW_MONTHS = R.MONTHS.slice(0, 6);
const OLD_MONTHS = R.MONTHS.slice(6);

// ── 1. the runners' files ───────────────────────────────────────────────────
const dir = rel("data", "dt1");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^D-[a-z]{3}[12]\.md$/.test(f)).sort() : [];
const all = [];
for (const f of files) {
  for (const b of R.parseBlocks(fs.readFileSync(path.join(dir, f), "utf8"))) {
    if (b.stray) throw new Error(`${f}:${b.line}: stray line`);
    all.push({ ...b, file: f });
  }
}
const byKey = new Map();
for (const d of all) {
  if (byKey.has(d.key)) throw new Error(`${d.key} appears twice (${byKey.get(d.key).file}, ${d.file})`);
  byKey.set(d.key, d);
}
const ready = [], short = [];
for (const m of NEW_MONTHS) {
  const days = [];
  for (let n = 1; n <= R.DAYS_IN[m]; n++) if (byKey.has(`${m}-${n}`)) days.push(byKey.get(`${m}-${n}`));
  if (days.length === R.DAYS_IN[m]) ready.push(m);
  else if (days.length) short.push(`${m} (${days.length}/${R.DAYS_IN[m]})`);
}
console.log(`files: ${files.join(", ") || "none"}`);
console.log(`publishing: ${ready.join(", ") || "nothing"}${short.length ? `   ·   incomplete, stays "coming": ${short.join(", ")}` : ""}`);
const LIVE = [...ready, ...OLD_MONTHS];

// ── 2. fold into both source files ──────────────────────────────────────────
const firstNewRx = new RegExp(`^### (${NEW_MONTHS.map(R.cap).join("|")}) \\d+ — `, "m");
const section = ready.map((m) => {
  const blocks = [];
  for (let n = 1; n <= R.DAYS_IN[m]; n++) {
    const d = byKey.get(`${m}-${n}`);
    blocks.push([d.heading, d.body, `*Sit with:* ${d.sitWith}`, `*Grounded in:* ${d.groundedIn}`].join("\n"));
  }
  return blocks.join("\n\n");
}).join("\n\n---\n\n");
for (const f of ["data/traditions-source.md", "data/readings-source.md"]) {
  let src = fs.readFileSync(rel(f), "utf8");
  const july = src.indexOf("### July 1 — ");
  if (july < 0) throw new Error(`${f}: no July 1`);
  const fm = src.match(firstNewRx);
  const start = fm && fm.index < july ? fm.index : july;
  src = src.slice(0, start) + (section ? section + "\n\n---\n\n" : "") + src.slice(july);
  write(rel(f), src);
}

// ── 3. the JSON ─────────────────────────────────────────────────────────────
if (!DRY) {
  execFileSync("node", ["scripts/parse-traditions.js"], { cwd: ROOT, stdio: "inherit" });
  execFileSync("node", ["scripts/parse-traditions.js", "--verify"], { cwd: ROOT, stdio: "inherit" });
}
const DATA = JSON.parse(fs.readFileSync(rel("data", "traditions-daily.json"), "utf8"));

// ── 4. day + month pages ────────────────────────────────────────────────────
const tplDay = fs.readFileSync(rel("daily-tradition", "october-3", "index.html"), "utf8");
const tplMonth = fs.readFileSync(rel("daily-tradition", "october", "index.html"), "utf8");
let pages = 0;
for (const m of ready) {
  const days = DATA.days.filter((d) => d.month === m).sort((a, b) => a.day - b.day);
  days.forEach((d, i) => {
    const f = rel("daily-tradition", d.key, "index.html");
    if (!DRY) fs.mkdirSync(path.dirname(f), { recursive: true });
    write(f, R.renderDay(tplDay, d, days[i - 1] || null, days[i + 1] || null, LIVE));
    pages++;
  });
  const f = rel("daily-tradition", m, "index.html");
  if (!DRY) fs.mkdirSync(path.dirname(f), { recursive: true });
  write(f, R.renderMonth(tplMonth, m, days, LIVE));
  pages++;
}
console.log(`pages written: ${pages}`);

// ── 5. hub, month strips, menus ─────────────────────────────────────────────
if (!DRY) execFileSync("node", ["scripts/refresh-tradition-hub.js"], { cwd: ROOT, stdio: "inherit" });
const goldOf = (html) => (html.match(/id="month-([a-z]+)" href="[^"]*" style="border-color:var\(--gold\)"/) || [])[1];
for (const f of [rel("daily-tradition", "index.html"), ...LIVE.map((m) => rel("daily-tradition", m, "index.html"))]) {
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, "utf8");
  write(f, R.stampMonthStrip(html, LIVE, goldOf(html) || path.basename(path.dirname(f))));
}
const SKIP = new Set(["node_modules", ".git", "functions", "scripts", "tests", "assets", "data", "grok-handoff", "es", "pt", "fr", "i18n"]);
let menus = 0;
(function walk(d) {
  for (const name of fs.readdirSync(d)) {
    if (SKIP.has(name)) continue;
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!name.endsWith(".html")) continue;
    const html = fs.readFileSync(p, "utf8");
    const out = R.stampMenu(html, LIVE);
    if (out !== html) { write(p, out); menus++; }
  }
})(ROOT);
console.log(`menus updated: ${menus} English page(s)`);

// ── 6. today, sitemap, MONTH_PUBLISHED ──────────────────────────────────────
{
  const f = rel("daily-tradition", "today", "index.html");
  const html = fs.readFileSync(f, "utf8");
  const ordered = R.MONTHS.filter((m) => LIVE.includes(m));
  const out = html.replace(/var LIVE = \[[^\]]*\];/, `var LIVE = ${JSON.stringify(ordered).replace(/,/g, ",")};`);
  if (out === html && !html.includes(`var LIVE = ${JSON.stringify(ordered)};`)) throw new Error("today: LIVE list not found");
  write(f, out);
}
{
  const f = rel("sitemap-en.xml");
  let xml = fs.readFileSync(f, "utf8");
  const have = new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  const add = [];
  const url = (loc, freq, pri) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-10-12</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`;
  for (const m of ready) {
    const loc = `https://recoverystarts.com/daily-tradition/${m}/`;
    if (!have.has(loc)) add.push(url(loc, "monthly", "0.8"));
    for (let n = 1; n <= R.DAYS_IN[m]; n++) {
      const l = `https://recoverystarts.com/daily-tradition/${m}-${n}/`;
      if (!have.has(l)) add.push(url(l, "yearly", "0.7"));
    }
  }
  if (add.length) xml = xml.replace(/\n<\/urlset>/, "\n" + add.join("\n") + "\n</urlset>");
  write(f, xml);
  console.log(`sitemap: +${add.length} URL(s)`);
}
{
  const f = rel("scripts", "build-traditions-pages.js");
  let js = fs.readFileSync(f, "utf8");
  for (const m of [...ready].reverse()) {
    if (new RegExp(`^  ${m}: "`, "m").test(js)) continue;
    js = js.replace(/(const MONTH_PUBLISHED = \{\n)/, `$1  ${m}: "2026-10-12",\n`);
  }
  write(f, js);
}
console.log(DRY ? "dry run — nothing written" : "done");
