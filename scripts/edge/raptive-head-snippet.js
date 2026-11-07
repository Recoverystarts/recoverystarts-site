/* raptive-head-snippet.js — puts Raptive's head tag into <head> at Cloudflare's edge, so no page is rebuilt for it.
 * Draft 2026-11-07 by CEO: raptive-ready-2 (Opus 5.5, chat). NOT DEPLOYED. Install-day steps: README.md beside this file.
 *
 * Why at the edge (raptive-research's idea, radio 2026-11-07T18:10Z; switch plan step 1): Raptive's tag wants <head> so
 * its bidders start before the page renders. Our ads.js loads `defer` at the end of <body>. Putting the tag in <head> by
 * hand means editing ~16K static pages plus the meeting template and re-saving ~200K meeting pages to R2. A Cloudflare
 * Snippet (free on Pro) runs before Pages and before the meetings-router Worker, sees every HTML answer on the way out,
 * and adds one tag. Turning it off is one switch (the snippet rule), and it never touches a cached copy: the edge copy
 * and R2 stay plain HTML, the tag is added per answer.
 *
 * What it touches: GET, status 200, content-type text/html, on recoverystarts.com / www. Everything else passes through
 * untouched (the rule expression already keeps assets, the API and sitemaps away, this is a second guard).
 * What it doesn't do: load or remove AdSense (that stays ads.js's job on switch day), or change the CSP (meeting pages'
 * CSP is meeting-finder server/headers.mjs, switch plan step 4).
 */
// Paste Raptive's head tag here EXACTLY as their dashboard / install team gives it (a <script>…</script> string).
// Empty = off even if the rule is enabled. Our Raptive site id from the Setup Assistant: 6ae0f40dc893d31cf2e0eb8c
// (switch plan step 1 says confirm it's the one in their tag).
const TAG = "";
const MARK = 'data-rs-edge="raptive"'; // so anyone can see in view-source that the edge added it
const HOSTS = new Set(["recoverystarts.com", "www.recoverystarts.com"]);

// ETags: a page's ETag comes from Pages/Railway for the plain HTML. With the tag added, the body differs, so the ETag gets
// a suffix tied to the tag text. Without it, a browser holding a copy from before switch day would keep getting 304s and
// never see the tag; and changing TAG later would be invisible to browsers the same way. The suffix is taken off the
// browser's If-None-Match before it goes on, so Pages/Railway still answer 304 when nothing changed, and an
// If-None-Match without it is dropped (a copy from before the tag gets the whole page once).
function tagId(tag) { let h = 0; for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) | 0; return "rt" + (h >>> 0).toString(36); }
const withSuffix = (etag, id) => etag.replace(/"$/, `-${id}"`);
const withoutSuffix = (inm, id) => inm.split(`-${id}"`).join('"');

export function forwardRequest(req, tag = TAG) {
  const inm = req.headers.get("if-none-match");
  if (!tag || !inm) return req;
  const id = tagId(tag), h = new Headers(req.headers);
  // A browser copy whose ETag lacks this tag's suffix was saved before the tag (or with an older one): ask for the
  // whole page, so it can't be told "304, keep what you have" and go on without the tag.
  if (inm.includes(`-${id}"`)) h.set("if-none-match", withoutSuffix(inm, id)); else h.delete("if-none-match");
  return new Request(req, { headers: h });
}

export function withRaptiveHead(res, req, tag = TAG) {
  if (!tag || req.method !== "GET") return res;
  if (!HOSTS.has(new URL(req.url).hostname)) return res;
  const id = tagId(tag);
  if (res.status === 304) { // the browser's copy already has this exact tag (its ETag carried the suffix)
    const e = res.headers.get("etag"); if (!e) return res;
    const out = new Response(null, res); out.headers.set("etag", withSuffix(e, id)); return out;
  }
  if (res.status !== 200) return res;
  if (!(res.headers.get("content-type") || "").toLowerCase().startsWith("text/html")) return res;
  // Our own browser tests set navigator.webdriver; they block ads.adthrive.com in the test instead (README), because
  // Raptive's tag text is theirs and isn't wrapped or edited here.
  let done = false;
  const out = new HTMLRewriter()
    .on("head", { element(el) { if (done) return; done = true; el.prepend(tag.replace("<script", `<script ${MARK}`), { html: true }); } })
    .transform(res);
  const e = out.headers.get("etag"); if (e) out.headers.set("etag", withSuffix(e, id));
  out.headers.set("x-rs-head", id);
  return out;
}

export default {
  async fetch(request) {
    const res = await fetch(forwardRequest(request));
    return withRaptiveHead(res, request);
  },
};
