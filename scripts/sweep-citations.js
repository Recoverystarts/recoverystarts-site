#!/usr/bin/env node
/**
 * sweep-citations.js — does each in-body (source) bracket name the book the
 * quote is ACTUALLY in?
 *
 * The build gate (audit-readings.js) proves every quotation exists somewhere in
 * the corpus. It does not check that the bracket standing in front of that
 * quotation points at the right book. Those are different claims, and only the
 * second one is what the reader is being asked to trust.
 *
 * Also verifies Big Book PAGE numbers against the page-keyed extract, and lists
 * quotations carrying no bracket at all.
 *
 * Read-only. Prints a report. Never writes.
 *
 * ── THREE WAYS THIS REPORTS A FALSE ALARM (all three cost real time once) ────
 * 1. SOURCE NAMED IN PROSE, not in a bracket. "Page xix of the Big Book is blunt:"
 *    is a perfectly good citation, but this script only looks at the nearest
 *    PRECEDING bracket, so it blames whichever bracket came earlier in the day.
 *    Sept 28 and Sept 10 both look wrong and are both correct. Read the sentence
 *    before flagging.
 * 2. QUOTE STRADDLES A BIG BOOK PAGE BREAK. The page-keyed extract stores the page
 *    NUMBER inline at the end of each page's text, so p.xiii ends "...in the
 *    conventional xiii" and p.xiv opens "sense of the word." A quotation crossing
 *    that seam matches NO page and not even the joined haystack. Sept 1's Foreword
 *    quote is exactly this, and it is correct as written. Never "fix" a quote on
 *    this evidence alone — check the adjacent page first.
 * 3. THE PAMPHLET EXTRACT HAS A DROPPED LINE. P-44 (Legacy of Service) is the same
 *    essay as Part II of the Service Manual; our P-44 text is missing one sentence
 *    the Manual has, so a long span verifies only in the Manual. Oct 22's bracket
 *    says P-44 and is right. Compare fragment-by-fragment before rebracketing.
 *
 * What it DOES catch reliably, and what it was written for: a reading that names
 * source A, switches to source B mid-way, then returns to A's material without
 * re-naming it. The reader attributes the later quote to B. Six of those existed
 * in Oct/Dec when this first ran.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "data", "readings-source.md");
const HIST = "C:\\Users\\addic\\recovery-einstein\\historian-sources";
const MAP_FILE = path.join(HIST, "ocr-repairs.json");

const SOURCES = [
  ["AA Comes of Age", "aa_comes_of_age.txt"],
  ["A.A. Service Manual", "aa_service_manual.txt"],
  ["Pass It On", "pass_it_on.txt"],
  ["Dr. Bob & the Oldtimers", "dr_bob_and_the_good_oldtimers.txt"],
  ["Experience Strength Hope", "experience_strength_hope.txt"],
  ["P-17 A.A. Tradition", "p-17_aa_traditions.txt"],
  ["P-43 Traditions Illustrated", "p-43_traditions_illustrated.txt"],
  ["P-44 Legacy of Service", "p-44_aa_legacy_of_service.txt"],
];

// How a bracket as written in the readings maps to a corpus label.
const BRACKET_TO_LABEL = [
  [/^A\.?A\.? Comes of Age$/i, "AA Comes of Age"],
  [/^A\.?A\.? Service Manual$/i, "A.A. Service Manual"],
  [/^Pass It On$/i, "Pass It On"],
  [/^Dr\.? Bob and the Good Oldtimers$/i, "Dr. Bob & the Oldtimers"],
  [/^Experience,? Strength,? and Hope$/i, "Experience Strength Hope"],
  [/^A\.?A\.? pamphlet P-17$/i, "P-17 A.A. Tradition"],
  [/^A\.?A\.? pamphlet P-43$/i, "P-43 Traditions Illustrated"],
  [/^A\.?A\.? pamphlet P-44$/i, "P-44 Legacy of Service"],
];
const BB_BRACKET = /^Big Book,?\s*p+\.?\s*([0-9ivxlIVXL]+)$/i;

const OCR_REPAIRS = [];
const rawMap = fs.readFileSync(MAP_FILE, "utf8").replace(/^\uFEFF/, "");
for (const r of JSON.parse(rawMap).repairs) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  OCR_REPAIRS.push([new RegExp(esc(r.find), "g"), r.replace]);
}

const squash = (t) =>
  (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/[’‘']/g, "'").replace(/[“”"]/g, '"')
    .replace(/[—–]/g, "")
    .replace(/­/g, "")
    .replace(/[\s\-]+/g, "")
    .toLowerCase();

// ── corpus ──────────────────────────────────────────────────────────────────
const haystacks = new Map();
const BB = JSON.parse(fs.readFileSync(path.join(ROOT, "functions", "_lib", "big-book-text.json"), "utf8"));
haystacks.set("Big Book (4th ed)", squash(BB.map((e) => e.t).join(" ")));
for (const [label, file] of SOURCES) {
  const p = path.join(HIST, file);
  if (!fs.existsSync(p)) { console.log("  MISSING CORPUS FILE: " + file); continue; }
  let t = fs.readFileSync(p, "utf8");
  for (const [rx, to] of OCR_REPAIRS) t = t.replace(rx, to);
  haystacks.set(label, squash(t));
}

// Big Book, page-keyed. Key name varies by extract; take whichever exists.
const bbPage = new Map();
for (const e of BB) {
  // page label lives in `l` ("i", "xiii", "562"), NOT `p` — checked against the extract
  const k = String(e.l !== undefined ? e.l : e.p !== undefined ? e.p : e.page !== undefined ? e.page : "");
  if (!k) continue;
  bbPage.set(k, (bbPage.get(k) || "") + " " + squash(e.t));
}

// ── readings ────────────────────────────────────────────────────────────────
const READINGS = fs.readFileSync(SRC, "utf8");
const days = [...READINGS.matchAll(/^### (\w+ \d+) — "(.+?)" · \*\(.+?\)\*\s*\n([\s\S]*?)(?=\n\*Sit with:\*)/gm)]
  .map((m) => ({ day: m[1], title: m[2], body: m[3].replace(/[“”]/g, '"') }));

const MIN_CLAIM = 25;
const trim = (s) => s.replace(/^[\s"'—–,;.]+|[\s"'—–,;.]+$/g, "");

let OURS = [];
const OURS_FILE = path.join(ROOT, "data", "scene-dialogue.json");
if (fs.existsSync(OURS_FILE)) {
  const raw = JSON.parse(fs.readFileSync(OURS_FILE, "utf8").replace(/^\uFEFF/, ""));
  OURS = (raw.dialogue || []).map(squash);
}

const MONTH_OF = (d) => d.split(" ")[0];
const WANT = process.argv[2] ? process.argv[2].split(",") : null;

let checked = 0, ok = 0;
const mismatches = [], uncited = [], pageBad = [], sceneQuotes = [];

for (const d of days) {
  if (WANT && !WANT.includes(MONTH_OF(d.day))) continue;

  // every bracket in this body, with its position
  const brackets = [];
  for (const m of d.body.matchAll(/\(([^()]{2,60})\)/g)) {
    brackets.push({ at: m.index, text: m[1].trim() });
  }

  for (const m of d.body.matchAll(/"([^"]{4,600})"/g)) {
    const q = trim(m[1]);
    if (q.length < MIN_CLAIM) continue;
    const sq = squash(q);
    if (OURS.includes(sq)) { sceneQuotes.push({ day: d.day, quote: q }); continue; }

    checked++;

    // where does it actually live?
    const found = [];
    for (const [label, hay] of haystacks) if (hay.includes(sq)) found.push(label);

    // nearest bracket BEFORE this quote
    let claim = null;
    for (const b of brackets) if (b.at < m.index) claim = b;

    if (!claim) { uncited.push({ day: d.day, quote: q, found }); continue; }

    const bb = claim.text.match(BB_BRACKET);
    if (bb) {
      const pg = bb[1];
      const pgText = bbPage.get(pg) || "";
      if (pgText.includes(sq)) { ok++; }
      else if (found.includes("Big Book (4th ed)")) {
        const real = [...bbPage.entries()].filter(([, t]) => t.includes(sq)).map(([p]) => p);
        pageBad.push({ day: d.day, quote: q, claimed: "p. " + pg, actual: real.length ? "p. " + real.join(", p. ") : "(page not located)" });
      } else {
        mismatches.push({ day: d.day, quote: q, claimed: claim.text, found });
      }
      continue;
    }

    let label = null;
    for (const [rx, lb] of BRACKET_TO_LABEL) if (rx.test(claim.text)) { label = lb; break; }
    if (!label) continue; // bracket isn't a source citation (prose aside)

    if (found.includes(label)) ok++;
    else mismatches.push({ day: d.day, quote: q, claimed: claim.text, found });
  }
}

const short = (s) => (s.length > 96 ? s.slice(0, 93) + "..." : s);
console.log("\nCITATION SWEEP — does each bracket name the book the quote is in?");
console.log("=".repeat(74));
console.log("  scope             : " + (WANT ? WANT.join(", ") : "all months"));
console.log("  quotations checked: " + checked);
console.log("  bracket correct   : " + ok);
console.log("  BRACKET WRONG     : " + mismatches.length);
console.log("  BIG BOOK PAGE OFF : " + pageBad.length);
console.log("  no bracket at all : " + uncited.length);
console.log("  scene dialogue    : " + sceneQuotes.length + " (ours by declaration, skipped)");

if (mismatches.length) {
  console.log("\n-- BRACKET NAMES THE WRONG BOOK " + "-".repeat(42));
  for (const x of mismatches) {
    console.log("  " + x.day + "  claimed (" + x.claimed + ")");
    console.log("      actually in: " + (x.found.length ? x.found.join(" | ") : "NOWHERE IN CORPUS"));
    console.log("      \"" + short(x.quote) + "\"");
  }
}
if (pageBad.length) {
  console.log("\n-- BIG BOOK PAGE NUMBER OFF " + "-".repeat(46));
  for (const x of pageBad) {
    console.log("  " + x.day + "  claimed " + x.claimed + "  ->  actually " + x.actual);
    console.log("      \"" + short(x.quote) + "\"");
  }
}
if (uncited.length) {
  console.log("\n-- QUOTATION WITH NO BRACKET IN FRONT OF IT " + "-".repeat(30));
  for (const x of uncited) {
    console.log("  " + x.day + "  in: " + (x.found.length ? x.found.join(" | ") : "NOWHERE IN CORPUS"));
    console.log("      \"" + short(x.quote) + "\"");
  }
}
console.log("\n" + "=".repeat(74));
console.log(mismatches.length + pageBad.length === 0
  ? "  SWEEP CLEAN — every bracket points at a book that holds its quote."
  : "  SWEEP FOUND PROBLEMS — see above.");
