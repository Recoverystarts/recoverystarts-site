/**
 * Big Book full-text search engine — vanilla-JS port of the app's
 * client/src/utils/bookSearch.ts (WO-einstein-max-reach Phase 6), ported
 * byte-faithfully for recoverystarts.com so the site inherits the exact
 * ranking, page-jump, fuzzy, and highlighted-snippet behaviour.
 *
 * MiniSearch-backed engine over the realigned search index:
 *  - exact-phrase matching ranks above token matches
 *  - relevance ranking with section/chapter-name boost
 *  - fuzzy/typo tolerance ("resentement" still finds resentment)
 *  - direct page jumps ("417", "page 59", "p. 83", "xxv") resolved through the
 *    verified printed-label -> sheet mapping, never by array offset
 *  - snippets with highlighted match segments for <mark> rendering
 *  - chapter filtering
 *
 * OCR text uses print ligatures (ﬁ, ﬂ) and curly quotes; both the index terms
 * and the displayed snippets are normalized so "find" matches "ﬁnd".
 *
 * @typedef {Object} SearchIndexEntry
 * @property {number} i  sheet index in book-index.json, -1 if the page has no scan
 * @property {string} l  printed page label ("59", "xxv")
 * @property {string} s  section name
 * @property {string} t  page text
 *
 * @typedef {Object} SnippetPart
 * @property {string} text
 * @property {boolean} highlight
 *
 * @typedef {Object} BookSearchHit
 * @property {string} label
 * @property {number} sheetIndex
 * @property {string} section
 * @property {number} score
 * @property {boolean} exactPhrase
 * @property {SnippetPart[]} snippet
 *
 * @typedef {Object} PageJump
 * @property {string} label
 * @property {number} sheetIndex
 */
import MiniSearch from "./minisearch.js";

const LIGATURES = {
  "ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl",
  "’": "'", "‘": "'", "“": '"', "”": '"',
};

export function normalizeText(text) {
  return text.replace(/[ﬀ-ﬄ‘’“”]/g, (c) => LIGATURES[c] ?? c);
}

function processTerm(term) {
  const t = normalizeText(term).toLowerCase().replace(/[^a-z0-9]/g, "");
  return t.length > 1 ? t : null;
}

const ROMAN_RX = /^x{0,3}(?:ix|iv|v?i{0,3})$/;

