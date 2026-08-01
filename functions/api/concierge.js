// Cloudflare Pages Function — POST /api/concierge
// recoverystarts.com home-page "Recovery Einstein" — CALL TO ACTION ONLY.
// Not a recovery guide. His whole job: point to the meeting links already on
// the home page, and funnel everyone else to the app. Mentions nothing that
// isn't on the home page. PUBLIC + capped. Env: DEEPSEEK_API_KEY.

const MODEL = "deepseek-v4-flash";
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const MAX_TURNS = 16;
const MAX_CHARS = 4000;
const MAX_TOKENS = 300;

const SYSTEM_PROMPT = `You are Recovery Einstein, the friendly greeter on the recoverystarts.com home page. Here, you are NOT a recovery guide, a teacher, or a help desk. Your ONLY job is to warmly point people to what is already on this page and to the full app. You are a call to action for the app — nothing more.

HARD RULE — only ever point to things that are on THIS home page:
- the meeting links on the page (the "Find a Meeting" / fellowship list)
- the app at app.recoverystarts.com
Never mention or link anything that is not on this page — no outside websites, no aa.org, no phone numbers, no other resources. Never give recovery advice, Big Book teaching, chapters, or page numbers. That is what the app is for.

WHEN SOMEONE ASKS FOR A MEETING: warmly and briefly tell them that right here on this page there are links to meetings in their area with lots of options — point them to the "Find a Meeting" section. Nothing more.

WHEN SOMEONE WANTS TO TALK IN ANY DETAIL — about recovery, the Big Book, their situation, a loved one, anything real: do not try to help here. Warmly hand them to the app, for example: "My chat here is limited — but full voice chat and the entire Big Book are waiting for you at app.recoverystarts.com." Keep steering them there.

SAFETY (the one thing that overrides everything): If someone expresses thoughts of suicide, self-harm, or being in immediate danger, do NOT point them to the app — tell them to call or text 988 (Suicide & Crisis Lifeline) or 911 right now. Safety first, always.

TONE: warm, short, human, never preachy. You are the friendly face at the door, not the whole house. Every reply ends by pointing to the meeting links on this page or to app.recoverystarts.com. Plain text, plain bare URL (app.recoverystarts.com), no markdown, no asterisks.`;

// Abuse controls. Per-request cost was already capped (MAX_TURNS/MAX_CHARS/
// MAX_TOKENS); what was uncapped was the number of requests. Nothing here
// authenticates a visitor — the widget is deliberately anonymous — these just
// make the endpoint expensive to script against from outside a browser.
const ALLOWED_ORIGINS = [
  "https://recoverystarts.com",
  "https://www.recoverystarts.com",
];
const RATE_LIMIT_PER_HOUR = 40;

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Cloudflare Pages preview deployments for this project.
  return /^https:\/\/[a-z0-9-]+\.recoverystarts-site\.pages\.dev$/.test(origin);
}

/**
 * Per-IP hourly cap, backed by the CONCIERGE_RL KV namespace.
 *
 * Returns false (allow) when the binding is absent so the endpoint keeps
 * working before the namespace is created — the origin check above is the
 * control that works with no configuration. Bind CONCIERGE_RL in the Pages
 * project to turn this on.
 */
async function overRateLimit(env, ip) {
  if (!env.CONCIERGE_RL || !ip) return false;
  const bucket = `${ip}:${Math.floor(Date.now() / 3600000)}`;
  try {
    const used = parseInt((await env.CONCIERGE_RL.get(bucket)) || "0", 10);
    if (used >= RATE_LIMIT_PER_HOUR) return true;
    await env.CONCIERGE_RL.put(bucket, String(used + 1), { expirationTtl: 3600 });
    return false;
  } catch {
    // A KV outage must not take the greeter down with it.
    return false;
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    // Browsers always send Origin on POST, so a missing or foreign Origin
    // means this did not come from the widget on the site.
    if (!isAllowedOrigin(request.headers.get("origin"))) {
      return json({ error: "forbidden" }, 403);
    }

    if (await overRateLimit(env, request.headers.get("cf-connecting-ip"))) {
      return json({
        reply: "I need a breather — try again shortly. Meetings are listed right here on this page, and the full app is at app.recoverystarts.com.",
      });
    }

    const body = await request.json();
    let messages = Array.isArray(body.messages) ? body.messages : [];
    messages = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_TURNS)
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!messages.length) return json({ error: "no message" }, 400);

    let total = messages.reduce((n, m) => n + m.content.length, 0);
    while (total > MAX_CHARS && messages.length > 1) {
      total -= messages.shift().content.length;
    }

    const key = env.DEEPSEEK_API_KEY;
    if (!key) return json({ error: "server not configured" }, 500);

    const payload = {
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
    };

    const r = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const t = await r.text();
      return json({ error: "upstream", detail: t.slice(0, 160) }, 502);
    }
    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim()
      || "Find meetings right here on the page, or get the full Big Book and voice chat at app.recoverystarts.com.";
    return json({ reply });
  } catch (e) {
    return json({ error: "bad request" }, 400);
  }
}
