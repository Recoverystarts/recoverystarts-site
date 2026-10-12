// globe.mjs — the 🌐 in the main site's menu (wave tr1; WO-TRANSLATE-SITE v2 §3). One list on every page that exists in
// more than one language, each language written in its own name and marked with its own lang (so nothing ever
// translates "English" into "Inglés" — Derick 2026-10-11 16:54). The same look as the meeting finder's (sitenav.mjs).
// A click remembers the choice in rs_hl (localStorage, cookie fallback), the key the meeting finder's hl.js reads, so a
// reader who picks Español on the homepage gets the finder in Spanish too.
import { LANGS, tagOf } from "./lib.mjs";
const SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"></path></svg>`;
export const GLOBE_CSS = `<style id="rs-globe-css">
.rs-globe{position:relative;order:9;margin-left:12px;flex:none;font-family:var(--font-ui,system-ui)}
.rs-globe summary{list-style:none;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(255,255,255,.18);border-radius:999px;color:#F2F4FF;cursor:pointer}
.rs-globe summary::-webkit-details-marker{display:none}
.rs-globe summary:hover{border-color:#2DD4BF;color:#2DD4BF}
.rs-globe .rs-langs{position:absolute;right:0;top:calc(100% + 10px);min-width:180px;background:#0E111C;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:8px;box-shadow:0 24px 56px rgba(0,0,0,.55);display:flex;flex-direction:column;z-index:1000}
.rs-globe .rs-langs a,.rs-globe .rs-here{padding:8px 10px;border-radius:8px;color:#D0D7EE;font-size:15px;text-decoration:none}
.rs-globe .rs-langs a:hover{background:rgba(45,212,191,.10);color:#2DD4BF}
.rs-globe .rs-here{color:#2DD4BF;font-weight:600}
@media (max-width:1020px){.rs-globe{order:1;margin-left:auto;margin-right:8px}.nav-toggle{order:2}}
/* the phone menu at any width where the menu's words don't fit (a longer language, a big font): the few lines in
   GLOBE_JS measure the bar and set .rs-tight — the same rules as style.css's max-width:1020px block */
/* on a wide screen the menu's own width is capped (--max-width): the globe sits in the margin outside it (.rs-out), and
   the menu may use more of the screen than that cap when a longer language needs it (up to 130px short of each edge) */
.nav.rs-out .nav-inner{max-width:max(var(--max-width), calc(100vw - 260px))}
.nav.rs-out .rs-globe{position:absolute;right:16px;top:50%;transform:translateY(-50%);margin:0}
.rs-tight .nav-toggle{display:block;order:2}.rs-tight .rs-globe{order:1;margin-left:auto;margin-right:8px}
.rs-tight .nav-links{display:none;position:absolute;top:var(--nav-height);left:0;right:0;background:rgba(4,6,13,.96);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);flex-direction:column;align-items:stretch;padding:1.5rem;gap:1.1rem;border-bottom:1px solid var(--rule);max-height:calc(100vh - var(--nav-height));overflow-y:auto}
.rs-tight .nav-links.open{display:flex}.rs-tight .nav-links .has-sub{display:block}.rs-tight .nav-links .has-sub>a{display:inline-block}
.rs-tight .sub-menu{display:none;position:static;margin:10px 0 0 4px;padding:2px 0 2px 14px;border-left:1px solid var(--rule)}.rs-tight .has-sub.open>.sub-menu{display:block}
.rs-tight .sub-menu a{display:block;padding:7px 0;color:var(--ink-soft)}.rs-tight .nav-cta{text-align:center}
/* the offer (wave tr2 S2): one closable line under the menu, in the reader's own language, when their browser's language has
   this page and they haven't chosen yet — the same bar and words as the meeting finder's (sitenav.mjs .rsn-offer) */
.rs-offer{position:fixed;top:var(--nav-height);left:0;right:0;z-index:998;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;background:#0E3B36;color:#E6FFFA;padding:8px 16px;font:14px/1.4 var(--font-ui,system-ui)}
.rs-offer a{color:#5EEAD4;font-weight:600;text-decoration:underline}
.rs-offer button{background:none;border:0;color:inherit;font-size:22px;line-height:1;min-width:36px;min-height:36px;cursor:pointer}
</style>`;
// here: the page's language; avail: { code: url } for every language this page exists in
export function globeHtml(here, avail) {
  const own = (c) => `lang="${tagOf(c)}"${LANGS[c].dir === "rtl" ? ' dir="rtl"' : ""}`;
  // always in LANGS order (English, Español, Português…), whichever language was built last
  const order = Object.keys(LANGS);
  const items = Object.entries(avail).filter(([c]) => c !== here).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b)).map(([c, u]) => `<a href="${u}" data-hl="${c}" hreflang="${tagOf(c)}" ${own(c)}>${LANGS[c].name}</a>`).join("");
  return `<details class="rs-globe"><summary aria-label="Language · Idioma · Langue · Sprache · زبان">${SVG}</summary><div class="rs-langs"><span class="rs-here" ${own(here)}>✓ ${LANGS[here].name}</span>${items}</div>${GO_JS}</details>`;
}
// One remembered choice across recoverystarts.com, /meetings and /online (wave tr2 S2): a reader who picked a language
// on either site (rs_hl: localStorage, cookie fallback; "pt" here, "pt-BR" from the meeting finder — matched on the part
// before the dash, as the finder's hl.js does) and lands on a page in another language goes to this page in theirs, if
// the 🌐 lists it. It runs inside the 🌐, as the menu is read, so the wrong language barely shows. A crawler stores
// nothing, so it always gets the page it asked for.
const GO_JS = `<script>/*rs-go*/(function(){try{var c=null;try{c=localStorage.getItem('rs_hl')}catch(e){}if(!c){var m=document.cookie.match(/(?:^|; )rs_hl=([^;]*)/);if(m)c=decodeURIComponent(m[1])}if(!c)return;c=String(c).toLowerCase().split('-')[0];var h=(document.documentElement.lang||'en').toLowerCase().split('-')[0];if(c===h)return;var d=document.currentScript&&document.currentScript.parentNode,a=d&&d.querySelector('a[data-hl="'+c+'"]');if(a&&a.getAttribute('href'))location.replace(a.getAttribute('href')+location.hash)}catch(e){}})();</script>`;
// The offer line's words, each in its own language (the meeting finder's sitenav.mjs OFFER_JS and i18n/es.mjs offer)
const OFFER = { en: ["This page is also in English.", "View in English"], es: ["Esta página también está en español.", "Ver en español"], pt: ["Esta página também está em português.", "Ver em português"] };
// remember a pick (the meeting finder's hl.js reads rs_hl) — one line, no dependencies
export const GLOBE_JS = `<script>/*rs-globe*/(function(){var n=document.querySelector('nav.nav'),i=n&&n.querySelector('.nav-inner');function over(){return i.scrollWidth>i.clientWidth+1}function fit(){if(!i)return;n.classList.remove('rs-tight','rs-out');n.classList.add('rs-out');if(!over()&&innerWidth-i.getBoundingClientRect().right>=60&&innerWidth>1020)return;n.classList.remove('rs-out');if(!over())return;if(over())n.classList.add('rs-tight')}fit();addEventListener('resize',fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit)})();document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.rs-globe a[data-hl],.rs-offer a[data-hl]');if(!a)return;var v=a.getAttribute('data-hl');try{localStorage.setItem('rs_hl',v)}catch(x){}try{document.cookie='rs_hl='+encodeURIComponent(v)+'; path=/; max-age=31536000; SameSite=Lax'}catch(x){}},true);
(function(){try{if(localStorage.getItem('rs_lang_offer')||localStorage.getItem('rs_hl'))return}catch(e){return}if(/(?:^|; )rs_hl=/.test(document.cookie))return;
var cur=(document.documentElement.lang||'en').toLowerCase().split('-')[0],want=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']).map(function(x){return String(x).toLowerCase().split('-')[0]});
if(!want[0]||want[0]===cur)return;var T=${JSON.stringify(OFFER)},pick=null;document.querySelectorAll('.rs-globe a[data-hl]').forEach(function(a){var c=(a.getAttribute('data-hl')||'').split('-')[0];if(!pick&&T[c]&&want.indexOf(c)>-1)pick=a});if(!pick)return;
var c=pick.getAttribute('data-hl').split('-')[0],bar=document.createElement('div');bar.className='rs-offer';bar.lang=pick.getAttribute('lang')||c;
var s=document.createElement('span');s.textContent=T[c][0];var a=document.createElement('a');a.href=pick.getAttribute('href');a.textContent=T[c][1];a.setAttribute('data-hl',pick.getAttribute('data-hl'));
var x=document.createElement('button');x.type='button';x.setAttribute('aria-label','×');x.textContent='×';function seen(){try{localStorage.setItem('rs_lang_offer','1')}catch(e){}}
a.addEventListener('click',seen);x.addEventListener('click',function(){seen();bar.remove()});bar.appendChild(s);bar.appendChild(a);bar.appendChild(x);document.body.appendChild(bar)})();</script>`;
// put the globe into a page's menu (replacing one already there), and its style and script once
export function stampGlobe(html, here, avail) {
  // (each removal takes the line break the stamp put before it, so stamping again changes nothing)
  html = html.replace(/\n[ \t]*<details class="rs-globe">[\s\S]*?<\/details>/, "").replace(/<style id="rs-globe-css">[\s\S]*?<\/style>\n/, "").replace(/\n?<script>\/\*rs-globe\*\/[\s\S]*?<\/script>/, "");
  if (Object.keys(avail).length < 2) return html;
  const g = globeHtml(here, avail);
  html = html.replace(/<\/ul>(\s*<\/div><\/nav>)/, (m, tail) => `</ul>\n    ${g}${tail}`);
  return html.replace(/<\/head>/i, () => `${GLOBE_CSS}\n</head>`).replace(/<\/body>/i, () => `\n${GLOBE_JS}</body>`);
}
