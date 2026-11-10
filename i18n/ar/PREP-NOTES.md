# Arabic (ar) — prep notes

*Prep window prep-ar (Code), wave langs (2026-11-09-langs), reporting to langs-super. Started 2026-11-09T18:02Z. Research only: nothing here has shipped, merged or deployed. Files: `GLOSSARY.md`, `core.json` (all 277 ids of main's `i18n/segments/core.json` at 705505fb, plus `ar_ours_note`), this file.*

## Verdict: READY. Steps: option 1 now, option 2 kept open (langs-super, 18:26Z; final call is the CEO's), two gaps it can carry (map countries, ar build hooks), and claude-home out of reach
Branch `prep/ar`; the head is the commit that adds this file (see the radio / final message for the hash).

## [AUTO] and where the status went
- 2026-11-09T18:02Z [AUTO]: `add_repo Recoverystarts/claude-home` (push) was refused by the auto-mode check ("Access Added As A Means"). So this window **could not write** `waves/2026-11-09-langs/status/on-ar.md`, `status/PREP-ar.md` or the radio line, and **could not read** the wave README ("The RTL check", "What a prep window does") or `waves/2026-11-01-rulang1/status/PREP-ru.md`. I didn't route around the refusal through the vault connector's repo_read/repo_write: that would have done the same thing by another door. The shape of this file is copied from `i18n/ru/PREP-NOTES.md` and `i18n/fa/GLOSSARY.md` instead, which are on main. **langs-super (or Derick, by allowing add_repo for this window) needs to copy the verdict below into status/PREP-ar.md and the radio.** If the README's RTL check asks for something I didn't do, that's why.
- Status log: 18:02Z on: reading models + sources (~40 min). 18:16Z: sources, crisis lines and font done; core.json and glossary written.

## What I found, in one paragraph
A.A. publishes Arabic, but almost none of it is online. A.A.W.S. sells a printed Arabic Big Book (ARABB-30, «مدمنو الكحول المجهولون») and three Arabic pamphlets (ARABP-1 This is A.A., ARABP-2 44 Questions, ARABP-24 A Newcomer Asks) on onlineliterature.aa.org, with no text online. The Middle East Regional Committee of A.A. (mercaa.com, whose members include Egypt, Jordan, Lebanon and the Gulf) prints **the Preamble in Arabic** and the fellowship's Arabic name; everything else there is English. AA in Amman (aainamman.org) has local Arabic translations of A.A.W.S.'s F-2 *Information on A.A.*, the "Who is an alcoholic" Q&A, the 12 questions and **the Promises**. They're A.A.'s words in Arabic, but not marked Conference-approved, so they're usable, cited, and never called official. **No A.A. page I could reach prints the Twelve Steps, the Traditions or the Concepts in Arabic.** Searching for them in Arabic returns N.A., S.L.A.A., O.A., rehab clinics and Wikipedia; none were used.

## The open choice for the super: the Steps and Traditions
- **What I did (option 1, the hi1 precedent):** the Steps, both forms of the Traditions, the Concepts, the prayers and Big Book quotes are **[ours]**, translated once from the English, fixed word for word in GLOSSARY.md and core.json. Every page that quotes them carries `ar_ours_note` (already in core.json), the way build.mjs does it for hi/ja/ru. This is the same thing "the other countries" got when A.A. had no text online (Derick on ru, 11-01: "If its not approved lets not use it yet ... we do the same as the other countries").
- **Option 2:** someone (Derick, or a member in Egypt or Amman) buys or photographs ARABB-30's pp. 59–60 and 563–566 and the Appendix VII Concepts; the glossary swaps to A.A.'s printed Arabic and `OURS_NOTE.ar` goes false. That's better for readers who know the book from meetings. It can come after launch: it's a swap, not a rebuild.
- Q (for langs-super): ship option 1 now and keep option 2 open, or hold the Steps pages for ARABB-30?

## Choices, and why
- **Register:** Modern Standard Arabic, not Egyptian dialect. Egypt is the map's biggest Arabic block (251 weekly), but the same pages serve the Gulf, Levant and Maghreb, and A.A.'s own Arabic ([M], [J]) is fuṣḥā.
- **Reader:** «أنت», masculine generic, as A.A.'s Arabic pages do. Plural «أنتم» was the alternative; it reads stiff in short UI labels.
- **Name:** «مدمنو الكحول المجهولون» / «زمالة مدمني الكحول المجهولين», A.A.'s own (Big Book title, [M]). Abbreviation stays **A.A.** in Latin ([J] does this). That matters for search: the Arabic name is what Arabic speakers type, and it's distinct from N.A.'s «زمالة المدمنين المجهولين».
- **Sobriety:** «الامتناع عن الشرب» in our prose, not A.A.'s regional «اليقظة», because «يقظة روحية» is Step 12's spiritual awakening and one word for both muddles the Step. The Preamble keeps [M]'s «اليقظة» as printed. Worth a reader's eye (see Unsure).
- **Digits:** Western 0–9 everywhere. Egypt's ministries and press print them online (moss.gov.eg's hotline list, al-Ahram, Youm7), as do the Gulf and the Maghreb; it's what people type into search. The build only Persianizes digits for fa (`rtl.mjs` DIGITS), so ar needs no digit table. **Don't add one.**
- **Months:** يناير… ديسمبر (Egypt and the Gulf), not the Levant's كانون الثاني….
- **Sponsor:** «كفيل / مكفول» [ours]. No A.A. Arabic seen; «راعٍ» collides with [J]'s «الرعاية» ("Twelfth Step care").

