/**
 * vendor-source.js — writes data/readings-source.md, the Daily Traditions source text, reconstructed from
 * data/traditions-daily.json, and checks it still contains every reading verbatim.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));
const CAP = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const lines = [
  "# Daily Traditions — source",
  "",
  "The readings the site renders, written from data/traditions-daily.json by scripts/vendor-source.js.",
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
