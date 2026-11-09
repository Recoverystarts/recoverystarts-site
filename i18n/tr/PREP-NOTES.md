# Turkish prep notes — choices, checks and everything unsure

*prep-tr (Code window, Opus 5.5), 2026-11-09, research only: nothing here has shipped, merged or deployed. Branch `prep/tr` cut from main `705505fb`; files under `i18n/tr/` only. The CEO's cold check (`status/CHECKED-tr.md`) comes next; runners don't see this before it.*

## Why this language, in Derick's words
"our setup was to have all languages actually in the build so we can rank in there countries and thier own natural searches will pull the site they read upfront right?" (11-01). Turkey's 70 weekly N.A. meetings went on the map 11-08 (cg1-TR); A.A. Turkey (37 groups in 18 provinces, cg1-AA-TR, #408) comes next. Sources follow his lines: "We do the translating ourselves, no Google." (10-03); never N.A.'s wording, never the 12&12 (10-03); A.A. literature that isn't approved may be used but never presented as official (11-01 15:51).

## What A.A. publishes in Turkish (the finding that shapes everything)
All of it is on **A.A. Türkiye's own site, adsizalkolikler.com** (Genel Hizmet Ofisi Türkiye, Ankara). aa.org has no Turkish pages (sitemap, 4,551 URLs, read today).
1. **[bb2022]** the Big Book, 2022 Turkish edition, PDF (204 pp.). Colophon: «Adsız Alkolikler Dünya Servisleri'ne ait, A.A.'nın Genel Hizmet Konferanslarınca onaylanmış 2022 Türkçe baskısıdır», © A.A.W.S., ISBN 978-1-893007-16-1 (the English 4th edition's ISBN), «Bu A.A.'nın genel hizmet konferanslarınca onaylanmış bir literatürdür». So, unlike Russia's refined translation, **this one says it is A.A.W.S.'s own and Conference-approved**: we can call it A.A.'s Turkish Big Book. The PDF online stops after Dr. Bob's story (no other stories, no appendices). Its chapter 5 is titled «Programımız Hakkında». Its page numbers are its own (Eng. + ~20).
2. **[bb1991]** the older A.A.W.S. Turkish Big Book (® 1991 A.A.W.S., «IV. BASKI 2008»), a scanned PDF with a poor OCR layer. Its value: **Appendix I, the long-form Traditions**, the only Turkish long form online. Read from the page images.
3. **[aatr]** the site's own pages: the Steps (an older wording), the short Traditions, the Concepts (short form), the meeting opening format (Serenity Prayer, Preamble), "How It Works" and the Promises as read at meetings (both older translations, not [bb2022]'s), 13 pamphlets as web pages (A.A.W.S. titles: «44 Soru», «A.A. Rehberlik Konusunda Soru ve Cevaplar», «A.A. Grubu… Her Şeyin Başladığı Yer» …), and members' life stories.
4. Also on [aatr], **not used**: the «On İki Basamak ve On İki Gelenek» PDF (the 12&12: never a source) and `ONIKI-BASAMAK.pdf` (not opened; by its name the same book).

## Open decision 1 — which Steps (for the CEO)
- **Proposal: [bb2022]'s Steps.** The newest A.A.W.S., Conference-approved Turkish text; it's what the Big Book in a member's hand says from 2022; and Steps 1–3, 5, 6, 8, 9, 12 are word for word the same as the site's (Step 3 "anladığımız" vs "algıladığımız").
- **The catch: [bb2022]'s Step 12 has no «alkoliklere»** ("carry this message *to alcoholics*" → «bu mesajı taşımaya»). That's how it's printed (p. 80; the line breaks "bu me-/sajı taşımaya" with nothing lost in the break). The site's /basamaklar and every pamphlet have «bu mesajı alkoliklere taşımaya».
- **Option 2: [aatr]'s /basamaklar** (what's read at meetings, has "to alcoholics"), with its slip «zamanalar» → «zamanlar». Its Steps 4, 10, 11 are older and freer (Step 11: «Onun bizlere uygun gördüğü şeyleri anlamak ve bunları yerine getirebilmek ve gerekli gücü vermesi amacı ile dua ettik»).
- Way back either way: both wordings are written out in GLOSSARY.md "The Twelve Steps". Swapping is a paste of 12 lines (and the Steps pages aren't in core.json; they come in the wave's `12-steps.json` / `steps.json` batches).
- My lean stays [bb2022], because a reader holding A.A.'s current book will find these exact words in it; the missing "to alcoholics" is A.A.'s own printing, and the page can say «A.A.'nın 2022 Türkçe baskısında basıldığı şekliyle».

