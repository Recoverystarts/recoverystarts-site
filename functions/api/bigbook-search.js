/**
 * /api/bigbook-search — server-side Big Book search.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 * The search engine needs the full text of the Big Book. The PUBLIC does not.
 *
 * Until now the site shipped `/bigbook/search-index.json` — the complete
 * 4th-edition text, 981 KB, at a public URL, downloadable by anyone in one
 * request. And clicking a page number rendered that page's full text into the
 * DOM. Between them, the website was a copy of the book with a search box.
 *
 * That was never the product. The product boundary is:
 *
 *     THE WEBSITE tells you WHICH PAGE a passage is on, and shows you just
 *     enough to know it's the right one. THE APP is where you read the book.
 *
 * So the text moved to `functions/_lib/` — the one directory Cloudflare Pages
 * does NOT serve as a static asset (verified: /functions/** returns 404 while
 * /scripts/**, /data/**, /tests/** all return 200 — the repo root is public).
 * It is bundled into this Worker at build time. The full text now exists only
 * in the Worker's memory. There is no URL that returns it.
 *
 * What goes out over the wire: page label, chapter, and a ~170-char snippet
 * with the match highlighted. That's it. Enforced by SNIPPET_CAP below.
 *
 * 4TH EDITION ONLY. The pagination this returns is 4th-edition pagination,
 * which is the only pagination anyone in a meeting is holding.
 * See D:\Forge\research\DOCTRINE-4th-edition-only.md.
 *
 * Search quality is IDENTICAL to the old client-side search: it runs the exact
 * same BookSearch engine, the same phrase index, the same knowledge layer, and
 * the same composeResults pipeline. Same 38 tests. The engine didn't change —
 * only where it runs, and how little it says.
 */

import { BookSearch } from "../../assets/bigbook/bookSearch.js";
import { searchPhraseIndex } from "../../assets/bigbook/phraseSearch.js";
import { composeResults } from "../../assets/bigbook/searchPipeline.js";
import ENTRIES from "../_lib/big-book-text.json";

// The most book text we will EVER put in a response, per snippet. The engine
// builds ~170-char snippets (80 chars of padding either side of the match);
// this is the hard ceiling on top of that. Belt and braces.
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
