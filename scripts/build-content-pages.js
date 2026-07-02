#!/usr/bin/env node
/**
 * build-content-pages.js — Phase 5 of WO-einstein-max-reach.
 *
 * Renders the verified content JSON (data/content-pages.json, produced by the
 * content workflow) into:
 *   /steps/index.html                the 12 Steps hub
 *   /steps/step-[1-12]/index.html    step guides (prev/next interlinked)
 *   /big-book/[slug]/index.html      15 Big Book FAQ pages
 * then adds the 28 new URLs to sitemap.xml and injects a "Go deeper" block of
 * 2-3 topically-related links onto each of the 366 day pages (keyword-mapped
 * from reflections.json themes + thoughts).
 *
 * Deterministic assembler: all layout, schema, UTM tagging, disclaimers and
 * footers are rendered here so the 28 pages are pixel-consistent; the agents
 * only wrote the words. Idempotent via regen-seo marker comments.
 *
 * Usage: node scripts/build-content-pages.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";
const TODAY = "2026-07-01";
const DATA = path.join(ROOT, "data", "content-pages.json");

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const DAYS_IN_MONTH = { january:31, february:29, march:31, april:30, may:31, june:30, july:31, august:31, september:30, october:31, november:30, december:31 };

const STEP_NAMES = [
  "Honesty","Hope","Faith","Courage","Integrity","Willingness",
  "Humility","Brotherly Love","Justice","Perseverance","Spirituality","Service",
];

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function escAttr(s) { return esc(s).replace(/"/g, "&quot;"); }
function utm(slug) { return `utm_source=recoverystarts&utm_medium=site&utm_campaign=366mornings&utm_content=${slug}`; }
function ld(obj) { const j = JSON.stringify(obj); JSON.parse(j); return j; }

function breadcrumb(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
  };
}

function faqLd(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function articleLd(page, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title.replace(/ \| Recovery Einstein$/, ""),
    description: page.metaDescription,
    author: { "@type": "Person", name: "Recovery Einstein", url: "https://app.recoverystarts.com" },
    publisher: { "@type": "Organization", name: "Recovery Starts", logo: { "@type": "ImageObject", url: `${SITE}/assets/einstein-character.png` } },
    image: `${SITE}/assets/einstein-character.png`,
    datePublished: TODAY,
    dateModified: TODAY,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
  };
}

const NAV = `  <nav class="nav"><div class="nav-inner">
    <a href="/" class="nav-brand">Recovery Starts</a>
    <button class="nav-toggle" aria-label="Toggle menu" onclick="document.querySelector('.nav-links').classList.toggle('open')">☰</button>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/meetings/">Meetings</a></li>
      <li><a href="/aa-info/">AA Info</a></li>
      <li><a href="/daily-reflection/">Daily Reflection</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li>
      <li><a href="/download/" class="nav-cta">Get the App</a></li>
    </ul>
  </div></nav>`;

const FOOTER = `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div><div class="footer-brand">Recovery Starts</div><p class="footer-desc">Independent recovery awareness project. Not affiliated with any fellowship.</p></div>
        <div><h4>Navigate</h4><ul class="footer-links"><li><a href="/">Home</a></li><li><a href="/meetings/">Meetings</a></li><li><a href="/daily-reflection/">Daily Reflection</a></li><li><a href="/steps/">The 12 Steps</a></li><li><a href="/download/">Recovery Einstein</a></li><li><a href="/about/">About</a></li></ul></div>
        <div><h4>AA Resources</h4><ul class="footer-links"><li><a href="/aa-info/">AA Info</a></li><li><a href="/aa-info/#traditions">12 Traditions</a></li><li><a href="https://www.aa.org" target="_blank" rel="noopener">aa.org</a></li></ul></div>
        <div><h4>Connect</h4><ul class="footer-links"><li><a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Meet Derick</a></li><li><a href="https://claudeslab.com" target="_blank" rel="noopener">Claude's Lab</a></li></ul></div>
      </div>
      <div class="privacy-notice"><strong>Privacy:</strong> No cookies. No personal tracking. Anonymous, cookie-free page counts only. <strong>Independence:</strong> Not affiliated with any fellowship. <strong>No Medical Advice:</strong> Not a substitute for professional care.</div>
      <div class="footer-bottom"><p>&copy; 2026 RecoveryStarts.com. Built by <a href="https://linktr.ee/addict2influencer" target="_blank" rel="noopener">Addict2Influencer</a>.</p></div>
    </div>
  </footer>
  <script src="/app.js"></script>
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "9c520169a3ab453b867424ab9b3b276b"}'></script>
<!-- End Cloudflare Web Analytics -->`;

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
    .cp-cta { text-align: center; margin: 2.4rem auto 0; }
    .cp-nav { display: flex; justify-content: space-between; align-items: center; gap: 12px; max-width: 760px; margin: 2.6rem auto 0; }
    .cp-nav a { background: var(--bg-card); border: 1px solid var(--border); color: var(--text); border-radius: var(--radius-sm); padding: 10px 18px; font-size: 0.9rem; transition: all 0.2s; max-width: 45%; }
    .cp-nav a:hover { border-color: var(--border-hover); color: var(--gold); }
    .cp-nav a small { display:block; color: var(--text-dim); font-size: 0.7rem; }
    .cp-disclaimer { max-width: 760px; margin: 2.6rem auto 0; text-align: center; color: var(--text-dim); font-size: 0.78rem; line-height: 1.6; }
    .cp-faq { max-width: 760px; margin: 2.6rem auto 0; }
    .cp-faq-title { font-family: var(--font-display); color: var(--gold); font-size: 0.95rem; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin-bottom: 1rem; }
    .cp-faq-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; margin-bottom: 10px; }
    .cp-faq-item h3 { color: var(--text); font-size: 0.95rem; margin: 0 0 8px; }
    .cp-faq-item p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.65; margin: 0; }
    .cp-related { max-width: 760px; margin: 2rem auto 0; text-align: center; }
    .cp-related .lbl { font-family: var(--font-display); color: var(--text-dim); font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px; }
    .cp-related a { display: inline-block; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); border-radius: 999px; padding: 7px 16px; margin: 4px; font-size: 0.85rem; transition: all 0.2s; }
    .cp-related a:hover { border-color: var(--border-hover); color: var(--gold); }
    .cp-ref { max-width: 760px; margin: 1.4rem auto 0; text-align: center; font-size: 0.82rem; color: var(--text-dim); }
    .step-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 12px; max-width: 920px; margin: 2rem auto 0; }
    .step-card { display:block; background: var(--bg-card); border:1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 18px; transition: all 0.2s; }
    .step-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
    .step-card .n { color: var(--gold); font-weight:700; font-size:0.78rem; letter-spacing:1px; }
    .step-card .t { color: var(--text); display:block; margin-top:2px; font-size: 0.95rem; }
  </style>`;

function head(page, url, schemas) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${escAttr(page.metaDescription)}">
  <meta property="og:title" content="${escAttr(page.title)}">
  <meta property="og:description" content="${escAttr(page.metaDescription)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Recovery Starts">
  <meta property="og:image" content="${SITE}/assets/einstein-character.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(page.title)}">
  <meta name="twitter:description" content="${escAttr(page.metaDescription)}">
  <meta name="twitter:image" content="${SITE}/assets/einstein-character.png">
  <link rel="canonical" href="${url}">
${schemas.map((s) => `  <script type="application/ld+json">\n  ${ld(s)}\n  </script>`).join("\n")}
  <link rel="stylesheet" href="/style.css">
${STYLE}
</head>
<body>
  <div class="cp-bg"></div>
  <a href="#main" class="skip-link">Skip to content</a>
${NAV}`;
}

function faqSection(faq) {
  if (!faq || faq.length === 0) return "";
  return `
      <section class="cp-faq">
        <h2 class="cp-faq-title">Quick answers</h2>
${faq.map((f) => `        <div class="cp-faq-item">
          <h3>${esc(f.q)}</h3>
          <p>${esc(f.a)}</p>
        </div>`).join("\n")}
      </section>`;
}

const DISCLAIMER = `      <p class="cp-disclaimer">This is Recovery Einstein's original Big Book study guide — an independent educational resource, not official AA literature and not medical advice. Page references are to <em>Alcoholics Anonymous</em> (the Big Book), 4th Edition. If you're in crisis, call or text 988 (Suicide &amp; Crisis Lifeline).</p>`;

function ctaBlock(slug) {
  return `      <div class="cp-cta"><a href="https://app.recoverystarts.com/?${utm(slug)}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about this →</a></div>`;
}

function relatedBlock(links) {
  if (!links || !links.length) return "";
  return `
      <div class="cp-related">
        <span class="lbl">Go deeper</span>
        ${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("\n        ")}
      </div>`;
}

// ── Renderers ────────────────────────────────────────────────────────────────

function renderStepPage(page, i, pagesBySlug) {
  const url = `${SITE}/steps/step-${i}/`;
  const crumb = breadcrumb([["Home", `${SITE}/`], ["The 12 Steps", `${SITE}/steps/`], [`Step ${i}`, url]]);
  const schemas = [articleLd(page, url), faqLd(page.faq), crumb];
  const prev = i > 1 ? `<a href="/steps/step-${i - 1}/"><small>← Previous</small>Step ${i - 1}: ${STEP_NAMES[i - 2]}</a>` : `<a href="/steps/"><small>← All Steps</small>The 12 Steps</a>`;
  const next = i < 12 ? `<a href="/steps/step-${i + 1}/" style="text-align:right"><small>Next →</small>Step ${i + 1}: ${STEP_NAMES[i]}</a>` : `<a href="/big-book/carrying-the-message/" style="text-align:right"><small>Go deeper →</small>Carrying the Message</a>`;
  const related = [];
  if (pagesBySlug["how-it-works"]) related.push({ href: "/big-book/how-it-works/", label: "How It Works (Ch. 5)" });
  if (pagesBySlug["the-promises"]) related.push({ href: "/big-book/the-promises/", label: "The Promises" });

  return `${head(page, url, schemas)}
  <main id="main"><section class="cp-wrap"><div class="container">
      <nav class="cp-crumb"><a href="/">Home</a> / <a href="/steps/">The 12 Steps</a> / Step ${i}</nav>
      <div class="cp-kicker">Step ${i} of 12 — ${STEP_NAMES[i - 1]}</div>
      <h1 class="cp-title">${esc(page.h1)}</h1>
      <p class="cp-sub">${esc(page.subtitle)}</p>
      <div class="cp-body">
${page.bodyHtml}
      </div>
      <div class="cp-ref">— ${esc(page.bookRefs)}</div>
${ctaBlock(`step-${i}`)}
${faqSection(page.faq)}
${relatedBlock(related)}
      <div class="cp-nav">
        ${prev}
        ${next}
      </div>
${DISCLAIMER}
  </div></section></main>
${FOOTER}
</body>
</html>
`;
}

function renderHub(page, stepPages) {
  const url = `${SITE}/steps/`;
  const crumb = breadcrumb([["Home", `${SITE}/`], ["The 12 Steps", url]]);
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title.replace(/ \| Recovery Einstein$/, ""),
    description: page.metaDescription,
    url,
    isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
    hasPart: stepPages.map((p, idx) => ({ "@type": "Article", headline: p.h1, url: `${SITE}/steps/step-${idx + 1}/` })),
  };
  const schemas = [collection, faqLd(page.faq), crumb];
  const grid = stepPages
    .map((p, idx) => `        <a class="step-card" href="/steps/step-${idx + 1}/"><span class="n">STEP ${idx + 1} — ${STEP_NAMES[idx].toUpperCase()}</span><span class="t">${esc(p.h1.replace(/^Step \d+:\s*/, ""))}</span></a>`)
    .join("\n");

  return `${head(page, url, schemas)}
  <main id="main"><section class="cp-wrap"><div class="container">
      <nav class="cp-crumb"><a href="/">Home</a> / The 12 Steps</nav>
      <div class="cp-kicker">The Big Book Guide</div>
      <h1 class="cp-title">${esc(page.h1)}</h1>
      <p class="cp-sub">${esc(page.subtitle)}</p>
      <div class="cp-body">
