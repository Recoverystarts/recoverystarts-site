/**
 * Big Book search UI controller for recoverystarts.com.
 *
 * THE APP IS THE SPEC (app.recoverystarts.com → Big Book → search). Result
 * content, layering, ordering, and dedupe all come from composeResults()
 * (searchPipeline.js) — which now runs SERVER-SIDE, in /api/bigbook-search.
 *
 * ── THE PRODUCT BOUNDARY (this is the whole design) ──────────────────────────
 *   THE WEBSITE tells you WHICH PAGE a passage is on, and shows you just enough
 *   to know it's the right one. THE APP is where you read the book.
 *
 * This file used to download the ENTIRE 4th-edition text (981 KB of
 * /bigbook/search-index.json) into every visitor's browser, and render a full
 * page of the book whenever someone clicked a page number. Between them, the
 * website was a copy of the Big Book with a search box on top. That was never
 * the product — and it staked the whole domain on something we don't need.
 *
 * Now: the text lives only inside the Worker (functions/_lib/, the one directory
 * Cloudflare Pages does not serve — verified: /functions/** 404s while
 * /scripts/**, /data/** and /tests/** all return 200). The browser sends a query
 * and gets back page numbers, chapters, and ~170-char highlighted snippets.
 * There is no URL that returns the book.
 *
 * Search quality is UNCHANGED: same BookSearch engine, same phrase index, same
 * knowledge layer, same composeResults pipeline, same tests. Exact-phrase search
 * still works. Only the location changed — and how little we say.
 *
 * What this file still owns:
 *   • quick-cards (phraseSearch, ≤2) still render INSTANTLY, client-side, from
 *     the curated short-quote index — no network, no perceived latency
 *   • "step N" / chapter / reference queries surface knowledge cards with page
 *     RANGES ("Step 12 · pp. 89–103"), exactly like the app
 *   • a page-number query ("page 83", "417", "xxv") now offers the PAGE, not the
 *     page's text — it points at /big-book/page-N/ and at the app
 *   • full-text hits render with <mark> snippets + page + section
 *
 * 4TH EDITION pagination. Always. It's the only edition anyone is holding.
 *
 * Free search. The only CTA points to /download/. Never links to /demo.
 */
import { searchPhraseIndex } from "./phraseSearch.js";
import { firstLabel } from "./searchPipeline.js";

const INDEX_EDITION = "4th";
const API_URL = "/api/bigbook-search";

// ── DOM ──────────────────────────────────────────────────────────────────────
const input = document.getElementById("bb-input");
const clearBtn = document.getElementById("bb-clear");
const results = document.getElementById("bb-results");
const empty = document.getElementById("bb-empty");
const status = document.getElementById("bb-status");
const suggestions = document.getElementById("bb-suggestions");

// ── Server-side search ───────────────────────────────────────────────────────
// Monotonic search token: every render-clearing or render-producing path bumps
// it so a slow in-flight request can't resolve and repaint over a newer query
// or a cleared box.
let seq = 0;

// Same query, same answer — and the edge caches it too. Don't re-ask.
const cache = new Map();

