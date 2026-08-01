// Recovery Starts — app.js
// Meeting directory filter + scroll animations + mobile nav

(function() {
  'use strict';

  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  // ===== MEETING FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const meetingCards = document.querySelectorAll('.meeting-card[data-tags]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      meetingCards.forEach((card) => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.dataset.tags || '';
          if (tags.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });

  // ===== MOBILE NAV =====
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const toggle = document.querySelector('.nav-toggle');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
    }
  });

  // ===== NAV DROPDOWNS (month submenus) =====
  const closeSubs = (except) => {
    document.querySelectorAll('.has-sub.open').forEach((li) => {
      if (li === except) return;
      li.classList.remove('open');
      const b = li.querySelector('.sub-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.sub-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const li = btn.closest('.has-sub');
      const opening = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-sub')) closeSubs();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSubs();
  });

  // ===== ACTIVE NAV LINK (longest matching section wins) =====
  const path = window.location.pathname;
  let best = null;
  let bestLen = 0;
  document.querySelectorAll('.nav-links > li > a').forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href || href.indexOf('http') === 0) return;
    const match = href === '/' ? path === '/' : path.indexOf(href) === 0;
    if (match && href.length > bestLen) {
      best = link;
      bestLen = href.length;
    }
  });
  if (best) best.classList.add('active');
})();
