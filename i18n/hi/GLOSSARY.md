# Hindi glossary — the words every hi runner uses the same way

*Started 2026-10-17 by prep window prep1-hi (research only; nothing here has shipped). Standard written Hindi in Devanagari, plain and warm, the Hindi an Indian A.A. member reads, not Sanskritised officialese. The reader is **आप** (see "Form of address"). Where an A.A. body prints its own Hindi, we use it word for word; the source is in brackets. **[ours]** marks a wording no A.A. body has published online: it's ours, fixed here so every page says it the same way. Add to this file through your close (`unsure:`), not by changing it mid-wave. **Never N.A.'s Hindi and never the Twelve Steps and Twelve Traditions** (the "12 & 12"; A.A.W.S. sells a Hindi edition, HINDB-15), even if you know them.*

> **Read this first.** No A.A. body publishes the Hindi **Steps, Traditions, Concepts, Serenity Prayer, Third or Seventh Step prayer** online (searched 2026-10-17; see Sources). A.A. India prints them in its Hindi literature, but nothing of it is online. So every one of those texts below is **[ours]**, a faithful translation of A.A.'s English. Never call them "A.A.'s Hindi" or "A.A.'s own wording", and say so honestly on any page that claims "word for word" (wording under each section). The CEO window decides before the wave whether to ship ours or get A.A. India's printed wording first (PREP-NOTES.md, "The open decision").

## Sources (checked 2026-10-17, all read directly on the publisher's own URL)
- **[aapune]** — A.A. Pune Region's site, `aapune.org`, linked from A.A. India's own site (`aagsoindia.org/events`). It carries a Hindi version of its pages (the `data-hi` text behind its हिंदी switch): `/about-aa` (the Preamble, "What is AA?", "How AA Works", the history of A.A. in India, the General Service Office), `/am-i-an-alcoholic` (self-assessment intro), and `/static/schedule.js` (its Hindi interface words: weekdays, सुबह/दोपहर/शाम, and the rule *"Marathi conventionally uses Devanagari digits; Hindi and English use Latin ones"*). This is the **only A.A. Hindi online** we could find. It is a regional A.A. body's own website Hindi, not A.A. India's printed literature. We use it for vocabulary, form of address, digits and dates, and we print its Preamble as it stands (below).
- **[GSO India]** — General Service Office of A.A. India, `aagsoindia.org`. Every page was read (about 70, from its sitemap) and **none has Devanagari text**. The site is English only. `/about` says GSO India translates Conference-approved literature into Indian languages (Hindi among them; A.A.W.S.'s Box 459, Aug–Sept 2001, also lists Hindi among the languages GSO India prints). Its 38 PDFs are government permission letters, not literature.
- **[aa.org store]** — A.A.W.S.'s literature store (`onlineliterature.aa.org`), searched for "Hindi": two items only. HINDB-15 *Twelve Steps and Twelve Traditions* (never a source) and HINDP-44 *A.A.'s Legacy of Service* (print only, no text online). aa.org itself has no Hindi pages.
- Not A.A., not used: `muktangan.org/12-steps-hindi/` (a treatment centre's page, «बारह कदम और बारह परम्पराऍं»), `aakolhapur.org` (A.A. Kolhapur, **Marathi**, not Hindi; never borrow its Marathi as Hindi), MSD Manuals Hindi, dictionary sites, and any Google-translated page. A treatment centre's or a dictionary's Hindi is not A.A.'s.

**Which wording, and why.** Vocabulary, register and conventions: [aapune], the only A.A. Hindi online, and an A.A. body linked from GSO India. Steps, Traditions (short and long), Concepts, prayers: **[ours]**, translated from A.A.'s English (SMF-121; Big Book pp. 59–60, 63, 76, 561–566; the Concepts' short form as the English site prints it). The Preamble: [aapune]'s Hindi is printed below, but it renders an **Indian variant** of the English (its English beside it adds "In sharing this way, members find renewed courage…" and is not the A.A.W.S. Preamble), and it paraphrases freely ("desire to stop drinking" becomes «शराब की बीमारी से मुक्त होने की इच्छा»). So where the English site quotes the A.A.W.S. Preamble we use **ours**, and we never call Pune's text "the Preamble's Hindi".

## Form of address
- **आप**, with plural agreement: «आप अकेले नहीं हैं», «आप जो पेज ढूँढ़ रहे हैं», «अगर आप संकट में हैं». That's how A.A. Pune addresses its reader [aapune: «आप शराबी हैं या नहीं, यह केवल आप ही तय कर सकते हैं»]. Requests and buttons in the polite -एँ/-ें form: «खोजें», «पढ़ें», «बात करें», «जाएँ» [aapune: «रीसेट करें», «Google Maps पर खोलें»]. Not -इए (fine, but don't mix it in), and never तुम or तू for the reader.
- **God** is referred to in the honorific plural: «ईश्वर, जैसा हम उन्हें समझते थे», «उनकी इच्छा», «वे शासन नहीं करते» (that last one is the leaders). In a prayer, God is addressed as **आप**: «मुझे वह शांति दीजिए». Hindi has no capitals, so there's no capital-G problem.
- **Third person, honorific for people:** Derick, Bill W., Dr. Bob take the plural: «डेरिक ने बनाया है… जो 3 साल से ज़्यादा समय से संयम में हैं» [aapune does this for Harry M.: «हैरी एम. भारत के पहले व्यक्ति थे जिन्होंने…»].
- **Gender:** prefer forms that don't need it («आप पढ़ सकते हैं» is unavoidable; fine). Where a form must take a gender, use the **masculine generic**, as A.A. Pune does («आप अकेले नहीं हैं»). No slashes («करता/करती») in prose. The prayers are in the first person masculine («मैं प्रार्थना करता हूँ»), as most Hindi prayer cards are; keep it.
- The registers to avoid: «तुम», «तू», «श्रीमान/श्रीमती» for the reader. `score.mjs hi` doesn't exist yet; the wave teaches it the तुम/तू/तेरा/तुम्हारा forms (PREP-NOTES).

## How to write a segment
- Placeholder form: keep every `<0>…</0>` and `<1/>` the English has, around the words that belong in them, in the order Hindi needs (Hindi is verb-final: «<0>Recovery Einstein</0> से मिलें»). Don't type HTML.
- `node scripts/i18n/check.mjs hi <your-batch>` = 0 problems, once the wave has added `hi` to `scripts/i18n/lib.mjs` LANGS.
- **Script:** Devanagari, Unicode, with **nukta** where standard Hindi writes it: ज़रूरत, ज़िंदगी, फ़ोन, फ़रवरी, ख़तरा, ग़लती, क़ानूनी, बाक़ी, नुक़सान [aapune: फ़ोटोकॉपी, अख़बार, फ़रवरी, स्टाफ़, काफ़ी]. **Chandrabindu** where it belongs: हूँ, यहाँ, कहाँ, पहुँचना, जाएँ, परंपराएँ (not हूं, यहां). Use the conjuncts as typed by a normal Hindi keyboard; don't hunt for special characters.
- **Full stop: the danda «।»**, never a Latin "." at the end of a Hindi sentence. ? ! , ; : — as in English. A sentence that ends in Latin (a URL, a brand) still takes «।»: «aa.org पर जाएँ।»
- **Quotes:** “…” (curly double), and ‘…’ inside them [aapune: “Alcoholics Anonymous” नामक पुस्तक; ‘हाँ’ या ‘नहीं’]. Never "…" (ASCII) or «…» in Hindi prose.
- **Dashes:** the em dash with spaces « — » between clauses [aapune]. A range: 1937–1950, पृ. 58–59 (en dash, no spaces).
- **Numbers: Latin (international) digits**, always: 1957, 12 जनवरी, पृ. 417 [aapune, `schedule.js`: "Hindi and English use Latin ones"; its body text: «5 मई 1957»]. Never Devanagari digits (१२३). Thousands: 1,234 / 29,000; **from a lakh up, write लाख/करोड़ in words**: 2 million → «20 लाख», 1.5 million → «15 लाख», 10 million → «1 करोड़». Decimal point: 2.99. Prices stay in US dollars as the English has them: «$2.99 <0>/माह</0>», «30,000 डॉलर».
- **Dates** (Gregorian, as the English): day, month, year, no comma, no ordinal: «5 मई 1957», «18 नवंबर 1982», «13 अक्टूबर» [aapune]. "in October" → «अक्टूबर में». "All of October" → «पूरा अक्टूबर». "October 12 — Title" → «12 अक्टूबर — शीर्षक».
  - months: जनवरी, फ़रवरी, मार्च, अप्रैल, मई, जून, जुलाई, अगस्त, सितंबर, अक्टूबर, नवंबर, दिसंबर [aapune uses फ़रवरी, अक्टूबर, जनवरी, मार्च, मई, जून]
  - weekdays: रविवार, सोमवार, मंगलवार, बुधवार, गुरुवार, शुक्रवार, शनिवार [aapune `schedule.js`]; "daily" «प्रतिदिन»; "Monday to Friday" «सोमवार से शुक्रवार» [aapune]