${page.bodyHtml}
      </div>
      <div class="step-grid">
${grid}
      </div>
${ctaBlock("steps-hub")}
${faqSection(page.faq)}
${DISCLAIMER}
  </div></section></main>
${FOOTER}
</body>
</html>
`;
}

// FAQ-page related links: adjacent topics, hand-mapped.
const FAQ_RELATED = {
  resentment: ["step-4-instructions", "fear-inventory"],
  acceptance: ["daily-reprieve", "self-will"],
  "the-promises": ["page-83", "amends"],
  "fear-inventory": ["resentment", "step-4-instructions"],
  "step-4-instructions": ["resentment", "fear-inventory"],
  amends: ["the-promises", "sponsorship"],
  sponsorship: ["carrying-the-message", "how-it-works"],
  "spiritual-experience": ["more-will-be-revealed", "carrying-the-message"],
  "page-83": ["the-promises", "daily-reprieve"],
  "how-it-works": ["powerlessness", "self-will"],
  "more-will-be-revealed": ["spiritual-experience", "page-83"],
  "self-will": ["powerlessness", "acceptance"],
  powerlessness: ["how-it-works", "self-will"],
  "daily-reprieve": ["page-83", "acceptance"],
  "carrying-the-message": ["sponsorship", "spiritual-experience"],
};

function renderFaqPage(page, pagesBySlug) {
  const url = `${SITE}/big-book/${page.slug}/`;
  // No /big-book/ hub exists — keep the schema to real, resolvable URLs.
  const crumb = breadcrumb([["Home", `${SITE}/`], [page.h1, url]]);
  const schemas = [articleLd(page, url), faqLd(page.faq), crumb];
  const related = [{ href: "/steps/", label: "The 12 Steps — Big Book Guide" }];
  for (const slug of FAQ_RELATED[page.slug] || []) {
    const p = pagesBySlug[slug];
    if (p) related.push({ href: `/big-book/${slug}/`, label: p.h1 });
  }

  return `${head(page, url, schemas)}
  <main id="main"><section class="cp-wrap"><div class="container">
      <nav class="cp-crumb"><a href="/">Home</a> / Big Book / ${esc(page.h1)}</nav>
      <div class="cp-kicker">From the Big Book</div>
      <h1 class="cp-title">${esc(page.h1)}</h1>
      <p class="cp-sub">${esc(page.subtitle)}</p>
      <div class="cp-body">
