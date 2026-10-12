// score.mjs — compare the runners' translation files side by side, without reading Spanish (wave tr1, 2026-10-11).
// node scripts/i18n/score.mjs es                 the files in i18n/es/ here
// node scripts/i18n/score.mjs es --branches      every pushed origin/claude/tr1-* branch's files, no merging needed
// node scripts/i18n/score.mjs es --branches --out i18n/reports/score.json   + the flagged segments, for a checker
// node scripts/i18n/score.mjs pt --branches      the same for Portuguese: origin/claude/tr2-* (a language's wave is in
//                                                WAVE below; --wave <name> reads another wave's branches)
// node scripts/i18n/score.mjs es --branches --wave tr3   a later wave's top-up lines: only files a branch changed from
//                                                origin/main are read, so a French line's copy of es/ isn't scored
//
// Every batch gets the same measurements, so a window that ran at a lower effort (or a different model) shows up as a
// row that's worse than its neighbours. None of these numbers say a translation is good; they find the places a person
// (a checker) should read first:
//   done      ids translated / ids in the batch (i18n/batches/<batch>.json)
//   tags      placeholders that don't match the English (<0>…</0>, <1/>): would break a link or a bold on the page
//   same      segments of 4+ words left identical to the English: not translated
//   english   segments where English filler words ("the", "and", "with", "your" …) are ≥15% of the words: half-translated
//   short     long segments whose Spanish is under 60% of the English length: something probably left out
//   numbers   a number in the English (a page, a year, a count) missing from the Spanish
//   glossary  of the recovery words the glossary fixes (Big Book, sponsor, Higher Power, amends …), how often the Spanish
//             uses the glossary's word: low = drifting vocabulary, which is what readers notice across pages
//   usted     es: "usted/ustedes" forms: the site speaks as "tú" (a few are fine in quotes; many means the wrong register)
//   reg       pt (wave tr2): the column "usted" counts the wrong register for Brazil: "tu"/"vós" forms ("tu és",
//             "teu", "vosso", "contigo") and European-Portuguese words and grammar ("facto", "telemóvel", "equipa",
//             "está a fazer"). The site speaks Brazilian Portuguese as "você".
//             fr (wave tr3): "tu"/"toi"/"ton"/"ta"/"tes"/"t'" forms — the site says "vous" (a few are fine inside a quote).
// score = 100 minus weighted problems per 100 segments, minus glossary drift. Compare rows; don't read it as a grade.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, I18N, LANGS, placeholdersOf, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const lang = args[0];
if (!lang || !LANGS[lang] || lang === "en") { console.error("usage: score.mjs <lang> [--branches] [--out file]"); process.exit(2); }
const useBranches = args.includes("--branches");
// each language's wave: its runners push origin/claude/<wave>-<line>
const WAVE = { es: "tr1", pt: "tr2", fr: "tr3" };
const wave = args.indexOf("--wave") > 0 ? args[args.indexOf("--wave") + 1] : WAVE[lang] ?? "tr1";
const pre = `claude/${wave}-`;
const outAt = args.indexOf("--out") > 0 ? args[args.indexOf("--out") + 1] : null;
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });

// where the files come from: { label, batch, json }
const files = [];
if (useBranches) {
  try { git("fetch", "-q", "origin", `+refs/heads/${pre}*:refs/remotes/origin/${pre}*`); } catch (e) { console.error("fetch failed:", e.message.split("\n")[0]); }
  const refs = git("for-each-ref", "--format=%(refname:short)", "refs/remotes/origin/claude/").split("\n").filter((r) => r.startsWith(`origin/${pre}`));
  for (const ref of refs) {
    let names = [];
    try { names = git("ls-tree", "--name-only", ref, `i18n/${lang}/`).split("\n").map((n) => path.basename(n)); } catch { continue; }
    for (const n of names) {
      if (!n.endsWith(".json") || n.startsWith("_") || n === "core.json") continue;
      const batch = n.slice(0, -5);
      if (!fs.existsSync(path.join(I18N, "batches", `${batch}.json`))) continue;
      // a file the branch didn't change (it came with main) isn't this line's work
      try { if (git("rev-parse", `${ref}:i18n/${lang}/${n}`).trim() === git("rev-parse", `origin/main:i18n/${lang}/${n}`).trim()) continue; } catch {}
      try { files.push({ label: ref.slice(`origin/${pre}`.length), batch, json: JSON.parse(git("show", `${ref}:i18n/${lang}/${n}`)) }); }
      catch (e) { files.push({ label: ref.slice(`origin/${pre}`.length), batch, json: null, err: "not valid JSON" }); }
    }
  }
} else {
  const dir = path.join(I18N, lang);
  for (const n of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (!n.endsWith(".json") || n.startsWith("_")) continue;
    const batch = n.slice(0, -5);
    const src = fs.existsSync(path.join(I18N, "batches", `${batch}.json`)) ? batch : null;
    if (!src && batch !== "core") continue;
    let json = null; try { json = JSON.parse(fs.readFileSync(path.join(dir, n), "utf8")); } catch {}
    files.push({ label: batch, batch, json, err: json ? null : "not valid JSON" });
  }
}

// the English for a batch: i18n/batches/<batch>.json, or for core the core segments
const englishOf = (batch) => {
  if (batch === "core") return Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(path.join(I18N, "segments", "core.json"), "utf8"))).map(([id, v]) => [id, v.t]));
  return JSON.parse(fs.readFileSync(path.join(I18N, "batches", `${batch}.json`), "utf8"));
};