## Font check (Vazirmatn, as style.rtl.css self-hosts it)
Rendered a specimen with `assets/fonts/vazirmatn-arabic.woff2` + `vazirmatn-latin.woff2` (the same files and unicode ranges as style.rtl.css), `dir="rtl"`, on the site's night background, at **390 px and 1366 px** (Playwright Chromium). It contained: a heading and body in fuṣḥā; the Arabic-only letters ة ى ء أ إ آ ؤ ئ ظ ض ذ ث خ غ, the lam-alef ligatures لا لأ لإ لآ, the kashida ـ, shadda and tanween (الكُحُولِيّات، التوقُّف، شُكرًا); the Arabic comma ، semicolon ؛ question mark ؟ and «»; Western digits (417, 251, 7:00, 2026), plus Arabic-Indic ٠–٩ and Persian ۰–۹ for comparison; mixed Latin (Recovery Einstein · aa.org); the 16023/988 crisis line; arrows ← →.
**It holds.** Both faces loaded and every glyph drew from Vazirmatn (no fallback boxes), the ligatures joined, the marks sat right, Western digits ran left-to-right inside the RTL line correctly, and there was no horizontal overflow at 390 (scrollWidth 390) or 1366. Nothing extra is needed for the font. Screenshots: `/tmp/claude-0/-home-user-recoverystarts-site/2cb750f2-ac5c-5d83-adf2-ca53306bfe2c/scratchpad/spec-390.png` and `spec-1366.png` (this window's scratchpad, not pushed).

## What the build needs for ar (not done here: files under i18n/ar only, on purpose)
`scripts/i18n/lib.mjs` LANGS: `ar: { name: "العربية", dir: "rtl", en: "Arabic" }`. `rtl.mjs`: `ar: { faces: "vazirmatn.css", family: "'Vazirmatn'" }`, **no DIGITS entry**. `build.mjs`: OG `ar: "ar_AR"` (see og:locale below), H1_FONT `ar: "vazirmatn-arabic.woff2"`, `OURS_NOTE.ar: true`. `globe.mjs` OFFER: `ar: ["هذه الصفحة متوفرة أيضًا بالعربية.", "اقرأ بالعربية"]`. `score.mjs`: a WAVE entry, and **an ar `reg` that flags Persian ی ک ۀ and U+200C, and Latin , ; ? between Arabic words**: the reverse of fa's, which flags Arabic ي ك. `sitemap.mjs` LIVE and a sitemap-ar.xml. **Keep `desk/fix_fa.py` off ar files**: it would turn every ي into ی. I couldn't run `node scripts/i18n/check.mjs ar` because ar isn't in LANGS yet; I ran the same placeholder test in Python (`placeholdersOf`'s regex): **0 mismatches across 277 ids, none empty, no Persian/Indic characters, no Latin , ; ? between Arabic words.**

## core.json — notes per segment
- Crisis segments (8962fc3719e8, d1539935a7cb, 6c4e5e94d345, a05fd124808c): Egypt 16023 first, then 988 for the US and Canada with "ask for an Arabic interpreter". I don't claim hours for 16023 (not confirmed on its own site); "free, 24/7, confidential" stays only on 988, where samhsa.gov says it.
- 7a68d874e33f (the long-form Traditions intro) adds «بترجمتنا» ("in our translation") so the line isn't untrue. 96327e987d94 (the home page's book credit) reads «… · الطبعة الإنجليزية الرابعة · ترجمتنا», as ru's does.
- 76549fa02626 "AA — Alcoholics Anonymous" → «AA — مدمنو الكحول المجهولون». The other fellowships stay in English, as fa does.
- 26db3bea16f6 "AA <0>Information</0>" → «<0>معلومات</0> عن A.A.»: the highlight stays on the noun, which comes first in Arabic.
- 1b08a63f6559 (p. 417 "acceptance") is our free translation (ترجمة حرة), as the glossary rules for any Big Book quote.
- `ar_ours_note` is written for option 1; if the super picks option 2, it changes when ARABB-30 arrives.

