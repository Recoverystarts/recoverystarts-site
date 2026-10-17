// score.mjs — compare the runners' translation files side by side, without reading Spanish (wave tr1, 2026-10-11).
// node scripts/i18n/score.mjs es                 the files in i18n/es/ here
// node scripts/i18n/score.mjs es --branches      every pushed origin/claude/tr1-* branch's files, no merging needed
// node scripts/i18n/score.mjs es --branches --out i18n/reports/score.json   + the flagged segments, for a checker
// node scripts/i18n/score.mjs pt --branches      the same for Portuguese: origin/claude/tr2-* (a language's wave is in
//                                                WAVE below; --wave <name> reads another wave's branches)
// node scripts/i18n/score.mjs es --branches --wave tr3   a later wave's top-up lines: only files a branch changed from
//                                                where it left this branch (HEAD) are read, so a French line's copy of es/ isn't scored
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
//             fa (wave tr4): Arabic ي/ك for Persian ی/ک; می/نمی written apart or run together without the half-space
//             (U+200C); "تو"/"تویی"/"خودت" where the site says «شما»; Latin , ; ? in Persian prose (، ؛ ؟).
//             pl (wave pl1): the site says "ty" in lower case, as Polish A.A.'s Big Book does (i18n/pl/GLOSSARY.md):
//             Pan/Pani/Państwo and "wy" forms (możecie, wasz) are the wrong register; ASCII " or English “ in prose
//             (Polish quotes „…”); and stripped diacritics — "sie", "moze", "ktory", "zycie" for się, może, który, życie,
//             or a long segment with no ą ć ę ł ń ó ś ź ż at all. Stripped diacritics also cost score (×2, like English words).
//             de (wave de1): the site says «Sie», as German-speaking A.A.'s Big Book does (i18n/de/GLOSSARY.md): du/dich/dir/
//             dein/euch/euer forms are the wrong register (fine inside a quote; the flag says which); ASCII " or English “…”
//             in prose (German quotes „…“); Swiss «ss» where standard German writes ß (gross, Strasse, heisst, weiss,
//             ausser…) and old «daß/muß»; umlauts written ae/oe/ue (fuer, ueber, koennen); a sentence starting lower case.
//             Each costs score (×2, like English words).
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
const WAVE = { es: "tr1", pt: "tr2", fr: "tr3", fa: "tr4", pl: "pl1", de: "de1" };
const wave = args.indexOf("--wave") > 0 ? args[args.indexOf("--wave") + 1] : WAVE[lang] ?? "tr1";
const pre = `claude/${wave}-`;
const outAt = args.indexOf("--out") > 0 ? args[args.indexOf("--out") + 1] : null;
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
const quiet = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

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
      // a file the branch didn't change (it came with the branch it started from) isn't this line's work
      try { const base = git("merge-base", ref, "HEAD").trim(); if (git("rev-parse", `${ref}:i18n/${lang}/${n}`).trim() === quiet("rev-parse", `${base}:i18n/${lang}/${n}`).trim()) continue; } catch {}
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

