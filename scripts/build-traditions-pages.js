#!/usr/bin/env node
/**
 * build-traditions-pages.js — the Daily Traditions engine.
 *
 * Renders data/traditions-daily.json into:
 *   /daily-tradition/                 the hub (month = Tradition; July = Tradition 7)
 *   /daily-tradition/july/ … december/    one hub per LIVE month (day grid + Tradition)
 *   /daily-tradition/july-1/ … july-31/   one page per reading
 *   /daily-tradition/today/           auto-redirect to today's reading
 *
 * REUSABLE BY DESIGN: this template is month-agnostic. Adding November (Tradition
 * 11) means adding 30 rows to traditions-daily.json and re-running. No template
 * work. That was the whole point of the WO.
 *
 * THE READINGS ARE APPROVED CONTENT. They are rendered VERBATIM from the JSON,
 * which parse-traditions.js proved is a verbatim copy of the GATE-2 markdown.
 * Nothing here rewrites, re-voices, or "improves" a reading.
 *
 * DOCTRINE (load-bearing — do not let this blur):
 *   The Traditions are GOVERNANCE, not theology. They bind A.A. GROUPS and the
 *   Fellowship — not individuals, and not independent businesses.
 *   Short form = pp. 561–562.  LONG FORM = pp. 563–566.  Concepts = pp. 574–575.
 *   Tradition 3's "no other affiliation" clause exists ONLY in the Long Form.
 *   That is why the Long Form is front-loaded on every page.
 *
 * Usage: node scripts/build-traditions-pages.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";
const TODAY = "2026-07-12";

// Article schema dates, PER MONTH-BATCH — not one date for all 366 pages.
// Each month is written, gated and shipped as a batch, so the honest
// datePublished is the day that batch went live. One shared date across the
// whole year reads to a crawler as a single enormous content dump.
// ADD A LINE HERE WHEN A MONTH SHIPS. Unlisted months fall back to TODAY.
const MONTH_PUBLISHED = {
  july: "2026-07-12",
  august: "2026-07-12",
  september: "2026-07-28",
  october: "2026-07-29",
  november: "2026-07-30",
  december: "2026-07-31",
};
const publishedFor = (month) => MONTH_PUBLISHED[month] || TODAY;

// ── Kind → badge. TWO SCHEMES, side by side. ────────────────────────────────
// July T7 and August T8 shipped on the odd/even scheme and are not retro-fitted.
// September T9 onward uses the five questions, run straight through.
// "hyp" styling tints the days that work through a scenario rather than an
// incident. It is a colour, not a disclaimer — nothing announces itself.
const KIND_BADGE = {
  "hypothetical":          { label: "Where it goes wrong",   cls: "hyp" },
  "the earned answer":     { label: "The earned answer",     cls: "earned" },
  "the threat":            { label: "The threat",            cls: "earned" },
  "before the tradition":  { label: "Before the Tradition",  cls: "earned" },
  "the threat today":      { label: "The threat today",      cls: "earned" },
  "how a group breaks it": { label: "How a group breaks it", cls: "hyp" },
  "how it gets captured":  { label: "How it gets captured",  cls: "earned" },
};
function badgeFor(d) {
  const k = KIND_BADGE[String(d.kind || "").toLowerCase()];
  if (!k) throw new Error(`Unknown kind "${d.kind}" on ${d.month}-${d.day} — add it to KIND_BADGE.`);
  return `<span class="dt-badge ${k.cls}">${k.label}</span>`;
}
function kindLabelFor(d) {
  const k = KIND_BADGE[String(d.kind || "").toLowerCase()];
  return k ? k.label.toLowerCase() : String(d.kind || "");
}
// The hub's "How <Month> reads" paragraph. It describes the SCHEME the featured
// month was written on — July and August ran odd/even; September onward runs the
// five questions straight through. Describing the wrong one is a lie about the
// page directly beneath it, so this switches on the month's actual kind tags.
function howMonthReads(month, daysForMonth) {
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
  const kinds = new Set((daysForMonth || []).map((d) => String(d.kind || "").toLowerCase()));
  const hasFiveQ = kinds.has("the threat") || kinds.has("how it gets captured");
  const hasOddEven = kinds.has("hypothetical") || kinds.has("the earned answer");
  const CLOSE = `Anything inside quotation marks is A.A.'s own wording, printed exactly, with the source named at the foot of the reading. The explaining around it is ours — plain modern English, and scenes drawn to show how the Tradition actually plays out. You should always be able to tell which is which.</p>`;
  // A month can carry BOTH schemes (August: days 1–11 shipped on odd/even,
  // days 12+ on the five questions). Describing only one would be a lie about
  // the page directly beneath this paragraph.
  if (hasFiveQ && hasOddEven) {
    return `<p><strong>How ${monthCap} reads.</strong> The month opens day-by-day — one angle on the Tradition at a time, where groups go wrong with it and the reason it was written — then settles into five questions, run straight through: <em>what specifically threatened A.A.</em> · <em>how the founders solved it before there was a Tradition</em> · <em>where that same danger lives now</em> · <em>how a group drifts off it on its own</em> · <em>how it gets hollowed out from outside</em>. ${CLOSE}`;
  }
  if (hasFiveQ) {
    return `<p><strong>How ${monthCap} reads.</strong> The month runs on five questions, straight through, over and over: <em>what specifically threatened A.A.</em> · <em>how the founders solved it before there was a Tradition</em> · <em>where that same danger lives now</em> · <em>how a group drifts off it on its own</em> · <em>how it gets hollowed out from outside</em>. Every five days tells the whole Tradition once, then comes back new — no incident, quote or image is used twice. ${CLOSE}`;
  }
  return `<p><strong>How ${monthCap} reads.</strong> Each day takes one angle on the Tradition — where groups go wrong with it, and the reason it was written in the first place. ${CLOSE}`;
}

const DRY = process.argv.includes("--dry");

const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "traditions-daily.json"), "utf8"));

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const CAP = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SHORT_PAGES = "561–562";
const LONG_PAGES = "563–566";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }

// Markdown emphasis inside an approved reading (*word*) -> <em>. Content-preserving.
function mdEm(s) {
  return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

const NAV = `  <nav class="nav"><div class="nav-inner">
    <a href="/" class="nav-brand">Recovery Starts</a>
    <button class="nav-toggle" aria-label="Toggle menu" onclick="document.querySelector('.nav-links').classList.toggle('open')">☰</button>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/meetings/">Meetings</a></li>
      <li><a href="/aa-info/">AA Info</a></li>
      <li><a href="/daily-reflection/">Daily Reflection</a></li>
      <li><a href="/daily-tradition/">Daily Tradition</a></li>
      <li><a href="/12-steps/">The 12 Steps</a></li>
      <li><a href="/big-book/">Big Book</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li>
      <li><a href="/download/" class="nav-cta">Get the App</a></li>
    </ul>
  </div></nav>`;

const FOOTER = `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div><div class="footer-brand">Recovery Starts</div><p class="footer-desc">Independent recovery awareness project. Not affiliated with any fellowship.</p></div>
        <div><h4>Navigate</h4><ul class="footer-links"><li><a href="/">Home</a></li><li><a href="/meetings/">Meetings</a></li><li><a href="/daily-reflection/">Daily Reflection</a></li><li><a href="/daily-tradition/">Daily Tradition</a></li><li><a href="/steps/">The 12 Steps</a></li><li><a href="/about/">About</a></li></ul></div>
        <div><h4>The Big Book</h4><ul class="footer-links"><li><a href="/big-book/">Get the Big Book</a></li><li><a href="/big-book/pages/">Page by Page</a></li><li><a href="/big-book/search/">Search the Big Book</a></li><li><a href="https://www.aa.org" target="_blank" rel="noopener">aa.org</a></li></ul></div>
        <div><h4>Connect</h4><ul class="footer-links"><li><a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Meet Derick</a></li><li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li></ul></div>
      </div>
      <div class="privacy-notice"><strong>Privacy:</strong> No cookies. No personal tracking. Anonymous, cookie-free page counts only. <strong>Independence:</strong> Not affiliated with any fellowship. <strong>No Medical Advice:</strong> Not a substitute for professional care.</div>
      <div class="footer-bottom"><p>&copy; 2026 RecoveryStarts.com. Built by <a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Addict2Influencer</a>.</p></div>
    </div>
  </footer>
  <script src="/app.js"></script>
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "9c520169a3ab453b867424ab9b3b276b"}'></script>
</body>
</html>`;

// FIRST LIGHT: the reading page is a book page — paper ground (body), Literata
// at 65ch, eyebrow wayfinding, hairline rows for indexes. Tokens only, no hex.
const STYLE = `  <style>
    .dt-wrap { padding: clamp(2rem,5vw,4rem) 0 4rem; }
    .dt-crumb { text-align:center; font-family: var(--font-ui); font-size:0.78rem; letter-spacing:0.06em; color:var(--ink-dim); margin-bottom:1.4rem; }
    .dt-crumb a { color: var(--ink-soft); }
    .dt-kicker { color: var(--ink-soft); font-family: var(--font-ui); letter-spacing: 0.14em; text-transform: uppercase; font-size: 0.75rem; font-weight: 600; text-align: center; }
    .dt-title { font-family: var(--font-display); font-weight:550; color: var(--ink); text-align: center; font-size: var(--step-4); letter-spacing:-0.02em; line-height: 1.12; margin: 10px 0 8px; text-wrap: balance; }
    .dt-date { text-align:center; font-family: var(--font-ui); color: var(--ink-soft); font-size: 0.92rem; margin-bottom: 0.6rem; }
    .dt-badge { display:inline-block; font-family: var(--font-ui); font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; font-weight:600; padding:5px 13px; border-radius:999px; margin-bottom: 1.8rem; border:1px solid var(--rule-strong); color: var(--ink-soft); }
    .dt-badge.hyp { border-style: dashed; }
    .dt-center { text-align:center; }
    .dt-reading { max-width: 65ch; margin: 0 auto; }
    .dt-reading p { color: var(--ink); line-height: 1.75; font-size: var(--step-0); margin: 0 0 1.1rem; }
    .dt-reading em { color: var(--ink-soft); }
    .dt-sit { max-width: 65ch; margin: 2.2rem auto 0; padding: 4px 0 4px 20px; border-left: 2px solid var(--accent); }
    .dt-sit .lbl { display:block; color: var(--ink-soft); font-family: var(--font-ui); font-size: 0.7rem; font-weight:600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }
    .dt-sit p { margin: 0; color: var(--ink); font-size: var(--step-0); line-height: 1.65; font-style: italic; }
    .dt-grounded { max-width: 65ch; margin: 1rem auto 0; font-family: var(--font-ui); color: var(--ink-dim); font-size: 0.84rem; text-align:center; }
    .dt-tradition { max-width: 65ch; margin: 2.4rem auto 0; background: var(--paper-2); border: 1px solid var(--rule); border-radius: var(--radius); padding: 24px 28px; }
    .dt-tradition h2 { font-family: var(--font-ui); color: var(--ink-soft); font-size: 0.8rem; font-weight:600; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 10px; }
    .dt-tradition blockquote { margin: 0 0 14px; color: var(--ink); font-size: var(--step-0); line-height: 1.7; font-style: italic; }
    .dt-longform { border-top: 1px solid var(--rule); margin-top: 14px; padding-top: 14px; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.7; }
    .dt-longform strong { color: var(--ink); }
    .dt-nav { display:flex; justify-content:space-between; gap:10px; max-width: 760px; margin: 2.6rem auto 0; font-family: var(--font-ui); }
    .dt-nav a { flex:1 1 0; border:1px solid var(--rule); color: var(--ink); border-radius: var(--radius-sm); padding: 10px 14px; font-size:0.88rem; transition: all .18s; }
    .dt-nav a:hover { border-color: var(--rule-strong); color: var(--accent); background: color-mix(in oklab, var(--accent) 6%, transparent); }
    .dt-nav a small { display:block; color: var(--ink-dim); font-size: 0.7rem; }
    .dt-nav .dt-nav-mid { text-align:center; }
    .dt-nav .dt-nav-next { text-align:right; }
    @media (max-width: 560px) {
      .dt-nav { flex-wrap: wrap; }
      .dt-nav a, .dt-nav .dt-nav-next { flex: 1 1 100%; text-align:center; }
    }
    .dt-chips { text-align:center; margin: 2rem auto 0; max-width: 720px; font-family: var(--font-ui); }
    .dt-chips a { display:inline-block; border:1px solid var(--rule); color: var(--ink-soft); border-radius:999px; padding:7px 16px; margin:4px; font-size:0.85rem; transition: all .18s; }
    .dt-chips a:hover { border-color: var(--accent); color: var(--accent); }
    .dt-disc { max-width: 65ch; margin: 2.6rem auto 0; text-align:center; font-family: var(--font-ui); color: var(--ink-dim); font-size: 0.78rem; line-height: 1.6; }
    .dt-disc a { color: var(--ink-soft); text-decoration: underline; }
    /* hub — TODAY'S READING leads, Einstein holds the book beside it */
    .dt-today { max-width: 920px; margin: 0 auto 2.6rem; background: var(--paper-2); border: 1px solid var(--rule); border-radius: var(--radius); padding: 28px 30px; display: grid; grid-template-columns: 1fr 200px; gap: 1.75rem; align-items: center; }
    .dt-today-fig { position: relative; }
    .dt-today-fig::before { content: ''; position: absolute; inset: -10%; background: radial-gradient(circle, rgba(139, 100, 220, 0.35) 0%, rgba(45, 212, 191, 0.18) 45%, transparent 70%); filter: blur(28px); }
    .dt-today-fig img { position: relative; width: 100%; height: auto; border-radius: 16px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5); }
    .dt-today-fig figcaption { position: relative; text-align: center; font-family: var(--font-ui); font-size: 0.75rem; color: var(--ink-dim); margin-top: 8px; }
    @media (max-width: 700px) { .dt-today { grid-template-columns: 1fr; } .dt-today-fig { max-width: 220px; margin: 0 auto; } }
    .dt-today-head { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom: 10px; }
    .dt-today-lbl { color: var(--ink-soft); font-family: var(--font-ui); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; }
    .dt-today .dt-badge { margin-bottom: 0; }
    .dt-today-title { font-family: var(--font-display); font-weight:550; font-size: clamp(1.4rem,3.4vw,1.9rem); line-height:1.2; margin: 0 0 14px; }
    .dt-today-title a { color: var(--ink); }
    .dt-today-title a:hover { color: var(--accent); }
    .dt-today-body { color: var(--ink); line-height: 1.75; font-size: 1.03rem; margin: 0 0 1.2rem; }
    .dt-today-body em { color: var(--ink-soft); }
    .dt-today-sit { border-left: 2px solid var(--accent); padding: 4px 0 4px 16px; margin-bottom: 1.4rem; }
    .dt-today-sit .lbl { display:block; color: var(--ink-soft); font-family: var(--font-ui); font-size: 0.66rem; font-weight:600; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 5px; }
    .dt-today-sit p { margin: 0; color: var(--ink); font-style: italic; line-height: 1.65; }
    .dt-today-actions { display:flex; flex-wrap:wrap; gap: 10px; }
    .dt-today-actions .btn { font-size: 0.9rem; }
    .dt-h2 { font-family: var(--font-display); font-weight:550; color: var(--ink); font-size: var(--step-1); margin: 0 0 0.9rem; }
    .dt-cta { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin: 2.4rem auto 0; }
    /* hub */
    .dt-intro { max-width: 65ch; margin: 0 auto 2rem; }
    .dt-intro p { color: var(--ink-soft); line-height: 1.75; margin: 0 0 1rem; }
    .dt-intro strong { color: var(--ink); }
    .dt-months { display:grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap:10px; max-width: 900px; margin: 0 auto 2.6rem; font-family: var(--font-ui); }
    .dt-month { border:1px solid var(--rule); border-radius: var(--radius-sm); padding: 14px 16px; text-align:center; transition: all .18s; }
    a.dt-month:hover { border-color: var(--accent); background: color-mix(in oklab, var(--accent) 6%, transparent); }
    .dt-month .m { display:block; color: var(--ink); font-size:0.95rem; }
    .dt-month .t { display:block; color: var(--ink-dim); font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; margin-top:3px; }
    .dt-month.live .t { color: var(--accent); }
    .dt-month.soon { border-style: dashed; }
    .dt-month.soon .m { color: var(--ink-soft); }
    /* Day index — a book's table of contents: rows and rules, not boxes */
    .dt-days { max-width: 760px; margin: 0 auto; }
    .dt-days[id], .dt-h2[id] { scroll-margin-top: 96px; }
    .dt-day { display:block; border-top: 1px solid var(--rule); padding: 1.1rem 0.4rem; transition: background .18s; }
    .dt-day:last-child { border-bottom: 1px solid var(--rule); }
    .dt-day:hover { background: color-mix(in oklab, var(--accent) 6%, transparent); }
    .dt-day .d { color: var(--accent); font-family: var(--font-ui); font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; font-weight:600; }
    .dt-day .t { display:block; font-family: var(--font-display); color: var(--ink); margin-top:3px; font-size:1.15rem; line-height:1.35; }
    .dt-day .k { display:block; color: var(--ink-dim); font-size:0.78rem; margin-top:4px; font-style:italic; }
  </style>`;

function head(o) {
  const ldBlocks = o.ld.map((x) => "  <script type=\"application/ld+json\">\n  " + JSON.stringify(x) + "\n  </script>").join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${escAttr(o.desc)}">
  <meta property="og:title" content="${escAttr(o.title)}">
  <meta property="og:description" content="${escAttr(o.desc)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${o.url}">
  <meta property="og:site_name" content="Recovery Starts">
  <meta property="og:image" content="${SITE}/assets/einstein-character.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(o.title)}">
  <meta name="twitter:description" content="${escAttr(o.desc)}">
  <meta name="twitter:image" content="${SITE}/assets/einstein-character.png">
  <link rel="canonical" href="${o.url}">
${ldBlocks}
  <link rel="stylesheet" href="/style.css">
${STYLE}
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
${NAV}
  <main id="main"><section class="dt-wrap"><div class="container">`;
}

