// Meeting-info capture — someone tells us about a meeting the map is missing.
//
// POST /api/meeting-info  →  emails addict2influencer@gmail.com via Resend.
//
// Why this exists: the map is built by crawling what fellowships publish, and
// the rooms hardest to find are the ones least likely to be published well —
// which is exactly backwards from who needs them. This is the door for a room
// that has no website at all.
//
// ⚠ ANONYMITY IS THE DESIGN CONSTRAINT, NOT A NICETY. AA's eleventh and twelfth
// traditions are about members not being identified publicly, and this project
// has already been bitten once: a district feed published a member's name and
// personal mobile in a meeting's location field, and it went out on a public
// map. So: the form asks for a GROUP's public contact, never a person's; the
// submitter's own email is optional and used only to reply; nothing submitted
// here is published anywhere automatically. A human reads every one.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY   send-only Resend key
//   MEETING_INFO_TO  destination, defaults to addict2influencer@gmail.com
const TO_DEFAULT = "addict2influencer@gmail.com";
const FROM = "Recovery Starts <meetings@recoverystarts.com>";
const MAX = 4000; // per field; a meeting description is never a novel

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const clean = (v) => String(v ?? "").trim().slice(0, MAX);

export async function onRequestPost(context) {
  const { request, env } = context;
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");

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

  const name = clean(f.meeting_name);
  const where = clean(f.where);
  const when = clean(f.when);
  const program = clean(f.program);
  const link = clean(f.link);
  const contact = clean(f.group_contact);
  const notes = clean(f.notes);
  const from = clean(f.your_email);

  // The bar is deliberately low: a name, or an address, or just a link. Someone
  // typing this on a phone outside a church hall should not be made to fill in
  // a form. Anything at all that a human can follow up is enough.
  if (!(name || where || link || notes)) {
    return reply(wantsJson, 400, "Please tell us at least the meeting name, where it meets, or a link.");
  }
  if (from && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) {
    return reply(wantsJson, 400, "That email address does not look right — or leave it blank.");
  }

  const key = env.RESEND_API_KEY;
  if (!key) {
    // Never swallow this into a cheerful "thanks" — a form that silently drops
    // a meeting is worse than no form, because nobody ever tells you.
    return reply(wantsJson, 500, "Our form is misconfigured right now. Please email addict2influencer@gmail.com directly — sorry.");
  }

  const rows = [
    ["Meeting", name],
    ["Where", where],
    ["When", when],
    ["Fellowship", program],
    ["Link", link],
    ["Group contact (published)", contact],
    ["Notes", notes],
    ["Reply to", from],
  ].filter(([, v]) => v);

  const html =
    `<h2 style="font:600 18px system-ui">A meeting was submitted at recoverystarts.com</h2>` +
    `<table cellpadding="6" style="font:14px/1.5 system-ui;border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="vertical-align:top;color:#555"><strong>${esc(k)}</strong></td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join("") +
    `</table>` +
    `<p style="font:13px system-ui;color:#666">Submitted ${new Date().toISOString()} · ` +
    `country ${esc(request.headers.get("cf-ipcountry") || "?")}. Nothing here is published automatically.</p>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [env.MEETING_INFO_TO || TO_DEFAULT],
        subject: `Meeting info: ${name || where || link || "new submission"}`.slice(0, 120),
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
