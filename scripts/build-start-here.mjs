// build-start-here.mjs — the reading room hub (/start-here/) and its sitemap (/sitemap-reading.xml).
//
// Why (claude-home #483, research 4, CEO: deep-research-c 2026-11-07): AI crawlers spent their visits on meeting pages
// and on ~200K copies of the add-meeting form, while the pages that can actually reach training sets (sourced,
// explanatory prose: A.A. history, the Traditions, the Big Book pages, the A.A. questions) got single-digit fetches per
// bot. Derick, 2026-11-07: "the training crawlers are important, its why we built most of the pages to do so." So this
// page links every reading page from one place, with a few honest sentences on what each part is, and the sitemap names
// each one with the date it last changed in git (a true lastmod, not today's date on everything).
//
// Built 2026-11-08 by CEO: raptive-ready-2 (Opus 5.5, chat). Run from the repo root after adding or renaming reading
// pages: `node scripts/build-start-here.mjs` (needs the git history: in a shallow clone run
// `git fetch --depth=3000 origin main` first, or lastmod falls back to today). It rewrites start-here/index.html and
// sitemap-reading.xml; commit both. English only for now (no language copies; the i18n build doesn't know this page).
// Way back: delete start-here/, sitemap-reading.xml, its Sitemap line in robots.txt and the home page link.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = "https://recoverystarts.com";
const R = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(R(p), "utf8");
const has = (p) => fs.existsSync(R(p));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// a page's own title, without the " | Recovery Starts" / " — Recovery Starts" tail
function titleOf(rel) {
  const m = read(rel).match(/<title>([^<]*)<\/title>/);
  if (!m) throw new Error(`no <title> in ${rel}`);
  return decode(m[1]).replace(/\s*[|—–-]\s*Recovery Starts\s*$/, "").trim();
}
const dirs = (d) => fs.readdirSync(R(d), { withFileTypes: true }).filter((e) => e.isDirectory() && has(`${d}/${e.name}/index.html`)).map((e) => e.name);
const link = (url, text) => `<a href="${url}">${esc(text)}</a>`;

// ---- the reading pages ----------------------------------------------------------------------------------------------
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const questions = dirs("aa-questions").map((d) => ({ url: `/aa-questions/${d}/`, t: titleOf(`aa-questions/${d}/index.html`) })).sort((a, b) => a.t.localeCompare(b.t, "en"));
const bbDirs = dirs("big-book");
const isPage = (d) => /^page-(\d+|[ivxlc]+)$/.test(d);
const bbTopics = bbDirs.filter((d) => !isPage(d) && !["pages", "search"].includes(d)).map((d) => ({ url: `/big-book/${d}/`, t: titleOf(`big-book/${d}/index.html`) })).sort((a, b) => a.t.localeCompare(b.t, "en"));
// the front matter (page-ii … page-xxxii) first, in roman order, then the book's numbered pages
const ROMAN = (r) => [...r].reduce((n, c, i, a) => { const v = { i: 1, v: 5, x: 10, l: 50, c: 100 }; const x = v[c], y = v[a[i + 1]] || 0; return n + (x < y ? -x : x); }, 0);
const bbPages = bbDirs.filter(isPage).map((d) => d.slice(5)).sort((a, b) => { const ra = /^\d+$/.test(a), rb = /^\d+$/.test(b); if (ra !== rb) return ra ? 1 : -1; return ra ? a - b : ROMAN(a) - ROMAN(b); });
const day = (d) => dirs(d).filter((x) => /-\d+$/.test(x));
const drDays = day("daily-reflection"), dtDays = day("daily-tradition");

