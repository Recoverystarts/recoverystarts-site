#!/usr/bin/env node
/**
 * dt1-check.js — check one runner's half-month of Daily Traditions (wave dt1,
 * January–June) before it ships. The spec is claude-home
 * waves/2026-10-12-dt1/SPEC.md; this is that spec, run as code.
 *
 *   HISTORIAN_SOURCES=~/hist node scripts/dt1-check.js data/dt1/D-jan1.md [--pages]
 *
 * Problems (exit 1): the block format, the day range for the file's line, a known
 * kind, a body of 120–260 words, the Long Form named with its page,
 * the Sit with question, a title nobody else has, the sources Derick allows (no
 * 12&12, no first edition, nothing outside the wave's three), and the quote gate:
 * every quotation of 25+ characters must be in the Big Book (4th ed), A.A. Comes
 * of Age or P-17, character for character. A quote that names a Big Book or
 * P-17 page right before it must be on that page.
 * Notes (no exit): a day off the five-kind rotation, a body outside 180–230
 * words, no "Test it tonight:". The shape is direction, not law
 * (WRITING-DIRECTION.md; parse-traditions.js on the kinds).
 *
 * --pages also writes preview pages to daily-tradition/<month>-<day>/ (throw
 * them away afterwards: git checkout -- . && git clean -fd daily-tradition/).
 *
 * Exit 1 on any problem.
 */
const fs = require("fs");
const path = require("path");
const R = require("./dt1-render.js");
const ROOT = R.ROOT;

const file = process.argv[2];
if (!file) { console.error("usage: dt1-check.js data/dt1/<id>.md [--pages]"); process.exit(2); }
const PAGES = process.argv.includes("--pages");
const HIST = process.env.HISTORIAN_SOURCES || path.join(require("os").homedir(), "hist");

const LINES = {
  "D-jan1": ["january", 1, 15], "D-jan2": ["january", 16, 31],
  "D-feb1": ["february", 1, 14], "D-feb2": ["february", 15, 29],
  "D-mar1": ["march", 1, 15], "D-mar2": ["march", 16, 31],
  "D-apr1": ["april", 1, 15], "D-apr2": ["april", 16, 30],
  "D-may1": ["may", 1, 15], "D-may2": ["may", 16, 31],
  "D-jun1": ["june", 1, 15], "D-jun2": ["june", 16, 30],
};

const problems = [];
const warn = [];
const P = (where, msg) => problems.push(`${where}: ${msg}`);

// ── the books ───────────────────────────────────────────────────────────────
const squash = (t) => (t || "")
  .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff").replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
  .replace(/[’‘']/g, "'").replace(/[“”"]/g, '"').replace(/[—–]/g, "").replace(/­/g, "")
  .replace(/[\s\-]+/g, "").toLowerCase();
const BB = JSON.parse(fs.readFileSync(path.join(ROOT, "functions/_lib/big-book-text.json"), "utf8"));
const bbAll = squash(BB.map((e) => e.t).join(" "));
const bbPage = (label) => squash(BB.filter((e) => String(e.l) === String(label)).map((e) => e.t).join(" "));

const repairs = [];
const mapFile = path.join(HIST, "ocr-repairs.json");
if (fs.existsSync(mapFile)) {
  const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const r of JSON.parse(fs.readFileSync(mapFile, "utf8").replace(/^﻿/, "")).repairs) repairs.push([new RegExp(escRx(r.find), "g"), r.replace]);
} else warn.push(`no ${mapFile}: quotes are checked against the raw scans (a scanner slip can show as a false failure, never a false pass)`);
function loadHist(name) {
  const p = path.join(HIST, name);
  if (!fs.existsSync(p)) { P("setup", `missing ${p} — fetch it from aa-library (SPEC §4); quotes from it can't be verified`); return null; }
  let t = fs.readFileSync(p, "utf8");
  for (const [rx, to] of repairs) t = t.replace(rx, to);
  return t;
}
const aacoaRaw = loadHist("aa_comes_of_age.txt");
const p17Raw = loadHist("p-17_aa_traditions.txt");
const SOURCES = [["Big Book (4th ed)", bbAll], ["A.A. Comes of Age", aacoaRaw && squash(aacoaRaw)], ["P-17", p17Raw && squash(p17Raw)]];
// P-17 pages: a line holding only a number is the foot of that page.
const p17Pages = {};
if (p17Raw) {
  let buf = [];
  for (const line of p17Raw.split(/\r?\n/)) {
    const m = line.match(/^\s*(\d{1,2})\s*$/);
    if (m) { p17Pages[m[1]] = (p17Pages[m[1]] || "") + squash(buf.join(" ")); buf = []; } else buf.push(line);
  }
}

