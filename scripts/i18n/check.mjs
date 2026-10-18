// check.mjs — is a language's translation file sound? (wave tr1 S1; WO-TRANSLATE-SITE v2)
// node scripts/i18n/check.mjs <lang> [file-name-without-.json …]
// For every entry: the id exists in i18n/segments; the translation keeps the same tags and the same links as the
// English's numbered placeholders (<0>…</0>, <1/>: its tags, lib.mjs toTemplate); nothing is empty. Then coverage per part.
// Exit 1 on any problem, so a runner's close can say "check: 0 problems".
import fs from "node:fs";
import path from "node:path";
import { I18N, LANGS, readJson, placeholdersOf } from "./lib.mjs";

const [lang, ...names] = process.argv.slice(2);
if (!lang || !LANGS[lang]) { console.error("usage: check.mjs <lang> [file …]"); process.exit(2); }
const segDir = path.join(I18N, "segments"), seg = {};
for (const f of fs.readdirSync(segDir)) if (f.endsWith(".json") && f !== "pages.json") for (const [id, v] of Object.entries(readJson(path.join(segDir, f), {}))) seg[id] = { ...v, part: f.slice(0, -5) };
const dir = path.join(I18N, lang);
const files = (names.length ? names.map((n) => `${n}.json`) : fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_")) : []);
const problems = [], all = {};
for (const f of files) {
  const t = readJson(path.join(dir, f), null);
  if (!t) { problems.push(`${f}: not valid JSON`); continue; }
  for (const [id, x] of Object.entries(t)) {
    // a language's own line with no English (hi_ours_note, build.mjs OURS_NOTE): only that it isn't empty
    if (id.startsWith(`${lang}_`)) { if (typeof x !== "string" || !x.trim()) problems.push(`${f} ${id}: empty`); continue; }
    const s = seg[id];
    if (!s) { problems.push(`${f} ${id}: no such segment (stale? re-run extract.mjs)`); continue; }
    if (typeof x !== "string" || !x.trim()) { problems.push(`${f} ${id}: empty`); continue; }
    if (all[id] != null && all[id] !== x) problems.push(`${f} ${id}: translated differently in another file`);
    all[id] = x;
    const a = placeholdersOf(s.t).join(" "), b = placeholdersOf(x).join(" ");
    if (a !== b) problems.push(`${f} ${id}: placeholders differ\n    en: ${s.t.slice(0, 120)}\n    ${lang}: ${x.slice(0, 120)}`);
  }
}
const parts = {};
for (const [id, s] of Object.entries(seg)) { const p = (parts[s.part] ??= { n: 0, done: 0 }); p.n++; if (all[id] != null) p.done++; }
console.log(problems.length ? problems.join("\n") : `${lang}: 0 problems in ${files.length} file(s), ${Object.keys(all).length} entries`);
console.log(Object.entries(parts).map(([p, c]) => `${p} ${c.done}/${c.n}`).join(" · "));
process.exit(problems.length ? 1 : 0);