// The scenario disclaimer was removed on purpose. Announcing "this is a
// hypothetical" taught the reader nothing and read like a legal notice in the
// middle of a reading. The prose carries it instead — an imagined scene says so
// in its own opening words, and every scene is anchored to real A.A. history or
// the book. The site-wide notice below still states what this project is.

const DISC = `      <p class="dt-disc">Daily Traditions is an independent educational resource from Recovery Starts — <strong>not official A.A. literature</strong>, not affiliated with Alcoholics Anonymous World Services, and not medical advice. The Twelve Traditions are the property of A.A. Page references are to <em>Alcoholics Anonymous</em> (the Big Book), 4th Edition: short form ${SHORT_PAGES}, <strong>long form ${LONG_PAGES}</strong>. If you're in crisis, call or text 988 (Suicide &amp; Crisis Lifeline).</p>`;

/**
 * TODAY'S READING — the hero at the top of the hub.
 *
 * Derick's note, and he's right: "if people show up and [the doctrine essay] is
 * the first thing they read they will leave." Someone landing here should be
 * READING, not being lectured. So the reading leads and the essay moves down.
 *
 * Rendered twice, identically: once here at build time (so no-JS users and
 * crawlers get a real reading), and once by __dtHero() in the browser (so the
 * date is actually today's). Keep the two in sync — same markup, same classes.
 */
