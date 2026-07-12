#!/usr/bin/env node
/**
 * build-bigbook-pages.js — the Big Book Page Library.
 *
 * Generates one landing page per Big Book page from bigbook/search-index.json,
 * plus a browsable hub at /big-book/pages/.
 *
 * ── THE COPYRIGHT GUARDRAIL (read before editing) ───────────────────────────
 * The 4th edition of Alcoholics Anonymous is under active AAWS copyright.
 * This script NEVER renders a page's full text. It reads the text only to
 * DERIVE a short attributed excerpt (hard-capped) and a set of themes.
 * assertQuoteCap() enforces the cap at build time and THROWS if violated.
 * If you find yourself removing that assertion, stop and re-read
 * D:\Forge\work-orders\WO-bigbook-page-library.md.
 *
 * Every factual claim on a generated page comes from exactly two places:
 *   1. bigbook/search-index.json          (label -> section -> text)
 *   2. assets/bigbook/bigBookKnowledge.js (chapters, steps, special refs)
 * Nothing is inferred, rounded, or remembered. A wrong page number is the one
 * failure mode this product cannot have.
 *
 * Usage: node scripts/build-bigbook-pages.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";
const TODAY = "2026-07-12";
const DRY = process.argv.includes("--dry");

// ── Hard limits (the guardrail) ─────────────────────────────────────────────
const EXCERPT_MAX = 300;   // chars of quoted book text we will render
const QUOTE_CAP   = 340;   // absolute assertion ceiling; build throws above this

// Curated pages we must never clobber — a human wrote these and they're better.
const CURATED = new Set(["83"]);

// Pages with too little text to justify a page (blank versos, dividers).
const MIN_TEXT = 200;

// ── Knowledge layer (mirrors assets/bigbook/bigBookKnowledge.js) ────────────
const CHAPTERS = [
  { number: 0,  title: "The Doctor's Opinion",   startPage: -8,  endPage: -1, romanStart: "xxv", romanEnd: "xxxii" },
  { number: 1,  title: "Bill's Story",           startPage: 1,   endPage: 16 },
  { number: 2,  title: "There Is a Solution",    startPage: 17,  endPage: 29 },
  { number: 3,  title: "More About Alcoholism",  startPage: 30,  endPage: 43 },
  { number: 4,  title: "We Agnostics",           startPage: 44,  endPage: 57 },
  { number: 5,  title: "How It Works",           startPage: 58,  endPage: 71 },
  { number: 6,  title: "Into Action",            startPage: 72,  endPage: 88 },
  { number: 7,  title: "Working With Others",    startPage: 89,  endPage: 103 },
  { number: 8,  title: "To Wives",               startPage: 104, endPage: 121 },
  { number: 9,  title: "The Family Afterward",   startPage: 122, endPage: 135 },
  { number: 10, title: "To Employers",           startPage: 136, endPage: 150 },
  { number: 11, title: "A Vision For You",       startPage: 151, endPage: 164 },
];

// Which Steps the book works through in which page range (from STEP_REFERENCES).
const STEP_RANGES = [
  { steps: [1],               from: 1,  to: 43,  label: "Step 1" },
  { steps: [2],               from: 44, to: 57,  label: "Step 2" },
  { steps: [3, 4],            from: 58, to: 71,  label: "Steps 3 and 4" },
  { steps: [5,6,7,8,9,10,11], from: 72, to: 88,  label: "Steps 5 through 11" },
  { steps: [12],              from: 89, to: 103, label: "Step 12" },
];

// Named landmarks, with the exact page ranges from the knowledge layer.
const SPECIAL = [
  { name: "How It Works (the Step reading)",     from: 59,  to: 60  },
  { name: "the Third Step Prayer",               from: 63,  to: 63  },
  { name: "the Seventh Step Prayer",             from: 76,  to: 76  },
  { name: "the Ninth Step Promises",             from: 83,  to: 84  },
  { name: "the Twelve Traditions - short form",  from: 561, to: 562 },
  { name: "the Twelve Traditions - LONG FORM",   from: 563, to: 566 },
  { name: "Spiritual Experience (Appendix II)",  from: 567, to: 568 },
];

// Themes are DERIVED from the page's own text — never asserted from memory.
const THEMES = [
  ["resentment",               /\bresent(ment|ments|ful)?\b/i],
  ["fear",                     /\bfear(s|ful)?\b/i],
  ["inventory",                /\binventor(y|ies)\b/i],
  ["amends",                   /\bamends?\b/i],
  ["prayer",                   /\bpray(er|ers|ing)?\b/i],
  ["meditation",               /\bmeditat(e|ion)\b/i],
  ["powerlessness",            /\bpowerless(ness)?\b/i],
  ["surrender",                /\bsurrender(ed|ing)?\b/i],
  ["honesty",                  /\bhonest(y|ly)?\b/i],
  ["willingness",              /\bwilling(ness)?\b/i],
  ["self-will",                /\bself-?will\b/i],
  ["selfishness",              /\bselfish(ness)?\b/i],
  ["sponsorship",              /\bsponsor(ship|s)?\b/i],
  ["the spiritual experience", /\bspiritual (experience|awakening)\b/i],
  ["a higher power",           /\b(higher power|power greater)\b/i],
  ["acceptance",               /\bacceptance\b/i],
  ["serenity",                 /\bserenity\b/i],
  ["obsession",                /\bobsession\b/i],
  ["the allergy",              /\ballerg(y|ic)\b/i],
  ["family",                   /\b(wife|husband|family|children)\b/i],
  ["employment",               /\b(employer|employee|business)\b/i],
  ["carrying the message",     /\b(carry the message|work with others)\b/i],
  ["the daily reprieve",       /\bdaily reprieve\b/i],
  ["the Traditions",           /\btradition(s)?\b/i],
  ["anonymity",                /\banonym(ity|ous)\b/i],
];

// ── Text hygiene ────────────────────────────────────────────────────────────
// PDF extraction leaves ligatures, hard line-breaks and hyphenated line-splits.
function normalize(t) {
  return (t || "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/’/g, "'").replace(/‘/g, "'")
    .replace(/“/g, '"').replace(/”/g, '"')
    .replace(/-\n/g, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }

/**
 * THE GUARDRAIL. Every string of book text that reaches the HTML passes here.
 * Throws — loudly, at build time — rather than quietly shipping a violation.
 */
