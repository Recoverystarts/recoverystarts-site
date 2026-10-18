# Hindi (hi) — prep notes

*Prep window prep1-hi, 2026-10-17 (UTC). Research only. Nothing here has shipped, merged or deployed. Files: `GLOSSARY.md`, `core.json` (all 286 ids of `i18n/pl/core.json`), this file. These notes are mine (the prep1-hi window); the CEO window checks them before any runner sees them.*

## The open decision (read this first)
**No A.A. body publishes the Hindi Steps, Traditions, Concepts or prayers online.** What I checked, all on 2026-10-17:
- **GSO India** (`aagsoindia.org`): I fetched every page in its sitemap (about 70) and found **no Devanagari anywhere**. It is an English-only site. `/about` says GSO India translates Conference-approved literature into Indian languages and gets AAWS approval, so a Hindi Big Book and pamphlets exist in print. A.A.W.S.'s Box 459 (Aug–Sept 2001) also lists Hindi among the languages GSO India prints. None of it is online.
- **aa.org**: no Hindi pages. The A.A.W.S. store lists two Hindi items: HINDB-15 *Twelve Steps and Twelve Traditions* (never a source) and HINDP-44 *A.A.'s Legacy of Service* (print only).
- **The only A.A. Hindi online is A.A. Pune Region** (`aapune.org`, linked from GSO India's events page). Its Hindi covers the site's own pages, an Indian-variant Preamble and the interface words. It has no Steps, Traditions, Concepts or prayers.
- Searches in Hindi and English for the Steps' Hindi wording turned up only non-A.A. pages: a treatment centre (Muktangan), MSD Manuals, dictionaries and Google-translated pages. I used none of them.

So everything below is **[ours]**, translated from A.A.'s English and marked as ours in the glossary: the Steps, both forms of the Traditions, the Concepts, the Serenity Prayer, the Third and Seventh Step prayers and the A.A.W.S. Preamble. The glossary also gives the honest wording for any page that says "word for word" or "A.A.'s own wording".

Options for the CEO window:
1. **Ship ours, with the honest notes** (as pl did for its long-form Traditions). The wave can start straight away. Risk: a Hindi-reading member who knows the printed card will see different words.
2. **Get A.A. India's printed wording first.** Derick (not me) writes GSO India: `info@aagsoindia.org`, +91 80970 55134 / +91 86550 55134, Navi Mumbai. He asks for the Hindi Steps, Traditions (short form), Preamble and Serenity Prayer as GSO India prints them, or orders the Hindi Big Book. When they come, they replace ours in the glossary and on /12-steps/, /12-traditions/ and /aa-info/. That's a search-and-replace, because every page quotes the glossary word for word.
3. Do 1 now and 2 in parallel. **This is my recommendation.** Nothing waits, and the swap is mechanical later.

I wrote no email and contacted no one.

Second reader: I wrote the Hindi myself, without Google Translate or any other machine translation. It has not been read by a native Hindi speaker in A.A. Before the Steps go live, a Hindi-speaking member should read the twelve Steps and twelve Traditions (short form) once. That's about 25 lines, and those are the lines a member will recognise or reject.

## Choices, and why
- **Register:** **आप** with plural agreement, polite -एँ/-ें imperatives («खोजें», «पढ़ें»). This is how A.A. Pune addresses its reader («आप शराबी हैं या नहीं, यह केवल आप ही तय कर सकते हैं»). So the work order's default (formal आप) and A.A.'s own Hindi agree. Never तुम or तू.
- **"A.A."** → **AA**, Latin, no periods. A.A. Pune's Hindi body text writes AA almost everywhere («AA क्या है?», «AA की मीटिंग»). Its headings also show «A.A.» and «ए.ए.». I fixed one form, and AA also matches NA, CA, CMA in the directory. The alternative «ए.ए.» (all-Devanagari) is defensible. If the CEO window prefers it, it's a find-and-replace in two files.
- **Fellowship:** A.A. = **संगति** (A.A. Pune's Preamble word); the nine directory fellowships and "a fellowship" in general = **फेलोशिप**.
- **Steps / Traditions / Concepts:** **चरण** and **परंपरा** are A.A. Pune's («बारह चरणों (Twelve Steps)», «बारह परंपराएँ»). **संकल्पना** is ours. I avoided «कदम» for the Steps: the only page using «बारह कदम» is a treatment centre's, not A.A.'s.
- **Sobriety** = **संयम** (A.A. Pune: «संयम (नशामुक्ति)»). Alcoholic = **शराबी** (A.A. Pune's word, kept unsoftened).
- **Digits:** **Latin**. A.A. Pune's own code says it outright (`schedule.js`: "Marathi conventionally uses Devanagari digits; Hindi and English use Latin ones"), and its Hindi body text prints «5 मई 1957», «12 जनवरी 1957». Pune's two nav labels with Devanagari digits («AA पुणे ५० वर्ष», «१ अक्टूबर») come from its Marathi-first heritage. Hindi goes Latin, and the site needs no digit conversion for hi (unlike fa's `DIGITS`).
- **Big numbers:** लाख/करोड़ from a lakh up (2 million → «20 लाख»). That's what a Hindi reader in India reads. Below a lakh, 29,000 with a comma.
- **Times:** 12-hour with सुबह/दोपहर/शाम/रात («शाम 7:00 बजे»), as A.A. Pune prints meeting times.
- **Punctuation:** the danda «।», “…” with ‘…’ inside (A.A. Pune does both), and « — » for clause dashes.
- **Preamble:** A.A. Pune's Hindi Preamble is printed in the glossary word for word. It renders an Indian variant of the English (its own English adds "In sharing this way, members find renewed courage…"), paraphrases freely, and uses the Marathi «वर्गणी». So where the English site quotes the A.A.W.S. Preamble, runners use ours.

## Font (for the wave)
- Load **Noto Sans Devanagari** from Google Fonts: `https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap`. It covers Devanagari with nukta, chandrabindu and conjuncts properly, and matches the Noto fallback many Indian Android phones already have.
- For headings, **Noto Serif Devanagari** (600;700) sits closer to the site's Fraunces than the sans does. It's optional; one family (sans everywhere) is fine and lighter.
- Put the Devanagari family **after** the site's Latin fonts in the stack, e.g. `--font-body: <current Latin body font>, 'Noto Sans Devanagari', system-ui, sans-serif` under `html:lang(hi)`. Brand names (Recovery Einstein, AA, YouTube) then stay in the site's Latin type, and the browser takes Devanagari glyphs from Noto. Persian is the opposite case (rtl.mjs puts Vazirmatn first); Hindi pages carry a lot of Latin.
- Devanagari needs more room. Body `line-height` about 1.7 under `:lang(hi)` (the matras above the line and the conjuncts below collide at 1.4–1.5). The display sizes may need a touch more too.
- **No italics** for Devanagari: `html:lang(hi) em, html:lang(hi) i { font-style: normal; font-weight: 600 }`, as rtl.mjs does for fa. Fake-slanted Devanagari looks broken.
- For reference, A.A. Pune loads IBM Plex Sans Devanagari and Martel. They're also fine, but Noto is the safer default.
- hi is **left-to-right**: it doesn't belong in rtl.mjs. The wave adds a small `:lang(hi)` font block (scripts are the wave's job; I touched none).

## What the wave needs to teach the scripts (not done here, on purpose)
- `scripts/i18n/lib.mjs` LANGS: `hi` (tag `hi`, or `hi-IN` if the site wants the region), so `check.mjs hi` runs. I checked `core.json` with the same rule check.mjs uses (`placeholdersOf`: same `<n>`, `</n>`, `<n/>` set as the English) in a scratch script: **0 problems, 286 entries**. I also checked for no ASCII "quotes", no leftover `&entities;`, no Devanagari digits and no long segment without Devanagari: all clean.
- `score.mjs hi` register check: flag **तुम, तू, तुम्हारा, तुम्हारी, तुम्हें, तेरा, तेरी, तुझे** outside quotes; ASCII " in prose; a Latin "." ending a Hindi sentence; Devanagari digits ०–९.
- `sitemap.mjs` / hreflang: `hi`.

## core.json — notes per segment
- The **crisis segments** (8962fc3719e8 footer, d1539935a7cb home, 6c4e5e94d345 app disclaimer) put India first: Tele MANAS 14416 / 1-800-891-4416, toll-free, 24/7; 112 when life is at risk. North America second: 988 by **call** only, "ask for a Hindi interpreter". Never "text". "Confidential" is said of 988 only, because Tele MANAS's site doesn't say it of calls. a05fd124808c labels the 988 button «(अमेरिका और कनाडा)». The `<0>988</0>` / `<1>988</1>` placeholders stay around 988 (a `tel:` link). The Indian numbers have no placeholder, so no link; the wave may want `tel:14416` links (it would need an English-side change, so leave it unless the CEO window wants it).
- **/aa-info/ Traditions (12) and Concepts (12)** are the glossary's [ours] texts, cut at the English's `<0>` points. The page makes no "word for word" claim, so no honesty note is needed there.
- **1b08a63f6559** (Big Book p. 417, "And acceptance…"): ours, translated in full (pl shortened it; I didn't).
- **96327e987d94** «Alcoholics Anonymous · चौथा संस्करण (अंग्रेज़ी)», **7ed24aa5bff7** «पृ. 417»: English book, English page numbers.
- **e2b37d35d487**: "Over 2 million members" → «20 लाख से ज़्यादा सदस्य».
- Prices: «$2.99 <0>/माह</0>», «30,000 डॉलर». USD kept as the English has it; no rupee conversion.
- Names in Devanagari (डेरिक, बिल डब्ल्यू., डॉ. बॉब, एक्रन, रेड डियर, अल्बर्टा); brands in Latin (Recovery Starts, Recovery Einstein, Addict2Influencer, Seeker, Pro…).
- The meeting-form example "Tuesdays 7:00 pm" → «हर मंगलवार, शाम 7:00 बजे»; "The Tuesday night one at the Legion" → «मंगलवार रात वाली, लीजन हॉल में» (Legion hall kept, since it's the English's own example).

## Crisis lines — kept, held, dropped
- **Kept:** India **Tele MANAS 14416 / 1-800-891-4416** (telemanas.mohfw.gov.in: toll-free, 24/7, call and app, 20 Indian languages, covers alcohol). India **112** (ERSS, Ministry of Home Affairs page; 112.gov.in itself reset the connection from here). **Canada 9-8-8** (988.ca: English/French; another language "may be available by phone, via an interpreter"). **US 988** (samhsa.gov: call with an interpreter in 240+ languages, free; text and chat English/Spanish only).
- **Held:** **14446**, the de-addiction helpline. Its ministry's homepage lists it as «National Deaddication Helpline- 14446», but not its hours or cost, and nmba.dosje.gov.in returned HTTP 500 today. The number and purpose are confirmed; the rest isn't. Not used in core.json.
- **Dropped:** KIRAN 1800-599-0019 and NGO lines (not checked on their own sites).
- The Tele MANAS site sends an incomplete certificate chain. I verified it with the missing Sectigo intermediate (checked against Mozilla's CCADB), never by turning TLS checks off. Its Hindi interface text wasn't reachable (only `en.json` is served), so «टेली मानस» is our transliteration of "Tele MANAS".

## Unsure
- unsure: «आमीन» at the end of the Seventh Step prayer. The English has "Amen". In Hindi it reads Christian/Islamic, and A.A. India's card may drop it or keep it. I kept it, faithful to the English.
- unsure: **«उच्चतर शक्ति»** for Higher Power, and **«अनामिता»** for anonymity. Both are ours; Indian members may say «हायर पावर» and «अनामिकता/गुमनामी». A.A. India's print would settle it.
- unsure: **«स्पॉन्सर»** (transliterated) for sponsor. A.A. Pune has no word for it. Indian meetings mostly say "sponsor"; «मार्गदर्शक» is the Hindi alternative.
- unsure: **«होम ग्रुप»** for home group (ours, on A.A. Pune's «मदर ग्रुप» pattern).
- unsure: Step 2's «मानसिक संतुलन» for "sanity", and Step 4's «गहन और निर्भीक नैतिक लेखा-जोखा». These are the two Step phrases where a member's printed card is most likely to differ.
- unsure: the Tele MANAS phone service's Hindi isn't named on the pages I could read (it says "20 Indian languages" and "choice of language"). The wording says neither "Hindi" nor anything it can't back up.
- unsure: the US 988 page doesn't name Hindi among the 240+ languages. "Ask for a Hindi interpreter" asks without promising.
- unsure: big-number style. «20 लाख» is natural Hindi; if the site wants international style everywhere, «20 लाख» → «2 मिलियन» is the only change in core.json.

*— prep1-hi window, 2026-10-17*
