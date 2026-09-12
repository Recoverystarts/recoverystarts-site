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


// ===== PLAY BADGE (2026-09-07, Derick's call: A on the site, folds to icon after first scroll) =====
// Hides the old .einstein-cta and mounts /play-badge.js (shared with the meeting finder).
// Android -> Play listing with install referrer; everyone else -> the web app. Same UTM either way.
(function () {
  var cta = document.querySelector('.einstein-cta');
  var content = 'site';
  try { if (cta) content = new URL(cta.getAttribute('href'), location.origin).searchParams.get('utm_content') || content; } catch (e) {}
  window.PLAY_BADGE = { mode: 'card', pos: 'br', icon: '/assets/play/icon-96.png',
    utm: { source: 'recoverystarts', medium: 'site', campaign: 'play-badge', content: content } };
  var s = document.createElement('script'); s.src = '/play-badge.js?v=4'; s.defer = true; document.head.appendChild(s);
})();


// ===== GA4 (2026-09-12, Derick's call: "we want the google analytics for sure") =====
// Measurement ID G-QEHZLMSH7P — property "recoverystarts.com" under the Recovery Starts GA account. Mounted from app.js so
// every one of the ~1,200 static pages carries it without a rebuild; the meeting finder carries the same tag from its
// server template. Cloudflare's Web Analytics collector was found answering 503 to every beacon, hence the switch.
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-QEHZLMSH7P', { anonymize_ip: true });
  var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=G-QEHZLMSH7P'; document.head.appendChild(g);
})();
