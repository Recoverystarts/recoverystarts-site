// Daily email: Einstein's Daily Reflection + the day's Daily Tradition reading, sent via Buttondown.
// Triggered by the Worker `daily-email-cron` (13:00 UTC) with `Authorization: Bearer <DAILY_EMAIL_TOKEN>`.
//
// Query params:
//   dry_run=1          build the email and return it in full; send nothing
//   date=<month>-<day> build for that day instead of today (e.g. date=march-3). Dry runs only.
//   test=1             create the email as a Buttondown draft and send it to the newsletter owner's
//                      address only (Buttondown's send-draft route); never reaches subscribers
//   note=<text>        a plain sentence or two put at the top of the email (used once, for the
//                      "we're back" send on 2026-11)
//
// If one page fails to load, the other one goes out alone. If both fail, nothing is sent (500).
// Tradition text is printed exactly as the Daily Tradition page prints it: no wording of ours is added
// to A.A. text, and the source line is the page's own "Grounded in:" line.

const SITE = 'https://recoverystarts.com';
const UTM = 'utm_source=email&utm_medium=email&utm_campaign=daily';
const withUtm = (u) => u + (u.includes('?') ? '&' : '?') + UTM;

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const expectedToken = context.env.DAILY_EMAIL_TOKEN;

  const auth = context.request.headers.get('Authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  // WAY BACK, remove on or after 2026-11-17: `?token=` is still accepted for one week after the
  // switch to the Authorization header (2026-11-10), in case the Worker has to be rolled back.
  const legacy = url.searchParams.get('token') || '';
  const token = bearer || legacy;

  if (!expectedToken || !token || !safeEqual(token, expectedToken)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const dryRun = url.searchParams.get('dry_run') === '1';
  const testSend = url.searchParams.get('test') === '1';
  const note = (url.searchParams.get('note') || '').trim().slice(0, 500);

  const BUTTONDOWN_API_KEY = context.env.BUTTONDOWN_API_KEY;
  if (!dryRun && !BUTTONDOWN_API_KEY) {
    return jsonResponse({ error: 'Missing BUTTONDOWN_API_KEY' }, 500);
  }

  try {
    // Today's date in Calgary, or a fixed day for dry runs.
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Edmonton', month: 'long', day: 'numeric', year: 'numeric'
    }).formatToParts(now);
    let monthName = parts.find(p => p.type === 'month').value;
    let day = parseInt(parts.find(p => p.type === 'day').value, 10);
    const year = parts.find(p => p.type === 'year').value;

    const dateParam = (url.searchParams.get('date') || '').toLowerCase();
    if (dateParam) {
      if (!dryRun) return jsonResponse({ error: 'date= is for dry runs only' }, 400);
      const m = dateParam.match(/^([a-z]+)-(\d{1,2})$/);
      if (!m) return jsonResponse({ error: 'date must look like march-3' }, 400);
      monthName = m[1][0].toUpperCase() + m[1].slice(1);
      day = parseInt(m[2], 10);
    }
    const slug = `${monthName.toLowerCase()}-${day}`;
    const displayDate = `${monthName} ${day}, ${year}`;

    const pageErrors = {};
    const soft = (name) => (err) => {
      pageErrors[name] = String((err && err.message) || err).slice(0, 200);
      console.error(`[send-daily-email] ${name}:`, pageErrors[name]);
      return null;
    };
    const [reflection, tradition] = await Promise.all([
      getReflection(slug).catch(soft('reflection')),
      getTradition(slug).catch(soft('tradition')),
    ]);

    if (!reflection && !tradition) {
      // Messages only (page URL + status); the caller already holds the token.
      return jsonResponse({ error: 'Both pages failed to load', slug, pageErrors }, 500);
    }

    const subjectParts = [];
    if (reflection) subjectParts.push(reflection.title);
    if (tradition) subjectParts.push(tradition.number ? `Tradition ${tradition.number}` : tradition.title);
    const subject = `☕ ${subjectParts.join(' · ')}`;

    const body = composeBody({ displayDate, reflection, tradition, note });

    if (dryRun) {
      return jsonResponse({
        dry_run: true,
        date: displayDate,
        slug,
        subject,
        has_reflection: !!reflection,
        has_tradition: !!tradition,
        pageErrors,
        body,
      });
    }

    const bdHeaders = {
      'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Buttondown-Live-Dangerously': 'true',
    };

    if (testSend) {
      // Draft first, then Buttondown's send-draft route, which mails only the newsletter's own address.
      const draftResp = await fetch('https://api.buttondown.com/v1/emails', {
        method: 'POST',
        headers: bdHeaders,
        body: JSON.stringify({ subject: `[TEST] ${subject}`, body, status: 'draft', email_type: 'public' }),
      });
      const draft = await draftResp.json();
      if (!draftResp.ok) {
        return jsonResponse({ error: 'Buttondown draft error', status: draftResp.status, details: draft }, 500);
      }
      const testResp = await fetch(`https://api.buttondown.com/v1/emails/${draft.id}/send-draft`, {
        method: 'POST',
        headers: bdHeaders,
        body: JSON.stringify({}),
      });
      const testText = await testResp.text();
      return jsonResponse({
        test: true,
        ok: testResp.ok,
        status: testResp.status,
        draftId: draft.id,
        details: testResp.ok ? undefined : testText.slice(0, 500),
        subject,
      }, testResp.ok ? 200 : 500);
    }

    const bdResp = await fetch('https://api.buttondown.com/v1/emails', {
      method: 'POST',
      headers: bdHeaders,
      body: JSON.stringify({ subject, body, status: 'about_to_send', email_type: 'public' }),
    });
    const bdData = await bdResp.json();
    if (!bdResp.ok) {
      return jsonResponse({ error: 'Buttondown API error', status: bdResp.status, details: bdData }, 500);
    }

    return jsonResponse({
      success: true,
      date: displayDate,
      slug,
      subject,
      has_reflection: !!reflection,
      has_tradition: !!tradition,
      emailId: bdData.id,
      status: bdData.status,
    });
  } catch (err) {
    // Log the detail, don't return it: this response is reachable by anyone
    // holding the token, and a stack trace maps out the Function for them.
    console.error('[send-daily-email] failed:', err && err.stack);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
}