// ── the file ────────────────────────────────────────────────────────────────
const id = path.basename(file, ".md");
const line = LINES[id];
if (!line) P(file, `file must be named after its line, one of ${Object.keys(LINES).join(", ")}`);
const md = fs.readFileSync(file, "utf8");
if (/\r/.test(md)) P(file, "Windows line endings — save with \\n");
const blocks = R.parseBlocks(md);
for (const b of blocks.filter((x) => x.stray)) P(`${file}:${b.line}`, `stray line outside any day (only day blocks go in the file): ${b.stray.slice(0, 60)}`);
const days = blocks.filter((x) => !x.stray);

const existingTitles = new Set([...fs.readFileSync(path.join(ROOT, "data/traditions-source.md"), "utf8").matchAll(/^### \w+ \d+ — "(.+?)"/gm)].map((m) => m[1].toLowerCase()));
const seenTitles = new Set();

if (line) {
  const [month, first, last] = line;
  const want = [];
  for (let d = first; d <= last; d++) want.push(d);
  const got = days.map((d) => (d.month === month ? d.day : `${d.month}-${d.day}`));
  if (JSON.stringify(got) !== JSON.stringify(want)) P(file, `days must be ${R.cap(month)} ${first}–${last} in order; found ${got.join(", ") || "none"}`);
}

const BANNED = [
  [/sponsor/i, `"sponsor" (SPEC §4: describe the real thing)`],
  [/twelve steps and twelve traditions/i, "the 12&12 (never)"],
  [/twelve and twelve|12\s*(&|and)\s*12/i, "the 12&12 (never)"],
  [/first edition|1939 edition/i, "the first edition (never; cite 4th-edition pages)"],
  [/good oldtimers/i, "Dr. Bob and the Good Oldtimers (not in this wave)"],
  [/\*Pass It On\*|\(Pass It On/, "Pass It On (not in this wave)"],
  [/service manual/i, "the Service Manual (not in this wave)"],
  [/\bP-(43|44|53|16|8)\b/, "a pamphlet other than P-17 (not in this wave)"],
  [/language of the heart/i, "The Language of the Heart (not in this wave)"],
  [/[“”‘]/, "curly quotes — use straight \" (and ' for apostrophes)"],
];

for (const d of days) {
  const where = `${R.cap(d.month)} ${d.day}`;
  if (d.heading !== `### ${R.cap(d.month)} ${d.day} — "${d.title}" · *(${d.kind})*`) P(where, "heading isn't in the exact format (SPEC §1)");
  if (!R.MONTH_TRADITION[d.month] || R.MONTH_TRADITION[d.month] > 6) P(where, "month must be January–June");
  if (d.day < 1 || d.day > (R.DAYS_IN[d.month] || 31)) P(where, "no such day");
  const kind = R.KINDS[(d.day - 1) % 5];
  // The five kinds are LABELS, not law (Derick, Aug 2026 — parse-traditions.js): a known kind is required,
  // the rotation is the spec's default and only a note when a day departs from it.
  if (!R.KINDS.includes(d.kind)) P(where, `kind "${d.kind}" isn't one of: ${R.KINDS.join(" · ")}`);
  else if (d.kind !== kind) warn.push(`${where}: the rotation puts "${kind}" here, not "${d.kind}" — fine if the reading's point needs it; say why in your status file`);
  const rest = d.rest.filter((l) => l.trim());
  if (rest.length !== 3 || !rest[1].startsWith("*Sit with:* ") || !rest[2].startsWith("*Grounded in:* ") || d.rest[0] !== rest[0])
    P(where, "after the heading: exactly three lines — the body (one line), *Sit with:*, *Grounded in:*");
  const words = d.body.split(/\s+/).filter(Boolean).length;
  // Shape is direction, not law (WRITING-DIRECTION.md): hard limits only where a reading stops being one.
  if (words < 120 || words > 260) P(where, `body is ${words} words — that's not one reading (aim 180–230)`);
  else if (words < 180 || words > 230) warn.push(`${where}: ${words} words (the spec aims for 180–230)`);
  if (!/Test it tonight:/.test(d.body)) warn.push(`${where}: no "Test it tonight:" (SPEC §3.7) — fine only if the ending does that job another way`);
  else if (d.body.lastIndexOf("Test it tonight:") < d.body.length * 0.6) warn.push(`${where}: "Test it tonight:" usually comes last`);
  if (!/\?$/.test(d.sitWith.trim())) P(where, "Sit with must end on a question");
  if ((d.sitWith.match(/[.!]/g) || []).length === 0) P(where, "Sit with: a plain statement first, then the question");
  if (!/\.$/.test(d.groundedIn.trim())) P(where, "Grounded in ends with a period");
  const lfRx = new RegExp(`[Ll]ong form, Tradition ${d.tradition} \\(Big Book, pp?\\. 56[34]`);
  if (!lfRx.test(d.groundedIn)) P(where, `Grounded in must name "Long form, Tradition ${d.tradition} (Big Book, p. 563)" (or p. 564 / pp. 563–564 for Tradition 6)`);
  const tw = d.title.split(/\s+/).length;
  if (tw > 8) P(where, `title is ${tw} words; keep it short (most are 2–5, never over 8)`);
  if (existingTitles.has(d.title.toLowerCase())) P(where, `title "${d.title}" is already used this year`);
  if (seenTitles.has(d.title.toLowerCase())) P(where, `title "${d.title}" is used twice in this file`);
  seenTitles.add(d.title.toLowerCase());
  const all = [d.title, d.body, d.sitWith, d.groundedIn].join("\n");
  for (const [rx, what] of BANNED) if (rx.test(all)) P(where, what);
  if ((d.body.match(/"/g) || []).length % 2) P(where, "odd number of \" in the body — a quotation isn't closed");

  // the quote gate
  for (const field of [["body", d.body], ["Sit with", d.sitWith]]) {
    for (const m of field[1].matchAll(/"([^"]{4,2000})"/g)) {
      const raw = m[1];
      if (/…|\.\.\./.test(raw)) { P(where, `ellipsis inside a quotation: "${raw.slice(0, 50)}…" — quote two pieces`); continue; }
      const q = raw.replace(/^[\s"'—–,;.]+|[\s"'—–,;.]+$/g, "");
      if (q.length < 25) continue;
      const sq = squash(q);
      const hit = SOURCES.find(([, h]) => h && h.includes(sq));
      if (!hit) { P(where, `${field[0]}: quotation not found in the Big Book, A.A. Comes of Age or P-17 — "${q.slice(0, 90)}${q.length > 90 ? "…" : ""}"`); continue; }
      // a page named right before the quote must hold it
      const before = field[1].slice(Math.max(0, m.index - 60), m.index);
      const bbp = before.match(/Big Book,? pp?\. (\d+)(?:[–-](\d+))?\)?:?\s*$/);
      if (bbp) {
        const pages = bbp[2] ? [bbp[1], bbp[2]] : [bbp[1]];
        if (!pages.some((pg) => bbPage(pg).includes(sq)) && !squash(pages.map((pg) => BB.filter((e) => String(e.l) === pg).map((e) => e.t).join(" ")).join(" ")).includes(sq))
          P(where, `quote is not on Big Book p. ${pages.join("–")}: "${q.slice(0, 60)}…"`);
      }
      const pp = before.match(/P-17,? pp?\. (\d+)(?:[–-](\d+))?\)?:?\s*$/);
      if (pp && p17Raw) {
        const pages = pp[2] ? [pp[1], pp[2]] : [pp[1]];
        if (!pages.some((pg) => (p17Pages[pg] || "").includes(sq))) {
          const real = Object.keys(p17Pages).filter((pg) => p17Pages[pg].includes(sq));
          P(where, `quote is not on P-17 p. ${pages.join("–")}${real.length ? ` (it's on p. ${real.join(", ")})` : " (it crosses a page — cite both, pp. N–M)"}: "${q.slice(0, 60)}…"`);
        }
      }
    }
  }
}

// ── report ──────────────────────────────────────────────────────────────────
for (const d of days) console.log(`  ${R.cap(d.month)} ${String(d.day).padStart(2)}  ${d.kind.padEnd(22)} ${String(d.body.split(/\s+/).filter(Boolean).length).padStart(3)}w  ${d.title}`);
for (const w of warn) console.log("  note: " + w);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log("  - " + p);
} else console.log(`\n0 problems — ${days.length} day(s).`);

if (PAGES) {
  const tplDay = fs.readFileSync(path.join(ROOT, "daily-tradition/october-3/index.html"), "utf8");
  const live = ["july", "august", "september", "october", "november", "december", ...new Set(days.map((d) => d.month))];
  days.forEach((d, i) => {
    const dir = path.join(ROOT, "daily-tradition", d.key);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), R.renderDay(tplDay, d, days[i - 1] && days[i - 1].month === d.month ? days[i - 1] : null, days[i + 1] && days[i + 1].month === d.month ? days[i + 1] : null, live));
  });
  console.log(`preview: wrote ${days.length} page(s) under daily-tradition/ — throw them away before committing`);
}
process.exit(problems.length ? 1 : 0);
