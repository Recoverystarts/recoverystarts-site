// Test for raptive-head-snippet.js in workerd (the Workers runtime) via Miniflare, with a fake origin and the real
// home and Big Book page-419 HTML from this repo. Run from the repo root: npm i --no-save miniflare@4 && node scripts/edge/test-raptive-head.mjs
// 17 PASS lines on 2026-11-07 (CEO: raptive-ready-2).
import { Miniflare } from "miniflare";
import fs from "node:fs";
const home = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const bb = fs.readFileSync(new URL("../../big-book/page-419/index.html", import.meta.url), "utf8");
const TAG = `<script data-no-optimize="1">window.__fakeRaptive=1;</script>`;
const worker = `
import { withRaptiveHead, forwardRequest } from "./snip.mjs";
const PAGES = { "/": ${JSON.stringify(home)}, "/big-book/page-419/": ${JSON.stringify(bb)} };
export default { async fetch(req) {
  const u = new URL(req.url); const tag = u.searchParams.get("off") ? "" : ${JSON.stringify(TAG)};
  const fwd = forwardRequest(req, tag);
  // fake origin: etag W/"abc", 304 when If-None-Match matches exactly
  let res;
  if (u.pathname === "/ads.js") res = new Response("x", { headers: { "content-type": "application/javascript", etag: 'W/"js"' } });
  else if (fwd.headers.get("if-none-match") === 'W/"abc"') res = new Response(null, { status: 304, headers: { etag: 'W/"abc"' } });
  else if (PAGES[u.pathname]) res = new Response(PAGES[u.pathname], { headers: { "content-type": "text/html; charset=utf-8", etag: 'W/"abc"' } });
  else res = new Response("nf", { status: 404, headers: { "content-type": "text/html" } });
  return withRaptiveHead(res, req, tag);
} };`;
const mf = new Miniflare({ modules: [{ type: "ESModule", path: "w.mjs", contents: worker }, { type: "ESModule", path: "snip.mjs", contents: fs.readFileSync(new URL("./raptive-head-snippet.js", import.meta.url), "utf8") }], compatibilityDate: "2026-08-01" });
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
const B = "https://recoverystarts.com";
for (const p of ["/", "/big-book/page-419/"]) {
  const r = await mf.dispatchFetch(B + p); const t = await r.text();
  const i = t.indexOf("<head"), j = t.indexOf("data-rs-edge"), k = t.indexOf("</head>");
  ok(r.status === 200 && j > i && j < k && t.indexOf("data-rs-edge", j + 1) === -1, `${p}: tag once, inside <head>`);
  ok(t.slice(i, t.indexOf("<script data-rs-edge")).split("<script").length === 1, `${p}: before any other script`);
  ok(t.replace(/<script data-rs-edge="raptive" data-no-optimize="1">window.__fakeRaptive=1;<\/script>/, "") === (p === "/" ? home : bb), `${p}: nothing else changed`);
  ok(/^W\/"abc-rt[0-9a-z]+"$/.test(r.headers.get("etag")), `${p}: etag suffixed ${r.headers.get("etag")}`);
  const e = r.headers.get("etag");
  const r2 = await mf.dispatchFetch(B + p, { headers: { "if-none-match": e } });
  ok(r2.status === 304 && r2.headers.get("etag") === e, `${p}: revalidation with suffixed etag -> 304 same etag`);
  const r3 = await mf.dispatchFetch(B + p, { headers: { "if-none-match": 'W/"abc"' } }); await r3.text();
  ok(r3.status === 200, `${p}: a pre-switch-day copy (plain etag) gets a fresh 200 with the tag`);
}
let r = await mf.dispatchFetch(B + "/?off=1"); let t = await r.text(); ok(!t.includes("data-rs-edge") && r.headers.get("etag") === 'W/"abc"', "TAG empty: page untouched");
r = await mf.dispatchFetch(B + "/ads.js"); t = await r.text(); ok(t === "x" && !r.headers.get("x-rs-head"), "non-HTML untouched");
r = await mf.dispatchFetch(B + "/nope"); t = await r.text(); ok(!t.includes("data-rs-edge"), "404 untouched");
r = await mf.dispatchFetch(B + "/", { method: "HEAD" }); ok(!r.headers.get("x-rs-head"), "HEAD untouched");
r = await mf.dispatchFetch("https://read.recoverystarts.com/"); t = await r.text(); ok(!t.includes("data-rs-edge"), "other host untouched");
await mf.dispose();
