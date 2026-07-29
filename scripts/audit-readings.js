#!/usr/bin/env node
/**
 * audit-readings.js — every quotation, checked against the real sources. Build gate.
 *
 * The daily readings are original writing. But anything inside QUOTATION MARKS is
 * a claim about what an A.A. source actually SAYS. An invented or "tightened"
 * quotation would make us the fabricator — the thing this project exists to end.
 *
 * So every quotation is checked, character for character, against the real text.
 * Exit code 1 on any that doesn't match. Wire this into the build.
 *
 * ── QUOTE FREELY. QUOTE EXACTLY. ────────────────────────────────────────────
 * This gate is NOT a reason to quote less. Quoting the actual words is the whole
 * point — it is what makes a reading land, and it is what nobody else does. Quote
 * as much as the reading needs. Just never reshape a quotation to make it read
 * better. If it's in quotation marks, it's the source's exact words.
 *
 * (It caught a real one: a July reading said Rockefeller spoke "without any
 * thought of financial reward." The book says "without any thought of financial
 * INCOME OR reward." Two words dropped for rhythm. That is how distortion starts.)
 *
 * ── WHAT WE MAY QUOTE ───────────────────────────────────────────────────────
 * Alcoholics Anonymous (4th ed.) · AA Comes of Age · the A.A. Service Manual ·
 * Pass It On · Dr. Bob and the Good Oldtimers · Experience Strength & Hope ·
 * pamphlets P-17 (A.A. Tradition), P-43 (Traditions Illustrated),
 * P-44 (Legacy of Service).
 *
 * ── WHAT WE NEVER USE: THE 12&12 ────────────────────────────────────────────
 * Not "don't quote it" — don't USE it. The Twelve Steps and Twelve Traditions
 * binds the Steps and the Traditions into one book, and that binding is the very
 * thing treatment centres exploit: it lets them present the Traditions as twelve
 * more steps for the INDIVIDUAL to work, when the Traditions are rules for the
 * GROUP. That is the distortion, at its source. We don't reach for the tool that
 * built it.
 */
const fs = require("fs");
const path = require("path");

const SRC = "data/readings-source.md";
const HIST = "C:\\Users\\addic\\recovery-einstein\\historian-sources";

// Everything we are allowed to quote. A source we can't grep is a source we
// can't verify — and a quotation we can't verify does not ship.
const SOURCES = [
  ["Big Book (4th ed)",        null],                                  // loaded from JSON below
  ["AA Comes of Age",          "aa_comes_of_age.txt"],
  ["A.A. Service Manual",      "aa_service_manual.txt"],
  ["Pass It On",               "pass_it_on.txt"],
  ["Dr. Bob & the Oldtimers",  "dr_bob_and_the_good_oldtimers.txt"],
  ["Experience Strength Hope", "experience_strength_hope.txt"],
  ["P-17 A.A. Tradition",      "p-17_aa_traditions.txt"],
  ["P-43 Traditions Illustrated", "p-43_traditions_illustrated.txt"],
  ["P-44 Legacy of Service",   "p-44_aa_legacy_of_service.txt"],
];

// Known OCR corruptions in OUR SCANS. Repairs to the SOURCE so it says what the
// printed page says. Accusing a reading of fabrication because our scanner
// slipped is its own kind of lie. Each repair is listed so it can be audited.
const OCR_REPAIRS = [[/beelsaverted/gi, "been averted"]];

// The corpus-wide repair map lives NEXT TO THE SCANS it repairs — one file,
// read by both this gate and the app's DB ingest, so the two can never
// disagree. Each entry's "find" is a snippet of the raw scan that occurs
// exactly once in its file, carrying the corruption; "replace" is the same
// snippet as the printed page reads. Entries feed the same loop below.
// Full audit trail (evidence, sentences, reasons): ocr-repairs.json itself.
const MAP_FILE = path.join(HIST, "ocr-repairs.json");

// FAIL LOUD. This used to sit behind `if (fs.existsSync(MAP_FILE))`, which meant
// a missing map produced no error, no warning and no output — the audit simply
// ran with one repair instead of 2,746 and still printed PASS. That is the same
// silent-fallback shape that left the app's Tier 1 correction layer dead in
// production for months. An absent map is now a hard stop, because an audit that
// cannot repair the scans cannot tell a real quote from a scanner artifact.
if (!fs.existsSync(MAP_FILE)) {
  throw new Error(
    `OCR repair map missing: ${MAP_FILE}\n` +
      `The quote audit cannot run without it.\n` +
      `Restore it with:\n` +
      `  cd C:\\Users\\addic\\recovery-einstein\n` +
      `  git show origin/fix/ocr-corpus-repairs:historian-sources/ocr-repairs.json > historian-sources/ocr-repairs.json\n` +
      `(that branch is not merged to main, which is why the file can go absent)`
  );
}

