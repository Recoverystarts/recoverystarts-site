/* rs-t.js — the phrasebook for pages whose words are written by a script in the browser (2026-10-11, WO-TRANSLATE-SITE).
 *
 * The map (find.html + find-looks.mjs), the online calendar (online-cal.js) and the online page's small scripts build
 * their words in the browser, in English, thousands of lines of them. Rather than thread a dictionary through each, the
 * server puts the page language's phrasebook in window.RS_T (server/i18n/<code>.mjs `phrases`) and this file swaps our
 * English for it as the page draws itself:
 *   p     exact phrases: a text node (or a placeholder / title / aria-label) whose trimmed text IS the key, kept with
 *         any leading emoji or symbol and trailing arrow ("🌙 Tonight" finds "Tonight")
 *   r     patterns, [source, flags, replacement] for words with numbers in them ("in 12 min", "2:00 PM", "Oct 11")
 *   skip  a CSS selector whose text is a publisher's (a meeting's name, its place): never touched
 * Nothing runs on an English page (no RS_T). A phrase that isn't in the book stays English: the page never breaks over a
 * missing word, it just shows the English one, and window.RS_T_MISSING lists them for the proof.
 * RS_t(s) is the same lookup for a script that needs a word as a string (a title, a calendar file).
 */
(function () {
  "use strict";
  var B = window.RS_T;
  if (!B || !B.p) return;
  var P = B.p, R = [], skip = B.skip || "", miss = (window.RS_T_MISSING = {});
  for (var i = 0; i < (B.r || []).length; i++) { try { R.push([new RegExp(B.r[i][0], B.r[i][1] || ""), B.r[i][2]]); } catch (e) {} }
  var LET = /[A-Za-z]/;
  // a leading run of symbols/emoji/space and a trailing run of arrows/punctuation are kept as they are
  var EDGE = /^([^A-Za-z0-9]*)([\s\S]*?)([\s↓↑→←↗▾▸…:·.!?)]*)$/;
  function one(s) {
    if (!s || !LET.test(s)) return null;
    var hit = P[s];
    if (hit != null) return hit;
    var m = EDGE.exec(s);
    if (m && m[2] && m[2] !== s) { hit = P[m[2]]; if (hit != null) return m[1] + hit + m[3]; }
    // "Sun · in 2h · till 6:30 PM": each piece between the dots is its own phrase
    if (s.indexOf(" · ") > 0) {
      var parts = s.split(" · "), any = false;
      for (var q = 0; q < parts.length; q++) { var y = one(parts[q]); if (y != null) { parts[q] = y; any = true; } }
      if (any) return parts.join(" · ");
    }
    var out = s, changed = false;
    for (var k = 0; k < R.length; k++) { R[k][0].lastIndex = 0; if (R[k][0].test(out)) { R[k][0].lastIndex = 0; out = out.replace(R[k][0], R[k][1]); changed = true; } }
    // a pattern's {p:word} is that word looked up in the phrases ("{p:wd:Sun}" → "dom")
    if (changed) out = out.replace(/\{p:([^}]*)\}/g, function (m, w) { return P[w] != null ? P[w] : w.replace(/^\w+:/, ""); });
    if (changed && out !== s) return out;
    if (s.length < 80) miss[s] = (miss[s] || 0) + 1;
    return null;
  }
  window.RS_t = function (s) { var x = one(String(s).trim()); if (x == null) return s; var lead = /^\s*/.exec(s)[0], tail = /\s*$/.exec(s)[0]; return lead + x + tail; };
  // the value each text node last held when we read it (ours, after a swap): a node is read again only when a script
  // has written something new into it
  var seen = new WeakMap();
  function text(n) {
    var v = n.nodeValue;
    if (seen.get(n) === v) return;
    seen.set(n, v);
    if (!v || !LET.test(v)) return;
    var t = v.trim(); if (!t || t.length > 400) return;
    var x = one(t);
    if (x != null && x !== t) { var lead = /^\s*/.exec(v)[0], tail = /\s*$/.exec(v)[0]; n.nodeValue = lead + x + tail; seen.set(n, n.nodeValue); }
  }
  var ATTRS = ["placeholder", "title", "aria-label"];
  function attrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute && el.getAttribute(ATTRS[i]);
      if (!a || el["__rsv" + i] === a) continue;
      el["__rsv" + i] = a;
      if (!LET.test(a)) continue;
      var x = one(a.trim());
      if (x != null && x !== a) { el["__rsv" + i] = x; el.setAttribute(ATTRS[i], x); }
    }
  }
  // An element marked as another language is that language's own words — the picker's "English", "Português", "فارسی"
  // (Derick 2026-10-11 16:54: "each language to switch to is in its native language … I wouldnt know thats english") —
  // so the phrasebook never touches it, whatever the selector list says.
  var HERE = (document.documentElement.getAttribute("lang") || "").toLowerCase();
  function foreign(el) { var l = el.getAttribute && el.getAttribute("lang"); return l != null && l.toLowerCase() !== HERE; }
  function skipped(el) { if (!el.closest) return false; var c = el.closest("[lang]"); if (c && c !== document.documentElement && foreign(c)) return true; return skip && el.closest(skip); }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { var p = root.parentElement; if (p && !/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName) && !skipped(p)) text(root); return; }
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName) || skipped(root)) return;
    attrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (n.nodeType === 1) return /^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName) || foreign(n) || (skip && n.matches && n.matches(skip)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) text(n); else attrs(n); }
  }
  function start() {
    walk(document.body);
    if (document.title) { var tt = one(document.title.trim()); if (tt != null) document.title = tt; }
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === "characterData") text(m.target);
        else if (m.type === "attributes") attrs(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
