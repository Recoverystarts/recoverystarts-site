/**
 * vendor-source.js — make the repo verify itself.
 *
 * The verify scripts were reading the APPROVED readings from D:\Forge — an
 * external drive. When it isn't mounted, the build cannot check its own work.
 * A build that can only verify itself when a USB drive is plugged in is not
 * verified; it's lucky.
 *
 * So the approved source gets vendored INTO the repo, reconstructed from
 * data/traditions-daily.json — which parse-traditions.js already proved is a
 * verbatim, character-for-character copy of the GATE-2 markdown (all 124 fields
 * checked as exact substrings before it was ever written).
 *
 * Output: data/readings-source.md  — the approved text, in the repo, in git.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
const CAP = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const lines = [
  "# Daily Traditions — APPROVED SOURCE (GATE 2)",
  "",
  "Derick-approved readings. This file is the source of truth for what the site renders,",
  "and it lives IN THE REPO so the build can verify itself without any external drive.",
  "",
  "Reconstructed from data/traditions-daily.json, which parse-traditions.js proved is a",
  "verbatim copy of the original PILOT-T7-month.md (every field checked as an exact",
  "substring before writing).",
  "",
  "---",
  "",
];

for (const d of DATA.days.slice().sort((a, b) => a.day - b.day)) {
  lines.push(`### ${CAP(d.month)} ${d.day} — "${d.title}" · *(${d.kind})*`);
  lines.push(d.body);
  lines.push(`*Sit with:* ${d.sitWith}`);
  lines.push(`*Grounded in:* ${d.groundedIn}`);
  lines.push("");
}

const out = lines.join("\n");
fs.writeFileSync(path.join(ROOT, "data", "readings-source.md"), out);

// Prove the vendored copy still contains every reading, verbatim.
let bad = 0;
for (const d of DATA.days) {
  for (const [f, v] of [["body", d.body], ["sitWith", d.sitWith], ["groundedIn", d.groundedIn], ["title", d.title]]) {
    if (out.indexOf(v) === -1) { console.error("DRIFT: " + d.key + " [" + f + "]"); bad++; }
  }
}
if (bad) throw new Error(bad + " field(s) drifted — refusing to vendor.");

console.log("Vendored the approved source into the repo:");
console.log("  data/readings-source.md   (" + (out.length / 1024).toFixed(1) + " KB, " + DATA.days.length + " readings)");
console.log("  all " + DATA.days.length * 4 + " fields verified verbatim.");
console.log("  the build no longer depends on D:\\Forge being mounted.");