${page.bodyHtml}
      </div>
      <div class="cp-ref">— ${esc(page.bookRefs)}</div>
${ctaBlock(`bigbook-${page.slug}`)}
${faqSection(page.faq)}
${relatedBlock(related)}
${DISCLAIMER}
  </div></section></main>
${FOOTER}
</body>
</html>
`;
}

// ── Go deeper on day pages ───────────────────────────────────────────────────

const KEYWORD_MAP = [
  [/resent/i, ["big-book/resentment", "steps/step-4"]],
  [/fear/i, ["big-book/fear-inventory", "steps/step-4"]],
  [/inventor/i, ["steps/step-4", "steps/step-10"]],
  [/amend/i, ["big-book/amends", "steps/step-9"]],
  [/sponsor/i, ["big-book/sponsorship", "steps/step-12"]],
  [/carry|service|still suffer|help(ing)? other|working with other/i, ["big-book/carrying-the-message", "steps/step-12"]],
  [/pray|meditat|conscious contact/i, ["steps/step-11", "big-book/daily-reprieve"]],
  [/surrender|turn(ed)? (it|our will|over)|third step|god.s will/i, ["steps/step-3", "big-book/self-will"]],
  [/self-will|self-centered|selfish/i, ["big-book/self-will", "steps/step-3"]],
  [/powerless|unmanageab/i, ["steps/step-1", "big-book/powerlessness"]],
  [/believe|faith|higher power|came to/i, ["steps/step-2", "big-book/spiritual-experience"]],
  [/humility|humble|shortcoming/i, ["steps/step-7", "steps/step-6"]],
  [/defect/i, ["steps/step-6", "steps/step-7"]],
  [/promise/i, ["big-book/the-promises", "big-book/page-83"]],
  [/accept/i, ["big-book/acceptance", "big-book/daily-reprieve"]],
  [/awakening|spiritual experience/i, ["big-book/spiritual-experience", "steps/step-12"]],
  [/reprieve|daily basis|one day|twenty-four|24 hours/i, ["big-book/daily-reprieve", "big-book/page-83"]],
  [/admitted to god|another human|confess/i, ["steps/step-5", "steps/step-4"]],
  [/honest/i, ["big-book/how-it-works", "steps/step-1"]],
  [/gratitude|grateful/i, ["big-book/the-promises", "steps/step-10"]],
];
const DEFAULT_LINKS = ["big-book/how-it-works", "big-book/the-promises"];

function goDeeperFor(theme, thought) {
  const text = `${theme} ${thought}`;
  const hits = [];
  for (const [re, targets] of KEYWORD_MAP) {
    if (re.test(text)) for (const t of targets) if (!hits.includes(t)) hits.push(t);
    if (hits.length >= 3) break;
  }
  for (const d of DEFAULT_LINKS) {
    if (hits.length >= 2) break;
    if (!hits.includes(d)) hits.push(d);
  }
  return hits.slice(0, 3);
}

function labelFor(target, pagesBySlug) {
  const m = target.match(/^steps\/step-(\d+)$/);
  if (m) return `Step ${m[1]}: ${STEP_NAMES[parseInt(m[1], 10) - 1]}`;
  const slug = target.replace(/^big-book\//, "");
  const p = pagesBySlug[slug];
  return p ? p.h1 : slug;
}

function injectGoDeeper(reflections, pagesBySlug, dry) {
  let done = 0;
  for (const m of MONTHS) {
    for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) {
      const slug = `${m}-${d}`;
      const file = path.join(ROOT, "daily-reflection", slug, "index.html");
      let html = fs.readFileSync(file, "utf8");
      html = html.replace(/\n?\s*<!-- regen-seo:godeeper -->[\s\S]*?<!-- \/regen-seo:godeeper -->/g, "");
      const key = `${MONTHS.indexOf(m) + 1}-${d}`;
      const entry = reflections[key] || {};
      const targets = goDeeperFor(entry.theme || "", entry.thought || "");
      const links = targets.map((t) => `<a href="/${t}/" style="display:inline-block;background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);border-radius:999px;padding:7px 16px;margin:4px;font-size:0.85rem;">${esc(labelFor(t, pagesBySlug))}</a>`);
      const block = `
      <!-- regen-seo:godeeper -->
      <div class="dr-share" style="margin-top:2rem;">
        <span class="lbl">Go deeper</span>
        <div>${links.join("\n        ")}</div>
      </div>
      <!-- /regen-seo:godeeper -->`;
      const anchor = /(<\/section>\s*<!-- \/regen-seo:faq -->)/;
      if (anchor.test(html)) {
        html = html.replace(anchor, `$1${block}`);
      } else {
        html = html.replace(/(<p class="dr-disclaimer">)/, `${block}\n      $1`);
      }
      if (!dry) fs.writeFileSync(file, html, "utf8");
      done++;
    }
  }
  return done;
}

// ── Sitemap ──────────────────────────────────────────────────────────────────

function updateSitemap(urls, dry) {
  const smPath = path.join(ROOT, "sitemap.xml");
  let sm = fs.readFileSync(smPath, "utf8");
  let added = 0;
  const entries = urls
    .filter((u) => !sm.includes(`<loc>${u}</loc>`))
    .map((u) => {
      added++;
      return `  <url>\n    <loc>${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    })
    .join("");
  sm = sm.replace("</urlset>", `${entries}</urlset>`);
  if (!dry) fs.writeFileSync(smPath, sm, "utf8");
  return added;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const dry = process.argv.includes("--dry");
  const { pages } = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const pagesBySlug = {};
  for (const p of pages) pagesBySlug[p.slug] = p;

  const stepPages = [];
  for (let i = 1; i <= 12; i++) {
    const p = pagesBySlug[`step-${i}`];
    if (!p) throw new Error(`missing step-${i}`);
    stepPages.push(p);
  }
  const hub = pagesBySlug["steps-hub"];
  if (!hub) throw new Error("missing steps-hub");
  const faqPages = pages.filter((p) => p.kind === "faq");
  if (faqPages.length !== 15) throw new Error(`expected 15 faq pages, got ${faqPages.length}`);

  const urls = [];
  const write = (rel, html) => {
    const file = path.join(ROOT, rel, "index.html");
    if (!dry) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html, "utf8");
    }
    urls.push(`${SITE}/${rel.replace(/\\/g, "/")}/`);
  };

  for (let i = 1; i <= 12; i++) write(path.join("steps", `step-${i}`), renderStepPage(stepPages[i - 1], i, pagesBySlug));
  write("steps", renderHub(hub, stepPages));
  for (const p of faqPages) write(path.join("big-book", p.slug), renderFaqPage(p, pagesBySlug));

  const added = updateSitemap(urls, dry);
  const reflections = JSON.parse(fs.readFileSync(path.join(ROOT, "daily-reflection", "reflections.json"), "utf8"));
  const godeeper = injectGoDeeper(reflections, pagesBySlug, dry);

  console.log(`${dry ? "[DRY RUN] " : ""}Built ${urls.length} pages (12 steps + hub + ${faqPages.length} faq), sitemap +${added}, go-deeper on ${godeeper} day pages`);
}

main();
