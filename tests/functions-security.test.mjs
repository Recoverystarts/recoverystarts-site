// Security sweep, 2026-11-19. Run: node --test tests/functions-security.test.mjs (site CI runs it).
// Each test is the attack it stops. fetch is replaced, so nothing leaves the process.
import { test } from "node:test";
import assert from "node:assert/strict";
import { onRequestPost, PER_IP_LIMIT } from "../functions/api/meeting-info.js";
import { onRequestGet as sendDaily } from "../functions/api/send-daily-email.js";

let sent = 0;
globalThis.fetch = async () => {
  sent++;
  return new Response("{}", { status: 200 });
};

function post(host, ip) {
  const body = new FormData();
  body.set("notes", "Tuesday 7pm, church basement");
  return onRequestPost({
    request: new Request(`https://${host}/api/meeting-info`, {
      method: "POST",
      body,
      headers: { accept: "application/json", "cf-connecting-ip": ip },
    }),
    env: { RESEND_API_KEY: "test-key" },
  });
}

test("meeting form: pages.dev (no WAF in front) sends nothing", async () => {
  sent = 0;
  const r = await post("recoverystarts-site.pages.dev", "198.51.100.1");
  assert.equal(r.status, 403);
  assert.equal(sent, 0);
});

test("meeting form: recoverystarts.com sends", async () => {
  sent = 0;
  const r = await post("recoverystarts.com", "198.51.100.2");
  assert.equal(r.status, 200);
  assert.equal(sent, 1);
});

test("meeting form: one address can't flood the inbox", async () => {
  sent = 0;
  const codes = [];
  for (let i = 0; i < PER_IP_LIMIT + 3; i++) codes.push((await post("recoverystarts.com", "198.51.100.3")).status);
  assert.equal(sent, PER_IP_LIMIT);
  assert.deepEqual(codes.slice(PER_IP_LIMIT), [429, 429, 429]);
});

test("daily email: a token in the URL no longer opens it", async () => {
  const env = { DAILY_EMAIL_TOKEN: "s3cret-token-value" };
  const viaUrl = await sendDaily({ request: new Request("https://x.pages.dev/api/send-daily-email?token=s3cret-token-value&dry_run=1"), env });
  assert.equal(viaUrl.status, 401);
  const wrong = await sendDaily({
    request: new Request("https://x.pages.dev/api/send-daily-email?dry_run=1", { headers: { Authorization: "Bearer nope" } }),
    env,
  });
  assert.equal(wrong.status, 401);
});
