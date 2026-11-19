// Source of the Cloudflare Worker `daily-email-cron` (cron `0 13 * * *` UTC). Not served by Pages (scripts/ is left
// out of dist/). Its secret DAILY_EMAIL_TOKEN is on the Worker; the value is in the ops-vault as `daily-email-token`.
// It names itself in a User-Agent (the zone's WAF blocks empty ones), sends the token in a header, and logs the HTTP status.
export default {
  async scheduled(event, env, ctx) {
    const token = env.DAILY_EMAIL_TOKEN;
    if (!token) {
      console.error('Missing DAILY_EMAIL_TOKEN');
      return;
    }
    try {
      // The pages.dev address, not recoverystarts.com: the zone's WAF challenges server-to-server callers,
      // and pages.dev serves the same production deployment.
      const resp = await fetch('https://recoverystarts-site.pages.dev/api/send-daily-email', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'recoverystarts-daily-email-cron/2 (+https://recoverystarts.com)',
        },
      });
      const text = await resp.text();
      if (!resp.ok) console.error('Daily email failed:', resp.status, text.slice(0, 500));
      else console.log('Daily email result:', resp.status, text.slice(0, 500));
    } catch (err) {
      console.error('Daily email cron failed:', err.message);
    }
  },
  async fetch(request, env) {
    return new Response('Daily email cron worker. Triggered by schedule, not HTTP.', { status: 200 });
  }
};
