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

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  const slugs = [];
  for (const m of MONTHS) {
    for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) slugs.push(`${m}-${d}`);
  }
  const targets = only ? [only] : slugs;

  const results = [];
  const errors = [];
  for (const slug of targets) {
    try {
      results.push(processDayPage(slug, { dry }));
    } catch (e) {
      errors.push(e.message);
    }
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
