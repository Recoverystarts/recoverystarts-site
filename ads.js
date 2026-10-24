/* ads.js — the one switch for ads on recoverystarts.com (WO-ADS C4, claude-home secrets-docs/WO-ADS.md).
 *
 * Every site page and every meeting page loads this one file: the site's pages as /ads.js, the meeting pages
 * (meeting-finder, Railway) as /ads.js too, which meetings-router sends to Pages like every non-/meetings path.
 *
 *   ON = false  nothing else happens: no Google script, no boxes, the pages look exactly as they did.
 *   ON = true   loads AdSense (ca-pub-9748639819382646) with its anchor held at the bottom of the screen, and puts
 *               in-content boxes where Derick said they're fine (2026-10-18 15:48, decisions for this build):
 *                 meeting pages      A above the meeting list, C after the last one (never between meetings)
 *                 Daily Reflection   E after the reading (and its "Something to sit with")
 *                 home page          F after "Four doors"
 *               The map (/meetings/find/) and every other page get the anchor only.
 *
 * Turn on:   ON = true, push to main, purge the Cloudflare cache. Way back: ON = false, push, purge.
 * The anchor itself is an Auto ads format: in AdSense, Auto ads on for recoverystarts.com with Anchor ads on and
 * In-page ads off (so Google adds no boxes of its own, and the map keeps the anchor only). A box shows only once its
 * spot has a display-unit id in SLOT (AdSense → Ads → By ad unit → Display ads); an empty id shows nothing.
 */
(function () {
  var ON = true;
  var CLIENT = "ca-pub-9748639819382646";
  var SLOT = { A: "4629316546", B: "", C: "8070575948", E: "7316023780", F: "8230358040" };

  if (!ON || window.__rsAds) return;
  window.__rsAds = true;
  if (!/(^|\.)recoverystarts\.com$/.test(location.hostname)) return; // not on preview deploys or the Railway origin

  var doc = document, root = doc.documentElement;
  root.classList.add("rs-ads");

  var s = doc.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-overlays", "bottom"); // the anchor stays at the bottom, never the top (AdSense help 7478225)
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + CLIENT;
  doc.head.appendChild(s);

  // the label AdSense allows ("Advertisements"), in the page's language
  var LABEL = { en: "Advertisements", es: "Anuncios", pt: "Anúncios", fr: "Annonces", fa: "تبلیغات", pl: "Reklamy", de: "Anzeigen", sv: "Annonser", nl: "Advertenties", hi: "विज्ञापन" };
  var lang = (root.lang || "en").toLowerCase().split("-")[0];

  var css = doc.createElement("style");
  css.textContent =
    ".rs-ad{clear:both;margin:20px auto;max-width:728px;text-align:center;overflow:hidden}" +
    ".rs-ad-l{font:11px/1.4 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.6;margin:0 0 4px}" +
    ".rs-ad ins.adsbygoogle{display:inline-block}" +
    ".rs-ad:has(ins[data-ad-status=unfilled]){display:none}";
  doc.head.appendChild(css);

  function box(spot) {
    if (!SLOT[spot]) return null;
    var d = doc.createElement("div");
    d.className = "rs-ad";
    d.setAttribute("data-spot", spot);
    var l = doc.createElement("div");
    l.className = "rs-ad-l";
    l.textContent = LABEL[lang] || LABEL.en;
    var ins = doc.createElement("ins");
    ins.className = "adsbygoogle";
    ins.setAttribute("data-ad-client", CLIENT);
    ins.setAttribute("data-ad-slot", SLOT[spot]);
    // Fixed, small sizes so a box can never grow over the page (Derick, 2026-10-23 18:54: "make it smaller so it
    // doesnt overlap"). Phones: a 320x100 strip. Wider screens: a 728x90 bar. Google then fills only that size.
    var wide = (window.innerWidth || root.clientWidth || 0) >= 760;
    ins.style.width = wide ? "728px" : "320px";
    ins.style.height = wide ? "90px" : "100px";
    d.appendChild(l);
    d.appendChild(ins);
    return d;
  }
  function put(spot, el, where) {
    var d = el && box(spot);
    if (!d) return;
    if (where === "before") el.parentNode.insertBefore(d, el);
    else el.parentNode.insertBefore(d, el.nextSibling);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  // a built language copy of a site page lives under /<code>/ (/es/, /hi/…); meeting pages keep their path (?hl=)
  var path = location.pathname.replace(/^\/(es|pt|fr|fa|pl|de|sv|nl|hi)(?=\/)/, "");

  // The map (/meetings/find/) fills the screen exactly. A bottom anchor makes Google pad the page so nothing sits under
  // it, which on the map leaves a dark strip below it, even with the ad folded (Derick, 2026-10-23 18:31: "it blocks out
  // the bottom of the screen now instead of overlay"). On the map only, take that padding back off, so the anchor floats
  // over the map like an overlay and folding it gives the whole map back.
  if (/^\/meetings\/find\//.test(path)) {
    root.classList.add("rs-map");
    css.textContent += "html.rs-map,html.rs-map body{padding-bottom:0!important}";
    var unpad = function () {
      [root, doc.body].forEach(function (el) {
        if (el && el.style && el.style.paddingBottom) el.style.removeProperty("padding-bottom");
      });
    };
    var mo = new MutationObserver(unpad);
    var watch = function () {
      mo.observe(root, { attributes: true, attributeFilter: ["style"] });
      if (doc.body) mo.observe(doc.body, { attributes: true, attributeFilter: ["style"] });
      unpad();
    };
    if (doc.body) watch(); else doc.addEventListener("DOMContentLoaded", watch);
  }

  if (path === "/" || path === "/index.html") {
    put("F", doc.querySelector("#doors .door-grid"), "after");
  } else if (/^\/daily-reflection\/[a-z]+-\d+\/$/.test(path)) {
    put("E", doc.querySelector(".dr-discuss") || doc.querySelector(".dr-stage"), "after");
  } else if (/^\/meetings\//.test(path) && !/^\/meetings\/find\//.test(path)) {
    var cards = doc.querySelectorAll(".card.m");
    var n = cards.length;
    if (n) {
      // A: above the list, i.e. above the day heading the first meeting sits under (when it has one)
      var first = cards[0], head = first.previousElementSibling;
      while (head && head.classList.contains("card")) head = head.previousElementSibling;
      put("A", head && head.classList.contains("dayhead") ? head : first, "before");
      // B (after the 3rd meeting) removed 2026-10-23 19:00, Derick: "we worked hard to try have the meeting boxes not
      // feel clastorphobic, we shouldnt have an add right in there". No ad goes between meetings.
      if (n >= 4) put("C", cards[n - 1], "after");
    }
  }
})();
