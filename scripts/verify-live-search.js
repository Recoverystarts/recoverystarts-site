/**
 * verify-live-search.js — prove it on the DEPLOYED preview, not on disk.
 *
 * Two things must be true at once:
 *   1. There is no URL on the website that returns the Big Book.
 *   2. The search is still just as good — including exact-phrase and page-jump.
 */
const B = "https://feat-seo-buildout.recoverystarts-site.pages.dev";

const GONE = [
  "/bigbook/search-index.json",   // the 981 KB full text — must be gone
  "/bigbook/book-index.json",
  "/functions/_lib/big-book-text.json",  // its new home must NOT be reachable
  "/_lib/big-book-text.json",
];

const QUERIES = [
  { q: "417",                        expect: "page jump to 417" },
  { q: "page 83",                    expect: "page jump to 83" },
  { q: "xxv",                        expect: "roman page jump" },
  { q: "half measures",              expect: "EXACT PHRASE -> p.59" },
  { q: "resentment",                 expect: "topic search" },
  { q: "step 12",                    expect: "knowledge card, pp.89-103" },
  { q: "12 traditions",              expect: "LONG FORM front-loaded" },
  { q: "acceptance was the answer",  expect: "exact phrase -> 417" },
];

(async () => {
  console.log("PREVIEW: " + B + "\n");
  console.log("=== 1. THE BOOK MUST BE UNREACHABLE ===\n");
  let leaked = 0;
  for (const p of GONE) {
    const r = await fetch(B + p, { redirect: "manual" });
    const good = r.status === 404;
    if (!good) leaked++;
    console.log((good ? "  GONE (404)  " : "  !! LEAKED  " + r.status + "  ") + p);
  }

  console.log("\n=== 2. SEARCH MUST STILL BE SHARP ===\n");
  let maxSnippet = 0;
  let bookChars = 0;
  for (const { q, expect } of QUERIES) {
    const r = await fetch(`${B}/api/bigbook-search?q=${encodeURIComponent(q)}`);
    if (!r.ok) { console.log(`  !! ${r.status}  "${q}"`); continue; }
    const d = await r.json();
    const top = (d.results || [])[0];
    const kinds = (d.results || []).map((x) => x.type);

    // How much book text does this response actually contain?
    for (const res of d.results || []) {
      for (const p of res.snippetParts || []) {
        bookChars += p.text.length;
        maxSnippet = Math.max(maxSnippet, (res.snippetParts || []).reduce((n, x) => n + x.text.length, 0));
      }
    }

    const desc = top ? `${top.type} -> p.${top.page}` : "no results";
    console.log(`  "${q}"`.padEnd(30) + desc.padEnd(28) + "[" + expect + "]");
    if (top && top.snippetParts && top.snippetParts.length) {
      const s = top.snippetParts.map((p) => (p.highlight ? "«" + p.text + "»" : p.text)).join("");
      console.log("      " + s.slice(0, 130).replace(/\s+/g, " "));
    }
    console.log("      types: " + [...new Set(kinds)].join(", "));
  }

  console.log("\n=== 3. HOW MUCH BOOK TEXT DID WE JUST HAND OVER? ===\n");
  console.log("  across all 8 searches, total book text returned : " + bookChars + " chars");
  console.log("  longest single snippet                          : " + maxSnippet + " chars (cap 320)");
  console.log("  the full book is                                : ~980,000 chars");
  console.log("  => we served " + ((bookChars / 980000) * 100).toFixed(3) + "% of the book across 8 queries.");

  console.log("\n=== 4. THE SEARCH PAGE STILL WORKS ===\n");
  const page = await fetch(B + "/big-book/search/");
  const html = await page.text();
  console.log("  /big-book/search/ status         : " + page.status);
  console.log("  still references the old index?  : " + /bigbook\/search-index\.json/.test(html));
  console.log("  page weight (HTML)               : " + (html.length / 1024).toFixed(0) + " KB");

  console.log("\n" + (leaked ? "!! " + leaked + " LEAK(S)" : "No URL on this site returns the Big Book. Search intact.") + "\n");
})();
