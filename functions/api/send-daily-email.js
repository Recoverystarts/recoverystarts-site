// Daily Reflection Email Sender
// Fetches today's reflection and sends via Buttondown API (free tier)
// Triggered by external cron hitting: /api/send-daily-email?token=SECRET
// Protected by DAILY_EMAIL_TOKEN env var

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');
  const expectedToken = context.env.DAILY_EMAIL_TOKEN;

  if (!expectedToken || !token || token !== expectedToken) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const BUTTONDOWN_API_KEY = context.env.BUTTONDOWN_API_KEY;
  if (!BUTTONDOWN_API_KEY) {
    return jsonResponse({ error: 'Missing BUTTONDOWN_API_KEY' }, 500);
  }

  // dry_run=1 to test without actually sending
  const dryRun = url.searchParams.get('dry_run') === '1';

  try {
    // Get today's date in Mountain Time
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Edmonton',
      month: 'long', day: 'numeric', year: 'numeric'
    }).formatToParts(now);

    const monthName = parts.find(p => p.type === 'month').value;
    const day = parseInt(parts.find(p => p.type === 'day').value);
    const year = parts.find(p => p.type === 'year').value;
    const slug = `${monthName.toLowerCase()}-${day}`;
    const displayDate = `${monthName} ${day}, ${year}`;

    // Fetch today's reflection page (note: singular "reflection", trailing slash)
    const pageUrl = `https://recoverystarts.com/daily-reflection/${slug}/`;
    const pageResp = await fetch(pageUrl, { redirect: 'follow' });
    if (!pageResp.ok) {
      return jsonResponse({ error: `Page fetch failed: ${pageResp.status}`, url: pageUrl }, 500);
    }
    const html = await pageResp.text();

    // Extract content from the page HTML
    const title = extractBetween(html, '<h1 class="dr-theme">', '</h1>') || `Daily Reflection — ${displayDate}`;

    // Get reflection paragraphs from dr-bubble
    const bubbleMatch = html.match(/<div class="dr-bubble">([\s\S]*?)<div class="dr-ref">/);
    let reflection = '';
    if (bubbleMatch) {
      // Extract all <p> tag contents
      const pTags = bubbleMatch[1].match(/<p>([\s\S]*?)<\/p>/g) || [];
      reflection = pTags
        .map(p => stripHtml(p))
        .filter(Boolean)
        .join('\n\n');
    }

    const ref = stripHtml(extractBetween(html, '<div class="dr-ref">', '</div>') || '');

    // Get discussion question from dr-discuss
    const discussMatch = html.match(/<div class="dr-discuss">[\s\S]*?<p>([\s\S]*?)<\/p>/);
    const discussion = discussMatch ? stripHtml(discussMatch[1]) : '';

    // Compose Markdown email body
    const emailBody = `# ${title}

*${displayDate}*

---

${reflection}

*${ref}*

---

${discussion ? `**Something to sit with:** ${discussion}\n\n---\n\n` : ''}[Read today's full reflection](${pageUrl}) · [Talk to Einstein about this](https://app.recoverystarts.com)

*Recovery Einstein — an AI companion grounded in the Big Book of Alcoholics Anonymous.*
`;

    const subject = `☕ ${title}`;

    if (dryRun) {
      return jsonResponse({
        dry_run: true,
        date: displayDate,
        slug,
        subject,
        body_preview: emailBody.slice(0, 500) + '...',
        reflection_length: reflection.length,
        has_discussion: !!discussion
      });
    }

    // Send via Buttondown API
    const bdResp = await fetch('https://api.buttondown.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Buttondown-Live-Dangerously': 'true'
      },
      body: JSON.stringify({
        subject,
        body: emailBody,
        status: 'about_to_send',
        email_type: 'public'
      })
    });

    const bdData = await bdResp.json();

    if (!bdResp.ok) {
      return jsonResponse({
        error: 'Buttondown API error',
        status: bdResp.status,
        details: bdData
      }, 500);
    }

    return jsonResponse({
      success: true,
      date: displayDate,
      slug,
      subject,
      emailId: bdData.id,
      status: bdData.status
    });

  } catch (err) {
    return jsonResponse({ error: 'Internal error', message: err.message, stack: err.stack }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<span class="cite">\[([^\]]+)\]<\/span>/g, '[$1]')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
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
