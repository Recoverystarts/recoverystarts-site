// Recovery Starts — app.js
// Theme toggle + nav dropdowns + meeting filter + scroll reveals + mobile nav.
// ~90 lines. Everything degrades to a complete page with JS off.

(function() {
  'use strict';

  // Content is only ever hidden for reveal animations when JS is alive.
  document.documentElement.classList.add('js');

  // ===== SCROLL REVEALS =====
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.fade-in, .reveal').forEach(function (el) { observer.observe(el); });

  // ===== MEETING FILTER =====
  var filterBtns = document.querySelectorAll('.filter-btn');
  var meetingCards = document.querySelectorAll('.meeting-card[data-tags]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      meetingCards.forEach(function (card) {
        var tags = card.dataset.tags || '';
        card.classList.toggle('hidden', filter !== 'all' && tags.indexOf(filter) === -1);
      });
    });
  });

  // ===== MOBILE NAV =====
  var closeMobileNav = function () {
    var nav = document.querySelector('.nav-links');
    var toggle = document.querySelector('.nav-toggle');
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', function (e) {
    var nav = document.querySelector('.nav-links');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && toggle && !toggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  // ===== NAV DROPDOWNS (month + section submenus) =====
  // Click-to-open everywhere. On desktop the parent label itself toggles the
  // menu (hover-open flickered and is gone); every submenu carries a link to
  // its hub page, so nothing is lost. With JS off, the parent navigates to the
  // hub — a complete fallback.
  var isDesktopNav = window.matchMedia('(min-width: 1021px)');

  var closeSubs = function (except) {
    document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      var b = li.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };

  var toggleSub = function (li) {
    var opening = !li.classList.contains('open');
    closeSubs(li);
    li.classList.toggle('open', opening);
    var b = li.querySelector('.sub-toggle');
    if (b) b.setAttribute('aria-expanded', opening ? 'true' : 'false');
  };

  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleSub(btn.closest('.has-sub'));
    });
  });

  document.querySelectorAll('.has-sub > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (!isDesktopNav.matches) return; // phone: the ▾ toggles, the label navigates
      e.preventDefault();
      e.stopPropagation();
      toggleSub(link.closest('.has-sub'));
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeSubs();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSubs();
  });

  // ===== ACTIVE NAV LINK (longest match wins; submenu hits light their parent) =====
  var path = window.location.pathname;
  var best = null;
  var bestLen = 0;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (!href || href.indexOf('http') === 0 || link.classList.contains('nav-cta')) return;
    var match = href === '/' ? path === '/' : path.indexOf(href) === 0;
    if (match && href.length > bestLen) {
      best = link;
      bestLen = href.length;
    }
  });
  if (best) {
    var sub = best.closest('.sub-menu');
    var target = sub ? sub.closest('.has-sub').querySelector(':scope > a') : best;
    if (target) target.classList.add('active');
  }
})();


// ===== THE BIG BOOK APP IN THE TOP BAR (2026-10-18, WO-ADS A7) =====
// The face in the bar (fix-nav.js .rs-bb) replaced the floating /play-badge.js card, so the bottom of the screen is free
// for an ad bar. Its link is the web app; Android goes to the Play listing with the install referrer (same UTM).
(function () {
  if (!/Android/i.test(navigator.userAgent || '')) return;
  document.querySelectorAll('.rs-bb[data-play]').forEach(function (a) { a.href = a.getAttribute('data-play'); });
})();


