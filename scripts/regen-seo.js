#!/usr/bin/env node
/**
 * regen-seo.js — programmatic SEO rewrite for the 366 daily-reflection pages.
 *
 * Phase 1 (--phase1): retitle + re-describe every day page.
 *   <title>            AA Daily Reflection [Month] [D] — [Theme In Title Case] | Recovery Einstein
 *                      (drop " | Recovery Einstein" if >60 chars; then truncate theme
 *                       at word boundaries if still >60)
 *   og:title, twitter:title  identical to <title>
 *   meta/og/twitter description  ≤155 chars, complete sentence(s), no ellipsis,
 *                      never cut mid-word
 *   Article JSON-LD    headline + description synced, dateModified bumped
 *
 * Body content (H1, perspective, discussion, refs) is NEVER touched — doctrine
 * text is Derick-approved. The script parses it read-only as the source of truth.
 *
 * Usage:  node scripts/regen-seo.js --phase1 [--dry] [--only july-1]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DR = path.join(ROOT, "daily-reflection");
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const DAYS_IN_MONTH = { january: 31, february: 29, march: 31, april: 30, may: 31, june: 30, july: 31, august: 31, september: 30, october: 31, november: 30, december: 31 };

const TITLE_MAX = 60;
const DESC_MAX = 155;
const DESC_TAIL = "Read Einstein's Big Book take on today's AA reflection.";
const TODAY = "2026-07-01";

// Words kept lowercase in title case (unless first or last word)
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "with"]);

function cap(word) {
  // Dotted acronyms stay uppercase: A.A., A.A.'s (with possessive)
  const acr = word.match(/^([("'“‘]*)((?:[A-Za-z]\.){2,})(['’][sS])?([)"'”’]*)$/);
  if (acr) return (acr[1] || "") + acr[2].toUpperCase() + (acr[3] ? acr[3][0] + "s" : "") + (acr[4] || "");
  if (/^[("'“‘]*aa[)"'”’]*$/i.test(word)) return word.toUpperCase();
  // Capitalize the first alphabetic char (skipping leading quotes/parens) and
  // after hyphens/dashes/double-quotes, but NOT after mid-word apostrophes —
  // CAN'T -> Can't, GOD'S -> God's, EVER-GROWING -> Ever-Growing.
  return word
    .toLowerCase()
    .replace(/(^['‘"“(]*|[-—("“])([a-z])/g, (m, p, c) => p + c.toUpperCase());
}

function titleCaseTheme(raw) {
  const tokens = raw.trim().split(/\s+/);
  // Indices of "real" word tokens (not bare ellipsis dots)
  const isWord = (t) => /[a-zA-Z]/.test(t);
  const wordIdx = tokens.map((t, i) => (isWord(t) ? i : -1)).filter((i) => i >= 0);
  const first = wordIdx[0];
  const last = wordIdx[wordIdx.length - 1];
  return tokens
    .map((t, i) => {
      if (!isWord(t)) return t; // ". . ." dots pass through untouched
      const bare = t.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
      // Small words stay lowercase mid-title — unless they open a quotation
      // (FINDING "A REASON..." -> Finding "A Reason...)
      if (i !== first && i !== last && SMALL_WORDS.has(bare) && !/^["“'‘]/.test(t)) return t.toLowerCase();
      return cap(t);
    })
    .join(" ");
}

function buildTitle(month, day, themeTC) {
  const base = `AA Daily Reflection ${month} ${day} — ${themeTC}`;
  const full = `${base} | Recovery Einstein`;
  if (full.length <= TITLE_MAX) return { title: full, mode: "full" };
  if (base.length <= TITLE_MAX) return { title: base, mode: "nosuffix" };
  // Truncate theme at word boundaries; strip trailing small/connective words
  // and dangling punctuation so we never end on "and", "of", ". . ." etc.
  const STRIP_TRAILING = new Set([...SMALL_WORDS, "not", "no"]);
  const words = themeTC.split(/\s+/);
  while (words.length > 1) {
    words.pop();
    while (
      words.length > 1 &&
      (STRIP_TRAILING.has(words[words.length - 1].toLowerCase().replace(/[^a-z']/g, "")) ||
        !/[a-zA-Z]/.test(words[words.length - 1]))
    ) {
      words.pop();
    }
    let theme = words.join(" ").replace(/[,;:]+$/, "");
    // Balance straight quotes: if truncation orphaned one, drop the last one.
    if ((theme.split('"').length - 1) % 2 === 1) {
      const idx = theme.lastIndexOf('"');
      theme = (theme.slice(0, idx) + theme.slice(idx + 1)).trim();
    }
    // Orphaned curly opener with no closer: drop it.
    if (theme.includes("“") && !theme.includes("”")) {
      theme = theme.replace(/“/g, "").trim();
    }
    const t = `AA Daily Reflection ${month} ${day} — ${theme}`;
    if (t.length <= TITLE_MAX) return { title: t, mode: "truncated" };
  }
  return { title: `AA Daily Reflection ${month} ${day}`, mode: "dateonly" };
}

function firstSentence(text) {
  // Mask dotted-acronym periods (A.A., H.P.) so they don't end the sentence.
  const MASK = "";
  const masked = text.replace(/\b(?:[A-Za-z]\.){2,}/g, (m) => m.split(".").join(MASK));
  const m = masked.match(/^[\s\S]*?[.!?]['"’”]?(?=\s|$)/);
  if (!m) return null;
  return m[0].split(MASK).join(".").trim();
}

function buildDescription(perspectiveText, month, day, themeTC) {
  const s1 = firstSentence(perspectiveText);
  if (s1) {
    const withTail = `${s1} ${DESC_TAIL}`;
    if (withTail.length <= DESC_MAX) return { desc: withTail, mode: "s1+tail" };
    if (s1.length <= DESC_MAX) return { desc: s1, mode: "s1only" };
  }
  // Fallback: keyword-bearing complete sentence built from the theme.
  let words = themeTC.split(/\s+/);
  let desc = `Recovery Einstein's Big Book perspective on ${words.join(" ")}, the AA Daily Reflection for ${month} ${day}.`;
  while (desc.length > DESC_MAX && words.length > 1) {
    words.pop();
    desc = `Recovery Einstein's Big Book perspective on ${words.join(" ")}, the AA Daily Reflection for ${month} ${day}.`;
  }
  return { desc, mode: "fallback" };
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function escAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escText(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Replace exactly once; throw if the pattern is missing so nothing silently skips. */
function mustReplace(html, regex, replacement, what, slug) {
  const m = html.match(regex);
  if (!m) throw new Error(`[${slug}] pattern not found: ${what}`);
  return html.replace(regex, replacement);
}