async function apiSearch(query, signal) {
  const key = query.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  const r = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, { signal });
  if (!r.ok) throw new Error(`search ${r.status}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  const composed = data.results ?? [];
  if (cache.size > 60) cache.clear();
  cache.set(key, composed);
  return composed;
}

// ── Escaping ─────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) =>
  esc(s).replace(/"/g, "&quot;");

// (The ligature fold that used to live here existed only to clean up full page
// text before printing it into the DOM. We don't print page text any more, and
// the server already folds ligatures inside the snippets it sends.)

// ── Rendering helpers ────────────────────────────────────────────────────────
function snippetHtml(parts) {
  return parts
    .map((p) => (p.highlight ? `<mark>${esc(p.text)}</mark>` : esc(p.text)))
    .join("");
}

/** "89-103" → "pp. 89–103"; "63" → "p. 63". Click always lands on the first page. */
function pageButton(page) {
  const label = String(page);
  const target = firstLabel(label);
  const display = label.includes("-")
    ? "pp. " + label.split("-").map((s) => s.trim()).join("–")
    : "p. " + label;
  return `<button type="button" class="bb-pagelink" data-page="${escAttr(target)}">${esc(display)}</button>`;
}

function quickCardHtml(card) {
  return `
    <article class="bb-card bb-quick">
      <div class="bb-card-head">
        <span class="bb-badge">Quick answer</span>
        <span class="bb-cite">${esc(card.chapter)} · ${pageButton(card.page)}</span>
      </div>
      <p class="bb-quote">${esc(card.snippet)}</p>
    </article>`;
}

/**
 * Steps / chapters / special references — the app's knowledge cards.
 *
 * SITE-ONLY PRESENTATION (approved divergence): the Twelve Traditions reference
 * is surfaced as the LONG FORM (pp. 563–566) so people actually discover the
 * complete text. This matters — Tradition Three's "no other affiliation" clause,
 * the one that says no treatment center can own an A.A. group, exists ONLY in the
 * Long Form. The short form (pp. 561–562) does not carry it, and the short form is
 * all most people are ever shown.
 *
 * The DATA is untouched: p.563 is still the underlying record and still the jump
 * target (pageButton uses firstLabel()). This is display only, so app-parity and
 * the pipeline tests both hold.
 */
function knowledgeCardHtml(r) {
  if (r.title === "Twelve Traditions") {
    return `
    <article class="bb-card bb-know bb-longform">
      <div class="bb-card-head">
        <span class="bb-badge">Long Form</span>
        <span class="bb-cite">Appendix I · ${pageButton("563-566")}</span>
      </div>
      <p class="bb-know-title">The Twelve Traditions — Long Form</p>
      <p class="bb-snippet">The complete, unabridged Traditions (pp. 563–566).</p>
      <p class="bb-longform-note">Most people are only ever shown the <strong>short form</strong> (pp. 561–562). The Long Form is the full text — it is where Tradition Three states that alcoholics may call themselves an A.A. group “provided that, as a group, they have no other affiliation.”</p>
    </article>`;
  }
  return `
    <article class="bb-card bb-know">
      <div class="bb-card-head">
        <span class="bb-badge">${esc(r.type)}</span>
        <span class="bb-cite">${pageButton(r.page)}</span>
      </div>
      <p class="bb-know-title">${esc(r.title)}</p>
      <p class="bb-snippet">${esc(r.description)}</p>
    </article>`;
}

function hitHtml(r) {
  return `
    <article class="bb-card bb-hit">
      <div class="bb-card-head">
        <span class="bb-cite">${esc(r.description)} · ${pageButton(r.page)}</span>
        ${r.type === "Exact Match" ? `<span class="bb-badge subtle">exact phrase</span>` : ""}
      </div>
      <p class="bb-snippet">${snippetHtml(r.snippetParts ?? [])}</p>
    </article>`;
}

/**
 * A page-number query used to dump that page's ENTIRE text into the DOM.
 *
 * It doesn't any more. The website's job is to tell you WHICH PAGE — and then
 * hand you off to the two places that should actually have the words: your own
 * copy of the book, or the app. So a page jump now offers the page's reference
 * card (/big-book/page-N/) and the app, and says so plainly.
 *
 * `description` here is the section/chapter, straight from the API.
 */
function pageCardHtml(r) {
  const label = String(r.page);
  const slug = label.toLowerCase();
  return `
    <article class="bb-card bb-page">
      <div class="bb-card-head">
        <span class="bb-badge">Page ${esc(label)}</span>
        ${r.description ? `<span class="bb-cite">${esc(r.description)}</span>` : ""}
      </div>
      <p class="bb-snippet">You're looking for <strong>page ${esc(label)}</strong> of the Big Book, 4th Edition.</p>
      <div class="bb-page-actions">
        <a class="btn btn-primary" href="/big-book/page-${escAttr(slug)}/">What's on page ${esc(label)} →</a>
        <a class="btn btn-outline" href="https://app.recoverystarts.com/?utm_source=recoverystarts&amp;utm_medium=site&amp;utm_campaign=bigbook-search&amp;utm_content=page-${escAttr(slug)}" target="_blank" rel="noopener">Read it in the app →</a>
      </div>
      <p class="bb-page-note">A.A. offers the whole book free — <a href="https://www.aa.org/the-big-book" target="_blank" rel="noopener">read this page at aa.org →</a> · <a href="/big-book/">Get your own copy →</a></p>
    </article>`;
}

const CTA = `
  <div class="bb-cta">
    <p>Reading the Big Book with someone who knows every page?</p>
    <a class="btn btn-primary" href="/download/">Meet Recovery Einstein →</a>
  </div>`;

function setStatus(msg) {
  if (status) status.textContent = msg;
}

// ── Render orchestration ─────────────────────────────────────────────────────
function renderEmpty() {
  seq++; // invalidate any in-flight search so it can't clobber the cleared UI
  if (empty) empty.style.display = "";
  if (suggestions) suggestions.style.display = "";
  results.innerHTML = "";
  setStatus("");
}

function render(query, state) {
  if (empty) empty.style.display = "none";
  if (suggestions) suggestions.style.display = "none";

  const composed = state.composed ?? [];
  const jump = composed.find((r) => r.type === "Page") ?? null;
  const knowledge = composed.filter(
    (r) => r.type === "Step" || r.type === "Chapter" || r.type === "Reference"
  );
  const full = composed.filter(
    (r) => r.type === "Exact Match" || r.type === "Text Match"
  );

  // Each section becomes ONE COLUMN of the results grid.
  const col = (title, body) =>
    `<section class="bb-group"><h2 class="bb-group-title">${title}</h2><div class="bb-group-body">${body}</div></section>`;

  let head = "";
  const cols = [];

  // A page jump renders FULL WIDTH above the columns, and (like the app) skips
  // the full-text list. It hands off to the page's reference card and the app
  // rather than printing the page.
  if (jump) {
    head = `<section class="bb-group jump"><h2 class="bb-group-title">Page ${esc(jump.page)}</h2>${pageCardHtml(jump)}</section>`;
  }

  // COLUMN 1 — THE ANSWER. Steps / chapters / references lead, on the left, so
  // the truth is front-loaded: visible immediately, no scrolling, no hunting.
  if (knowledge.length) {
    cols.push(col("Steps, chapters &amp; references", knowledge.map(knowledgeCardHtml).join("")));
  }

  // COLUMN 2 — quick answers.
  if (state.quick && state.quick.length) {
    cols.push(col("Quick answers", state.quick.map(quickCardHtml).join("")));
  }

  // COLUMN 3 — full-text hits (skipped on a page jump, like the app).
  if (state.loading) {
    cols.push(col("Searching the Big Book…", `<div class="bb-skeleton"></div><div class="bb-skeleton"></div>`));
  } else if (full.length) {
    cols.push(col("In the Big Book", full.map(hitHtml).join("")));
  }

  let body = cols.length ? `<div class="bb-cols">${cols.join("")}</div>` : "";

  if (!jump && !cols.length && !state.loading) {
    body = `<section class="bb-group"><p class="bb-noresults">No pages matched “${esc(query)}.” Try a word or short phrase from the text, a page number, or a topic like <em>resentment</em> or <em>acceptance</em>.</p></section>`;
  }

  results.innerHTML = head + body + CTA;

  const counts = [
    jump ? "1 page" : "",
    state.quick && state.quick.length ? `${state.quick.length} quick answer${state.quick.length > 1 ? "s" : ""}` : "",
    knowledge.length ? `${knowledge.length} reference${knowledge.length === 1 ? "" : "s"}` : "",
    !state.loading && full.length ? `${full.length} passage${full.length === 1 ? "" : "s"}` : "",
  ].filter(Boolean);
  if (!state.loading) setStatus(counts.length ? `Results for “${query}”: ${counts.join(", ")}.` : `No results for “${query}.”`);
}

// ── Search flow ──────────────────────────────────────────────────────────────
async function runSearch(rawQuery) {
  const query = rawQuery.trim();
  if (query.length < 2) {
    renderEmpty();
    return;
  }
  const mine = ++seq;

  // Quick-cards are curated short quotes bundled with the page — no network,
  // so they paint instantly while the server searches the full text.
  const quick = searchPhraseIndex(query);
  render(query, { quick, loading: true });
  setStatus("Searching…");

  let composed;
  try {
    composed = await apiSearch(query);
  } catch {
    if (mine !== seq) return;
    // The server search is unreachable. Quick answers still stand on their own.
    render(query, { quick, composed: [], loading: false });
    setStatus(
      quick.length
        ? "Full-text search is unavailable right now. Quick answers are still here."
        : "Search is unavailable right now. Please try again in a moment."
    );
    return;
  }
  if (mine !== seq) return; // a newer query superseded this one

  render(query, { quick, composed, loading: false });
}

// ── Wiring ───────────────────────────────────────────────────────────────────
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function init() {
  // Single source of truth for the indexed edition (WO: INDEX_EDITION = "4th").
  document.documentElement.dataset.bigbookEdition = INDEX_EDITION;

  const onInput = debounce(() => {
    clearBtn.style.display = input.value ? "" : "none";
    runSearch(input.value);
  }, 160);

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch(input.value);
    }
  });
  // There is no 1 MB index to warm any more — the search runs on the server and
  // the first query is a single small request. Nothing to prefetch.

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    renderEmpty();
    input.focus();
  });

  // Delegated clicks: suggestion chips + in-result page links.
  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-q]");
    if (chip) {
      input.value = chip.getAttribute("data-q");
      clearBtn.style.display = "";
      runSearch(input.value);
      input.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const pl = e.target.closest(".bb-pagelink");
    if (pl) {
      input.value = pl.getAttribute("data-page");
      clearBtn.style.display = "";
      runSearch(input.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Deep-link support for the WebSite SearchAction (?q=…).
  const params = new URLSearchParams(window.location.search);
  const q0 = (params.get("q") || "").trim();
  if (q0) {
    input.value = q0;
    clearBtn.style.display = "";
    runSearch(q0);
  }

  // Nothing to prefetch. The old build downloaded 981 KB of Big Book text here,
  // on every visit, before anyone had typed a thing. That page is now ~1 MB
  // lighter and the book isn't on the wire at all.
}

// Boot at the end of module evaluation, after every helper/const above is
// initialized — calling init() earlier would run the ?q= auto-search while
// consts like `esc`/`CTA` are still in the temporal dead zone.
if (input) init();
