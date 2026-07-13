#!/usr/bin/env node
/**
 * extract-longform.js — the Twelve Traditions, straight out of the book.
 *
 * ── WHY WE DON'T USE THE TRUTH PACK FOR THIS ────────────────────────────────
 * The truth pack is a hand-assembled secondary source, and it is abridged in at
 * least one place: its Tradition 9 long form contains a literal "…". Publishing
 * an abridged Long Form AS "the Long Form" would make us the distortion — the
 * precise failure this whole project exists to correct.
 *
 * So we go to the primary source: pages 561–562 (short form) and 563–566 (long
 * form) of Alcoholics Anonymous, 4th Edition, out of the book text itself.
 * Extracted, never retyped, never paraphrased, never remembered.
 *
 * The book's own words on why the long form matters (p.561):
 *   "Because the 'long form' is more explicit and of possible historic value,
 *    it is also reproduced."
 *
 * OUTPUT: data/twelve-traditions.json
 * Usage: node scripts/extract-longform.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "functions", "_lib", "big-book-text.json"), "utf8"));

function normalize(t) {
  return (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/’/g, "'").replace(/‘/g, "'")
    .replace(/“/g, '"').replace(/”/g, '"')
    .replace(/-\n/g, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * The print edition breaks words across lines with a hyphen. The PDF extraction
 * dropped the hyphen but kept the space, so a handful of words arrive split.
 * These are TYPOGRAPHIC repairs — restoring the word the book actually prints.
 * They are NOT edits to the text. Every one is listed here so it can be audited.
 */
const REPAIRS = [
  [/\brespon sibility\b/g, "responsibility"],
  [/\bmem bers\b/g, "members"],
  [/\bnon professional\b/g, "nonprofessional"],
  [/\bnonalco holics\b/g, "nonalcoholics"],
  [/\borganiza tion\b/g, "organization"],
  [/\bcommit tee\b/g, "committee"],
  [/\bcontribu tions\b/g, "contributions"],
  [/\banonym ity\b/g, "anonymity"],
  [/\bpersonali ties\b/g, "personalities"],
  [/\bspiritu al\b/g, "spiritual"],
  [/\bcontrover sial\b/g, "controversial"],
];
function repair(s) {
  let out = s;
  for (const [rx, to] of REPAIRS) out = out.replace(rx, to);
  return out.replace(/\s{2,}/g, " ").trim();
}

const page = (l) => repair(normalize((idx.find((x) => String(x.l) === l) || {}).t));

// ── SHORT FORM: page 562, split on One— Two— Three— … ───────────────────────
const WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const p562 = page("562");
const shorts = [];
for (let i = 0; i < 12; i++) {
  const start = p562.indexOf(WORDS[i] + "—");
  const end = i < 11 ? p562.indexOf(WORDS[i + 1] + "—") : p562.lastIndexOf(" 562");
  if (start === -1) throw new Error("Short form: could not find Tradition " + WORDS[i]);
  shorts.push(p562.slice(start + WORDS[i].length + 1, end === -1 ? undefined : end).trim().replace(/\s*562\s*$/, "").trim());
}

// ── LONG FORM: pages 563–566, split on 1.— 2.— 3.— … ───────────────────────
// The long form runs across four pages, so join them first, then split. Strip
// the running page numbers the extractor leaves at the page boundaries.
let longRaw = ["563", "564", "565", "566"].map(page).join(" ");
longRaw = longRaw.replace(/\s(563|564|565|566)\s/g, " ").replace(/\s(566)\s*$/, "");
const preamble = "Our A.A. experience has taught us that:";
const pre = longRaw.indexOf(preamble);
if (pre === -1) throw new Error("Long form: preamble not found on p.563");
longRaw = longRaw.slice(pre + preamble.length);

const longs = [];
for (let i = 1; i <= 12; i++) {
  const start = longRaw.indexOf(i + ".—");
  const end = i < 12 ? longRaw.indexOf(i + 1 + ".—") : longRaw.length;
  if (start === -1) throw new Error("Long form: could not find Tradition " + i);
  longs.push(longRaw.slice(start + String(i).length + 2, end).trim().replace(/\s*\d{3}\s*$/, "").trim());
}

// ── Assertions: publish nothing we can't stand behind ───────────────────────
const problems = [];
longs.forEach((t, i) => {
  const n = i + 1;
  if (/…|\.\.\./.test(t)) problems.push("T" + n + " long form contains an ellipsis — ABRIDGED, refusing to publish");
  if (!/[.!?"]$/.test(t)) problems.push("T" + n + " long form does not end in punctuation — truncated?");
  if (t.length < 60) problems.push("T" + n + " long form is only " + t.length + " chars — suspiciously short");
});
shorts.forEach((t, i) => {
  if (!/[.!?]$/.test(t)) problems.push("T" + (i + 1) + " short form does not end in punctuation");
});
// The clause the whole mission turns on MUST be present, verbatim, in T3 long.
if (!/as a group, they have no other affiliation/.test(longs[2])) {
  problems.push("Tradition 3 long form is MISSING the 'no other affiliation' clause — the extraction is wrong");
}
// Any remaining split-word artifacts?
const artifact = /\b(respon|mem|non|nonalco|organiza|commit|contribu|anonym|personali|spiritu|controver) [a-z]/;
[...shorts, ...longs].forEach((t, i) => {
  if (artifact.test(t)) problems.push("Possible unrepaired split word in entry " + i + ": " + (t.match(artifact) || [])[0]);
});

if (problems.length) {
  console.error("REFUSING TO WRITE — the extraction is not trustworthy:\n");
  problems.forEach((p) => console.error("  ✗ " + p));
  process.exit(1);
}

const out = {
  source: "Alcoholics Anonymous, 4th Edition — Appendix I, The A.A. Tradition",
  shortForm: { pages: "561–562" },
  longForm: { pages: "563–566" },
  extracted: "2026-07-12",
  note: "Extracted verbatim from the book text. Never retyped, never paraphrased. Typographic line-break splits repaired (see REPAIRS in scripts/extract-longform.js).",
  traditions: shorts.map((s, i) => ({ n: i + 1, short: s, long: longs[i] })),
};

fs.writeFileSync(path.join(ROOT, "data", "twelve-traditions.json"), JSON.stringify(out, null, 2));

console.log("THE TWELVE TRADITIONS — extracted from the book\n");
for (const t of out.traditions) {
  console.log("── Tradition " + t.n + " ──");
  console.log("  SHORT (p." + (t.n <= 12 ? "562" : "") + "): " + t.short);
  console.log("  LONG  (pp.563–566): " + t.long.slice(0, 110) + (t.long.length > 110 ? "…" : ""));
  console.log("         [" + t.long.length + " chars]");
  console.log();
}
console.log("Tradition 3 long form, in full — the clause the internet forgot:");
console.log("  " + out.traditions[2].long);
console.log("\nWritten: data/twelve-traditions.json");
console.log("All assertions passed. Nothing abridged. Nothing paraphrased.");
