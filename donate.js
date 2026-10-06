/* donate.js — "keep this free" sheet for recoverystarts.com + the meeting finder.
 * One file, kept identical in recoverystarts-site (/donate.js) and
 * meeting-finder (server/static/donate.js). Written 2026-09-27 (Fable 5.1, the
 * Sunday planner) at Derick's ask: out of pocket, a dollar in the basket.
 *
 * Behaviour: waits for the reader's first search (or 6 s), slides a small
 * closable sheet up from the bottom, remembers the close for 30 days in
 * localStorage (no cookie, nothing sent anywhere), and leaves a quiet "Donate"
 * link in the footer so nobody has to wait for the sheet again. v2 (14:4x):
 * also a "Donate" item in the nav menu and a hero button on the homepage.
 * v3 (17:5x): the PayPal button is on by default (hosted button 77M33WUD8KTCE,
 * "Support Recovery Starts", any amount, CAD; made by the PayPal window).
 * Config (optional) via window.RS_DONATE before this script loads:
 *   { paypal: "https://…" | "" to hide, delayMs: 6000, days: 30, site: "finder"|"site" }
 * Links live in claude-home secrets-docs/DONATIONS.md.
 */
(function () {
  "use strict";
  if (window.__rsDonateLoaded) return;
  window.__rsDonateLoaded = true;

  var cfg = window.RS_DONATE || {};
  var LINK_DOLLAR = "https://donate.stripe.com/28E6oH05y8Ip9MQ5M3bZe0f"; // US$1 × quantity
  var LINK_ANY    = "https://donate.stripe.com/00waEX5pS4s9gbegqHbZe0g"; // choose your amount
  var LINK_PAYPAL = cfg.paypal != null ? cfg.paypal : "https://www.paypal.com/ncp/payment/77M33WUD8KTCE"; // PayPal, any amount
  var KEY = "rs_donate_seen";
  var DAYS = cfg.days || 30;
  var DELAY = cfg.delayMs != null ? cfg.delayMs : 6000; // Derick 2026-09-27 14:41: 20 s "takes too long"
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seen() {
    try { var t = +localStorage.getItem(KEY); return t && Date.now() - t < DAYS * 864e5; } catch (e) { return false; }
  }
  function markSeen() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function track(name) { try { if (window.gtag) gtag("event", "donate_" + name, { site: cfg.site || location.hostname }); } catch (e) {} }

  var CSS =
    ".rsd-wrap{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;display:flex;justify-content:center;pointer-events:none;padding:0 12px 12px;padding-bottom:max(12px,env(safe-area-inset-bottom))}" +
    ".rsd{pointer-events:auto;width:100%;max-width:440px;background:var(--glass-solid,var(--panel,#1c1813));color:var(--ink,#f5f1e8);border:1px solid var(--glass-border,var(--line,rgba(245,241,232,.14)));border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.5);padding:18px 18px 16px;position:relative;font-family:var(--font-body,'Outfit',system-ui,-apple-system,sans-serif);line-height:1.4;transform:translateY(24px);opacity:0;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .4s}" +
    ".rsd.on{transform:none;opacity:1}" +
    ".rsd-x{position:absolute;top:8px;right:8px;width:40px;height:40px;border:0;background:transparent;color:inherit;font-size:26px;line-height:40px;border-radius:999px;cursor:pointer;opacity:.75}" +
    ".rsd-x:hover,.rsd-x:focus-visible{opacity:1;background:rgba(255,255,255,.08);outline:none}" +
    ".rsd h3{margin:0 34px 6px 0;font-family:var(--font-display,'Fraunces',Georgia,serif);font-weight:600;font-size:1.15rem;letter-spacing:.01em}" +
    ".rsd p{margin:0 0 12px;font-size:.86rem;color:var(--ink-soft,var(--soft,#cdc5b8))}" +
    ".rsd-row{display:flex;gap:8px;flex-wrap:wrap}" +
    ".rsd-btn{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:9px 14px;border-radius:999px;font-weight:600;font-size:.92rem;text-decoration:none;border:1px solid var(--glass-border,var(--line,rgba(245,241,232,.2)));color:inherit;background:rgba(255,255,255,.05)}" +
    ".rsd-btn.pri{background:var(--accent,#2DD4BF);color:var(--accent-fg,#042F2E);border-color:transparent}" +
    ".rsd-btn:hover{filter:brightness(1.08)}" +
    ".rsd-fine{margin:10px 0 0;font-size:.72rem;color:var(--ink-dim,var(--dim,#8e8778))}" +
    ".rsd-fine a{color:inherit}" +
    ".rsd-foot{font-size:inherit;color:inherit;text-decoration:underline;text-underline-offset:3px;opacity:.85}" +
    "@media (min-width:720px){.rsd-wrap{justify-content:flex-end;padding:0 20px 20px}}" +
    ".nav-links a.nav-donate{color:var(--accent,#2DD4BF);font-weight:600}.nav-links a.nav-donate:hover{color:var(--accent-hover,#5EEAD4)}" +
    ".btn.rsd-hero{border-color:rgba(45,212,191,.55)}";

  function build() {
    var wrap = document.createElement("div");
    wrap.className = "rsd-wrap";
    var paypal = LINK_PAYPAL ? '<a class="rsd-btn" href="' + LINK_PAYPAL + '" target="_blank" rel="noopener" data-k="paypal">PayPal</a>' : "";
    wrap.innerHTML =
      '<div class="rsd" role="dialog" aria-labelledby="rsd-h" aria-describedby="rsd-p">' +
        '<button class="rsd-x" type="button" aria-label="Close">&times;</button>' +
        '<h3 id="rsd-h">Keep this free.</h3>' +
        '<p id="rsd-p">This map is built and paid for by one person, out of pocket. Every new country costs more to run. If it helped you find a room, a dollar in the basket keeps it free for the next person.</p>' +
        '<div class="rsd-row">' +
          '<a class="rsd-btn pri" href="' + LINK_DOLLAR + '" target="_blank" rel="noopener" data-k="dollar">$1 in the basket</a>' +
          '<a class="rsd-btn" href="' + LINK_ANY + '" target="_blank" rel="noopener" data-k="more">Give more</a>' +
          paypal +
        '</div>' +
        '<p class="rsd-fine">Any bank card, Apple Pay, Google Pay or PayPal, in your own currency. Nothing is stored here; we only remember that you closed this.</p>' +
      '</div>';
    document.body.appendChild(wrap);
    var sheet = wrap.firstChild;
    function close() { markSeen(); track("close"); sheet.classList.remove("on"); setTimeout(function () { wrap.remove(); }, reduce ? 0 : 450); }
    sheet.querySelector(".rsd-x").addEventListener("click", close);
    sheet.querySelectorAll("a[data-k]").forEach(function (a) {
      a.addEventListener("click", function () { markSeen(); track(a.getAttribute("data-k")); setTimeout(function(){ wrap.remove(); }, 800); });
    });
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); } });
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add("on"); }); });
    track("show");
  }

  function footerLink() {
    var host = document.querySelector(".footer-bottom p, .footer-safety, footer p, .foot, #foot");
    if (!host || document.querySelector(".rsd-foot")) return;
    var a = document.createElement("a");
    a.className = "rsd-foot"; a.href = LINK_ANY; a.target = "_blank"; a.rel = "noopener";
    a.textContent = "Donate — keep it free";
    a.addEventListener("click", function(){ track("footer"); });
    host.appendChild(document.createTextNode(" · "));
    host.appendChild(a);
  }

  function navAndHero() {
    // Menu item (every page: the nav is one stamped header) and a hero button on the homepage,
    // both added here so no page needs a rebuild. Derick 2026-09-27 14:41.
    var add = document.querySelector(".nav-links a.nav-add-meeting");
    if (add && !document.querySelector(".nav-donate")) {
      var li = document.createElement("li");
      li.innerHTML = '<a href="' + LINK_ANY + '" class="nav-donate" target="_blank" rel="noopener">Donate</a>';
      li.firstChild.addEventListener("click", function(){ track("nav"); });
      add.parentNode.insertAdjacentElement("afterend", li);
    }
    var hero = document.querySelector(".hero a.btn[href*='utm_content=hero'][href*='app.recoverystarts']") || document.querySelector(".hero a.btn.btn-glass");
    if (hero && !document.querySelector(".rsd-hero")) {
      var a = document.createElement("a");
      a.className = "btn btn-glass rsd-hero"; a.href = LINK_ANY; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Donate — keep it free";
      a.addEventListener("click", function(){ track("hero"); });
      hero.insertAdjacentElement("afterend", a);
    }
  }

  function init() {
    var style = document.createElement("style"); style.textContent = CSS; document.head.appendChild(style);
    navAndHero();
    footerLink();
    if (seen() || /[?&]thanks=1/.test(location.search)) return;
    var fired = false;
    function go() { if (fired) return; fired = true; setTimeout(build, 1200); }
    // First search, or the timer — whichever comes first. The reader finds the meeting before we ask.
    document.addEventListener("submit", go, true);
    document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("#searchhere, #searchrow, button[type=submit], .search, [data-search]")) go(); }, true);
    document.addEventListener("input", function (e) { if (e.target.closest && e.target.closest("#searchrow, input[type=search], .search")) go(); }, true);
    setTimeout(go, DELAY);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
