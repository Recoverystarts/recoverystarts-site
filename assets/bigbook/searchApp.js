/**
 * Big Book search UI controller for recoverystarts.com.
 *
 * THE APP IS THE SPEC (app.recoverystarts.com → Big Book → search). Result
 * content, layering, ordering, and dedupe all come from composeResults()
 * (searchPipeline.js), which mirrors the app's BigBook.tsx handleSearch()
 * exactly. This file only owns the static page's presentation:
 *   • quick-cards (phraseSearch, ≤2) render instantly from the bundled phrase
 *     index — no network needed
 *   • the 1 MB full-text index (search-index.json) is LAZY-LOADED (after first
 *     paint / on first interaction) so it never blocks render or SEO
 *   • page-number queries ("page 83", "417", "xxv") show that page's text
 *     (the site has no reader to jump into) — and, like the app, a page jump
 *     SKIPS the full-text list
 *   • "step N" / chapter / reference queries surface the knowledge cards with
 *     their page RANGES ("Step 12 · pp. 89–103"), exactly like the app
 *   • full-text hits (bookSearch) render with <mark> snippets + page + section
 *
 * Free search. The only CTA points to /download/. Never links to /demo.
 */
import { BookSearch } from "./bookSearch.js";
import { searchPhraseIndex } from "./phraseSearch.js";
import { composeResults, firstLabel } from "./searchPipeline.js";

const INDEX_EDITION = "4th";
const INDEX_URL = "/bigbook/search-index.json";

// ── DOM ──────────────────────────────────────────────────────────────────────
const input = document.getElementById("bb-input");
const clearBtn = document.getElementById("bb-clear");
const results = document.getElementById("bb-results");
const empty = document.getElementById("bb-empty");
const status = document.getElementById("bb-status");
const suggestions = document.getElementById("bb-suggestions");

// ── Lazy index load ──────────────────────────────────────────────────────────
let engine = null;
let entriesByLabel = null;
let indexPromise = null;
// Monotonic search token: every render-clearing or render-producing path bumps
// it so a slow in-flight search (during the first 1 MB index load) can't resolve
// and repaint over a newer query or a cleared box.
let seq = 0;

function ensureIndex() {
  if (indexPromise) return indexPromise;
  indexPromise = fetch(INDEX_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`index ${r.status}`);
      return r.json();
    })
    .then((entries) => {
      engine = new BookSearch(entries);
      entriesByLabel = new Map();
      for (const e of entries) {
        const k = e.l.toLowerCase();
        if (!entriesByLabel.has(k)) entriesByLabel.set(k, e);
      }
      return engine;
    })
    .catch((err) => {
      indexPromise = null; // allow retry
      throw err;
    });
  return indexPromise;
}

// ── Escaping ─────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) =>
  esc(s).replace(/"/g, "&quot;");

// ── Ligature fold (mirror of the engine, for page-view text) ─────────────────
const LIGATURES = {
  "ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl",
  "’": "'", "‘": "'", "“": '"', "”": '"',
};
const normalize = (t) => t.replace(/[ﬀ-ﬄ‘’“”]/g, (c) => LIGATURES[c] ?? c);

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

function pageViewHtml(label) {
  const e = entriesByLabel && entriesByLabel.get(String(label).toLowerCase());
  if (!e) return "";
  const text = normalize(e.t);
  return `
    <article class="bb-card bb-page">
      <div class="bb-card-head">
        <span class="bb-badge">Page ${esc(e.l)}</span>
        <span class="bb-cite">${esc(e.s)}</span>
      </div>
      <div class="bb-pagetext">${esc(text).replace(/\n+/g, "<br>")}</div>
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

  // A page jump renders FULL WIDTH above the columns — a page of text needs
  // reading room — and (like the app) a jump skips the full-text list entirely.
  if (jump) {
    const view = pageViewHtml(jump.page);
    if (view) head = `<section class="bb-group jump"><h2 class="bb-group-title">Jump to page ${esc(jump.page)}</h2>${view}</section>`;
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

  // Quick-cards need no network — show them immediately.
  const quick = searchPhraseIndex(query);
  render(query, { quick, loading: true });
  setStatus("Searching…");

  let eng = null;
  try {
    eng = await ensureIndex();
  } catch {
    if (mine !== seq) return;
    // Knowledge cards don't need the index — compose without the engine.
    render(query, { quick, composed: composeResults(query, { engine: null, quick }), loading: false });
    setStatus("The full-text index could not load. Quick answers are still available.");
    return;
  }
  if (mine !== seq) return; // a newer query superseded this one

  const composed = composeResults(query, { engine: eng, quick });
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
  // Warm the index on first focus so the first real query is instant.
  input.addEventListener("focus", () => { ensureIndex().catch(() => {}); }, { once: true });

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

  // Prefetch the index after first paint even if the user hasn't interacted.
  const warm = () => ensureIndex().catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 2500 });
  else setTimeout(warm, 1200);
}

// Boot at the end of module evaluation, after every helper/const above is
// initialized — calling init() earlier would run the ?q= auto-search while
// consts like `esc`/`CTA` are still in the temporal dead zone.
if (input) init();