function assertQuoteCap(quote, label) {
  if (quote.length > QUOTE_CAP) {
    throw new Error(
      "COPYRIGHT GUARDRAIL TRIPPED on page " + label + ": quote is " + quote.length +
      " chars (cap " + QUOTE_CAP + "). This script must never render full page text."
    );
  }
  return quote;
}

/** Pull the first clean, complete, quotable sentence(s) — capped.
 *
 * ADJACENCY IS LOAD-BEARING. An earlier version filtered the sentence list
 * (capital-initial, >=40 chars) and then joined the SURVIVORS — which could
 * stitch sentence #2 onto sentence #5 and produce a "quote" that appears
 * nowhere on the page. 152 pages failed the verbatim check because of it.
 * We now pick a starting sentence and only ever extend with the sentence that
 * literally follows it, so the result is always a contiguous substring of the
 * page. Do not "optimise" this back into a filter+join.
 */
function makeExcerpt(text, label) {
  const t = normalize(text);

  // Sentence spans, WITH their offsets in `t`. Trailing quotes/brackets stay
  // attached to their sentence (`resign."` must not split into `resign.` + `"`).
  const rx = /[^.!?]+[.!?]+["'”’)\]]*/g;
  const sents = [];
  let m;
  while ((m = rx.exec(t)) !== null) {
    const raw = m[0];
    const lead = raw.length - raw.replace(/^\s+/, "").length;
    sents.push({ start: m.index + lead, end: m.index + raw.length, text: raw.trim() });
  }

  const i = sents.findIndex((s) => /^["'(]?[A-Z]/.test(s.text) && s.text.length >= 40);

  let quote, partial = false;
  if (i !== -1) {
    const from = sents[i].start;
    let to = sents[i].end;
    for (let j = i + 1; j < sents.length; j++) {
      if (to - from >= 140) break;                  // one strong sentence is plenty
      if (sents[j].end - from > EXCERPT_MAX) break; // whole sentences only
      to = sents[j].end;
    }
    quote = t.slice(from, to).trim();               // SLICED, never re-joined
    if (quote.length > EXCERPT_MAX) {               // a single monster sentence
      quote = quote.slice(0, EXCERPT_MAX);
      quote = quote.slice(0, quote.lastIndexOf(" ")).trim();
      partial = true;
    }
  } else {
    // No capital-initial sentence on this page (rare). Take a leading slice.
    quote = t.slice(0, 180);
    quote = quote.slice(0, quote.lastIndexOf(" ")).trim();
    partial = true;
  }

  // THE INVARIANT: the quote must be a literal substring of this page's text.
  // Enforced here, in the generator, so a bad quote can never reach the disk.
  if (t.indexOf(quote) === -1) {
    throw new Error("VERBATIM INVARIANT BROKEN on page " + label + ": the quote is not a substring of the page text.");
  }

  assertQuoteCap(quote, label);
  return { quote: quote, partial: partial };
}

// ── Page classification ─────────────────────────────────────────────────────
const ROMAN_ORDER = ["i","ii","iii","iv","v","vi","vii","viii","ix","x","xi","xii","xiii","xiv","xv","xvi","xvii","xviii","xix","xx","xxi","xxii","xxiii","xxiv","xxv","xxvi","xxvii","xxviii","xxix","xxx","xxxi","xxxii"];
const isRoman = (l) => /^[ivxlc]+$/i.test(String(l));
const pageNum = (l) => (isRoman(l) ? null : parseInt(l, 10));

function chapterFor(label) {
  const n = pageNum(label);
  if (n === null) {
    const i = ROMAN_ORDER.indexOf(String(label).toLowerCase());
    const dr = ROMAN_ORDER.indexOf("xxv");
    return i >= dr ? CHAPTERS[0] : null;   // The Doctor's Opinion = xxv-xxxii
  }
  return CHAPTERS.find((c) => c.startPage > 0 && n >= c.startPage && n <= c.endPage) || null;
}

function specialFor(label) {
  const n = pageNum(label);
  if (n === null) return [];
  return SPECIAL.filter((s) => n >= s.from && n <= s.to);
}

function stepsFor(label) {
  const n = pageNum(label);
  if (n === null) return null;
  return STEP_RANGES.find((s) => n >= s.from && n <= s.to) || null;
}

function themesFor(text) {
  const t = normalize(text);
  return THEMES.filter((pair) => pair[1].test(t)).map((pair) => pair[0]).slice(0, 4);
}

/** The short topic used in <title>. Derived, never invented. */
function topicFor(entry) {
  const sp = specialFor(entry.l);
  if (sp.length) {
    return sp[0].name
      .replace(/^the /, "")
      .replace(/ \(the Step reading\)/, "")
      .replace(/^Spiritual Experience.*/, "Spiritual Experience");
  }
  const ch = chapterFor(entry.l);
  if (ch) return ch.title;
  return String(entry.s).replace(/^Chapter \d+ - /, "").replace(/^Chapter \d+ – /, "");
}

function chapterRangeText(ch) {
  if (!ch) return null;
  if (ch.startPage < 0) return "pages " + ch.romanStart + "–" + ch.romanEnd;
  return "pages " + ch.startPage + "–" + ch.endPage;
}

// ── Shared chrome (mirrors big-book/page-83/index.html) ─────────────────────
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
      <li><a href="/about/">About</a></li>
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
    .cp-bg { position: fixed; inset: 0; background: linear-gradient(135deg,#0b0b0f 0%,#1a1a2e 40%,#16213e 70%,#0b0b0f 100%); z-index:-1; }
    .cp-wrap { padding: clamp(2rem,5vw,4rem) 0 4rem; }
    .cp-crumb { text-align:center; font-size:0.78rem; color:var(--text-dim); margin-bottom:1.2rem; }
    .cp-crumb a { color: var(--text-muted); }
    .cp-kicker { color: var(--gold); letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; font-weight: 700; text-align: center; }
    .cp-title { font-family: var(--font-display); color: var(--text); text-align: center; font-size: clamp(1.8rem,5vw,2.6rem); line-height: 1.15; margin: 8px 0 6px; }
    .cp-sub { text-align: center; color: var(--text-muted); font-style: italic; margin-bottom: 2.2rem; }
    .cp-body { max-width: 760px; margin: 0 auto; }
    .cp-body h2 { font-family: var(--font-display); color: var(--gold); font-size: 1.15rem; margin: 2rem 0 0.8rem; }
    .cp-body p { color: var(--text); line-height: 1.8; margin: 0 0 1rem; }
    .bb-quote { max-width: 760px; margin: 0 auto 1.6rem; background: var(--bg-card); border-left: 3px solid var(--gold); border-radius: var(--radius-sm); padding: 22px 26px; }
    .bb-quote blockquote { margin: 0; color: var(--text); font-size: 1.08rem; line-height: 1.75; font-style: italic; }
    .bb-quote cite { display: block; margin-top: 12px; font-style: normal; color: var(--text-dim); font-size: 0.78rem; line-height:1.6; }
    .bb-quote cite a { color: var(--gold); }
    .bb-facts { max-width: 760px; margin: 0 auto 1.6rem; display: grid; grid-template-columns: repeat(auto-fit,minmax(170px,1fr)); gap: 10px; }
    .bb-fact { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; }
    .bb-fact .k { display:block; color: var(--text-dim); font-size: 0.66rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
    .bb-fact .v { color: var(--text); font-size: 0.95rem; line-height:1.4; }
    .bb-fact .v a { color: var(--gold); }
    .bb-chips { text-align:center; margin: 1.6rem auto 0; max-width: 760px; }
    .bb-chips a { display:inline-block; background: var(--bg-card); border:1px solid var(--border); color: var(--text-muted); border-radius: 999px; padding: 7px 16px; margin: 4px; font-size: 0.85rem; transition: all .2s; }
    .bb-chips a:hover { border-color: var(--border-hover); color: var(--gold); }
    .cp-cta { text-align: center; margin: 2.4rem auto 0; }
    .cp-nav { display: flex; justify-content: space-between; align-items: center; gap: 12px; max-width: 760px; margin: 2.6rem auto 0; }
    .cp-nav a { background: var(--bg-card); border: 1px solid var(--border); color: var(--text); border-radius: var(--radius-sm); padding: 10px 18px; font-size: 0.9rem; transition: all 0.2s; max-width: 45%; }
    .cp-nav a:hover { border-color: var(--border-hover); color: var(--gold); }
    .cp-nav a small { display:block; color: var(--text-dim); font-size: 0.7rem; }
    .cp-disclaimer { max-width: 760px; margin: 2.6rem auto 0; text-align: center; color: var(--text-dim); font-size: 0.78rem; line-height: 1.6; }
    .cp-disclaimer a { color: var(--text-muted); text-decoration: underline; }
  </style>`;

function head(o) {
  const ldBlocks = o.ld.map(function (x) {
    return "  <script type=\"application/ld+json\">\n  " + JSON.stringify(x) + "\n  </script>";
  }).join("\n");
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
${o.extraStyle || STYLE}
</head>
<body>
  <div class="cp-bg"></div>
  <a href="#main" class="skip-link">Skip to content</a>
${NAV}
  <main id="main"><section class="cp-wrap"><div class="container">`;
}

const DISCLAIMER = `      <p class="cp-disclaimer">This is an independent Big Book reference page from Recovery Starts — not official AA literature, not affiliated with Alcoholics Anonymous World Services, and not medical advice. Page references are to <em>Alcoholics Anonymous</em> (the Big Book), 4th Edition. Short quotations appear for identification and study; <strong>the full text of the book is not reproduced here</strong> — <a href="/big-book/">get your own copy</a>. If you're in crisis, call or text 988 (Suicide &amp; Crisis Lifeline).</p>`;

// ── Build ───────────────────────────────────────────────────────────────────
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, "bigbook", "search-index.json"), "utf8"));

const pages = idx
  .map((e, i) => Object.assign({}, e, { order: i }))
  .filter((e) => normalize(e.t).length >= MIN_TEXT);

const skipped = idx.filter((e) => normalize(e.t).length < MIN_TEXT).map((e) => e.l);

const built = [];
const titles = new Map();
const descs = new Map();
let maxQuoteSeen = 0;

for (let i = 0; i < pages.length; i++) {
  const e = pages[i];
  const label = String(e.l);
  const displayLabel = isRoman(label) ? label.toLowerCase() : label;
  const slug = "page-" + displayLabel;
  const url = SITE + "/big-book/" + slug + "/";

  if (CURATED.has(label)) continue;   // never clobber a hand-written page

  const prev = pages[i - 1];
  const next = pages[i + 1];

  const ex = makeExcerpt(e.t, label);
  const excerpt = ex.quote;
  // Ellipses live OUTSIDE the quotation marks, so the quoted string itself
  // stays a clean verbatim substring of the page.
  const openEll = ex.partial ? "… " : "";
  const closeEll = ex.partial ? " …" : "";
  maxQuoteSeen = Math.max(maxQuoteSeen, excerpt.length);

  const ch = chapterFor(label);
  const sp = specialFor(label);
  const st = stepsFor(label);
  const themes = themesFor(e.t);
  const topic = topicFor(e);

  const title = "Big Book Page " + displayLabel + " — " + topic + " | Alcoholics Anonymous 4th Edition";

  const descBits = ["Page " + displayLabel + " of the Big Book (Alcoholics Anonymous, 4th Edition) sits in " + e.s + "."];
  if (sp.length) descBits.push("It carries " + sp.map((s) => s.name).join(" and ") + ".");
  else if (themes.length) descBits.push("It turns on " + themes.slice(0, 3).join(", ") + ".");
  descBits.push("See what's on the page, then search the book free.");
  const desc = descBits.join(" ").slice(0, 250);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Big Book Page " + displayLabel + " — " + topic,
    description: desc,
    author: { "@type": "Organization", name: "Recovery Starts", url: SITE },
    publisher: { "@type": "Organization", name: "Recovery Starts", logo: { "@type": "ImageObject", url: SITE + "/assets/einstein-character.png" } },
    image: SITE + "/assets/einstein-character.png",
    datePublished: TODAY,
    dateModified: TODAY,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
    about: { "@type": "Book", name: "Alcoholics Anonymous (The Big Book), 4th Edition", bookEdition: "4th Edition" },
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "The Big Book", item: SITE + "/big-book/" },
      { "@type": "ListItem", position: 3, name: "Page by Page", item: SITE + "/big-book/pages/" },
      { "@type": "ListItem", position: 4, name: "Page " + displayLabel, item: url },
    ],
  };

  const facts = [];
  facts.push('<div class="bb-fact"><span class="k">Page</span><span class="v">' + esc(displayLabel) + "</span></div>");
  facts.push('<div class="bb-fact"><span class="k">Section</span><span class="v">' + esc(e.s) + "</span></div>");
  if (ch) facts.push('<div class="bb-fact"><span class="k">Chapter runs</span><span class="v">' + esc(chapterRangeText(ch)) + "</span></div>");
  if (st) facts.push('<div class="bb-fact"><span class="k">Step material</span><span class="v"><a href="/steps/">' + esc(st.label) + "</a></span></div>");

  const notable = sp.map((s) => {
    const range = s.from === s.to ? "page " + s.from : "pages " + s.from + "–" + s.to;
    return "<p><strong>What's notable here:</strong> this page falls inside <strong>" + esc(s.name) + "</strong> (" + range + " in the 4th Edition).</p>";
  });

  let context;
  if (ch) {
    const chName = ch.number === 0 ? ch.title : "Chapter " + ch.number + ", " + ch.title;
    context = "<p>Page " + esc(displayLabel) + " sits in <strong>" + esc(chName) + "</strong>, which runs " + esc(chapterRangeText(ch)) + "."
      + (st ? " That's the stretch of the book where <a href=\"/steps/\">" + esc(st.label) + "</a> " + (st.steps.length > 1 ? "are" : "is") + " worked through." : "")
      + "</p>";
  } else {
    context = "<p>Page " + esc(displayLabel) + " sits in <strong>" + esc(e.s) + "</strong>. "
      + (String(e.s).indexOf("Personal Stories") === 0
        ? "The personal stories are the back half of the Big Book — members telling it in their own words. For a lot of people that's where the book finally lands."
        : "Read the surrounding pages in your own copy to get the run of the argument.")
      + "</p>";
  }

  const themeLine = themes.length
    ? "<p>Reading the page itself, the language here turns on " + themes.map((t) => "<strong>" + esc(t) + "</strong>").join(", ") + ". That's taken from the page's own words — not from anybody's summary of them.</p>"
    : "";

  const prevLink = prev
    ? '<a href="/big-book/page-' + String(prev.l).toLowerCase() + '/"><small>← Previous</small>Page ' + esc(String(prev.l).toLowerCase()) + "</a>"
    : '<a href="/big-book/pages/"><small>←</small>All pages</a>';
  const nextLink = next
    ? '<a href="/big-book/page-' + String(next.l).toLowerCase() + '/" style="text-align:right"><small>Next →</small>Page ' + esc(String(next.l).toLowerCase()) + "</a>"
    : '<a href="/big-book/pages/" style="text-align:right"><small>→</small>All pages</a>';

  const searchQ = encodeURIComponent(sp.length ? sp[0].name.replace(/^the /, "") : (themes[0] || topic));

  const html = head({ title: title, desc: desc, url: url, ld: [articleLd, crumbLd] }) + `
      <nav class="cp-crumb"><a href="/">Home</a> / <a href="/big-book/">Big Book</a> / <a href="/big-book/pages/">Page by page</a> / Page ${esc(displayLabel)}</nav>
      <div class="cp-kicker">Alcoholics Anonymous · 4th Edition</div>
      <h1 class="cp-title">Big Book Page ${esc(displayLabel)}</h1>
      <p class="cp-sub">${esc(e.s)}${ch ? " · " + esc(chapterRangeText(ch)) : ""}</p>

      <div class="bb-quote">
        <blockquote>${openEll}"${esc(excerpt)}"${closeEll}</blockquote>
        <cite>— <em>Alcoholics Anonymous</em>, 4th Edition, page ${esc(displayLabel)}. A short quotation, for identification and study. <a href="/big-book/">Read the whole page in your own copy →</a></cite>
      </div>

      <div class="bb-facts">
${facts.join("\n")}
      </div>

      <div class="cp-body">
        <h2>What's on page ${esc(displayLabel)}</h2>
        ${context}
        ${notable.join("\n        ")}
        ${themeLine}
        <h2>Read it for yourself</h2>
        <p>We don't reproduce the Big Book here. The book belongs to Alcoholics Anonymous — and honestly, the book is better than any summary of it. <a href="/big-book/">Buy a copy from A.A., read it free at aa.org, or pick one up at a meeting.</a> Then come back and <a href="/big-book/search/">search it</a> when you're chasing a line you only half-remember.</p>
      </div>

      <div class="bb-chips">
        <a href="/big-book/search/">Search the Big Book →</a>
        <a href="/big-book/">Get a copy →</a>
        <a href="/big-book/pages/">Every page →</a>
      </div>

      <div class="cp-cta"><a href="https://app.recoverystarts.com/?utm_source=recoverystarts&utm_medium=site&utm_campaign=bigbook-pages&utm_content=${slug}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about page ${esc(displayLabel)} →</a></div>

      <div class="cp-nav">
        ${prevLink}
        ${nextLink}
      </div>

${DISCLAIMER}
  </div></section></main>
${FOOTER}
`;

  if (titles.has(title)) throw new Error('DUPLICATE TITLE: "' + title + '" on ' + label + " and " + titles.get(title));
  if (descs.has(desc)) throw new Error("DUPLICATE META: page " + label + " matches " + descs.get(desc));
  titles.set(title, label);
  descs.set(desc, label);

  built.push({ label: label, slug: slug, url: url, title: title, desc: desc, section: e.s, order: e.order });

  if (!DRY) {
    const dir = path.join(ROOT, "big-book", slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
}

// ── The hub: /big-book/pages/ ───────────────────────────────────────────────
const bySection = new Map();
for (const p of built) {
  if (!bySection.has(p.section)) bySection.set(p.section, []);
  bySection.get(p.section).push(p);
}
// page-83 is curated, but it must still appear in the library.
const p83 = idx.find((e) => String(e.l) === "83");
if (p83) {
  const arr = bySection.get(p83.s) || [];
  arr.push({ label: "83", slug: "page-83", section: p83.s, order: idx.indexOf(p83), curated: true });
  arr.sort((a, b) => a.order - b.order);
  bySection.set(p83.s, arr);
}

const sectionOrder = [...new Set(idx.map((e) => e.s))].filter((s) => bySection.has(s));
const totalLinked = [...bySection.values()].reduce((n, a) => n + a.length, 0);
const anchorOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const hubLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Big Book, Page by Page",
    description: "A reference index to every page of Alcoholics Anonymous, 4th Edition — what each page covers, which chapter it belongs to, and where to read it.",
    url: SITE + "/big-book/pages/",
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
    about: { "@type": "Book", name: "Alcoholics Anonymous (The Big Book), 4th Edition", bookEdition: "4th Edition" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "The Big Book", item: SITE + "/big-book/" },
      { "@type": "ListItem", position: 3, name: "Page by Page", item: SITE + "/big-book/pages/" },
    ],
  },
];

