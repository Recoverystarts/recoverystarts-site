# Raptive's head tag at the edge (draft, not deployed)

*Written 2026-11-07 ~13:45 Calgary by CEO: raptive-ready-2 (Opus 5.5, chat). Derick, 13:2x: "cool sure =)" to building it as a draft for install day, nothing live. This folder is under `scripts/`, so `pages-dist.sh` keeps it off the public site.*

## Why this exists
Raptive's head tag wants to be in `<head>`, so its bidders start before the page renders. Our ads load from `/ads.js`, which runs `defer` at the end of `<body>`. To put a tag in `<head>` the usual way, we'd edit ~16K static pages plus the meeting template, and re-save ~200K meeting pages to R2 (switch plan step 1, claude-home `map/projects/recoverystarts-site/raptive-switch-plan.md`). raptive-research suggested doing it at the edge instead (radio 2026-11-07T18:10Z): no rebuild, one switch, and the way back is just turning it off.

## What it is
`raptive-head-snippet.js` is a **Cloudflare Snippet**. Snippets come free with Pro. They run before Pages and before the `meetings-router` Worker, and they support HTMLRewriter. On each HTML answer it adds Raptive's tag as the first thing in `<head>`. It only acts on GET requests that return 200 with `text/html` on recoverystarts.com and www. Everything else passes through untouched.
- **Cached copies stay plain.** The edge cache, R2 and Pages keep the HTML exactly as it is now. The tag is added to each answer on its way out. So turning it off is instant, with no purge and no re-save.
- **ETags get a suffix** tied to the tag text. Without it, a browser holding a page from before switch day would keep getting "304, keep your copy" and never see the tag. If If-None-Match lacks the suffix, the snippet drops it, so that browser gets the whole page once. After that it gets 304s as usual.
- **`TAG` is empty in the file, which means off.** On the day, paste Raptive's tag in exactly as they give it. It's their code, so it isn't wrapped or edited here. Our site id from the Setup Assistant is `6ae0f40dc893d31cf2e0eb8c`; confirm it matches the one in their tag.
- It adds `data-rs-edge="raptive"` to their `<script>`, plus an `x-rs-head` header, so view-source and curl show that the edge added it.

## Tested (2026-11-07)
`node scripts/edge/test-raptive-head.mjs` (it needs `npm i --no-save miniflare@4`) runs in workerd, the Workers runtime, against the real home page and Big Book page 419. All 17 checks pass:
- The tag appears once, inside `<head>`, before any other script, and nothing else in the page changes.
- The ETag gets its suffix, and revalidating with it gives a 304.
- A copy saved before the tag gets a fresh 200 with the tag.
- These are all left untouched: an empty TAG, non-HTML responses, 404s, HEAD requests and other hosts.

Speed: the biggest page on the site (`/daily-tradition/`, 606 KB) took ~1.8 ms of wall time per rewrite in Miniflare, overhead included. A typical page (30 KB) takes a fraction of that. A Snippet's limit is 5 ms of CPU.

**Not proven yet, only provable live:** that the snippet's `fetch()` passes on through the `meetings-router` Worker for `/meetings/*`. Cloudflare's alpha post says Snippets run before Workers, so it should. Step 2 below proves it before any visitor sees it.

## Install day, in order (after Raptive says they're ready, and in the same hour as the rest of the switch plan)
1. **Rules → Snippets → Create** (dashboard). Name it `raptive_head`, paste this file with TAG filled in, and save.
2. **Test rule first:** set its expression to the one below plus `and http.request.uri.query contains "rs-raptive-test"`. Then:
   - `curl -s "https://recoverystarts.com/?rs-raptive-test=1" -A "ClaudeBot"` should show `data-rs-edge` in `<head>`.
   - Do the same on a meeting page (`/meetings/aa/online/piece-of-the-pie/?rs-raptive-test=1`) and on `/big-book/page-419/`.
   - Use a GET with an allowed UA, never `curl -I` or a fake Googlebot (LOG-INDEX). The plain URLs should show no tag.
   - If the meeting page has no tag, Snippets didn't wrap the Worker. In that case the same `withRaptiveHead()` goes into `meeting-finder/deploy/worker-meetings-route.js`, on the response `route()` returns, as a second switch.
3. **Live rule:** drop the test clause. Expression:
   ```
   (http.host in {"recoverystarts.com" "www.recoverystarts.com"}
    and not http.request.uri.path.extension in {"js" "mjs" "css" "json" "xml" "txt" "md" "png" "jpg" "jpeg" "gif" "webp" "svg" "ico" "woff" "woff2" "pdf" "webmanifest" "pbf"}
    and not starts_with(http.request.uri.path, "/meetings/api/")
    and not starts_with(http.request.uri.path, "/sitemaps/"))
   ```
4. Run `morning_check` dry straight after. Then check a real page in Chrome: the tag sits in `<head>` and Raptive's `ads.min.js` loads.

**Way back:** disable or delete the snippet rule, or set `TAG = ""` and save. Pages answer exactly as before, with no purge needed.

## Left to the other switch-plan steps (not this file)
- Removing AdSense from `/ads.js` (step 1).
- The ads.txt redirect (step 2).
- The GA consent delay (step 3).
- The meeting pages' CSP, which has to allow Raptive's hosts (step 4, `meeting-finder/server/headers.mjs`). Without it, the tag is in the page but the browser blocks the script on meeting pages.

Our browser tests set `navigator.webdriver`, which ads.js uses to skip ads. Raptive's tag won't check that, so tests that load real pages should block `ads.adthrive.com` themselves (Playwright `page.route`). That way a test never makes an impression.
