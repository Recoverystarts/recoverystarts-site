/* Play badge - the floating link to "AA Big Book Search + AI Guide" on Google Play.
 * Shared verbatim by recoverystarts-site (/play-badge.js) and meeting-finder (server/static/play-badge.js).
 * Configure BEFORE loading:  window.PLAY_BADGE = { mode:'card'|'pill', pos:'br'|'tl', icon:'/path/icon-96.png',
 *                                                  utm:{source,medium,campaign,content} }
 * Behaviour (Derick, 2026-09-07): A = the Play store row (mode card) on site pages, C = compact pill on the map;
 * either folds to icon-only after the first scroll/pan, one tap re-expands, next tap follows the link.
 * Android -> Play listing with install referrer carrying the UTM. Everyone else -> the web app, same UTM.
 * Way back: git revert; the old .einstein-cta stays in the page markup and is only hidden by this script.
 */
(function () {
  if (window.__playBadgeMounted) return; window.__playBadgeMounted = true;
  var cfg = window.PLAY_BADGE || {};
  var mode = cfg.mode === 'pill' ? 'pill' : 'card';
  var pos = cfg.pos === 'tl' ? 'tl' : 'br';
  var icon = cfg.icon || '/assets/play/icon-96.png';
  var utm = cfg.utm || {};
  var qs = 'utm_source=' + (utm.source || 'recoverystarts') + '&utm_medium=' + (utm.medium || 'site') +
           '&utm_campaign=' + (utm.campaign || 'play-badge') + '&utm_content=' + (utm.content || location.pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home');
  var android = /Android/i.test(navigator.userAgent || '');
  var href = android
    ? 'https://play.google.com/store/apps/details?id=org.autogrow.recoveryeinstein&referrer=' + encodeURIComponent(qs)
    : 'https://app.recoverystarts.com/?' + qs;

  var css = [
    '.pb{position:fixed;z-index:1200;text-decoration:none;color:#fff;font-family:Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-tap-highlight-color:transparent;transition:transform .18s,opacity .18s}',
    '.pb.br{right:clamp(12px,3vw,24px);bottom:calc(clamp(12px,3vw,22px) + env(safe-area-inset-bottom))}',
    '.pb.tl{left:12px;top:calc(12px + env(safe-area-inset-top))}',
    '.pb:hover{transform:translateY(-2px)}',
    '.pb .pb-ic{display:block;flex:none;border-radius:22%;background:#8fd3d0 center/cover no-repeat;box-shadow:0 1px 2px rgba(0,0,0,.4)}',
    '.pb .pb-glyph{display:block}',
    /* A: store row */
    '.pb.card .pb-in{display:flex;align-items:center;gap:12px;background:#1b1f22;border:1px solid #2c3236;border-radius:14px;padding:10px 12px 10px 10px;box-shadow:0 10px 30px rgba(0,0,0,.5);width:min(356px,calc(100vw - 24px))}',
    '.pb.card .pb-ic{width:52px;height:52px}',
    '.pb.card .pb-t{flex:1;min-width:0}',
    '.pb.card .pb-title{font-weight:500;font-size:14.5px;white-space:nowrap;line-height:1.2;color:#fff}',
    '.pb.card .pb-dev{color:#2ec27e;font-size:12.5px;margin-top:2px}',
    '.pb.card .pb-sub{color:#9aa0a6;font-size:11px;margin-top:1px;white-space:nowrap}',
    '.pb.card .pb-act{flex:none;display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.pb.card .pb-pill{background:#01875f;color:#fff;font-weight:500;font-size:13px;border-radius:8px;padding:6px 11px;white-space:nowrap;font-size:12.5px}',
    /* C: compact pill */
    '.pb.pill .pb-in{display:flex;align-items:center;gap:8px;background:#0e1c1c;border:1px solid #2c5552;border-radius:999px;padding:5px 12px 5px 6px;box-shadow:0 8px 24px rgba(0,0,0,.55)}',
    '.pb.pill .pb-ic{width:28px;height:28px;border-radius:50%}',
    '.pb.pill .pb-title{font-size:13px;font-weight:500;white-space:nowrap}',
    '.pb.pill .pb-dev{font-size:11px;color:#2ec27e;margin-left:-4px;white-space:nowrap}',
    '.pb.pill .pb-sub,.pb.pill .pb-act{display:none}',
    /* folded: icon only with a tiny Play mark */
    '.pb.min .pb-in{padding:0;background:transparent;border:0;box-shadow:none;gap:0;width:auto}',
    '.pb.min .pb-t,.pb.min .pb-act,.pb.min .pb-glyph{display:none}',
    '.pb.min .pb-ic{width:44px;height:44px;border-radius:50%;box-shadow:0 6px 18px rgba(0,0,0,.55);border:2px solid #2c5552}',
    '.pb.min .pb-mini{display:grid}',
    '.pb .pb-mini{display:none;position:absolute;right:-2px;bottom:-2px;width:18px;height:18px;border-radius:50%;background:#fff;place-items:center;box-shadow:0 1px 3px rgba(0,0,0,.4)}',
    '.pb .pb-wrap{position:relative;display:block;flex:none}',
    '.pb:focus-visible{outline:2px solid #e3c060;outline-offset:3px;border-radius:14px}',
    '@media (prefers-reduced-motion:reduce){.pb{transition:none}}'
  ].join('\n');

  var glyph = function (s) {
    return '<svg class="pb-glyph" width="' + s + '" height="' + s + '" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path fill="#00d7fe" d="M4.5 3.2c-.5.5-.7 1.2-.7 2.1v21.4c0 .9.2 1.6.7 2.1l12-12.8z"/>' +
      '<path fill="#00f076" d="M20.6 20.1l-4.1-4.1-12 12.8c.7.7 1.9.8 3.2.1l12.9-7.3"/>' +
      '<path fill="#ffc900" d="M20.6 11.9l4.6 2.6c1.4.8 1.4 2.2 0 3l-4.6 2.6-4.1-4.1z"/>' +
      '<path fill="#ff3a44" d="M4.5 3.2c.7-.7 1.9-.8 3.2-.1l12.9 7.3-4.1 4.1z"/></svg>';
  };

  function mount() {
    var old = document.querySelector('.einstein-cta');
    if (old) old.style.display = 'none';

    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var a = document.createElement('a');
    a.className = 'pb ' + mode + ' ' + pos;
    a.href = href;
    a.rel = 'noopener';
    a.setAttribute('aria-label', android ? 'Get AA Big Book Search + AI Guide on Google Play' : 'Open AA Big Book Search + AI Guide, the free web app');
    var title = mode === 'card' ? 'AA Big Book Search<br>+ AI Guide' : 'Big Book app';
    var dev = mode === 'card' ? 'AutoGrow AI Solutions' : (android ? 'Google Play' : 'free web app');
    var sub = android ? 'In-app purchases · Free' : 'Free · also on Google Play';
    var pill = android ? 'Install' : 'Open web app';
    a.innerHTML =
      '<span class="pb-in">' +
        '<span class="pb-wrap"><span class="pb-ic" style="background-image:url(\'' + icon + '\')"></span><span class="pb-mini">' + glyph(11) + '</span></span>' +
        '<span class="pb-t"><span class="pb-title">' + title + '</span><span class="pb-dev" style="display:block">' + dev + '</span><span class="pb-sub" style="display:block">' + sub + '</span></span>' +
        (mode === 'pill' ? glyph(16) : '') +
        '<span class="pb-act">' + glyph(22) + '<span class="pb-pill">' + pill + '</span></span>' +
      '</span>';
    document.body.appendChild(a);

    // Fold after the first real scroll or pan; one tap re-expands, the next tap follows the link.
    var folded = false, armed = false;
    function fold() { if (folded) return; folded = true; a.classList.add('min'); }
    var startY = window.scrollY;
    function onScroll() { if (Math.abs(window.scrollY - startY) > 60) { fold(); off(); } }
    function onTouch() { fold(); off(); }
    function off() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onTouch);
      window.removeEventListener('touchmove', onTouch);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    a.addEventListener('click', function (e) {
      if (a.classList.contains('min')) {
        e.preventDefault();
        a.classList.remove('min'); folded = false; armed = true;
        setTimeout(function () { if (armed) { fold(); armed = false; } }, 6000); // refold if ignored
      }
    });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
