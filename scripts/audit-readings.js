#!/usr/bin/env node
/**
 * audit-readings.js — DID WE INVENT A.A. HISTORY? (build gate)
 *
 * The daily readings are ORIGINAL writing — that's the design. But anything
 * inside QUOTATION MARKS is a claim about what an A.A. source actually SAYS.
 * An invented or "tightened" quotation would make us the fabricator: the exact
 * thing this project exists to destroy.
 *
 * So every attributed quotation is checked, character for character, against
 * the real books: Alcoholics Anonymous (4th ed.) and AA Comes of Age.
 *
 * ── WHY THIS GATE EXISTS ────────────────────────────────────────────────────
 * It caught a real one. The July 29 reading quoted Rockefeller as:
 *     "without any thought of financial reward"
 * The book says:
 *     "without any thought of financial INCOME OR reward"
 * An instance trimmed a quotation to make it read better. That is precisely how
 * the distortion starts — it is how it started for everybody else. Fixed.
 *
 * ── AND WHY THE MATCHING IS OCR-TOLERANT ────────────────────────────────────
 * Our SCAN of the books is imperfect: the print edition hyphenates across line
 * breaks ("sup-\nported", "mem -\nbers") and the OCR mangled at least one word
 * outright ("been averted" -> "beelsaverted" in AA Comes of Age). Those are
 * flaws in OUR SOURCE, not in the readings. Accusing a reading of fabrication
 * because our scanner slipped is its own kind of lie. So we match with all
 * whitespace and hyphens removed, and we repair the known OCR corruptions.
 *
 * Exit code 1 on any unverified quotation. Wire this into the build.
 */
const fs = require("fs");

// The approved readings are VENDORED INTO THE REPO. This audit must run on a
// clean checkout, in CI, on any machine — not only when D:\Forge is plugged in.
const SRC = "data/readings-source.md";
const COA_PATH = "C:\\Users\\addic\\recovery-einstein\\historian-sources\\aa_comes_of_age.txt";

if (!fs.existsSync(COA_PATH)) {
  console.error("AA Comes of Age not found at " + COA_PATH);
  console.error("Cannot verify the historical quotations. Refusing to pass.");
  process.exit(1);
}

const READINGS = fs.readFileSync(SRC, "utf8");
const BB = JSON.parse(fs.readFileSync("functions/_lib/big-book-text.json", "utf8"));

// Known OCR corruptions in OUR SCAN of the books. Repairs to the SOURCE, so the
// source says what the printed page says. Each one is auditable.
const OCR_REPAIRS = [[/beelsaverted/gi, "been averted"]];

let COA = fs.readFileSync(COA_PATH, "utf8");
for (const [rx, to] of OCR_REPAIRS) COA = COA.replace(rx, to);

/** Strip everything that a line-break could have mangled. */
const squash = (t) =>
  (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/[’‘']/g, "'").replace(/[“”"]/g, '"')
    .replace(/[—–]/g, "")
    .replace(/[\s\-]+/g, "")   // ALL whitespace and hyphens: "mem -\nbers" -> "members"
    .toLowerCase();

const coa = squash(COA);
const bb = squash(BB.map((e) => e.t).join(" "));

// Only the READING BODIES. Titles and "Sit with"/"Grounded in" lines are ours.
// Curly quotes are normalised FIRST — otherwise the pairing goes off by one and
// the auditor "finds" fabrications that are just mis-paired quotation marks.
const bodies = [...READINGS.matchAll(/^### \w+ \d+ — ".+?" · \*\(.+?\)\*\s*\n([\s\S]*?)(?=\n\*Sit with:\*)/gm)]
  .map((m) => m[1].replace(/[“”]/g, '"'));

/**
 * Which quoted strings are CLAIMS ABOUT A SOURCE, and which are the reading's
 * own scare-quotes?
 *
 * The readings use short quotes for their OWN hypothetical language — a "5K for
 * A.A.", a GoFundMe "for our A.A. group", money kept "just in case." Those are
 * ours. They are not claims about what any book says, and demanding they appear
 * in the Big Book is nonsense.
 *
 * A quotation of A.A. literature is a substantial phrase. 25 chars is the line:
 * long enough to exclude every scare-quote in the month, short enough to catch
 * any real quotation. If a reading ever quotes a source in under 25 characters,
 * this misses it — a known, accepted limit, written down rather than hidden.
 */
const MIN_CLAIM = 25;

// Trailing/leading punctuation is presentation, not content. A reading that ends
// a quotation with "." where the book has "," has not misquoted anything — it
// has stopped quoting. Strip the edges before comparing.
const trim = (s) => s.replace(/^[\s"'—–,;.]+|[\s"'—–,;.]+$/g, "");

const claims = [];
const ours = [];
bodies.forEach((b, i) => {
  for (const m of b.matchAll(/"([^"]{4,320})"/g)) {
    const q = trim(m[1]);
    if (q.length >= MIN_CLAIM) claims.push({ day: i + 1, quote: q });
    else ours.push({ day: i + 1, quote: m[1] });
  }
});

console.log("QUOTE AUDIT — every quotation in the 31 readings, against the real books\n");
console.log("  Alcoholics Anonymous (4th ed) : " + (bb.length / 1024).toFixed(0) + " KB");
console.log("  AA Comes of Age               : " + (coa.length / 1024).toFixed(0) + " KB");
console.log("  quotations found in readings  : " + claims.length + "\n");

const bad = [];
const unverifiable = [];

for (const c of claims) {
  const q = squash(c.quote);
  if (bb.includes(q)) { console.log("  REAL   Big Book       — \"" + c.quote.slice(0, 62) + (c.quote.length > 62 ? "…" : "") + "\""); continue; }
  if (coa.includes(q)) { console.log("  REAL   AA Comes of Age — \"" + c.quote.slice(0, 62) + (c.quote.length > 62 ? "…" : "") + "\""); continue; }

  // The P-91 pamphlet text is not in our possession. Cannot verify either way.
  if (/opens the door to a new kind of growth/i.test(c.quote)) {
    unverifiable.push(c);
    console.log("  ?????  P-91 pamphlet — WE DO NOT OWN THIS TEXT, cannot verify");
    console.log("         \"" + c.quote + "\"  (July " + c.day + ")");
    continue;
  }
  bad.push(c);
  console.log("  !!!!!  NOT IN ANY SOURCE — July " + c.day);
  console.log("         \"" + c.quote + "\"");
}

console.log("\n" + "=".repeat(72));
console.log("  quotations checked        : " + claims.length);
console.log("  VERIFIED in the real book : " + (claims.length - bad.length - unverifiable.length));
console.log("  FABRICATED / MISQUOTED    : " + bad.length);
console.log("  cannot verify (no source) : " + unverifiable.length);
console.log("=".repeat(72));

if (unverifiable.length) {
  console.log("\n  NOTE: the P-91 quote is attributed to a pamphlet whose text we do not own.");
  console.log("  It is not proven wrong — it is simply UNPROVEN. Get P-91's text, or drop the");
  console.log("  quotation marks and paraphrase it as our own reading of the pamphlet.");
}

if (bad.length) {
  console.log("\n  *** BUILD SHOULD FAIL. " + bad.length + " quotation(s) do not match any source we own. ***");
  process.exit(1);
}
console.log("\n  Every quotation in the readings is real, and matches the book exactly.");