function todayHeroHtml(d, isToday = true) {
  const monthCap = CAP(d.month);
  const slug = `${d.month}-${d.day}`;
  const badge = badgeFor(d);
  return `
        <div class="dt-today-head">
          <span class="dt-today-lbl">${isToday ? "Today" : "Latest reading"} · ${monthCap} ${d.day}</span>
          ${badge}
        </div>
        <h2 class="dt-today-title"><a href="/daily-tradition/${slug}/">${esc(d.title)}</a></h2>
        <p class="dt-today-body">${mdEm(d.body)}</p>
        <div class="dt-today-sit">
          <span class="lbl">Sit with</span>
          <p>${mdEm(d.sitWith)}</p>
        </div>
        <div class="dt-today-actions">
          <a class="btn btn-primary" href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${slug}" target="_blank" rel="noopener">Ask Recovery Einstein about today's Tradition →</a>
          <a class="btn btn-outline" href="/daily-tradition/${slug}/">Open this reading →</a>
        </div>`;
}

/** The browser-side twin of todayHeroHtml(). Same markup, real date. */
const HERO_JS = `
  <script>
    window.__dtHero = function (d, isToday) {
      var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
      var em = function (s) { return esc(s).replace(/\\*([^*]+)\\*/g, "<em>$1</em>"); };
      // Badge HTML is precomputed server-side (badgeFor) and shipped in the
      // payload, so the two schemes stay in one place instead of two.
      var badge = d.badge || '';
      return ''
        + '<div class="dt-today-head">'
        +   '<span class="dt-today-lbl">' + (isToday ? "Today" : "Latest reading") + ' \\u00b7 ' + esc(d.month) + ' ' + d.day + '</span>'
        +   badge
        + '</div>'
        + '<h2 class="dt-today-title"><a href="/daily-tradition/' + d.slug + '/">' + esc(d.title) + '</a></h2>'
        + '<p class="dt-today-body">' + em(d.body) + '</p>'
        + '<div class="dt-today-sit"><span class="lbl">Sit with</span><p>' + em(d.sitWith) + '</p></div>'
        + '<div class="dt-today-actions">'
        +   '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://app.recoverystarts.com/?utm_source=recoverystarts&utm_medium=site&utm_campaign=daily-traditions&utm_content=' + d.slug + '">Ask Recovery Einstein about today\\'s Tradition \\u2192</a>'
        +   '<a class="btn btn-outline" href="/daily-tradition/' + d.slug + '/">Open this reading \\u2192</a>'
        + '</div>';
    };
  </script>`;

