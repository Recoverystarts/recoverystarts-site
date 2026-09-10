#!/usr/bin/env node
/**
 * refresh-tradition-hub.js — bring /daily-tradition/ (the hub) up to date with
 * data/traditions-daily.json WITHOUT running the stale full builder.
 *
 * WHY (2026-09-10): the hub's "Today" card renders client-side from a
 * <script id="dt-data"> JSON copy of EVERY reading, and its static copy
 * ("August is Tradition 8", the August day list, the Tradition 8 short form,
 * the server-rendered fallback card) is whatever the last full build saw.
 * build-traditions-pages.js does not even emit dt-data (it was hand-added
 * later), and running it regresses nav/icons/OG/CTA/footer on all pages.
 * patch-one-tradition.js updates day pages + titles, not this payload. So
 * September's 24 rewrites were live on every day page and NOT in the hub —
 * Derick saw the old Sept 10 on his phone and the new one on desktop.
 *
 * What this touches in daily-tradition/index.html, and nothing else:
 *   1. the dt-data JSON payload (all readings, from the JSON — same field shape)
 *   2. "<Month> is Tradition <n>" in the meta description and the dt-date line
 *   3. the <h2 class="dt-h2">Month · Tradition n</h2> + <div class="dt-days"> list
 *   4. the <div class="dt-tradition"> short-form block (from twelve-traditions.json)
 *   5. the server-rendered fallback card in #dt-today-main (the current month's
 *      day 1, same markup __dtHero produces)
 * "Current month" = today's month if it is in the data, else the latest one.
 *
 * Run it after ANY reading change (apply-tradition-batch → parse → audit →
 * patch-one-tradition → THIS), and on the 1st of a new month.
 * Usage: node scripts/refresh-tradition-hub.js [--month september]
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const FILE = path.join(ROOT, "daily-tradition", "index.html");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const mdEm = (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");

// Same table as build-traditions-pages.js — keep in step.
const KIND_BADGE = {
  "hypothetical":          { label: "Where it goes wrong",   cls: "hyp" },
  "the earned answer":     { label: "The earned answer",     cls: "earned" },
  "the threat":            { label: "The threat",            cls: "earned" },
  "before the tradition":  { label: "Before the Tradition",  cls: "earned" },
  "the threat today":      { label: "The threat today",      cls: "earned" },
  "how a group breaks it": { label: "How a group breaks it", cls: "hyp" },
  "how it gets captured":  { label: "How it gets captured",  cls: "earned" },
};
const badgeFor = (d) => {
  const k = KIND_BADGE[String(d.kind || "").toLowerCase()];
  if (!k) throw new Error(`Unknown kind "${d.kind}" on ${d.key}`);
  return `<span class="dt-badge ${k.cls}">${k.label}</span>`;
};

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
const readings = Array.isArray(raw) ? raw : raw.readings || raw.days || Object.values(raw).flat();
const TRAD = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-traditions.json"), "utf8"));
const cap = (m) => m[0].toUpperCase() + m.slice(1);

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const mi = process.argv.indexOf("--month");
const argMonth = ((process.argv.find((a) => a.startsWith("--month=")) || "").slice(8) || (mi > 0 ? process.argv[mi + 1] : "") || "").toLowerCase();
const liveMonths = [...new Set(readings.map((r) => r.month))];
const todayMonth = MONTHS[new Date().getMonth()];
const month = argMonth || (liveMonths.includes(todayMonth) ? todayMonth : liveMonths.sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b)).pop());
const days = readings.filter((r) => r.month === month).sort((a, b) => a.day - b.day);
if (!days.length) throw new Error("no readings for " + month);
const n = days[0].tradition;
const shortForm = TRAD.traditions.find((t) => t.n === n).short;

let html = fs.readFileSync(FILE, "utf8");
const before = html;
function replaceBetween(startMarker, endMarker, replacement, what, fromIdx = 0) {
  const a = html.indexOf(startMarker, fromIdx);
  if (a < 0) throw new Error("hub: cannot find " + what + " start");
  const b = html.indexOf(endMarker, a + startMarker.length);
  if (b < 0) throw new Error("hub: cannot find " + what + " end");
  html = html.slice(0, a) + replacement + html.slice(b + endMarker.length);
}

// 1. dt-data payload
const payload = readings.map((r) => ({
  day: r.day, slug: r.key, month: cap(r.month), title: r.title, body: r.body, sitWith: r.sitWith,
  hypothetical: !!r.hypothetical, badge: badgeFor(r),
}));
const json = JSON.stringify(payload).replace(/</g, "\\u003c");
replaceBetween('<script type="application/json" id="dt-data">', "</script>",
  '<script type="application/json" id="dt-data">' + json + "</script>", "dt-data");

// 2. "<Month> is Tradition <n>"
html = html.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) is Tradition \d+\b/g, `${cap(month)} is Tradition ${n}`);

// 3. month heading + day list
const dayList = days.map((d) =>
  `        <a class="dt-day" href="/daily-tradition/${d.key}/">\n` +
  `          <span class="d">${cap(d.month)} ${d.day}</span>\n` +
  `          <span class="t">${esc(d.title)}</span>\n` +
  `          <span class="k">${esc(d.kind)}</span>\n` +
  `        </a>\n`).join("");
{
  const h2rx = /<h2 class="dt-h2"[^>]*>[^<]*· Tradition \d+<\/h2>\s*<div class="dt-days">[\s\S]*?\n      <\/div>/;
  if (!h2rx.test(html)) throw new Error("hub: cannot find month heading + day list");
  html = html.replace(h2rx, `<h2 class="dt-h2" style="max-width:980px;margin:0 auto 1rem;text-align:center">${cap(month)} · Tradition ${n}</h2>\n      <div class="dt-days">\n${dayList}      </div>`);
}

// 4. short-form block
{
  const rx = /(<div class="dt-tradition" style="margin-bottom:2\.4rem">\s*<h2>)Tradition \d+ · Short form(<\/h2>\s*<blockquote>)[\s\S]*?(<\/blockquote>)/;
  if (!rx.test(html)) throw new Error("hub: cannot find short-form block");
  html = html.replace(rx, `$1Tradition ${n} · Short form$2"${esc(shortForm)}"$3`);
}

// 5. server-rendered fallback card = this month's day 1 (JS swaps in today's)
{
  const d = days[0];
  const card =
    `<div id="dt-today-main">\n        \n` +
    `        <div class="dt-today-head">\n` +
    `          <span class="dt-today-lbl">Latest reading · ${cap(d.month)} ${d.day}</span>\n` +
    `          ${badgeFor(d)}\n` +
    `        </div>\n` +
    `        <h2 class="dt-today-title"><a href="/daily-tradition/${d.key}/">${esc(d.title)}</a></h2>\n` +
    `        <p class="dt-today-body">${mdEm(d.body)}</p>\n` +
    `        <div class="dt-today-sit">\n          <span class="lbl">Sit with</span>\n          <p>${mdEm(d.sitWith)}</p>\n        </div>\n` +
    `        <div class="dt-today-actions">\n` +
    `          <a class="btn btn-primary" href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${d.key}" target="_blank" rel="noopener">Ask Recovery Einstein about today's Tradition →</a>\n` +
    `          <a class="btn btn-outline" href="/daily-tradition/${d.key}/">Open this reading →</a>\n` +
    `        </div>\n` +
    `        </div>`;
  const a = html.indexOf('<div id="dt-today-main">');
  if (a < 0) throw new Error("hub: no dt-today-main");
  // the card ends at the first "</div>" that closes dt-today-actions, then the wrapper's own </div>
  const actions = html.indexOf('<div class="dt-today-actions">', a);
  const endActions = html.indexOf("</div>", actions) + 6;
  const endWrap = html.indexOf("</div>", endActions) + 6;
  html = html.slice(0, a) + card + html.slice(endWrap);
}

if (html === before) { console.log("hub already current"); process.exit(0); }
fs.writeFileSync(FILE, html);
console.log(`hub refreshed: ${cap(month)} · Tradition ${n}, ${days.length} days listed, ${payload.length} readings in dt-data`);
