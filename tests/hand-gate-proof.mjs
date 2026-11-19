// The hand gate in app.js, in a real browser.
//     node tests/hand-gate-proof.mjs            (from the repo root; writes tests/hand-gate-proof.txt)
// Serves this checkout from a local port, opens a page in Chromium the way each kind of visitor would, and counts what
// leaves the page: requests for Google's gtag.js and the ledger beacons. Google, Raptive and every other outside host
// are answered locally; nothing leaves this machine. With a second argument (a checkout of main) it also compares the
// full-page picture of the same page from both, with nobody touching it and after a mouse move.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MAIN = process.argv[2] ?? null;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain" };
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let failed = 0;
const check = (ok, what) => { say(`${ok ? "PASS" : "FAIL"}  ${what}`); if (!ok) failed++; };

function serve(root) {
  const srv = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    if (u.pathname.startsWith("/meetings/api/hand/")) { res.writeHead(204); return res.end(); } // the meetings service answers this one live
    let f = path.join(root, decodeURIComponent(u.pathname));
    if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "content-type": TYPES[path.extname(f)] ?? "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ base: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close() })));
}

const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
async function visit(base, urlPath, { referer, cookies = [], ua = UA, viewport = { width: 1920, height: 1080 }, act = null, stay = 500, mobile = false, shot = false, skip = [] } = {}) {
  const ctx = await browser.newContext({ userAgent: ua, viewport, locale: "en-US", isMobile: mobile, hasTouch: mobile });
  if (cookies.length) await ctx.addCookies(cookies.map((c) => ({ ...c, url: base })));
  const seen = { gtag: 0, beacons: [] };
  await ctx.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.origin === base && skip.includes(u.pathname)) return route.abort();
    if (u.origin === base) { if (u.pathname.startsWith("/meetings/api/hand/")) seen.beacons.push(u.pathname.replace("/meetings/api/hand/", "")); return route.continue(); }
    if (u.hostname === "www.googletagmanager.com") { seen.gtag++; return route.fulfill({ status: 200, contentType: "text/javascript", body: "/* gtag.js stand-in */" }); }
    return route.fulfill({ status: 200, contentType: "text/javascript", body: "" });
  });
  const page = await ctx.newPage();
  // for the picture comparison both renders get the same clock and the same "random" numbers: the home page's sky
  // (cosmos.js) scatters its stars with Math.random, so main differs from itself between two loads without this
  if (shot) { await page.clock.install({ time: new Date("2026-11-15T20:00:00Z") }); await page.addInitScript(() => { let x = 42; Math.random = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648; }); }
  const res = await page.goto(base + urlPath, { waitUntil: "load", ...(referer ? { referer } : {}) });
  if (res.status() !== 200) throw new Error(`${urlPath} answered ${res.status()}`);
  if (act) await act(page);
  await page.waitForTimeout(stay);
  seen.bodyClass = await page.evaluate(() => document.body.className);
  seen.queued = await page.evaluate(() => (window.dataLayer || []).map((a) => a[0]).join(","));
  seen.gtagFn = await page.evaluate(() => typeof window.gtag);
  // the home page's sky is a canvas of drifting particles plus CSS animation: main's own picture differs between two
  // loads. The picture is taken with animations stopped and that one canvas hidden, on both sides.
  if (shot) seen.png = await page.screenshot({ fullPage: true, animations: "disabled", style: "#particles{visibility:hidden!important}" });
  await ctx.close();
  return seen;
}
const moveMouse = async (page) => { await page.mouse.move(200, 200); await page.mouse.move(260, 240, { steps: 4 }); };

