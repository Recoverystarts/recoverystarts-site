// batch.mjs — cut the text list into runner-sized batches (wave tr1 S1).
// node scripts/i18n/batch.mjs [words-per-batch, default 28000]
// node scripts/i18n/batch.mjs --add <name>=<page|text>:<regex> …   (wave tr3) keep every batch that exists, drop ids no
//   longer in i18n/segments from them, and put each segment that's in no batch yet (core aside) into the first rule
//   whose regex matches its first page (page:) or its English (text:), in segment order. For a top-up after new English
//   pages, so the languages already translated keep their batch files: e.g. daily-tradition-3=page:daily-tradition/(january|february|march)
// Writes i18n/batches/<part>-<n>.json (id → English, in the placeholder form a translation is written in, lib.mjs
// toTemplate) and i18n/batches/BATCHES.md (one line per batch: words, segments, first and last page). A runner
// translates one batch file into i18n/<lang>/<part>-<n>.json. core is not batched (S1 did it).
import fs from "node:fs";
import path from "node:path";
import { I18N, readJson, writeJson } from "./lib.mjs";

const segDir = path.join(I18N, "segments"), out = path.join(I18N, "batches");
const wordsOf = (t) => t.replace(/<\/?\d+\/?>/g, " ").split(/\s+/).filter(Boolean).length;
if (process.argv[2] === "--add") {
  const rules = process.argv.slice(3).map((a) => { const m = /^([\w-]+)=(page|text):(.*)$/.exec(a); if (!m) throw new Error(`bad rule: ${a}`); return { name: m[1], on: m[2], re: new RegExp(m[3]), ids: [] }; });
  const seg = {};
  for (const f of fs.readdirSync(segDir).sort()) if (f.endsWith(".json") && f !== "pages.json" && f !== "core.json") Object.assign(seg, readJson(path.join(segDir, f), {}));
  const have = new Set();
  for (const f of fs.readdirSync(out)) {
    if (!f.endsWith(".json")) continue;
    const b = readJson(path.join(out, f), {}), keep = Object.fromEntries(Object.entries(b).filter(([id]) => seg[id]));
    if (Object.keys(keep).length !== Object.keys(b).length) { writeJson(path.join(out, f), keep); console.log(`${f}: dropped ${Object.keys(b).length - Object.keys(keep).length} id(s) no longer on any page`); }
    Object.keys(keep).forEach((id) => have.add(id));
  }
  let left = 0;
  for (const [id, s] of Object.entries(seg)) {
    if (have.has(id)) continue;
    const r = rules.find((r) => r.re.test(r.on === "page" ? s.pages[0] ?? "" : s.t));
    if (r) r.ids.push(id); else left++;
  }
  const md = path.join(out, "BATCHES.md");
  let lines = "";
  for (const r of rules.filter((r) => r.ids.length)) {
    if (fs.existsSync(path.join(out, `${r.name}.json`))) throw new Error(`${r.name}.json exists`);
    writeJson(path.join(out, `${r.name}.json`), Object.fromEntries(r.ids.map((id) => [id, seg[id].t])));
    lines += `| ${r.name} | ${r.ids.reduce((a, id) => a + wordsOf(seg[id].t), 0).toLocaleString("en")} | ${r.ids.length} | ${seg[r.ids[0]].pages[0] ?? ""} | ${seg[r.ids.at(-1)].pages[0] ?? ""} |\n`;
    console.log(`${r.name}: ${r.ids.length} segments`);
  }
  fs.appendFileSync(md, lines);
  if (left) console.log(`${left} new segment(s) matched no rule`);
  process.exit(0);
}
const PER = Number(process.argv[2] ?? 28000);
fs.rmSync(out, { recursive: true, force: true });
const lines = [];
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