- **Times:** the 12-hour clock with the time of day in words, as A.A. Pune prints meeting times: «सुबह 7:00 बजे», «दोपहर 1:30 बजे», «शाम 7:00 बजे», «रात 9:00 बजे» [aapune `schedule.js`: सुबह / दोपहर / शाम, 12-hour `fmtClock`]. Not "pm", not 19:00. "2 AM" → «रात के 2 बजे».
- **Page references stay the English 4th Edition's numbers**: «पृ. 417», «पृष्ठ 86», «पृ. 58–59». We have never seen the Hindi Big Book's pagination; never swap in Hindi page numbers. **पेज** for a web page, **पृष्ठ / पृ.** for a page of a book.
- **Arrows:** keep → ← › exactly as the English has them.
- **Names, written in Devanagari:** बिल डब्ल्यू. [aapune], डॉ. बॉब, लोइस, एबी टी., डॉ. सिल्कवर्थ, कार्ल युंग, एक्रन, ओहायो, न्यूयॉर्क [aapune], the Oxford Group → ऑक्सफ़र्ड ग्रुप, डेरिक, रेड डियर, अल्बर्टा. Postpositions after the name with a space: «बिल डब्ल्यू. ने», «डेरिक के».
- **Brands and app names stay in Latin**, with the postposition after a space: Recovery Starts, Recovery Einstein («Recovery Einstein से बात करें»; alone «Einstein»), Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Seeker, Pro, Google Play, Android, YouTube, Instagram, TikTok, X, Facebook, Google Analytics, Cloudflare Web Analytics, aa.org. Product types in Hindi: ऐप, वेब ऐप, AI चैट, AI साथी.
- Watch for lost negatives: «नहीं», «न… न», «कभी नहीं», «कोई… नहीं», «सिवाय». A dropped «नहीं» turns a Tradition upside down (Tradition 6 «कभी भी… समर्थन नहीं करना चाहिए, न… और न…», 9 «कभी भी संगठित नहीं किया जाना चाहिए», 10 «कोई राय नहीं रखता… कभी भी… नहीं घसीटा जाना चाहिए»).
- Meta descriptions (the short text Google shows) end on a full sentence and a «।», never cut mid-sentence.
- **One segment is live JavaScript** (daily-reflection, the share bar: `<2>this.textContent='Copy Link',2000);return false;">Copy Link</2>`). Translate only the two words «Copy Link» → «लिंक कॉपी करें», both of them, and leave every other character exactly as it is.
- **Fonts and italics:** Devanagari has no true italic; a browser's slanted Devanagari looks broken. Where the English uses `<i>` for a book title, keep the placeholder, and the wave's CSS sets Devanagari upright (PREP-NOTES, "Font").
- Translate it yourself; no Google or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-17, each on the service's own site):
- **India — Tele MANAS, 14416 or 1-800-891-4416**, the national tele-mental-health helpline of the Ministry of Health and Family Welfare. **Toll-free, 24/7**, by **phone call** (also the Tele MANAS app, which links to the same number); counsellors answer "based on your region and corresponding choice of language", **20 Indian languages**; it lists "cigarette, alcohol and other such substances" and addiction among what it helps with, and suicidal ideas among what it screens for [telemanas.mohfw.gov.in: the site's own text, `assets/i18n/en.json`: «Dial the Toll-Free numbers below», «A toll-free, 24/7 helpline number (14416)», «Tele MANAS is a 24/7 on-demand service available free of cost… available in 20 Indian languages»; numbers as the site prints them: `phoneNumber:"1-800 891 4416", phoneNumbertwo:14416`]. Hindi is the site's own second language; the phone service's 20 languages aren't listed one by one on the pages we could read, so write «20 भारतीय भाषाओं में» if you name languages, not «हिंदी में». It's an IVRS line with a call-back (a recorded menu first, then a counsellor). Name: the site prints **Tele MANAS**. We write it **टेली मानस** in Hindi prose [ours, the transliteration].
  - Note for the desk: the site sends an incomplete TLS chain (the Sectigo DV R36 intermediate is missing), so plain `curl` fails. We verified it by adding that intermediate, checked against Mozilla's CCADB list, never by turning verification off.
- **India — 112**, the single emergency number (Emergency Response Support System, ERSS) "for reporting and addressing all kinds of emergencies", dispatching "Police / Health / Fire / Disaster / Women / Children / Railways"; reachable by voice call, SMS, SOS and more [Ministry of Home Affairs, `गृहमंत्रालय.सरकार.भारत/en/commoncontent/emergency-response-support-system-erss` (the IDN of mha.gov.in), «ONE INDIA ONE EMERGENCY NUMBER 112»]. 112.gov.in itself didn't answer from here (connection reset, 2026-10-17); the Ministry that runs it is the source. Use 112 only for a threat to life or an emergency.
- **Canada — 9-8-8**: call or text, **English and French, 24/7**; "If you would like to speak to someone in another language, this **may be available** by phone, via an interpreter – just let the responder know when you first get through" [988.ca/get-help/what-to-expect, re-read 2026-10-17]. Text: English/French only.
- **USA — 988**: call, text and chat in English and Spanish; "If you speak a language other than English or Spanish, the 988 Lifeline uses Language Line Solutions to provide interpretation to callers in **more than 240 additional languages**. There is no cost to you"; **text and chat have no interpreter** [samhsa.gov/mental-health/988/faqs, re-read 2026-10-17]. The page doesn't name Hindi; 240+ languages covers it in practice, so the wording asks for a Hindi interpreter rather than promising one.
- **Held, not used:** India's de-addiction helpline **14446** — the Ministry of Social Justice and Empowerment's own homepage (socialjustice.gov.in) lists «National Deaddication Helpline- 14446», but its hours and cost aren't stated there, and the helpline's site, nmba.dosje.gov.in, returned a server error (HTTP 500) on 2026-10-17. Only the number and purpose are confirmed. Don't use it until the CEO window or the wave confirms the rest on nmba.dosje.gov.in. **Dropped:** KIRAN (1800-599-0019) and NGO lines — not checked on their own sites, so not used.

So on a hi page **never write "988 पर कॉल या टेक्स्ट करें" alone** — a reader in India can't reach 988 at all, and a Hindi speaker who texts 988 gets English. India first, then North America. Use these, word for word:

| English | Hindi |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | क्या आप इस समय संकट में हैं? भारत में टेली मानस को 14416 या 1-800-891-4416 पर कॉल करें (टोल-फ़्री, 24 घंटे, सातों दिन), और जान को ख़तरा हो तो 112 पर। अमेरिका और कनाडा में 988 पर कॉल करें और हिंदी दुभाषिए के लिए कहें। आप अकेले नहीं हैं। |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | अगर आप संकट में हैं, तो भारत में टेली मानस को 14416 या 1-800-891-4416 पर कॉल करें (टोल-फ़्री, 24 घंटे), और जान को ख़तरा हो तो 112 पर; अमेरिका और कनाडा में 988 (Suicide & Crisis Lifeline) पर कॉल करें और हिंदी दुभाषिए के लिए कहें। |
| In crisis? Call or text 988 — free, 24/7, confidential. | संकट में हैं? भारत में टेली मानस को 14416 या 1-800-891-4416 पर कॉल करें — टोल-फ़्री, 24 घंटे, सातों दिन; जान को ख़तरा हो तो 112। अमेरिका और कनाडा में 988 पर कॉल करें और हिंदी दुभाषिए के लिए कहें। |
| …988 inside a longer sentence | «988 (अमेरिका और कनाडा में; फ़ोन पर, हिंदी दुभाषिए के लिए कहें)» and, where the sentence has room, «भारत में टेली मानस: 14416» |
| 988 Crisis Lifeline (a button/link) | 988 क्राइसिस लाइफ़लाइन (अमेरिका और कनाडा) |
| Call 911 / go to the emergency room | आपातकालीन नंबर पर कॉल करें (भारत में 112, अमेरिका और कनाडा में 911) / नज़दीकी अस्पताल के आपातकालीन विभाग (इमरजेंसी) में जाएँ |
| free, 24/7, confidential (of 988) | निःशुल्क, 24 घंटे, गोपनीय — say "confidential" of 988 only; Tele MANAS's site doesn't say it of calls, so don't add it there |
| toll-free, 24/7 (of Tele MANAS) | टोल-फ़्री, 24 घंटे, सातों दिन |
| detox / medical detox | डिटॉक्स / डॉक्टर की देखरेख में डिटॉक्स (नशा-मुक्ति वार्ड) [ours] |
| withdrawal / alcohol withdrawal / withdrawal symptoms | शराब छोड़ने पर होने वाले लक्षण / अल्कोहल विड्रॉल / विड्रॉल के लक्षण [ours] |
| withdrawal can be dangerous — even fatal | अचानक शराब छोड़ना ख़तरनाक हो सकता है — जानलेवा भी [ours] |
| not medical advice | यह चिकित्सा सलाह नहीं है |
| treatment / treatment center / rehab | इलाज / ट्रीटमेंट सेंटर (नशा-मुक्ति केंद्र) / रिहैब |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988; it's a `tel:988` link; add no link to 14416, since there's no placeholder for it). Every crisis/988/detox/withdrawal segment is read by the super. `i18n/hi/core.json` has the three footer/home/app crisis segments already written this way: copy them.

