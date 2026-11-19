#!/usr/bin/env node
/**
 * parse-traditions.js — turn the Daily Traditions markdown into data/traditions-daily.json, keyed "month-day"
 * (same shape as reflections.json). The readings are copied verbatim; --verify diffs every parsed reading back
 * against the source markdown, character for character, and throws on the first mismatch.
 *
 * Source: data/traditions-source.md
 * Usage:  node scripts/parse-traditions.js [--verify]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "data", "traditions-source.md");
const OUT = path.join(ROOT, "data", "traditions-daily.json");

// Month -> Tradition. January = T1 ... July = T7 ... December = T12.
const MONTH_TRADITION = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

// The Traditions, short form, read from data/twelve-traditions.json (verbatim, 4th ed).
const TRAD = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-traditions.json"), "utf8"));
const shortFormFor = (n) => {
  const t = TRAD.traditions.find((x) => x.n === n);
  if (!t) throw new Error("No Tradition " + n + " in data/twelve-traditions.json");
  return t.short;
};

const raw = fs.readFileSync(SRC, "utf8");

// Each reading:
//   ### July 1 — "Title" · *(hypothetical)*
//   body paragraph
//   *Sit with:* question
//   *Grounded in:* citation
// No `|$` in the lookahead: under /m `$` matches end-of-line, which would stop the lazy body at the heading.
const blockRx = /^### (\w+) (\d+) — "(.+?)" · \*\((.+?)\)\*\s*\n([\s\S]*?)(?=\n### |\n---|\n\*\*Pack-check)/gm;

const days = [];
let m;
while ((m = blockRx.exec(raw)) !== null) {
  const [, monthName, dayStr, title, kind, rest] = m;
  const month = monthName.toLowerCase();
  const day = parseInt(dayStr, 10);

  const sitRx = /^\*Sit with:\*\s*(.+)$/m;
  const gndRx = /^\*Grounded in:\*\s*(.+)$/m;

  const sit = rest.match(sitRx);
  const gnd = rest.match(gndRx);
  if (!sit) throw new Error(`Missing "Sit with:" for ${monthName} ${day}`);
  if (!gnd) throw new Error(`Missing "Grounded in:" for ${monthName} ${day}`);

  // Body = everything before the "Sit with:" line, verbatim.
  const body = rest.slice(0, rest.indexOf("*Sit with:*")).trim();
  if (!body) throw new Error(`Empty body for ${monthName} ${day}`);

  days.push({
    key: `${month}-${day}`,
    month,
    day,
    tradition: MONTH_TRADITION[month],
    title: title.trim(),
    // Two kind schemes:
    //   July (T7), August (T8): "hypothetical" | "the earned answer", odd/even.
    //   September (T9) onward: the five questions, in order —
    //     "the threat" | "before the tradition" | "the threat today" |
    //     "how a group breaks it" | "how it gets captured".
    kind: kind.trim(),
    // Q4 ("how a group breaks it") is the new scheme's hypothetical and the only new-scheme day with the disclaimer.
    hypothetical: /hypothetical|how a group breaks it/i.test(kind),
    body,                                 // VERBATIM
    sitWith: sit[1].trim(),               // VERBATIM
    groundedIn: gnd[1].trim(),            // VERBATIM
  });
}

if (!days.length) throw new Error("Parsed 0 readings — the source format changed.");

// ── Round-trip verification: every field must appear VERBATIM in the source ──
let drift = 0;
for (const d of days) {
  for (const [field, val] of [["body", d.body], ["sitWith", d.sitWith], ["groundedIn", d.groundedIn], ["title", d.title]]) {
    if (raw.indexOf(val) === -1) {
      console.error(`DRIFT on ${d.key} [${field}]: parsed text is not a verbatim substring of the source.`);
      drift++;
    }
  }
}
if (drift) throw new Error(`${drift} verbatim check(s) failed. Refusing to write. The readings are approved content — they do not get rewritten.`);

// The odd/even pairing check applies only to the July/August scheme.
const OLD_SCHEME = /^(hypothetical|the earned answer)$/i;
const oldSchemeDays = days.filter((d) => OLD_SCHEME.test(d.kind));
const badPair = oldSchemeDays.filter((d) => (d.day % 2 === 1) !== d.hypothetical);
if (badPair.length) {
  console.warn("Pairing warning (odd should be hypothetical, even the earned answer):", badPair.map((d) => d.key).join(", "));
}

// The five-question tag only has to be a known kind; which kind a day carries isn't checked.
const FIVE_Q = ["the threat", "before the tradition", "the threat today", "how a group breaks it", "how it gets captured"];

// Every reading uses a known kind from one of the two schemes.
const unknownKind = days.filter((d) => !OLD_SCHEME.test(d.kind) && !FIVE_Q.includes(d.kind.toLowerCase()));
if (unknownKind.length) {
  throw new Error("Unknown kind tag(s): " + unknownKind.map((d) => `${d.key} → "${d.kind}"`).join(", "));
}

const out = {
  generated: "2026-07-28",
  source: "data/traditions-source.md",
  doctrine: {
    note: "The Traditions are GOVERNANCE, not theology. They bind A.A. groups and the Fellowship — not individuals, and not independent businesses.",
    shortForm: { pages: "561–562" },
    longForm: { pages: "563–566" },
    concepts: { pages: "574–575" },
  },
  traditions: Object.fromEntries([...new Set(days.map((d) => d.tradition))].map((n) => [n, { shortForm: shortFormFor(n) }])),
  days,
};

if (!process.argv.includes("--verify")) {
  fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
}

console.log("Daily Traditions parsed" + (process.argv.includes("--verify") ? " (VERIFY ONLY)" : ""));
console.log("  readings          : " + days.length);
console.log("  months            : " + [...new Set(days.map((d) => d.month))].join(", "));
console.log("  traditions        : " + [...new Set(days.map((d) => d.tradition))].join(", "));
console.log("  hypothetical days : " + days.filter((d) => d.hypothetical).length);
console.log("  earned-answer days: " + days.filter((d) => !d.hypothetical).length);
console.log("  verbatim check    : PASS (all " + days.length * 4 + " fields are exact substrings of the source)");