function traditionBlock(n, shortForm) {
  return `      <div class="dt-tradition">
        <h2>Tradition ${n}</h2>
        <blockquote>"${esc(shortForm)}"</blockquote>
        <div class="dt-longform">
          <strong>Read the Long Form (pp. ${LONG_PAGES}).</strong> The short form on pp. ${SHORT_PAGES} is the one everybody quotes — but the <strong>Long Form</strong> is where the Traditions actually say what they mean. Tradition 3's "no other affiliation" clause, for instance, exists <em>only</em> in the Long Form. That single clause is why no treatment centre can own an A.A. group. Most of what circulates online skips it.
          <br><br>
          And a distinction worth keeping straight: <strong>the Traditions are governance, not theology.</strong> They bind A.A. <em>groups</em> and the Fellowship — not individuals, and not outside businesses. They were adopted in 1950 to keep A.A. from being owned or co-opted. They are not a rulebook for your personal life.
        </div>
      </div>`;
}

// ── Day pages ───────────────────────────────────────────────────────────────
const days = DATA.days.slice().sort((a, b) => (MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month)) || (a.day - b.day));
// Group by month so prev/next stay WITHIN a month — adding August must not make
// July 1's "next" jump to August 1. Each month navigates as its own sequence.
const byMonth = {};
for (const dd of days) (byMonth[dd.month] = byMonth[dd.month] || []).push(dd);
const built = [];
const seenTitles = new Set();
const seenDescs = new Set();