// ===== GA4 (2026-09-12, Derick's call: "we want the google analytics for sure") =====
// Measurement ID G-QEHZLMSH7P — property "recoverystarts.com" under the Recovery Starts GA account. Mounted from app.js so
// every one of the ~1,200 static pages carries it without a rebuild; the meeting finder carries the same tag from its
// server template. Cloudflare's Web Analytics collector was found answering 503 to every beacon, hence the switch.
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  // A browser driven by a program (our own Playwright and Lighthouse checks) sends no hits: they were showing up as
  // "(not set)" Direct sessions, ~60 on 2026-10-26 (wave 2026-10-26-ads S4). gtag() stays defined, so callers like
  // donate.js just queue into a dataLayer nobody sends. (The old AdSense loader followed the same rule.)
  if (navigator.webdriver) return;
  // The hand gate (2026-11-15, Code: farm-study, claude-home #575). The meeting finder carries the same logic in its
  // page template; meeting-finder server/hand.mjs has the whole why and the proof. In short: a crawler loads pages in
  // real Chrome from home internet addresses, ~70,000 a day, each load a first visit with no referrer that lasts 0.2 s
  // and never touches the page. It ran this tag, so Analytics showed 67,000 "Direct" sessions a day beside ~1,100 from
  // search. Nothing is blocked. On that kind of visit (first visit, no referrer, desktop browser; or one that came
  // through the missing-slash redirect, which the edge stamps with a 30-second cookie, rs_hop) Analytics starts at the
  // first pointer, key, touch or wheel, and not before. Any other FIRST visit (from search, a link, a phone) starts it
  // at the first of those or after 1.5 s in view; a returning visitor at once, as before. (Put together with the shield,
  // meeting-finder #1059, the same afternoon: a crawler that learns to send a Google referrer becomes the second kind and
  // still leaves after 0.2 s. A scroll is not a hand: a page's own script can cause one. What it costs real numbers: a
  // first visit that ends inside 1.5 s without a touch is no longer a session.)
  // First visits also tell our own server "loaded" and, once, "a hand" (how, how soon): no cookie, nothing about the
  // person. Kinds: d desktop/no referrer (waits), h the hop (waits), c arrived from another site, m a phone with no
  // referrer (c and m don't wait: they are the yardstick). Read at /healthz/visits -> hand on the meetings service.
  // While a visit waits, <body> has the class rs-wait-hand; nothing styles it (it is there for Raptive to act on).
  // Way back: put the three lines below "start" back at this level and delete the rest.
  var d = document, n = navigator, on = false, t0 = Date.now(), px, py;
  var c = d.cookie || '', r = d.referrer || '';
  var first = !/(?:^|; )_ga=/.test(c), hop = /(?:^|; )rs_hop=1/.test(c);
  var mob = n.userAgentData ? n.userAgentData.mobile : /Mobi|Android|iPhone|iPad|iPod/i.test(n.userAgent);
  var kind = !first ? '' : hop ? 'h' : r ? (r.indexOf(location.origin) ? 'c' : '') : mob ? 'm' : 'd';
  var wait = kind === 'd' || kind === 'h';
  var how = { pointerdown: 'p', pointermove: 'm', keydown: 'k', touchstart: 't', wheel: 'w' }, tm = 0;
  if (hop) d.cookie = 'rs_hop=;Max-Age=0;Path=/';
  function start() {
    if (on) return;
    on = true;
    gtag('js', new Date());
    gtag('config', 'G-QEHZLMSH7P', { anonymize_ip: true, traffic_type: 'rs' }); // traffic_type 'rs' marks our own hits so a GA4 Include-only data filter can drop ghost hits sent straight to Google (claude-home #575, 2026-11-12). Way back: remove the key.
    var g = d.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=G-QEHZLMSH7P'; d.head.appendChild(g);
  }
  function say(e) { try { n.sendBeacon('/meetings/api/hand/' + kind + '/' + e); } catch (z) {} }
  function mark(yes) { if (d.body) d.body.classList[yes ? 'add' : 'remove']('rs-wait-hand'); }
  if (!kind) { start(); return; }
  say('l');
  // not the crawler's kind: someone still looking at 1.5 s is someone (the clock runs only while the page is in view)
  function arm() { clearTimeout(tm); if (!wait && !on && d.visibilityState === 'visible') tm = setTimeout(start, 1500); }
  d.addEventListener('visibilitychange', arm); arm();
  if (wait) { if (d.body) mark(true); else d.addEventListener('DOMContentLoaded', function () { if (!on) mark(true); }); }
  function hand(e) {
    if (!e.isTrusted) return; // an event a script made up is not a person
    // one pointer position alone isn't a hand: a parked cursor reports one when a page loads
    if (e.type === 'pointermove' && (px === undefined || (e.screenX === px && e.screenY === py))) { px = e.screenX; py = e.screenY; return; }
    for (var x in how) window.removeEventListener(x, hand, true);
    var s = (Date.now() - t0) / 1000;
    say(how[e.type] + '/' + (s < 1 ? 0 : s < 2 ? 1 : s < 5 ? 2 : s < 10 ? 3 : s < 30 ? 4 : 5));
    start(); if (wait) mark(false);
  }
  for (var x in how) window.addEventListener(x, hand, { capture: true, passive: true });
})();


// ===== Donate sheet (2026-09-27, Derick's ask: out of pocket, a dollar in the basket) =====
// /donate.js is one file shared with the meeting finder (server/static/donate.js). It waits for the reader's first
// search or 20 s, shows a small closable sheet once per 30 days (localStorage, no cookie), and adds a footer link.
// Links + why: claude-home secrets-docs/DONATIONS.md.
(function () {
  window.RS_DONATE = { site: 'site' };
  var d = document.createElement('script'); d.src = '/donate.js?v=3'; d.defer = true; document.head.appendChild(d);
})();