const HUB_STYLE = STYLE.replace("</style>", `
    .lib-intro { max-width: 760px; margin: 0 auto 1.8rem; }
    .lib-intro p { color: var(--text-muted); line-height: 1.85; margin: 0 0 0.9rem; }
    .lib-intro strong { color: var(--text); }
    .lib-intro em { color: var(--gold); font-style: normal; }
    .lib-search { text-align:center; margin: 0 auto 2.4rem; }
    .lib-search .btn { margin: 5px; }
    .lib-jump { display:flex; flex-wrap:wrap; justify-content:center; gap:5px; max-width: 900px; margin: 0 auto 2.5rem; padding: 14px; background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius-sm); }
    .lib-jump a { font-size: 0.75rem; color: var(--text-muted); padding: 4px 9px; border-radius: 999px; }
    .lib-jump a:hover { color: var(--gold); background: rgba(212,175,55,0.08); }
    .lib-sec { max-width: 900px; margin: 0 auto 2.2rem; scroll-margin-top: 90px; }
    .lib-sec h2 { font-family: var(--font-display); color: var(--gold); font-size: 1.08rem; margin: 0 0 0.8rem; display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
    .lib-count { color: var(--text-dim); font-size: 0.7rem; letter-spacing:1px; text-transform:uppercase; }
    .lib-grid { display:flex; flex-wrap:wrap; gap:6px; }
    .lib-grid a { display:inline-flex; align-items:center; justify-content:center; min-width: 48px; padding: 9px 11px; background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.85rem; font-variant-numeric: tabular-nums; transition: all .15s; }
    .lib-grid a:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-1px); }
    .lib-grid a.curated { border-color: rgba(212,175,55,0.55); color: var(--gold); }
  </style>`);

