#!/usr/bin/env node
/**
 * extract-concepts.js — the Twelve Concepts for World Service, both forms,
 * extracted VERBATIM from The A.A. Service Manual.
 *
 * SOURCE CHOICE (load-bearing): the Concepts appear in Big Book Appendix VII in
 * short form only. Their real home is The A.A. Service Manual Combined With
 * Twelve Concepts for World Service, which A.A. publishes FREE as a PDF on
 * aa.org and actively circulates to members — and which carries BOTH the short
 * form and the long form. That is the source used here.
 *
 * Text is read from the historian corpus copy of the manual and never retyped.
 * The manual's PDF extraction carries known OCR damage — typographic ligatures
 * and spurious mid-word spaces. Every repair is listed explicitly in REPAIRS
 * below, is a pure spelling restoration, and is asserted at the end: no repair
 * may change a word into a different word. Nothing here rewrites, condenses or
 * "modernises" a Concept.
 *
 * Output: data/twelve-concepts.json (same shape as data/twelve-traditions.json)
 *
 * Usage: node scripts/extract-concepts.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join("C:", "Users", "addic", "recovery-einstein", "historian-sources", "aa_service_manual.txt");
const OUT = path.join(ROOT, "data", "twelve-concepts.json");

// ── OCR repairs. Ligature glyphs + spurious spaces the PDF text layer inserted
// mid-word. Each entry restores a word's spelling and nothing else. ──────────
const LIGATURES = [
  [/ﬀ/g, "ff"], [/ﬁ/g, "fi"], [/ﬂ/g, "fl"],
  [/ﬃ/g, "ffi"], [/ﬄ/g, "ffl"],
];
const REPAIRS = [
  ["executiv es", "executives"],
  ["v oice", "voice"],
  ["P articipation", "Participation"],
  ["w orld", "world"],
  ["w ell", "well"],
  ["fina l", "final"],
  ["polic y", "policy"],
  ["Decision ”", "Decision”"],
];

function repair(s) {
  let out = s;
  for (const [rx, to] of LIGATURES) out = out.replace(rx, to);
  for (const [from, to] of REPAIRS) out = out.split(from).join(to);
  return out.replace(/\s+/g, " ").trim();
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

// Pull the block that follows a heading, up to the next page marker/heading.
function block(text, heading, endMarker) {
  const start = text.indexOf(heading);
  if (start === -1) throw new Error(`heading not found: ${heading}`);
  const from = start + heading.length;
  const end = endMarker ? text.indexOf(endMarker, from) : text.length;
  return text.slice(from, end === -1 ? text.length : end);
}

// Split a block into its twelve roman-numbered items. Page markers and running
// heads (C-IV, C-V…) are dropped — they are print furniture, not text.
function splitConcepts(raw) {
  const cleaned = raw
    .replace(/---\s*Page \d+\s*---/g, "\n")
    .replace(/^\s*C-[IVX]+\s*/gm, "\n");
  // Any roman-ish run followed by a period. Alternation can't be trusted here —
  // the PDF splits numerals mid-word ("I V.", "V I.") and a first-match-wins
  // alternation would match the leading "I" and miss the item. Scan broadly,
  // then keep only runs that are real numerals once their spaces are removed.
  const rx = /(?:^|\n|\s)\s*([IVX][IVX ]{0,4})\.\s+/g;
  const hits = [];
  let m;
  while ((m = rx.exec(cleaned)) !== null) {
    const numeral = m[1].replace(/\s/g, "");
    if (ROMAN.includes(numeral)) hits.push({ numeral, from: m.index + m[0].length });
  }
  // keep the first appearance of each numeral in order I…XII
  const items = [];
  for (let i = 0; i < ROMAN.length; i++) {
    const hit = hits.find((h, idx) => h.numeral === ROMAN[i] && (items.length === 0 || h.from > items[items.length - 1].from));
    if (!hit) throw new Error(`Concept ${ROMAN[i]} not found`);
    items.push(hit);
  }
  return items.map((h, i) => {
    const end = i + 1 < items.length ? items[i + 1].from : cleaned.length;
    // trim the trailing numeral of the NEXT item off this one
    let body = cleaned.slice(h.from, end).replace(/\s*[IVX][IVX ]{0,4}\.\s*$/, "");
    return { n: i + 1, text: repair(body) };
  });
}