## Menu fit (asked by langs-super, done 2026-11-09T18:27Z)
Served the built `/fa/` home page from main (705505fb) locally and swapped every fa core string for its ar one in place (147 text nodes, plus aria-labels), `lang="ar"`, in Playwright Chromium at **390 × 844** and **1366**. Measured every element in `nav.nav`: **nothing past either edge at 390 or 1366** (scrollWidth = viewport), with the menu closed or open. Looked at the screenshots: the header (☰, globe, Einstein, «Recovery Starts») sits on one line. In the open menu, «خريطة الاجتماعات» and «اجتماعات عبر الإنترنت» fit their pills on one line each, and the section heads (قراءة اليوم، الكتاب الكبير، البرنامج) and items fit with room to spare. The four hero buttons («أي اجتماع، في أي مكان»، «اجتماعات عبر الإنترنت، في أي ساعة»، «محرّك بحث الكتاب الكبير»، «تحدّث مع Recovery Einstein») each fit on one line at 390. Arabic runs about as long as the Persian, so the fa layout holds as is. Not swapped (not in core, or arrow-flipped by the build): «اپلیکیشن کتاب بزرگ», the four «… ←» daily links and the «✓ فارسی» switcher; they're fa-length too. Two things the ar build must add: the globe offer (`globe.mjs` OFFER.ar), since the banner showed English's "This page is also in English", and a language-switcher label «العربية». Screenshots in this window's scratchpad: `menu-390-closed.png`, `menu-390-open.png`, `home-390.png`, `menu-1366-closed.png`.

## og:locale: ar_AR
`build.mjs` OG `ar: "ar_AR"`, not ar_EG. One Arabic page serves Egypt, the Gulf, the Levant and the Maghreb, and ar_AR is the generic Arabic locale in Facebook's og:locale list (it has no per-country Arabic codes for most of them). ar_EG would label every page Egyptian for no gain. Keep hreflang plain `ar` for the same reason. Unsure: whether search engines weigh og:locale at all (they mostly use hreflang), so this is mainly for share previews.

## Arabic-speaking countries on the map: not counted (gap)
`https://recoverystarts.com/meetings/api` gave this cloud window Cloudflare's challenge (403, also through headless Chromium), and the origin `https://meetings-production-aac5.up.railway.app` answers 403 "only for recoverystarts.com's own servers" (tried `/`, `/api`, `/meetings/api`). So **I couldn't count which Arabic-speaking countries are on the map.** Egypt (251 weekly, per the brief) is the only one I know of. For reference, A.A.'s Middle East Regional Committee lists Bahrain, Egypt, Jordan, Kuwait, Lebanon, Oman, Qatar, Saudi Arabia and the UAE emirates; that's A.A.'s list, not our map's. Q (for langs-super): can a window with desktop or vault access pull the country list, so crisis lines can be checked for each?

## Crisis lines — kept, dropped
- **Kept:** Egypt **16023**, the Fund for Drug Control and Treatment of Addiction's hotline, on the Ministry of Social Solidarity's own homepage (moss.gov.eg: «16023 خط صندوق الادمان»). US **988**: interpreter for calls in 240+ languages, text/chat English and Spanish only (samhsa.gov/mental-health/988/faqs). Canada **9-8-8**: English/French, another language "may be available" by phone (988.ca/get-help/what-to-expect).
- **Dropped (not confirmed on the service's own site):** Egypt 16328 / 08008880700 / 0220816831 (Mental Health Secretariat; mohp.gov.eg 503, subdomain unreachable; only in press); Egypt ambulance 123 (no official site reachable); 16023's hours, "free" and "confidential" (press only; drugcontrolfund.gov.eg didn't answer); Lebanon Embrace 1564 (embracelebanon.org 403). No other country was checked, because of the gap above.

## Unsure
- Whether ARABB-30's Steps differ much from ours. Readers who know the book from meetings will notice. Option 2 fixes it.
- «الامتناع عن الشرب» for sobriety versus A.A.'s regional «اليقظة»: a native A.A. member's read would settle it.
- [J]'s Promises text has PDF-copy gaps («هذه ا لم رحلة»); my reading «هذه المرحلة» is a guess. Check against the book before any page quotes it.
- Masculine generic «أنت» versus plural: fine for A.A.'s own Arabic pages, but a women's meeting page might want «أنتِ» or plural copy.
- Big Book chapter titles, pamphlet titles and the 12 & 12's Arabic title are ours; A.A.'s printed ones weren't seen.

## Fixes that worked (for the CEO's flaws/log)
- A word can collide across Steps: A.A.'s regional «اليقظة» (sobriety) is also Step 12's «يقظة روحية». Check the sobriety word against every Step before fixing it in a glossary.
- For RTL languages other than fa, check every fa-only tool before a runner touches ar: `rtl.mjs` DIGITS, `desk/fix_fa.py` (ي→ی), and score.mjs's fa `reg` all assume Persian and would corrupt Arabic.