for (const d of days) {
  const slug = `${d.month}-${d.day}`;
  const url = `${SITE}/daily-tradition/${slug}/`;
  const shortForm = DATA.traditions[String(d.tradition)].shortForm;
  const monthCap = CAP(d.month);

  const monthArr = byMonth[d.month];
  const mi = monthArr.indexOf(d);
  const prev = monthArr[mi - 1];
  const next = monthArr[mi + 1];

  const title = `Tradition ${d.tradition} — ${monthCap} ${d.day}: ${d.title} | Daily Traditions | Recovery Starts`;

  // Unique per day: first clause of the reading, trimmed to a description.
  const teaser = d.body.replace(/\s+/g, " ").slice(0, 120).replace(/\s\S*$/, "");
  const desc = `${monthCap} ${d.day} — "${d.title}." A daily reading on A.A.'s Tradition ${d.tradition}: ${shortForm.replace(/\.$/, "")}. ${teaser}…`.slice(0, 250);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Tradition ${d.tradition} — ${monthCap} ${d.day}: ${d.title}`,
    description: desc,
    author: { "@type": "Organization", name: "Recovery Starts", url: SITE },
    publisher: { "@type": "Organization", name: "Recovery Starts", logo: { "@type": "ImageObject", url: SITE + "/assets/einstein-character.png" } },
    image: SITE + "/assets/einstein-character.png",
    datePublished: publishedFor(d.month),
    dateModified: publishedFor(d.month),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Daily Traditions", item: SITE + "/daily-tradition/" },
      { "@type": "ListItem", position: 3, name: monthCap, item: SITE + `/daily-tradition/${d.month}/` },
      { "@type": "ListItem", position: 4, name: `${monthCap} ${d.day}: ${d.title}`, item: url },
    ],
  };

  const badge = badgeFor(d);

  // Three-slot nav: prev day / all of the month / next day. Nobody is ever
  // more than one tap from the month they are standing in.
  const prevLink = prev
    ? `<a href="/daily-tradition/${prev.month}-${prev.day}/"><small>← ${CAP(prev.month)} ${prev.day}</small>${esc(prev.title)}</a>`
    : `<a href="/daily-tradition/${d.month}/"><small>←</small>All of ${monthCap}</a>`;
  const midLink = `<a class="dt-nav-mid" href="/daily-tradition/${d.month}/"><small>Tradition ${d.tradition}</small>All of ${monthCap}</a>`;
  const nextLink = next
    ? `<a class="dt-nav-next" href="/daily-tradition/${next.month}-${next.day}/"><small>${CAP(next.month)} ${next.day} →</small>${esc(next.title)}</a>`
    : `<a class="dt-nav-next" href="/daily-tradition/${d.month}/"><small>→</small>All of ${monthCap}</a>`;

  const html = head({ title, desc, url, ld: [articleLd, crumbLd] }) + `
      <nav class="dt-crumb"><a href="/">Home</a> / <a href="/daily-tradition/">Daily Traditions</a> / <a href="/daily-tradition/${d.month}/">${monthCap}</a> / ${monthCap} ${d.day}</nav>
      <div class="dt-kicker">Tradition ${d.tradition} · ${monthCap} ${d.day}</div>
      <h1 class="dt-title">${esc(d.title)}</h1>
      <p class="dt-date">Daily Traditions · ${monthCap} ${d.day}</p>
      <div class="dt-center">${badge}</div>

      <div class="dt-reading">
        <p>${mdEm(d.body)}</p>
      </div>

      <div class="dt-sit">
        <span class="lbl">Sit with</span>
        <p>${mdEm(d.sitWith)}</p>
      </div>
      <p class="dt-grounded">Grounded in: ${mdEm(d.groundedIn)}</p>


${traditionBlock(d.tradition, shortForm)}

      <div class="dt-chips">
        <a href="/12-traditions/">What the Traditions actually say →</a>
        <a href="/big-book/page-563/">The Long Form, p. 563 →</a>
        <a href="/big-book/search/">Search the Big Book →</a>
        <a href="/daily-tradition/${d.month}/">Every day this month →</a>
      </div>

      <div class="dt-cta">
        <a href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${slug}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about Tradition ${d.tradition} →</a>
        <a href="/download/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${slug}" class="btn btn-outline">Get the app →</a>
      </div>

      <div class="dt-nav">
        ${prevLink}
        ${midLink}
        ${nextLink}
      </div>

${DISC}
  </div></section></main>
${FOOTER}
`;

  if (seenTitles.has(title)) throw new Error("DUPLICATE TITLE: " + title);
  if (seenDescs.has(desc)) throw new Error("DUPLICATE META on " + slug);
  seenTitles.add(title);
  seenDescs.add(desc);

  // Non-negotiables, asserted at build time.

  if (html.indexOf(LONG_PAGES) === -1) throw new Error("Missing Long Form page ref on " + slug);
  if (html.indexOf(SHORT_PAGES) === -1) throw new Error("Missing short form page ref on " + slug);
  if (html.indexOf("/demo") !== -1) throw new Error("Forbidden /demo link on " + slug);

  built.push({ slug, url, title, day: d.day, month: d.month, dTitle: d.title, kind: d.kind, kindLabel: kindLabelFor(d), hypothetical: d.hypothetical });

  if (!DRY) {
    const dir = path.join(ROOT, "daily-tradition", slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
}

// ── Hub: /daily-tradition/ ──────────────────────────────────────────────────
const liveMonths = new Set(days.map((d) => d.month));
// Featured month = the live month matching the current calendar month, else the
// latest live month at or before it, else the earliest. Keeps the hub framed on
// the month a visitor is actually in; pre-published months stay reachable below.
const liveIdx = [...liveMonths].map((m) => MONTHS.indexOf(m)).sort((a, b) => a - b);
const nowIdx = new Date().getMonth();
const featIdx = liveIdx.filter((i) => i <= nowIdx).pop();
const featMonth = MONTHS[featIdx !== undefined ? featIdx : liveIdx[0]];
const featDays = byMonth[featMonth];
const T = featDays[0].tradition;
const monthCap = CAP(featMonth);
const shortForm = DATA.traditions[String(T)].shortForm;

// Month cards — every LIVE month now has its own hub page. The card used to
// jump to an in-page anchor, which meant the hub had to carry every month's
// full grid and grew without bound. The id stays so old #month-august links
// still land somewhere sensible.
const monthCardsFor = (current) => MONTHS.map((m, i) => {
  const n = i + 1;
  const live = liveMonths.has(m);
  if (!live) return `<div class="dt-month soon" id="month-${m}"><span class="m">${CAP(m)}</span><span class="t">Tradition ${n}</span></div>`;
  const here = m === current ? ' style="border-color:var(--gold)"' : "";
  return `<a class="dt-month live" id="month-${m}" href="/daily-tradition/${m}/"${here}><span class="m">${CAP(m)}</span><span class="t">Tradition ${n} · live</span></a>`;
}).join("");

const cardHtml = (b) =>
  `<a class="dt-day" href="/daily-tradition/${b.slug}/">
          <span class="d">${CAP(b.month)} ${b.day}</span>
          <span class="t">${esc(b.dTitle)}</span>
          <span class="k">${esc(b.kindLabel)}</span>
        </a>`;
const dayCards = built.filter((b) => b.month === featMonth).map(cardHtml).join("\n        ");

// ── Month hub pages: /daily-tradition/<month>/ ──────────────────────────────
// One page per live month: the Tradition, every day of the month, and a way
// into every other month. These are what the nav dropdown points at.
const liveOrdered = MONTHS.filter((m) => liveMonths.has(m));
for (const m of liveOrdered) {
  const t = byMonth[m][0].tradition;
  const mCap = CAP(m);
  const sf = DATA.traditions[String(t)].shortForm;
  const cards = built.filter((b) => b.month === m).map(cardHtml).join("\n        ");
  const mi = liveOrdered.indexOf(m);
  const prevM = liveOrdered[mi - 1];
  const nextM = liveOrdered[mi + 1];
  const prevMLink = prevM
    ? `<a href="/daily-tradition/${prevM}/"><small>← ${CAP(prevM)}</small>Tradition ${byMonth[prevM][0].tradition}</a>`
    : `<a href="/daily-tradition/"><small>←</small>All months</a>`;
  const nextMLink = nextM
    ? `<a class="dt-nav-next" href="/daily-tradition/${nextM}/"><small>${CAP(nextM)} →</small>Tradition ${byMonth[nextM][0].tradition}</a>`
    : `<a class="dt-nav-next" href="/daily-tradition/"><small>→</small>All months</a>`;
  const mUrl = `${SITE}/daily-tradition/${m}/`;
  const mLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Daily Traditions — ${mCap}: Tradition ${t}`,
      description: `${mCap} on Daily Traditions: one reading a day on Tradition ${t} of Alcoholics Anonymous. ${byMonth[m].length} readings, grounded in the Long Form (pp. ${LONG_PAGES}).`,
      url: mUrl,
      isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
      hasPart: built.filter((b) => b.month === m).map((b) => ({ "@type": "Article", headline: `${CAP(b.month)} ${b.day}: ${b.dTitle}`, url: b.url })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Daily Traditions", item: SITE + "/daily-tradition/" },
        { "@type": "ListItem", position: 3, name: mCap, item: mUrl },
      ],
    },
  ];
  const mHtml = head({
    title: `${mCap} — Tradition ${t}, One Reading a Day | Daily Traditions | Recovery Starts`,
    desc: `Every Daily Traditions reading for ${mCap} — one a day on Tradition ${t} of Alcoholics Anonymous, grounded in the LONG FORM (pp. ${LONG_PAGES}), not the internet's version.`,
    url: mUrl,
    ld: mLd,
  }) + `
      <nav class="dt-crumb"><a href="/">Home</a> / <a href="/daily-tradition/">Daily Traditions</a> / ${mCap}</nav>
      <div class="dt-kicker">Daily Traditions · one month, one Tradition</div>
      <h1 class="dt-title">${mCap}</h1>
      <p class="dt-date">Tradition ${t} · ${byMonth[m].length} readings</p>

${traditionBlock(t, sf)}

      <div class="dt-days" style="margin-top:2.4rem">
        ${cards}
      </div>

      <div class="dt-nav">
        ${prevMLink}
        <a class="dt-nav-mid" href="/daily-tradition/"><small>Daily Traditions</small>All months</a>
        ${nextMLink}
      </div>

      <div class="dt-months" style="margin-top:2.4rem">${monthCardsFor(m)}</div>

      <div class="dt-cta">
        <a href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=month-${m}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about Tradition ${t} →</a>
        <a href="/download/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=month-${m}" class="btn btn-outline">Get the app →</a>
      </div>

${DISC}
  </div></section></main>
${FOOTER}
`;
  if (mHtml.indexOf(LONG_PAGES) === -1) throw new Error("Missing Long Form page ref on month hub " + m);
  if (!DRY) {
    const mDir = path.join(ROOT, "daily-tradition", m);
    fs.mkdirSync(mDir, { recursive: true });
    fs.writeFileSync(path.join(mDir, "index.html"), mHtml);
  }
}

const hubLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Daily Traditions — A Reading a Day on A.A.'s Twelve Traditions",
    description: `One reading a day on the Twelve Traditions of Alcoholics Anonymous. Each month takes one Tradition. ${monthCap} is Tradition ${T}.`,
    url: SITE + "/daily-tradition/",
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
    hasPart: built.map((b) => ({ "@type": "Article", headline: `${CAP(b.month)} ${b.day}: ${b.dTitle}`, url: b.url })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where are the 12 Traditions in the Big Book?",
        acceptedAnswer: { "@type": "Answer", text: `The short form of the Twelve Traditions appears on pages ${SHORT_PAGES} of Alcoholics Anonymous, 4th Edition. The LONG FORM — the fuller, original wording — is on pages ${LONG_PAGES}. The Twelve Concepts follow on pages 574–575. Most online summaries only quote the short form, which is why so much of what circulates is incomplete.` },
      },
      {
        "@type": "Question",
        name: "What is the difference between the short form and the long form of the Traditions?",
        acceptedAnswer: { "@type": "Answer", text: `The short form (pages ${SHORT_PAGES}) is the condensed version read aloud in meetings. The long form (pages ${LONG_PAGES}) is the fuller statement and says considerably more. For example, Tradition 3's clause that a group is A.A. only if, "as a group, they have no other affiliation" appears ONLY in the long form. That clause is what prevents a treatment centre or any outside body from owning an A.A. group.` },
      },
      {
        "@type": "Question",
        name: "Do the 12 Traditions apply to individuals?",
        acceptedAnswer: { "@type": "Answer", text: "No. The Twelve Traditions are governance, not theology. They bind A.A. groups and the Fellowship as a whole — not individual members, and not independent businesses or outside organisations. They were adopted in 1950 to keep A.A. from being owned, co-opted, or torn apart by disputes over money, property and authority. They are not a rulebook for a member's personal life." },
      },
      {
        "@type": "Question",
        name: `What does Tradition ${T} say?`,
        acceptedAnswer: { "@type": "Answer", text: `Tradition ${T}, short form: "${shortForm}" The long form (pages ${LONG_PAGES}) expands on it, warning that contributions carrying "any obligation whatever" are unwise, that public solicitation of funds using the A.A. name is "highly dangerous," and that nothing can so surely destroy A.A.'s spiritual heritage as "futile disputes over property, money, and authority."` },
      },
    ],
  },
];