const strip = (s) => String(s).replace(/<\/?\d+\/?>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => strip(s).toLowerCase().match(/[\p{L}']+/gu) ?? [];
const EN_FILLER = new Set("the and with your you our we are was were this that these those from have has had which would could should into about there their they them what when where who will been being because than then just also only very".split(" "));
const nums = (s) => (strip(s).match(/\d[\d,.]*/g) ?? []).map((n) => n.replace(/[.,]$/, "").replace(/[,.](?=\d{3}\b)/g, "")).filter((n) => n.length);
// the glossary's fixed words (i18n/<lang>/GLOSSARY.md): English pattern → what the translation should contain
const GLOSS_BY = {};
GLOSS_BY.es = [
  [/\bBig Book\b/i, /Libro Grande/i, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /padrin|madrin|apadrin/i, "sponsor"],
  [/\bsponsees?\b/i, /ahijad/i, "sponsee"],
  [/\bHigher Power\b/i, /Poder Superior/i, "Higher Power"],
  [/\bhome groups?\b/i, /grupo base|grupos base/i, "home group"],
  [/\bnewcomers?\b/i, /reci[eé]n llegad/i, "newcomer"],
  [/\bamends\b/i, /enmienda|repar/i, "amends"],
  [/\bresentments?\b/i, /resentimiento/i, "resentment"],
  [/\binventory\b/i, /inventario/i, "inventory"],
  [/\bsobriety\b/i, /sobriedad/i, "sobriety"],
  [/\bspiritual awakening\b/i, /despertar espiritual/i, "spiritual awakening"],
  [/\bgroup conscience\b/i, /conciencia de grupo/i, "group conscience"],
  [/\banonymity\b/i, /anonimato/i, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /defectos de car[aá]cter/i, "defects of character"],
  [/\bfellowship\b/i, /comunidad|confraternidad|compa[nñ]erismo/i, "fellowship"],
  [/\bTraditions?\b/, /Tradici/i, "Tradition"],
  [/\bSteps?\b/, /Paso/i, "Step"],
  [/\bpowerless\b/i, /impotente/i, "powerless"],
  [/\bunmanageable\b/i, /ingobernable/i, "unmanageable"],
];
// Brazilian Portuguese (i18n/pt/GLOSSARY.md; JUNAAB's wording at aa.org.br)
GLOSS_BY.pt = [
  [/\bBig Book\b/i, /Livro Azul/i, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /padrinh|madrinh|apadrinh/i, "sponsor"],
  [/\bsponsees?\b/i, /afilhad/i, "sponsee"],
  [/\bHigher Power\b/i, /Poder Superior/i, "Higher Power"],
  [/\bhome groups?\b/i, /grupo base|grupos base/i, "home group"],
  [/\bnewcomers?\b/i, /rec[eé]m-chegad|ingressante/i, "newcomer"],
  [/\bamends\b/i, /repara[çc]/i, "amends"],
  [/\bresentments?\b/i, /ressentiment/i, "resentment"],
  [/\binventory\b/i, /invent[aá]rio/i, "inventory"],
  [/\bsobriety\b/i, /sobriedade/i, "sobriety"],
  [/\bspiritual awakening\b/i, /despertar espiritual/i, "spiritual awakening"],
  [/\bgroup conscience\b/i, /consci[eê]ncia (de grupo|coletiva)/i, "group conscience"],
  [/\banonymity\b/i, /anonimato/i, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /defeitos de car[aá]ter/i, "defects of character"],
  [/\bfellowship\b/i, /Irmandade/i, "fellowship"],
  [/\bTraditions?\b/, /Tradi[çc]/i, "Tradition"],
  [/\bSteps?\b/, /Passo/i, "Step"],
  [/\bpowerless\b/i, /impotentes?/i, "powerless"],
  [/\bunmanageable\b/i, /perdido o dom[ií]nio|dom[ií]nio/i, "unmanageable"],
];
// French (i18n/fr/GLOSSARY.md; A.A. World Services' French wording, aa.org)
GLOSS_BY.fr = [
  [/\bBig Book\b/i, /Gros Livre|Alcooliques anonymes/i, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /parrain|marraine/i, "sponsor"],
  [/\bsponsees?\b/i, /filleul/i, "sponsee"],
  [/\bHigher Power\b/i, /Puissance sup[ée]rieure/i, "Higher Power"],
  [/\bhome groups?\b/i, /groupe d['’]attache|groupes d['’]attache/i, "home group"],
  [/\bnewcomers?\b/i, /nouveaux?|nouvelles?|nouveaux venus|nouvelle venue/i, "newcomer"],
  [/\bamends\b/i, /r[ée]par/i, "amends"],
  [/\bresentments?\b/i, /ressentiment/i, "resentment"],
  [/\binventory\b/i, /inventaire/i, "inventory"],
  [/\bsobriety\b/i, /sobri[ée]t[ée]|abstinence/i, "sobriety"],
  [/\bspiritual awakening\b/i, /r[ée]veil spirituel/i, "spiritual awakening"],
  [/\bgroup conscience\b/i, /conscience de groupe/i, "group conscience"],
  [/\banonymity\b/i, /anonymat/i, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /d[ée]fauts/i, "defects of character"],
  [/\bTraditions?\b/, /Tradition/i, "Tradition"],
  [/\bSteps?\b/, /[ÉE]tape/i, "Step"],
  [/\bpowerless\b/i, /impuissant/i, "powerless"],
];
const GLOSS = GLOSS_BY[lang] ?? [];
// the wrong register: es "usted"; pt "tu"/"vós" forms and European-Portuguese words (Brazil says "você", "fato", "celular")
const REG = {
  es: /\busted(es)?\b/gi,
  fr: /(?<!\p{L})(?:(?:tu|toi|ton|ta|tes|tien|tienne)(?!\p{L})|t['’](?=\p{L}))/giu,
  pt: /(?<!\p{L})(tu|vós|teu|teus|tua|tuas|vosso|vossa|vossos|vossas|contigo|convosco|és|estás|tens|podes|queres|facto|factos|contacto|contactos|telemóvel|telemóveis|equipa|equipas|utilizador|utilizadores|ecrã|autocarro|casa de banho|registo|registos|(?:está|estão|estamos|estou) a \p{L}+r)(?!\p{L})/giu,
};

const rows = [], report = {};
for (const f of files) {
  const en = englishOf(f.batch), ids = Object.keys(en);
  const r = { line: f.label, batch: f.batch, n: ids.length, done: 0, tags: 0, same: 0, english: 0, short: 0, numbers: 0, gHit: 0, gAll: 0, usted: 0, err: f.err ?? null };
  const flags = [];
  const flag = (id, why) => flags.push({ id, why, en: String(en[id]).slice(0, 300), [lang]: String(f.json?.[id] ?? "").slice(0, 300) });
  if (f.json) for (const id of ids) {
    const t = f.json[id], e = en[id];
    if (typeof t !== "string" || !t.trim()) continue;
    r.done++;
    if (placeholdersOf(t).join(" ") !== placeholdersOf(e).join(" ")) { r.tags++; flag(id, "placeholders differ"); }
    const ew = words(e), tw = words(t);
    if (ew.length >= 4 && strip(t) === strip(e)) { r.same++; flag(id, "left in English"); continue; }
    if (tw.length >= 6 && tw.filter((w) => EN_FILLER.has(w)).length / tw.length >= 0.15) { r.english++; flag(id, "English words in the Spanish"); }
    const el = strip(e).length, tl = strip(t).length;
    if (el >= 80 && tl / el < 0.6) { r.short++; flag(id, `short (${Math.round((100 * tl) / el)}% of the English length)`); }
    const tn = new Set(nums(t)); const miss = nums(e).filter((n) => !tn.has(n));
    if (miss.length) { r.numbers++; flag(id, `number missing: ${miss.join(", ")}`); }
    for (const [ep, sp, name] of GLOSS) if (ep.test(strip(e))) { r.gAll++; if (sp.test(t)) r.gHit++; else flag(id, `glossary: "${name}"`); }
    const reg = (strip(t).match(REG[lang] ?? /(?!)/g) ?? []).length;
    if (reg && lang !== "es") flag(id, `register: ${(strip(t).match(REG[lang]) ?? []).slice(0, 3).join(", ")}`);
    r.usted += reg;
  }
  const per = (x) => (100 * x) / Math.max(1, r.done);
  const gloss = r.gAll ? r.gHit / r.gAll : 1;
  r.score = Math.max(0, Math.round(100 - per(r.tags) * 5 - per(r.same) * 3 - per(r.english) * 2 - per(r.short) * 2 - per(r.numbers) - (1 - gloss) * 30 - (r.done < r.n ? 30 * (1 - r.done / r.n) : 0)));
  r.glossary = r.gAll ? `${Math.round(gloss * 100)}% of ${r.gAll}` : "–";
  rows.push(r);
  report[`${f.label}:${f.batch}`] = { ...r, flags };
}

rows.sort((a, b) => a.score - b.score);
const pad = (s, n) => String(s).padEnd(n), lp = (s, n) => String(s).padStart(n);
console.log(`${lang}: ${rows.length} file(s)${useBranches ? ` from origin/${pre}* branches` : ""}, weakest first. A low score is where a checker reads first.\n`);
console.log(pad("line", 9) + pad("batch", 20) + lp("score", 6) + lp("done", 12) + lp("tags", 6) + lp("same", 6) + lp("engl", 6) + lp("short", 6) + lp("nums", 6) + lp(lang === "es" ? "usted" : "reg", 6) + "  glossary");
for (const r of rows) console.log(pad(r.line, 9) + pad(r.batch, 20) + lp(r.err ? "ERR" : r.score, 6) + lp(`${r.done}/${r.n}`, 12) + lp(r.tags, 6) + lp(r.same, 6) + lp(r.english, 6) + lp(r.short, 6) + lp(r.numbers, 6) + lp(r.usted, 6) + "  " + r.glossary + (r.err ? `  (${r.err})` : ""));
if (outAt) { writeJson(path.resolve(ROOT, outAt), report); console.log(`\nflagged segments → ${outAt}`); }