// strip a UTF-8 BOM if one crept in — JSON.parse throws on it, and the message
// it throws ("Unexpected token") does not tell you a BOM is the reason.
const rawMap = fs.readFileSync(MAP_FILE, "utf8").replace(/^\uFEFF/, "");
const parsedMap = JSON.parse(rawMap);
if (!Array.isArray(parsedMap.repairs) || parsedMap.repairs.length === 0) {
  throw new Error(`OCR repair map has no repairs array: ${MAP_FILE}`);
}
{
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const r of parsedMap.repairs) {
    // global flag: each find occurs exactly once per file, except in
    // byte-identical duplicated passages where every copy needs the same fix
    OCR_REPAIRS.push([new RegExp(esc(r.find), "g"), r.replace]);
  }
  console.log(`  OCR repair map    : ${parsedMap.repairs.length} repairs loaded`);
}

/** Strip everything a line-break or hyphenation could have mangled. */
const squash = (t) =>
  (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/[’‘']/g, "'").replace(/[“”"]/g, '"')
    .replace(/[—–]/g, "")
    // SOFT HYPHEN U+00AD. The Big Book extract stores line-break hyphenation on
    // chapter pages as an INVISIBLE soft hyphen ("un­\nless"), not an ASCII
    // one — 103 pages carry them. It is a typesetting artifact that appears in no
    // printed copy, so it must be stripped exactly like the visible hyphens below.
    // Without this, any correctly-transcribed quote spanning a hyphenated word on
    // a chapter page is reported as FABRICATED. Found when the p.125 quotation
    // "unless we are sure he would approve" failed while being verbatim correct.
    .replace(/­/g, "")
    .replace(/[\s\-]+/g, "")     // ALL whitespace + hyphens: "mem -\nbers" -> "members"
    .toLowerCase();

// ── Load every source ───────────────────────────────────────────────────────
const haystacks = [];
const BB = JSON.parse(fs.readFileSync("functions/_lib/big-book-text.json", "utf8"));
haystacks.push(["Big Book (4th ed)", squash(BB.map((e) => e.t).join(" "))]);

const missing = [];
for (const [label, file] of SOURCES) {
  if (!file) continue;
  const p = path.join(HIST, file);
  if (!fs.existsSync(p)) { missing.push(label + "  (" + file + ")"); continue; }
  let t = fs.readFileSync(p, "utf8");
  for (const [rx, to] of OCR_REPAIRS) t = t.replace(rx, to);
  haystacks.push([label, squash(t)]);
}

console.log("QUOTE AUDIT — every quotation in the readings, against the real sources\n");
for (const [label, h] of haystacks) {
  console.log("  " + label.padEnd(30) + (h.length / 1024).toFixed(0).padStart(5) + " KB");
}
if (missing.length) {
  console.log("\n  NOT AVAILABLE (cannot verify quotes from these):");
  missing.forEach((m) => console.log("    " + m));
  console.log("    -> run: python scripts/extract-pamphlets.py");
}

// ── Pull the claims out of the readings ─────────────────────────────────────
const READINGS = fs.readFileSync(SRC, "utf8");
const bodies = [...READINGS.matchAll(/^### \w+ \d+ — ".+?" · \*\(.+?\)\*\s*\n([\s\S]*?)(?=\n\*Sit with:\*)/gm)]
  .map((m) => m[1].replace(/[“”]/g, '"'));

/**
 * Short quoted strings are the reading's OWN scare-quotes — a "5K for A.A.",
 * money kept "just in case". Those are ours, not claims about a source. A real
 * quotation of A.A. literature is a substantial phrase; 25 chars is the line.
 */
const MIN_CLAIM = 25;
const trim = (s) => s.replace(/^[\s"'—–,;.]+|[\s"'—–,;.]+$/g, "");

const claims = [];
bodies.forEach((b, i) => {
  for (const m of b.matchAll(/"([^"]{4,600})"/g)) {
    const q = trim(m[1]);
    if (q.length >= MIN_CLAIM) claims.push({ day: i + 1, quote: q });
  }
});

console.log("\n  quotations to verify : " + claims.length + "\n");

const bad = [];
for (const c of claims) {
  const q = squash(c.quote);
  const hit = haystacks.find(([, h]) => h.includes(q));
  if (hit) {
    console.log("  REAL   " + hit[0].padEnd(30) + '"' + c.quote.slice(0, 54) + (c.quote.length > 54 ? "…" : "") + '"');
  } else {
    bad.push(c);
    console.log("  !!!!!  NOT IN ANY SOURCE WE OWN — day " + c.day);
    console.log('         "' + c.quote + '"');
  }
}

console.log("\n" + "=".repeat(74));
console.log("  quotations checked : " + claims.length);
console.log("  VERIFIED           : " + (claims.length - bad.length));
console.log("  FABRICATED         : " + bad.length);
console.log("=".repeat(74));

if (bad.length) {
  console.log("\n  *** BUILD FAILS. " + bad.length + " quotation(s) are not in any source we own.");
  console.log("  Either fix the quote to the source's exact words, or drop the quotation");
  console.log("  marks and state it as our own reading. Never reshape a quotation.\n");
  process.exit(1);
}
console.log("\n  Every quotation is real and matches its source exactly.\n");
