// Dynamic RSS feed for Recovery Einstein Daily Reflections
// Serves today's reflection (and the past 6 days) as RSS items
// Buttondown watches this feed → sends daily automated email
// Endpoint: https://recoverystarts.com/api/daily-rss

const MONTHS = [
  '', 'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function onRequest(context) {
  try {
    // Fetch the reflections data from our own site
    const dataUrl = new URL('/daily-reflection/reflections.json', context.request.url);
    const resp = await fetch(dataUrl.toString());
    if (!resp.ok) {
      return new Response('Failed to load reflections data', { status: 500 });
    }
    const reflections = await resp.json();

    // Get today's date in Mountain Time (Alberta)
    const now = new Date();
    const mt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Edmonton' }));

    // Build items for today + past 6 days (7 total)
    const items = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mt);
      d.setDate(d.getDate() - i);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const key = `${month}-${day}`;
      const ref = reflections[key];
      if (!ref) continue;

      const monthSlug = MONTHS[month];
      const monthName = MONTH_NAMES[month];
      const dayStr = String(day);
      const pageUrl = `https://recoverystarts.com/daily-reflection/${monthSlug}-${dayStr}/`;

      // Build a proper RFC 822 date for pubDate
      const pubDate = new Date(d.getFullYear(), month - 1, day, 6, 0, 0);
      const rfc822 = pubDate.toUTCString();

      // Create a clean excerpt for the description (first 300 chars of thought)
      const excerpt = ref.thought.length > 300
        ? ref.thought.substring(0, 297) + '...'
        : ref.thought;

      items.push(`    <item>
      <title>${escapeXml(`${monthName} ${dayStr} — ${ref.theme}`)}</title>
      <link>${pageUrl}</link>
      <guid isPermaLink="true">${pageUrl}</guid>
      <pubDate>${rfc822}</pubDate>
      <description>${escapeXml(excerpt)}</description>
      <content:encoded><![CDATA[
        <h2>${escapeXml(ref.theme)}</h2>
        <p><em>Recovery Einstein's Big Book perspective for ${monthName} ${dayStr}</em></p>
        <p>${escapeXml(ref.thought)}</p>
        <p><strong>${escapeXml(ref.book_ref)}</strong></p>
        <hr>
        <p><strong>Something to sit with:</strong> ${escapeXml(ref.discussion)}</p>
        <p><a href="${pageUrl}">Read on recoverystarts.com →</a></p>
        <p><a href="https://app.recoverystarts.com/?utm_source=recoverystarts&utm_medium=site&utm_campaign=366mornings&utm_content=rss-daily">Talk to Recovery Einstein about today's theme →</a></p>
      ]]></content:encoded>
    </item>`);
    }

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Recovery Einstein — Daily Big Book Reflection</title>
    <link>https://recoverystarts.com/daily-reflection/</link>
    <description>Recovery Einstein's original Big Book perspective on the AA Daily Reflection — delivered fresh every morning. Not the official AA text; Einstein's unique reading grounded in exact page citations.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://recoverystarts.com/api/daily-rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://recoverystarts.com/assets/einstein-daily.png</url>
      <title>Recovery Einstein</title>
      <link>https://recoverystarts.com/daily-reflection/</link>
    </image>
${items.join('\n')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',  // Cache for 1 hour
      },
    });
  } catch (err) {
    return new Response(`RSS generation error: ${err.message}`, { status: 500 });
  }
}
