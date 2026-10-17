# Dutch glossary — the words every nl runner uses the same way

*Started 2026-10-17 by prep window prep1-nl (research only; the CEO window checks it before any runner sees it). Standard written Dutch (Standaardnederlands) that reads naturally in the Netherlands and in Flanders, plain and warm. The reader is **je/jij**, lower case (see "Form of address"). Where Dutch-speaking A.A. prints its own Dutch, we use it word for word; the source is in brackets. **[ours]** marks a wording Dutch A.A. hasn't published online: it's ours, fixed here so every page says it the same way. Add to this file through your close (`unsure:`), not by changing it mid-wave. **Never N.A.'s Dutch (Narcotics Anonymous' Basic Text or pamphlets) and never the Twelve Steps and Twelve Traditions** («Twaalf Stappen en Twaalf Tradities», "the 12 and 12"), even if you know them.*

## Sources (checked 2026-10-17, all read directly on the publisher's own URL)
- **[AA NL]** — aa-nederland.nl, the site of AA Nederland (Stichting, ANBI; Algemeen Diensten Bureau, Rotterdam): `/wat-is-aa/de-12-stappen/` (Steps; also the Serenity Prayer), `/wat-is-aa/de-12-tradities/` (Traditions, short form, with its opening line), `/wat-is-aa/de-12-concepten/` (Concepts, **long** form, «Copyright © 1996 Stichting Publiciteit AA Nederland», see the warning under Concepts), `/wat-is-aa/`, `/informatie/over-aa/`, `/informatie/over-aa/hoe-het-werkt/`, `/informatie/over-aa/aa-herstelprogramma/`, `/informatie/algemeen/afkortingen/` (service abbreviations), `/vragen-en-antwoorden/` (a long Q&A, the Dutch "44 Questions" text).
- **[AA NL shop]** — aa-nederland.nl/webshop, read through the shop's own product feed (`/wp-json/wc/store/v1/products`): book and pamphlet titles and their descriptions.
- **[AA VL]** — aa-vlaanderen.be (aavlaanderen.org redirects there), the site of AA Vlaanderen (Algemeen Dienstbeheer van de Nederlandstalige AA in België vzw, ALDINEA-BEL vzw, Berchem-Antwerpen): `/wat-is-aa/`, `/hoe-werkt-het/`, `/voor-wie-is-aa/`, `/ik-heb-een-probleem/`, `/12-stappen/` (a **paraphrase**, not the Steps), `/12-tradities/` (behind a member login: not readable).
- **[AA VL shop]** — aa-vlaanderen.be's product feed (`/wp-json/wc/store/v1/products`): Flemish titles, each with its «Originele titel».
- **[Informatiemap]** — AA Vlaanderen's «Informatiemap» (Comité Openbare Informatie), `aavlaanderen.org/pdf/AA%20informatiemap.pdf`, linked from aa-vlaanderen.be/downloads: the Preamble (p. 3, «uit "Grapevine" met toelating, copyright: AA Grapevine, Inc.»), the Twelve Steps (pp. 14–15) and Twelve Traditions (p. 18), each «Copyright: AA World Services, Inc.»; the literature list (p. 22). Undated; its addresses are older than the current site.
- **aa.org has no Dutch literature online**: its site search for "Dutch", "Nederlands" and "Anonieme Alcoholisten" returns nothing. So there is no aa.org Dutch source in this file.

**Which wording, and why.** The shared wording is **AA Nederland's** (Steps, Traditions short form, Concepts, Serenity Prayer, titles). Reasons: it's the only Dutch A.A. body that prints the Steps and Traditions on its current public site (AA Vlaanderen's site paraphrases the Steps and puts the Traditions behind a login); it's current (a 2026 site, a shop with 2014–2026 editions, «Geheel nieuwe vertaling. 1e Druk van de 4e editie, maart 2014» for the Big Book); and the Netherlands is the larger Dutch-speaking readership. AA Vlaanderen's Steps and Traditions exist only in the older Informatiemap PDF and differ in many words (see "Where the two differ" below); never mix the two in one quotation. Exception: the **Preamble**, which AA Nederland prints only as one sentence in its footer (plus an older, different version inside its Q&A); we use the Informatiemap's full Preamble, whose first sentence is word for word AA Nederland's footer. Long form of the Traditions, the Third and Seventh Step prayers and most Big Book chapter titles are **not published online** by either body → **ours**, below.

## Form of address
- **je/jij/jouw, lower case**: «je kunt», «jouw drinken», «als je wilt». AA Nederland's current pages address the reader this way («Wil je meer weten over de 12 stappen … en hoe jij dit kunt toepassen in jouw leven?» [AA NL, Steps page]; «Heb jij het vermoeden dat jij een alcoholprobleem hebt? Doe de zelftest» [AA NL, /informatie/over-aa/]; the folder «Is AA wat voor jou» [AA NL shop]), and so does AA Vlaanderen («In zo'n vergadering behoud je je anonimiteit» [AA VL, /wat-is-aa/]; «Is AA iets voor jou?» [AA VL shop]).
- AA Nederland's **older** pages still say **u** («Als u denkt dat dit misschien voor u het geval is…» [AA NL, /wat-is-aa/]; the Q&A). We follow the newer pages: never u/uw for the reader, and never plural «jullie». (The 112 government page says u; that's its register, not ours.)
- **Capitals are kept for God** (God, Hij, Hem, Zijn, U, Uw) — that's how the Steps and Traditions print it («zoals wij Hem begrepen», «Zijn wil», «zoals Hij zich openbaart»). Our prose never capitalises je/jij.
- **Gender:** Dutch rarely needs it with je. Where a sentence needs a person, use **iemand**, **AA'ers**, plural forms, or «hij of zij» only where AA does («geen greep meer heeft op zijn of haar drinken» [AA NL, /wat-is-aa/]). No slashes («hij/zij», «alcoholist(e)») in prose.

## How to write a segment
- Placeholder form: keep every `<0>…</0>` and `<1/>` the English has, around the words that belong in them, in the order Dutch needs. Don't type HTML.
- `node scripts/i18n/check.mjs nl <your-batch>` = 0 problems (the wave taught the scripts Dutch).
- **AA, not A.A.:** Dutch A.A. writes **AA** with no periods [AA NL and AA VL everywhere]. Compounds take a hyphen: **AA-lid, AA-groep, AA-bijeenkomst, AA-programma, AA-literatuur, AA-lidmaatschap** [AA NL, Traditions 3, 6, 7]. A member is **een AA'er**, plural **AA'ers** (with the apostrophe; AA prints ’) [AA NL, /wat-is-aa/; AA VL]. The fellowship as subject is singular: «Anonieme Alcoholisten heeft geen mening» [AA NL, Tradition 10], «AA staat open voor…» [AA VL]. Keep the periods only in English proper names: A.A. World Services, Inc.; A.A. Grapevine, Inc.; A.A.W.S.
- **Quotes:** “…” (curly double) for quotations, as AA Nederland prints them («“God, geef mij de Kalmte…”» [AA NL, Steps page]; «“Het Grote Boek van de Anonieme Alcoholisten” en “Twaalf Stappen en Twaalf Tradities”» [AA NL, Traditions page]); a quote inside a quote: ‘…’. Never straight "…" in Dutch prose. Book titles: in <i>…</i> where the English has it, otherwise “…”.
- **Dashes:** the en dash with spaces « – » between clauses, as A.A. does (Step 1 «alcohol – dat ons leven», Tradition 5 «hoofddoel – haar boodschap»). Ranges without spaces: 1937–1950, blz. 58–59.
- **Diacritics always:** één (when it means "one" and needs the stress), geïnteresseerd, ideeën, overeenkomst, ‘vóór’ only where it disambiguates. Don't drop the trema: «geïllustreerd», «financiële».
- **Numbers:** 1.234 (point for thousands), 29.000, 2,99 (decimal comma). Prices in dollars: «$ 2,99 per maand». Percentages «30%». Ordinals: «de 3e Traditie» (AA NL writes «De 7e traditie» [AA NL shop]), but in running text prefer «Traditie 3» or «de Derde Traditie»; «Stap 12», «de Twaalfde Stap». Years: «in 1935».
- **Times:** 24-hour, «19.30 uur» in running text (Dutch house style); in a compact list «19.30». "7:00 pm" → «19.00 uur». "2 AM" → «twee uur 's nachts».
- **Dates** (Gregorian, as the English): day, month **lower case**, year: «17 oktober 2026», «1 januari». A month on its own as a title or label starts with a capital only because it starts the label: «Januari», «Oktober». "in October" → «in oktober». "All of October" → «Heel oktober». "October 12 — Title" → «12 oktober — Titel».
  - months: januari, februari, maart, april, mei, juni, juli, augustus, september, oktober, november, december
  - weekdays (lower case): maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag
