# Hebrew (he) — prep notes

*Prep window prep-he (a Code window opened by langs-super, wave 2026-11-09-langs), 2026-11-09 (UTC). Research only. Nothing here has shipped, merged or deployed. Files: `GLOSSARY.md`, `core.json` (all 277 ids of main's `i18n/segments/core.json`, plus `he_ours_note`), this file. These are my notes; langs-super (or whoever it hands them to) checks them cold before any runner sees them.*

> **Overruled at the cold check** (CEO: langs-1, claude-home waves/2026-11-09-langs/status/CHECKED-he.md, 18:39Z), applied by helang1-super in S1: the Steps are **the pamphlets' wording**, not the website's (N.A. overlap); T3/T10 and Concepts 2, 3, 8 as A.A. Israel prints them; he_ours_note «חלק מהציטוטים»; US 988 and Canada 9-8-8 said apart. GLOSSARY.md is the rule; this file is the prep's record.

## What happened, and one thing that didn't
- I was asked to read claude-home's `waves/2026-11-09-langs/README.md` ("The RTL check", "What a prep window does", the Hebrew lines) and `waves/2026-11-01-rulang1/status/PREP-ru.md`, and to write `status/on-he.md`, `status/PREP-he.md` and a radio line there. **Attaching claude-home was refused by the auto-mode check** (`add_repo` claude-home: "[Access Added As A Means]"). Reaching it through the vault's repo tools instead would have gone around that refusal, so I didn't. **I have not read the wave README**: the RTL check and the README's Hebrew candidates (crisis lines among them) are unread. I worked from what's in this repo: ru's and fa's GLOSSARY, PREP-NOTES and core.json, style.rtl.css, scripts/i18n. The README may ask for something I've missed; langs-super will see it at once. No status, PREP or radio file was written to claude-home. [AUTO] on attaching claude-home.
- Everything else was done: A.A. Israel's site and five of its PDFs read one at a time with curl (user-agent "recoverystarts.com prep research (+https://recoverystarts.com)"); core.json written by hand and checked; the crisis services read on their own sites; a font specimen rendered.

## What I found, in one paragraph
A.A. in Israel has a good national site (aa-israel.co.il, run by the registered service centre «אלכוהוליסטים אנונימים ישראל מרכז שירות (ע"ר)») and posts its pamphlets as PDFs. Its Hebrew comes in two generations. The **older, approved** one is A.A.W.S.'s own printed pamphlet «חבר חדש שואל» (HEBP-24, © 1980). The **newer** one is what A.A. Israel uses today: its website's Steps and two pamphlets, one of which prints «תרגום ממתין לאישור – מאי 2023» at the top of every page. It carries the Steps, the short-form Traditions, the Concepts and the Preamble. A separate, undated pamphlet has the long-form Traditions. The Serenity Prayer is on the site. The Hebrew Big Book is sold in print; online there are only scans of three of its stories. One of them holds the p. 417 passage the home page quotes, so that quote is the Hebrew book's own words. Nothing from N.A. and nothing from the "12 and 12" was used.

## Round 2 — 2026-11-09T18:3xZ: langs-super's answers, and three README lines
*langs-super (radio 18:26Z), answering the two decisions; the final call on both is the CEO's at the cold check.*
- **Steps: the website's wording** (as recommended, and as GLOSSARY already has it). The pamphlets' wording stays below, for the record.
- **Long-form Traditions 3 and 10, Concepts 2, 3 and 8: printed as A.A. Israel prints them**, gaps against the English noted (see "Unsure") but not filled ("A.A.'s own wording beats ours"). core.json already does this; nothing changed in it.
- **Ministry of Health (addiction services), a README candidate: not confirmed.** `www.gov.il/he/departments/topics/addiction` and `www.gov.il/he/pages/emergency-numbers` answer a script with 403; `www.health.gov.il` with an empty 202 (a bot check), 2026-11-09 ~18:30Z. Not used, like MDA 101; a person in a browser could read it.
- **og:locale: `he_IL`**, to add to `OG` in `scripts/i18n/build.mjs` (line 20; without it the build writes the bare `he`). Not changed on this branch (scripts are the wave's).
- **🌐 label: «עברית»**, as `LANGS.he.name` (`{ name: "עברית", dir: "rtl", en: "Hebrew" }`, the line I tested locally). It is the name Hebrew uses for itself; A.A. Israel's own language switcher writes «עִבְרִית», with niqqud: we drop the points, as everywhere else.

## The open decision — which Steps (decided round 2: the website's; kept for the record)
Two wordings of the same newer translation:
1. **The website's** (`/article/12-step-program/`, what a newcomer sees today), **recommended**, and the one in GLOSSARY. It's the later edit: it has "moral" in Step 4 («חשבון נפש מוסרי, נוקב וחסר פחד») and "all" in Step 8 («בפניהם כולם»), both of which the English has and the pamphlets drop.
2. **The pamphlets'** (P-86 and the sponsorship Q&A agree word for word; the same translation as the short-form Traditions and the Concepts we use). If the call is for one source for every fixed text, it's this. Here it is, so nobody has to re-read the PDFs:
   1. הודינו שאנו חסרי אונים מול האלכוהול, ושאבדה לנו השליטה על חיינו.
   2. הגענו לאמונה שכוח גדול מאתנו יכול להחזיר לנו את שפיות דעתנו.
   3. החלטנו למסור את רצוננו ואת חיינו להשגחת אלוהים – כפי שאנו מבינים אותו.
   4. עשינו חשבון נפש נוקב וחסר פחד.
   5. התוודינו בפני אלוהים, בפני עצמנו ובפני אדם נוסף על טבעם המדויק של פגמינו.
   6. היינו נכונים לחלוטין שאלוהים ישחרר אותנו מכל הפגמים באופיינו.
   7. ביקשנו אותו בענווה שישחרר אותנו מחסרונותינו.
   8. ערכנו את רשימת כל האנשים שבהם פגענו, והיינו מוכנים לכפר על כל מעשינו בפניהם.
   9. כיפרנו על מעשינו במישרין בפני כל מי שיכולנו, חוץ מאותם המקרים שמעשה זה היה עלול לפגוע בהם או באחרים.
   10. המשכנו בחשבון הנפש, וכאשר שגינו הודינו בכך מיד.
   11. ביקשנו בדרך של תפילה ושל הרהורים לשפר את הקשר התודעתי עם אלוהים – כפי שאנו מבינים אותו, כשאנו מתפללים רק לדעת את רצונו מאתנו ומבקשים את הכוח לבצע זאת.
   12. כשעברנו התעוררות רוחנית כתוצאה מצעדים אלה, ניסינו לשאת מסר זה לאלכוהוליסטים וליישם עקרונות אלה בכל תחומי חיינו.

Not offered: HEBP-24's older Steps. They're approved, but A.A. Israel doesn't print them anywhere else today, so nobody at a meeting in Israel hears them. (If "approved" outweighs "what's read", that's option 3, and the Traditions and Preamble would follow it too.)

## Choices, and why
- **Used, not official**: the 2023 translation, on Derick's 2026-11-01 15:51 line (DECISIONS, quoted in ru/GLOSSARY): "dont make it official if its not official ... if its a translation then its probably ok to use". `he_ours_note` says it in the page's words: the fixed texts are A.A. Israel's, some from a translation still awaiting A.A.W.S. approval (and so not an official text), Big Book quotes from the Hebrew translation A.A. Israel publishes, the rest ours.
- **Address: אתם, plural.** A.A.W.S.'s Hebrew pamphlet does (28 to 1), A.A. Israel's calls to action do, and the plural is how Hebrew addresses a reader of any gender. A.A. Israel's running prose leans masculine singular («האם אתה מרגיש…»); we don't follow that, because a woman at 2 a.m. shouldn't have to read past "you (man)". Buttons take A.A. Israel's own «ל» + action noun («למציאת פגישה»), or the bare infinitive, since neither has a gender or a number. Never slash or dot forms. Examples are in GLOSSARY, "Form of address".
- **«א.א.» for "A.A."**, in our prose and in A.A.'s (typography only). A.A. Israel's site writes it this way, and a Latin "A.A." breaks in rtl. Other fellowships keep the English page's Latin initials.
- **Latin digits; Gregorian dates «18 בנובמבר 1982»; 24-hour times; English page numbers «עמ' 417»** (the Hebrew Big Book prints the English page at each story's head, so this matches what a reader holds).
- **Hyphens to en dashes** (« – ») in A.A.'s texts where the PDFs typed a spaced hyphen, as A.A. Israel's site does in its own prose. Words untouched.
- **Crisis: ער"ן 1201** first (24/7, anonymous, read on its own site), then 988 with "ask for a Hebrew interpreter". "Free" is said of 988 only.

## Font (for the wave)
- **Recommended: Frank Ruhl Libre (headings, `--font-display`) + Heebo (body and UI)**, both SIL OFL 1.1, both from Google Fonts, variable, with small Hebrew subsets (Frank Ruhl Libre hebrew ≈ 19 KB, Heebo hebrew ≈ 12 KB, one file each covering every weight). Why: the English pairs a warm serif (Fraunces) for headings with a clean sans (Outfit) for text. Frank Ruhl Libre is the classic Hebrew book face, and Heebo is a plain modern sans with Latin that sits fine next to Outfit. The pair reads like the English site. Vazirmatn has no Hebrew letters, so without a Hebrew face the browser falls back to whatever the device has.
- **Fallback, zero code: Heebo alone**, as fa uses Vazirmatn alone. rtl.mjs's `FONT` map gives a language **one** family for all three variables; the pair needs `FONT.he` to carry a display family and a body family (a two-line change in rtl.mjs, which the wave owns). Rubik was also tried: fine, rounder; no reason to prefer it.
- **Specimen**: the built `/fa/` home page served locally, every Persian text node swapped for its Hebrew from this core.json (147 nodes; the 8 buttons whose arrows the build had already flipped were left in Persian), `lang="he"`, the font variables pointed at each candidate. Screenshots at **390×844 and 1366×900**, deviceScaleFactor 1, for Heebo, Rubik and Frank Ruhl Libre + Heebo. **It holds**: no horizontal scroll at either width (scrollWidth − innerWidth = 0 in all six); the hero heading wraps cleanly at 390; mixed lines («לשיחה עם Recovery Einstein», «ב-1935») order correctly; buttons keep their size. Seen, not measured: the hero h1 at 1366 with Frank Ruhl Libre runs three lines (I didn't compare with the Persian page). The screenshots are in my session's scratchpad, not committed (PNGs don't belong under `i18n/`); the script is easy to re-run, and langs-super can ask for them.
- Self-hosting, the house way (#496): download Google's `hebrew` and `latin` subsets (the `latin` one only if Heebo's Latin is wanted over Outfit's; probably not), declare them face by face with Google's unicode-range in a `heebo.css` / `frank-ruhl-libre.css` beside `vazirmatn.css`, and add `he` to `FONT` in rtl.mjs.
- RTL rules that already fit Hebrew: no letter-spacing, no italics (`<i>` → semibold), heading line-height 1.45. **One to add**: `html:lang(fa) ol{list-style-type:persian}` must not catch he; Hebrew lists stay `decimal` (Hebrew-letter numbering, א ב ג, is possible but not what A.A. Israel prints).

## What the wave teaches the scripts (not done here, on purpose)
- `scripts/i18n/lib.mjs` LANGS: `he: { name: "עברית", dir: "rtl", en: "Hebrew" }`, **with no digit conversion** (fa converts to ۰–۹; Hebrew uses 0–9). I added this line locally to run `check.mjs he core` (0 problems, 277/277) and took it out again; nothing under `scripts/` is changed on this branch.
- rtl.mjs `FONT.he` (above). `score.mjs he` doesn't exist; a `reg` column for Hebrew could flag: Latin "A.A." in Hebrew text, slash/dot gender forms («/ה», «.ת», «.י»), feminine-singular «את» addressing the reader, Hebrew-letter numerals, direction marks (U+200E/F, U+202A–E).
- Meeting lists: Israel's week starts on Sunday («יום ראשון»).

## core.json — notes per segment
- `8962fc3719e8`, `d1539935a7cb`, `6c4e5e94d345`: the crisis lines as GLOSSARY's table (ער"ן 1201 first). `a05fd124808c`: the link text is the 988 line's; 1201 has no placeholder to carry a link, so it's named in the other three, not here.
- `7a68d874e33f`: the credit line says the Hebrew is A.A. Israel's long-form pamphlet.
- `0a41494395b7` … `b2076a23b5ae`: the long-form Traditions, [tlf] word for word (typography as GLOSSARY says).
- `e32af397e692` … `549bf284bc05`: the Concepts, [spon] word for word.
- `1b08a63f6559`: the Hebrew Big Book's own words, from A.A. Israel's scan; `96327e987d94` credits it «מתוך התרגום העברי».
- `8bf604c0ddeb`: "Tuesdays 7:00 pm" → «ימי שלישי 19:00».
- `he_ours_note`: new, as ru_ours_note/hi_ours_note.
- Everything else: translated by hand, no machine translation.

## Crisis lines — kept, held, dropped
- **Kept: ער"ן 1201** (eran.org.il: 24/7, anonymous, any age, many languages; WhatsApp 052-8451201). **988 / 9-8-8** as prep-ru read them on 2026-11-01 (not re-read). **A.A. Israel's hotline 072-393-2500**, for "find A.A." only.
- **Held: סה"ר** (sahar.org.il, chat and WhatsApp, not 24/7: Sun–Thu 16:00–03:00, Fri/Sat/holiday eves 18:00–00:00), usable where a page can give hours. **ער"ן's youth line** (a page exists; not read).
- **Dropped (couldn't confirm on its own site): מגן דוד אדום 101.** mdais.org and mda.org.il answer a bot check, and the headless browser got nothing either. Not used until someone reads 101 on MDA's own page. The wave README's candidates are **unread** (above): any line it lists that isn't here wasn't checked.

## Unsure
- **The Steps** (the open decision above).
- **Approval status of the long-form Traditions pamphlet [tlf] and of P-86**: neither carries an approval line. The sponsorship pamphlet says "awaiting approval", and P-86 has the same Steps, Traditions and Preamble, so I treat it as the same translation. `he_ours_note` covers both.
- **[tlf] differs from the English long form**: Tradition 3 has no "for sobriety"; Tradition 10 lacks its last two sentences ("The Alcoholics Anonymous groups oppose no one. Concerning such matters they can express no views whatever."). Printed as A.A. Israel prints them. If the wave wants the page to match the English sentence for sentence, the missing words would be [ours], marked, or the segment stays as is: a call for langs-super.
- **The Concepts [spon] don't match the English short form in 2, 3 and 8** (longer: 2 is close to the long form's first sentence, 3 and 8 are expanded). Same call as above.
- **The Third and Seventh Step prayers**: no Hebrew online; held.
- **MDA 101**, unconfirmed (above).
- **The p. 417 quote**: read by eye from a 200-dpi scan. I'm confident of it, but a second pair of eyes on `/wp-content/uploads/2026/06/014-story-1-2.pdf`, scan page 11 (the Hebrew book's p. 186), would close it.
- **aa.org Hebrew**: not re-checked this round.
- **The claude-home README**: unread (see the top).

## Fixes that worked (for langs-super's flaws/log; I can't write to claude-home)
- **Hebrew PDFs from pdftotext come out with bidi controls (U+202A–E) and "A.A." reversed to ".A.A".** Strip U+202A–202E/200E/200F (`re.sub('[‪-‮‎‏]','',s)`) and run pdftotext *without* `-layout`. The Hebrew then reads in logical order; the Latin "A.A." still needs fixing by hand.
- **A.A. Israel's Big Book story PDFs are image scans** (no text layer, no OCR in the container). `pdftoppm -r 170 -f N -l N -x … -y … -W … -H …` to crop one paragraph, then read the PNG.
- **Specimen without touching the build**: serve the repo root, open a built `/fa/` page in Playwright, swap text nodes by segment id (fa core → he core), set `lang`, inject `@font-face` from the scratchpad, screenshot. This tests the real rtl sheet and layout with the new language's words.
