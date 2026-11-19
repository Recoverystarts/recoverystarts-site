/**
 * /api/bigbook-search — server-side Big Book search.
 *
 * The full 4th-edition text lives in `functions/_lib/` (Pages doesn't serve
 * that directory as a static asset) and is bundled into this Worker at build
 * time. There is no URL that returns it.
 *
 * A response carries page label, chapter, and a ~170-char snippet with the
 * match highlighted, capped by SNIPPET_CAP below. Pagination is 4th edition.
 * It runs the same BookSearch engine, phrase index, knowledge layer and
 * composeResults pipeline as assets/bigbook/.
 */

import { BookSearch } from "../../assets/bigbook/bookSearch.js";
import { searchPhraseIndex } from "../../assets/bigbook/phraseSearch.js";
import { composeResults } from "../../assets/bigbook/searchPipeline.js";
import ENTRIES from "../_lib/big-book-text.json";

// The most book text put in a response, per snippet. The engine builds
// ~170-char snippets (80 chars of padding either side of the match); this is
// a ceiling on top of that.
const SNIPPET_CAP = 320;

// Cold-start once per isolate, then reused across requests.
let engine = null;
function getEngine() {
  if (!engine) engine = new BookSearch(ENTRIES);
  return engine;
}

/** Truncate any run of book text to the cap, at a word boundary. */
function capParts(parts) {
  if (!Array.isArray(parts)) return [];
  const out = [];
  let used = 0;
  for (const p of parts) {
    const text = String(p.text ?? "");
    if (used + text.length <= SNIPPET_CAP) {
      out.push({ text, highlight: !!p.highlight });
      used += text.length;
      continue;
    }
    const room = SNIPPET_CAP - used;
    if (room > 12) {
      let cut = text.slice(0, room);
      const sp = cut.lastIndexOf(" ");
      if (sp > 0) cut = cut.slice(0, sp);
      out.push({ text: cut + " …", highlight: !!p.highlight });
    }
    break;
  }
  return out;
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();

  const headers = {
    "content-type": "application/json; charset=utf-8",
    // Same query -> same answer. Let the edge carry the load.
    "cache-control": "public, max-age=3600, s-maxage=86400",
    "access-control-allow-origin": "https://recoverystarts.com",
  };

  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ query: q, quick: [], results: [] }), { headers });
  }
  if (q.length > 120) {
    return new Response(JSON.stringify({ error: "query too long" }), { status: 400, headers });
  }

  try {
    const eng = getEngine();

    // Curated quick-cards (short, page-cited) — same as the app.
    const quick = searchPhraseIndex(q) ?? [];

    // The full pipeline: page jump -> knowledge cards -> ranked full-text.
    const composed = composeResults(q, { engine: eng, quick });

    // Strip to the wire format. NOTHING here carries a page's full text.
    const results = composed.map((r) => ({
      type: r.type,
      title: r.title,
      page: String(r.page ?? ""),
      description: r.description ?? "",
      snippetParts: capParts(r.snippetParts),
    }));

    const quickOut = quick.slice(0, 3).map((c) => ({
      chapter: c.chapter,
      page: String(c.page),
      snippet: String(c.snippet ?? "").slice(0, SNIPPET_CAP),
    }));

    return new Response(
      JSON.stringify({ query: q, quick: quickOut, results: results.slice(0, 20) }),
      { headers }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "search failed", detail: String(err && err.message) }),
      { status: 500, headers }
    );
  }
}
