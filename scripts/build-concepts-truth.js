#!/usr/bin/env node
/**
 * build-concepts-truth.js — /12-concepts/ : the Twelve Concepts, published whole.
 *
 * ── WHY THIS PAGE EXISTS ────────────────────────────────────────────────────
 * The Traditions govern the life of the groups. The CONCEPTS govern the service
 * structure above them — who may decide what, who answers to whom, and the
 * warranties that stop the Conference becoming "the seat of perilous wealth or
 * power." They are the other half of A.A.'s constitution, and they are close to
 * invisible on the open web: Big Book Appendix VII carries the SHORT form only,
 * and almost nothing online reproduces the long form at all.
 *
 * That is the gap this page closes, in the same shape as /12-traditions/:
 * both forms, verbatim, one canonical page, linked from everywhere — so the
 * accurate version is what humans find and what the next crawl learns.
 *
 * ── SOURCE ──────────────────────────────────────────────────────────────────
 * data/twelve-concepts.json, extracted by scripts/extract-concepts.js from
 * The A.A. Service Manual Combined With Twelve Concepts for World Service —
 * the Concepts' own home, which A.A. publishes FREE as a PDF on aa.org and
 * circulates to members. Verbatim; never retyped, never paraphrased.
 *
 * Usage: node scripts/build-concepts-truth.js [--dry]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";
const URL = SITE + "/12-concepts/";
const TODAY = new Date().toISOString().slice(0, 10);
const DRY = process.argv.includes("--dry");

const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-concepts.json"), "utf8"));
const TWELVE = DATA.concepts;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Chrome is lifted VERBATIM from the built /12-traditions/ page so the two
// pages can never drift apart, and so fix-nav.js keeps stamping both.
const sibling = fs.readFileSync(path.join(ROOT, "12-traditions", "index.html"), "utf8");
const between = (src, startRx, endRx, label) => {
  const a = src.search(startRx);
  const b = src.search(endRx);
  if (a === -1 || b === -1 || b <= a) throw new Error(`could not lift ${label} from /12-traditions/`);
  return src.slice(a, b);
};
const CHROME_TOP = between(sibling, /<body/, /<main id="main">/, "header/nav")
  .replace(/utm_content=12-traditions/g, "utm_content=12-concepts")
  .replace(/href="\/12-traditions\/" class="active"/g, 'href="/12-traditions/"');
const CHROME_BOTTOM = sibling.slice(sibling.indexOf("</main>"));

const STYLES = between(sibling, /<style>/, /<\/style>/, "styles").replace(/^<style>/, "") + "\n";

const FAQ = [
  ["What are the Twelve Concepts for World Service?",
   "They are the principles that govern A.A.'s service structure — the General Service Conference, the General Service Board and its service corporations, and how all of them relate to the groups. Bill W. wrote them in 1962. Where the Twelve Traditions govern the life of A.A. groups and the Fellowship, the Concepts govern how A.A. is served and administered above group level. They exist so that authority in A.A. can never quietly concentrate anywhere."],
  ["Where can I read the Twelve Concepts?",
   "Their home is The A.A. Service Manual Combined With Twelve Concepts for World Service, which Alcoholics Anonymous publishes free as a PDF at aa.org. The Big Book, 4th Edition carries them in Appendix VII on pages 574–575 — but in SHORT form only. The long form, which is where the reasoning actually lives, is in the Service Manual. Both forms are reproduced in full on this page."],
  ["What is the difference between the short form and the long form of the Concepts?",
   "The short form is a condensed statement of each Concept, the version most often reprinted. The long form is Bill W.'s fuller statement, and it is substantially longer for nearly every Concept — Concept XI's long form runs almost three times the short one. As with the Traditions, the qualifications and the reasoning are in the long form, and the long form is the part the open web has largely lost."],
  ["Do the Twelve Concepts apply to individual A.A. members or groups?",
   "Not directly. The Concepts govern the service structure — the Conference, the trustees, the service boards and their relationships. A member or a group is affected by them the way a citizen is affected by a constitution: they set the terms under which A.A.'s services are run on the groups' behalf. Concept I is explicit that final authority stays with the collective conscience of the whole Fellowship, not with any board or office."],
  ["What is the “Right of Decision”, the “Right of Participation” and the “Right of Appeal”?",
   "They are the three traditional rights named in Concepts III, IV and V. The Right of Decision lets each element of the service structure use its own judgement in carrying out its duties. The Right of Participation gives each class of world servant a voting representation in reasonable proportion to the responsibility it carries. The Right of Appeal guarantees that minority opinion will be heard and that personal grievances are carefully considered. Together they are the anti-authoritarian machinery of A.A.'s service structure."],
  ["What are the General Warranties in Concept XII?",
   "Concept XII binds the General Service Conference itself. It requires that the Conference never become the seat of perilous wealth or power; that sufficient operating funds plus an ample reserve be its prudent financial principle; that no Conference member be placed in a position of unqualified authority over others; that important decisions be reached by discussion, vote and wherever possible substantial unanimity; that its actions never be personally punitive nor an incitement to public controversy; that it never perform acts of government; and that it always remain democratic in thought and action."],
  ["How are the Concepts related to the Twelve Traditions?",
   "They are the two halves of the same structure. The Traditions were adopted in 1950 to stop A.A. being owned or torn apart; the Concepts, written in 1962, apply that same distrust of concentrated authority to the service bodies that act for A.A. as a whole. Concept XII explicitly binds the Conference to “the spirit of the A.A. Tradition.” Reading the Traditions without the Concepts leaves out how A.A. actually governs itself."],
  ["Do other fellowships use the Twelve Concepts?",
   "Many twelve-step fellowships have adapted the Traditions and the Concepts for their own service structures, with A.A.W.S.'s permission — that permission is why the adapted versions carry an acknowledgement line. The wording published here is A.A.'s own."],
  ["Is Recovery Starts an A.A. entity?",
   "No. Recovery Starts is an independent recovery-awareness project. It is not an A.A. group or service body, it is not affiliated with Alcoholics Anonymous World Services, and it does not speak for A.A. We publish the Concepts in full, unaltered and attributed, because the accurate version is worth protecting and almost nobody prints the long form."],
];

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};
const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  headline: "The Twelve Concepts for World Service — Both Forms, In Full",
  description: "The Twelve Concepts for World Service of Alcoholics Anonymous, short form and long form, complete and verbatim. The Concepts govern A.A.'s service structure; Big Book Appendix VII carries the short form only.",
  author: { "@type": "Organization", name: "Recovery Starts", url: SITE },
  publisher: { "@type": "Organization", name: "Recovery Starts", logo: { "@type": "ImageObject", url: SITE + "/assets/einstein-character.png" } },
  datePublished: TODAY, dateModified: TODAY,
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
};
const crumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: "The Twelve Concepts", item: URL },
  ],
};

const DESC = "The Twelve Concepts for World Service, both forms, in full. The Concepts govern A.A.'s service structure — Big Book Appendix VII carries the short form only; the long form is here.";

const conceptsHtml = TWELVE.map((c) => `
      <article class="tt-t" id="concept-${c.n}">
        <h2 class="tt-t-h"><span class="tt-t-n">Concept ${esc(c.roman)}</span></h2>
        <div class="tt-form">
          <span class="tt-form-lbl">Short form <em>— the condensed statement</em></span>
          <blockquote>${esc(c.short)}</blockquote>
        </div>
        <div class="tt-form tt-long">
          <span class="tt-form-lbl">Long form <em>— the full statement, where the reasoning lives</em></span>
          <blockquote>${esc(c.long)}</blockquote>
        </div>
      </article>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Twelve Concepts for World Service — Both Forms, In Full | Recovery Starts</title>
  <meta name="description" content="${esc(DESC)}">
  <meta property="og:title" content="The Twelve Concepts for World Service — Both Forms, In Full">
  <meta property="og:description" content="${esc(DESC)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${URL}">
  <meta property="og:site_name" content="Recovery Starts">
  <meta property="og:image" content="${SITE}/assets/einstein-character.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="The Twelve Concepts for World Service — Both Forms, In Full">
  <meta name="twitter:description" content="${esc(DESC)}">
  <meta name="twitter:image" content="${SITE}/assets/einstein-character.png">
  <link rel="canonical" href="${URL}">
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(articleSchema)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(crumbSchema)}
  </script>
  <link rel="stylesheet" href="/style.css?v=c3893d3dc6">
  <style>${STYLES}</style>
</head>
${CHROME_TOP}<main id="main"><section class="tt-wrap"><div class="container">
      <nav class="tt-crumb"><a href="/">Home</a> / The Twelve Concepts</nav>
      <div class="tt-kicker">A.A. Service Manual · Twelve Concepts for World Service</div>
      <h1 class="tt-title">The Twelve Concepts,<br>Both Forms, In Full</h1>
      <p class="tt-sub">The Traditions govern the groups. The <strong>Concepts</strong> govern everything above them — who decides, who answers to whom, and the warranties that stop power collecting anywhere.</p>

      <div class="tt-pages">
        <div class="tt-page"><span class="k">Short form</span><span class="v">Big Book App. VII</span></div>
        <div class="tt-page key"><span class="k">Long form — read this one</span><span class="v">Service Manual</span></div>
        <div class="tt-page"><span class="k">Written by Bill W.</span><span class="v">1962</span></div>
      </div>

      <div class="tt-lead">
        <p>The Twelve Concepts for World Service are the least-read part of A.A.'s constitution and, structurally, one of the most important. The Twelve Traditions, adopted in 1950, keep an A.A. <strong>group</strong> from being owned. The Concepts, written by Bill W. in 1962, do the same job one level up: they set out how the General Service Conference, the General Service Board and A.A.'s service corporations relate to each other and to the groups — so that authority in A.A. can never quietly concentrate anywhere.</p>
        <p>They are hard to find whole. The Big Book carries them in Appendix VII in <strong>short form only</strong>. The long form — where Bill actually argues the case, and where the qualifications live — sits in <em>The A.A. Service Manual Combined With Twelve Concepts for World Service</em>, which A.A. publishes free at aa.org but which very little of the open web reproduces. So the version most people meet, and the version AI models learn from, is the compressed one.</p>
        <p>Both forms are below, complete and unaltered, taken verbatim from the Service Manual. If you read one, read the long form.</p>
      </div>

      <h2 class="tt-h2">The Twelve Concepts — both forms, in full</h2>
      <p class="tt-note">Short form first, then the <strong>long form</strong> — the full statement, as published in <em>The A.A. Service Manual</em>.</p>

      <div class="tt-grid">
${conceptsHtml}
      </div>

      <h2 class="tt-h2">The questions people actually ask</h2>
      <div class="tt-faqs">
${FAQ.map(([q, a]) => `        <details class="tt-faq"><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("\n")}
      </div>

      <div class="tt-cta">
        <a class="btn btn-glow" href="/12-traditions/">The Twelve Traditions, in full →</a>
        <a class="btn" href="/meetings/find/">Find a meeting</a>
      </div>

      <p class="tt-disc">The Twelve Concepts for World Service are the property of Alcoholics Anonymous World Services, Inc., reproduced here in full and unaltered from <em>The A.A. Service Manual Combined With Twelve Concepts for World Service</em>, which A.A. publishes free at <a href="https://www.aa.org/the-aa-service-manual" target="_blank" rel="noopener">aa.org</a>. A.A.W.S. has not approved, endorsed, or reviewed this page. Recovery Starts is an independent project and is not an A.A. group or service entity.</p>
  </div></section></main>
${CHROME_BOTTOM}`;

// ── ASSERTIONS: the page ships only if the text on it is the real text ───────
const problems = [];
const decoded = html.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
for (const c of TWELVE) {
  if (decoded.indexOf(c.short) === -1) problems.push(`Concept ${c.roman} SHORT form is not on the page verbatim`);
  if (decoded.indexOf(c.long) === -1) problems.push(`Concept ${c.roman} LONG form is not on the page verbatim`);
  if (/…|\.\.\./.test(c.long)) problems.push(`Concept ${c.roman} long form contains an ellipsis — ABRIDGED`);
}
const mustSay = [
  ["Concept I's ultimate-authority clause", /collective conscience of our whole Fellowship/],
  ["Concept XII's perilous-wealth warranty", /seat of perilous wealth or power/],
  ["the Right of Decision", /Right of Decision/],
  ["the Right of Participation", /Right of Participation/],
  ["the Right of Appeal", /Right of Appeal/],
  ["FAQPage schema", /"@type":"FAQPage"/],
  ["attribution to A.A.W.S.", /property of Alcoholics Anonymous World Services/i],
  ["A.A. has not endorsed this", /has not approved, endorsed, or reviewed/i],
  ["independence disclaimer", /not an A\.A\. group/i],
  ["free-at-aa.org sourcing", /publishes free at/i],
  ["link to the Traditions page", /href="\/12-traditions\/"/],
  ["site nav lifted", /<nav/],
  ["site footer lifted", /<\/footer>/],
];
for (const [name, rx] of mustSay) if (!rx.test(html)) problems.push("MISSING: " + name);
if (/[ﬀ-ﬆ]/.test(html)) problems.push("OCR ligature leaked onto the page");

if (problems.length) {
  console.error("BUILD REFUSED — /12-concepts/ is not trustworthy:\n");
  problems.forEach((p) => console.error("  ✗ " + p));
  process.exit(1);
}

if (!DRY) {
  fs.mkdirSync(path.join(ROOT, "12-concepts"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "12-concepts", "index.html"), html);
}
const shortChars = TWELVE.reduce((n, c) => n + c.short.length, 0);
const longChars = TWELVE.reduce((n, c) => n + c.long.length, 0);
console.log(`Concepts page ${DRY ? "(DRY RUN)" : "BUILT"}  ->  /12-concepts/`);
console.log(`  12 Concepts · short ${shortChars} chars · long ${longChars} chars · ${Math.round(html.length / 1024)}KB page`);