function escapeRx(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class BookSearch {
  constructor(entries) {
    this.byId = new Map();
    this.labelToEntry = new Map();
    this.sectionList = [];
    this.minArabic = Infinity;
    this.maxArabic = -Infinity;

    this.mini = new MiniSearch({
      fields: ["t", "s"],
      storeFields: ["l", "s", "i"],
      processTerm,
      searchOptions: {
        processTerm,
        boost: { s: 3 },
        combineWith: "AND",
        fuzzy: 0.2,
        // prefix-match only the final term, so "accep" finds acceptance while
        // earlier terms stay exact-ish
        prefix: (_term, i, terms) => i === terms.length - 1,
      },
    });

    const docs = entries.map((e, id) => ({ id, t: e.t, s: e.s }));
    this.mini.addAll(docs);

    const seenSections = new Set();
    entries.forEach((e, id) => {
      this.byId.set(id, { ...e, norm: normalizeText(e.t) });
      const key = e.l.toLowerCase();
      if (!this.labelToEntry.has(key)) this.labelToEntry.set(key, e);
      if (/^\d+$/.test(e.l)) {
        const n = parseInt(e.l, 10);
        if (n < this.minArabic) this.minArabic = n;
        if (n > this.maxArabic) this.maxArabic = n;
      }
      if (e.s && !seenSections.has(e.s)) {
        seenSections.add(e.s);
        this.sectionList.push(e.s);
      }
    });
  }

  /** Distinct section names in book order, for the chapter filter. */
  chapters() {
    return this.sectionList;
  }

  /**
   * Detect a page-number query ("417", "page 59", "p. 83", "#61", "xxv") and
   * resolve it through the printed-label map. Arabic labels with no sheet
   * (blank/unscanned pages) resolve to the nearest scanned neighbour.
   */
  pageJump(query) {
    const m = query.match(/^\s*(?:p(?:age|g)?\.?\s*)?#?\s*(\d{1,3}|[ivxl]{1,7})\s*$/i);
    if (!m) return null;
    const raw = m[1].toLowerCase();

    if (/^\d+$/.test(raw)) {
      const n = parseInt(raw, 10);
      // Only pages the book actually has — "0" or "600" must not snap to a
      // neighbour; blank in-range pages (e.g. 166) resolve to the nearest scan.
      if (n < this.minArabic || n > this.maxArabic) return null;
      for (const cand of [n, n + 1, n - 1, n + 2, n - 2, n + 3, n - 3]) {
        const e = this.labelToEntry.get(String(cand));
        if (e && e.i >= 0) return { label: e.l, sheetIndex: e.i };
      }
      return null;
    }

    if (!ROMAN_RX.test(raw)) return null;
    const e = this.labelToEntry.get(raw);
    return e && e.i >= 0 ? { label: e.l, sheetIndex: e.i } : null;
  }

  search(query, opts = {}) {
    const limit = opts.limit ?? 20;
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const quoted = /^["'‘’“”].*["'‘’“”]$/.test(trimmed);
    const phrase = normalizeText(trimmed.replace(/^["'‘’“”]+|["'‘’“”]+$/g, "")).trim();
    const inChapter = (e) => !opts.chapter || e.s === opts.chapter;

    // 1. Exact contiguous phrase — tokens may be separated by any
    // non-alphanumeric run, so commas, quotes, and line breaks in the printed
    // text don't break the match. Quoted single short words ("god", "we")
    // still run, whole-word anchored so they don't match inside other words.
    const exactIds = new Set();
    const words = (phrase.toLowerCase().match(/[a-z0-9]+/g) ?? []);
    let phraseRx = null;
    if (words.length >= 2 || (words.length === 1 && (quoted || words[0].length >= 4))) {
      const body = words.map(escapeRx).join("[^a-z0-9]+");
      const rx = words.length === 1 && words[0].length < 4
        ? new RegExp(`(?<![a-z0-9])${body}(?![a-z0-9])`, "i")
        : new RegExp(body, "i");
      phraseRx = rx;
      this.byId.forEach((e, id) => {
        if (inChapter(e) && rx.test(e.norm)) exactIds.add(id);
      });
    }

    // 2. Token search (AND, fall back to OR when nothing matches). Quoted
    // queries also run it — not to add pages, but so exact-phrase hits carry a
    // relevance component instead of all tying and truncating in book order.
    // MiniSearch's filter receives the stored fields on the result object.
    const chapterOk = (r) =>
      !opts.chapter || r.s === opts.chapter;
    let tokenResults = this.mini.search(phrase, { filter: chapterOk });
    if (tokenResults.length === 0) {
      tokenResults = this.mini.search(phrase, { combineWith: "OR", filter: chapterOk });
    }

    // 3. Merge: exact-phrase pages first, then token relevance. The basic-text
    // chapters get a nudge above the Personal Stories so the doctrine page
    // outranks a story quoting it (e.g. "half measures" -> p.59 before p.305).
    const doctrineBonus = (id) => {
      const s = this.byId.get(id)?.s ?? "";
      return s.startsWith("Personal Stories") ? 0 : 0.4;
    };
    const hits = new Map();
    const maxToken = tokenResults.length ? tokenResults[0].score : 1;
    for (let ri = 0; ri < tokenResults.length; ri++) {
      const r = tokenResults[ri];
      const id = r.id;
      hits.set(id, { score: r.score / maxToken + doctrineBonus(id) * 0.3, exact: false, terms: r.terms ?? [] });
    }
    exactIds.forEach((id) => {
      const prev = hits.get(id);
      hits.set(id, { score: 10 + (prev?.score ?? 0) + doctrineBonus(id), exact: true, terms: prev?.terms ?? [] });
    });
    // Quoted queries return exact-phrase pages only
    if (quoted) {
      for (const id of Array.from(hits.keys())) {
        if (!exactIds.has(id)) hits.delete(id);
      }
    }

    const ranked = Array.from(hits.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit);

    return ranked.map(([id, h]) => {
      const e = this.byId.get(id);
      return {
        label: e.l,
        sheetIndex: e.i,
        section: e.s,
        score: h.score,
        exactPhrase: h.exact,
        snippet: this.buildSnippet(e.norm, h.exact ? phraseRx : null, h.terms.length ? h.terms : words),
      };
    });
  }

  /**
   * Build a ~170-char snippet around the best match, split into plain and
   * highlighted parts. Prefers the exact phrase when present, else the first
   * matched term cluster.
   */
  buildSnippet(norm, phraseRx, terms) {
    const flat = norm.replace(/\s+/g, " ");
    const termRx = terms.length
      ? new RegExp(`\\b(${terms.map(escapeRx).join("|")})[a-z]*`, "gi")
      : null;

    let anchor = -1;
    let anchorLen = 0;
    if (phraseRx) {
      const m = flat.match(phraseRx);
      if (m && m.index !== undefined) { anchor = m.index; anchorLen = m[0].length; }
    }
    if (anchor === -1 && termRx) {
      const m = termRx.exec(flat);
      if (m) { anchor = m.index; anchorLen = m[0].length; }
    }
    if (anchor === -1) { anchor = 0; anchorLen = 0; }

    const PAD = 80;
    let start = Math.max(0, anchor - PAD);
    let end = Math.min(flat.length, anchor + anchorLen + PAD);
    // extend to word boundaries
    while (start > 0 && /\S/.test(flat[start - 1])) start--;
    while (end < flat.length && /\S/.test(flat[end])) end++;
    const window = flat.slice(start, end);

    const parts = [];
    const prefix = start > 0 ? "…" : "";
    const suffix = end < flat.length ? "…" : "";

    const highlightRx = phraseRx
      ? new RegExp(`${phraseRx.source}|${termRx ? termRx.source : "$^"}`, "gi")
      : termRx;

    if (!highlightRx) return [{ text: prefix + window + suffix, highlight: false }];

    let last = 0;
    const globalRx = new RegExp(highlightRx.source, "gi");
    let m;
    while ((m = globalRx.exec(window)) !== null) {
      if (m[0].length === 0) { globalRx.lastIndex++; continue; }
      const idx = m.index;
      if (idx > last) parts.push({ text: (parts.length === 0 ? prefix : "") + window.slice(last, idx), highlight: false });
      else if (parts.length === 0 && prefix) parts.push({ text: prefix, highlight: false });
      parts.push({ text: m[0], highlight: true });
      last = idx + m[0].length;
    }
    if (last < window.length) parts.push({ text: window.slice(last) + suffix, highlight: false });
    else if (suffix) parts.push({ text: suffix, highlight: false });
    if (parts.length === 0) parts.push({ text: prefix + window + suffix, highlight: false });
    return parts;
  }
}