## Fellowships and books
| English | Hindi |
|---|---|
| Alcoholics Anonymous | **अल्कोहॉलिक्स एनॉनिमस** [aapune, throughout]; Pune's Preamble glosses it once as «अर्थात् अनाम शराबी» — don't add the gloss elsewhere |
| A.A. (the abbreviation) | **AA**, Latin capitals, no periods: «AA की मीटिंग», «AA क्या है?», «AA के सदस्य», «AA समूह» [aapune body text, throughout]. Pune also prints «A.A.» and «ए.ए.» in headings («ए.ए. प्रस्तावना»); we use one form, AA. As a subject it takes masculine singular: «AA अपनी एकता कैसे बनाए रखता है» [aapune]. Keep the periods only in English proper names: A.A. World Services, Inc.; A.A. Grapevine, Inc.; A.A.W.S. |
| the fellowship (A.A.'s) | **संगति** [aapune Preamble: «लोगों की एक संगति है», «इस संगति में शामिल होने की…»]; Pune also says «फेलोशिप» («AA फेलोशिप», «पुणे फेलोशिप»). A.A. as a fellowship → संगति. The nine fellowships in the directory, and "a fellowship" in general → **फेलोशिप** (plural unchanged: «9 फेलोशिप») |
| a member / members | सदस्य [aapune] |
| alcoholic | **शराबी** [aapune: «क्या मैं शराबी हूँ?», «दूसरे शराबियों से जुड़े रहने»]. It's A.A.'s word for us; don't soften it to «शराब पीने वाला» |
| alcoholism | शराब की लत [aapune: «शराब की लत से उबरने»]; "the disease" → शराब की बीमारी [aapune: «शराब की बीमारी»] |
| Narcotics Anonymous / N.A. | नारकोटिक्स एनॉनिमस (NA) — the name only; never its literature |
| Cocaine Anonymous / Crystal Meth Anonymous / Gamblers Anonymous / Sex Addicts Anonymous | कोकेन एनॉनिमस (CA) / क्रिस्टल मेथ एनॉनिमस (CMA) / गैम्बलर्स एनॉनिमस (GA) / सेक्स एडिक्ट्स एनॉनिमस (SAA) [ours, transliterated] |
| Recovery Dharma, SMART Recovery, Celebrate Recovery | names stay in Latin (RD, CR) |
| Al-Anon / Alateen | अल-एनॉन / अलाटीन [ours] |
| the Big Book | **बिग बुक** [ours]; feminine: «पूरी बिग बुक», «बिग बुक का», «बिग बुक में». Its title: «Alcoholics Anonymous» — Pune names the book in Latin: «“Alcoholics Anonymous” नामक पुस्तक» [aapune]; follow it |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i>, चौथा संस्करण (अंग्रेज़ी) |
| Twelve Steps and Twelve Traditions ("12 & 12") — only when the English names the book | «Twelve Steps and Twelve Traditions» (“ट्वेल्व एंड ट्वेल्व”) [ours] — never a source; don't translate the title into a Hindi one that looks like ours |
| Daily Reflections | «Daily Reflections» (AA की दैनिक चिंतन पुस्तक) [ours; no Hindi edition found] |
| As Bill Sees It / Living Sober / Came to Believe / "Pass It On" / Dr. Bob and the Good Oldtimers / A.A. Comes of Age / The Language of the Heart / The Best of Bill | keep the English title in Latin, in “…”, with a Hindi gloss once if the sentence needs it [ours] |
| This is A.A. / A Newcomer Asks / The A.A. Group / Questions & Answers on Sponsorship / Is A.A. for You? / 44 Questions | same: English title in Latin. Exception: "Is A.A. for You?" as a question in running text → «क्या AA आपके लिए है?» [ours] |
| A.A.'s Legacy of Service (P-44) | «A.A.'s Legacy of Service» (A.A.W.S. sells it in Hindi, HINDP-44, but we couldn't read its Hindi title) |
| Grapevine / La Viña | “Grapevine” / “La Viña” |
| the A.A. Preamble | AA प्रस्तावना [aapune: «ए.ए. प्रस्तावना», with AA in our form] (text below) |
| the Promises | वादे («बिग बुक के वादे») [ours] |
| the General Service Office (India) / GSO New York | जनरल सर्विस ऑफिस (GSO) [aapune] / जनरल सर्विस ऑफिस, न्यूयॉर्क [aapune: «जनरल सर्विस ऑफिस, न्यूयॉर्क», «जी.एस.ओ. न्यूयॉर्क»] |

### Big Book chapters
No A.A. Hindi chapter titles are online; all are **[ours]**, fixed here.
| English | Hindi |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | पहले संस्करण की भूमिका (दूसरे, तीसरे, चौथे संस्करण की भूमिका) — "Foreword" is «भूमिका», never «प्रस्तावना», which is the Preamble |
| The Doctor's Opinion | डॉक्टर की राय |
| 1 Bill's Story | बिल की कहानी |
| 2 There Is a Solution | एक समाधान है |
| 3 More About Alcoholism | शराब की लत के बारे में और |
| 4 We Agnostics | हम अज्ञेयवादी |
| 5 How It Works | यह कैसे काम करता है |
| 6 Into Action | अमल में |
| 7 Working with Others | दूसरों के साथ काम |
| 8 To Wives | पत्नियों से |
| 9 The Family Afterward | उसके बाद परिवार |
| 10 To Employers | नियोक्ताओं से |
| 11 A Vision for You | आपके लिए एक दृष्टि |
| Personal Stories – Part I / II / III | निजी कहानियाँ – भाग I / II / III |
| Appendices / I The A.A. Tradition / II Spiritual Experience / III The Medical View / IV The Lasker Award / V The Religious View / VI How to Get in Touch / VII Twelve Concepts | परिशिष्ट / I AA परंपरा / II आध्यात्मिक अनुभव / III चिकित्सा का दृष्टिकोण / IV लास्कर पुरस्कार / V धार्मिक दृष्टिकोण / VI संपर्क कैसे करें / VII बारह संकल्पनाएँ |
| Chapter 3 – More About Alcoholism | अध्याय 3 – शराब की लत के बारे में और (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | Hindi |
|---|---|
| meeting / meetings | **मीटिंग** / **मीटिंग्स** [aapune: «आज की मीटिंग्स», «AA की मीटिंग में शामिल होने»; `schedule.js`: `meeting: 'मीटिंग', meetings: 'मीटिंग्स'`]; feminine: «मीटिंग होती है» |
| the rooms | मीटिंग्स («वापस मीटिंग्स की ओर») [ours]; «कमरे» only where the English means an actual room |
| open / closed meeting | खुली मीटिंग / बंद मीटिंग [ours] |
| online meeting / hospital meeting | ऑनलाइन मीटिंग / हॉस्पिटल मीटिंग [aapune: «हॉस्पिटल मीटिंग्स»] |
| group | **समूह** [aapune: «सभी समूह», «AA समूहों»]; "A.A. group" «AA समूह» |
| home group | होम ग्रुप [ours; cf. aapune's «मदर ग्रुप» for the Mother Group] |
| group conscience | समूह विवेक [ours]; Tradition 2: «हमारे समूह विवेक में» |
| intergroup / district / area | इंटरग्रुप [aapune `schedule.js`] / ज़िला [ours] / एरिया [ours] |
| sharing / to share | अनुभव बाँटना / साझा करना [aapune: «साझा अवश्य करते हैं»; «अपने व्यक्तिगत अनुभव एक-दूसरे को बताते हैं»] |
| sponsor / sponsee / sponsorship | स्पॉन्सर / स्पॉन्सी / स्पॉन्सरशिप [ours] |
| newcomer | नए सदस्य (adjectival: «AA में नए हैं?» [aapune]); as a noun «नवागंतुक» [ours] |
| old-timer | पुराने सदस्य [ours] |
| sobriety / sober / to get sober / stay sober | **संयम** [aapune: «संयम (नशामुक्ति)», «स्थायी संयम प्राप्त किया»] / संयम में, शराब से दूर [aapune: «शराब से दूर रहते हैं»] / संयम पाना / संयम में रहना, शराब से दूर रहना. "3+ years sober" → «3 साल से ज़्यादा समय से संयम में». "Years Sober" (a stat label) → «संयम के वर्ष» |
| abstinence | परहेज़ [ours] |
| recovery / to recover | **रिकवरी** (noun) [aapune: «सुधार (रिकवरी) कार्यक्रम»] / **उबरना** (verb) [aapune: «शराब की लत से उबरने में मदद»]; Tradition 1's "personal recovery" «व्यक्तिगत रिकवरी» |
| the program | कार्यक्रम, AA कार्यक्रम [aapune: «AA के… कार्यक्रम»] |
| relapse / slip | फिर से पीना (स्लिप) [ours] |
| the Steps / Step One / Twelfth Step work | **चरण** [aapune: «बारह चरणों (Twelve Steps)»] / पहला चरण (चरण 1) / बारहवें चरण का काम, संदेश पहुँचाना; "12-step fellowship" «12-चरणों वाली फेलोशिप»; "step work" «चरणों पर काम». Reserve चरण for A.A.'s Steps; "practical steps" in general prose is «क़दम» |
| the Traditions / the Concepts | **परंपराएँ** [aapune: «बारह परंपराएँ»] (परंपरा 1, पहली परंपरा) / **संकल्पनाएँ** [ours] («विश्व सेवा के लिए बारह संकल्पनाएँ») |
| inventory / moral inventory / personal inventory | लेखा-जोखा / नैतिक लेखा-जोखा / व्यक्तिगत लेखा-जोखा [ours; Steps 4, 10] |
| resentment | नाराज़गी, मन में बैठी कड़वाहट [ours] |
| defects of character / shortcomings | चरित्र-दोष [ours; Step 6] / कमियाँ [ours; Step 7] |
| the exact nature of our wrongs | अपनी ग़लतियों का सटीक स्वरूप [ours; Step 5] |
| amends / make amends | भरपाई / भरपाई करना [ours; Steps 8–9] |
| Higher Power | उच्चतर शक्ति [ours]; Step 2's own phrase: «हमसे बड़ी एक शक्ति» |
| God as we understood Him | ईश्वर, जैसा हम उन्हें समझते थे [ours; Steps 3, 11] — "as you understand Him" «जैसा आप उन्हें समझते हैं» |
| spiritual awakening | आध्यात्मिक जागृति [ours; Step 12] |
| powerless over alcohol / unmanageable | शराब के आगे शक्तिहीन / बेकाबू [ours; Step 1] |
| restore us to sanity | हमारा मानसिक संतुलन लौटा सकती है [ours; Step 2] |
| conscious contact with God | ईश्वर से सचेत संपर्क [ours; Step 11] |
| carry the message | संदेश पहुँचाना [aapune: «आशा का संदेश पहुँचाने»] |
| the alcoholic who still suffers | वह शराबी जो अब भी पीड़ा में है [ours; Tradition 5] |
| primary purpose | प्राथमिक उद्देश्य [aapune: «AA का प्राथमिक उद्देश्य»] |
| self-supporting / the Seventh Tradition | आत्मनिर्भर [aapune: «AA अपने स्वयं के योगदान से आत्मनिर्भर है»] / सातवीं परंपरा; the collection: «सातवीं परंपरा का योगदान» [ours] |
| contributions / dues or fees | योगदान [aapune] / शुल्क या चंदा [ours; aapune's Preamble has «शुल्क या वर्गणी», but वर्गणी is Marathi, not Hindi] |
| trusted servants | विश्वसनीय सेवक [ours; Tradition 2] |
| principles before personalities | व्यक्तित्वों से ऊपर सिद्धांत [ours; Tradition 12] |
| attraction rather than promotion | प्रचार नहीं, आकर्षण [ours; Tradition 11] |
| outside issues | बाहरी मुद्दे [ours; Tradition 10] |
| anonymity / anonymous | **अनामिता** [ours] / अनाम [aapune: «अनाम शराबी»] |
| surrender / half measures / rigorous honesty | समर्पण / आधे-अधूरे उपाय / पूरी ईमानदारी [ours] |
| cunning, baffling, powerful | धूर्त, चकरा देने वाली, ताक़तवर [ours; p. 58–59, of alcohol (feminine: शराब)] |
| General Service Board / trustees / General Service Conference | जनरल सर्विस बोर्ड / ट्रस्टी / जनरल सर्विस कॉन्फ़्रेंस [ours, on aapune's «जनरल सर्विस ऑफिस» pattern] |
| the Right of Decision / Participation / Appeal / Petition | “निर्णय का अधिकार” / “भागीदारी का अधिकार” / “अपील का अधिकार” / “याचिका का अधिकार” [ours; Concepts 3–5] |
| group service representative (GSR) / treasurer / secretary / delegate | GSR (समूह सेवा प्रतिनिधि) / कोषाध्यक्ष / सचिव / डेलीगेट [ours] |
| the Oxford Group | ऑक्सफ़र्ड ग्रुप |
| the Third Step prayer / Seventh Step prayer | तीसरे चरण की प्रार्थना / सातवें चरण की प्रार्थना [ours] |
| Founders Day (India, 5 May) | संस्थापक दिवस [aapune: «“संस्थापक दिवस” (Founders Day)»] |

## The Twelve Steps — [ours], not A.A.'s Hindi
A.A. India prints the Hindi Steps (in its Hindi Big Book and pamphlets); we couldn't find them online anywhere an A.A. body publishes, so this is **ours**, translated from A.A.'s English (SMF-121; Big Book pp. 59–60). Use it word for word wherever a Step appears; a Step quoted in part uses these words, cut, not reworded.
1. हमने स्वीकार किया कि हम शराब के आगे शक्तिहीन थे — कि हमारा जीवन बेकाबू हो गया था।
2. हमें विश्वास हो गया कि हमसे बड़ी एक शक्ति हमारा मानसिक संतुलन लौटा सकती है।
3. हमने अपनी इच्छा और अपना जीवन ईश्वर की देखरेख में सौंपने का निर्णय लिया — ईश्वर, जैसा हम उन्हें समझते थे।
4. हमने अपना गहन और निर्भीक नैतिक लेखा-जोखा तैयार किया।
5. हमने ईश्वर के सामने, स्वयं के सामने और किसी दूसरे मनुष्य के सामने अपनी ग़लतियों का सटीक स्वरूप स्वीकार किया।
6. हम पूरी तरह तैयार हो गए कि ईश्वर हमारे ये सारे चरित्र-दोष दूर कर दें।
7. हमने विनम्रतापूर्वक उनसे अपनी कमियाँ दूर करने की प्रार्थना की।
8. हमने उन सब लोगों की सूची बनाई जिन्हें हमने नुक़सान पहुँचाया था, और हम उन सबकी भरपाई करने के लिए राज़ी हो गए।
9. जहाँ भी संभव था, हमने ऐसे लोगों की सीधे भरपाई की, सिवाय उन स्थितियों के जहाँ ऐसा करने से उन्हें या दूसरों को चोट पहुँचती।
10. हम अपना व्यक्तिगत लेखा-जोखा करते रहे, और जब भी हम ग़लत थे, हमने तुरंत इसे स्वीकार किया।
11. हमने प्रार्थना और ध्यान के ज़रिए ईश्वर से — जैसा हम उन्हें समझते थे — अपना सचेत संपर्क बेहतर बनाने का प्रयास किया, और केवल यही प्रार्थना की कि हमें हमारे लिए उनकी इच्छा का ज्ञान हो और उसे पूरा करने की शक्ति मिले।
12. इन चरणों के परिणामस्वरूप आध्यात्मिक जागृति पाकर, हमने यह संदेश शराबियों तक पहुँचाने और अपने सभी कार्यों में इन सिद्धांतों का पालन करने का प्रयास किया।

**Honest wording on the /12-steps/ page** (and anywhere the English says the Steps are "A.A.'s own wording", "word for word", "exactly as they appear"): in Hindi that would be untrue. Say what's true, in the same place: «बारह चरण हमारे अपने हिंदी अनुवाद में हैं, AA के अंग्रेज़ी पाठ (<i>Alcoholics Anonymous</i>, चौथा संस्करण, पृ. 59–60) से। AA इंडिया का अपना हिंदी पाठ उसके छपे हिंदी साहित्य में है।» Keep the English's placeholders and page numbers. Note it in your close.

## The Twelve Traditions, short form — [ours]
Translated from A.A.'s English (Big Book pp. 561–562). Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the Hindi at the matching point; `i18n/hi/core.json` (the /aa-info/ page) has all twelve already cut — copy them.
1. हमारा साझा कल्याण सबसे पहले आना चाहिए; व्यक्तिगत रिकवरी AA की एकता पर निर्भर है।
2. हमारे समूह के उद्देश्य के लिए केवल एक ही परम सत्ता है — एक प्रेममय ईश्वर, जिस रूप में वे हमारे समूह विवेक में स्वयं को व्यक्त करें। हमारे नेता केवल विश्वसनीय सेवक हैं; वे शासन नहीं करते।
3. AA सदस्यता की एकमात्र शर्त शराब पीना छोड़ने की इच्छा है।
4. हर समूह स्वायत्त होना चाहिए, सिवाय उन मामलों के जो दूसरे समूहों को या समूचे AA को प्रभावित करते हैं।
5. हर समूह का केवल एक ही प्राथमिक उद्देश्य है — अपना संदेश उस शराबी तक पहुँचाना जो अब भी पीड़ा में है।
6. किसी AA समूह को कभी भी किसी संबंधित संस्था या बाहरी उद्यम का समर्थन नहीं करना चाहिए, न उसे पैसा देना चाहिए और न उसे AA का नाम देना चाहिए, ताकि पैसे, संपत्ति और प्रतिष्ठा की समस्याएँ हमें हमारे प्राथमिक उद्देश्य से भटका न दें।
7. हर AA समूह को पूरी तरह आत्मनिर्भर होना चाहिए, और बाहरी योगदान अस्वीकार करने चाहिए।
8. अल्कोहॉलिक्स एनॉनिमस को सदा ग़ैर-पेशेवर रहना चाहिए, लेकिन हमारे सेवा केंद्र विशेष कर्मचारी रख सकते हैं।
9. AA को, अपने आप में, कभी भी संगठित नहीं किया जाना चाहिए; लेकिन हम ऐसे सेवा बोर्ड या समितियाँ बना सकते हैं जो सीधे उन लोगों के प्रति उत्तरदायी हों जिनकी वे सेवा करते हैं।
10. अल्कोहॉलिक्स एनॉनिमस बाहरी मुद्दों पर कोई राय नहीं रखता; इसलिए AA का नाम कभी भी सार्वजनिक विवाद में नहीं घसीटा जाना चाहिए।
11. हमारी जनसंपर्क नीति प्रचार पर नहीं, आकर्षण पर आधारित है; हमें प्रेस, रेडियो और फ़िल्मों के स्तर पर सदा व्यक्तिगत अनामिता बनाए रखनी चाहिए।
12. अनामिता हमारी सभी परंपराओं की आध्यात्मिक नींव है, जो हमें सदा याद दिलाती है कि हम व्यक्तित्वों से ऊपर सिद्धांतों को रखें।

## The Twelve Traditions, long form — [ours]
Translated from A.A.'s English, Big Book pp. 563–566. Use it word for word wherever a long-form Tradition, or a sentence from one, appears.
1. अल्कोहॉलिक्स एनॉनिमस का हर सदस्य एक बड़े पूरे का केवल एक छोटा-सा हिस्सा है। AA को जीवित रहना ही होगा, वरना हममें से ज़्यादातर लोग निश्चित ही मर जाएँगे। इसलिए हमारा साझा कल्याण सबसे पहले आता है। लेकिन हर व्यक्ति का कल्याण उसके ठीक बाद आता है।
2. हमारे समूह के उद्देश्य के लिए केवल एक ही परम सत्ता है — एक प्रेममय ईश्वर, जिस रूप में वे हमारे समूह विवेक में स्वयं को व्यक्त करें।
3. हमारी सदस्यता में वे सभी शामिल होने चाहिए जो शराब की लत से पीड़ित हैं। इसलिए हम किसी ऐसे व्यक्ति को मना नहीं कर सकते जो उबरना चाहता है। न ही AA की सदस्यता कभी पैसे पर या किसी के अनुरूप ढलने पर निर्भर होनी चाहिए। संयम के लिए एक साथ जुटे कोई भी दो या तीन शराबी स्वयं को AA समूह कह सकते हैं, बशर्ते कि एक समूह के रूप में उनका कोई और जुड़ाव न हो।
4. अपने ख़ुद के मामलों में हर AA समूह अपने विवेक के अलावा किसी और सत्ता के प्रति उत्तरदायी नहीं होना चाहिए। लेकिन जब उसकी योजनाएँ पड़ोसी समूहों के कल्याण से भी जुड़ी हों, तो उन समूहों से सलाह ली जानी चाहिए। और किसी भी समूह, क्षेत्रीय समिति या व्यक्ति को जनरल सर्विस बोर्ड के ट्रस्टियों से विचार-विमर्श किए बिना कभी कोई ऐसा क़दम नहीं उठाना चाहिए जो समूचे AA पर गहरा असर डाल सकता हो। ऐसे मामलों में हमारा साझा कल्याण सर्वोपरि है।
5. अल्कोहॉलिक्स एनॉनिमस का हर समूह एक आध्यात्मिक इकाई होना चाहिए, जिसका केवल एक ही प्राथमिक उद्देश्य हो — अपना संदेश उस शराबी तक पहुँचाना जो अब भी पीड़ा में है।
6. पैसे, संपत्ति और सत्ता की समस्याएँ हमें हमारे प्राथमिक आध्यात्मिक लक्ष्य से आसानी से भटका सकती हैं। इसलिए हमारा मानना है कि AA के लिए वास्तव में उपयोगी कोई भी बड़ी संपत्ति अलग से निगमित और प्रबंधित होनी चाहिए, ताकि भौतिक को आध्यात्मिक से अलग रखा जा सके। एक AA समूह को, अपने आप में, कभी कोई व्यवसाय नहीं करना चाहिए। AA की सहायक संस्थाएँ, जैसे क्लब या अस्पताल, जिन्हें बहुत संपत्ति या प्रशासन की ज़रूरत होती है, निगमित होनी चाहिए और इस तरह अलग रखी जानी चाहिए कि ज़रूरत पड़ने पर समूह उन्हें आज़ादी से छोड़ सकें। इसलिए ऐसी संस्थाओं को AA का नाम इस्तेमाल नहीं करना चाहिए। उनका प्रबंधन पूरी तरह उन्हीं लोगों की ज़िम्मेदारी होना चाहिए जो उन्हें आर्थिक सहारा देते हैं। क्लबों के लिए आमतौर पर AA के प्रबंधक ही पसंद किए जाते हैं। लेकिन अस्पताल, और स्वास्थ्य-लाभ की दूसरी जगहें भी, AA से पूरी तरह बाहर होनी चाहिए — और चिकित्सकीय देखरेख में। एक AA समूह किसी के भी साथ सहयोग कर सकता है, लेकिन ऐसा सहयोग कभी भी इतना आगे नहीं जाना चाहिए कि वह जुड़ाव या समर्थन बन जाए, चाहे वास्तविक हो या निहित। एक AA समूह स्वयं को किसी से नहीं बाँध सकता।
7. AA समूहों का ख़र्च पूरी तरह उनके अपने सदस्यों के स्वैच्छिक योगदान से चलना चाहिए। हमारा मानना है कि हर समूह को जल्द ही यह आदर्श पा लेना चाहिए; कि अल्कोहॉलिक्स एनॉनिमस के नाम का इस्तेमाल करके जनता से धन जुटाना बहुत ख़तरनाक है, चाहे समूह करें, क्लब, अस्पताल या कोई और बाहरी संस्था; कि किसी भी स्रोत से बड़े दान लेना, या ऐसे योगदान लेना जिनके साथ कोई भी शर्त जुड़ी हो, नासमझी है। इसके अलावा, हम AA के उन कोषों को भी बड़ी चिंता से देखते हैं जो समझदारी भरे आरक्षित धन से आगे, बिना किसी तय AA उद्देश्य के, धन जमा करते चले जाते हैं। अनुभव ने हमें बार-बार चेताया है कि संपत्ति, पैसे और सत्ता को लेकर व्यर्थ के झगड़ों जितनी निश्चितता से हमारी आध्यात्मिक विरासत को और कुछ नष्ट नहीं कर सकता।
8. अल्कोहॉलिक्स एनॉनिमस को सदा ग़ैर-पेशेवर रहना चाहिए। पेशेवर होने से हमारा अर्थ है फ़ीस या मेहनताने के बदले शराबियों को परामर्श देने का धंधा। लेकिन हम शराबियों को वहाँ नौकरी पर रख सकते हैं जहाँ वे ऐसी सेवाएँ देंगे जिनके लिए वरना हमें ग़ैर-शराबियों को रखना पड़ता। ऐसी विशेष सेवाओं का अच्छा पारिश्रमिक दिया जा सकता है। लेकिन हमारा सामान्य AA “बारहवें चरण” का काम कभी भी पैसे लेकर नहीं किया जाना है।
9. हर AA समूह को कम से कम संभव संगठन की ज़रूरत है। बारी-बारी से बदलता नेतृत्व सबसे अच्छा है। छोटा समूह अपना सचिव चुन सकता है, बड़ा समूह बारी-बारी से बदलने वाली अपनी समिति, और किसी बड़े महानगर के समूह अपनी केंद्रीय या इंटरग्रुप समिति, जो अक्सर पूरे समय का एक सचिव रखती है। जनरल सर्विस बोर्ड के ट्रस्टी, असल में, हमारी AA जनरल सर्विस कमेटी हैं। वे हमारी AA परंपरा के संरक्षक हैं और AA के उन स्वैच्छिक योगदानों को प्राप्त करते हैं जिनसे हम न्यूयॉर्क में अपना AA जनरल सर्विस ऑफिस चलाते हैं। समूहों ने उन्हें हमारे समूचे जनसंपर्क को संभालने का अधिकार दिया है, और वे हमारे प्रमुख पत्र, “A.A. Grapevine”, की विश्वसनीयता की गारंटी देते हैं। ऐसे सभी प्रतिनिधियों को सेवा की भावना से मार्गदर्शन लेना है, क्योंकि AA में सच्चे नेता पूरी संगति के केवल विश्वसनीय और अनुभवी सेवक होते हैं। उन्हें अपने पदों से कोई वास्तविक अधिकार नहीं मिलता; वे शासन नहीं करते। सबका सम्मान ही उनकी उपयोगिता की कुंजी है।
10. किसी भी AA समूह या सदस्य को कभी भी ऐसे ढंग से, जिससे AA उसमें घसीटा जाए, बाहरी विवादित मुद्दों पर कोई राय व्यक्त नहीं करनी चाहिए — ख़ास तौर पर राजनीति, शराब-सुधार या सांप्रदायिक धर्म से जुड़े मुद्दों पर। अल्कोहॉलिक्स एनॉनिमस के समूह किसी का विरोध नहीं करते। ऐसे मामलों पर वे कोई भी विचार व्यक्त नहीं कर सकते।
11. आम जनता के साथ हमारे संबंधों की पहचान व्यक्तिगत अनामिता होनी चाहिए। हमारा मानना है कि AA को सनसनीखेज़ विज्ञापन से बचना चाहिए। AA सदस्यों के रूप में हमारे नाम और तस्वीरें प्रसारित, फ़िल्माई या सार्वजनिक रूप से छापी नहीं जानी चाहिए। हमारे जनसंपर्क का मार्गदर्शन प्रचार के नहीं, आकर्षण के सिद्धांत से होना चाहिए। अपनी तारीफ़ ख़ुद करने की कभी ज़रूरत नहीं है। हमें लगता है कि बेहतर यही है कि हमारे मित्र हमारी सिफ़ारिश करें।
12. और अंत में, हम अल्कोहॉलिक्स एनॉनिमस के लोग मानते हैं कि अनामिता के सिद्धांत का बहुत बड़ा आध्यात्मिक महत्त्व है। यह हमें याद दिलाता है कि हमें व्यक्तित्वों से ऊपर सिद्धांतों को रखना है; कि हमें वास्तव में सच्ची विनम्रता का अभ्यास करना है। यह सब इसलिए, ताकि हमें मिले बड़े आशीर्वाद हमें कभी बिगाड़ न दें; ताकि हम सदा उनके कृतज्ञ चिंतन में जिएँ जो हम सबके अधिष्ठाता हैं।

Tradition 3's clause, quoted all over the site: **«बशर्ते कि एक समूह के रूप में उनका कोई और जुड़ाव न हो»**. Tradition 6's: «एक AA समूह स्वयं को किसी से नहीं बाँध सकता», «ऐसा सहयोग कभी भी इतना आगे नहीं जाना चाहिए कि वह जुड़ाव या समर्थन बन जाए, चाहे वास्तविक हो या निहित». Where the English splits a long-form Tradition into several segments, split the Hindi at the matching sentence.

**On the /12-traditions/ page** (and anywhere the English says the Traditions are printed "word for word, exactly as they appear in Alcoholics Anonymous"): in Hindi that would be untrue for both forms. Say what's true, in the same place: «दोनों रूप हमारे अपने हिंदी अनुवाद में हैं, <i>Alcoholics Anonymous</i>, चौथा संस्करण (अंग्रेज़ी) से: संक्षिप्त रूप पृ. 561–562, पूर्ण रूप पृ. 563–566।» Keep the English's placeholders and page numbers; the rest of the sentence (published unaltered, cited) is translated as it stands. Note it in your close.

## The Twelve Concepts, short form — [ours]
The English site prints the world Concepts (General Service Conference, General Service Board), first sentence only for 7–12. No A.A. Hindi is online. All twelve are in `i18n/hi/core.json` (the /aa-info/ page); use exactly those sentences wherever a Concept is quoted:
1. AA की विश्व सेवाओं का अंतिम उत्तरदायित्व और परम अधिकार सदा हमारी पूरी संगति के सामूहिक विवेक में निहित होना चाहिए।
2. AA की जनरल सर्विस कॉन्फ़्रेंस लगभग हर व्यावहारिक अर्थ में, विश्व मामलों में हमारे पूरे समाज की सक्रिय आवाज़ और प्रभावी विवेक बन गई है।
3. प्रभावी नेतृत्व सुनिश्चित करने के लिए, हमें AA के हर अंग को — कॉन्फ़्रेंस, जनरल सर्विस बोर्ड और उसके सेवा निगमों, स्टाफ़, समितियों और अधिकारियों को — पारंपरिक “निर्णय का अधिकार” देना चाहिए।
4. सभी उत्तरदायी स्तरों पर हमें पारंपरिक “भागीदारी का अधिकार” बनाए रखना चाहिए, जिससे हर किसी को उस उत्तरदायित्व के उचित अनुपात में मतदान-प्रतिनिधित्व मिले जो उसे निभाना है।
5. हमारी पूरी संरचना में पारंपरिक “अपील का अधिकार” लागू रहना चाहिए, ताकि अल्पमत की राय सुनी जाए और व्यक्तिगत शिकायतों पर सावधानी से विचार हो।
6. कॉन्फ़्रेंस मानती है कि विश्व सेवा के अधिकांश मामलों में मुख्य पहल और सक्रिय उत्तरदायित्व कॉन्फ़्रेंस के उन ट्रस्टी सदस्यों द्वारा निभाया जाना चाहिए जो जनरल सर्विस बोर्ड के रूप में काम करते हैं।
7. जनरल सर्विस बोर्ड का चार्टर और उपनियम क़ानूनी दस्तावेज़ हैं, जो ट्रस्टियों को विश्व सेवा के मामलों का प्रबंधन और संचालन करने का अधिकार देते हैं।
8. ट्रस्टी समग्र नीति और वित्त के प्रमुख योजनाकार और प्रशासक हैं।
9. सभी स्तरों पर अच्छा सेवा-नेतृत्व हमारे भविष्य के कामकाज और सुरक्षा के लिए अनिवार्य है।
10. हर सेवा-उत्तरदायित्व के साथ उतना ही सेवा-अधिकार होना चाहिए।
11. ट्रस्टियों के पास सदा सर्वोत्तम संभव समितियाँ, कॉर्पोरेट सेवा निदेशक, अधिकारी, स्टाफ़ और सलाहकार होने चाहिए।
12. कॉन्फ़्रेंस AA परंपरा की भावना का पालन करेगी, और ध्यान रखेगी कि वह कभी ख़तरनाक धन या सत्ता का केंद्र न बने।

Where the /12-concepts/ page quotes more of a Concept than this, translate the rest faithfully yourself [ours] and keep these first sentences. Any "verbatim / A.A.'s official wording" claim about the Concepts gets the same honest rewording: «हमारे अपने हिंदी अनुवाद में, AA के अंग्रेज़ी पाठ से».

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer** [ours]: «हे ईश्वर, मुझे वह शांति दीजिए कि मैं उन बातों को स्वीकार कर सकूँ जिन्हें मैं बदल नहीं सकता, वह साहस दीजिए कि मैं उन बातों को बदल सकूँ जिन्हें मैं बदल सकता हूँ, और वह विवेक दीजिए कि मैं इन दोनों का अंतर पहचान सकूँ।»
- **Third Step prayer** (English p. 63) [ours]: «हे ईश्वर, मैं स्वयं को आपको अर्पित करता हूँ — कि आप मेरे साथ निर्माण करें और मेरे साथ वैसा ही करें जैसा आप चाहें। मुझे अहं के बंधन से मुक्त कीजिए, ताकि मैं आपकी इच्छा का बेहतर पालन कर सकूँ। मेरी कठिनाइयाँ दूर कीजिए, ताकि उन पर मिली विजय उन लोगों के सामने, जिनकी मैं मदद करना चाहूँ, आपकी शक्ति, आपके प्रेम और आपके जीवन-मार्ग की गवाही दे। मैं सदा आपकी इच्छा का पालन करूँ!»
- **Seventh Step prayer** (English p. 76) [ours]: «हे मेरे सृष्टिकर्ता, अब मैं राज़ी हूँ कि आप मुझे पूरा का पूरा — अच्छा और बुरा — अपना लें। मैं प्रार्थना करता हूँ कि आप अब मुझसे मेरा हर एक चरित्र-दोष दूर कर दें, जो आपके और मेरे साथियों के लिए मेरे उपयोगी होने के रास्ते में खड़ा है। यहाँ से आगे बढ़ते हुए मुझे आपकी आज्ञा का पालन करने की शक्ति दीजिए। आमीन।»
  - If the English discusses a single phrase of the English prayer ("bondage of self", "My Creator", "every single defect"), quote the Hindi words that carry it («अहं के बंधन», «हे मेरे सृष्टिकर्ता», «हर एक चरित्र-दोष») and, where the point depends on the exact English word, add the English in brackets once: «(अंग्रेज़ी में “bondage of self”)».
  - «आमीन» keeps the English's "Amen". The CEO window may prefer to drop it or ask A.A. India (PREP-NOTES); until then, keep it.
- **The A.A. Preamble, as A.A. Pune prints it in Hindi** [aapune, `/about-aa`, word for word]: «अल्कोहॉलिक्स एनॉनिमस — अर्थात् अनाम शराबी — लोगों की एक संगति है। इस संगति के सदस्य अपने व्यक्तिगत अनुभव एक-दूसरे को बताते हैं, जिससे सभी सदस्यों का मानसिक धैर्य बढ़ता है और नए जीवन की आशा जागती है। इस प्रकार सदस्य अपने तथा दूसरों के प्रश्न हल करते हैं और शराब से दूर रहते हैं। इस संगति में शामिल होने की केवल एक ही शर्त है — शराब की बीमारी से मुक्त होने की इच्छा। संगति में शामिल होने के लिए कोई शुल्क या वर्गणी नहीं ली जाती। संगति किसी भी धर्म या सामाजिक अथवा राजनीतिक विचारधारा का प्रचार नहीं करती, और किसी भी धार्मिक, सामाजिक या राजनीतिक दल से इसका संबंध नहीं है। संगति का एकमात्र ध्येय है — स्वयं को शराब से दूर रखना और उन अन्य शराब-पीड़ित लोगों की मदद करना जो शराब से मुक्ति पाना चाहते हैं।» Use it **only** where the English is talking about how A.A. in India reads the Preamble (rare). It is not a translation of the A.A.W.S. Preamble.
- **The A.A. Preamble, A.A.W.S. wording** [ours] — use this wherever the English quotes the Preamble: «अल्कोहॉलिक्स एनॉनिमस ऐसे लोगों की संगति है जो एक-दूसरे के साथ अपना अनुभव, शक्ति और आशा बाँटते हैं, ताकि वे अपनी साझा समस्या हल कर सकें और दूसरों को शराब की लत से उबरने में मदद कर सकें। सदस्यता की एकमात्र शर्त शराब पीना छोड़ने की इच्छा है। AA की सदस्यता के लिए कोई शुल्क या चंदा नहीं है; हम अपने ही योगदान से आत्मनिर्भर हैं। AA किसी पंथ, संप्रदाय, राजनीति, संगठन या संस्था से जुड़ा नहीं है; किसी विवाद में नहीं पड़ना चाहता, और किसी भी उद्देश्य का न समर्थन करता है, न विरोध। हमारा प्राथमिक उद्देश्य संयम में रहना और दूसरे शराबियों को संयम पाने में मदद करना है।» If the English quotes an older form ("a fellowship of men and women"), translate the English faithfully («पुरुषों और महिलाओं की संगति») [ours].
- **Big Book lines.** No A.A. Hindi of any Big Book passage is online, so **translate faithfully yourself** and use the same Hindi each time the same English line comes back in your batch (search your file before you write it again). These recur on the site; use exactly:
  - p. 58: "Rarely have we seen a person fail who has thoroughly followed our path." → «हमने शायद ही कभी किसी ऐसे व्यक्ति को असफल होते देखा है जिसने पूरी लगन से हमारे रास्ते का पालन किया हो।»; "Half measures availed us nothing." → «आधे-अधूरे उपायों से हमें कुछ हासिल नहीं हुआ।»; "We stood at the turning point." → «हम निर्णायक मोड़ पर खड़े थे।»; "Here are the steps we took, which are suggested as a program of recovery:" → «ये वे चरण हैं जिन्हें हमने अपनाया, और जो रिकवरी के एक कार्यक्रम के रूप में सुझाए गए हैं:»
  - p. 417: "And acceptance is the answer to all my problems today." → «और आज मेरी सारी समस्याओं का जवाब स्वीकृति है।» (whole line in `core.json` 1b08a63f6559)
  - p. 164: "Road of Happy Destiny" → «सुखद नियति की राह» [ours]
  - p. 85: "a daily reprieve" → «रोज़ की मोहलत» [ours; a stay, not a pardon («माफ़ी»)]
- A prayer or fixed text quoted in part uses these words, cut, not reworded.
- A quote's credit line: the English "Alcoholics Anonymous, 4th Edition, page N. A short quote, for identification and study. Read the whole page in your own copy →" becomes «<i>Alcoholics Anonymous</i>, चौथा संस्करण (अंग्रेज़ी), पृष्ठ N; हमारा अनुवाद। पहचान और अध्ययन के लिए एक छोटा-सा उद्धरण। पूरा पृष्ठ अपनी प्रति में पढ़ें →». Keep the English's placeholders around the same words.

## Big Book quotes — look here first (wave hi1)
*Added 2026-10-18 by the hi1 Super (Opus 5.5). There is no Hindi Big Book online, so every line here is **[ours]**, translated once, faithfully and close to the English, so that every runner writes the same Hindi for the same passage. Each English line below was pulled by script from Derick's own copy of the 4th edition (Recoverystarts/aa-library `big-book/text/`), and its page was found the same way.*

**The rule, for every Big Book quote in your batch:**
1. **Look it up here first**, then in "Prayers and fixed texts" above. If the passage is here, use these words exactly. If the English quotes only part of a passage, cut the Hindi at the matching sentence or clause; never reword it.
2. **If it isn't here**, translate the English faithfully and closely: the same sentences, the same order, the same images, nothing smoothed or explained. Never paraphrase. List the id under `unsure:` as `BBQ <id>`, so a checker reads it.
3. **Same line, same Hindi**: before you write a quote, search your own file for it; if you've written it once, copy it.
4. Never take wording from the Twelve Steps and Twelve Traditions or from N.A., even if you know it. Never swap in Hindi page numbers.
5. **Never call this wording A.A.'s.** It is our translation from A.A.'s English; the page's note (build.mjs `OURS_NOTE`) says so. Where the English says a quote is "exactly as the book states it" or "word for word", use the honest wording given under the Steps, the Traditions (long form) and the Concepts above; for a Big Book quote, say it is our Hindi translation of the English 4th edition («हमारा हिंदी अनुवाद, अंग्रेज़ी चौथे संस्करण से»).
6. God takes the honorific (उन्हें, उनकी, «ईश्वर हैं»); the reader is «आप». The book's "alcohol" is feminine (शराब): «धूर्त, चकरा देने वाली, ताक़तवर».

**Ours, fixed so every page says it the same way:**
| p. | English | Hindi |
|---|---|---|
| 58 | Rarely have we seen a person fail who has thoroughly followed our path. | the line in "Prayers and fixed texts" above |
| 58 | Our stories disclose in a general way what we used to be like, what happened, and what we are like now. | हमारी कहानियाँ मोटे तौर पर बताती हैं कि हम पहले कैसे थे, क्या हुआ, और अब हम कैसे हैं। |
| 58 | If you have decided you want what we have and are willing to go to any length to get it—then you are ready to take certain steps. | अगर आपने तय कर लिया है कि आप वह चाहते हैं जो हमारे पास है, और उसे पाने के लिए आप किसी भी हद तक जाने को तैयार हैं — तो आप कुछ निश्चित क़दम उठाने के लिए तैयार हैं। |
| 59 | Half measures availed us nothing. | आधे-अधूरे उपायों से हमें कुछ हासिल नहीं हुआ। |
| 58–59 | Remember that we deal with alcohol—cunning, baf58 59 fling, powerful! Without help it is too much for us. But there is One who has all power—that One is God. May you find Him now! | याद रखिए कि हमारा सामना शराब से है — धूर्त, चकरा देने वाली, ताक़तवर! मदद के बिना यह हमारे बस से बाहर है। लेकिन एक हैं जिनके पास सारी शक्ति है — वह एक ईश्वर हैं। आप उन्हें अभी पा लें! |
| 59 | We stood at the turning point. We asked His protection and care with complete abandon. | हम निर्णायक मोड़ पर खड़े थे। हमने पूरे समर्पण के साथ उनसे सुरक्षा और देखभाल माँगी। |
| 59 | Here are the steps we took, which are suggested as a program of recovery: | ये वे चरण हैं जिन्हें हमने अपनाया, और जो रिकवरी के एक कार्यक्रम के रूप में सुझाए गए हैं: |
| 60 | Many of us exclaimed, “What an order! I can’t go through with it.’’ Do not be discouraged. | हममें से बहुतों ने कहा, “यह तो बहुत बड़ी माँग है! मुझसे यह नहीं हो पाएगा।” निराश न हों। |
| 60 | No one among us has been able to maintain anything like perfect adherence to these principles. We are not saints. | हममें से कोई भी इन सिद्धांतों का पूरी तरह पालन करने जैसा कुछ नहीं कर पाया है। हम संत नहीं हैं। |
| 60 | The point is, that we are willing to grow along spiritual lines. The principles we have set down are guides to progress. We claim spiritual progress rather than spiritual perfection. | मुद्दा यह है कि हम आध्यात्मिक राह पर आगे बढ़ने को तैयार हैं। हमने जो सिद्धांत रखे हैं, वे प्रगति के मार्गदर्शक हैं। हम आध्यात्मिक पूर्णता का नहीं, आध्यात्मिक प्रगति का दावा करते हैं। |
| 60 | (a) That we were alcoholic and could not manage our own lives. (b) That probably no human power could have relieved our alcoholism. (c) That God could and would if He were sought. | (क) कि हम शराबी थे और अपना जीवन नहीं सँभाल सकते थे। (ख) कि शायद कोई भी मानवीय शक्ति हमें हमारी शराब की लत से मुक्ति नहीं दिला सकती थी। (ग) कि ईश्वर ऐसा कर सकते थे और करते, अगर उन्हें खोजा जाता। |
| 83–84 | If we are painstaking about this phase of our development, we will be amazed before we are half way through. We are going to know a new freedom and a new happiness. We will not regret the past nor wish to shut the door on it. We will comprehend the INTO ACTION 84 ALCOHOLICS ANONYMOUS word serenity and we will know peace. No matter how far down the scale we have gone, we will see how our experience can benefit others. That feeling of uselessness and self-pity will disappear. We will lose interest in selfish things and gain interest in our fellows. Self-seeking will slip away. Our whole attitude and outlook upon life will change. Fear of people and of economic insecurity will leave us. We will intuitively know how to handle situations which used to baffle us. We will suddenly realize that God is doing for us what we could not do for ourselves. Are these extravagant promises? We think not. They are being fulfilled among us—sometimes quickly, sometimes slowly. They will always materialize if we work for them. | अगर हम अपने विकास के इस दौर में पूरी लगन से लगे रहें, तो आधा रास्ता तय करने से पहले ही हम चकित रह जाएँगे। हम एक नई आज़ादी और एक नई ख़ुशी जानेंगे। हमें अतीत पर पछतावा नहीं होगा, न ही हम उस पर दरवाज़ा बंद करना चाहेंगे। हम शांति शब्द का अर्थ समझेंगे और हम सुकून जानेंगे। हम चाहे कितने भी नीचे गिर चुके हों, हम देखेंगे कि हमारा अनुभव दूसरों के काम कैसे आ सकता है। बेकार होने और आत्म-दया की वह भावना मिट जाएगी। स्वार्थ की चीज़ों में हमारी रुचि ख़त्म होगी और अपने साथियों में रुचि जागेगी। अपना ही फ़ायदा ढूँढ़ने की आदत छूट जाएगी। जीवन के प्रति हमारा पूरा रवैया और नज़रिया बदल जाएगा। लोगों का डर और आर्थिक असुरक्षा का डर हमें छोड़ देगा। जो परिस्थितियाँ हमें चकरा देती थीं, उन्हें सँभालना हम सहज ही जान जाएँगे। हमें अचानक एहसास होगा कि ईश्वर हमारे लिए वह कर रहे हैं जो हम अपने लिए नहीं कर सकते थे। क्या ये बढ़ा-चढ़ाकर किए गए वादे हैं? हम ऐसा नहीं सोचते। ये हमारे बीच पूरे हो रहे हैं — कभी जल्दी, कभी धीरे। अगर हम इनके लिए काम करें, तो ये हमेशा साकार होंगे। |
| 84 | And we have ceased fighting anything or anyone— even alcohol. | और हमने किसी भी चीज़ या किसी भी व्यक्ति से लड़ना बंद कर दिया है — शराब से भी। |
| 85 | We are not cured of alcoholism. What we really have is a daily reprieve contingent on the maintenance of our spiritual condition. | हम शराब की लत से ठीक नहीं हुए हैं। असल में हमारे पास जो है, वह रोज़ की मोहलत है, जो हमारी आध्यात्मिक स्थिति को बनाए रखने पर निर्भर है। |
| 86 | On awakening let us think about the twenty-four hours ahead. | जागने पर, आइए आने वाले चौबीस घंटों के बारे में सोचें। |
| 89 | Practical experience shows that nothing will so much insure immunity from drinking as intensive work with other alcoholics. | व्यावहारिक अनुभव बताता है कि दूसरे शराबियों के साथ गहन काम जितना शराब से बचाव पक्का करता है, उतना और कुछ नहीं। |
| 98 | Burn the idea into the consciousness of every man that he can get well regardless of anyone. The only condition is that he trust in God and clean house. | हर व्यक्ति की चेतना में यह विचार गहराई से बिठा दीजिए कि वह ठीक हो सकता है, चाहे कोई और कुछ भी करे। एकमात्र शर्त यह है कि वह ईश्वर पर भरोसा रखे और अपना घर साफ़ करे। |
| 164 | Abandon yourself to God as you understand God. Admit your faults to Him and to your fellows. Clear away the wreckage of your past. | स्वयं को ईश्वर को, जैसा आप उन्हें समझते हैं, समर्पित कर दीजिए। अपनी ग़लतियाँ उनके सामने और अपने साथियों के सामने स्वीकार कीजिए। अपने अतीत का मलबा साफ़ कीजिए। |
| 164 | We shall be with you in the Fellowship of the Spirit, and you will surely meet some of us as you trudge the Road of Happy Destiny. | हम आत्मा की संगति में आपके साथ होंगे, और सुखद नियति की राह पर क़दम-क़दम चलते हुए आप हममें से कुछ से ज़रूर मिलेंगे। |
| 30 | The idea that somehow, someday he will control and enjoy his drinking is the great obsession of every abnormal drinker. | यह विचार कि किसी तरह, किसी दिन वह अपनी शराब पर क़ाबू रखकर उसका आनंद ले सकेगा, हर असामान्य पीने वाले का सबसे बड़ा जुनून है। |
| 53 | God either is, or He isn’t. | या तो ईश्वर हैं, या नहीं हैं। |
| 53 | God is everything or else He is nothing. | ईश्वर या तो सब कुछ हैं, या फिर कुछ भी नहीं। |
| 62 | Selfishness—self-centeredness! That, we think, is the root of our troubles. | स्वार्थ — आत्म-केंद्रितता! हमारे विचार में, यही हमारी परेशानियों की जड़ है। |
| 64 | Resentment is the “number one’’ offender. It destroys more alcoholics than anything else. | नाराज़गी “नंबर एक” अपराधी है। यह किसी भी और चीज़ से ज़्यादा शराबियों को नष्ट करती है। |
| 63 | the Third Step prayer | "Prayers and fixed texts" above |
| 76 | the Seventh Step prayer | "Prayers and fixed texts" above |
| 417 | And acceptance is the answer to all my problems today. … | `core.json` 1b08a63f6559 (the whole line) |
| 561–566 | the Traditions, short and long form | the two Traditions sections above (and `core.json`) |
| 574–575 | the Concepts | the Concepts section above (and `core.json`, which has the second sentences) |

A Promise quoted alone takes its sentence from the pp. 83–84 row. The site's most-cited pages, for your bearings: 563–566, 83–85, 58–60, 89, 76, 63, 62, 64, 67, 164, 30, 86, 417, 97–98.

## Site words
| English | Hindi |
|---|---|
| Daily Reflection / Daily Tradition / Daily Reading | दैनिक चिंतन / दैनिक परंपरा / दैनिक पाठ |
| Today's Reflection / Today's Tradition | आज का चिंतन / आज की परंपरा |
| Daily Traditions (the series, plural) | दैनिक परंपराएँ |
| Recovery Einstein's Big Book perspective | Recovery Einstein का बिग बुक वाला नज़रिया |
| Read today's official reflection at aa.org → | aa.org पर आज का आधिकारिक चिंतन पढ़ें → |
| a question to sit with / Sit with | मनन के लिए एक सवाल / मनन करें |
| Meetings Map / Online Meetings / Find a meeting | मीटिंग्स का नक्शा / ऑनलाइन मीटिंग्स / मीटिंग खोजें |
| Talk to Recovery Einstein | Recovery Einstein से बात करें |
| You're not alone / You don't have to face it alone | आप अकेले नहीं हैं / आपको इसका सामना अकेले नहीं करना है |
| day or night | दिन हो या रात |
| Get the App / web app | ऐप पाएँ / वेब ऐप |
| AI chat | AI चैट |
| Donate / Donate — keep it free | सहयोग करें / सहयोग करें — इसे निःशुल्क बनाए रखें |
| free | निःशुल्क [aapune: «मदद नि:शुल्क उपलब्ध है»; we write it with the visarga sign ः, निःशुल्क]; "Free" as a plan name: निःशुल्क |
| Home (breadcrumb) | होम |
| ← Previous / Next → | ← पिछला / अगला → |
| Page by page / Big Book Search Engine | पृष्ठ-दर-पृष्ठ / बिग बुक सर्च इंजन |
| Section / Chapter / Page | भाग / अध्याय / पृष्ठ (पृ. in references) |
| Tradition N · live (month grid) | परंपरा N · उपलब्ध |
| Tradition N · 30 readings | परंपरा N · 30 पाठ |
| Ask Recovery Einstein about Tradition N → | परंपरा N के बारे में Recovery Einstein से पूछें → |
| Daily Tradition card tags — the same on every card | the threat → ख़तरा · the threat today → आज का ख़तरा · before the tradition → परंपरा से पहले · how a group breaks it → समूह इसे कैसे तोड़ता है · how it gets captured → इस पर क़ब्ज़ा कैसे होता है · the earned answer → अनुभव से मिला जवाब · where it goes wrong → कहाँ चूक होती है |
| In plain terms | सीधे शब्दों में |
| 𝕏 Post / Facebook / Copy Link (share bar) | 𝕏 पर पोस्ट करें / Facebook / लिंक कॉपी करें |
| Short form / Long form | संक्षिप्त रूप / पूर्ण रूप |
| Not verified yet | अभी सत्यापित नहीं |
| email | ईमेल |
| Toggle menu / Skip to content | मेन्यू खोलें या बंद करें / सामग्री पर जाएँ |
| month (prices) | «/माह» |