function processDayPage(slug, opts) {
  const [monthLower, dayStr] = slug.split(/-(?=\d+$)/);
  const month = monthLower[0].toUpperCase() + monthLower.slice(1);
  const day = parseInt(dayStr, 10);
  const file = path.join(DR, slug, "index.html");
  let html = fs.readFileSync(file, "utf8");

  // --- Parse the page (read-only doctrine) ---
  const h1m = html.match(/<h1 class="dr-theme">([\s\S]*?)<\/h1>/);
  if (!h1m) throw new Error(`[${slug}] no H1 theme`);
  const themeRaw = stripTags(h1m[1]);

  const bubbleM = html.match(/<div class="dr-bubble">[\s\S]*?<div class="who">[\s\S]*?<\/div>\s*<p>([\s\S]*?)<\/p>/);
  if (!bubbleM) throw new Error(`[${slug}] no perspective paragraph`);
  const perspective = stripTags(bubbleM[1]);

  const themeTC = titleCaseTheme(themeRaw);
  const { title, mode: titleMode } = buildTitle(month, day, themeTC);
  const { desc, mode: descMode } = buildDescription(perspective, month, day, themeTC);

  if (desc.length > DESC_MAX) throw new Error(`[${slug}] description ${desc.length} chars`);
  if (/…$/.test(desc)) throw new Error(`[${slug}] description ends in ellipsis`);

  // --- Rewrite head ---
  html = mustReplace(html, /<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`, "title", slug);
  html = mustReplace(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(desc)}">`, "meta description", slug);
  html = mustReplace(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escAttr(title)}">`, "og:title", slug);
  html = mustReplace(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escAttr(desc)}">`, "og:description", slug);
  html = mustReplace(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escAttr(title)}">`, "twitter:title", slug);
  html = mustReplace(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escAttr(desc)}">`, "twitter:description", slug);

  // --- Article JSON-LD: parse, patch, re-serialize (guaranteed valid JSON) ---
  const ldM = html.match(/(<script type="application\/ld\+json">\s*)([\s\S]*?)(\s*<\/script>)/);
  if (!ldM) throw new Error(`[${slug}] no JSON-LD block`);
  let ld;
  try {
    ld = JSON.parse(ldM[2]);
  } catch (e) {
    throw new Error(`[${slug}] existing JSON-LD is invalid: ${e.message}`);
  }
  if (ld["@type"] !== "Article") throw new Error(`[${slug}] first JSON-LD is ${ld["@type"]}, expected Article`);
  ld.headline = title.replace(/ \| Recovery Einstein$/, "");
  ld.description = desc;
  ld.dateModified = TODAY;
  const ldOut = JSON.stringify(ld);
  JSON.parse(ldOut); // self-check
  html = html.replace(ldM[0], `${ldM[1]}${ldOut}${ldM[3]}`);

  if (!opts.dry) fs.writeFileSync(file, html, "utf8");
  return { slug, title, titleLen: title.length, titleMode, desc, descLen: desc.length, descMode, themeRaw, themeTC };
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 — schema upgrades: BreadcrumbList + FAQPage (day pages), Breadcrumb
// (month hubs), SoftwareApplication (/download), Organization (homepage).
// Idempotent: existing generated blocks are replaced, never duplicated.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = "https://recoverystarts.com";

/** Split text into sentences, tolerant of dotted acronyms (A.A.). */
function sentences(text) {
  const MASK = "";
  const masked = text.replace(/\b(?:[A-Za-z]\.){2,}/g, (m) => m.split(".").join(MASK));
  const parts = masked.split(/(?<=[.!?]['"’”]?)\s+/).map((s) => s.split(MASK).join(".").trim()).filter(Boolean);
  return parts;
}

function ldScript(obj) {
  const json = JSON.stringify(obj);
  JSON.parse(json); // self-check
  return `<script type="application/ld+json">\n  ${json}\n  </script>`;
}

function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: url,
    })),
  };
}

