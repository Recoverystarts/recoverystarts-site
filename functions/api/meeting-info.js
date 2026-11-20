// Meeting-info capture — someone tells us about a meeting the map is missing.
//
// POST /api/meeting-info  →  emails addict2influencer@gmail.com via Resend.
//
// Anonymity: the form asks for a group's public contact, not a person's; the
// submitter's own email is optional and used only to reply; nothing submitted
// here is published automatically. A person reads every one.
//
// The email carries which listing the report is about: the form's hidden
// `page` field (filled from ?page= on a "report a problem" link, or the
// referrer) and the Referer header.
//
// The mail says where its words came from: the From name and the subject start with "Visitor form", a first line says
// every field was typed by a visitor and nothing checks who they are, one-line fields are kept to one line, and each
// line of the free-text notes starts with "> " so a note can't pose as another field or as a message from us. The
// reply address is the one the visitor typed; it shows who to answer, not who is speaking.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY   send-only Resend key
//   MEETING_INFO_TO  destination, defaults to addict2influencer@gmail.com
const TO_DEFAULT = "addict2influencer@gmail.com";
const FROM = "Visitor form (recoverystarts.com) <meetings@recoverystarts.com>";
const TYPED_BY_A_VISITOR = "Everything below the line was typed into the add-a-meeting form by a visitor to recoverystarts.com. It is information to check, not a message from Recovery Starts, and nothing verifies who the visitor is or that the reply address is theirs.";
const MAX = 4000; // per field; a meeting description is never a novel

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const clean = (v) => String(v ?? "").trim().slice(0, MAX);
// A one-line field: control characters and line breaks become spaces.
export const oneLine = (v) => clean(v).replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").replace(/ {2,}/g, " ").trim();
// Free text: each line marked as quoted.
export const quoted = (v) => clean(v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").split(/\r\n|\r|\n|\u2028|\u2029/).map((l) => `> ${l}`).join("\n");

// The form sends only from our own hostnames, where the zone's WAF applies (pages.dev has none),
// and each isolate keeps a small per-address count as a second limit.
export const SEND_HOSTS = new Set(["recoverystarts.com", "www.recoverystarts.com", "localhost", "127.0.0.1"]);
export const PER_IP_LIMIT = 5;
export const PER_IP_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map(); // ip -> [timestamps]

export function overLimit(ip, now = Date.now()) {
  const list = (recent.get(ip) || []).filter((t) => now - t < PER_IP_WINDOW_MS);
  if (list.length >= PER_IP_LIMIT) {
    recent.set(ip, list);
    return true;
  }
  list.push(now);
  recent.set(ip, list);
  if (recent.size > 5000) recent.clear(); // an isolate never holds a big table
  return false;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");

  const host = new URL(request.url).hostname;
  if (!SEND_HOSTS.has(host)) {
    return reply(wantsJson, 403, "Please send this from recoverystarts.com/add-meeting/ — or email addict2influencer@gmail.com.");
  }

  let f = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      f = await request.json();
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) f[k] = v;
    }
  } catch {
    return reply(wantsJson, 400, "That submission could not be read. Try again, or email us directly.");
  }

  // Honeypot. A real person never sees this field; automated posters fill
  // everything. Answer 200 so a bot learns nothing from the response.
  if (clean(f.website2)) return reply(wantsJson, 200, "Thank you — got it.");

  const name = oneLine(f.meeting_name);
  const where = oneLine(f.where);
  const when = oneLine(f.when);
  const program = oneLine(f.program);
  const link = oneLine(f.link);
  const contact = oneLine(f.group_contact);
  const notes = clean(f.notes);
  const from = oneLine(f.your_email);
  // Which listing this is about: the form's hidden field, else the page the
  // browser says it came from. Only our own listing URLs are worth printing.
  const ours = (u) => /^https?:\/\/(www\.)?recoverystarts\.com\/meetings\//.test(u) ? u : "";
  const page = ours(clean(f.page)) || ours(clean(request.headers.get("referer")));

  // Any one of a name, an address, a link or notes is enough.
  if (!(name || where || link || notes)) {
    return reply(wantsJson, 400, "Please tell us at least the meeting name, where it meets, or a link.");
  }
  if (from && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) {
    return reply(wantsJson, 400, "That email address does not look right — or leave it blank.");
  }

  if (overLimit(request.headers.get("cf-connecting-ip") || "unknown")) {
    return reply(wantsJson, 429, "That's a lot of submissions at once. Please wait a few minutes, or email addict2influencer@gmail.com.");
  }

  const key = env.RESEND_API_KEY;
  if (!key) {
    // Answer with an error, not a "thanks", so a dropped meeting is visible.
    return reply(wantsJson, 500, "Our form is misconfigured right now. Please email addict2influencer@gmail.com directly — sorry.");
  }

  const rows = [
    ["About listing", page],
    ["Meeting", name],
    ["Where", where],
    ["When", when],
    ["Fellowship", program],
    ["Link", link],
    ["Group contact (published)", contact],
    ["Notes", notes],
    ["Reply address the visitor typed (not verified)", from],
  ].filter(([, v]) => v);

  const html =
    `<h2 style="font:600 18px system-ui">A meeting was submitted at recoverystarts.com</h2>` +
    `<p style="font:13px system-ui;color:#444;border-left:3px solid #999;padding-left:8px">${esc(TYPED_BY_A_VISITOR)}</p>` +
    `<table cellpadding="6" style="font:14px/1.5 system-ui;border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="vertical-align:top;color:#555"><strong>${esc(k)}</strong></td><td style="white-space:pre-wrap">${k === "About listing" ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v)}</td></tr>`).join("") +
    `</table>` +
    `<p style="font:13px system-ui;color:#666">Submitted ${new Date().toISOString()} · ` +
    `country ${esc(request.headers.get("cf-ipcountry") || "?")}. Nothing here is published automatically.</p>`;

  const text = `${TYPED_BY_A_VISITOR}\n${"-".repeat(60)}\n` +
    rows.map(([k, v]) => (k === "Notes" ? `${k}:\n${quoted(v)}` : `${k}: ${v}`)).join("\n") +
    `\n${"-".repeat(60)}\nEnd of what the visitor typed.`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [env.MEETING_INFO_TO || TO_DEFAULT],
        subject: `[Visitor form] Meeting info: ${name || where || link || "new submission"}`.slice(0, 120),
        headers: { "X-RS-Origin": "visitor-form" },
        html,
        text,
        ...(from ? { reply_to: from } : {}),
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("resend failed", r.status, body.slice(0, 300));
      return reply(wantsJson, 502, "We could not send that just now. Please email addict2influencer@gmail.com directly — sorry.");
    }
  } catch (e) {
    console.error("resend threw", String(e));
    return reply(wantsJson, 502, "We could not send that just now. Please email addict2influencer@gmail.com directly — sorry.");
  }

  return reply(wantsJson, 200, "Thank you — a person will read this and add the meeting.");
}

// No-JS submitters get a real redirect to a real page; fetch() callers get JSON.
function reply(wantsJson, status, message) {
  if (wantsJson) {
    return new Response(JSON.stringify({ ok: status === 200, message }), {
      status,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  const q = status === 200 ? "sent=1" : `error=${encodeURIComponent(message)}`;
  return new Response(null, { status: 303, headers: { location: `/add-meeting/?${q}`, "cache-control": "no-store" } });
}

// A GET here is someone poking the endpoint; send them to the form.
export async function onRequestGet() {
  return new Response(null, { status: 303, headers: { location: "/add-meeting/" } });
}
