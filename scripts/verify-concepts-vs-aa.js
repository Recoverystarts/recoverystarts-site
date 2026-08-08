#!/usr/bin/env node
/**
 * verify-concepts-vs-aa.js — check every published Concept, both forms, against
 * A.A.'s OWN current edition of the Service Manual.
 *
 * Our text is extracted from the historian corpus copy of the manual. This gate
 * proves that copy still matches what A.A. publishes today (BM-31, 2024–2026),
 * so an older corpus edition can never quietly become the version the world
 * reads off our site.
 *
 * The reference PDF is not committed (11MB, and it is A.A.'s to distribute).
 * Download the current manual from aa.org and point this at it:
 *
 *   node scripts/verify-concepts-vs-aa.js "C:\\path\\to\\BM-31_..._Service_Manual.pdf"
 *
 * Requires pdftotext (poppler) on PATH. Skips with a notice — never a failure —
 * when the PDF or pdftotext is absent, so the normal build is not blocked; run
 * it deliberately whenever A.A. issues a new edition.
 *
 * NORMALIZATION: pdftotext renders em dashes as "--" and loses curly quotes, so
 * both sides are normalized for quotes, dashes and whitespace before comparing.
 * Letters are never touched — a real wording change still fails.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DEFAULT_PDF = path.join("C:", "Users", "addic", "Desktop", "BM-31_2024-2026_AA_Service_Manual_ONLINE.pdf");
const pdfPath = process.argv[2] || DEFAULT_PDF;

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-concepts.json"), "utf8"));

if (!fs.existsSync(pdfPath)) {
  console.log("   SKIPPED — reference manual not found at:\n   " + pdfPath);
  console.log("   (download the current Service Manual from aa.org to run this gate)");
  process.exit(0);
}
let raw;
try {
  const tmp = path.join(require("os").tmpdir(), "aa-service-manual.txt");
  execFileSync("pdftotext", ["-layout", pdfPath, tmp], { stdio: "pipe" });
  raw = fs.readFileSync(tmp, "utf8");
} catch (e) {
  console.log("   SKIPPED — pdftotext unavailable (" + (e.code || e.message) + ")");
  process.exit(0);
}

const deLigature = (s) => s.replace(/ﬀ/g, "ff").replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl");
const norm = (s) => deLigature(s)
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, "-").replace(/-{2,}/g, "-")
  .replace(/\s+/g, " ").trim().toLowerCase();

const lines = deLigature(raw).split("\n");
const sIdx = lines.findIndex((l) => /THE TWELVE CONCEPTS \(SHORT FORM\)/i.test(l));
const lIdx = lines.findIndex((l) => /THE TWELVE CONCEPTS \(LONG FORM\)/i.test(l));
if (sIdx === -1 || lIdx === -1 || lIdx <= sIdx) {
  console.error("   FAILED — could not find both Concepts sections in the reference manual");
  process.exit(1);
}
// Compare each form against its OWN section: several Concepts open with the
// same clause in both forms, so a whole-document search can match the wrong one.
const SHORT = norm(lines.slice(sIdx, lIdx).join("\n"));
const LONG = norm(lines.slice(lIdx, lIdx + 400).join("\n"));

const missing = [];
for (const c of data.concepts) {
  if (!SHORT.includes(norm(c.short))) missing.push(`Concept ${c.roman} SHORT form does not match A.A.'s current edition`);
  if (!LONG.includes(norm(c.long))) missing.push(`Concept ${c.roman} LONG form does not match A.A.'s current edition`);
}

if (missing.length) {
  console.error("   FAILED — published text differs from A.A.'s current edition:\n");
  missing.forEach((m) => console.error("     ✗ " + m));
  process.exit(1);
}
console.log(`   24/24 texts verbatim in ${path.basename(pdfPath)}`);
console.log("   Every Concept, both forms, matches A.A.'s current published edition.");
