// batch.mjs — cut the text list into runner-sized batches (wave tr1 S1).
// node scripts/i18n/batch.mjs [words-per-batch, default 28000]
// Writes i18n/batches/<part>-<n>.json (id → English, in the placeholder form a translation is written in, lib.mjs
// toTemplate) and i18n/batches/BATCHES.md (one line per batch: words, segments, first and last page). A runner
// translates one batch file into i18n/<lang>/<part>-<n>.json. core is not batched (S1 did it).
import fs from "node:fs";
import path from "node:path";
import { I18N, readJson, writeJson } from "./lib.mjs";

const PER = Number(process.argv[2] ?? 28000);
const segDir = path.join(I18N, "segments"), out = path.join(I18N, "batches");
fs.rmSync(out, { recursive: true, force: true });
const lines = [];
const wordsOf = (t) => t.replace(/<\/?\d+\/?>/g, " ").split(/\s+/).filter(Boolean).length;
for (const f of fs.readdirSync(segDir).sort()) {
  if (!f.endsWith(".json") || f === "pages.json" || f === "core.json") continue;
  const part = f.slice(0, -5), segs = Object.entries(readJson(path.join(segDir, f), {}));
  const total = segs.reduce((a, [, s]) => a + wordsOf(s.t), 0), n = Math.max(1, Math.round(total / PER)), per = total / n;
  let b = [], w = 0, k = 1;
  const flush = () => {
    if (!b.length) return;
    const name = n === 1 ? part : `${part}-${k}`;
    writeJson(path.join(out, `${name}.json`), Object.fromEntries(b.map(([id, s]) => [id, s.t])));
    lines.push(`| ${name} | ${w.toLocaleString("en")} | ${b.length} | ${b[0][1].pages[0] ?? ""} | ${b.at(-1)[1].pages[0] ?? ""} |`);
    b = []; w = 0; k++;
  };
  for (const e of segs) { b.push(e); w += wordsOf(e[1].t); if (w >= per && k < n) flush(); }
  flush();
}
fs.writeFileSync(path.join(out, "BATCHES.md"), `# Translation batches (scripts/i18n/batch.mjs, ~${PER.toLocaleString("en")} words each)\n\n| batch | words | segments | first page | last page |\n|---|---|---|---|---|\n${lines.join("\n")}\n`);
console.log(`${lines.length} batches → i18n/batches/`);
