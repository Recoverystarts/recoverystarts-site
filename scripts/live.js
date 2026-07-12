const B = "https://feat-seo-buildout.recoverystarts-site.pages.dev";
const cb = "?cb=" + Date.now();

(async () => {
  console.log("PREVIEW: " + B + "\n");

  console.log("=== /12-traditions/ — the canonical correction page ===");
  const r = await fetch(B + "/12-traditions/" + cb);
  const h = await r.text();
  console.log("  status: " + r.status + "   " + (h.length / 1024).toFixed(0) + " KB");

  const ld = [...h.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = ld.find((x) => x["@type"] === "FAQPage");
  console.log("  FAQPage schema: " + (faq ? faq.mainEntity.length + " Q&A pairs, machine-readable" : "MISSING"));
  if (faq) faq.mainEntity.slice(0, 4).forEach((q, i) => console.log("    " + (i + 1) + ". " + q.name));

  console.log("\n  doctrine present on the live page:");
  const checks = [
    ["governance, not theology", /governance/i],
    ["nothing to do with God or a higher power", /nothing to do with God/i],
    ["binds groups, not individuals", /not a rulebook for a member/i],
    ["Tradition 3 'no other affiliation'", /no other affiliation/i],
    ["short form 561-562", /561–562/],
    ["LONG FORM 563-566", /563–566/],
    ["Concepts 574-575", /574–575/],
    ["does NOT republish the Traditions", /quote only short clauses/i],
  ];
  for (const [name, rx] of checks) console.log("    " + (rx.test(h) ? "yes" : "NO !!") + "  " + name);

  console.log("\n=== FAQ layer on the Big Book pages ===");
  for (const p of ["/big-book/page-563/", "/big-book/page-64/", "/big-book/page-83/"]) {
    const t = await (await fetch(B + p + cb)).text();
    const l = [...t.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) => JSON.parse(m[1]));
    const f = l.find((x) => x["@type"] === "FAQPage");
    console.log("  " + p.padEnd(24) + (f ? f.mainEntity.length + " FAQ pairs" : "no FAQPage") + "   (page-83 is the curated one)");
  }

  const t563 = await (await fetch(B + "/big-book/page-563/" + cb)).text();
  const l563 = [...t563.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map((m) => JSON.parse(m[1]));
  const f563 = l563.find((x) => x["@type"] === "FAQPage");
  console.log("\n  What a machine reads off page 563:");
  f563.mainEntity.forEach((q) => console.log("    Q: " + q.name));

  console.log("\n=== nothing broke ===");
  for (const p of ["/", "/daily-tradition/", "/big-book/pages/", "/big-book/search/", "/daily-reflection/july-12/", "/12-steps/"]) {
    const x = await fetch(B + p, { redirect: "manual" });
    console.log("  " + x.status + "  " + p);
  }
  const gone = await fetch(B + "/bigbook/search-index.json" + cb);
  console.log("  " + gone.status + "  /bigbook/search-index.json  (410 = the book is still gone)");
})();
