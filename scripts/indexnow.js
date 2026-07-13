/**
 * indexnow.js — submit the sitemap to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * IndexNow's 403 is famously unhelpful. It means "key rejected" and nothing else,
 * so we probe: single-URL GET first (clearest failure), then the batch POST.
 * Batch limit is 10,000 URLs per request.
 */
const KEY = "d4af37recoverystarts2026";
const HOST = "recoverystarts.com";
const KEY_LOC = `https://${HOST}/${KEY}.txt`;

const endpoints = ["https://api.indexnow.org", "https://www.bing.com", "https://yandex.com"];

(async () => {
  // 1. Single-URL GET — the simplest thing that can work.
  console.log("=== probe: single URL, GET ===");
  for (const ep of endpoints) {
    const u = `${ep}/indexnow?url=${encodeURIComponent("https://" + HOST + "/12-traditions/")}&key=${KEY}&keyLocation=${encodeURIComponent(KEY_LOC)}`;
    try {
      const r = await fetch(u);
      const body = await r.text();
      console.log(`  ${r.status}  ${ep}   ${body ? body.slice(0, 90) : ""}`);
    } catch (e) {
      console.log(`  ERR  ${ep}  ${e.message}`);
    }
  }

  // 2. Batch POST.
  const sm = await (await fetch(`https://${HOST}/sitemap.xml?cb=${Date.now()}`)).text();
  const urls = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  console.log(`\n=== batch POST: ${urls.length} URLs ===`);

  for (const ep of endpoints) {
    try {
      const r = await fetch(`${ep}/indexnow`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOC, urlList: urls }),
      });
      const body = await r.text();
      const verdict =
        r.status === 200 ? "ACCEPTED — URLs submitted" :
        r.status === 202 ? "ACCEPTED — key validation pending" :
        r.status === 400 ? "bad request (malformed)" :
        r.status === 403 ? "key rejected" :
        r.status === 422 ? "URLs don't match the host, or key mismatch" :
        r.status === 429 ? "rate limited" : "";
      console.log(`  ${r.status}  ${ep.padEnd(28)} ${verdict}  ${body ? body.slice(0, 80) : ""}`);
    } catch (e) {
      console.log(`  ERR  ${ep}  ${e.message}`);
    }
  }
})();
