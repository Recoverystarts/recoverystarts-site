// Probe likely Cloudflare Pages project names + the branch-alias preview URL.
const projects = ["recoverystarts-site", "recoverystarts", "recovery-starts", "recoverystarts-com"];
const branch = "feat-seo-buildout";
const targets = [];
for (const p of projects) {
  targets.push(`https://${p}.pages.dev/`);
  targets.push(`https://${branch}.${p}.pages.dev/`);
}
(async () => {
  for (const u of targets) {
    try {
      const r = await fetch(u, { redirect: "manual" });
      const txt = r.status === 200 ? (await r.text()).slice(0, 4000) : "";
      const hasNew = txt.includes("study-card") || txt.includes("daily-tradition");
      console.log(r.status, u, hasNew ? "  <-- HAS THE NEW BUILD" : "");
    } catch (e) {
      console.log("---", u, e.cause && e.cause.code ? e.cause.code : e.message);
    }
  }
})();
