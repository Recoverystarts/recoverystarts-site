// Recovery Starts — app.js
// Theme toggle + nav dropdowns + meeting filter + scroll reveals + mobile nav.
// ~90 lines. Everything degrades to a complete page with JS off.

(function() {
  'use strict';

  // Content is only ever hidden for reveal animations when JS is alive.
  document.documentElement.classList.add('js');

  // ===== DAY / NIGHT THEME =====
  // Default follows the system (light-dark() in CSS). The toggle overrides,
  // and the choice is remembered on this device only. No tracking.
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('rs-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* private mode — theme just follows the system */ }

  var isDark = function () {
    var forced = root.getAttribute('data-theme');
    if (forced) return forced === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('rs-theme', next); } catch (e) {}
    });
  });

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
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    var nav = document.querySelector('.nav-links');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && toggle && !toggle.contains(e.target)) {
      nav.classList.remove('open');
    }
  });

  // ===== NAV DROPDOWNS (month + section submenus) =====
  var closeSubs = function (except) {
    document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      var b = li.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.sub-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var li = btn.closest('.has-sub');
      var opening = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
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