const hubHtml = head({
  title: `Daily Traditions — One Reading a Day on A.A.'s 12 Traditions | Recovery Starts`,
  desc: `One reading a day on the Twelve Traditions of Alcoholics Anonymous. Each month takes one Tradition — ${monthCap} is Tradition ${T}. Grounded in the LONG FORM (pp. ${LONG_PAGES}), not the internet's version.`,
  url: SITE + "/daily-tradition/",
  ld: hubLd,
}) + `
      <nav class="dt-crumb"><a href="/">Home</a> / Daily Traditions</nav>
      <div class="dt-kicker">A reading a day</div>
      <h1 class="dt-title">Daily Traditions</h1>
      <p class="dt-date">Twelve months. Twelve Traditions. ${monthCap} is Tradition ${T}.</p>

      <!-- TODAY'S READING LEADS. Someone who lands here should be reading, not
           being lectured. The doctrine essay used to sit here; it now sits below,
           for the people who want it. JS swaps in the real date on load (into
           #dt-today-main only — Einstein keeps his seat); the server-rendered
           fallback is honestly labeled "Latest reading" because a static page
           cannot know what day the reader arrives. -->
      <section class="dt-today">
        <div id="dt-today-main">
        ${todayHeroHtml(featDays[0], false)}
        </div>
        <figure class="dt-today-fig" aria-hidden="true">
          <img src="/assets/einstein/traditions.webp" alt="" width="640" height="640" loading="lazy">
          <figcaption>Recovery Einstein · Daily Traditions</figcaption>
        </figure>
      </section>

      <div class="dt-months">${monthCardsFor(featMonth)}</div>

      <h2 class="dt-h2" style="max-width:980px;margin:0 auto 1rem;text-align:center">${monthCap} · Tradition ${T}</h2>
      <div class="dt-days">
        ${dayCards}
      </div>

      <div class="dt-tradition" style="margin-bottom:2.4rem">
        <h2>Tradition ${T} · Short form</h2>
        <blockquote>"${esc(shortForm)}"</blockquote>
        <div class="dt-longform"><strong>Short form: pp. ${SHORT_PAGES}. Long form: pp. ${LONG_PAGES}.</strong> If you only ever read one, read the long one.</div>
      </div>

      <div class="dt-intro">
        <h2 class="dt-h2">Why these exist</h2>
        <p>The Twelve Traditions were adopted in 1950 for one reason: to stop A.A. from being <strong>owned</strong>. Not owned by a benefactor, not by a treatment centre, not by whoever happened to be paying the rent. They are the Fellowship's constitution — written out of near-misses A.A. actually lived through.</p>
        <p>Most of what circulates online quotes only the short form (pp. ${SHORT_PAGES}) and quietly drops the rest. So we front-load <strong>the Long Form, pp. ${LONG_PAGES}</strong> — where the Traditions actually say what they mean. Tradition 3's clause that a group is A.A. only if "as a group, they have no other affiliation"? That exists <em>only</em> in the Long Form. It's the clause that says no treatment centre can own an A.A. group. It's also the clause the internet forgot.</p>
        <p>One more thing, because it gets blurred constantly: <strong>the Traditions are governance, not theology.</strong> They bind A.A. groups and the Fellowship — not individuals. They are not a rulebook for your personal life.</p>
        ${howMonthReads(featMonth, byMonth[featMonth])}
      </div>

      <div class="dt-chips">
        <a href="/12-traditions/">What the Traditions actually say →</a>
        <a href="/big-book/search/">Search the Big Book →</a>
        <a href="/big-book/pages/">The Big Book, page by page →</a>
        <a href="/daily-reflection/">Daily Reflection →</a>
      </div>

${DISC}
${HERO_JS}
  <script type="application/json" id="dt-data">${JSON.stringify(
    days.map((d) => ({
      day: d.day,
      slug: `${d.month}-${d.day}`,
      month: CAP(d.month),
      title: d.title,
      body: d.body,
      sitWith: d.sitWith,
      hypothetical: d.hypothetical,
      badge: badgeFor(d),
    }))
  ).replace(/</g, "\\u003c")}</script>
  <script>
    // Swap the hero to TODAY's reading. If this month isn't published yet, fall
    // back to the same day-number in the month that is — better a real reading
    // than an empty slot. Never invents a date it can't back up.
    (function () {
      try {
        var data = JSON.parse(document.getElementById("dt-data").textContent);
        var now = new Date();
        var monthNames = ${JSON.stringify(MONTHS.map(CAP))};
        var thisMonth = monthNames[now.getMonth()];
        var d = now.getDate();
        var live = data[0] && data[0].month;
        var pick = data.find(function (x) { return x.month === thisMonth && x.day === d; })
                || data.find(function (x) { return x.day === d; })
                || data[0];
        if (!pick) return;
        var host = document.getElementById("dt-today-main");
        if (!host) return;
        var isToday = pick.month === thisMonth && pick.day === d;
        host.innerHTML = window.__dtHero(pick, isToday);
      } catch (e) { /* the server-rendered reading stays. */ }
    })();
  </script>
  </div></section></main>
${FOOTER}
`;

