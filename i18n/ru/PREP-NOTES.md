# Russian (ru) — prep notes

*Prep window prep-ru (Opus 5.5, wave rulang1), 2026-11-01 (UTC). Research only. Nothing here has shipped, merged or deployed. Files: `GLOSSARY.md`, `core.json` (all 277 ids of main's `i18n/segments/core.json`, plus `ru_ours_note`), this file. These are my notes; the CEO window (CEO: world-langs-2) checks them cold before any runner sees them (`status/CHECKED-ru.md`).*

## What I found, in one paragraph
Unlike Hindi, **A.A. in Russia publishes a lot of its own Russian online.** aarussia.ru (Фонд «Единство», the central service office) prints the Steps and the short-form Traditions on its own page, and A.A.W.S.'s Russian pamphlet «Вопросы новых членов» (a PDF it links) prints the same Steps word for word. It also links a PDF of the **whole Big Book in a refined Russian translation** («уточнённый перевод», «Второе русское издание», 2025, © A.A.W.S.), which carries the long-form Traditions, the short-form Concepts and the Third and Seventh Step prayers. aa.org has no Russian pages at all (its sitemap: en, es, fr). The only fixed text I couldn't find in A.A.'s Russian online is the **Serenity Prayer** (the service manual names it «Молитва о душевном покое» but doesn't print it): that one is ours.

## The open decision (read this first)
**May we quote the refined Big Book translation as A.A. Russia's text?** What it is, from its own pages:
- It's on aarussia.ru's literature page, under «Файлы для скачивания», next to the catalogue and the pamphlets: «Анонимные Алкоголики, уточненный перевод» (Yandex Disk, uploaded 2026-06-03), with «Комментарий РГ к уточненному переводу АА».
- The cover letter, to the delegates: "We are glad to share with you the full text of the refined translation of the BB. **In this form it was sent to the copyright holder in New York for expert review.**"
- Its foreword (pp. vi–x): the Working Group was set up inside the literature committee on 8 June 2008, reported to the Conference for years, signed away its copyright in 2016; chapter 5 went to A.A.W.S. in July 2020, and in **August 2024 A.A.W.S. answered that its experts found no error in chapter 5 and regard it as ready for publication**. The title page says © 1989, 2025 A.A.W.S., «Второе издание 2025», but the ISBN is still «XXX-X-XXXXXX-XX-X».
- The store sells the **1989 translation** in print (170 ₽ and up). That text isn't online anywhere A.A. publishes it, so it can't be our source.
- The PDF's permissions say no copying of text. We'd use it as the English site uses the English book: short cited passages for study, plus the long-form Traditions and the Concepts in full.