const strip = (s) => String(s).replace(/<\/?\d+\/?>/g, " ").replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, " ").replace(/\s+/g, " ").trim();
const words = (s) => strip(s).toLowerCase().match(/[\p{L}']+/gu) ?? [];
const EN_FILLER = new Set("the and with your you our we are was were this that these those from have has had which would could should into about there their they them what when where who will been being because than then just also only very".split(" "));
// Persian/Arabic-Indic digits count as the same number (fa writes ۶۰ for 60)
const latin = (s) => s.replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x6f0).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660).replace(/٬/g, ",");
// pl writes 1 234 (a space between thousands) and 2,99 (a decimal comma): both count as the English 1,234 and 2.99
const plNum = (s) => (lang === "pl" ? s.replace(/(\d)[\u00a0\u202f ](?=\d{3}(?!\d))/g, "$1") : s);
const nums = (s) => (plNum(latin(strip(s))).match(/\d[\d,.]*/g) ?? []).map((n) => n.replace(/[.,]$/, "").replace(/[,.](?=\d{3}\b)/g, "")).map((n) => (lang === "pl" || lang === "de" ? n.replace(",", ".") : n)).filter((n) => n.length);
// fa: a number written as a word counts too («دوازده قدم» for "12 Steps", «ویرایش چهارم» for "4th Ed.", «شبانه‌روزی» for 24/7)
const FA_NUM = [["یک|اول|نخست", "1"], ["دو|دوم", "2"], ["سه|سوم", "3"], ["چهار|چهارم", "4"], ["پنج|پنجم", "5"], ["شش|ششم", "6"], ["هفت|هفتم", "7"], ["هشت|هشتم", "8"], ["نه|نُه|نهم", "9"], ["ده|دهم", "10"], ["یازده|یازدهم", "11"], ["دوازده|دوازدهم", "12"]];
const faWords = (s) => { const out = []; for (const [w, n] of FA_NUM) if (new RegExp(`(?<![\\p{L}])(?:${w})(?![\\p{L}])|(?<![\\p{L}])(?:${w})(?=\u200c?قدمی|\u200c?گانه)`, "u").test(s)) out.push(n); if (/شبانه[\u200c ]?روزی/.test(s)) out.push("24", "7"); return out; };
// pl: a number written as a word counts too («Dwanaście Kroków» for "12 Steps", «wydanie IV»/«czwarte» for "4th Ed.", «całą dobę» for 24/7)
const PL_NUM = [["jeden|jedna|jedno|pierwsz\\p{L}*", "1"], ["dwa|dwie|dwóch|dwoma|drug\\p{L}*", "2"], ["trzy|trzech|trzema|trzec\\p{L}*", "3"], ["cztery|czterech|czwart\\p{L}*", "4"], ["pięć|pięciu|piąt\\p{L}*", "5"], ["sześć|sześciu|szóst\\p{L}*", "6"], ["siedem|siedmiu|siódm\\p{L}*", "7"], ["osiem|ośmiu|ósm\\p{L}*", "8"], ["dziewięć|dziewięciu|dziewiąt\\p{L}*", "9"], ["dziesięć|dziesięciu|dziesiąt\\p{L}*", "10"], ["jedenaście|jedenastu|jedenast\\p{L}*", "11"], ["dwanaście|dwunastu|dwunast\\p{L}*", "12"]];
const plWords = (s) => { const out = []; for (const [w, n] of PL_NUM) if (new RegExp(`(?<!\\p{L})(?:${w})(?!\\p{L})`, "iu").test(s)) out.push(n); const ROM = { I: "1", II: "2", III: "3", IV: "4", V: "5", VI: "6", VII: "7", VIII: "8", IX: "9", X: "10", XI: "11", XII: "12" }; for (const m of s.matchAll(/(?<!\p{L})(XII|XI|IX|X|VIII|VII|VI|IV|V|III|II|I)(?!\p{L})/gu)) if (m[1] !== "I" || /\b(?:wydani|edycj|Dodat|rozdzia)/i.test(s)) out.push(ROM[m[1]]); if (/całodob|całą dobę|przez całą dobę/i.test(s)) out.push("24", "7"); return out; };
// de: a number written as a word counts too («Zwölf Schritte» for "12 Steps", «Dritte Tradition», «4. Auflage», «rund um die Uhr» for 24/7)
const DE_NUM = [["eins|ein|eine|erste\\p{L}*", "1"], ["zwei|zweite\\p{L}*", "2"], ["drei|dritte\\p{L}*", "3"], ["vier|vierte\\p{L}*", "4"], ["fünf|fünfte\\p{L}*", "5"], ["sechs|sechste\\p{L}*", "6"], ["sieben|siebte\\p{L}*", "7"], ["acht|achte\\p{L}*", "8"], ["neun|neunte\\p{L}*", "9"], ["zehn|zehnte\\p{L}*", "10"], ["elf|elfte\\p{L}*", "11"], ["zwölf|zwölfte\\p{L}*", "12"]];
const deWords = (s) => { const out = []; for (const [w, n] of DE_NUM) if (new RegExp(`(?<!\\p{L})(?:${w})(?!\\p{L})`, "iu").test(s)) out.push(n); const ROM = { I: "1", II: "2", III: "3", IV: "4", V: "5", VI: "6", VII: "7", VIII: "8", IX: "9", X: "10", XI: "11", XII: "12" }; for (const m of s.matchAll(/(?<!\p{L})(XII|XI|IX|X|VIII|VII|VI|IV|V|III|II|I)(?!\p{L})/gu)) if (m[1] !== "I" || /Konzept|Anhang|Teil/.test(s)) out.push(ROM[m[1]]); if (/rund um die Uhr|Tag und Nacht/i.test(s)) out.push("24", "7"); return out; };
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
// Persian (i18n/fa/GLOSSARY.md; A.A. in Iran's own wording, aairan.org / iranaa.org)
GLOSS_BY.fa = [
  [/\bBig Book\b/i, /کتاب بزرگ|الکلی‌های گمنام/, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /راهنما/, "sponsor"],
  [/\bsponsees?\b/i, /رهجو/, "sponsee"],
  [/\bHigher Power\b/i, /نیروی برتر/, "Higher Power"],
  [/\bhome groups?\b/i, /گروه خانگی/, "home group"],
  [/\bnewcomers?\b/i, /تازه‌وارد|تازه وارد/, "newcomer"],
  [/\bamends\b/i, /جبران/, "amends"],
  [/\bresentments?\b/i, /رنجش/, "resentment"],
  [/\binventory\b/i, /ترازنامه/, "inventory"],
  [/\bsobriety\b/i, /هوشیار/, "sobriety"],
  [/\bspiritual awakening\b/i, /بیداری روحانی/, "spiritual awakening"],
  [/\bgroup conscience\b/i, /وجدان گروه/, "group conscience"],
  [/\banonymity\b/i, /گمنامی/, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /نواقص اخلاقی/, "defects of character"],
  [/\bTraditions?\b/, /سنت/, "Tradition"],
  [/\bSteps?\b/, /قدم/, "Step"],
  [/\bpowerless\b/i, /عاجز/, "powerless"],
];
// Polish (i18n/pl/GLOSSARY.md; Polish A.A.'s own wording, aa.org.pl and the BSK's published literature)
GLOSS_BY.pl = [
  [/\bBig Book\b/i, /Wielk\p{L}*\s+Księ(?:g|dz)|Anonimow\p{L}*\s+Alkoholik/iu, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /sponsor/i, "sponsor"],
  [/\bsponsees?\b/i, /sponsorowan|podopieczn/i, "sponsee"],
  [/\bHigher Power\b/i, /Sił\p{L}* Wyższ|Sił\p{L}* większ/iu, "Higher Power"],
  [/\bhome groups?\b/i, /macierzyst/i, "home group"],
  [/\bnewcomers?\b/i, /nowicjusz|nowo przyby/i, "newcomer"],
  [/\bamends\b/i, /zadośćuczyn/i, "amends"],
  [/\bresentments?\b/i, /uraz|urazy|urazami|urazach/i, "resentment"],
  [/\binventory\b/i, /inwentur/i, "inventory"],
  [/\bsobriety\b/i, /trzeźw/i, "sobriety"],
  [/\bspiritual awakening\b/i, /przebudz\p{L}* duchow|duchow\p{L}* przebudz|przebudzeni duchowo/iu, "spiritual awakening"],
  [/\bgroup conscience\b/i, /sumieni/i, "group conscience"],
  [/\banonymity\b/i, /anonimowoś/i, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /wad\p{L}* charakter/iu, "defects of character"],
  [/\bfellowship\b/i, /wspóln/i, "fellowship"],
  [/\bTraditions?\b/, /Tradycj/i, "Tradition"],
  [/\bSteps?\b/, /Krok/i, "Step"],
  [/\bpowerless\b/i, /bezsiln/i, "powerless"],
  [/\bunmanageable\b/i, /niekierowaln/i, "unmanageable"],
  [/\bmeetings?\b/i, /mityng/i, "meeting"],
];
// German (i18n/de/GLOSSARY.md; German-speaking A.A.'s own wording: anonyme-alkoholiker.de and its «Blaues Buch»)
GLOSS_BY.de = [
  [/\bBig Book\b/i, /Blaue\p{L}* Buch|Anonyme Alkoholiker|Alcoholics Anonymous/iu, "Big Book"],
  [/\bsponsor(s|ed|ing|ship)?\b/i, /Sponsor/i, "sponsor"],
  [/\bHigher Power\b/i, /Höhere\p{L}* Macht|Macht, größer als/iu, "Higher Power"],
  [/\bhome groups?\b/i, /Stammgruppe/i, "home group"],
  [/\bnewcomers?\b/i, /Neuling|Newcomer/i, "newcomer"],
  [/\bamends\b/i, /wiedergutzumach|wiedergutmach|Wiedergutmachung|wieder gut/i, "amends"],
  [/\bresentments?\b/i, /Groll/i, "resentment"],
  [/\binventory\b/i, /Inventur/i, "inventory"],
  [/\bsobriety\b/i, /nüchtern|Nüchternheit/i, "sobriety"],
  [/\bspiritual awakening\b/i, /spirituelle\p{L}* Erwachen/iu, "spiritual awakening"],
  [/\bgroup conscience\b/i, /Gruppengewissen|Gewissen unserer Gruppe/i, "group conscience"],
  [/\banonymity\b/i, /Anonymität/i, "anonymity"],
  [/\bdefects of character\b|\bcharacter defects\b/i, /Charakterfehler|Charaktermängel/i, "defects of character"],
  [/\bfellowship\b/i, /Gemeinschaft/i, "fellowship"],
  [/\bTraditions?\b/, /Tradition/i, "Tradition"],
  [/\bSteps?\b/, /Schritt/i, "Step"],
  [/\bpowerless\b/i, /machtlos/i, "powerless"],
  [/\bunmanageable\b/i, /nicht mehr meistern/i, "unmanageable"],
  [/\bmeetings?\b/i, /Meeting/i, "meeting"],
];
const GLOSS = GLOSS_BY[lang] ?? [];
// de: Swiss/old spellings, umlauts written out, a sentence starting lower case (wave de1)
const DE_SS = /(?<!\p{L})(?:gross|grosse[nmrs]?|grösse|grösser\p{L}*|grösst\p{L}*|Grösse|Strasse[n]?|heisst|heissen|weiss|weisst|ausser|ausserhalb|äussere?\p{L}*|schliesslich|Fuss|Füsse|Mass|massgeblich|gemäss|bloss|draussen|Spass|Gruss|grüssen|süss|liess|hiess|stiess|fliessen|beissen|reissen|schiessen|Bussgeld|daß|muß|mußte|läßt|faßt|Schluß|bißchen|Mißbrauch)(?!\p{L})/gu;
const DE_UML = /(?<!\p{L})(?:fuer|ueber\p{L}*|Ueber\p{L}*|koenn\p{L}*|moeglich\p{L}*|Moeglich\p{L}*|muess\p{L}*|waere\p{L}*|haette\p{L}*|naechst\p{L}*|taeglich\p{L}*|aender\p{L}*|Aender\p{L}*|Loesung\p{L}*|loes\p{L}*|Gefuehl\p{L}*|fuehl\p{L}*|hoer\p{L}*|schoen\p{L}*|Buecher|Maenner|Fruehling|frueh\p{L}*|spaet\p{L}*|Naechte|natuerlich|wuerde\p{L}*|duerf\p{L}*|moecht\p{L}*|Rueck\p{L}*|rueck\p{L}*|Schluessel|Naehe|Faehigkeit\p{L}*|Gespraech\p{L}*|Nuechtern\p{L}*|nuechtern\p{L}*)(?!\p{L})/gu;
const DE_LOW = /(?<!(?:^|[\s.])(?:\p{L}|bzw|ca|vgl|ggf|usw|inkl|evtl|zzgl|bspw|Nr|Dr|S|St))[.!?]\s+[„‚(]?(?!(?:z|d|u|o|s)\.)[a-zäöü][\p{L}]{2,}/u;
// pl: diacritics stripped — words that don't exist without their ą ć ę ł ń ó ś ź ż
const PL_BARE = /(?<!\p{L})(?:sie|juz|moze|mozesz|mozna|mozemy|ktory|ktora|ktore|ktorego|ktorej|ktorzy|ktorych|takze|rowniez|wiecej|bedzie|beda|bedziesz|byc|zycie|zycia|zyciu|zeby|sa|wlasnie|wlasny|czlowiek|trzezwosc|trzezwosci|trzezwy|alkoholikow|krokow|mityngow|dzien|prosze|Bog)(?!\p{L})/gu;
const PL_DIA = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
// the wrong register: es "usted"; pt "tu"/"vós" forms and European-Portuguese words (Brazil says "você", "fato", "celular")
const REG = {
  es: /\busted(es)?\b/gi,
  fr: /(?<!\p{L})(?:(?:tu|toi|ton|ta|tes|tien|tienne)(?!\p{L})|t['’](?=\p{L}))/giu,
  fa: /[يك]|(?<![\p{L}\u200c])ن?می (?=\p{L})|(?<![\p{L}\u200c])ن?می(?!ز|ان|ل|وه|راث|لیون|لیارد|هن|همان|زان|ثاق|کروب|ترا|گرن|نیمم|ناکاری|نو)(?=[\u0622-\u06cc])|(?<!\p{L})(?:تو|تویی|خودت|برایت|داری|هستی)(?!\p{L})|(?<=\p{Script=Arabic})\s?[,;?](?=\s?\p{Script=Arabic})/gu,
  de: /(?<!\p{L})(?:du|dich|dir|dein|deine|deinen|deinem|deiner|deines|euch|euer|eure|euren|eurem|eurer|eures|bist|hast|kannst|willst|musst|sollst|weißt)(?!\p{L})|["”]|(?<=^|[\s(])“(?=\p{L})/gu,
  pl: /(?<!\p{L})(?:Pan|Pana|Panu|Panem|Pani|Panią|Państwo|Państwa|Państwu|Państwem|możecie|jesteście|macie|chcecie|wasz|wasza|wasze|waszego|waszej|waszym|waszych)(?!\p{L})|["“]/gu,
  pt: /(?<!\p{L})(tu|vós|teu|teus|tua|tuas|vosso|vossa|vossos|vossas|contigo|convosco|és|estás|tens|podes|queres|facto|factos|contacto|contactos|telemóvel|telemóveis|equipa|equipas|utilizador|utilizadores|ecrã|autocarro|casa de banho|registo|registos|(?:está|estão|estamos|estou) a \p{L}+r)(?!\p{L})/giu,
};

const rows = [], report = {};
for (const f of files) {
  const en = englishOf(f.batch), ids = Object.keys(en);
  const r = { line: f.label, batch: f.batch, n: ids.length, done: 0, tags: 0, same: 0, english: 0, short: 0, numbers: 0, gHit: 0, gAll: 0, usted: 0, dia: 0, err: f.err ?? null };
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
    const tn = new Set([...nums(t), ...(lang === "fa" ? faWords(t) : []), ...(lang === "pl" ? plWords(strip(t)) : []), ...(lang === "de" ? deWords(strip(t)) : [])]); const miss = nums(e).filter((n) => !tn.has(n));
    if (miss.length) { r.numbers++; flag(id, `number missing: ${miss.join(", ")}`); }
    for (const [ep, sp, name] of GLOSS) if (ep.test(strip(e))) { r.gAll++; if (sp.test(t)) r.gHit++; else flag(id, `glossary: "${name}"`); }
    // the share bar's segment is live JS (this.textContent='…'): its quotes and its missing diacritics are code, not prose (pl1 review)
    const code = /textContent|return false/.test(t);
    const reg = code ? 0 : (strip(t).match(REG[lang] ?? /(?!)/g) ?? []).length;
    if (reg && lang !== "es") flag(id, `register: ${(strip(t).match(REG[lang]) ?? []).slice(0, 3).join(", ")}`);
    r.usted += reg;
    if (lang === "de" && !code) {
      const st = strip(t), bad = [...(st.match(DE_SS) ?? []), ...(st.match(DE_UML) ?? [])], low = DE_LOW.exec(st);
      if (bad.length || low) { r.dia++; r.usted++; flag(id, bad.length ? `spelling: ${bad.slice(0, 3).join(", ")}` : `lower case at sentence start: ${low[0].trim().slice(0, 20)}`); }
    }
    if (lang === "pl" && !code) {
      const bare = strip(t).match(PL_BARE) ?? [];
      const plain = tw.length >= 10 && !PL_DIA.test(strip(t));
      if (bare.length || plain) { r.dia++; r.usted++; flag(id, bare.length ? `diacritics: ${bare.slice(0, 3).join(", ")}` : "diacritics: none in a long segment"); }
    }
  }
  const per = (x) => (100 * x) / Math.max(1, r.done);
  const gloss = r.gAll ? r.gHit / r.gAll : 1;
  r.score = Math.max(0, Math.round(100 - per(r.tags) * 5 - per(r.same) * 3 - per(r.english) * 2 - per(r.short) * 2 - per(r.numbers) - per(r.dia) * 2 - (1 - gloss) * 30 - (r.done < r.n ? 30 * (1 - r.done / r.n) : 0)));
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
