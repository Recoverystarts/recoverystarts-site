/**
 * Big Book search UI controller for recoverystarts.com.
 *
 * Wires the ported engines to the static search page:
 *   • quick-cards (phraseSearch, ≤2) render instantly from the bundled phrase
 *     index — no network needed
 *   • the 1 MB full-text index (search-index.json) is LAZY-LOADED (after first
 *     paint / on first interaction) so it never blocks render or SEO
 *   • full-text hits (bookSearch) render with <mark> snippets + page + section
 *   • page-number queries ("page 83", "417", "xxv") resolve to a direct jump
 *     that shows that page's text
 *   • "step N" quick-cards also surface where the Step is lived in the book
 *
 * Free search. The only CTA points to /download/. Never links to /demo.
 */
import { BookSearch } from "./bookSearch.js";
import { searchPhraseIndex } from "./phraseSearch.js";
import { STEP_PRACTICE_REFS } from "./bigBookPhraseIndex.js";

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

function stepNumberOf(card) {
  for (const a of card.aliases ?? []) {
    const m = /^step (\d{1,2})$/.exec(a.toLowerCase());
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function pageButton(label, extra) {
  return `<button type="button" class="bb-pagelink" data-page="${escAttr(label)}">${esc(extra ?? "p. " + label)}</button>`;
}

function quickCardHtml(card) {
  const pageLabel = String(card.page);
  const stepN = stepNumberOf(card);
  const ref = stepN != null ? STEP_PRACTICE_REFS[stepN] : null;

  const links = (card.links ?? [])
    .map(
      (l) =>
        `<a class="bb-pamphlet" href="${escAttr(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    )
    .join("");

  const practice = ref
    ? `<div class="bb-practice">Where it's lived in the Big Book:
         <button type="button" class="bb-pagelink strong" data-page="${escAttr(String(ref.page))}">${esc(ref.label)} — p.${esc(String(ref.page))} →</button>
       </div>`
    : "";

  return `
    <article class="bb-card bb-quick">
      <div class="bb-card-head">
        <span class="bb-badge">Quick answer</span>
        <span class="bb-cite">${esc(card.chapter)} · ${pageButton(pageLabel)}</span>
      </div>
      <p class="bb-quote">${esc(card.snippet)}</p>
      ${practice}
      ${links ? `<div class="bb-pamphlets"><span class="bb-pamphlets-lbl">Read the Traditions</span>${links}</div>` : ""}
    </article>`;
}

function hitHtml(hit) {
  return `
    <article class="bb-card bb-hit">
      <div class="bb-card-head">
        <span class="bb-cite">${esc(hit.section)} · ${pageButton(hit.label)}</span>
        ${hit.exactPhrase ? `<span class="bb-badge subtle">exact phrase</span>` : ""}
      </div>
      <p class="bb-snippet">${snippetHtml(hit.snippet)}</p>
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

  const blocks = [];

  // 1. Direct page jump (if the whole query is a page reference)
  if (state.jump) {
    const view = pageViewHtml(state.jump.label);
    if (view) blocks.push(`<section class="bb-group"><h2 class="bb-group-title">Jump to page ${esc(state.jump.label)}</h2>${view}</section>`);
  }

  // 2. Quick answers
  if (state.quick && state.quick.length) {
    blocks.push(
      `<section class="bb-group"><h2 class="bb-group-title">Quick answers</h2>${state.quick.map(quickCardHtml).join("")}</section>`
    );
  }

  // 3. Full-text hits
  if (state.loading) {
    blocks.push(`<section class="bb-group"><h2 class="bb-group-title">Searching the Big Book…</h2><div class="bb-skeleton"></div><div class="bb-skeleton"></div></section>`);
  } else if (state.full && state.full.length) {
    blocks.push(
      `<section class="bb-group"><h2 class="bb-group-title">In the Big Book</h2>${state.full.map(hitHtml).join("")}</section>`
    );
  } else if (!state.jump && (!state.quick || !state.quick.length)) {
    blocks.push(
      `<section class="bb-group"><p class="bb-noresults">No pages matched “${esc(query)}.” Try a word or short phrase from the text, a page number, or a topic like <em>resentment</em> or <em>acceptance</em>.</p></section>`
    );
  }

  blocks.push(CTA);
  results.innerHTML = blocks.join("");

  const counts = [
    state.jump ? "1 page" : "",
    state.quick && state.quick.length ? `${state.quick.length} quick answer${state.quick.length > 1 ? "s" : ""}` : "",
    state.full ? `${state.full.length} passage${state.full.length === 1 ? "" : "s"}` : "",
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

  let eng;
  try {
    eng = await ensureIndex();
  } catch {
    if (mine !== seq) return;
    render(query, { quick, loading: false, full: [] });
    setStatus("The full-text index could not load. Quick answers are still available.");
    return;
  }
  if (mine !== seq) return; // a newer query superseded this one

  const jump = eng.pageJump(query);
  const full = eng.search(query, { limit: 20 });
  render(query, { quick, jump, full, loading: false });
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
