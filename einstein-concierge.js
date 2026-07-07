/* Recovery Einstein — website concierge widget (self-contained).
 * Add to any page:  <script src="/einstein-concierge.js" defer></script>
 * Optional config before the script:
 *   <script>window.EinsteinConcierge={endpoint:"/api/concierge",avatar:"/assets/einstein-daily.png"};</script>
 * Talks to the same-origin Pages Function at /api/concierge. No sign-in, no cookies.
 */
(function () {
  "use strict";
  var CFG = window.EinsteinConcierge || {};
  var ENDPOINT = CFG.endpoint || "/api/concierge";
  var AVATAR = CFG.avatar || "/assets/einstein-daily.png";
  var GREETING = CFG.greeting ||
    "Hey — I'm Einstein. No sign-up, no names, no judgment. Whatever's going on, we can take it one small step at a time. What brought you here today?";
  var CHIPS = CFG.chips || [
    "Is AA right for me?",
    "Find a meeting near me",
    "I'm worried about someone",
  ];

  var css =
    ".rec-launch{position:fixed;right:20px;bottom:20px;width:62px;height:62px;border-radius:50%;" +
    "background:#14141c;border:2px solid #d4af37;cursor:pointer;z-index:2147483000;box-shadow:0 6px 24px rgba(0,0,0,.45);" +
    "display:flex;align-items:center;justify-content:center;overflow:hidden;transition:transform .15s}" +
    ".rec-launch:hover{transform:scale(1.06)}.rec-launch img{width:100%;height:100%;object-fit:cover}" +
    ".rec-launch .rec-fallback{color:#d4af37;font:700 26px Georgia,serif}" +
    ".rec-panel{position:fixed;right:20px;bottom:20px;width:380px;max-width:calc(100vw - 24px);height:560px;" +
    "max-height:calc(100vh - 24px);background:#14141c;border:1px solid #2a2a38;border-radius:16px;z-index:2147483001;" +
    "display:none;flex-direction:column;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.55);" +
    "font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}" +
    ".rec-panel.open{display:flex}" +
    ".rec-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#1a1a24;border-bottom:1px solid #2a2a38}" +
    ".rec-head img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:1.5px solid #d4af37}" +
    ".rec-head .rec-fallback{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
    "border:1.5px solid #d4af37;color:#d4af37;font:700 18px Georgia,serif}" +
    ".rec-title{flex:1;line-height:1.2}.rec-title b{color:#f0f0f4;font-size:15px}.rec-title span{color:#9a9ab0;font-size:11px}" +
    ".rec-x{color:#9a9ab0;background:none;border:none;font-size:22px;cursor:pointer;padding:0 4px}.rec-x:hover{color:#fff}" +
    ".rec-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#14141c}" +
    ".rec-row{display:flex;gap:8px;max-width:88%}.rec-row.me{align-self:flex-end}.rec-row.ein{align-self:flex-start}" +
    ".rec-bub{padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}" +
    ".ein .rec-bub{background:#20202c;color:#e8e8ee;border-top-left-radius:4px}" +
    ".me .rec-bub{background:#d4af37;color:#14141c;border-top-right-radius:4px;font-weight:500}" +
    ".rec-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}" +
    ".rec-chip{background:#1a1a24;border:1px solid #3a3a48;color:#d4af37;border-radius:16px;padding:6px 11px;font-size:12.5px;cursor:pointer}" +
    ".rec-chip:hover{background:#20202c;border-color:#d4af37}" +
    ".rec-foot{display:flex;gap:8px;padding:10px;border-top:1px solid #2a2a38;background:#1a1a24}" +
    ".rec-foot input{flex:1;background:#14141c;border:1px solid #2a2a38;border-radius:20px;color:#e8e8ee;padding:10px 14px;font-size:14px;outline:none}" +
    ".rec-foot input:focus{border-color:#d4af37}" +
    ".rec-send{background:#d4af37;color:#14141c;border:none;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer;font-weight:700}" +
    ".rec-dots span{display:inline-block;width:6px;height:6px;margin:0 1px;background:#9a9ab0;border-radius:50%;animation:recb 1s infinite}" +
    ".rec-dots span:nth-child(2){animation-delay:.2s}.rec-dots span:nth-child(3){animation-delay:.4s}" +
    "@keyframes recb{0%,60%,100%{opacity:.3}30%{opacity:1}}" +
    ".rec-note{color:#6a6a80;font-size:10.5px;text-align:center;padding:4px 10px 8px;background:#1a1a24}" +
    "@media(max-width:480px){.rec-panel{right:0;bottom:0;width:100vw;height:100vh;max-width:100vw;max-height:100vh;border-radius:0}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function avatarHTML(cls) {
    return '<img class="' + cls + '" src="' + AVATAR + '" alt="Einstein" ' +
      "onerror=\"this.outerHTML='<div class=\\'rec-fallback\\'>E</div>'\">";
  }

  // ----- launcher -----
  var launch = document.createElement("button");
  launch.className = "rec-launch";
  launch.setAttribute("aria-label", "Chat with Recovery Einstein");
  launch.innerHTML = avatarHTML("");
  document.body.appendChild(launch);

  // ----- panel -----
  var panel = document.createElement("div");
  panel.className = "rec-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Recovery Einstein concierge");
  panel.innerHTML =
    '<div class="rec-head">' + avatarHTML("") +
    '<div class="rec-title"><b>Recovery Einstein</b><br><span>Private • Anonymous • No sign-up</span></div>' +
    '<button class="rec-x" aria-label="Close">×</button></div>' +
    '<div class="rec-msgs" id="recMsgs"></div>' +
    '<div class="rec-chips" id="recChips"></div>' +
    '<div class="rec-foot"><input id="recIn" type="text" placeholder="Type anything…" autocomplete="off" ' +
    'aria-label="Message Einstein"><button class="rec-send" id="recSend" aria-label="Send">↑</button></div>' +
    '<div class="rec-note">Not a crisis line. In an emergency call 911, or 988 (US) for the Suicide &amp; Crisis Lifeline.</div>';
  document.body.appendChild(panel);

  var msgs = panel.querySelector("#recMsgs");
  var chipsWrap = panel.querySelector("#recChips");
  var input = panel.querySelector("#recIn");
  var history = [];
  var greeted = false;
  var busy = false;

  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function linkify(s) {
    return esc(s).replace(
      /((?:https?:\/\/|www\.)[^\s<]+|\b[a-z0-9.-]+\.(?:com|org|net)(?:\/[^\s<]*)?)/gi,
      function (u) {
        var href = /^https?:\/\//i.test(u) ? u : "https://" + u;
        return '<a href="' + href + '" target="_blank" rel="noopener noreferrer" style="color:#d4af37;text-decoration:underline">' + u + "</a>";
      });
  }

  function addMsg(role, text) {
    var row = document.createElement("div");
    row.className = "rec-row " + (role === "user" ? "me" : "ein");
    var bub = document.createElement("div");
    bub.className = "rec-bub";
    if (role === "user") { bub.textContent = text; } else { bub.innerHTML = linkify(text); }
    row.appendChild(bub);
    msgs.appendChild(row);
    scroll();
    return row;
  }

  function showChips() {
    chipsWrap.innerHTML = "";
    CHIPS.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "rec-chip";
      b.textContent = c;
      b.onclick = function () { send(c); };
      chipsWrap.appendChild(b);
    });
  }
  function clearChips() { chipsWrap.innerHTML = ""; }

  function typing() {
    var row = document.createElement("div");
    row.className = "rec-row ein";
    row.innerHTML = '<div class="rec-bub rec-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(row); scroll();
    return row;
  }

  function send(text) {
    text = (text || input.value || "").trim();
    if (!text || busy) return;
    input.value = "";
    clearChips();
    addMsg("user", text);
    history.push({ role: "user", content: text });
    busy = true;
    var t = typing();
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        t.remove();
        var reply = (d && d.reply) || "Sorry — I hit a snag. Try again in a moment, or head to recoverystarts.com/meetings anytime.";
        addMsg("assistant", reply);
        history.push({ role: "assistant", content: reply });
      })
      .catch(function () {
        t.remove();
        addMsg("assistant", "I couldn't reach the server just now. You can always find a meeting at recoverystarts.com/meetings or aa.org.");
      })
      .finally(function () { busy = false; });
  }

  function openPanel() {
    panel.classList.add("open");
    launch.style.display = "none";
    if (!greeted) { addMsg("assistant", GREETING); history.push({ role: "assistant", content: GREETING }); showChips(); greeted = true; }
    input.focus();
  }
  function closePanel() { panel.classList.remove("open"); launch.style.display = "flex"; }

  launch.onclick = openPanel;
  panel.querySelector(".rec-x").onclick = closePanel;
  panel.querySelector("#recSend").onclick = function () { send(); };
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
})();