## Open decision 2 — the long-form Traditions are a 1991 text
[bb1991]'s Appendix I is A.A.W.S.'s own Turkish, but it is freer than the English: T2 has no "loving" (just «Tanrı hükmeder»), T8's "We define professionalism…" and T9's "rotating leadership" are rendered loosely, T12 differs in shape. [bb2022]'s appendices exist in print (its Giriş says the 4th edition includes the Twelve Concepts) but aren't online. Options: (1) **use [bb1991], named «A.A.'nın 1991 Türkçe baskısından» — my proposal**, since it's A.A.'s and the only one; (2) ours, from the English, marked [ours] (hi1's model). A one-line ask to A.A. Türkiye's office (ghosekreter@adsizalkolikler.com, published on their contact page) for the 2022 appendices would settle it; that's Derick's or the CEO's call, not a prep's. #408 can carry it.

## Choices (and why)
- **siz**, lower case. [bb2022] and [aatr] both address the reader as siz. Buttons use the bare imperative or a noun phrase (Turkish UI convention, and [aatr]'s own buttons «Sipariş ver», «Hemen Ara»).
- **«A.A.»** with full stops, suffixes with an apostrophe read "a-a": «A.A.'nın», «A.A.'ya» [bb2022]. **«Adsız Alkolikler»**.
- **God «Tanrı»** (not «Allah», which only [bb1991] and members' stories use); «O'nu/O'na» with the capital and apostrophe [bb2022].
- **sponsor = rehber, sponsorship = rehberlik** (A.A.W.S. pamphlet title on [aatr]); home group = ev grubu; newcomer = yeni gelen; slip = kayma («44 Soru»); resentment = kızgınlık [bb2022]; Serenity Prayer = Huzur Duası; Higher Power = Üstün Güç [bb2022 Step 2]; Big Book = Büyük Kitap [bb2022].
- **«basamak», never «adım»** as the name of a Step: «adım» is N.A.'s Turkish ("12 Adım"), and in Turkish search it's what pulls N.A. pages. A.A. in Turkey says basamak everywhere.
- **Quotes “…”**, typographic apostrophe ’, thousands «29.000», decimal comma «4,99», dates «9 Kasım 2026», months and weekdays capitalised (as [aatr]), 24-hour times with a colon «19:00» (the finder prints colons; [aatr] mixes dots and colons).
- **Prices**: «US$4,99 /ay» with "US$" first, so it can't be read as lira.
- **Online meeting = «çevrim içi toplantı»** (TDK's two-word spelling). Unsure: Turkish users often say «online toplantı»; for search, «online AA toplantısı» may be what people type (no keyword data pulled; the seodata tool could check «çevrim içi AA toplantısı» vs «online AA toplantısı» vs «adsız alkolikler toplantı» for tr before S1).
- **Fellowship = topluluk** (bb2022's most used word); fixed texts keep their own («Cemiyet», «birlik»).
- **The Preamble**: A.A. Türkiye reads an **older Preamble** at meetings (no "no dues or fees", no "neither endorses nor opposes"). It's the only Turkish Preamble A.A. publishes online; used with «barikat» → «tarikat» (its own home page's word). Unsure: whether A.A.W.S. has a current Turkish Preamble (Grapevine's) in print.
- **Concepts**: [aatr]'s short form, the only Turkish one online. C9 and C12 read unlike the English; quoted as printed, «yeklisiyle» → «yetkisiyle» corrected.

## Corrections we made to A.A.'s printed Turkish (each listed so the CEO can undo any)
Steps (if option 2): «zamanalar» → «zamanlar». Short Traditions: «işkiyi» → «içkiyi» (pamphlets confirm), «A. A.» → «A.A.» spacing. Long Traditions: «kolayıkla» → «kolaylıkla», «sseviyesini» → «seviyesini» (the scan is faint there: unsure it's a print slip and not OCR). Concepts: «yeklisiyle» → «yetkisiyle». Preamble: «barikat» → «tarikat», «yada» → «ya da», capitals → sentence case. Seventh Step prayer: [bb2022] prints a duplicated editing line after «Amin.»; the prayer ends at «Amin.». Big Book p. 58–59: a stray ' before «O'nu». Serenity Prayer: printed in capitals in the opening format; set in sentence case, words unchanged.

## Dotted and dotless i (step 4 of the work order)
- **Where the site upper-cases with CSS:** style.css (and its RTL copy style.rtl.css) has `text-transform: uppercase` on `.eyebrow`, `.sub-group-title`, `.nav-links .has-sub > a` (mobile menu headings), `.index-row .d`, `.footer h4`, `.chip`, `.page-tag`, `.study-kicker`, `.tier-card h3`, `.stat-label`, `.hero-badge`. The page builders put more in inline `<style>`: `build-traditions-pages.js` (8: `.tt-kicker`, `.tt-form-lbl`, `.tt-page .k`, `.tt-plain span`, `.dt-*`), `build-traditions-truth.js` (4), `build-bigbook-pages.js` (4: `.bb-fact .k`, `.lib-count` …), `build-content-pages.js` (3: `.cp-kicker`, `.cp-faq-title`, `.cp-related .lbl`), `build-start-here.mjs` (`.sh-kicker`), `regen-seo.js` (FAQ css). No JavaScript `toUpperCase()` touches display text in the site's own scripts.
- **`lang="tr"` makes it right.** `scripts/i18n/build.mjs:125` writes `<html lang="tr">` on every translated page. Checked in Chromium (the container's Playwright): with `lang="tr"`, `text-transform:uppercase` on «istanbul bilgi ılık iğne» gives «İSTANBUL BİLGİ ILIK İĞNE», and lowercase gives «istanbul ılık»; with `lang="en"` it gives the wrong «ISTANBUL BILGI». An element with its own `lang="en"` inside a tr page keeps English casing (the 🌐 menu items carry their own `lang`, so they're right). Firefox and Safari implement the same Turkish casing rule (CSS Text 3 language-sensitive case mapping); not tested here, only Chromium is installed.
- **The real risk is English left on a tr page.** Rendered: the English home page with `lang="tr"` and the menu swapped to Turkish. «BÜYÜK KİTAP» and «GÜNLÜK OKUMA» upper-case correctly; the still-English eyebrow became **«FREE · NO SİGN-UP · NİGHT OR DAY»** (dotted İ in English words). So: every upper-cased label on a tr page must be translated; anything deliberately left in English inside an upper-cased element (a brand, "Alcoholics Anonymous · 4th Ed." style tags) needs `lang="en"` on it, or the Super keeps it out of upper-cased elements. The build only publishes pages whose text is all translated, which covers most of it; the wave's check is a grep of tr pages for upper-cased classes holding Latin text with a dotted i.
- **Hand-typed capitals** in segments: type İ yourself (GLOSSARY "UPPERCASE"). Runners should never pre-capitalise.
- Out of scope but noted for the Finder (meeting-finder repo): any `.toUpperCase()`/`.toLowerCase()` on Turkish town names or filters there needs `toLocaleUpperCase('tr')`. Also the Big Book search (`assets/bigbook/bookSearch.js:53`) keeps only `[a-z0-9]` after lower-casing: it searches the English book, so Turkish queries return nothing; not a prep fix.

## Fonts (Fraunces, Outfit)
Both are self-hosted in two subsets each (`assets/fonts/fraunces-latin.woff2` + `fraunces-latin-ext.woff2`, `outfit-latin.woff2` + `outfit-latin-ext.woff2`), with `unicode-range` in style.css. Checked with fontTools: **latin** has ı ç Ç ö Ö ü Ü â Â î Î û Û; **latin-ext** has ğ Ğ ş Ş İ. Between them **every Turkish letter is drawn by the site's own fonts**; the browser loads the latin-ext file only when a page uses ğ/ş/İ, which every Turkish page will. Nothing to add. (No italic face for either: `<i>` is synthesized, as in every language.)

## Menu fit (390 and 1366 px)
The English home page with its nav labels swapped to the Turkish of core.json, in Chromium: at 1366 the bar fits on one line (no overflow); at 390 the page is 390 wide (no sideways scroll), the bar shows logo + 🌐 + menu, and the open menu shows the Turkish headings upper-cased correctly. The longest labels are «Çevrim İçi Toplantılar» (22) and «Uygulamayı indir» (16). The real-page check is S1's.

## Crisis lines (step 5)
**Kept**, each read on its own site today: **112** (saglik.gov.tr: «Alo 112 — Acil Çağrı», tel:112); **191** «Uyuşturucu ile Mücadele Danışma ve Destek Hattı» (saglik.gov.tr's quick-access link → tel:191; name and number only, nothing about hours or cost; for drugs); **YEDAM 115** (yedam.org.tr: Yeşilay's free counselling line, psychologists, alcohol/drugs/gambling, for the person and family; hours not stated for the line, so never 7/24, never «gizli»); **Canada 9-8-8** (988.ca: EN/FR, interpreter "may be available" by phone); **US 988** (samhsa.gov: interpreter in 240+ languages, free, by call only). A.A. Türkiye's help line +90 533 700 06 57 is in the glossary as A.A., not as a crisis line.
**Held:** ALO 183 (aile.gov.tr links it but describes nothing; alo183.aile.gov.tr reset the connection). **112.gov.tr** reset the connection too (the Health Ministry's page confirms 112). **Dropped:** nothing else was proposed.

## core.json
277 ids (main's `i18n/segments/core.json`) + `tr_ours_note` = 278. Placeholders equal the English by check.mjs's own rule (sorted `placeholdersOf`), 0 problems, nesting valid; no ASCII apostrophe left in Turkish suffixes. The long-form Traditions and Concepts are pasted **by script** from GLOSSARY.md (`/tmp`-side builder, not committed: it lives in the prep window's scratch). The three crisis segments (8962fc3719e8, d1539935a7cb, 6c4e5e94d345) are Turkey-first, as the glossary table. 1b08a63f6559 (p. 417, a personal story) is **ours**, and 96327e987d94 says «çeviri bizim». 7a68d874e33f names the 1991 edition.
**For S1:** `OURS_NOTE.tr = true` in build.mjs (tr_ours_note says what is A.A.'s and what is ours); add `tr: { name: "Türkçe", … }` to `lib.mjs` LANGS; og locale `tr_TR`; hreflang `tr`.

## What the wave teaches the scripts
- `score.mjs tr` doesn't exist: it should flag «sen»-forms addressed to the reader (-sın/-sin/-sun/-sün endings, «sana», «seni», «senin» outside quotes and prayers), «adım» as a Step name, ASCII-ized words («Adsiz», «ayiklik»), ASCII apostrophes before suffixes, and «I» at the start of a word that should be «İ» in hand-typed capitals.
- check.mjs needs `tr` in LANGS.

## Unsure (full list)
1. Open decisions 1 and 2 above.
2. Whether [bb2022] is the edition sold today (the store page lists «Adsız Alkolikler», 125 ₺, but doesn't print a year).
3. The Preamble: older text; no current Turkish Preamble found.
4. Concept 9 and 12 as printed read unlike the English; a runner may be asked why.
5. «çevrim içi» vs «online» for search (see Choices).
6. Names of C.A., C.M.A., G.A., S.A.A. in Turkish: kept in English; their own Turkish not checked.
7. Our prose hasn't been read by a native Turkish-speaking A.A. member. Places a native reader may word better: «Gelenek, ışığa tutuldu» (abffc04dc051), «savaş odası ortağı» (6067ce6178f6, "war-room partner"), «Sabahlar birikir» ("The mornings add up"), «Derneğin oradaki salı akşamı toplantısı» for "the Tuesday night one at the Legion" (8fda8b39c5ec; "Legion" has no Turkish equivalent, so a generic local hall), «hesap sorulan bir sohbet» ("a conversation with accountability").
8. A.A. Türkiye's site has typos and two Steps wordings; it is A.A.'s, but a cold reader might ask why we correct some slips and not others: we corrected only clear letter slips, never wording.
9. 191's page states nothing about hours or who answers; we say only its name.

## Fixes that worked (for the CEO's flaws/log; I don't write logs from a wave seat)
- **Scanned PDF with a garbled OCR layer** (A.A. Türkiye's 1991 Big Book): find the pages with `pdftotext -f N -l N` + grep for a heading, then `pdftoppm -f N -l M -r 110 -png` and read the images; the text was transcribed from the images, not the OCR.
- **Whether CSS uppercase is right for Turkish**: `innerText` in Chromium returns the text after `text-transform`, so a three-line Playwright `setContent` with `lang="tr"` vs `lang="en"` proves the casing without screenshots.
- **A WordPress site's every page, one at a time**: `wp-sitemap.xml` → the page sitemap → curl each with a 1.5 s gap, strip with a 15-line HTMLParser into .txt, then grep across them.
- **A government site whose service links are `tel:` redirects** (saglik.gov.tr): `curl -D - -o /dev/null <link>` shows `Location: tel:191`, which confirms which number the ministry gives the service.