Options:
1. **Quote [bb2025] as "the refined Russian translation that A.A. Russia publishes (2025)"**, never as "A.A.'s Russian Big Book" or "the official translation". The glossary's wording for the Steps, Traditions and Concepts pages, and the credit line under a quote, already say exactly that. `ru_ours_note` (in core.json) says it too, if the Super turns the OURS_NOTE flag on for ru. **This is my recommendation.** It's A.A. members' own careful work, it's on A.A. Russia's site for its members, chapter 5 is cleared by A.A.W.S., and it's far closer to the English than anything we'd write.
2. **Treat it as unpublished** and translate the long-form Traditions, Concepts, prayers and Big Book quotes ourselves, marked ours (hi1's model). Then the glossary's [bb2025] texts are replaced, and OURS_NOTE for ru goes on.
3. Option 1 now, and if A.A.W.S. publishes the second edition with changes, swap the changed lines (a search-and-replace, since every page quotes the glossary word for word).

Whatever is chosen: **the Steps stay A.A. Russia's published wording** (aarussia.ru = the pamphlet), not [bb2025]'s chapter 5. The Working Group itself writes that spreading its Step wording to other literature is "outside the competence of the Working Group", so the Steps a member hears at a meeting are still the old ones. That leaves one known seam: a Big Book quote that contains a Step (p. 59–60) will read differently from the Step on /12-steps/. The glossary's honest wording on /12-steps/ says why.

I wrote to no one. If Derick wants it settled from the source, A.A. Russia's literature committee or the ЦБО (id@rsoaa.ru; +7 985 448 29 80, 10:00–18:00 мск, from aarussia.ru) could say whether quoting the refined text is fine. That's his call, not a prep's.

Second reader: I wrote the Russian myself, without machine translation. It hasn't been read by a native Russian speaker in A.A. The fixed texts (Steps, Traditions, Concepts, prayers, Preamble) are A.A. Russia's own words, copied by script, so the risk is in our prose (core.json) and in the Serenity Prayer (ours).

## Choices, and why
- **Register: вы, lower case**, plural agreement. aarussia.ru's running text writes «вы» about ten to one over «Вы», and [bb2025] almost always does; A.A.W.S.'s printed pamphlets capitalise «Вы» like a letter. The work order's default (lower case unless A.A. Russia's literature reads otherwise) and A.A. Russia's own web text agree; the book agrees too. Never ты (except inside a Big Book quote that has it).
- **Buttons in the infinitive** («Найти группу», «Узнать больше»), as aarussia.ru's own buttons; requests in sentences in the вы-imperative («Позвоните», «Напишите нам»).
- **"A.A." → «АА»**, two Cyrillic letters, no periods, neuter singular agreement («АА не связано», «АА должно»). That's aarussia.ru everywhere (2,255 times) and the Preamble.
- **Alcoholics Anonymous → «Анонимные Алкоголики»**, both capitals (aarussia.ru, the book's title page).
- **Fellowship → «Содружество»** for A.A. (the Preamble's word), «сообщество» for the other eight fellowships in the directory. Traditions 8–10 and the Concepts also say «Сообщество»: kept inside those texts.
- **Meeting → «собрание»**; group «группа»; home group «домашняя группа»; group conscience «групповое сознание»; newcomer «новичок»; sobriety «трезвость»; slip «срыв»; recovery «выздоровление»: all A.A. Russia's own words, cited in the glossary.
- **Sponsor → «наставник»**, sponsee «подопечный», sponsorship «наставничество»: A.A. Russia's pamphlet is «Вопросы и ответы о наставничестве», its questionnaire asks «Есть ли у Вас сейчас наставник/спонсор?», and on aarussia.ru «спонсор» otherwise means a sponsor of research. Not «спонсор».
- **Higher Power → «Высшая Сила»**, both capitals (aarussia.ru's own product page for the Big Book; [bb2025]). God «Бог», with capital pronouns (Он, Его), as the Steps.
- **Big Book → «Большая книга»** ([bb2025], the pamphlet); A.A. Russia also writes «БК», which we don't use in prose.
- **Inventory:** the Steps (A.A. Russia's wording) don't use the word: Step 4 «оценили себя и свою жизнь с нравственной точки зрения», Step 10 «самоанализ». [bb2025] says «инвентаризация». The glossary keeps both, each in its own place, and says how to bridge them where the English talks about the word "inventory". Same for "unmanageable" and "defects of character".
- **ё always** in our prose («ещё», «всё», «её»), as [bb2025] and the pamphlet print it. Fixed texts are copied as their source prints them (the Steps with the pamphlet's ё; T5's «всё ещё» with the pamphlet's ё).
- **Punctuation:** «ёлочки» with „лапки“ inside; « — » between clauses; en dash in ranges; 24-hour times («19:00», as aarussia.ru prints meeting times); dates «1 ноября 2026 г.», «в 1935 году»; thousands with a space («29 000»); decimal comma («US$4,99»).
- **Preamble:** aarussia.ru's text, which follows the older English "men and women" (today's English, which the site quotes, says "people"). Used as A.A. Russia prints it; the glossary has a one-line note for the rare page whose point is that word.
- **Page numbers:** the English 4th edition's, always («стр. 417»). [bb2025] starts each chapter on the English page, but drifts inside chapters.
- **Personal stories:** [bb2025] online ends after Dr. Bob's story, so the p. 417 line on the home page (core.json 1b08a63f6559) is **ours**, and its label (96327e987d94) says so: «Alcoholics Anonymous · 4-е изд. · перевод наш».

## Font (for the wave)
The site's fonts carry no Cyrillic (checked on Google Fonts: Fraunces has latin, latin-ext, vietnamese; Outfit latin, latin-ext). Proposal:
- **Headings: Literata** (Google Fonts, variable, `opsz` axis like Fraunces; cyrillic and cyrillic-ext subsets). A soft, bookish serif with real Cyrillic and a true italic. Next to Fraunces it reads as the same family of feeling.
- **Body and UI: Jost** (cyrillic subset; geometric, Futura-like). The closest in shape to Outfit. Manrope (cyrillic and cyrillic-ext) is the second choice; it's more neutral and a touch wider.
- **Put the Cyrillic face first** in the ru stack, so a heading like «Знакомьтесь: Recovery Einstein» is set in one face, not Literata for the Russian and Fraunces for the brand (that's the work order's "no fallback font mid-word", taken one step further: no change of face mid-line). Hindi put Noto after the Latin fonts because hi pages carry a lot of Latin; ru pages are almost all Cyrillic.
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&family=Jost:ital,wght@0,300..700;1,400&display=swap');
  html:lang(ru){--font-display:'Literata',Georgia,serif;--font-body:'Jost',system-ui,-apple-system,sans-serif;--font-ui:'Jost',system-ui,-apple-system,sans-serif}
  ```
  (Google's css2 API serves every subset as a separate `unicode-range` file anyway; the browser only downloads the Cyrillic and Latin files a page uses.)
- **Italics:** keep them; both faces have real italics (unlike Devanagari). No `font-style:normal` override.
- **Line height:** the site's own is fine for Cyrillic (no stacked marks). **Length:** Russian runs longer; the specimen below shows the longest button «Поговорить с Recovery Einstein» fits on one line at 390 px, and the hero «Как бы ни прошла прошлая ночь, сегодня новый день.» takes four lines at 34 px (English takes three). The Super checks the real menu and buttons on the built /ru/ pages at 390 and 1366.
- I rendered a specimen (Fraunces/Outfit in English against Literata/Jost and Literata/Manrope in Russian, 390 and 1366 px, headless Chromium): every Cyrillic glyph came from the intended face; no fallback glyphs. It's a specimen, not the site: the Super's S1 check on the real pages stands.
- ru is **left-to-right**: nothing for rtl.mjs. The wave adds `style.ru.css` through build.mjs LANG_CSS, like `style.hi.css` (scripts are the wave's job; I touched none).

## What the wave teaches the scripts (not done here, on purpose)
- `scripts/i18n/lib.mjs` LANGS: `ru` (tag `ru`), so `check.mjs ru` runs. I checked `core.json` with the same rule check.mjs uses (`placeholdersOf`: the same `<n>`, `</n>`, `<n/>` set as the English) in a scratch copy, plus Russian checks: **0 problems, 278 entries** (277 ids + `ru_ours_note`). The one flag, «The A.A. Grapevine» in Latin, is inside long-form Tradition 9 as [bb2025] prints it. (Running the repo's own check.mjs here needs its node modules, which this clone doesn't have; the Super runs it at S1.)
- `score.mjs ru` register and type checks, outside «…» quotes: ты-forms (ты, тебя, тебе, тобой, твой, твоя, твоё, твои…); «Вы/Вас/Вам/Ваш» capitalised mid-sentence; ASCII " and “…” in prose; **mixed-script words** (a Latin a/e/o/p/c/x/y inside a Cyrillic word: the commonest invisible Russian typo); «A.A.»/«AA» in Latin outside English proper names; «спонсор» for sponsor; a long segment with no Cyrillic.
- build.mjs: `OG.ru = "ru_RU"`; `LANG_CSS.ru = "style.ru.css"`; `OURS_NOTE.ru`: **off** under option 1 above (the Steps and Traditions are A.A. Russia's; the refined text is named on the pages that quote it), **on** under option 2. `ru_ours_note` is in core.json either way.
- `sitemap.mjs` / hreflang: `ru`.

## core.json — notes per segment
- **Crisis segments** (8962fc3719e8 footer, d1539935a7cb home, 6c4e5e94d345 app disclaimer): Russia first — 112 when life is at risk; 8-800-2000-122 for children, teens and parents (free, anonymous: the service's own words). North America second: 988 by **call** only, "ask for a Russian interpreter". Never "text". "Confidential" («конфиденциально») is said of 988 only. a05fd124808c labels the 988 button «(США и Канада)». The `<0>988</0>` / `<1>988</1>` placeholders stay around 988 (a `tel:` link); the Russian numbers have no placeholder, so no link (the wave may want `tel:112` links; that needs an English-side change, so leave it unless the CEO window wants it).
- **No adult crisis line for Russia** made it in: I couldn't confirm one on its own site (below). So for an adult in Russia the segments give 112 only, plus the child line "for children, teens and parents". If the CEO window or the Finder confirms an adult line, it goes into these three segments and the glossary table.
- **/aa-info/ Traditions (long form, 12) and Concepts (short form, 12)** are [bb2025]'s texts, copied by script; 7a68d874e33f says where the Russian comes from.
- **1b08a63f6559** (p. 417): ours (the stories aren't in [bb2025] online); 96327e987d94 says «перевод наш».
- **ec9801da69fd** «АН — Анонимные Наркоманы (NA)», 148/149 and the directory names: N.A.'s Russian name is used as a name only; CA, GA keep the English name beside ours; CMA, SAA stay in Latin (no confirmed Russian name; «Анонимные Сексоголики» is SA, a different fellowship).
- **8fda8b39c5ec**: the English example "The Tuesday night one at the Legion" became «То, что по вторникам вечером в Доме культуры» (a place a Russian group really meets); 8bf604c0ddeb "Tuesdays 7:00 pm" → «по вторникам, 19:00».
- **Prices**: «US$4,99 <0>в месяц</0>», «Или US$49,99 в год», «US$6,49»: the English's US$ with a decimal comma.
- **e2b37d35d487** "Over 2 million members in 180+ countries" → «Более 2 миллионов членов в более чем 180 странах».
- Names: Дерик, Ред-Дир (провинция Альберта), Билл У., доктор Боб, Акрон (штат Огайо); brands in Latin.

## Crisis lines — kept, held, dropped
- **Kept:** Russia **112** (MChS's own FAQ: «единому номеру вызова служб экстренного реагирования в России «112»»). Russia **8-800-2000-122** «Детский телефон доверия» (telefon-doveria.ru/about: all-Russia line for children, teens and their parents, free from any phone, anonymous; fond-detyam.ru: also **124** from a mobile, round the clock in **82 regions**). **Canada 9-8-8** (988.ca: English/French; another language "may be available by phone, via an interpreter"). **US 988** (samhsa.gov: call with an interpreter in 240+ languages, free; text and chat English/Spanish only).
- **A.A.'s own line, not a crisis line:** aarussia.ru's «Единый информационный телефон» 8-800-234-99-20 (no hours or cost stated on the site). In the glossary for "find A.A." contexts only; not in core.json.
- **Held:** Moscow's psychological help service **051** (msph.ru) and Moscow's 112 page (112.mos.ru): both reset the connection from this container (2026-11-01); Russian state sites often refuse foreign data-centre IPs. Nothing could be read on their own sites, so nothing is said about them. web.archive.org also reset from here. The work order said plain curl, so I didn't route around it (Bright Data); the Finder or the Super can try from where those sites answer.
- **Dropped:** MChS's «телефон доверия» numbers (a line for reports to the ministry, not psychological help). Any number not read on its own site.

## Unsure
- unsure: **[bb2025] as a source** (the open decision above).
- unsure: the **Serenity Prayer** is ours. A.A. Russia's meeting cards have their own wording; it's not online on any A.A. Russia page I could read (64 pages of aarussia.ru, its service manual and six pamphlet PDFs searched by script). Swap it in when one is read on an A.A. page.
- unsure: **«Знакомьтесь: АА»** as the Russian title of "This is A.A." (titles matched by me from the store list; the pamphlet itself wasn't read).
- unsure: **«ЦБО — Центральное бюро обслуживания»**: aarussia.ru writes only «ЦБО»; the expansion is mine.
- unsure: **«активист выздоровления»** for "recovery advocate" (Derick) and **«бросил употреблять»** for "got clean": plain and accurate, but a native speaker may have a warmer phrase.
- unsure: **«Каждое утро идёт в счёт.»** for "The mornings add up." (ours; a fixed phrase on the home page).
- unsure: the 8-800-2000-122 line is for children, teens **and parents**; using it in the general crisis segments is right for a parent and a young person, and honest because the segment says who it's for, but it isn't an adult crisis line.
- unsure: the **Daily Reflection** feature name «Размышление дня» vs the A.A. book «Ежедневные размышления»: the site's own feature is ours («Размышление дня»); the book is always named with its title in «».
- unsure: the 1989 printed Big Book (what most members hold) may word quotes differently from [bb2025]; we can't read it online to compare.

## Fixes that worked (for the CEO's flaws/log)
- **A.A. Russia's literature PDFs sit on Yandex Disk** behind `disk.yandex.ru/i/…` and `/d/…` share links; plain curl gets an HTML viewer, not the file. Ask Yandex's public API for a direct link: `curl -G --data-urlencode "public_key=<share link>" https://cloud-api.yandex.net/v1/disk/public/resources/download` → JSON `href`, then curl that. No key needed. (`…/v1/disk/public/resources?public_key=…` gives the name, size and upload date.)
- **A Tilda shop's product list** (aarussia.ru's literature store is Tilda; the page itself has only «В корзину» placeholders): the page source has `recid:'…',storepart:'…'`; `https://store.tildaapi.com/api/getproductslist/?storepartuid=<storepart>&recid=<recid>&c=1&getparts=true&slice=1&size=200` with a `Referer` of the shop page returns every product's title, price, description and link as JSON.

*— prep-ru window, 2026-11-01*
