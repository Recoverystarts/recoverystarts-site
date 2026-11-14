#!/usr/bin/env node
/**
 * site-check.js — the merge gate's checks for recoverystarts.com (2026-11-09, claude-home #499 step 3, window 3).
 * Run by .github/workflows/site-ci.yml on every PR into main and every push to main; run it yourself before READY:
 *     sh scripts/pages-dist.sh && node scripts/ci/site-check.js --base origin/main
 *
 * Why each check, from the 11-07 research (claude-home map/projects/recoverystarts-site/research/2026-11-07-topic8-github/):
 *  1. FILE COUNT of dist/ (what Pages deploys): warn at 90,000, fail at 100,000. Pages' limit on our plan is 100,000
 *     since 11-07 (scripts/pages-dist.sh header); at 20,000 a Russian batch once stopped every deploy.
 *  2. PAGES PER LANGUAGE: each language's page count, against the base branch. A language that loses more than 2% of
 *     its pages, or has none, fails: a translation batch that deletes pages is a mistake until a person says otherwise.
 *  3. INTERNAL LINKS on disk: every href="/..." on every page resolves to a file in dist/ (scripts/check-links.js'
 *     rule). Paths the meeting map serves (the meetings Worker: /meetings/<program>/…, /meetings/find/, /online/) are
 *     not files here; they're counted, not failed, and the preview check asks them for real. (298 dead meeting links,
 *     09-20; 96 from oi1, 11-01.)
 *  4. TRANSLATED → ENGLISH: a page under /<lang>/ that links to an English page when the same page exists in <lang>.
 *     (10-12: the menu sent translated readers to English.)
 *  5. ESCAPED TWICE (2026-11-14, claude-home #561, deploy-1126): a tag's attribute or a <title> that shows an entity as
 *     text, "&amp;quot;" and friends. scripts/i18n/build.mjs escaped attr translations without decoding them first, so 931
 *     es/pt/hi pages told Google `"El comité de selección."` with the &quot; spelled out. The build decodes first now.
 *  6. CANONICAL (2026-11-14, claude-home #514, deploy-1126): a page's canonical names a path (never the bare host, as the
 *     home page's did: "https://recoverystarts.com" while its hreflang and the sitemap said ".../"), and where the page
 *     lists itself in hreflang, its canonical is that same URL.
 *  7. ROBOTS.TXT (2026-11-14, claude-home #514, deploy-1126): every Sitemap: line names a file that's served, and a
 *     comment that spells out the language sitemaps (sitemap-en/es/pt/fr.xml) names the same languages as sitemap.xml's
 *     index. Its comment said four languages for weeks while the index held fourteen.
 *  8. CONTENT-LANGUAGE (2026-11-14, claude-home #514, deploy-1126): read _headers the way Pages applies it (rules in
 *     order, one splat, "! Name" detaches what an earlier rule set, two values of one header joined with ", ") and ask
 *     every page: is the Content-Language it will be sent exactly its own <html lang>? Checked against
 *     `wrangler pages dev` on 2026-11-14 (en, es, pt-BR, fa on real paths; one value each).
 * Exit 1 on any failure; a summary table goes to $GITHUB_STEP_SUMMARY when it's set.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const DIST = path.join(ROOT, "dist");
const LANGS = ["de", "es", "fa", "fr", "hi", "ja", "nl", "pl", "pt", "ru", "sv", "ar", "tr"];
const WARN_AT = 90000, FAIL_AT = 100000;
// served by the meetings Worker / Railway at recoverystarts.com, not by Pages
const MAP_ROUTE = /^\/(meetings\/(aa|na|ca|cma|find|online|ai|try|about-this-data)(\/|$)|online(\/|$))/;
const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : null;
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;

const out = [], errors = [], warnings = [];
const err = (m) => { errors.push(m); console.log("::error::" + m); };
const warn = (m) => { warnings.push(m); console.log("::warning::" + m); };
if (!fs.existsSync(DIST)) { console.log("::error::no dist/ — run sh scripts/pages-dist.sh first"); process.exit(1); }

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}
const files = walk(DIST);
const rel = (p) => path.relative(DIST, p).split(path.sep).join("/");
const langOf = (r) => { const s = r.split("/")[0]; return LANGS.includes(s) ? s : "en"; };
const run = (name) => !only || only.includes(name);

// 1. file count
if (run("count")) {
  const n = files.length;
  out.push(`| files in dist/ | ${n.toLocaleString("en-US")} (warn ${WARN_AT.toLocaleString("en-US")}, fail ${FAIL_AT.toLocaleString("en-US")}) |`);
  console.log(`file count: ${n} in dist/`);
  if (n >= FAIL_AT) err(`dist/ has ${n} files: Pages deploys at most ${FAIL_AT} on our plan. Nothing would deploy.`);
  else if (n >= WARN_AT) warn(`dist/ has ${n} files, within ${FAIL_AT - n} of Pages' ${FAIL_AT} limit.`);
}

// 2. pages per language, against the base branch
if (run("langs")) {
  const count = (list) => { const c = Object.fromEntries(["en", ...LANGS].map((l) => [l, 0])); for (const r of list) if (r.endsWith(".html")) c[langOf(r)]++; return c; };
  const now = count(files.map(rel));
  let was = null;
  if (base) {
    // the base's served files: everything pages-dist.sh copies (the same excludes)
    const skip = /^(\.github|functions|i18n|scripts|tests|grok-handoff|node_modules|dist)\//;
    const list = execSync(`git ls-tree -r --name-only ${base}`, { cwd: ROOT, maxBuffer: 1 << 28 }).toString().split("\n").filter((r) => r && !skip.test(r));
    was = count(list);
  }
  out.push("", "| language | pages | base |", "|---|---:|---:|");
  for (const l of ["en", ...LANGS]) {
    out.push(`| ${l} | ${now[l]} | ${was ? was[l] : "–"} |`);
    if (now[l] === 0) err(`${l}: no pages at all`);
    else if (was && was[l] && now[l] < was[l] * 0.98) err(`${l}: ${now[l]} pages, down from ${was[l]} on ${base} (more than 2% gone)`);
  }
  console.log("pages per language: " + JSON.stringify(now) + (was ? " base " + JSON.stringify(was) : ""));
}

// 3 + 4. internal links, and translated pages that send readers to English
if (run("links")) {
  const exists = new Map();
  const has = (href) => {
    const clean = href.split("#")[0].split("?")[0];
    if (!clean || clean === "/") return true;
    if (exists.has(clean)) return exists.get(clean);
    let r = decodeURIComponent(clean).replace(/^\//, ""), p = path.join(DIST, r), ok = false;
    try { ok = fs.statSync(p).isDirectory() ? fs.existsSync(path.join(p, "index.html")) : true; }
    catch { ok = fs.existsSync(p + ".html") || fs.existsSync(path.join(p, "index.html")); }
    exists.set(clean, ok);
    return ok;
  };
  const broken = new Map(), leaks = new Map();
  let links = 0, mapLinks = 0, pages = 0;
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    pages++;
    const r = rel(f), lang = langOf(r), html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
      const href = m[1];
      if (href.startsWith("//") || href.includes("' +") || href.startsWith("/cdn-cgi/")) continue;
      links++;
      const p = href.split("#")[0].split("?")[0];
      if (MAP_ROUTE.test(p)) { mapLinks++; continue; }
      if (!has(href)) { const l = broken.get(p) ?? []; if (l.length < 3) l.push(r); broken.set(p, l); continue; }
      // a translated page linking to an English page that exists in its own language
      if (lang !== "en" && p !== "/" && langOf(p.slice(1)) === "en" && /\/$|\.html$/.test(p) && has(`/${lang}${p}`)) {
        // the language switcher links every language on purpose: rel=alternate / hreflang, or a lang-switch element
        const at = m.index, tag = html.slice(html.lastIndexOf("<", at), html.indexOf(">", at) + 1);
        if (/hreflang=|lang-switch|data-lang|class="[^"]*lang/.test(tag)) continue;
        const l = leaks.get(`${lang} ${p}`) ?? []; if (l.length < 3) l.push(r); leaks.set(`${lang} ${p}`, l);
      }
    }
  }
  console.log(`links: ${pages} pages, ${links} internal links, ${mapLinks} to the meeting map (asked on the preview), ${broken.size} broken targets, ${leaks.size} translated → English`);
  out.push("", `| internal links | ${links.toLocaleString("en-US")} on ${pages.toLocaleString("en-US")} pages; ${mapLinks.toLocaleString("en-US")} go to the meeting map |`, `| broken targets | ${broken.size} |`, `| translated → English | ${leaks.size} |`);
  for (const [p, where] of broken) err(`broken link ${p} (on ${where.join(", ")})`);
  for (const [k, where] of leaks) { const [lang, p] = k.split(" "); err(`translated → English: ${lang} pages link to ${p} though /${lang}${p} exists (on ${where.join(", ")})`); }
}

// 5. an entity escaped twice in an attribute or a <title> (#561): it reaches search results as "&quot;" in words
if (run("entities")) {
  const TWICE = /&amp;(?:quot|amp|apos|lt|gt|nbsp|#\d+|#x[0-9a-f]+);/i;
  const bad = [];
  let pages = 0;
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    pages++;
    const html = fs.readFileSync(f, "utf8");
    const hit = [...html.matchAll(/<[a-z][^>]*>/gi)].find((m) => TWICE.test(m[0])) ?? [...html.matchAll(/<title>[^<]*<\/title>/gi)].find((m) => TWICE.test(m[0]));
    if (hit) bad.push(`${rel(f)}: ${hit[0].slice(0, 140)}`);
  }
  console.log(`entities: ${pages} pages, ${bad.length} with an entity escaped twice`);
  out.push("", `| escaped twice (#561) | ${bad.length} pages |`);
  for (const b of bad.slice(0, 20)) err(`escaped twice: ${b}`);
  if (bad.length > 20) err(`escaped twice: ${bad.length - 20} more pages`);
}

// 6. a canonical names a path, and agrees with the page's own hreflang (#514)
if (run("canonical")) {
  const HL = { pt: "pt-BR" };
  const bad = [];
  let n = 0;
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const html = fs.readFileSync(f, "utf8");
    const c = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    if (!c) continue;
    n++;
    const r = rel(f), lang = langOf(r);
    if (/^https?:\/\/[^/]+$/.test(c)) { bad.push(`${r}: canonical ${c} has no path (the same page as ${c}/)`); continue; }
    const own = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].find((m) => m[1] === (HL[lang] ?? lang))?.[2];
    if (own && own !== c && !/noindex/.test(html.slice(0, 4000))) bad.push(`${r}: canonical ${c}, but its own hreflang says ${own}`);
  }
  console.log(`canonical: ${n} pages, ${bad.length} wrong`);
  out.push("", `| canonical (#514) | ${n.toLocaleString("en-US")} pages, ${bad.length} wrong |`);
  for (const b of bad.slice(0, 20)) err(b);
  if (bad.length > 20) err(`canonical: ${bad.length - 20} more pages`);
}

// 7. robots.txt agrees with the sitemap index (#514)
if (run("robots")) {
  const robots = fs.readFileSync(path.join(DIST, "robots.txt"), "utf8");
  const index = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  const inIndex = [...index.matchAll(/<loc>[^<]*\/sitemap-([a-z]{2}(?:-[A-Za-z]+)?)\.xml<\/loc>/g)].map((m) => m[1]).sort();
  let bad = 0;
  for (const m of robots.matchAll(/^Sitemap:\s*https:\/\/recoverystarts\.com\/(\S+)$/gm)) {
    // /sitemap-meetings.xml is the meeting map's, served by the meetings Worker (meeting-finder deploy/worker-meetings-route.js)
    if (m[1] !== "sitemap-meetings.xml" && !fs.existsSync(path.join(DIST, m[1]))) { bad++; err(`robots.txt names Sitemap ${m[1]}, which isn't served`); }
  }
  for (const m of robots.matchAll(/sitemap-([a-z]{2}(?:\/[a-z]{2})+)\.xml/g)) {
    const said = m[1].split("/").sort();
    if (said.join() !== inIndex.join()) { bad++; err(`robots.txt's comment says sitemap-${m[1]}.xml, but sitemap.xml lists ${inIndex.length}: ${inIndex.join(", ")}`); }
  }
  console.log(`robots: ${inIndex.length} language sitemaps in the index, ${bad} problem(s)`);
  out.push("", `| robots.txt (#514) | ${bad} problem(s); index lists ${inIndex.length} language sitemaps |`);
}

// 8. Content-Language from _headers equals each page's <html lang> (#514)
if (run("contentlang")) {
  const rules = [];
  let cur = null;
  for (const line of fs.readFileSync(path.join(DIST, "_headers"), "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) { cur = { pat: line.trim(), ops: [] }; rules.push(cur); continue; }
    const t = line.trim(), det = /^!\s*(.+)$/.exec(t), kv = /^([^:]+):\s*(.*)$/.exec(t);
    if (det) cur.ops.push(["del", det[1].trim().toLowerCase()]);
    else if (kv) cur.ops.push(["set", kv[1].trim().toLowerCase(), kv[2]]);
  }
  // only path rules (a full https://host/… rule is for the preview hosts, never recoverystarts.com)
  const match = (pat, p) => pat.startsWith("/") && new RegExp("^" + pat.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/:\w+/g, "[^/]+") + "$").test(p);
  const headerFor = (p) => {
    let v = null;
    for (const r of rules) if (match(r.pat, p)) for (const [op, k, val] of r.ops) if (k === "content-language") v = op === "del" ? null : v == null ? val : `${v}, ${val}`;
    return v;
  };
  const bad = [];
  let n = 0;
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const lang = /<html\s[^>]*?\blang="([^"]+)"/i.exec(fs.readFileSync(f, "utf8").slice(0, 2000))?.[1];
    if (!lang) continue; // a verification file with no <html lang> (Google's) has nothing to agree with
    n++;
    const r = rel(f), p = "/" + r.replace(/index\.html$/, ""), sent = headerFor(p);
    if (sent !== lang) bad.push(`${p}: <html lang="${lang}"> but Content-Language ${sent ?? "(none)"}`);
  }
  console.log(`content-language: ${n} pages, ${bad.length} disagree`);
  out.push("", `| Content-Language (#514) | ${n.toLocaleString("en-US")} pages, ${bad.length} disagree |`);
  for (const b of bad.slice(0, 20)) err(b);
  if (bad.length > 20) err(`content-language: ${bad.length - 20} more pages`);
}

if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, ["## Site check", "", "| check | result |", "|---|---|", ...out, "", errors.length ? `**${errors.length} failure(s)**` : "**all checks pass**", ""].join("\n") + "\n");
console.log(errors.length ? `\nSITE CHECK FAILS: ${errors.length} problem(s), ${warnings.length} warning(s)` : `\nSITE CHECK PASSES (${warnings.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
