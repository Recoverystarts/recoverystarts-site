#!/usr/bin/env node
/**
 * site-check.js — checks on the built dist/, run by .github/workflows/site-ci.yml.
 *     sh scripts/pages-dist.sh && node scripts/ci/site-check.js --base origin/main
 *
 *  1. FILE COUNT of dist/: warn at 90,000, fail at 100,000 (the Pages file limit).
 *  2. PAGES PER LANGUAGE against the base branch: a language with no pages, or more than 2% fewer, fails.
 *  3. INTERNAL LINKS: every href="/..." resolves to a file in dist/. Meeting-map paths (served by Workers) are counted,
 *     not failed; preview-links.js requests those.
 *  4. TRANSLATED → ENGLISH: a page under /<lang>/ linking to an English page that also exists in <lang>.
 *  5. DOUBLE-ESCAPED ATTRIBUTES: an attribute value with &amp;quot; / &amp;#x27; (shows as "&quot;").
 * Exit 1 on any failure; a summary table goes to $GITHUB_STEP_SUMMARY when it's set.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const DIST = path.join(ROOT, "dist");
const LANGS = ["de", "es", "fa", "fr", "hi", "ja", "nl", "pl", "pt", "ru", "sv", "ar", "tr"];
const WARN_AT = 90000, FAIL_AT = 100000;
// paths served by the meetings, family and substances Workers at recoverystarts.com, not by Pages
const MAP_ROUTE = /^\/(meetings\/(aa|na|ca|cma|find|online|ai|try|about-this-data|tonight)(\/|$)|online(\/|$)|family(\/|$)|substances(\/|$))/;
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

// 5. double-escaped attributes: &amp;quot; or &amp;#x27; in an attribute shows as the literal "&quot;"
if (run("entities")) {
  const bad = new Map();
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const html = fs.readFileSync(f, "utf8");
    if (!html.includes("&amp;")) continue;
    const n = (html.match(/\s[a-z:-]+="[^"]*&amp;(?:quot|#x27|#39|apos);/gi) ?? []).length;
    if (n) bad.set(rel(f), n);
  }
  out.push("", `| double-escaped attributes | ${bad.size} pages |`);
  console.log(`double-escaped attributes: ${bad.size} pages`);
  if (bad.size) err(`${bad.size} pages have a double-escaped attribute (&amp;quot; shows as "&quot;"), e.g. ${[...bad.keys()].slice(0, 3).join(", ")}. Fix the build, or run node scripts/i18n/unescape-attrs.mjs`);
}

if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, ["## Site check", "", "| check | result |", "|---|---|", ...out, "", errors.length ? `**${errors.length} failure(s)**` : "**all checks pass**", ""].join("\n") + "\n");
console.log(errors.length ? `\nSITE CHECK FAILS: ${errors.length} problem(s), ${warnings.length} warning(s)` : `\nSITE CHECK PASSES (${warnings.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