/** Remove previously generated phase-2 blocks so re-runs replace, not stack. */
function stripGenerated(html) {
  html = html.replace(/\n?<!-- regen-seo:phase2 -->[\s\S]*?<!-- \/regen-seo:phase2 -->/g, "");
  html = html.replace(/\n?\s*<!-- regen-seo:faq -->[\s\S]*?<!-- \/regen-seo:faq -->/g, "");
  html = html.replace(/\n?\s*\/\* regen-seo:faq-css \*\/[\s\S]*?\/\* \/regen-seo:faq-css \*\//g, "");
  return html;
}

function phase2DayPage(slug, opts) {
  const [monthLower, dayStr] = slug.split(/-(?=\d+$)/);
  const month = monthLower[0].toUpperCase() + monthLower.slice(1);
  const day = parseInt(dayStr, 10);
  const file = path.join(DR, slug, "index.html");
  let html = stripGenerated(fs.readFileSync(file, "utf8"));

  // Parse doctrine (read-only)
  const themeRaw = stripTags(html.match(/<h1 class="dr-theme">([\s\S]*?)<\/h1>/)[1]);
  const themeTC = titleCaseTheme(themeRaw);
  const bubbleM = html.match(/<div class="dr-bubble">[\s\S]*?<div class="who">[\s\S]*?<\/div>\s*<p>([\s\S]*?)<\/p>/);
  if (!bubbleM) throw new Error(`[${slug}] no perspective paragraph`);
  const perspective = stripTags(bubbleM[1]);
  const discussM = html.match(/<div class="dr-discuss"><span class="lbl">[^<]*<\/span><p>([\s\S]*?)<\/p><\/div>/);
  if (!discussM) throw new Error(`[${slug}] no discussion question`);
  const question = stripTags(discussM[1]);
  const refM = html.match(/<div class="dr-ref">—\s*([\s\S]*?)<\/div>/);
  const bookRef = refM ? stripTags(refM[1]) : null;

  // Q1: theme + one-line summary (first sentence)
  const sents = sentences(perspective);
  const s1 = sents[0] || perspective;
  const q1 = `What is the AA Daily Reflection for ${month} ${day}?`;
  const a1 = `The theme for ${month} ${day} is “${themeTC}.” ${s1}`;

  // Q2: the page's own "Something to sit with" question; answer is a 1-2
  // sentence pointer from the existing perspective + the Big Book page ref.
  let pointer = sents[sents.length - 1] || s1;
  if (pointer.length < 60 && sents.length >= 2) pointer = `${sents[sents.length - 2]} ${pointer}`;
  if (pointer.length > 320) pointer = sents[sents.length - 1];
  const a2 = bookRef ? `${pointer} (Big Book: ${bookRef})` : pointer;

  // Visible "Quick answers" section, above the footer (after the disclaimer)
  const faqHtml = [
    `      <!-- regen-seo:faq -->`,
    `      <section class="dr-faq">`,
    `        <h2 class="dr-faq-title">Quick answers</h2>`,
    `        <div class="dr-faq-item">`,
    `          <h3>${escText(q1)}</h3>`,
    `          <p>${escText(a1)}</p>`,
    `        </div>`,
    `        <div class="dr-faq-item">`,
    `          <h3>${escText(question)}</h3>`,
    `          <p>${escText(a2)}</p>`,
    `        </div>`,
    `      </section>`,
    `      <!-- /regen-seo:faq -->`,
  ].join("\n");

  const faqCss = `\n    /* regen-seo:faq-css */\n    .dr-faq { max-width: 760px; margin: 2.6rem auto 0; }\n    .dr-faq-title { font-family: var(--font-display); color: var(--gold); font-size: 0.95rem; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin-bottom: 1rem; }\n    .dr-faq-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; margin-bottom: 10px; text-align: left; }\n    .dr-faq-item h3 { color: var(--text); font-size: 0.95rem; margin: 0 0 8px; }\n    .dr-faq-item p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.65; margin: 0; }\n    /* /regen-seo:faq-css */\n  `;

  // JSON-LD: FAQPage + BreadcrumbList (must mirror visible content)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: q1, acceptedAnswer: { "@type": "Answer", text: a1 } },
      { "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: a2 } },
    ],
  };
  const crumbLd = breadcrumbLd([
    ["Home", `${SITE}/`],
    ["Daily Reflection", `${SITE}/daily-reflection/`],
    [month, `${SITE}/daily-reflection/${monthLower}/`],
    [`${month} ${day}`, `${SITE}/daily-reflection/${slug}/`],
  ]);

  // Insert: schema after the existing Article JSON-LD script
  const anchor = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  if (!anchor) throw new Error(`[${slug}] no Article JSON-LD anchor`);
  html = html.replace(
    anchor[0],
    `${anchor[0]}\n  <!-- regen-seo:phase2 -->\n  ${ldScript(faqLd)}\n  ${ldScript(crumbLd)}\n  <!-- /regen-seo:phase2 -->`
  );

  // Insert: FAQ css before </style>, FAQ section after the disclaimer
  html = mustReplace(html, /<\/style>/, `${faqCss}</style>`, "style close", slug);
  html = mustReplace(
    html,
    /(<p class="dr-disclaimer">[\s\S]*?<\/p>)/,
    `$1\n${faqHtml}`,
    "disclaimer anchor",
    slug
  );

  if (!opts.dry) fs.writeFileSync(file, html, "utf8");
  return { slug, q1, a1, q2: question, a2 };
}

