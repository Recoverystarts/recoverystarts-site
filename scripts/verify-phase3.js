#!/usr/bin/env node
// Post-phase-3 verification: UTM coverage (criterion 4) + footer wording (criterion 7)
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".git", "scripts"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

let hrefs = 0, tagged = 0, analyticsFiles = 0;
for (const f of walk(ROOT).filter((f) => /\.(html|js|txt|xml)$/.test(f))) {
  const s = fs.readFileSync(f, "utf8");
  const m = [...s.matchAll(/href="https:\/\/app\.recoverystarts\.com[^"]*"/g)];
  hrefs += m.length;
  tagged += m.filter((x) => x[0].includes("utm_source=recoverystarts")).length;
  if (/no analytics/i.test(s)) {
    analyticsFiles++;
    console.log("no-analytics still in: " + path.relative(ROOT, f));
  }
}
console.log(`app hrefs: ${hrefs} | with utm_source: ${tagged} | files saying "no analytics": ${analyticsFiles}`);
if (hrefs !== tagged || analyticsFiles > 0) process.exit(1);
console.log("PHASE 3 VERIFY OK");
