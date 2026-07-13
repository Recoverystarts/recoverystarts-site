const fs = require("fs");
const B = "https://feat-seo-buildout.recoverystarts-site.pages.dev";
const cb = "?cb=" + Date.now();
const TRAD = JSON.parse(fs.readFileSync("data/twelve-traditions.json", "utf8"));

const dec = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

(async () => {
  const h = dec(await (await fetch(B + "/12-traditions/" + cb)).text());

  console.log("LIVE: " + B + "/12-traditions/\n");
  console.log("=== IS EVERY TRADITION ON THE LIVE PAGE, WORD FOR WORD? ===\n");

  let ok = 0;
  for (const t of TRAD.traditions) {
    const s = h.indexOf(t.short) !== -1;
    const l = h.indexOf(t.long) !== -1;
    if (s && l) ok++;
    console.log(
      "  T" + String(t.n).padStart(2) +
      "   short: " + (s ? "VERBATIM" : "MISSING!") +
      "   long: " + (l ? "VERBATIM" : "MISSING!") +
      "   (" + t.long.length + " chars)"
    );
  }
  console.log("\n  " + ok + "/12 Traditions published in FULL, BOTH FORMS, verbatim.\n");

  console.log("=== TRADITION 3, LONG FORM — LIVE ON THE PAGE ===\n");
  const t3 = TRAD.traditions[2].long;
  console.log("  " + t3.replace(/(.{78}\s)/g, "$1\n  "));
  console.log("\n  ^ 'as a group, they have no other affiliation' — on the open web: " + (h.includes("as a group, they have no other affiliation") ? "YES" : "NO"));

  console.log("\n=== ATTRIBUTION ===");
  for (const [n, rx] of [
    ["property of A.A.W.S.", /property of Alcoholics Anonymous World Services/],
    ["not an A.A. group", /not an A\.A\. group/],
    ["A.A. has not endorsed this", /has not approved, endorsed, or reviewed/],
    ["FAQPage schema", /"@type":"FAQPage"/],
  ]) console.log("  " + (rx.test(h) ? "yes" : "NO!") + "  " + n);

  console.log("\n=== NOTHING ELSE BROKE ===");
  for (const p of ["/", "/daily-tradition/", "/big-book/pages/", "/big-book/search/", "/aa-info/"]) {
    const r = await fetch(B + p, { redirect: "manual" });
    console.log("  " + r.status + "  " + p);
  }
})();
