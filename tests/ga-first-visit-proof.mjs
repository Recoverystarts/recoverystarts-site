// GA4's start rule in app.js, with the first-visit case, in a real browser (Code: farm-study, 2026-11-15).
//     node tests/ga-first-visit-proof.mjs <a checkout of #103's branch, claude/blissful-tesla-747coe>
// Serves this checkout and #103's branch from two local ports, opens the same visits against both in Chromium
// (navigator.webdriver off) and counts requests for Google's gtag.js. Every outside host is answered locally; nothing
// leaves this machine. Output: tests/ga-first-visit-proof.txt. The one line that should differ: a first visit with no
// referrer on a desktop browser that stays in view and is never touched (the page-loading fleet's kind of visit).
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OTHER = process.argv[2];
if (!OTHER || !fs.existsSync(path.join(OTHER, "app.js"))) { console.error("give the path of a checkout of #103's branch"); process.exit(2); }
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36";
const PHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain" };
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
let failed = 0;
const check = (ok, what) => { say(`${ok ? "PASS" : "FAIL"}  ${what}`); if (!ok) failed++; };

function serve(root) {
  const srv = http.createServer((req, res) => {
    let f = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "content-type": TYPES[path.extname(f)] ?? "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ base: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close() })));
}

const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
async function visit(base, urlPath, { referer, cookies = [], ua = UA, viewport = { width: 1920, height: 1080 }, mobile = false, act = null, stay = 300, shot = false } = {}) {
  const ctx = await browser.newContext({ userAgent: ua, viewport, locale: "en-US", isMobile: mobile, hasTouch: mobile });
  if (cookies.length) await ctx.addCookies(cookies.map((c) => ({ ...c, url: base })));
  const seen = { gtag: 0 };
  await ctx.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.origin === base) return route.continue();
    if (u.hostname === "www.googletagmanager.com") seen.gtag++;
    return route.fulfill({ status: 200, contentType: "text/javascript", body: "" });
  });
  const page = await ctx.newPage();
  if (shot) await page.clock.install({ time: new Date("2026-11-15T20:00:00Z") });
  const res = await page.goto(base + urlPath, { waitUntil: "load", ...(referer ? { referer } : {}) });
  if (res.status() !== 200) throw new Error(`${urlPath} answered ${res.status()}`);
  if (act) await act(page);
  await page.waitForTimeout(stay);
  // the home page's sky is a canvas of drifting particles plus CSS animation, so main's own picture differs between two
  // loads; pictures are taken with animations stopped and that canvas hidden, on both sides
  if (shot) seen.png = await page.screenshot({ fullPage: true, animations: "disabled", style: "#particles{visibility:hidden!important}" });
  await ctx.close();
  return seen;
}
const moveMouse = async (page) => { await page.mouse.move(200, 200); await page.mouse.move(230, 215); await page.mouse.move(260, 240); await page.mouse.move(300, 260); };

const here = await serve(ROOT), other = await serve(OTHER);
try {
  const PAGE = "/start-here/";
  say(`# GA4's start rule in app.js, real Chromium ${browser.version()} — ${new Date().toISOString()}`);
  say(`# "#103" = the shield's static-site branch as it stands; "here" = #103 plus the first-visit case.`);
  say(`# Requests for gtag.js per visit (1 = Analytics started, 0 = it did not).\n`);
  const row = async (name, urlPath, opts, wantOther, wantHere) => {
    const a = await visit(other.base, urlPath, opts), b = await visit(here.base, urlPath, opts);
    check(a.gtag === wantOther && b.gtag === wantHere, `${name}: #103 ${a.gtag}, here ${b.gtag}${wantOther !== wantHere ? "   <-- the difference" : ""}`);
  };
  await row("first visit, no referrer, desktop, gone at 0.3 s (the fleet as it is today)", PAGE, { stay: 300 }, 0, 0);
  await row("the same visit, staying 3 s in view, nobody touching", PAGE, { stay: 3000 }, 1, 0);
  await row("the same visit on the home page, staying 3 s", "/", { stay: 3000 }, 1, 0);
  await row("a person on that kind of visit who moves the mouse", PAGE, { act: moveMouse }, 1, 1);
  await row("a person on that kind of visit who presses a key", PAGE, { act: (p) => p.keyboard.press("Tab") }, 1, 1);
  await row("a person on that kind of visit who turns the wheel", PAGE, { act: (p) => p.mouse.wheel(0, 500) }, 1, 1);
  await row("arrives from Google, reads 2.5 s without touching", PAGE, { referer: "https://www.google.com/", stay: 2500 }, 1, 1);
  await row("a returning visitor (has _ga), no referrer, 2.5 s", PAGE, { cookies: [{ name: "_ga", value: "GA1.1.1111.2222" }], stay: 2500 }, 1, 1);
  await row("a phone with no referrer, 2.5 s without touching", PAGE, { ua: PHONE, viewport: { width: 390, height: 844 }, mobile: true, stay: 2500 }, 1, 1);
  await row("from one of our own pages, before any cookie, 2.5 s", "/", { referer: here.base + PAGE, stay: 2500 }, 1, 1);
  const N = 20; let go = 0, gh = 0;
  const batch = (base) => Promise.all(Array.from({ length: 10 }, (_, k) => visit(base, [PAGE, "/", "/big-book/"][k % 3], { stay: 2500 })));
  for (let i = 0; i < N; i += 10) { go += (await batch(other.base)).reduce((a, r) => a + r.gtag, 0); gh += (await batch(here.base)).reduce((a, r) => a + r.gtag, 0); }
  check(go === N && gh === 0, `${N} fleet-shaped loads across three pages that each stay 2.5 s: Analytics sessions under #103's rule ${go}, here ${gh}`);

  say("\n## What a visitor sees: here beside #103's branch");
  for (const [p, vp, mob] of [[PAGE, { width: 1366, height: 900 }, false], ["/", { width: 390, height: 844 }, true], ["/big-book/", { width: 1366, height: 900 }, false]]) {
    const o = { viewport: vp, mobile: mob, ua: mob ? PHONE : UA, shot: true, stay: 400 };
    const a = await visit(other.base, p, o), b = await visit(here.base, p, o);
    check(Buffer.compare(a.png, b.png) === 0, `${p} at ${vp.width}x${vp.height}: the full-page picture is byte-for-byte the same (${a.png.length} bytes)`);
  }
  say(`\n${failed ? `${failed} FAILED` : "all passed"}`);
} finally {
  await browser.close();
  here.close(); other.close();
  fs.writeFileSync(path.join(ROOT, "tests", "ga-first-visit-proof.txt"), out.join("\n") + "\n");
}
process.exit(failed ? 1 : 0);
