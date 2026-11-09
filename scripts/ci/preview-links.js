#!/usr/bin/env node
/**
 * preview-links.js — the link check on the Pages preview (2026-11-09, claude-home #499 step 3, window 3).
 * Usage: node scripts/ci/preview-links.js https://<id>.recoverystarts-site.pages.dev
 *
 * Why on the preview and not only on disk (site-check.js does disk): what readers get is what Pages SERVES —
 * _redirects, _headers, Functions and clean URLs included — and a link can resolve on disk and still 404 or bounce once
 * served. It reads each language's main pages from the preview (home, start-here, the steps, traditions, Big Book,
 * daily pages, A.A. history, meetings), asks every internal link they carry, and fails on:
 *   - a link that answers 4xx/5xx (redirects are followed; where a redirect lands counts),
 *   - a translated page whose link lands on an English page when that page exists in the reader's language
 *     (10-12: the menu sent translated readers to English), judged on the SERVED html after redirects.
 * Links to the meeting map (/meetings/aa/…, /online/…) are served by the meetings Worker on recoverystarts.com only,
 * not by any Pages preview, so those are asked on recoverystarts.com (read only, a few dozen GETs).
 */
const fs = require("fs");
const path = require("path");

const PREVIEW = (process.argv[2] || "").replace(/\/$/, "");
if (!/^https:\/\/[a-z0-9-]+\.recoverystarts-site\.pages\.dev$/.test(PREVIEW)) { console.log("::error::usage: preview-links.js https://<id>.recoverystarts-site.pages.dev"); process.exit(1); }
const LIVE = "https://recoverystarts.com";
const DIST = path.join(__dirname, "..", "..", "dist");
const LANGS = ["de", "es", "fa", "fr", "hi", "ja", "nl", "pl", "pt", "ru", "sv"];
const MAP_ROUTE = /^\/(meetings\/(aa|na|ca|cma|find|online|ai|try|about-this-data)(\/|$)|online(\/|$))/;
const SEEDS = ["/", "/start-here/", "/12-steps/", "/12-traditions/", "/12-concepts/", "/big-book/", "/daily-reflection/", "/daily-tradition/", "/aa-history/", "/aa-info/", "/meetings/", "/about/"];
const UA = { "user-agent": "recoverystarts-site CI link check (github actions)" };
const langOf = (p) => { const s = p.split("/")[1]; return LANGS.includes(s) ? s : "en"; };
const onDisk = (p) => { const r = p.replace(/^\//, ""); return fs.existsSync(path.join(DIST, r, "index.html")) || (r.endsWith(".html") && fs.existsSync(path.join(DIST, r))); };

async function get(url, method = "GET") {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { method, redirect: "follow", headers: UA, signal: AbortSignal.timeout(20000) });
      const body = method === "GET" ? await r.text() : "";
      if (r.status === 429 || r.status >= 500) { await new Promise((ok) => setTimeout(ok, 2000 * (i + 1))); if (i < 2) continue; }
      return { status: r.status, url: r.url, body };
    } catch (e) { if (i === 2) return { status: 0, url, body: "", error: e.message }; await new Promise((ok) => setTimeout(ok, 2000)); }
  }
}
async function pool(items, n, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; }

(async () => {
  const seeds = [];
  for (const l of ["", ...LANGS.map((x) => "/" + x)]) for (const s of SEEDS) { const p = l + s; if (p === "/" || onDisk(p)) seeds.push(p); }
  const errors = [], links = new Map(); // target path → first page it was seen on
  const pages = await pool(seeds, 6, async (p) => ({ p, r: await get(PREVIEW + p) }));
  for (const { p, r } of pages) {
    if (r.status !== 200) { errors.push(`seed ${p}: ${r.status || r.error}`); continue; }
    for (const m of r.body.matchAll(/href="(\/[^"#]*)[^"]*"/g)) {
      const t = m[1];
      if (t.startsWith("//") || t.startsWith("/cdn-cgi/") || t.includes("' +")) continue;
      if (!links.has(t)) links.set(t, p);
    }
  }
  const targets = [...links.keys()];
  const mapTargets = [...new Set(targets.filter((t) => MAP_ROUTE.test(t.split("?")[0])).map((t) => t.split("?")[0]))];
  const siteTargets = targets.filter((t) => !MAP_ROUTE.test(t.split("?")[0]));
  console.log(`preview ${PREVIEW}: ${pages.length} pages read, ${siteTargets.length} site links, ${mapTargets.length} meeting-map paths`);
  const res = await pool(siteTargets, 8, async (t) => ({ t, r: await get(PREVIEW + t, /\.(png|jpe?g|webp|svg|ico|woff2?|css|js|xml|txt|pdf|json)$/.test(t.split("?")[0]) ? "HEAD" : "GET") }));
  let leaks = 0;
  for (const { t, r } of res) {
    const from = links.get(t);
    if (!(r.status >= 200 && r.status < 400)) { errors.push(`${t} → ${r.status || r.error} (linked from ${from})`); continue; }
    const landed = new URL(r.url).pathname, lang = langOf(from);
    if (lang !== "en" && langOf(landed) === "en" && landed !== "/" && onDisk(`/${lang}${landed}`) && /\/$|\.html$/.test(landed)) {
      // the language switcher links every language on purpose: skip links that are hreflang/switcher anchors on the page
      const page = pages.find((x) => x.p === from).r.body, at = page.indexOf(`href="${t}"`), tag = page.slice(page.lastIndexOf("<", at), page.indexOf(">", at) + 1);
      if (/hreflang=|lang-switch|data-lang|class="[^"]*lang/.test(tag)) continue;
      leaks++; errors.push(`translated → English: ${from} links ${t}, which lands on English ${landed} though /${lang}${landed} exists`);
    }
  }
  const mres = await pool(mapTargets, 2, async (t) => ({ t, r: await get(LIVE + t, "HEAD") }));
  // 403 / 429: Cloudflare's bot challenge or rate rule for a data-centre IP (GitHub's runners met 429 on 11-09) — the
  // map answers people; only a 404, 410, 5xx or no answer counts as a broken link
  for (const { t, r } of mres) if (!(r.status >= 200 && r.status < 400) && r.status !== 403 && r.status !== 429) errors.push(`meeting map ${t} → ${r.status || r.error} on ${LIVE} (linked from ${links.get([...links.keys()].find((k) => k.startsWith(t)))})`);
  const summary = [`## Preview link check`, ``, `${PREVIEW}`, ``, `| | |`, `|---|---|`, `| pages read | ${pages.length} |`, `| site links asked | ${siteTargets.length} |`, `| meeting-map paths asked on ${LIVE} | ${mapTargets.length} |`, `| translated → English | ${leaks} |`, `| failures | ${errors.length} |`, ``];
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join("\n") + "\n");
  for (const e of errors) console.log("::error::" + e);
  console.log(errors.length ? `PREVIEW LINK CHECK FAILS: ${errors.length}` : "PREVIEW LINK CHECK PASSES");
  process.exit(errors.length ? 1 : 0);
})();
