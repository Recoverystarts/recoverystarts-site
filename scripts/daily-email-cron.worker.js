// Source of the Cloudflare Worker `daily-email-cron` (cron `0 13 * * *` UTC = 06:00 Calgary in MST, 07:00 in MDT).
// Not served by Pages (scripts/ is left out of dist/). Deploy it by uploading this file as the Worker's module
// (API: PUT /accounts/<id>/workers/scripts/daily-email-cron, main_module worker.js); the secret DAILY_EMAIL_TOKEN
// stays on the Worker, its value lives in the ops-vault as `daily-email-token`.
//
// 2026-11-10 (claude-home #403): from 2026-08-12 on, the zone's WAF rule "Block empty user agent" blocked this
// Worker's fetch every day with a 403 (it sent no User-Agent), and the old version swallowed the error. So it now
// names itself, sends the token in a header rather than the URL, and logs the HTTP status.
export default {
  async scheduled(event, env, ctx) {
    const token = env.DAILY_EMAIL_TOKEN;
    if (!token) {
      console.error('Missing DAILY_EMAIL_TOKEN');
      return;
    }
    try {
      // The pages.dev address, not recoverystarts.com: the zone's WAF challenges server-to-server callers
      // (seen 2026-11-10 from the vault), and pages.dev serves the same production deployment.
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
