const fs = require("fs");
const P = "https://recoverystarts.com";
const cb = () => "?cb=" + Date.now() + Math.random();
const TRAD = JSON.parse(fs.readFileSync("data/twelve-traditions.json", "utf8"));
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

(async () => {
  console.log("PRODUCTION: " + P + "\n");

  console.log("=== 1. THE BOOK IS GONE FROM THE PUBLIC WEB ===");
  for (const p of ["/bigbook/search-index.json", "/bigbook/book-index.json"]) {
    const r = await fetch(P + p + cb());
    const tag = r.status === 410 ? "410 GONE" : r.status === 404 ? "404" : "!! STILL SERVING — " + r.status;
    console.log("  " + tag.padEnd(28) + p);
  }

  console.log("\n=== 2. THE 12 TRADITIONS, LIVE, WORD FOR WORD ===");
  const h = dec(await (await fetch(P + "/12-traditions/" + cb())).text());
  let ok = 0;
  for (const t of TRAD.traditions) {
    if (h.includes(t.short) && h.includes(t.long)) ok++;
    else console.log("  !! T" + t.n + " missing");
  }
  console.log("  " + ok + "/12 published in FULL — short form AND long form, verbatim");
  console.log("  Tradition 3 clause on the open web: " + (h.includes("as a group, they have no other affiliation") ? "YES" : "NO"));

  console.log("\n=== 3. SEARCH STILL WORKS (server-side) ===");
  for (const q of ["417", "half measures", "step 12", "12 traditions"]) {
    const d = await (await fetch(P + "/api/bigbook-search?q=" + encodeURIComponent(q))).json();
    const t = (d.results || [])[0];
    console.log('  "' + q + '"' + " ".repeat(Math.max(0, 16 - q.length)) + " -> " + (t ? t.type + "  p." + t.page : "NO RESULTS"));
  }

  console.log("\n=== 4. THE NEW PAGES ARE LIVE ===");
  const urls = ["/", "/12-traditions/", "/big-book/pages/", "/big-book/page-64/", "/big-book/page-417/", "/big-book/page-xxv/",
                "/daily-tradition/", "/daily-tradition/today/", "/big-book/search/", "/sitemap.xml"];
  for (const u of urls) {
    const r = await fetch(P + u, { redirect: "manual" });
    console.log("  " + r.status + "  " + u);
  }

  console.log("\n=== 5. NOTHING OLD BROKE ===");
  for (const u of ["/daily-reflection/july-13/", "/meetings/", "/12-steps/", "/aa-info/", "/big-book/page-83/", "/download/"]) {
    const r = await fetch(P + u, { redirect: "manual" });
    console.log("  " + r.status + "  " + u);
  }

  const sm = await (await fetch(P + "/sitemap.xml" + cb())).text();
  console.log("\n  sitemap URLs live: " + (sm.match(/<loc>/g) || []).length);
})();
