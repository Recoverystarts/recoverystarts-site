/**
 * verify-live.js — measure the DEPLOYED preview, not the local files.
 * "It's in the HTML" is not verification. Fetch it and check what actually shipped.
 */
const BASE = "https://feat-seo-buildout.recoverystarts-site.pages.dev";
const PROD = "https://recoverystarts.com";

const urls = [
  "/",
  "/big-book/pages/",
  "/big-book/page-64/",     // GSC demand, was a 404
  "/big-book/page-83/",     // curated — must be unchanged
  "/big-book/page-417/",    // "417 big book acceptance"
  "/big-book/page-xxv/",    // roman
  "/big-book/page-563/",    // the Long Form
  "/big-book/page-277/",    // BLANK — must 404
  "/daily-tradition/",
  "/daily-tradition/july-1/",
  "/daily-tradition/july-12/",
  "/daily-tradition/july-31/",
  "/daily-tradition/today/",
  "/sitemap.xml",
];

(async () => {
  console.log("PREVIEW: " + BASE + "\n");
  let fails = 0;
  for (const u of urls) {
    const r = await fetch(BASE + u, { redirect: "manual" });
    const expect404 = u === "/big-book/page-277/";
    const good = expect404 ? r.status === 404 : r.status === 200;
    if (!good) fails++;
    console.log((good ? "  OK  " : "  !!  ") + r.status + "  " + u + (expect404 ? "   (blank page — 404 is correct)" : ""));
  }

  console.log("\n--- Measuring the deployed DOM ---\n");

  // page-64
  let h = await (await fetch(BASE + "/big-book/page-64/")).text();
  const title = (h.match(/<title>(.*?)<\/title>/) || [])[1];
  const quote = (h.match(/<blockquote>(?:… )?"([\s\S]*)"(?: …)?<\/blockquote>/) || [])[1];
  console.log("page-64 title : " + title);
  console.log("page-64 quote : " + (quote || "").slice(0, 120) + "…");
  console.log("page-64 quote length: " + (quote || "").length + " chars  (cap 340)");
  console.log("  has canonical      : " + /rel="canonical"/.test(h));
  console.log("  has Article JSON-LD: " + /"@type":"Article"/.test(h));
  console.log("  no-repro disclaimer: " + /full text of the book is not reproduced/.test(h));

  // How much book text is on the page in total? The whole point of the rewrite.
  const bodyText = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  console.log("  total page text    : " + bodyText.length + " chars (of which BOOK text = " + (quote || "").length + ")");

  // Daily tradition
  h = await (await fetch(BASE + "/daily-tradition/july-1/")).text();
  console.log("\njuly-1 title  : " + (h.match(/<title>(.*?)<\/title>/) || [])[1]);

  console.log("  long form 563-566 : " + h.includes("563–566"));
  console.log("  short form 561-562: " + h.includes("561–562"));
  console.log("  governance line   : " + /governance, not theology/.test(h));

  // Hub
  h = await (await fetch(BASE + "/big-book/pages/")).text();
  const links = (h.match(/href="\/big-book\/page-/g) || []).length;
  console.log("\nlibrary hub   : " + links + " page links rendered");

  h = await (await fetch(BASE + "/daily-tradition/")).text();
  const dlinks = (h.match(/href="\/daily-tradition\/july-/g) || []).length;
  console.log("traditions hub: " + dlinks + " day links rendered");
  console.log("  FAQPage JSON-LD : " + /"@type":"FAQPage"/.test(h));

  // Sitemap
  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  console.log("\nsitemap URLs  : " + (sm.match(/<loc>/g) || []).length);

  // PRODUCTION must be untouched.
  const p = await fetch(PROD + "/daily-tradition/", { redirect: "manual" });
  const p2 = await fetch(PROD + "/big-book/page-64/", { redirect: "manual" });
  console.log("\n--- Production is UNTOUCHED (as it should be) ---");
  console.log("  recoverystarts.com/daily-tradition/  -> " + p.status + " (404 expected — not merged)");
  console.log("  recoverystarts.com/big-book/page-64/ -> " + p2.status + " (404 expected — not merged)");

  console.log(fails ? "\n" + fails + " URL(s) wrong.\n" : "\nAll live URLs correct.\n");
})();