- **Page references stay the English 4th Edition's numbers**: «blz. 417», «pagina 86», «blz. 58–59», «blz. 561–562» («blz.» is how the AA NL shop abbreviates «bladzijde»). The Dutch 4th edition (2014) is paginated differently; never swap in its page numbers.
- **Arrows:** keep → ← › exactly as the English has them.
- **Names:** Bill W. (genitive «Bills», no apostrophe: «Bills verhaal»), Dr. Bob («Dr. Bob en de oldtimers» [AA VL shop]), Lois, Ebby T., Akron, Silkworth (dokter Silkworth), Carl Jung, the Oxford Group → **de Oxfordgroep** [ours], Derick, Red Deer (Alberta). Dutch doesn't decline names: «met Recovery Einstein», «van Recovery Einstein». Brands stay as written: Recovery Starts, Recovery Einstein, Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Seeker, Pro, Google Play, aa.org.
- Watch for lost negatives: «niet», «nooit», «geen», «behalve», «tenzij». A dropped «nooit» turns a Tradition upside down (Tradition 4 «behalve», 6 «mag nooit», 9 «mag nooit», 10 «geen mening … nooit betrokken»).
- Meta descriptions (the short text Google shows) end on a full sentence, never cut mid-sentence.
- **One segment is live JavaScript** (daily-reflection, the share bar: `<2>this.textContent='Copy Link',2000);return false;">Copy Link</2>`). Translate only the two words «Copy Link» → «Link kopiëren», both of them, and leave every other character exactly as it is.
- Translate it yourself; no Google or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-17, each on the service's own site):
- **Netherlands — 113 Zelfmoordpreventie, 113**: for people thinking about suicide; **call free on 113, 24 hours a day; chat at 113.nl, open day and night**; anonymous and confidential [113.nl/heb-je-nu-hulp-nodig/hulplijn: «Je kan ons gratis bellen via 113. We staan 24 uur per dag voor je klaar», «De chat is dag en nacht geopend», «Ben je in levensgevaar? Bel meteen 112»]. The phone number works **only from within the Netherlands**; from abroad, chat [113.nl/english]. «Most of the times, we can offer help in English as well» [113.nl/english]. Deaf, hard-of-hearing or speech-impaired: Teletolk with Dutch Sign Language, Mon–Fri 8:00–19:00 [113.nl/teletolk].
- **Netherlands — 112**, alarmnummer, for life-threatening emergencies (police, fire, ambulance) [rijksoverheid.nl, «Wanneer kan ik alarmnummer 112 bellen?»; 113.nl: «Ben je in levensgevaar? Bel meteen 112»]. (112.nl itself was blocked by this session's network proxy, so the government page stands in for it.)
- **Belgium — Zelfmoordlijn 1813**: **call 1813, 24/7; chat every day 17:00–24:00, Wednesdays 12:00–24:00; e-mail answered within 5 working days**; every contact anonymous and free [zelfmoord1813.be: «Elk gesprek is anoniem en gratis», «Bel 1813 · 24/7 bereikbaar», «Chat · Elke dag van 17u tot 00u, woensdag van 12u tot 00u», «Mail · Antwoord binnen 5 werkdagen»].
- **Belgium — 112** for ambulance and fire, **101** for urgent police help; «Bel in heel Europa gratis naar 112» [112.be/nl].
- **Canada — 9-8-8**: call or text, 24/7/365, in **English or French**; "If you would like to speak to someone in another language, this **may be available** by phone, via an interpreter" [988.ca/get-help/what-to-expect]. Text: English/French only.
- **USA — 988**: call, text and chat in English and Spanish; **calls get a free interpreter in more than 240 additional languages**; text and chat have no interpreter [samhsa.gov/mental-health/988/faqs]. SAMHSA's page doesn't list the languages by name, so "Dutch is among them" is likely but **not confirmed**: say «vraag om een tolk Nederlands», don't promise one.
- **Dropped: 0800-0113.** The work order lists it, but 113.nl's own pages (home, hulplijn, English, Teletolk, contact) now give only «Bel gratis 113»; 0800-0113 appears only in third-party reports (telecompaper, government consultation papers). Not used.
- **Not crisis lines, but A.A.'s own 24/7 phones** (use only where the English talks about calling A.A.): AA Nederland **085 – 104 53 90**, «Wij zijn elke dag, 24 uur bereikbaar» [AA NL, /wat-is-aa/]; AA Vlaanderen **078 05 27 27**, «Dag en nacht wordt dit nummer doorgeschakeld naar AA-leden» [AA VL, /ik-heb-een-probleem/].

So on an nl page **never write "bel of sms 988" alone** — a Dutch speaker who texts 988 gets English, and a reader in the Netherlands or Belgium can't reach 988 at all. Netherlands and Belgium first, then North America. Use these, word for word:

| English | Dutch |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | Zit je nu in een crisis? In Nederland: bel gratis 113 of chat via 113.nl, dag en nacht. In België: bel 1813, gratis, dag en nacht. Is er levensgevaar, bel dan 112. In de VS en Canada: bel 988 en vraag om een tolk Nederlands. Je bent niet alleen. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | Als je in een crisis zit: bel in Nederland gratis 113 (of chat via 113.nl), in België 1813, allebei dag en nacht; bij levensgevaar 112; in de VS en Canada 988 (Suicide & Crisis Lifeline), en vraag om een tolk Nederlands. |
| In crisis? Call or text 988 — free, 24/7, confidential. | In crisis? Bel in Nederland 113 (of chat via 113.nl), in België 1813 — gratis, dag en nacht, anoniem; bij levensgevaar 112. In de VS en Canada: bel 988 en vraag om een tolk Nederlands. Je bent niet alleen. |
| …988 inside a longer sentence | «988 (in de VS en Canada; bellen, met de vraag om een tolk Nederlands)» and, where the sentence has room, «in Nederland 113, in België 1813» |
| 988 Crisis Lifeline (a button/link) | Crisislijn 988 (VS en Canada) |
| Call 911 / go to the emergency room | Bel het alarmnummer (112 in Nederland en België, 911 in de VS en Canada) / ga naar de spoedeisende hulp (in België: de spoeddienst) [ours] |
| free, 24/7, confidential | gratis, dag en nacht, vertrouwelijk |
| detox / medical detox | ontgifting (detox) / ontgifting onder medisch toezicht [ours] |
| withdrawal / alcohol withdrawal / withdrawal symptoms | ontwenning / alcoholontwenning / ontwenningsverschijnselen [ours] |
| withdrawal can be dangerous — even fatal | alcoholontwenning kan gevaarlijk zijn, zelfs dodelijk |
| not medical advice | dit is geen medisch advies |
| treatment / treatment center / rehab | behandeling / behandelcentrum (verslavingskliniek) / afkickkliniek [ours] |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988; it's a `tel:988` link). Every crisis/988/detox/withdrawal segment is read by the super.

## Fellowships and books
| English | Dutch |
|---|---|
| Alcoholics Anonymous | **Anonieme Alcoholisten** [AA NL, AA VL]; singular verb: «Anonieme Alcoholisten heeft» [AA NL, Tradition 10]; the fellowship: «de gemeenschap» («Anonieme Alcoholisten is een gemeenschap van…» [AA NL footer]), «de AA-gemeenschap» [AA VL shop] |
| A.A. (the abbreviation) | **AA**, no periods, not declined: «in AA», «naar AA», «lid van AA», «AA als geheel» [AA NL, Tradition 4] |
| a member / members | een AA-lid / AA-leden [AA NL]; een AA'er / AA'ers [AA NL, AA VL] |
| Narcotics Anonymous / N.A. | Narcotics Anonymous (NA) [AA NL, Afkortingen] — the name only; never its literature |
| Cocaine Anonymous / C.A. | Cocaine Anonymous (CA) [AA NL, Afkortingen] |
| Gamblers Anonymous, Crystal Meth Anonymous, Sex Addicts Anonymous, Recovery Dharma, SMART Recovery, Celebrate Recovery | names stay in English (GA, CMA, SAA, RD…) |
| Al-Anon / Alateen | Al-Anon / Alateen [AA VL Informatiemap p. 26; AA NL «Familie Groepen»] |
| the Big Book | **het Grote Boek** («Het Grote Boek van de Anonieme Alcoholisten» [AA NL, Traditions page]; «het boek “Alcoholics Anonymous” (ook bekend als het Grote Boek)» [AA VL, /hoe-werkt-het/]); «Big Book» is common too [AA NL shop, AA VL] — write «het Grote Boek», and «Big Book» only where the English is quoting the nickname. Its Dutch title: «Anonieme Alcoholisten» [AA NL shop, AA VL shop] |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i>, 4e editie (Engelstalig) — in running text «het Grote Boek, 4e editie» |
| Twelve Steps and Twelve Traditions ("12 & 12") — only when the English names the book | «Twaalf Stappen en Twaalf Tradities» [AA NL, Traditions page; AA VL shop] — never a source |
| Daily Reflections | «Dagelijkse overdenkingen» [AA NL shop] (AA VL: «Dagelijkse Weerspiegeling») |
| As Bill Sees It | «Zoals Bill het ziet» [AA NL shop: «herziene en aangevulde uitgave van De visie van Bill»] |
| A.A. Comes of Age | «AA wordt volwassen» [AA NL, Concepts page]; full title «Anonieme Alcoholisten wordt volwassen» [AA NL shop, AA VL shop] |
| "Pass It On" | «Pass It On» (no Dutch edition found) [ours: keep the English title] |
| Dr. Bob and the Good Oldtimers | «Dr. Bob en de oldtimers» [AA VL shop] |
| The Language of the Heart | «De taal van het hart» [AA VL, «AA 50 België» PDF, aavlaanderen.org/pdf] |
| Living Sober | «Nuchter leven» [AA NL shop, AA VL shop] |
| Came to Believe | «Wij zijn gaan geloven» [AA NL shop, AA VL shop] |
| The Best of Bill | «Het beste van Bill» [AA NL shop, AA VL shop] |
| This is A.A. / A Newcomer Asks / The A.A. Group / Questions & Answers on Sponsorship / Problems Other Than Alcohol / Many Paths to Spirituality / The "God" Word / Young People and A.A. / Is A.A. for You? / 44 Questions | «Dit is AA» [AA NL shop] / «Een nieuwkomer stelt vragen» [AA VL shop] / «De AA-groep» [AA VL shop] / «Vragen en antwoorden over sponsorschap» [AA NL shop] / «Andere problemen dan alcohol» [AA VL shop] / «AA, vele wegen naar spiritualiteit» [AA NL shop] / «Het woord God» [AA VL shop: «Het woord GOD»] / «Jonge mensen en AA» [AA NL shop] / «Is AA wat voor jou?» [AA NL shop] / «44 vragen» [AA VL shop] |
| The Twelve Traditions Illustrated (P-43) | «Geïllustreerde twaalf tradities» [AA NL shop] |
| Twelve Concepts for World Service (the book) | «12 Concepten voor werelddienst» [AA NL shop] |
| A.A. Tradition — How It Developed (P-17) | «De AA-Traditie – hoe ze is ontstaan» (P-17) [ours] |
| Grapevine / La Viña | AA Grapevine / La Viña; Flemish A.A.'s own magazine is «5 voor 12» [AA VL] — don't swap it in for Grapevine |
| the A.A. Preamble | de AA-Preambule [ours for the name; the text is below, from the Informatiemap] |
| the Promises | de Beloften [ours] (text below) |

### Big Book chapters
Dutch A.A. names one chapter online («Hoe het werkt», AA VL shop: «Uit: “Het grote boek van de Anonieme alcoholisten” … Originele titel: How It Works»); the rest are **[ours]**, fixed here.
| English | Dutch |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | Voorwoord bij de eerste uitgave (tweede, derde, vierde) [ours] |
| The Doctor's Opinion | De mening van de dokter [ours] |
| 1 Bill's Story | Bills verhaal [ours] |
| 2 There Is a Solution | Er is een oplossing [ours] |
| 3 More About Alcoholism | Meer over alcoholisme [ours] |
| 4 We Agnostics | Wij agnosten [ours] |
| 5 How It Works | **Hoe het werkt** [AA VL shop] |
| 6 Into Action | Aan de slag [ours] |
| 7 Working with Others | Werken met anderen [ours] |
| 8 To Wives | Aan de echtgenotes [ours] |
| 9 The Family Afterward | Het gezin daarna [ours] |
| 10 To Employers | Aan werkgevers [ours] |
| 11 A Vision for You | Een visie voor jou [ours] |
| Personal Stories – Part I / II / III | Ervaringsverhalen – deel I / II / III [AA NL shop: the pocket Big Book «zonder ervaringsverhalen»] |
| Appendices / Appendix I – The A.A. Tradition / II Spiritual Experience / III The Medical View on A.A. / IV The Lasker Award / V The Religious View on A.A. / VI How to Get in Touch with A.A. / VII Twelve Concepts | Bijlagen / Bijlage I – De AA-Traditie / II Spirituele ervaring / III De medische kijk op AA / IV De Lasker-prijs / V De religieuze kijk op AA / VI Contact opnemen met AA / VII De Twaalf Concepten [ours] |
| Chapter 3 – More About Alcoholism | Hoofdstuk 3 – Meer over alcoholisme (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | Dutch |
|---|---|
| fellowship (A.A.'s) | de gemeenschap [AA NL footer, Concepts]; a fellowship in general: een gemeenschap |
| meeting | **meeting** (de meeting, meetings) [AA NL: «Vind een meeting», «Meetings»]; in flowing prose «bijeenkomst» is fine [AA NL: «AA-bijeenkomst», «groepsbijeenkomsten»]. AA Vlaanderen says «vergadering»; don't use it for the shared wording. A room: «zaal», «ruimte» |
| open / closed meeting | open meeting / besloten meeting [AA NL, Q&A: «open vergadering», «besloten vergadering»] |
| speaker meeting / online meeting | sprekersmeeting [ours] / online meeting [AA VL: «Vergaderingen (Online)»] |
| sharing / to share | delen / je ervaring, kracht en hoop delen [AA NL footer, Preamble] |
| home group | thuisgroep [ours; neither body prints a word for it online] |
| group conscience | groepsgeweten [Informatiemap, Tradition 2; AA VL]; AA NL's Tradition 2 says «het geweten van onze groep» |
| sponsor / sponsee / sponsorship / to sponsor | sponsor / de persoon die je sponsort (in a list: «sponsee») [ours] / sponsorschap [AA NL shop, AA VL shop] / sponsor zijn voor iemand, iemand sponsoren [ours] |
| newcomer | nieuwkomer [AA NL, Q&A; AA VL shop: «Een nieuwkomer stelt vragen»] |
| old-timer | oldtimer [AA VL shop: «Dr. Bob en de oldtimers»] |
| sobriety / sober / to get sober / stay sober | nuchterheid / nuchter / nuchter worden / nuchter blijven [AA NL Q&A; AA VL /wat-is-aa/: «nuchter worden en nuchter blijven»] |
| abstinence | geheelonthouding, niet drinken [ours] |
| recovery / to recover | herstel / herstellen [AA NL footer: «het herstel van hun alcoholisme»; Tradition 1: «persoonlijk herstel»] |
| the program | het AA-programma, het herstelprogramma [AA NL, /aa-herstelprogramma/] |
| relapse / slip | terugval (een terugval hebben, terugvallen) [AA NL, Q&A: «terugvallen»]; the Q&A also gives A.A.'s Flemish word «schuiven», and AA VL says «herval» — use **terugval** |
| alcoholism / the disease | alcoholisme / de ziekte [AA NL: «Wij beschouwen alcoholisme als een ziekte»] |
| alcoholic | alcoholist (een alcoholist, alcoholisten) [AA NL, AA VL] — never «alcoholicus» |
| the Steps / Step One / Twelfth Step work | de Stappen / Stap 1, de Eerste Stap [AA NL, /hoe-het-werkt/: «De Eerste Stap in het AA-herstelprogramma»] / Twaalfde-Stapwerk [ours; AA NL Q&A has «“Twaalf Stappen werk”»] — **Stap, Traditie, Concept capitalised** when they mean A.A.'s («al onze Tradities» [AA NL, Tradition 12]) |
| the Traditions / the Concepts | de Tradities / de Concepten (de Twaalf Concepten voor de werelddienst [AA VL shop]) |
| inventory / moral inventory / personal inventory | inventaris / morele inventaris / persoonlijke inventaris [Steps 4, 10] |
| resentment | wrok [AA NL, Q&A: «een bittere wrok koesteren»] |
| defects of character | karaktergebreken [Step 6] |
| shortcomings | tekortkomingen [Step 7] |
| the exact nature of our wrongs | de precieze aard van onze fouten [Step 5] |
| amends / make amends | het goedmaken / het weer goedmaken (bij iemand) [Steps 8–9] |
| Higher Power | Hogere Macht [AA VL «AA 50 België»; Step 2's own words: «een Macht groter dan wij zelf»]; AA NL's Q&A also says «Hogere Kracht» — use **Hogere Macht**, to match Step 2 |
| God as we understood Him | God, zoals wij Hem begrepen [Steps 3, 11] — "God as you understand Him" «God, zoals jij Hem begrijpt» |
| spiritual awakening | spiritueel ontwaken [Step 12] |
| powerless over alcohol | machteloos tegenover alcohol [Step 1: «machteloos stonden tegenover alcohol»] |
| our lives had become unmanageable | ons leven was stuurloos geworden [Step 1] — "unmanageable" alone: «stuurloos» (AA VL /voor-wie-is-aa/ also: «onbeheersbaar») |
| restore us to sanity | ons gezond verstand weer herstellen [Step 2] |
| conscious contact with God | bewust contact met God [Step 11: «ons bewuste contact met God»] |
| carry the message | de boodschap doorgeven [Step 12] / haar boodschap uitdragen [Tradition 5] |
| the alcoholic who still suffers | de alcoholist die nog steeds lijdt [Tradition 5] |
| primary purpose | hoofddoel [Traditions 5, 6] |
| self-supporting / the Seventh Tradition | zichzelf volkomen bedruipen [Tradition 7] / de 7e Traditie [AA NL shop: «De 7e traditie»]; the collection: «de hoed» [Informatiemap p. 17: «wordt er op de vergaderingen een “hoed” doorgegeven»] |
| trusted servants | toegewijde dienaren [Tradition 2] |
| principles before personalities | principes voorrang geven boven persoonlijke belangen [Tradition 12] |
| attraction rather than promotion | meer gebaseerd op aantrekkingskracht dan op reclame [Tradition 11] |
| outside issues | aangelegenheden buiten AA [Tradition 10] |
| anonymity | anonimiteit [AA NL, AA VL] |
| surrender / half measures / rigorous honesty | overgave / halve maatregelen / strikte eerlijkheid [ours] |
| cunning, baffling, powerful | sluw, verbijsterend en machtig [ours] |
| General Service Office (New York) / the Dutch office | het Algemeen Dienstenbureau van AA in New York [ours, after ADB] / het Algemeen Diensten Bureau (ADB) in Rotterdam [AA NL, Afkortingen] |
| General Service Board / trustees | de Algemene Dienstenraad [AA NL, Concepts 3, 6, 7] / beheerders [AA NL, Concepts 6–9] |
| General Service Conference | de Algemene Dienstenconferentie (ADC) [AA NL, Concept 2; Afkortingen] |
| the Right of Decision / Participation / Appeal / Petition | het “Beslissingsrecht” / het “Deelnemingsrecht” / het “Recht op beroep” [AA NL, Concepts 3–5] / het “Petitierecht” [ours] |
| group service representative (GSR) / treasurer / secretary / chairperson | algemene dienstvertegenwoordiger [AA NL, Q&A] / penningmeester / secretaris [Informatiemap p. 17; AA NL Q&A] / gespreksleider [Informatiemap p. 17] |
| intergroup / district / area / delegate | intergroep [ours] / district [ours] / regio [AA NL shop: «Regioafgevaardigde»] / afgevaardigde, regioafgevaardigde [AA NL shop] |
| committee | comité [AA NL, Tradition 9; Concepts] |
| the Oxford Group | de Oxfordgroep [ours] |
| the Serenity Prayer | het Gebed om Kalmte [AA NL shop: «Card Gebed om Kalmte»] (AA VL: «Sereniteitsgebed») |
| the Third Step prayer / Seventh Step prayer | het gebed van de Derde Stap / het gebed van de Zevende Stap [ours] |
| step work | stappenwerk, werken aan de Stappen [ours] |

## The Twelve Steps — AA Nederland, word for word [aa-nederland.nl/wat-is-aa/de-12-stappen/]
1. We erkenden dat we machteloos stonden tegenover alcohol – dat ons leven stuurloos was geworden.
2. Kwamen ertoe te geloven dat een Macht groter dan wij zelf ons gezond verstand weer kon herstellen.
3. Besloten onze wil en ons leven over te geven in de hoede van God, zoals wij Hem begrepen.
4. Maakten een diepgaande en onbevreesde morele inventaris op van onszelf.
5. Erkenden tegenover God, tegenover onszelf en tegenover een ander mens de precieze aard van onze fouten.
6. Waren volkomen bereid om God al deze karaktergebreken te laten wegnemen.
7. Vroegen Hem nederig onze tekortkomingen weg te nemen.
8. Maakten een lijst van alle personen die we schade hadden berokkend en werden bereid om het bij hen allen goed te maken.
9. Maakten het overal waar dit mogelijk was rechtstreeks weer goed bij deze mensen, behalve wanneer dit hen of anderen zou kwetsen.
10. Gingen door met het opmaken van een persoonlijke inventaris en als we fout waren erkenden we dit direct.
11. Trachtten door gebed en meditatie ons bewuste contact met God, zoals wij Hem begrepen, te verbeteren en baden Hem enkel ons Zijn wil voor ons te doen kennen en om de kracht die te volbrengen.
12. Nu deze stappen ons tot spiritueel ontwaken hebben geleid, hebben we geprobeerd deze boodschap aan alcoholisten door te geven en deze principes in al ons doen en laten toe te passen.

Steps 2–11 open on the verb, with «wij» understood from Step 1: that's how AA Nederland prints them; don't add «Wij». Step 2 writes «wij zelf» as two words; keep it. A Step quoted in part uses these words, cut, not reworded («machteloos stonden tegenover alcohol», «een diepgaande en onbevreesde morele inventaris»). AA Nederland's own /hoe-het-werkt/ page quotes Step 1 slightly differently («Wij erkenden dat wij machteloos stonden tegenover de alcohol»): use the Steps page above, always. The English's "A.A.'s own wording" or "word for word" claims about the Steps are true in Dutch too (it's A.A.'s Dutch).

## The Twelve Traditions, short form — AA Nederland, word for word [aa-nederland.nl/wat-is-aa/de-12-tradities/]
Opening line (it introduces both forms): «Onze AA ervaring heeft ons geleerd dat:»
1. Ons gemeenschappelijk welzijn moet op de eerste plaats staan; persoonlijk herstel is afhankelijk van de eenheid in AA.
2. Wij erkennen in onze groep slechts één uiteindelijke autoriteit, een liefhebbende God, zoals Hij zich openbaart in het geweten van onze groep. Onze leiders zijn toegewijde dienaren, zij regeren niet.
3. Het enige vereiste voor AA-lidmaatschap is het verlangen op te houden met drinken.
4. Elke groep moet autonoom zijn, behalve in zaken die andere groepen raken of AA als geheel betreffen.
5. Elke groep heeft slechts één hoofddoel – haar boodschap uitdragen aan de alcoholist die nog steeds lijdt.
6. Een AA-groep mag nooit enige relatie of initiatief van buiten ondersteunen, financieren of de naam van AA ermee verbinden, zodat problemen rond geld, eigendom en prestige ons niet van ons hoofddoel afleiden.
7. Elke AA-groep moet zichzelf volkomen bedruipen en bijdragen van buitenaf afwijzen.
8. AA moet altijd niet-professioneel blijven, maar onze dienstencentra mogen bijzondere medewerkers in dienst nemen.
9. AA als zodanig mag nooit georganiseerd worden, maar wij mogen wel dienstenbureaus of comités in het leven roepen, die rechtstreeks verantwoordelijk zijn aan degenen die zij dienen.
10. Anonieme Alcoholisten heeft geen mening over aangelegenheden buiten AA; daarom mag de naam van AA nooit betrokken raken in enig publiek meningsverschil.
11. Ons beleid ten aanzien van publiciteit is meer gebaseerd op aantrekkingskracht dan op reclame; tegenover de pers, radio en televisie moeten wij altijd onze persoonlijke anonimiteit handhaven.
12. Anonimiteit is de geestelijke grondslag van al onze Tradities; deze herinnert ons eraan dat principes voorrang hebben boven persoonlijke belangen.

One correction: AA Nederland's page spells Tradition 2's word «authoriteit»; the Dutch word is **autoriteit**, and we print it so (a one-letter slip, not a different wording; noted in PREP-NOTES for the CEO window). Everything else as printed, including Tradition 11's «televisie» where the English has "films". Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the Dutch at the matching point; `i18n/nl/core.json` (the /aa-info/ page) has all twelve already cut — copy them.

### Where the two differ (for the record; never quote AA Vlaanderen's in an nl page)
AA Vlaanderen's Informatiemap (pp. 14–15, 18) prints an older translation, e.g. Step 1 «We hebben toegegeven dat wij machteloos stonden tegenover alcohol», Step 2 «Wij zijn gaan geloven dat een Macht groter dan wijzelf ons weer geestelijk gezond kon maken», Step 3 «zoals wij persoonlijk Hem opvatten», Step 5 «de juiste aard van onze misstappen»; Tradition 2 «slechts één uiteindelijk gezag – een liefhebbende God zoals Hij zich in ons groepsgeweten kan uiten. Onze leiders zijn slechts dienaren die ons vertrouwen genieten», Tradition 11 «ten aanzien van pers, radio, T.V. en film», Tradition 12 «aan beginselen de voorrang moeten geven boven personen». Its Preamble is the one we use (see below).

## The Twelve Traditions, long form — [ours]
Neither AA Nederland nor AA Vlaanderen publishes the long form online (it's in the Dutch Big Book, Bijlage I, which isn't online; the 12 & 12 is never a source). This is ours, faithful to the English pp. 563–566, in AA Nederland's vocabulary. Use it word for word wherever a long-form Tradition, or a sentence from one, appears. Tradition 2's first sentence is AA Nederland's own.
1. Ieder lid van Anonieme Alcoholisten is slechts een klein deel van een groot geheel. AA moet blijven bestaan, anders zullen de meesten van ons zeker sterven. Daarom komt ons gemeenschappelijk welzijn op de eerste plaats. Maar het welzijn van ieder afzonderlijk volgt daar direct op.
2. Wij erkennen in onze groep slechts één uiteindelijke autoriteit, een liefhebbende God, zoals Hij zich openbaart in het geweten van onze groep.
3. Ons lidmaatschap moet allen omvatten die aan alcoholisme lijden. Daarom mogen wij niemand weigeren die wil herstellen. Ook mag het AA-lidmaatschap nooit afhangen van geld of van het zich schikken naar regels. Iedere twee of drie alcoholisten die voor hun nuchterheid bijeenkomen, mogen zich een AA-groep noemen, op voorwaarde dat zij als groep geen andere binding hebben.
4. Wat haar eigen zaken betreft, hoeft elke AA-groep aan geen ander gezag verantwoording af te leggen dan aan haar eigen geweten. Maar wanneer haar plannen ook het welzijn van naburige groepen raken, moeten die groepen worden geraadpleegd. En geen enkele groep, geen regionaal comité en geen individu mag ooit iets ondernemen dat AA als geheel ingrijpend zou kunnen raken, zonder overleg met de beheerders van de Algemene Dienstenraad. In zulke kwesties gaat ons gemeenschappelijk welzijn boven alles.
5. Elke groep van Anonieme Alcoholisten moet een spirituele eenheid zijn met slechts één hoofddoel – haar boodschap uitdragen aan de alcoholist die nog steeds lijdt.
6. Problemen rond geld, eigendom en gezag kunnen ons gemakkelijk afleiden van ons spirituele hoofddoel. Daarom vinden wij dat elk aanzienlijk bezit dat werkelijk van nut is voor AA, als aparte rechtspersoon moet worden ondergebracht en beheerd, zodat het materiële van het spirituele gescheiden blijft. Een AA-groep als zodanig mag nooit zaken gaan doen. Voorzieningen die AA kunnen ondersteunen, zoals clubs of ziekenhuizen, en die veel bezit of beheer vragen, moeten een eigen rechtspersoon hebben en zo apart staan dat de groepen ze zo nodig vrij kunnen loslaten. Daarom mogen zulke voorzieningen de naam van AA niet gebruiken. Het beheer ervan moet uitsluitend de verantwoordelijkheid zijn van hen die ze financieel dragen. Voor clubs gaat de voorkeur meestal uit naar AA-leden als beheerders. Maar ziekenhuizen, en ook andere plaatsen van herstel, moeten duidelijk buiten AA staan – en onder medisch toezicht. Hoewel een AA-groep met iedereen mag samenwerken, mag die samenwerking nooit zo ver gaan dat ze een binding of een steunbetuiging wordt, werkelijk of gesuggereerd. Een AA-groep kan zich aan niemand binden.
7. De AA-groepen zelf moeten volledig gedragen worden door de vrijwillige bijdragen van hun eigen leden. Wij vinden dat elke groep dit ideaal spoedig moet bereiken; dat elke openbare inzameling van geld onder de naam van Anonieme Alcoholisten zeer gevaarlijk is, of die nu door groepen, clubs, ziekenhuizen of andere instanties van buiten gebeurt; dat het onverstandig is grote giften aan te nemen, uit welke bron ook, of bijdragen waaraan enige verplichting verbonden is. Verder zien wij met grote zorg naar die AA-kassen die, boven een verstandige reserve, geld blijven ophopen zonder vastgesteld AA-doel. De ervaring heeft ons vaak gewaarschuwd dat niets ons spirituele erfgoed zo zeker kan vernietigen als zinloze twisten over eigendom, geld en gezag.
8. Anonieme Alcoholisten moet altijd niet-professioneel blijven. Onder professionalisme verstaan wij het beroepsmatig begeleiden van alcoholisten tegen honorarium of loon. Maar wij mogen alcoholisten in dienst nemen waar zij diensten gaan verrichten waarvoor wij anders niet-alcoholisten zouden moeten aannemen. Zulke bijzondere diensten mogen goed beloond worden. Maar ons gewone “Twaalfde Stap”-werk in AA wordt nooit betaald.
9. Elke AA-groep heeft zo weinig mogelijk organisatie nodig. Roulerend leiderschap is het beste. De kleine groep kan haar secretaris kiezen, de grote groep haar roulerend comité, en de groepen van een grote stad hun centraal comité of intergroepscomité, dat vaak een voltijdse secretaris in dienst heeft. De beheerders van de Algemene Dienstenraad zijn in feite ons Algemeen Dienstencomité van AA. Zij zijn de hoeders van onze AA-Traditie en de ontvangers van de vrijwillige AA-bijdragen waarmee wij ons Algemeen Dienstenbureau van AA in New York in stand houden. De groepen hebben hen gemachtigd onze algemene public relations te behartigen, en zij staan in voor de integriteit van ons voornaamste blad, de AA Grapevine. Al zulke vertegenwoordigers moeten zich laten leiden door de geest van dienstbaarheid, want ware leiders in AA zijn slechts toegewijde en ervaren dienaren van het geheel. Zij ontlenen geen werkelijk gezag aan hun titels; zij regeren niet. Algemeen respect is de sleutel tot hun bruikbaarheid.
10. Geen AA-groep en geen AA-lid mag ooit, op een manier die AA erbij betrekt, een mening uiten over controversiële kwesties van buiten – in het bijzonder over politiek, alcoholhervorming of godsdienstige richtingen. De groepen van Anonieme Alcoholisten verzetten zich tegen niemand. Over zulke zaken kunnen zij hoegenaamd geen standpunt uiten.
11. Onze betrekkingen met het grote publiek moeten gekenmerkt worden door persoonlijke anonimiteit. Wij vinden dat AA sensationele reclame moet vermijden. Onze namen en foto's als AA-leden mogen niet worden uitgezonden, gefilmd of in het openbaar gedrukt. Onze public relations moeten geleid worden door het principe van aantrekkingskracht en niet van reclame. Het is nooit nodig onszelf op te hemelen. Wij vinden het beter onze vrienden ons te laten aanbevelen.
12. En ten slotte geloven wij, Anonieme Alcoholisten, dat het principe van anonimiteit een enorme spirituele betekenis heeft. Het herinnert ons eraan dat wij principes voorrang moeten geven boven persoonlijke belangen; dat wij werkelijk een oprechte nederigheid in praktijk moeten brengen. Dit opdat onze grote zegeningen ons nooit zullen bederven; opdat wij voor altijd zullen leven in dankbare overpeinzing van Hem die boven ons allen staat.

Tradition 3's clause, quoted all over the site: **“op voorwaarde dat zij als groep geen andere binding hebben”**. Tradition 6's: «Een AA-groep kan zich aan niemand binden», «mag die samenwerking nooit zo ver gaan dat ze een binding of een steunbetuiging wordt, werkelijk of gesuggereerd». Where the English splits a long-form Tradition into several segments, split the Dutch at the matching sentence.

**On the /12-traditions/ page** (and anywhere the English says the Traditions are printed "word for word, exactly as they appear in Alcoholics Anonymous"): in Dutch that would be untrue for the long form. Say what's true, in the same place: «De korte formule in de bewoording van AA Nederland (aa-nederland.nl), de lange formule in onze eigen vertaling — beide uit <i>Alcoholics Anonymous</i>, 4e editie (Engelstalig): korte formule blz. 561–562, lange formule blz. 563–566.» («korte/lange formule» is A.A.'s Dutch: «De 7e traditie (De lange formule)» [AA NL shop].) Keep the English's placeholders and page numbers; the rest of the sentence (published unaltered, cited) is translated as it stands. Note it in your close.

## The Twelve Concepts, short form — AA Nederland's sentences where they match, the rest ours
AA Nederland prints the Concepts in their **long** form (aa-nederland.nl/wat-is-aa/de-12-concepten/). The English site prints the short form (first sentence only for 7–12). Concept 1 is AA Nederland's sentence word for word; 2–12 are **ours**, built from AA Nederland's own phrases (marked in core.json's /aa-info/ segments) and its terms (Algemene Dienstenconferentie, Algemene Dienstenraad, beheerders, “Beslissingsrecht”, “Deelnemingsrecht”, “Recht op beroep”). All twelve are in `i18n/nl/core.json` (the /aa-info/ page) — use exactly those sentences wherever a Concept is quoted:
1. De uiteindelijke verantwoordelijkheid en het hoogste gezag voor de AA-werelddiensten zullen altijd liggen bij het gemeenschappelijk geweten van onze gehele gemeenschap.
2. De Algemene Dienstenconferentie van AA is in vrijwel alle praktische opzichten de actuele stem en het effectieve geweten van onze gehele gemeenschap geworden in haar wereldzaken.
3. Om effectief leiderschap te verzekeren, moeten wij elk element van AA – de Conferentie, de Algemene Dienstenraad en zijn dienstverlenende corporaties, het personeel, de comités en de leidinggevenden – begiftigen met een traditioneel “Beslissingsrecht”.
4. Op alle verantwoordelijke niveaus moeten we een traditioneel “Deelnemingsrecht” aanhouden, dat een stemgerechtigde afvaardiging toestaat in redelijke verhouding tot de verantwoordelijkheid die elk moet dragen.
5. In onze gehele structuur moet een traditioneel “Recht op beroep” vooraan staan, zodat de mening van minderheden gehoord wordt en persoonlijke grieven zorgvuldig in overweging genomen worden.
6. De Conferentie erkent dat het belangrijkste initiatief en de actieve verantwoordelijkheid in de meeste zaken van werelddienst moeten liggen bij de beheerders die lid zijn van de Conferentie, wanneer zij optreden als de Algemene Dienstenraad.
7. Het charter en de verordeningen van de Algemene Dienstenraad zijn wettelijke instrumenten, die de beheerders de macht geven de zaken van de werelddiensten te leiden en te besturen.
8. De beheerders zijn de belangrijkste ontwerpers en bestuurders van het algemene beleid en de financiën.
9. Goed leiderschap in de diensten op alle niveaus is onmisbaar voor onze toekomstige werking en veiligheid.
10. Iedere dienstverantwoordelijkheid moet in overeenstemming zijn met een even groot dienstgezag.
11. De beheerders moeten steeds de best mogelijke comités, bestuurders van de dienstverlenende corporaties, verantwoordelijke uitvoerders, kader en raadgevers hebben.
12. De Conferentie zal de geest van de AA-traditie in acht nemen en er grote zorg voor dragen dat zij nooit de zetel van gevaarlijke rijkdom of macht wordt.

Where the /12-concepts/ page quotes more of a Concept than this, translate the rest faithfully yourself [ours] and keep these first sentences. **Don't copy AA Nederland's long-form Concept text into a page**: its page says «Niets uit deze tekst mag worden overgenomen zonder schriftelijke toestemming vooraf van AA Nederland» (an open question for the CEO window, PREP-NOTES). Any "verbatim / A.A.'s official wording" claim about the Concepts gets an honest rewording: «Concept 1 in de bewoording van AA Nederland; de andere in onze vertaling, met de woorden van AA Nederland waar die overeenkomen».

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer** [AA NL, Steps page: «Traditiegetrouw wordt elke AA-bijeenkomst besloten met de woorden…»]: «God, geef mij de Kalmte om te aanvaarden wat ik niet kan veranderen, Moed om te veranderen wat ik kan veranderen, en Wijsheid om tussen deze twee onderscheid te maken.» (A.A. capitalises Kalmte, Moed, Wijsheid; keep it. AA Nederland's page adds the meeting's closing words «Kom, blijf komen, want je bent er pas als je er niet meer bent.» — they're not part of the prayer; don't append them.)
- **Third Step prayer** (English p. 63) **[ours]** — Dutch A.A. doesn't publish it online (it's in the 2014 Dutch Big Book, which isn't online; we couldn't confirm its wording, so this is ours, from the English): «God, ik bied mij aan U aan – om met mij op te bouwen en met mij te doen wat U wilt. Bevrijd mij van de gebondenheid aan mijzelf, opdat ik Uw wil beter kan doen. Neem mijn moeilijkheden weg, opdat de overwinning daarop getuigenis mag afleggen, voor hen die ik zou willen helpen, van Uw Kracht, Uw Liefde en Uw Levenswijze. Moge ik altijd Uw wil doen!»
- **Seventh Step prayer** (English p. 76) **[ours]**, same reason: «Mijn Schepper, ik ben nu bereid dat U alles van mij hebt, goed en slecht. Ik bid dat U nu elk afzonderlijk karaktergebrek van mij wegneemt dat mijn bruikbaarheid voor U en mijn medemensen in de weg staat. Geef mij kracht, nu ik hiervandaan ga, om te doen wat U van mij vraagt. Amen.»
  - Never call these two «de Nederlandse tekst van AA» or «de officiële vertaling»: they're ours. If the English discusses a single phrase ("bondage of self", "My Creator", "every single defect"), quote the Dutch words that carry it («de gebondenheid aan mijzelf», «Mijn Schepper», «elk afzonderlijk karaktergebrek») and, where the point depends on the exact English word, add the English in brackets once: «(Engels: “bondage of self”)».
- **The A.A. Preamble** [Informatiemap p. 3, «(uit “Grapevine” met toelating) copyright: AA Grapevine, Inc.»; its first sentence is word for word AA Nederland's site footer]: «Anonieme Alcoholisten is een gemeenschap van mannen en vrouwen die hun ervaring, kracht en hoop met elkaar delen om hun gemeenschappelijk probleem op te lossen en anderen te helpen bij het herstel van hun alcoholisme. Het enige vereiste voor lidmaatschap is een verlangen op te houden met drinken. Er zijn geen geldelijke verplichtingen voor het AA-lidmaatschap; wij voorzien in onze behoeften door eigen bijdragen. AA is niet gebonden aan enige sekte, genootschap, politieke partij, organisatie of instelling; wenst zich niet te mengen in enig geschil; steunt of bestrijdt geen enkel doel. Ons hoofddoel is nuchter blijven en andere alcoholisten helpen nuchterheid te bereiken.» (The PDF prints «AA - lidmaatschap» with stray spaces from its layout; we write «AA-lidmaatschap». It still says «mannen en vrouwen»; if the English quotes the current "a fellowship of people", translate the English faithfully and don't call it Dutch A.A.'s text. AA Nederland's Q&A carries an older, different Preamble, «De Anonieme Alcoholisten vormen een genootschap…»: don't use it.)
- **The Promises** (pp. 83–84) **[ours]**: «Als we in deze fase van onze ontwikkeling nauwgezet te werk gaan, zullen we versteld staan nog voor we halverwege zijn. We zullen een nieuwe vrijheid en een nieuw geluk leren kennen. We zullen geen spijt hebben van het verleden en er ook niet de deur voor willen sluiten. We zullen het woord kalmte begrijpen en we zullen vrede kennen. Hoe diep we ook gezonken zijn, we zullen zien hoe onze ervaring anderen tot nut kan zijn. Dat gevoel van nutteloosheid en zelfmedelijden zal verdwijnen. We zullen onze belangstelling voor zelfzuchtige dingen verliezen en belangstelling krijgen voor onze medemensen. Eigenbelang zal wegglijden. Onze hele houding en kijk op het leven zullen veranderen. Angst voor mensen en voor financiële onzekerheid zal ons verlaten. We zullen intuïtief weten hoe we situaties moeten aanpakken die ons vroeger in verwarring brachten. We zullen plotseling beseffen dat God voor ons doet wat we zelf niet konden. Zijn dit overdreven beloften? Wij denken van niet. Ze gaan onder ons in vervulling – soms snel, soms langzaam. Ze zullen altijd werkelijkheid worden als we ervoor werken.» ("serenity" is «kalmte», as in A.A.'s Gebed om Kalmte.)
- p. 164 "the Road of Happy Destiny" → «de Weg naar een Gelukkige Bestemming» [ours].
- A prayer or fixed text quoted in part uses these words, cut, not reworded.
- **Any other line the English quotes from the Big Book, a pamphlet or Grapevine:** translate it faithfully yourself, and use the same Dutch each time the same English line comes back in your batch (search your file before you write it again). Don't go looking for the Dutch edition's wording for ordinary quotes.
- A quote's credit line: the English "Alcoholics Anonymous, 4th Edition, page N. A short quote, for identification and study. Read the whole page in your own copy →" becomes «<i>Alcoholics Anonymous</i>, 4e editie (Engelstalig), pagina N; eigen vertaling. Een kort citaat, ter herkenning en studie. Lees de hele pagina in je eigen exemplaar →». Keep the English's placeholders around the same words.

## Big Book quotes — look here first (wave svnl1)
*Added 2026-10-17 by the svnl1 Super (Opus 5.5, Super window). Every English line below was located in Derick's own copy of the 4th edition (Recoverystarts/aa-library, `big-book/text/`) and its page checked by script; the page given is that check's result. Dutch A.A. publishes no Big Book passage online, so every line here is ours.*

**The rule, for every Big Book quote in your batch:**
1. **Look it up here first**, then in "Prayers and fixed texts" above. If the passage is here, use these words exactly (cut, never reworded, if the English quotes only part of it).
2. **If it isn't here**, translate the English faithfully and closely: the same sentences, the same order, the same images, nothing smoothed or explained. Never paraphrase a quote, never shorten it, never "improve" it. Then list its id in your close under `unsure:` as **`BBQ <id>`**. Checkers read every BBQ; the Super reads every BBQ.
3. **Same line, same Dutch**: before you write a quote, search your own file for it; if you've written it once, copy it.
4. Never take wording from the Twelve Steps and Twelve Traditions or from N.A., even if you know it. Never swap in Dutch page numbers (see "Page references").
5. Never call one of these «de Nederlandse tekst van AA»: the credit line says «eigen vertaling» (see the credit-line rule above).

**Fixed (credit «eigen vertaling»):**
| p. | English | Dutch |
|---|---|---|
| 30 | The idea that somehow, someday he will control and enjoy his drinking is the great obsession of every abnormal drinker. | Het idee dat hij op een of andere manier, ooit, zijn drinken zal beheersen en ervan zal genieten, is de grote obsessie van iedere abnormale drinker. |
| 53 | God either is, or He isn't. | Ofwel God is er, ofwel Hij is er niet. |
| 53 | God is everything or else He is nothing. | God is alles, of anders is Hij niets. |
| 58 | Rarely have we seen a person fail who has thoroughly followed our path. | Zelden hebben we iemand zien mislukken die onze weg grondig heeft gevolgd. |
| 58 | Our stories disclose in a general way what we used to be like, what happened, and what we are like now. | Onze verhalen laten in grote lijnen zien hoe we vroeger waren, wat er gebeurde en hoe we nu zijn. |
| 58 | If you have decided you want what we have and are willing to go to any length to get it—then you are ready to take certain steps. | Als je besloten hebt dat je wilt wat wij hebben en bereid bent tot het uiterste te gaan om het te krijgen – dan ben je klaar om bepaalde stappen te zetten. |
| 58–59 | Remember that we deal with alcohol—cunning, baffling, powerful! | Bedenk dat we met alcohol te maken hebben – sluw, verbijsterend en machtig! |
| 59 | Half measures availed us nothing. We stood at the turning point. | Halve maatregelen hielpen ons niets. We stonden op het keerpunt. |
| 60 | We claim spiritual progress rather than spiritual perfection. | We maken aanspraak op spirituele vooruitgang, niet op spirituele volmaaktheid. |
| 62 | Selfishness—self-centeredness! That, we think, is the root of our troubles. | Zelfzucht – egocentrisme! Dat is volgens ons de wortel van onze problemen. |
| 63 | the Third Step prayer | «God, ik bied mij aan U aan …» — above, [ours] |
| 64 | Resentment is the "number one" offender. It destroys more alcoholics than anything else. | Wrok is “boosdoener nummer één”. Wrok vernietigt meer alcoholisten dan wat ook. |
| 76 | the Seventh Step prayer | «Mijn Schepper, ik ben nu bereid …» — above, [ours] |
| 83–84 | the Promises | above, [ours], whole or cut |
| 84 | We have ceased fighting anything or anyone—even alcohol. | We zijn opgehouden met vechten tegen wat of wie dan ook – zelfs tegen alcohol. |
| 85 | We are not cured of alcoholism. What we really have is a daily reprieve contingent on the maintenance of our spiritual condition. | We zijn niet genezen van alcoholisme. Wat we werkelijk hebben, is een dagelijks uitstel, dat afhangt van het onderhoud van onze spirituele toestand. ("reprieve" is a stay, «uitstel»; never «gratie», a pardon) |
| 86 | On awakening let us think about the twenty-four hours ahead. | Laten we bij het ontwaken nadenken over de vierentwintig uur die voor ons liggen. |
| 89 | Practical experience shows that nothing will so much insure immunity from drinking as intensive work with other alcoholics. | De praktijk leert dat niets zo zeker beschermt tegen drinken als intensief werken met andere alcoholisten. |
| 98 | Burn the idea into the consciousness of every man that he can get well regardless of anyone. The only condition is that he trust in God and clean house. | Brand het idee in het bewustzijn van iedere man dat hij beter kan worden, ongeacht wie dan ook. De enige voorwaarde is dat hij op God vertrouwt en schoon schip maakt. |
| 164 | Abandon yourself to God as you understand God. Admit your faults to Him and to your fellows. Clear away the wreckage of your past. | Geef je over aan God, zoals jij God begrijpt. Erken je fouten tegenover Hem en tegenover je medemensen. Ruim de puinhopen van je verleden op. |
| 164 | …Trudge the Road of Happy Destiny. | … Ga moeizaam verder op de Weg naar een Gelukkige Bestemming. |
| 417 | And acceptance is the answer to all my problems today. When I am disturbed, it is because I find some person, place, thing, or situation—some fact of my life—unacceptable to me … | the /index.html line in `core.json`: «En aanvaarding is vandaag het antwoord op al mijn problemen. Als ik van streek ben, is dat omdat ik een persoon, plaats, ding of situatie — een feit in mijn leven — onaanvaardbaar vind…» |
| 563–566 | the long-form Traditions | "The Twelve Traditions, long form" above (and `core.json`) |

The site's most-cited pages, for your bearings: 563–566 (long-form Traditions), 83–85, 58–60, 89, 76, 63, 62, 64, 67, 164, 30, 86, 417, 97–98.

## Site words
| English | Dutch |
|---|---|
| Daily Reflection / Daily Tradition / Daily Reading | Dagelijkse overdenking / Dagelijkse Traditie / Dagelijkse lezing (after A.A.'s «Dagelijkse overdenkingen») |
| Today's Reflection / Today's Tradition | De overdenking van vandaag / De Traditie van vandaag |
| Recovery Einstein's Big Book perspective | de kijk van Recovery Einstein vanuit het Grote Boek |
| Read today's official reflection at aa.org → | Lees de officiële overdenking van vandaag op aa.org (Engelstalig) → |
| a question to sit with / Sit with | een vraag om bij stil te staan / Om bij stil te staan |
| Meetings Map / Online Meetings / Find a meeting | Meetingkaart / Online meetings / Vind een meeting [AA NL: «Vind een meeting»] |
| Talk to Recovery Einstein | Praat met Recovery Einstein |
| You're not alone / You don't have to face it alone | Je bent niet alleen / Je hoeft het niet alleen te doen |
| Get the App / the menu's "Get the App" / web app | Download de app / De app / webapp |
| AI chat | AI-chat |
| Donate / Donate — keep it free | Doneren / Doneer – zodat het gratis blijft |
| free | gratis |
| Home (breadcrumb) | Home [AA NL's own menu says «Home»] |
| ← Previous / Next → | ← Vorige / Volgende → |
| Page by page / Big Book Search Engine | Pagina voor pagina / Zoekmachine voor het Grote Boek |
| Section / Chapter / Page | Deel / Hoofdstuk / Pagina (blz. in references) |
| Tradition N · live (month grid) | Traditie N · online |
| Tradition N · 30 readings | Traditie N · 30 lezingen |
| Ask Recovery Einstein about Tradition N → | Vraag Recovery Einstein naar Traditie N → |
| Daily Tradition card tags — the same on every card | the threat → de dreiging · the threat today → de dreiging vandaag · before the tradition → vóór de Traditie · how a group breaks it → hoe een groep haar breekt · how it gets captured → hoe ze wordt ingepalmd · the earned answer → het zwaarbevochten antwoord · where it goes wrong → waar het misgaat |
| In plain terms | Gewoon gezegd |
| 𝕏 Post / Facebook / Copy Link (share bar) | Plaatsen op 𝕏 / Facebook / Link kopiëren |
| Short form / Long form | Korte formule / Lange formule [AA NL shop: «De lange formule»] |
| Not verified yet | Nog niet geverifieerd |
| email | e-mail |

*— prep1-nl, 2026-10-17. Every quotation above was read on the page named beside it; nothing in the A.A. sections is from memory.*