const sections = [
  {
    id: "steps", h: "The Twelve Steps",
    p: `The Twelve Steps are A.A.'s program of recovery, first printed in the book <em>Alcoholics Anonymous</em> (the Big Book) in April 1939, in the chapter "How It Works" on pages 59–60. Our page sets out each Step and where the Big Book explains how to take it.`,
    links: [["/12-steps/", titleOf("12-steps/index.html")]],
  },
  {
    id: "traditions", h: "The Twelve Traditions",
    p: `The Traditions are the principles A.A. groups adopted in 1950 to keep the fellowship together and unowned. The Big Book prints the long form in Appendix I (pp. 563–566), and our page sets out what each one actually says. The history page follows how they were worked out from 1937 to 1950, from the letters and the sources.`,
    links: [["/12-traditions/", titleOf("12-traditions/index.html")], ["/12-traditions/history/", titleOf("12-traditions/history/index.html")]],
  },
  {
    id: "concepts", h: "The Twelve Concepts for World Service",
    p: `The Concepts, adopted by the General Service Conference in 1962, describe how A.A.'s service structure works. The Big Book's Appendix VII carries only their short form; our page has both forms in full.`,
    links: [["/12-concepts/", titleOf("12-concepts/index.html")]],
  },
  {
    id: "history", h: "The story of A.A.",
    p: `How A.A. began, from Bill W.'s and Dr. Bob's meeting in Akron in 1935 to the Traditions in 1950, told from what the books themselves say.`,
    links: [["/aa-history/", titleOf("aa-history/index.html")], ["/aa-info/", titleOf("aa-info/index.html")]],
  },
  {
    id: "big-book", h: "The Big Book",
    p: `<em>Alcoholics Anonymous</em>, 4th edition. There's a reference page for every page of the book, with what the page covers, its chapter, and where to read it. There are also pages on the passages people look for most, and you can read and search the actual pages free.`,
    links: [["/big-book/pages/", titleOf("big-book/pages/index.html")], ["/big-book/search/", "Search the Big Book"], ["/big-book/", titleOf("big-book/index.html")], ...bbTopics.map((x) => [x.url, x.t])],
    extra: `<p class="sh-small">Every page, by number (the front matter in roman numerals first):</p><p class="sh-pages">${bbPages.map((n) => `<a href="/big-book/page-${n}/">${n}</a>`).join(" ")}</p>`,
  },
  {
    id: "questions", h: "A.A. questions, answered from the books",
    p: `${questions.length} questions people actually ask about A.A. ("Am I an alcoholic?", "Is A.A. religious?", "What happens at a meeting?"), each answered from what A.A.'s own books say, with the page to check it against.`,
    links: [["/aa-questions/", titleOf("aa-questions/index.html")], ...questions.map((x) => [x.url, x.t])],
  },
  {
    id: "daily", h: "Daily readings",
    p: `One reading for every day of the year, on two tracks. The Daily Reflection pages are Recovery Einstein's Big Book perspective on each day's theme, with page citations. The Daily Tradition pages give one reading a day on the Twelve Traditions, one Tradition a month, grounded in the long form.`,
    links: [["/daily-reflection/", titleOf("daily-reflection/index.html")], ["/daily-reflection/today/", "Today's Reflection"], ...MONTHS.map((m) => [`/daily-reflection/${m}/`, `Daily Reflection: ${cap(m)}`]),
      ["/daily-tradition/", titleOf("daily-tradition/index.html")], ["/daily-tradition/today/", "Today's Tradition"], ...MONTHS.map((m, i) => [`/daily-tradition/${m}/`, `Daily Tradition: ${cap(m)} (Tradition ${i + 1})`])],
  },
];
const linkCount = sections.reduce((n, s) => n + s.links.length, 0) + bbPages.length;

// ---- the page, in the site's own shell (nav + footer taken from a live reading page) -----------------------------------
const tpl = read("12-concepts/index.html");
const icons = tpl.slice(tpl.indexOf("  <!-- brand:icons -->"), tpl.indexOf("  <meta charset"));
const css = tpl.match(/<link rel="stylesheet" href="\/style\.css[^"]*">/)[0];
const body = tpl.slice(tpl.indexOf("<body>"), tpl.indexOf('  <main id="main">'))
  .replace(/<details class="rs-globe">[\s\S]*?<\/details>\s*/, "") // no language copies of this page yet
  .replace(/utm_content=12-concepts-bar/g, "utm_content=start-here-bar");
