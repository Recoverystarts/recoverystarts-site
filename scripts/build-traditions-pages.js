#!/usr/bin/env node
/**
 * build-traditions-pages.js — the Daily Traditions engine.
 *
 * Renders data/traditions-daily.json into:
 *   /daily-tradition/                 the hub (month = Tradition; July = Tradition 7)
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
};
const publishedFor = (month) => MONTH_PUBLISHED[month] || TODAY;

// ── Kind → badge. TWO SCHEMES, side by side. ────────────────────────────────
// July T7 and August T8 shipped on the odd/even scheme and are not retro-fitted.
// September T9 onward uses the five questions, run straight through.
// "hyp" styling marks the day that carries the hypothetical disclaimer.
const KIND_BADGE = {
  "hypothetical":          { label: "A hypothetical",        cls: "hyp" },
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
  const isFiveQ = kinds.has("the threat") || kinds.has("how it gets captured");
  if (isFiveQ) {
    return `<p><strong>How ${monthCap} reads.</strong> The month runs on five questions, straight through, over and over: <em>what specifically threatened A.A.</em> · <em>how the founders solved it before there was a Tradition</em> · <em>where that same danger lives now</em> · <em>how a group drifts off it on its own</em> · <em>how it gets hollowed out from outside</em>. Every five days tells the whole Tradition once, then comes back new — no incident, quote or image is used twice. The fourth question is the labelled hypothetical: an imagined group, never a real one, and never a rule we invented.</p>`;
  }
  return `<p><strong>How ${monthCap} reads.</strong> Odd days pose a hypothetical: <em>imagine a group did the thing the Tradition warns against — what follows?</em> Even days turn that harm over and find the reason the Tradition exists in the first place. Flip the wound and you get the healing. Every scenario is explicitly hypothetical — not a real group, and not a rule we invented.</p>`;
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

const STYLE = `  <style>
    .dt-bg { position: fixed; inset: 0; background: linear-gradient(150deg,#0b0b0f 0%,#191426 38%,#12203a 72%,#0b0b0f 100%); z-index:-1; }
    .dt-wrap { padding: clamp(2rem,5vw,4rem) 0 4rem; }
    .dt-crumb { text-align:center; font-size:0.78rem; color:var(--text-dim); margin-bottom:1.4rem; }
    .dt-crumb a { color: var(--text-muted); }
    .dt-kicker { color: var(--gold); letter-spacing: 2.5px; text-transform: uppercase; font-size: 0.75rem; font-weight: 700; text-align: center; }
    .dt-title { font-family: var(--font-display); color: var(--text); text-align: center; font-size: clamp(1.9rem,5.5vw,2.9rem); line-height: 1.12; margin: 10px 0 8px; }
    .dt-date { text-align:center; color: var(--text-muted); font-size: 0.92rem; margin-bottom: 0.6rem; }
    .dt-badge { display:inline-block; font-size:0.68rem; letter-spacing:1.6px; text-transform:uppercase; padding:5px 13px; border-radius:999px; margin-bottom: 1.8rem; }
    .dt-badge.hyp { background: rgba(180,120,60,0.12); border:1px solid rgba(200,140,70,0.4); color:#e0a868; }
    .dt-badge.earned { background: rgba(212,175,55,0.10); border:1px solid rgba(212,175,55,0.42); color: var(--gold); }
    .dt-center { text-align:center; }
    .dt-reading { max-width: 720px; margin: 0 auto; }
    .dt-reading p { color: var(--text); line-height: 1.95; font-size: 1.08rem; margin: 0 0 1.1rem; }
    .dt-reading em { color: var(--text-muted); }
    .dt-sit { max-width: 720px; margin: 2.2rem auto 0; background: var(--bg-card); border-left: 3px solid var(--gold); border-radius: var(--radius-sm); padding: 22px 26px; }
    .dt-sit .lbl { display:block; color: var(--gold); font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    .dt-sit p { margin: 0; color: var(--text); font-size: 1.05rem; line-height: 1.7; font-style: italic; }
    .dt-grounded { max-width: 720px; margin: 1rem auto 0; color: var(--text-dim); font-size: 0.84rem; text-align:center; }
    .dt-tradition { max-width: 720px; margin: 2.4rem auto 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 22px 26px; }
    .dt-tradition h2 { font-family: var(--font-display); color: var(--gold); font-size: 1rem; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 10px; }
    .dt-tradition blockquote { margin: 0 0 14px; color: var(--text); font-size: 1.05rem; line-height: 1.7; font-style: italic; }
    .dt-longform { border-top: 1px solid var(--border); margin-top: 14px; padding-top: 14px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; }
    .dt-longform strong { color: var(--gold); }
    .dt-hyp { max-width: 720px; margin: 2rem auto 0; border: 1px dashed rgba(200,140,70,0.42); border-radius: var(--radius-sm); padding: 16px 20px; color: #d8b088; font-size: 0.86rem; line-height: 1.65; text-align:center; }
    .dt-nav { display:flex; justify-content:space-between; gap:12px; max-width: 720px; margin: 2.6rem auto 0; }
    .dt-nav a { background: var(--bg-card); border:1px solid var(--border); color: var(--text); border-radius: var(--radius-sm); padding: 10px 18px; font-size:0.9rem; max-width:46%; transition: all .2s; }
    .dt-nav a:hover { border-color: var(--border-hover); color: var(--gold); }
    .dt-nav a small { display:block; color: var(--text-dim); font-size: 0.7rem; }
    .dt-chips { text-align:center; margin: 2rem auto 0; max-width: 720px; }
    .dt-chips a { display:inline-block; background: var(--bg-card); border:1px solid var(--border); color: var(--text-muted); border-radius:999px; padding:7px 16px; margin:4px; font-size:0.85rem; transition: all .2s; }
    .dt-chips a:hover { border-color: var(--border-hover); color: var(--gold); }
    .dt-cta { text-align:center; margin: 2.4rem auto 0; }
    .dt-disc { max-width: 720px; margin: 2.6rem auto 0; text-align:center; color: var(--text-dim); font-size: 0.78rem; line-height: 1.6; }
    .dt-disc a { color: var(--text-muted); text-decoration: underline; }
    /* hub — TODAY'S READING leads */
    .dt-today { max-width: 760px; margin: 0 auto 2.6rem; background: var(--bg-card); border: 1px solid var(--border-hover); border-radius: var(--radius); padding: 28px 30px; }
    .dt-today-head { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom: 10px; }
    .dt-today-lbl { color: var(--gold); font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
    .dt-today .dt-badge { margin-bottom: 0; }
    .dt-today-title { font-family: var(--font-display); font-size: clamp(1.4rem,3.4vw,1.9rem); line-height:1.2; margin: 0 0 14px; }
    .dt-today-title a { color: var(--text); }
    .dt-today-title a:hover { color: var(--gold); }
    .dt-today-body { color: var(--text); line-height: 1.9; font-size: 1.03rem; margin: 0 0 1.2rem; }
    .dt-today-body em { color: var(--text-muted); }
    .dt-today-sit { border-left: 3px solid var(--gold); padding: 4px 0 4px 16px; margin-bottom: 1.4rem; }
    .dt-today-sit .lbl { display:block; color: var(--gold); font-size: 0.66rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
    .dt-today-sit p { margin: 0; color: var(--text); font-style: italic; line-height: 1.65; }
    .dt-today-actions { display:flex; flex-wrap:wrap; gap: 10px; }
    .dt-today-actions .btn { font-size: 0.9rem; }
    .dt-h2 { font-family: var(--font-display); color: var(--gold); font-size: 1.2rem; margin: 0 0 0.9rem; }
    .dt-cta { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
    /* hub */
    .dt-intro { max-width: 760px; margin: 0 auto 2rem; }
    .dt-intro p { color: var(--text-muted); line-height: 1.9; margin: 0 0 1rem; }
    .dt-intro strong { color: var(--text); }
    .dt-months { display:grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap:10px; max-width: 900px; margin: 0 auto 2.6rem; }
    .dt-month { background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; text-align:center; }
    .dt-month.live { border-color: rgba(212,175,55,0.5); }
    .dt-month .m { display:block; color: var(--text); font-size:0.95rem; }
    .dt-month .t { display:block; color: var(--text-dim); font-size:0.72rem; letter-spacing:1px; text-transform:uppercase; margin-top:3px; }
    .dt-month.live .t { color: var(--gold); }
    .dt-month.soon { opacity:0.45; }
    .dt-days { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px; max-width: 980px; margin: 0 auto; }
    /* Anchor targets sit under the fixed header without it — leave room. */
    .dt-days[id], .dt-h2[id] { scroll-margin-top: 96px; }
    html { scroll-behavior: smooth; }
    .dt-day { display:block; background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 18px; transition: all .2s; }
    .dt-day:hover { border-color: var(--gold); transform: translateY(-2px); }
    .dt-day .d { color: var(--gold); font-size:0.72rem; letter-spacing:1.4px; text-transform:uppercase; font-weight:700; }
    .dt-day .t { display:block; color: var(--text); margin-top:4px; font-size:1rem; line-height:1.4; }
    .dt-day .k { display:block; color: var(--text-dim); font-size:0.72rem; margin-top:6px; font-style:italic; }
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
  <div class="dt-bg"></div>
  <a href="#main" class="skip-link">Skip to content</a>
${NAV}
  <main id="main"><section class="dt-wrap"><div class="container">`;
}

// MANDATORY on every day page — the scenarios are illustrative, never reportage.
const HYP_NOTE = `      <p class="dt-hyp"><strong>This is a hypothetical.</strong> The situation described above is illustrative — an imagined scenario used to think a Tradition through. It is not a real group, not a report of anything that happened, and not a rule we invented. The Traditions belong to A.A.; we're only reading them plainly.</p>`;

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
      { "@type": "ListItem", position: 3, name: `${monthCap} ${d.day}: ${d.title}`, item: url },
    ],
  };

  const badge = badgeFor(d);

  const prevLink = prev
    ? `<a href="/daily-tradition/${prev.month}-${prev.day}/"><small>← ${CAP(prev.month)} ${prev.day}</small>${esc(prev.title)}</a>`
    : `<a href="/daily-tradition/"><small>←</small>All of ${monthCap}</a>`;
  const nextLink = next
    ? `<a href="/daily-tradition/${next.month}-${next.day}/" style="text-align:right"><small>${CAP(next.month)} ${next.day} →</small>${esc(next.title)}</a>`
    : `<a href="/daily-tradition/" style="text-align:right"><small>→</small>All of ${monthCap}</a>`;

  const html = head({ title, desc, url, ld: [articleLd, crumbLd] }) + `
      <nav class="dt-crumb"><a href="/">Home</a> / <a href="/daily-tradition/">Daily Traditions</a> / ${monthCap} ${d.day}</nav>
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

${d.hypothetical ? HYP_NOTE : ""}

${traditionBlock(d.tradition, shortForm)}

      <div class="dt-chips">
        <a href="/12-traditions/">What the Traditions actually say →</a>
        <a href="/big-book/page-563/">The Long Form, p. 563 →</a>
        <a href="/big-book/search/">Search the Big Book →</a>
        <a href="/daily-tradition/">Every day this month →</a>
      </div>

      <div class="dt-cta">
        <a href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${slug}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about Tradition ${d.tradition} →</a>
        <a href="/download/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${slug}" class="btn btn-outline">Get the app →</a>
      </div>

      <div class="dt-nav">
        ${prevLink}
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
  if (d.hypothetical && html.indexOf("This is a hypothetical.") === -1) throw new Error("Missing hypothetical disclaimer on " + slug);
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

const monthCards = MONTHS.map((m, i) => {
  const n = i + 1;
  const live = liveMonths.has(m);
  return live
    // Live months jump to their own section ON THIS PAGE. This used to point at
    // "/daily-tradition/" — the page you are already on — so clicking August or
    // September just reloaded the hub and dumped you back at the top.
    ? `<a class="dt-month live" href="#month-${m}"><span class="m">${CAP(m)}</span><span class="t">Tradition ${n} · live</span></a>`
    : `<div class="dt-month soon"><span class="m">${CAP(m)}</span><span class="t">Tradition ${n}</span></div>`;
}).join("");

const cardHtml = (b) =>
  `<a class="dt-day" href="/daily-tradition/${b.slug}/">
          <span class="d">${CAP(b.month)} ${b.day}</span>
          <span class="t">${esc(b.dTitle)}</span>
          <span class="k">${esc(b.kindLabel)}</span>
        </a>`;
const dayCards = built.filter((b) => b.month === featMonth).map(cardHtml).join("\n        ");
// Other published months — linked for readers and crawlers, below the featured
// month. This is how a pre-published month (e.g. August in July) stays reachable.
const otherMonths = MONTHS.filter((m) => liveMonths.has(m) && m !== featMonth);
const otherSections = otherMonths.map((m) => {
  const t = byMonth[m][0].tradition;
  const cards = built.filter((b) => b.month === m).map(cardHtml).join("\n        ");
  return `      <h2 class="dt-h2" id="month-${m}" style="max-width:980px;margin:2.6rem auto 1rem;text-align:center">${CAP(m)} · Tradition ${t}</h2>
      <div class="dt-days">
        ${cards}
      </div>`;
}).join("\n");

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
           for the people who want it. JS swaps in the real date on load; the
           server-rendered fallback below is a real reading either way. -->
      <section id="dt-today" class="dt-today">
        ${todayHeroHtml(featDays[0])}
      </section>

      <div class="dt-days" id="month-${featMonth}">
        ${dayCards}
      </div>

      <div class="dt-months">${monthCards}</div>

${otherSections}

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
        var host = document.getElementById("dt-today");
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
console.log("  hypothetical days : " + built.filter((b) => b.hypothetical).length + " (all carry the disclaimer — asserted)");
console.log("  earned-answer days: " + built.filter((b) => !b.hypothetical).length);
console.log("  unique titles     : " + seenTitles.size);
console.log("  unique metas      : " + seenDescs.size);
console.log("  page refs asserted: short " + SHORT_PAGES + " + LONG FORM " + LONG_PAGES + " on every page");
console.log("  hub               : /daily-tradition/");
console.log("  today redirect    : /daily-tradition/today/");
