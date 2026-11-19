// unescape-attrs.mjs — undo one layer of double escaping inside attribute values of built language pages, in place:
// &amp;quot; → &quot;, &amp;#x27; → &#x27; (and &amp;#39; / &amp;apos;). Running it twice changes nothing.
// node scripts/i18n/unescape-attrs.mjs [--dry]
import fs from "node:fs";
import path from "node:path";
import { ROOT, LANGS } from "./lib.mjs";

const dry = process.argv.includes("--dry");
const DOUBLE = /&amp;(quot|#x27|#39|apos);/gi;
const ATTR = /(\s[a-z:-]+=")([^"]*&amp;(?:quot|#x27|#39|apos);[^"]*)(")/gi;
let files = 0, fixes = 0;
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith(".html")) one(p); } };
function one(f) {
  const html = fs.readFileSync(f, "utf8");
  if (!html.includes("&amp;")) return;
  let n = 0;
  const out = html.replace(ATTR, (m, a, v, z) => a + v.replace(DOUBLE, (x, e) => (n++, `&${e};`)) + z);
  if (!n) return;
  files++; fixes += n;
  if (!dry) fs.writeFileSync(f, out);
}
for (const l of Object.keys(LANGS)) if (l !== "en" && fs.existsSync(path.join(ROOT, l))) walk(path.join(ROOT, l));
console.log(`${dry ? "would fix" : "fixed"} ${fixes} double-escaped entities in ${files} files`);
