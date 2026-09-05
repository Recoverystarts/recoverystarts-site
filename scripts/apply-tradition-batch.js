#!/usr/bin/env node
/**
 * apply-tradition-batch.js — swap whole readings into BOTH source files.
 *
 * A batch file holds one or more complete readings in the source format
 * (### Month D — "Title" · *(kind)* / body / *Sit with:* / *Grounded in:*).
 * Each reading replaces the block with the same Month+Day in
 * data/traditions-source.md AND data/readings-source.md, byte-identical, so
 * the two never drift. Title may change (slugs are date-based); the caller
 * re-renders pages afterwards. Then run:
 *   node scripts/parse-traditions.js && node scripts/parse-traditions.js --verify
 *   node scripts/audit-readings.js
 *
 * Usage: node scripts/apply-tradition-batch.js <batch.md>
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const batchPath = process.argv[2];
if (!batchPath) throw new Error("usage: apply-tradition-batch.js <batch.md>");

const headRx = /^### (\w+) (\d+) — "(.+?)" · \*\((.+?)\)\*[ \t]*$/;
function splitBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(headRx);
    if (m) {
      if (cur) blocks.push(cur);
      cur = { month: m[1].toLowerCase(), day: +m[2], title: m[3], lines: [line] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) blocks.push(cur);
  for (const b of blocks) {
    while (b.lines.length && b.lines[b.lines.length - 1].trim() === "") b.lines.pop();
    b.text = b.lines.join("\n");
    const words = b.lines.slice(1).find((l) => !l.startsWith("*"))?.split(/\s+/).length ?? 0;
    b.words = words;
  }
  return blocks;
}

const batch = splitBlocks(fs.readFileSync(batchPath, "utf8"));
if (!batch.length) throw new Error("no readings found in batch");

const targets = ["data/traditions-source.md", "data/readings-source.md"].map((p) => path.join(ROOT, p));
for (const file of targets) {
  let src = fs.readFileSync(file, "utf8");
  for (const b of batch) {
    const cap = b.month[0].toUpperCase() + b.month.slice(1);
    // the existing block: from its heading to just before the next "\n### " or "\n---"
    const rx = new RegExp(`^### ${cap} ${b.day} — "[^"]*" · \\*\\([^)]*\\)\\*[ \\t]*\\n[\\s\\S]*?(?=\\n### |\\n---)`, "m");
    if (!rx.test(src)) throw new Error(`${path.basename(file)}: no existing block for ${cap} ${b.day}`);
    src = src.replace(rx, b.text.replace(/\$/g, "$$$$"));
  }
  fs.writeFileSync(file, src);
}

for (const b of batch) {
  const cap = b.month[0].toUpperCase() + b.month.slice(1);
  console.log(`${cap} ${b.day}  "${b.title}"  body ${b.words} words`);
}
console.log(`applied ${batch.length} reading(s) to both source files`);