const foot = tpl.slice(tpl.indexOf("  <footer class=\"footer\">"));
if (!icons || !body.includes("<nav") || !foot.includes("</footer>")) throw new Error("template shape changed: 12-concepts/index.html");

const TITLE = "Start Here: Every A.A. Reading on One Page | Recovery Starts";
const DESC = `Every reading page on Recovery Starts in one place: the Twelve Steps, Traditions and Concepts, the story of A.A., the Big Book page by page, ${questions.length} A.A. questions answered from the books, and the daily readings. Free, no account.`;
const ld = [
  { "@context": "https://schema.org", "@type": "CollectionPage", name: "Start here: every A.A. reading on one page", url: `${SITE}/start-here/`, description: DESC, isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: `${SITE}/` } },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, { "@type": "ListItem", position: 2, name: "Start here", item: `${SITE}/start-here/` }] },
];
const html = `<!DOCTYPE html>
<html lang="en">
<head>
${icons}  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(TITLE)}</title>
  <meta name="description" content="${esc(DESC)}">
  <meta property="og:title" content="Start here: every A.A. reading on one page">
  <meta property="og:description" content="${esc(DESC)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}/start-here/">
  <meta property="og:site_name" content="Recovery Starts">
  <meta property="og:image" content="${SITE}/assets/og/og-steps.jpg">
  <meta property="og:locale" content="en_CA">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${SITE}/start-here/">
${ld.map((x) => `  <script type="application/ld+json">${JSON.stringify(x)}</script>`).join("\n")}
  ${css}
  <style>
    .sh-wrap { padding: clamp(2rem,5vw,4rem) 0 4rem; }
    .sh-kicker { color: var(--gold); letter-spacing: 2.5px; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; text-align:center; }
    .sh-title { font-family: var(--font-display); color: var(--text); text-align:center; font-size: clamp(1.9rem,5.5vw,3rem); line-height:1.12; margin: 10px 0 10px; }
    .sh-lead { max-width: 760px; margin: 0 auto 2rem; }
    .sh-lead p { color: var(--text); line-height: 1.85; margin: 0 0 1rem; font-size: 1.03rem; }
    .sh-toc { max-width: 760px; margin: 0 auto 2.4rem; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
    .sh-toc a { border:1px solid var(--border); border-radius: 999px; padding: 6px 14px; font-size: 0.9rem; color: var(--text); }
    .sh-sec { max-width: 760px; margin: 0 auto 2.2rem; background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius); padding: 22px 26px; scroll-margin-top: 90px; }
    .sh-sec h2 { font-family: var(--font-display); color: var(--gold); font-size: 1.35rem; margin: 0 0 0.6rem; }
    .sh-sec > p { color: var(--text-muted); line-height: 1.8; margin: 0 0 1rem; }
    .sh-sec ul { margin: 0; padding-left: 1.2rem; columns: 2 280px; column-gap: 2rem; }
    .sh-sec li { margin: 0 0 0.45rem; line-height: 1.5; break-inside: avoid; }
    .sh-small { color: var(--text-dim); font-size: 0.85rem; margin: 1.2rem 0 0.4rem !important; }
    .sh-pages { line-height: 2; font-variant-numeric: tabular-nums; font-size: 0.9rem; word-spacing: 0.35em; }
    .sh-note { max-width: 760px; margin: 2rem auto 0; text-align:center; color: var(--text-dim); font-size: 0.88rem; line-height: 1.7; }
  </style>
</head>
${body}  <main id="main"><section class="sh-wrap"><div class="container">
    <p class="sh-kicker">The reading room</p>
    <h1 class="sh-title">Start here</h1>
    <div class="sh-lead">
      <p>Everything on Recovery Starts that's meant to be read, on one page. That's the Twelve Steps, Traditions and Concepts, the story of how A.A. began, the Big Book page by page, answers to the questions people ask about A.A., and a reading for every day of the year.</p>
      <p>Each page is written from A.A.'s own literature and names the page you can check it against. Every page is free, with no account and no sign-up. Recovery Starts is an independent project, not affiliated with Alcoholics Anonymous World Services. If you're looking for a meeting tonight, the <a href="/meetings/find/">meetings map</a> and <a href="/online/">online meetings</a> are the place to start.</p>
    </div>
    <nav class="sh-toc" aria-label="On this page">${sections.map((s) => `<a href="#${s.id}">${esc(s.h)}</a>`).join("")}</nav>
${sections.map((s) => `    <section class="sh-sec" id="${s.id}">
      <h2>${esc(s.h)}</h2>
      <p>${s.p}</p>
      <ul>${s.links.map(([u, t]) => `<li>${link(u, t)}</li>`).join("")}</ul>${s.extra ? `\n      ${s.extra}` : ""}
    </section>`).join("\n")}
    <p class="sh-note">${linkCount} reading pages, listed in <a href="/sitemap-reading.xml">sitemap-reading.xml</a> with the date each last changed. For AI assistants: <a href="/llms.txt">llms.txt</a>.</p>
  </div></section></main>
${foot}`;
fs.mkdirSync(R("start-here"), { recursive: true });
fs.writeFileSync(R("start-here/index.html"), html);