const text = fs.readFileSync(SRC, "utf8");
const shortRaw = block(text, "THE TWELVE CONCEPTS (SHORT FORM)", "THE TWELVE CONCEPTS (LONG FORM)");
const longRaw = block(text, "THE TWELVE CONCEPTS (LONG FORM)", "CONTENTS");

const shortItems = splitConcepts(shortRaw);
const longItems = splitConcepts(longRaw);

// ── verification: nothing ships unless every assertion holds ────────────────
const problems = [];
if (shortItems.length !== 12) problems.push(`short form has ${shortItems.length} items`);
if (longItems.length !== 12) problems.push(`long form has ${longItems.length} items`);
for (const set of [["short", shortItems], ["long", longItems]]) {
  for (const c of set[1]) {
    if (/[ﬀ-ﬆ]/.test(c.text)) problems.push(`${set[0]} ${c.n}: unrepaired ligature`);
    // signature of the PDF's mid-word space damage: a lone letter that isn't a
    // real one-letter word, sitting against the next word ("v oice", "w orld").
    // This assertion is what catches damage the REPAIRS map hasn't learned yet.
    const split = c.text.match(/(?:^|\s)([b-hj-z]) [a-z]{2,}/gi);
    if (split) problems.push(`${set[0]} ${c.n}: possible split word —${split.map((s) => ` "${s.trim()}"`).join("")}`);
    if (/\bPage \d+\b|C-[IVX]+/.test(c.text)) problems.push(`${set[0]} ${c.n}: print furniture leaked in`);
    if (c.text.length < 60) problems.push(`${set[0]} ${c.n}: suspiciously short (${c.text.length} chars)`);
    // Concept III legitimately closes on a quotation: …“Right of Decision.”
    if (!/[.][”"]?$/.test(c.text)) problems.push(`${set[0]} ${c.n}: does not end in a period`);
  }
}
// every REPAIR must have been a spelling restoration, not a word swap
for (const [from, to] of REPAIRS) {
  if (from.replace(/\s/g, "").toLowerCase() !== to.replace(/\s/g, "").toLowerCase()) {
    problems.push(`REPAIR changes letters, not just spacing: "${from}" -> "${to}"`);
  }
}
// long form must be longer than short form for every concept (it is the expansion)
for (let i = 0; i < 12; i++) {
  if (longItems[i].text.length <= shortItems[i].text.length) {
    problems.push(`Concept ${ROMAN[i]}: long form is not longer than short form`);
  }
}
if (problems.length) {
  console.error("EXTRACTION FAILED — nothing written:");
  for (const p of problems) console.error("  ✗", p);
  process.exit(1);
}

const out = {
  source: "The A.A. Service Manual Combined With Twelve Concepts for World Service",
  publisher: "Alcoholics Anonymous World Services, Inc.",
  freely_published: "A.A. publishes this manual free as a PDF at aa.org and circulates it to members; it is the Concepts' own home, unlike Big Book Appendix VII which carries the short form only.",
  shortForm: { pages: "C-IV" },
  longForm: { pages: "C-V – C-VI" },
  extracted: new Date().toISOString().slice(0, 10),
  note: "Extracted verbatim from the manual text. Never retyped, never paraphrased. OCR ligature and mid-word-space damage repaired via the explicit REPAIRS map in scripts/extract-concepts.js; every repair is asserted to change spacing only, never letters.",
  concepts: ROMAN.map((r, i) => ({
    n: i + 1,
    roman: r,
    short: shortItems[i].text,
    long: longItems[i].text,
  })),
};

if (process.argv.includes("--dry")) {
  console.log(JSON.stringify(out.concepts[0], null, 1));
  console.log(`\n✓ 12 short + 12 long extracted and verified (dry run, nothing written)`);
} else {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(`✓ wrote ${path.relative(ROOT, OUT)} — 12 Concepts, both forms, all assertions passed`);
}