function phase2Hub(monthLower, opts) {
  const month = monthLower[0].toUpperCase() + monthLower.slice(1);
  const file = path.join(DR, monthLower, "index.html");
  let html = stripGenerated(fs.readFileSync(file, "utf8"));
  const crumbLd = breadcrumbLd([
    ["Home", `${SITE}/`],
    ["Daily Reflection", `${SITE}/daily-reflection/`],
    [month, `${SITE}/daily-reflection/${monthLower}/`],
  ]);
  const anchor = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  if (!anchor) throw new Error(`[hub ${monthLower}] no JSON-LD anchor`);
  html = html.replace(anchor[0], `${anchor[0]}\n  <!-- regen-seo:phase2 -->\n  ${ldScript(crumbLd)}\n  <!-- /regen-seo:phase2 -->`);
  if (!opts.dry) fs.writeFileSync(file, html, "utf8");
  return { hub: monthLower };
}

function phase2Download(opts) {
  const file = path.join(ROOT, "download", "index.html");
  let html = stripGenerated(fs.readFileSync(file, "utf8"));

  // Read tier names + prices from the live page markup so they can't drift.
  const tiers = [];
  const tierRe = /<h3>([^<]+)<\/h3>\s*<div class="tier-price">\$([\d.]+)/g;
  let m;
  while ((m = tierRe.exec(html)) !== null) tiers.push({ name: m[1].trim(), price: m[2] });
  if (tiers.length < 3) throw new Error(`[download] expected 3 tiers, found ${tiers.length}`);

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Recovery Einstein",
    operatingSystem: "Web, Android",
    applicationCategory: "HealthApplication",
    url: "https://app.recoverystarts.com",
    description: "AI-powered AA Big Book companion app with four Einstein personality modes, voice conversations, and daily reflections.",
    offers: tiers.map((t) => ({
      "@type": "Offer",
      name: t.name,
      price: t.price,
      priceCurrency: "USD",
    })),
  };
  // Replace the existing SoftwareApplication block in place.
  html = mustReplace(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n  ${JSON.stringify(appLd)}\n  </script>`,
    "SoftwareApplication JSON-LD",
    "download"
  );
  if (!opts.dry) fs.writeFileSync(file, html, "utf8");
  return { tiers };
}

function phase2Home(opts) {
  const file = path.join(ROOT, "index.html");
  let html = stripGenerated(fs.readFileSync(file, "utf8"));

  // Collect social profile URLs already present in the page.
  const sameAs = [];
  const socialRe = /href="(https:\/\/(?:youtube\.com|instagram\.com|tiktok\.com|x\.com|facebook\.com|twitter\.com)\/[^"]+)"/g;
  let m;
  while ((m = socialRe.exec(html)) !== null) {
    if (!sameAs.includes(m[1])) sameAs.push(m[1]);
  }
  if (sameAs.length < 5) throw new Error(`[home] expected ≥5 social URLs, found ${sameAs.length}`);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Recovery Starts",
    url: "https://recoverystarts.com",
    logo: "https://recoverystarts.com/assets/einstein-character.png",
    sameAs,
  };
  const anchor = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  if (!anchor) throw new Error(`[home] no JSON-LD anchor`);
  html = html.replace(anchor[0], `${anchor[0]}\n  <!-- regen-seo:phase2 -->\n  ${ldScript(orgLd)}\n  <!-- /regen-seo:phase2 -->`);
  if (!opts.dry) fs.writeFileSync(file, html, "utf8");
  return { sameAs };
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
  const phase1 = args.includes("--phase1");
  const phase2 = args.includes("--phase2");
  if (!phase1 && !phase2) {
    console.error("Specify --phase1 and/or --phase2");
    process.exit(1);
  }

  const slugs = [];
  for (const m of MONTHS) {
    for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) slugs.push(`${m}-${d}`);
  }
  const targets = only ? [only] : slugs;

  const results = [];
  const errors = [];
  if (phase1) {
    for (const slug of targets) {
      try {
        results.push(processDayPage(slug, { dry }));
      } catch (e) {
        errors.push(e.message);
      }
    }
  }
  if (phase2) {
    const p2results = [];
    for (const slug of targets) {
      try {
        p2results.push(phase2DayPage(slug, { dry }));
      } catch (e) {
        errors.push(e.message);
      }
    }
    if (!only) {
      for (const m of MONTHS) {
        try {
          phase2Hub(m, { dry });
        } catch (e) {
          errors.push(e.message);
        }
      }
      try {
        const dl = phase2Download({ dry });
        console.log("download tiers:", JSON.stringify(dl.tiers));
      } catch (e) {
        errors.push(e.message);
      }
      try {
        const home = phase2Home({ dry });
        console.log("home sameAs:", JSON.stringify(home.sameAs));
      } catch (e) {
        errors.push(e.message);
      }
    }
    console.log(`${dry ? "[DRY RUN] " : ""}Phase 2: ${p2results.length}/${targets.length} day pages`);
    if (only) {
      for (const r of p2results) {
        console.log(`  Q1: ${r.q1}\n  A1: ${r.a1}\n  Q2: ${r.q2}\n  A2: ${r.a2}`);
      }
    }
    if (errors.length) {
      console.error(`\nERRORS (${errors.length}):`);
      for (const e of errors) console.error("  " + e);
      process.exit(1);
    }
    if (!phase1) return;
  }

  // --- Report ---
  const byTitleMode = {};
  const byDescMode = {};
  for (const r of results) {
    byTitleMode[r.titleMode] = (byTitleMode[r.titleMode] || 0) + 1;
    byDescMode[r.descMode] = (byDescMode[r.descMode] || 0) + 1;
  }
  if (only) {
    for (const r of results) {
      console.log(`  theme: ${r.themeRaw}`);
      console.log(`  title (${r.titleLen}): ${r.title}`);
      console.log(`  desc  (${r.descLen}): ${r.desc}`);
    }
  }
  console.log(`${dry ? "[DRY RUN] " : ""}Processed ${results.length}/${targets.length} pages`);
  console.log("Title modes:", JSON.stringify(byTitleMode));
  console.log("Desc modes:", JSON.stringify(byDescMode));

  const truncated = results.filter((r) => r.titleMode === "truncated" || r.titleMode === "dateonly");
  if (truncated.length) {
    console.log(`\nTruncated titles (${truncated.length}):`);
    for (const r of truncated) console.log(`  ${r.slug}: "${r.themeRaw}" -> "${r.title}" (${r.titleLen})`);
  }
  const fallbacks = results.filter((r) => r.descMode === "fallback");
  if (fallbacks.length) {
    console.log(`\nFallback descriptions (${fallbacks.length}):`);
    for (const r of fallbacks) console.log(`  ${r.slug}: ${r.desc}`);
  }
  if (errors.length) {
    console.error(`\nERRORS (${errors.length}):`);
    for (const e of errors) console.error("  " + e);
    process.exit(1);
  }
}

main();
