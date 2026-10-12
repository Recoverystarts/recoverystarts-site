// indexnow.mjs — tell IndexNow engines (Bing, Yandex, Seznam, Naver…; Google doesn't take IndexNow) about new and changed
// pages (wave tr3 S2). Key: .indexnow-key, served at /<key>.txt (scripts/submit.ps1 uses the same).
// node scripts/i18n/indexnow.mjs fr es pt      every URL in sitemap-fr.xml, sitemap-es.xml, sitemap-pt.xml
// node scripts/i18n/indexnow.mjs --urls a b …   just these
// node scripts/i18n/indexnow.mjs … --dry        print what would be sent
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const args = process.argv.slice(2), dry = args.includes("--dry");
const key = fs.readFileSync(path.join(ROOT, ".indexnow-key"), "utf8").trim();
let urls = [];
if (args.includes("--urls")) urls = args.slice(args.indexOf("--urls") + 1).filter((a) => a.startsWith("http"));
else for (const l of args.filter((a) => !a.startsWith("--"))) urls.push(...[...fs.readFileSync(path.join(ROOT, `sitemap-${l}.xml`), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
urls = [...new Set(urls)];
console.log(`${urls.length} URL(s)${dry ? " (dry run)" : ""}`);
for (let i = 0; i < urls.length; i += 10000) {
  const body = { host: "recoverystarts.com", key, keyLocation: `https://recoverystarts.com/${key}.txt`, urlList: urls.slice(i, i + 10000) };
  if (dry) { console.log(body.urlList.slice(0, 5)); continue; }
  const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body) });
  console.log(`IndexNow: HTTP ${r.status} for ${body.urlList.length} URL(s)${r.ok ? "" : " " + (await r.text()).slice(0, 200)}`);
}
