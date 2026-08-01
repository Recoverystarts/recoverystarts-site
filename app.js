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
