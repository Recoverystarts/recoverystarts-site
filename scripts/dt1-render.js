/**
 * dt1-render.js — render Daily Tradition pages for months that don't exist yet
 * (wave dt1: January–June), using a LIVE page as the template.
 *
 * WHY A LIVE PAGE: build-traditions-pages.js is stale against the live HTML
 * (patch-one-tradition.js explains it): nav, icons, OG, the Einstein CTA, the
 * footer and the 988 line were patched into the pages and never folded back.
 * So a new day page is october-3/index.html with every day-specific piece
 * swapped out, and a new month page is october/index.html the same way. The
 * chrome is then byte-for-byte what the other 184 pages wear.
 *
 * New pages are English-only until a translation wave reaches them, so they
 * carry no 🌐 and no es/pt hreflang: the 🌐's remembered-language redirect
 * (globe.mjs GO_JS) would otherwise send a Spanish reader to a /es/ page that
 * doesn't exist yet.
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const SITE = "https://recoverystarts.com";

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const MONTH_TRADITION = Object.fromEntries(MONTHS.map((m, i) => [m, i + 1]));
const DAYS_IN = { january: 31, february: 29, march: 31, april: 30, may: 31, june: 30, july: 31, august: 31, september: 30, october: 31, november: 30, december: 31 };
const KINDS = ["the threat", "before the tradition", "the threat today", "how a group breaks it", "how it gets captured"];
// Same table as build-traditions-pages.js / refresh-tradition-hub.js (the five-question rows).
const KIND_BADGE = {
  "hypothetical":          { label: "Where it goes wrong",   cls: "hyp" },
  "the earned answer":     { label: "The earned answer",     cls: "earned" },
  "the threat":            { label: "The threat",            cls: "earned" },
  "before the tradition":  { label: "Before the Tradition",  cls: "earned" },
  "the threat today":      { label: "The threat today",      cls: "earned" },
  "how a group breaks it": { label: "How a group breaks it", cls: "hyp" },
  "how it gets captured":  { label: "How it gets captured",  cls: "earned" },
};
const PUBLISHED = "2026-10-12";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const mdEm = (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");

const TRAD = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "twelve-traditions.json"), "utf8"));
const shortFormFor = (n) => TRAD.traditions.find((t) => t.n === n).short;

// ── Source blocks (the traditions-source.md format) ──────────────────────────
const HEAD_RX = /^### (\w+) (\d+) — "(.+?)" · \*\((.+?)\)\*[ \t]*$/;
function parseBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let cur = null;
  lines.forEach((line, i) => {
    const m = line.match(HEAD_RX);
    if (m) {
      if (cur) out.push(cur);
      cur = { line: i + 1, heading: line, month: m[1].toLowerCase(), day: +m[2], title: m[3], kind: m[4], rest: [] };
    } else if (cur) {
      cur.rest.push(line);
    } else if (line.trim()) {
      out.push({ line: i + 1, stray: line });
    }
  });
  if (cur) out.push(cur);
  for (const b of out) {
    if (b.stray) continue;
    while (b.rest.length && !b.rest[b.rest.length - 1].trim()) b.rest.pop();
    const body = b.rest[0] || "";
    const sit = b.rest.find((l) => l.startsWith("*Sit with:* "));
    const gr = b.rest.find((l) => l.startsWith("*Grounded in:* "));
    b.body = body;
    b.sitWith = sit ? sit.slice("*Sit with:* ".length) : "";
    b.groundedIn = gr ? gr.slice("*Grounded in:* ".length) : "";
    b.key = `${b.month}-${b.day}`;
    b.tradition = MONTH_TRADITION[b.month];
  }
  return out;
}

// ── Menu: a month with readings is a link; one without stays "coming" ───────
function stampMenu(html, liveMonths) {
  for (const m of MONTHS) {
    const n = MONTH_TRADITION[m];
    const soon = `<li class="sub-soon">${cap(m)}<small>Tradition ${n} · coming</small></li>`;
    const live = `<li><a href="/daily-tradition/${m}/">${cap(m)}<small>Tradition ${n}</small></a></li>`;
    html = html.split(liveMonths.includes(m) ? soon : live).join(liveMonths.includes(m) ? live : soon);
  }
  return html;
}
// The 12-month strip on the hub and every month page.
function stampMonthStrip(html, liveMonths, current) {
  return html.replace(/<div class="dt-months"([^>]*)>([\s\S]*?)<\/div>(\s*\n)/, (all, attrs, inner, tail) => {
    const cells = MONTHS.map((m) => {
      const n = MONTH_TRADITION[m];
      if (!liveMonths.includes(m)) return `<div class="dt-month soon" id="month-${m}"><span class="m">${cap(m)}</span><span class="t">Tradition ${n}</span></div>`;
      const gold = m === current ? ` style="border-color:var(--gold)"` : "";
      return `<a class="dt-month live" id="month-${m}" href="/daily-tradition/${m}/"${gold}><span class="m">${cap(m)}</span><span class="t">Tradition ${n} · live</span></a>`;
    }).join("");
    return `<div class="dt-months"${attrs}>${cells}</div>${tail}`;
  });
}

// English-only: drop the 🌐 and the es/pt alternates; point en + x-default here.
function englishOnly(html, url) {
  html = html.replace(/<details class="rs-globe">[\s\S]*?<\/details>/, "");
  html = html.replace(/\s*<link rel="alternate" hreflang="(?!en"|x-default")[^"]+" href="[^"]*" data-i18n>/g, "");
  html = html.replace(/(<link rel="alternate" hreflang="(?:en|x-default)" href=")[^"]*(")/g, `$1${url}$2`);
  return html;
}

function setMeta(html, { title, desc, url }) {
  const rep = (rx, val, what) => {
    if (!rx.test(html)) throw new Error("template: no " + what);
    html = html.replace(rx, (m, a, b) => a + val + b);
  };
  rep(/(<title>)[^<]*(<\/title>)/, esc(title), "title");
  rep(/(<meta name="description" content=")[^"]*(")/, escAttr(desc), "description");
  rep(/(<meta property="og:title" content=")[^"]*(")/, escAttr(title), "og:title");
  rep(/(<meta property="og:description" content=")[^"]*(")/, escAttr(desc), "og:description");
  rep(/(<meta property="og:url" content=")[^"]*(")/, url, "og:url");
  rep(/(<meta name="twitter:title" content=")[^"]*(")/, escAttr(title), "twitter:title");
  rep(/(<meta name="twitter:description" content=")[^"]*(")/, escAttr(desc), "twitter:description");
  rep(/(<link rel="canonical" href=")[^"]*(")/, url, "canonical");
  return html;
}

function replaceLd(html, type, obj) {
  const rx = new RegExp(`(<script type="application/ld\\+json">\\s*)\\{"@context":"https://schema.org","@type":"${type}"[\\s\\S]*?(\\s*</script>)`);
  if (!rx.test(html)) throw new Error("template: no ld " + type);
  return html.replace(rx, (m, a, b) => a + JSON.stringify(obj) + b);
}

const crumbLd = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) });

const LONGFORM_BOX = (n, short) => `      <div class="dt-tradition">
        <h2>Tradition ${n}</h2>
        <blockquote>"${esc(short)}"</blockquote>
        <div class="dt-longform">
          <strong>Read the Long Form (pp. 563–566).</strong> The short form on pp. 561–562 is the one everybody quotes — but the <strong>Long Form</strong> is where the Traditions actually say what they mean. Tradition 3's "no other affiliation" clause, for instance, exists <em>only</em> in the Long Form. That single clause is why no treatment centre can own an A.A. group. Most of what circulates online skips it.
          <br><br>
          And a distinction worth keeping straight: <strong>the Traditions are governance, not theology.</strong> They bind A.A. <em>groups</em> and the Fellowship — not individuals, and not outside businesses. They were adopted in 1950 to keep A.A. from being owned or co-opted. They are not a rulebook for your personal life.
        </div>
      </div>`;
const DISCLAIMER = `      <p class="dt-disc">Daily Traditions is an independent educational resource from Recovery Starts — <strong>not official A.A. literature</strong>, not affiliated with Alcoholics Anonymous World Services, and not medical advice. The Twelve Traditions are the property of A.A. Page references are to <em>Alcoholics Anonymous</em> (the Big Book), 4th Edition: short form 561–562, <strong>long form 563–566</strong>. If you're in crisis, call or text 988 (Suicide &amp; Crisis Lifeline).</p>`;

function descFor(d) {
  const M = cap(d.month);
  const teaser = d.body.replace(/\s+/g, " ").slice(0, 120).replace(/\s\S*$/, "");
  return `${M} ${d.day} — "${d.title}." A daily reading on A.A.'s Tradition ${d.tradition}: ${shortFormFor(d.tradition).replace(/\.$/, "")}. ${teaser}…`.slice(0, 250);
}

// ── Day page ────────────────────────────────────────────────────────────────
function renderDay(tpl, d, prev, next, liveMonths) {
  const M = cap(d.month), n = d.tradition, key = d.key;
  const url = `${SITE}/daily-tradition/${key}/`;
  const title = `Tradition ${n} — ${M} ${d.day}: ${d.title} | Daily Traditions | Recovery Starts`;
  const desc = descFor(d);
  const badge = KIND_BADGE[d.kind];
  if (!badge) throw new Error(`unknown kind "${d.kind}" on ${key}`);
  let html = setMeta(tpl, { title, desc, url });
  html = replaceLd(html, "Article", {
    "@context": "https://schema.org", "@type": "Article", headline: `Tradition ${n} — ${M} ${d.day}: ${d.title}`, description: desc,
    author: { "@type": "Organization", name: "Recovery Starts", url: SITE },
    publisher: { "@type": "Organization", name: "Recovery Starts", logo: { "@type": "ImageObject", url: `${SITE}/assets/og/logo-512.png` } },
    image: `${SITE}/assets/og/og-daily.jpg`, datePublished: PUBLISHED, dateModified: PUBLISHED,
    mainEntityOfPage: { "@type": "WebPage", "@id": url }, isPartOf: { "@type": "WebSite", name: "Recovery Starts", url: SITE },
  });
  html = replaceLd(html, "BreadcrumbList", crumbLd([["Home", `${SITE}/`], ["Daily Traditions", `${SITE}/daily-tradition/`], [M, `${SITE}/daily-tradition/${d.month}/`], [`${M} ${d.day}: ${d.title}`, url]]));
  html = englishOnly(html, url);
  html = html.replace(/(utm_campaign=floating-cta&amp;utm_content=)daily-tradition-[a-z]+-\d+/, `$1daily-tradition-${key}`);
  const prevA = prev
    ? `<a href="/daily-tradition/${prev.key}/"><small>← ${M} ${prev.day}</small>${esc(prev.title)}</a>`
    : `<a href="/daily-tradition/${d.month}/"><small>←</small>All of ${M}</a>`;
  const nextA = next
    ? `<a class="dt-nav-next" href="/daily-tradition/${next.key}/"><small>${M} ${next.day} →</small>${esc(next.title)}</a>`
    : `<a class="dt-nav-next" href="/daily-tradition/${d.month}/"><small>→</small>All of ${M}</a>`;
  const utm = `utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=daily-traditions&amp;utm_content=${key}`;
  const main = `<main id="main"><section class="dt-wrap"><div class="container">
      <img class="dt-einstein-bg" src="/assets/einstein/traditions-embed.webp" alt="" aria-hidden="true" width="760" height="760" loading="lazy">
      <nav class="dt-crumb"><a href="/">Home</a> / <a href="/daily-tradition/">Daily Traditions</a> / <a href="/daily-tradition/${d.month}/">${M}</a> / ${M} ${d.day}</nav>
      <div class="dt-kicker">Tradition ${n} · ${M} ${d.day}</div>
      <h1 class="dt-title">${esc(d.title)}</h1>
      <p class="dt-date">Daily Traditions · ${M} ${d.day}</p>
      <div class="dt-center"><span class="dt-badge ${badge.cls}">${badge.label}</span></div>

      <div class="dt-reading">
        <p>${mdEm(d.body)}</p>
      </div>

      <div class="dt-sit">
        <span class="lbl">Sit with</span>
        <p>${mdEm(d.sitWith)}</p>
      </div>
      <p class="dt-grounded">Grounded in: ${esc(d.groundedIn)}</p>


${LONGFORM_BOX(n, shortFormFor(n))}

      <div class="dt-chips">
        <a href="/12-traditions/">What the Traditions actually say →</a>
        <a href="/big-book/page-563/">The Long Form, p. 563 →</a>
        <a href="/big-book/search/">Search the Big Book →</a>
        <a href="/daily-tradition/${d.month}/">Every day this month →</a>
      </div>

      <div class="dt-cta">
        <a href="https://app.recoverystarts.com/?${utm}" class="btn btn-primary" target="_blank" rel="noopener">Ask Recovery Einstein about Tradition ${n} →</a>
        <a href="/download/?${utm}" class="btn btn-outline">Get the app →</a>
      </div>

      <div class="dt-nav">
        ${prevA}
        <a class="dt-nav-mid" href="/daily-tradition/${d.month}/"><small>Tradition ${n}</small>All of ${M}</a>
        ${nextA}
      </div>

${DISCLAIMER}
  </div></section></main>`;
  html = html.replace(/<main id="main">[\s\S]*?<\/main>/, () => main);
  return stampMenu(html, liveMonths);
}

// ── Month page ──────────────────────────────────────────────────────────────
function renderMonth(tpl, month, days, liveMonths) {
  const M = cap(month), n = MONTH_TRADITION[month];
  const url = `${SITE}/daily-tradition/${month}/`;
  // Same title/description pattern as the live month pages (read off october/).
  const tm = tpl.match(/<title>([^<]*)<\/title>/)[1].replace(/October/g, M).replace(/Tradition 10/g, `Tradition ${n}`);
  let html = tpl;
  const oldDesc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const desc = oldDesc.replace(/October/g, M).replace(/Tradition 10/g, `Tradition ${n}`).replace(/31 readings|31 daily readings/g, (s) => s.replace("31", String(days.length)))
    .replace(/Alcoholics Anonymous has no opinion on outside issues; hence the A\.A\. name ought never be drawn into public controversy/g, shortFormFor(n).replace(/\.$/, ""));
  html = setMeta(html, { title: tm, desc, url });
  html = replaceLd(html, "BreadcrumbList", crumbLd([["Home", `${SITE}/`], ["Daily Traditions", `${SITE}/daily-tradition/`], [M, url]]));
  // The month's CollectionPage/ItemList ld (whatever its @type), rebuilt from the days.
  html = html.replace(/(<script type="application\/ld\+json">\s*)(\{[^\n]*?"hasPart"[^\n]*\})(\s*<\/script>)/, (all, a, json, b) => {
    const o = JSON.parse(json);
    o.name = String(o.name || "").replace(/October/g, M).replace(/Tradition 10/g, `Tradition ${n}`);
    if (o.description) o.description = o.description.replace(/October/g, M).replace(/Tradition 10/g, `Tradition ${n}`).replace(/\b31 readings/, `${days.length} readings`);
    if (o.url) o.url = url;
    o.hasPart = days.map((d) => ({ "@type": "Article", headline: `${M} ${d.day}: ${d.title}`, url: `${SITE}/daily-tradition/${d.key}/` }));
    return a + JSON.stringify(o) + b;
  });
  html = englishOnly(html, url);
  const grid = days.map((d) => `        <a class="dt-day" href="/daily-tradition/${d.key}/">
          <span class="d">${M} ${d.day}</span>
          <span class="t">${esc(d.title)}</span>
          <span class="k">${esc(d.kind)}</span>
        </a>`).join("\n");
  html = html.replace(/(<div class="dt-days"[^>]*>\n)[\s\S]*?(\n      <\/div>)/, (all, a, b) => a + grid + b);
  html = html.replace(/(<nav class="dt-crumb">[\s\S]*?\/ )October(<\/nav>)/, `$1${M}$2`);
  html = html.replace(/<h1 class="dt-title">October<\/h1>/, `<h1 class="dt-title">${M}</h1>`);
  html = html.replace(/<p class="dt-date">Tradition 10 · 31 readings<\/p>/, `<p class="dt-date">Tradition ${n} · ${days.length} readings</p>`);
  html = html.replace(/      <div class="dt-tradition">[\s\S]*?\n        <\/div>\n      <\/div>/, () => LONGFORM_BOX(n, shortFormFor(n)));
  html = html.replace(/<p><strong>How October reads\.<\/strong>[\s\S]*?<\/p>/, () => `<p><strong>How ${M} reads.</strong> The month runs on five questions, straight through, over and over: <em>what specifically threatened A.A.</em> · <em>how the founders solved it before there was a Tradition</em> · <em>where that same danger lives now</em> · <em>how a group drifts off it on its own</em> · <em>how it gets hollowed out from outside</em>. Every five days tells the whole Tradition once, then comes back new — no incident, quote or image is used twice. Anything inside quotation marks is A.A.'s own wording, printed exactly, with the source named at the foot of the reading. The explaining around it is ours — plain modern English, and scenes drawn to show how the Tradition actually plays out. You should always be able to tell which is which.</p>`);
  html = html.replace(/utm_content=month-october/g, `utm_content=month-${month}`);
  html = html.replace(/Ask Recovery Einstein about Tradition 10 →/g, `Ask Recovery Einstein about Tradition ${n} →`);
  html = stampMonthStrip(html, liveMonths, month);
  html = stampMenu(html, liveMonths);
  // Leftovers from the October template, outside the menu and the 12-month strip (both name every month).
  const head = html.split("</head>")[0];
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [""])[0].replace(/<div class="dt-months"[\s\S]*?<\/div>\s*\n/, "");
  const left = (head + main).match(/October|october-\d|Tradition 10\b/g);
  if (left) throw new Error(`month ${month}: template text left over: ${[...new Set(left)].join(", ")}`);
  return html;
}

module.exports = { MONTHS, MONTH_TRADITION, DAYS_IN, KINDS, KIND_BADGE, cap, esc, parseBlocks, renderDay, renderMonth, stampMenu, stampMonthStrip, englishOnly, shortFormFor, descFor, ROOT };