const s = await serve(ROOT);
try {
  const PAGE = "/start-here/";
  say(`# The hand gate in app.js, real Chromium ${browser.version()} — ${new Date().toISOString()}`);
  say(`# this checkout served locally; page: ${PAGE}; outside hosts answered locally\n`);

  let v = await visit(s.base, PAGE);
  check(v.gtag === 0 && v.queued === "", `crawler's shape (first visit, no referrer, desktop), nobody touching: Analytics never asked for (gtag.js requests: ${v.gtag})`);
  check(v.beacons.join() === "d/l", `  … ledger: [${v.beacons}]`);
  check(/\brs-wait-hand\b/.test(v.bodyClass) && v.gtagFn === "function", "  … <body> carries rs-wait-hand; gtag() is still defined for the page's own calls");
  v = await visit(s.base, PAGE, { act: moveMouse });
  check(v.gtag === 1 && v.queued.startsWith("js,config") && !/\brs-wait-hand\b/.test(v.bodyClass), `same shape, a person moves the mouse: Analytics starts, the mark is gone; ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { act: (p) => p.keyboard.press("Tab") });
  check(v.gtag === 1 && /^d\/k\/[0-5]$/.test(v.beacons[1] ?? ""), `same shape, a person presses a key: Analytics starts; ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { act: (p) => p.mouse.wheel(0, 500) });
  check(v.gtag === 1 && /^d\/[ws]\/[0-5]$/.test(v.beacons[1] ?? ""), `same shape, a person turns the wheel: Analytics starts; ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { act: (p) => p.evaluate(() => { window.dispatchEvent(new Event("scroll")); window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" })); }) });
  check(v.gtag === 0 && v.beacons.join() === "d/l", `same shape, a script fakes scroll and key events: still no Analytics; ledger [${v.beacons}]`);
  // a first visit from another site or a phone starts Analytics at the first hand or after 1.5 s in view
  v = await visit(s.base, PAGE, { referer: "https://www.google.com/" });
  check(v.gtag === 0 && v.beacons.join() === "c/l" && !/rs-wait-hand/.test(v.bodyClass), `arrives from Google, nobody touching, gone at 0.5 s: no Analytics yet, no mark; ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { referer: "https://www.google.com/", stay: 2500 });
  check(v.gtag === 1 && v.beacons.join() === "c/l" && !/rs-wait-hand/.test(v.bodyClass), `arrives from Google, nobody touching, still there at 2.5 s: Analytics started (1.5 s in view); ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { cookies: [{ name: "_ga", value: "GA1.1.1111.2222" }] });
  check(v.gtag === 1 && v.beacons.length === 0, `returning visitor (has _ga), no referrer: Analytics at once; nothing sent to the ledger`);
  const IPHONE = { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1", viewport: { width: 390, height: 844 }, mobile: true };
  v = await visit(s.base, PAGE, IPHONE);
  check(v.gtag === 0 && v.beacons.join() === "m/l", `a phone with no referrer, gone at 0.5 s: no Analytics yet; ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { ...IPHONE, stay: 2500 });
  check(v.gtag === 1 && v.beacons.join() === "m/l", `a phone with no referrer, still there at 2.5 s: Analytics started (1.5 s in view); ledger [${v.beacons}]`);
  v = await visit(s.base, PAGE, { referer: "https://www.google.com/", cookies: [{ name: "rs_hop", value: "1" }] });
  check(v.gtag === 0 && v.beacons.join() === "h/l", `through the missing-slash hop, claiming Google sent it: waits; ledger [${v.beacons}]`);
  v = await visit(s.base, "/", { referer: s.base + PAGE });
  check(v.gtag === 1 && v.beacons.length === 0, "moving between our own pages before any cookie: Analytics at once, nothing reported");
  let g = 0, loads = 0;
  for (let i = 0; i < 30; i++) { const r = await visit(s.base, [PAGE, "/", "/big-book/"][i % 3], { stay: 200 }); g += r.gtag; loads += r.beacons.filter((b) => b === "d/l").length; }
  check(g === 0 && loads === 30, `30 fleet-shaped loads across three pages, gone in 0.2 s: gtag.js requests ${g}, ledger loads ${loads}`);

  if (MAIN) {
    say("\n## What a visitor sees: this checkout beside main");
    const m = await serve(MAIN);
    try {
      for (const [p, vp, mob, act, label, skip] of [[PAGE, { width: 1366, height: 900 }, false, null, "nobody touching", []], [PAGE, { width: 1366, height: 900 }, false, moveMouse, "after a mouse move", []], ["/", { width: 390, height: 844 }, true, null, "phone, the particle canvas hidden on both sides", []], ["/", { width: 1366, height: 900 }, false, moveMouse, "desktop after a mouse move, particle canvas hidden", []], ["/big-book/", { width: 1366, height: 900 }, false, null, "nobody touching", []]]) {
        const a = await visit(m.base, p, { viewport: vp, mobile: mob, act, shot: true, skip, ua: mob ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1" : UA });
        const b = await visit(s.base, p, { viewport: vp, mobile: mob, act, shot: true, skip, ua: mob ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1" : UA });
        check(Buffer.compare(a.png, b.png) === 0, `${p} at ${vp.width}x${vp.height}, ${label}: the full-page picture is byte-for-byte the same as main's (${a.png.length} bytes)`);
      }
    } finally { m.close(); }
  }
  say(`\n${failed ? `${failed} FAILED` : "all passed"}`);
} finally {
  await browser.close();
  s.close();
  fs.writeFileSync(path.join(ROOT, "tests", "hand-gate-proof.txt"), out.join("\n") + "\n");
}
process.exit(failed ? 1 : 0);
