// verify-fixed.mjs — prep-ja, 2026-11-01. Checks that every A.A. Japan fixed text in GLOSSARY.md (Steps, Traditions short
// and long, Concepts, Preamble) and in core.json (/aa-info/'s long Traditions and Concepts) is A.A. Japan's own wording.
// It fetches aajapan.org's five pages (one at a time, a user-agent naming recoverystarts.com), applies the ONLY change
// the glossary allows (fullwidth A–Z a–z 0–9 → ASCII; spaces touching Japanese removed), and prints ONLY the entries it
// can't find there. It never prints the texts themselves when they match.
//   node i18n/ja/verify-fixed.mjs        (Node 18+, no dependencies; run from the repo root)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const UA = "Mozilla/5.0 (compatible; recoverystarts.com i18n check; +https://recoverystarts.com)";
const PAGES = ["12steps", "12traditions", "12traditonslong", "12concepts", "aboutaa"];
const norm = (s) =>
  s.replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/(?<=[^\x00-\x7f]) +| +(?=[^\x00-\x7f])/g, "");
const textOf = (html) =>
  html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, "\n")
    .replace(/&#8211;/g, "–").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#174;|&reg;/g, "®")
    .split("\n").map((l) => norm(l.replace(/[ \t　]+/g, " ").trim())).filter(Boolean).join("\n");

let source = "";
for (const p of PAGES) {
  const r = await fetch(`https://aajapan.org/${p}/`, { headers: { "user-agent": UA } });
  if (!r.ok) { console.error(`aajapan.org/${p}/: HTTP ${r.status}`); process.exit(2); }
  source += textOf(await r.text()) + "\n";
  await new Promise((ok) => setTimeout(ok, 1000));
}
const flat = source.replace(/\n/g, "").replace(/・/g, "");

const items = [];
// GLOSSARY.md: the numbered lists under the four "word for word" headings, and the Preamble bullet
const g = fs.readFileSync(path.join(dir, "GLOSSARY.md"), "utf8");
for (const sec of g.split(/\n## /)) {
  const head = sec.split("\n")[0];
  if (!/A\.A\. Japan, word for word/.test(head)) continue;
  for (const m of sec.matchAll(/^(\d+)\. (.+)$/gm)) items.push([`GLOSSARY ${head.split(" —")[0]} ${m[1]}`, m[2]]);
}
const pre = g.match(/\*\*The A\.A\. Preamble\*\* \[aajapan[^\n]*?«(アルコホーリクス[^»]+)»/);
if (pre) items.push(["GLOSSARY Preamble", pre[1]]); else console.log("GLOSSARY: Preamble entry not found");
// core.json: the /aa-info/ fixed segments
const core = JSON.parse(fs.readFileSync(path.join(dir, "core.json"), "utf8"));
const FIXED = ["0a41494395b7","465c653ab0f5","8eb976079adb","c086e0b55760","0c6ff5809ec1","49de96ed8473","6d723dab6c8c","4300607abd45",
  "5307f52d3f80","f82b3a38d772","de7b404507cb","b2076a23b5ae","e32af397e692","b084094d334e","264e5cab603c","3c76cfcd52ff",
  "dc8b1bc8dbcb","6e113351c5ee","35d8a9b64010","dd04133c0abd","f916cd53b9a8","30a723656579","ea8687e4cdf1","549bf284bc05"];
for (const id of FIXED) items.push([`core.json ${id}`, core[id] ?? ""]);

const bad = items.filter(([, t]) => !t || !flat.includes(t.replace(/・/g, "")));
for (const [where] of bad) console.log(`not on aajapan.org as written: ${where}`);
console.log(`${items.length - bad.length}/${items.length} fixed texts match A.A. Japan's pages${bad.length ? "" : " — 0 differences"}`);
process.exit(bad.length ? 1 : 0);