async function fetchPage(pageUrl) {
  const resp = await fetch(pageUrl, {
    redirect: 'follow',
    headers: { 'User-Agent': 'recoverystarts-daily-email/2 (+https://recoverystarts.com)' },
  });
  if (!resp.ok) throw new Error(`${resp.status} ${pageUrl}`);
  return resp.text();
}

async function getReflection(slug) {
  const pageUrl = `${SITE}/daily-reflection/${slug}/`;
  const html = await fetchPage(pageUrl);

  const title = stripHtml(extractBetween(html, '<h1 class="dr-theme">', '</h1>') || '');
  const bubble = html.match(/<div class="dr-bubble">([\s\S]*?)<div class="dr-ref">/);
  const text = bubble
    ? (bubble[1].match(/<p>([\s\S]*?)<\/p>/g) || []).map(stripHtml).filter(Boolean).join('\n\n')
    : '';
  if (!title || !text) throw new Error('reflection page shape changed: ' + pageUrl);

  const ref = stripHtml(extractBetween(html, '<div class="dr-ref">', '</div>') || '');
  const discuss = html.match(/<div class="dr-discuss">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  return { pageUrl, title, text, ref, discussion: discuss ? stripHtml(discuss[1]) : '' };
}

async function getTradition(slug) {
  const pageUrl = `${SITE}/daily-tradition/${slug}/`;
  const html = await fetchPage(pageUrl);

  // Structure read from the live pages (2026-11-10): .dt-kicker "Tradition 11 · November 10",
  // h1.dt-title, .dt-reading <p>s, .dt-sit <p>, p.dt-grounded "Grounded in: …",
  // .dt-tradition > h2 + blockquote (the Tradition's own wording).
  const kicker = stripHtml(extractBetween(html, '<div class="dt-kicker">', '</div>') || '');
  const numMatch = kicker.match(/Tradition\s+(\d+)/);
  const title = stripHtml(extractBetween(html, '<h1 class="dt-title">', '</h1>') || '');
  const readingHtml = extractBetween(html, '<div class="dt-reading">', '</div>') || '';
  const reading = (readingHtml.match(/<p>([\s\S]*?)<\/p>/g) || []).map(stripHtml).filter(Boolean).join('\n\n');
  if (!title || !reading) throw new Error('tradition page shape changed: ' + pageUrl);

  const sitHtml = extractBetween(html, '<div class="dt-sit">', '</div>') || '';
  const sitP = sitHtml.match(/<p>([\s\S]*?)<\/p>/);
  const grounded = stripHtml(extractBetween(html, '<p class="dt-grounded">', '</p>') || '');

  const tradHtml = extractBetween(html, '<div class="dt-tradition">', '<div class="dt-longform">') || '';
  const tradHeading = stripHtml((tradHtml.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || '');
  const tradQuote = stripHtml((tradHtml.match(/<blockquote>([\s\S]*?)<\/blockquote>/) || [])[1] || '');

  return {
    pageUrl,
    number: numMatch ? numMatch[1] : '',
    title,
    reading,
    sitWith: sitP ? stripHtml(sitP[1]) : '',
    grounded,
    tradHeading,
    tradQuote,
  };
}

function composeBody({ displayDate, reflection, tradition, note }) {
  const out = [];
  if (note) out.push(`*${note}*`, '---');

  if (reflection) {
    out.push(`# ${reflection.title}`, `*${displayDate}*`, reflection.text);
    if (reflection.ref) out.push(`*${reflection.ref}*`);
    if (reflection.discussion) out.push(`**Something to sit with:** ${reflection.discussion}`);
    out.push('---');
  }

  if (tradition) {
    const head = tradition.number ? `Daily Tradition · Tradition ${tradition.number}` : 'Daily Tradition';
    out.push(`## ${head}: ${tradition.title}`);
    if (!reflection) out.push(`*${displayDate}*`);
    out.push(tradition.reading);
    if (tradition.sitWith) out.push(`**Sit with:** ${tradition.sitWith}`);
    if (tradition.grounded) out.push(`*${tradition.grounded}*`);
    if (tradition.tradQuote) {
      if (tradition.tradHeading) out.push(`**${tradition.tradHeading}**`);
      out.push(`> ${tradition.tradQuote}`);
    }
    out.push(`[Read it on recoverystarts.com](${withUtm(tradition.pageUrl)})`, '---');
  }

  out.push(`**Find a meeting:** [recoverystarts.com/meetings/](${withUtm(SITE + '/meetings/')})`);
  out.push('Share this with someone in need.');

  const links = [];
  if (reflection) links.push(`[Read today's full reflection](${withUtm(reflection.pageUrl)})`);
  links.push('[Talk to Einstein about this](https://app.recoverystarts.com/?utm_source=email&utm_medium=email&utm_campaign=daily&utm_content=email-daily)');
  out.push(links.join(' · '));

  out.push('*Recovery Einstein — an AI companion grounded in the Big Book of Alcoholics Anonymous. Daily Traditions is an independent educational resource from Recovery Starts, not official A.A. literature.*');
  return out.join('\n\n') + '\n';
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<span class="cite">\[([^\]]+)\]<\/span>/g, '[$1]')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractBetween(html, startTag, endTag) {
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) return null;
  const contentStart = startIdx + startTag.length;
  const endIdx = html.indexOf(endTag, contentStart);
  if (endIdx === -1) return null;
  return html.slice(contentStart, endIdx);
}