// ---- sitemap-reading.xml: every reading page, lastmod = its last commit (true, not today) ------------------------------
const lastmod = new Map();
try {
  const log = execFileSync("git", ["log", "--format=@%cI", "--numstat", "--", "12-steps", "12-traditions", "12-concepts", "aa-history", "aa-info", "aa-questions", "big-book", "daily-reflection", "daily-tradition", "start-here"], { cwd: ROOT, maxBuffer: 1 << 28 }).toString();
  // Site-wide restamps (a new language in the 🌐 menu, the privacy line) touch every page with a 1–3 line change. They
  // aren't a change to what the page says, so a change of 4 lines or fewer in a commit that touched over 150 pages is
  // skipped. lastmod is then the newest commit that really changed the page; a page only ever restamped keeps its
  // newest restamp. (2026-11-08: a plain "newest commit" gave 1,624 of 1,626 pages the same day, 11-02.)
  const commits = [];
  let cur = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("@")) commits.push((cur = { d: line.slice(1, 11), files: [] }));
    else if (cur) { const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+index\.html)$/); if (m) cur.files.push({ f: m[3], n: (+m[1] || 0) + (+m[2] || 0) }); }
  }
  const fallback = new Map();
  for (const c of commits) {
    const mass = c.files.length > 150;
    for (const { f, n } of c.files) {
      if (!fallback.has(f)) fallback.set(f, c.d);
      if (!(mass && n <= 4) && !lastmod.has(f)) lastmod.set(f, c.d);
    }
  }
  for (const [f, d] of fallback) if (!lastmod.has(f)) lastmod.set(f, d);
} catch (e) { console.error("git log failed, lastmod falls back to today:", e.message); }
const today = new Date().toISOString().slice(0, 10);
const urls = ["/start-here/"];
for (const s of sections) for (const [u] of s.links) if (!urls.includes(u)) urls.push(u);
for (const n of bbPages) urls.push(`/big-book/page-${n}/`);
for (const d of drDays) urls.push(`/daily-reflection/${d}/`);
for (const d of dtDays) urls.push(`/daily-tradition/${d}/`);
const rows = urls.filter((u) => has(`${u.slice(1)}index.html`)).map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${lastmod.get(`${u.slice(1)}index.html`) || today}</lastmod></url>`);
fs.writeFileSync(R("sitemap-reading.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Every reading page on recoverystarts.com, lastmod = the day its file last changed in git. Built by scripts/build-start-here.mjs. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`);
const missing = urls.length - rows.length;
console.log(`start-here: ${sections.length} sections, ${linkCount} links (${questions.length} questions, ${bbTopics.length} Big Book topics, ${bbPages.length} Big Book pages); sitemap-reading.xml: ${rows.length} URLs${missing ? `, ${missing} linked URLs with no file (left out)` : ""}; lastmod from git for ${rows.filter((r) => !r.includes(`<lastmod>${today}`)).length}`);
