/**
 * Search result composition — vanilla-JS mirror of the app's BigBook.tsx
 * handleSearch() (client/src/pages/BigBook.tsx). The app is the spec: this
 * module reproduces its layering, ordering, and dedupe rules exactly, so the
 * site's results match the app's for the same query.
 *
 * Layer order (identical to the app):
 *   1. Direct page jump ("417", "page 83", "xxv") — resolved through the
 *      verified printed-label map.
 *   2. Hardcoded knowledge (steps with their page RANGES, chapters, special
 *      references) — skipping entries already shown as quick-cards.
 *   3. Ranked full-text search — ONLY when the query is not a page jump
 *      (the app skips full-text entirely on a jump), deduped against pages
 *      already in the list and against the quick-cards.
 *
 * Quick-cards (searchPhraseIndex) are computed by the caller and passed in,
 * mirroring the app where they render instantly outside the debounced path.
 *
 * @typedef {Object} ComposedResult
 * @property {string} type          "Page" | "Step" | "Chapter" | "Reference" | "Exact Match" | "Text Match"
 * @property {string} title
 * @property {string} page          printed label, may be a range ("89-103")
 * @property {number} pageIndex     sheet index, -1 when the entry has no single sheet
 * @property {string} description
 * @property {{text:string,highlight:boolean}[]} [snippetParts]
 */
import { searchKnowledge } from "./bigBookKnowledge.js";

/** First printed label of a possibly-ranged page string ("89-103" → "89"). */
export function firstLabel(page) {
  return page.split("-")[0].trim();
}

/**
 * Compose the debounced result list for a query, exactly as the app does.
 *
 * @param {string} query        the raw query as typed
 * @param {Object} opts
 * @param {import("./bookSearch.js").BookSearch|null} opts.engine  full-text engine (null while the index loads)
 * @param {Array<{page:number|string}>} opts.quick  quick-cards already shown for this query
 * @param {string} [opts.chapter]  chapter filter (unused on the site page, kept for parity)
 * @returns {ComposedResult[]}
 */
export function composeResults(query, { engine, quick, chapter } = {}) {
  const results = [];

  // Pages already shown as quick matches must not repeat below.
  // Knowledge pages can be ranges ("72-88") — compare by first label.
  const quickPages = new Set((quick ?? []).map((r) => String(r.page)));
  const isQuickDupe = (page) =>
    page !== "" && quickPages.has(firstLabel(page));

  // Direct page jump ("417", "page 59", "p. 83", "xxv") resolved through
  // the verified printed-label -> sheet mapping
  const jump = engine?.pageJump(query) ?? null;
  if (jump) {
    results.push({
      type: "Page",
      title: `Page ${jump.label}`,
      page: jump.label,
      pageIndex: jump.sheetIndex,
      description: `Go directly to page ${jump.label}`,
    });
  }

  // Search hardcoded knowledge (chapters, steps, references)
  for (const kr of searchKnowledge(query)) {
    if (isQuickDupe(kr.page)) continue;
    results.push({ ...kr, pageIndex: -1 });
  }

  // Ranked full-text search: exact phrase above token relevance, fuzzy
  // typo tolerance, chapter-name boost, highlighted snippets
  if (engine && !jump) {
    const taken = new Set(results.map((r) => r.page));
    for (const h of engine.search(query, { chapter: chapter || undefined, limit: 20 })) {
      if (taken.has(h.label) || isQuickDupe(h.label)) continue;
      taken.add(h.label);
      results.push({
        type: h.exactPhrase ? "Exact Match" : "Text Match",
        title: `Page ${h.label}`,
        page: h.label,
        pageIndex: h.sheetIndex,
        description: h.section,
        snippetParts: h.snippet,
      });
    }
  }

  return results;
}