const hubSections = sectionOrder.map((s) => {
  const arr = bySection.get(s);
  const chips = arr.map((p) =>
    '<a href="/big-book/' + p.slug + '/"' + (p.curated ? ' class="curated" title="Hand-written study page"' : "") + ">" + esc(String(p.label).toLowerCase()) + "</a>"
  ).join("");
  return '      <section class="lib-sec" id="' + anchorOf(s) + '">\n'
    + "        <h2>" + esc(s) + ' <span class="lib-count">' + arr.length + " " + (arr.length === 1 ? "page" : "pages") + "</span></h2>\n"
    + '        <div class="lib-grid">' + chips + "</div>\n"
    + "      </section>";
}).join("\n");

const jump = sectionOrder.map((s) =>
  '<a href="#' + anchorOf(s) + '">' + esc(s.replace(/^Chapter (\d+) – /, "$1. ").replace(/^Personal Stories – /, "Stories: ")) + "</a>"
).join("");

const hubHtml = head({
  title: "The Big Book, Page by Page — Every Page of Alcoholics Anonymous (4th Edition)",
  desc: "A reference index to every page of the Big Book. What's on page 64, page 83, page 417 — the chapter it sits in, what it turns on, and where to read the real thing. " + totalLinked + " pages.",
  url: SITE + "/big-book/pages/",
  ld: hubLd,
  extraStyle: HUB_STYLE,
}) + `
      <nav class="cp-crumb"><a href="/">Home</a> / <a href="/big-book/">Big Book</a> / Page by page</nav>
      <div class="cp-kicker">The Reference Library</div>
      <h1 class="cp-title">The Big Book, Page by Page</h1>
      <p class="cp-sub">Every page of Alcoholics Anonymous, 4th Edition — what's on it, where it sits, how to find it again.</p>

      <div class="lib-intro">
        <p>People look for Big Book pages the way they look for a half-remembered face. <em>"Page 64."</em> <em>"The one with the promises."</em> <em>"417 — acceptance."</em> You heard a line in a meeting once, or you underlined something years ago, and now you want it back.</p>
        <p>This is the index for that. <strong>${totalLinked} pages</strong>, each one telling you which chapter it belongs to, what the page turns on, and how to get to the real thing. We quote a line so you know you've got the right page. We don't reproduce the book — <a href="/big-book/">the book belongs to A.A., and it's better than any summary of it anyway</a>.</p>
      </div>

      <div class="lib-search">
        <a class="btn btn-primary" href="/big-book/search/">Search the whole Big Book →</a>
        <a class="btn btn-outline" href="/big-book/">Get your own copy →</a>
      </div>

      <nav class="lib-jump">${jump}</nav>

${hubSections}

${DISCLAIMER}
  </div></section></main>
${FOOTER}
`;

if (!DRY) {
  fs.mkdirSync(path.join(ROOT, "big-book", "pages"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "big-book", "pages", "index.html"), hubHtml);
  fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, "data", "bigbook-pages.json"),
    JSON.stringify({ generated: TODAY, hub: SITE + "/big-book/pages/", pages: built.map((b) => ({ label: b.label, url: b.url })) }, null, 2)
  );
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log("Big Book Page Library " + (DRY ? "(DRY RUN)" : "BUILT"));
console.log("  index entries          : " + idx.length);
console.log("  skipped (<" + MIN_TEXT + " chars) : " + skipped.length + "  [" + skipped.join(", ") + "]");
console.log("  curated (preserved)    : " + [...CURATED].join(", "));
console.log("  pages generated        : " + built.length);
console.log("  hub                    : /big-book/pages/  (" + totalLinked + " linked)");
console.log("  unique titles          : " + titles.size);
console.log("  unique metas           : " + descs.size);
console.log("  longest quote rendered : " + maxQuoteSeen + " chars (cap " + QUOTE_CAP + ") OK");

if (titles.size !== built.length) throw new Error("Title collision — aborting.");
if (descs.size !== built.length) throw new Error("Meta collision — aborting.");