// ── /daily-tradition/today/ — mirrors the daily-reflection redirect ─────────
const todayHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Today's Daily Tradition | Recovery Starts</title>
  <meta name="description" content="Read today's Daily Tradition — one reading a day on A.A.'s Twelve Traditions, grounded in the Long Form (pp. ${LONG_PAGES}).">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="${SITE}/daily-tradition/">
  <link rel="stylesheet" href="/style.css">
  <script>
    // Auto-redirect to today's reading. Falls back to the hub if that month
    // isn't published yet (only July / Tradition 7 is live today).
    var MONTHS = ${JSON.stringify(MONTHS)};
    var LIVE = ${JSON.stringify([...liveMonths])};
    var now = new Date();
    var month = MONTHS[now.getMonth()];
    var day = now.getDate();
    if (LIVE.indexOf(month) !== -1) {
      window.location.replace('/daily-tradition/' + month + '-' + day + '/');
    } else {
      window.location.replace('/daily-tradition/');
    }
  </script>
</head>
<body>
  <main><div class="container" style="padding:80px 20px;text-align:center">
    <p>Opening today's Tradition…</p>
    <p><a href="/daily-tradition/">Daily Traditions →</a></p>
  </div></main>
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "9c520169a3ab453b867424ab9b3b276b"}'></script>
</body>
</html>
`;

if (!DRY) {
  fs.mkdirSync(path.join(ROOT, "daily-tradition"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "daily-tradition", "index.html"), hubHtml);
  fs.mkdirSync(path.join(ROOT, "daily-tradition", "today"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "daily-tradition", "today", "index.html"), todayHtml);
}

console.log("Daily Traditions " + (DRY ? "(DRY RUN)" : "BUILT"));
console.log("  readings rendered : " + built.length);
console.log("  month / tradition : " + monthCap + " = Tradition " + T);
console.log("  scenario days     : " + built.filter((b) => b.hypothetical).length);
console.log("  incident days     : " + built.filter((b) => !b.hypothetical).length);
console.log("  unique titles     : " + seenTitles.size);
console.log("  unique metas      : " + seenDescs.size);
console.log("  page refs asserted: short " + SHORT_PAGES + " + LONG FORM " + LONG_PAGES + " on every page");
console.log("  hub               : /daily-tradition/");
console.log("  today redirect    : /daily-tradition/today/");
