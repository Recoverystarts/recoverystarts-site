# German glossary — the words every de1 runner uses the same way

*Started 2026-10-17 by wave de1 S1-de (the Super, Opus 5.5). Standard written German (Germany): **ß**, never Swiss «ss»; plain and warm. The reader is **Sie** (see "Form of address"). Where German-speaking A.A. prints its own German, we use it word for word; the source is in brackets. **[ours]** marks a wording A.A. hasn't published in German: it's ours, fixed here so every page says it the same way. Add to this file through your close (`unsure:`), not by changing it mid-wave. **Never N.A.'s German (Narcotics Anonymous' Basic Text or pamphlets) and never the book «Zwölf Schritte und Zwölf Traditionen»** (the "12 and 12"), even if you know them.*

## Sources (checked 2026-10-17, all read directly on the publisher's own URL)
- **[BB]** — **the «Blaue Buch»**: *Anonyme Alkoholiker*, 1. revidierte Auflage 2016, the German edition of *Alcoholics Anonymous*, published chapter by chapter as PDF by the Anonyme Alkoholiker Interessengemeinschaft e.V. (the German-speaking A.A. service body for Germany, Austria/South Tyrol and German Switzerland) at `https://www.anonyme-alkoholiker.de/downloads/blauesbuch/bbNN.pdf` (table of files under "Big Book quotes" below). The Steps (Kapitel 5, S. 68–69), the Third and Seventh Step prayers, the Promises, the Traditions in short **and long** form (Anhang 1, S. 420–426), the short Concepts (Anhang 8, S. 443–446) and the Serenity Prayer (S. 331) below are copied from it and re-checked by script, word for word.
- **[aa.de]** — anonyme-alkoholiker.de: `/unsere-idee/zwoelf-schritte/`, `/zwoelf-traditionen/`, `/praeambel/` (the Preamble), `/wie-es-funktioniert/`, `/leben-mit-aa/gedanken-zum-tag/` (the daily «Heute. Gedanken zum Tag»), `/meetings/was-ist-ein-aa-meeting/`, `/publikationen/literatur/` (the German literature list, for titles), `/kontakt/erste-hilfe/`, `/leben-mit-aa/intergruppen/`.
- **[aa.at]** — anonyme-alkoholiker.at `/12-schritte`, `/12-traditionen`, `/12-konzepte` (same words as [BB]; Austria prints the Concepts too). **[aa.ch]** — anonyme-alkoholiker.ch (German Switzerland; uses the same literature from the same order desk).

**Which wording, and why.** Germany, Austria and Switzerland share one German A.A. literature (one order desk, one «Blaues Buch»), so there was nothing to choose between countries. Where the website's Steps page and the book differ in punctuation (Step 8's dash, «wiedergutzumachen» vs «wieder gutzumachen», Step 10's dash and «unrecht»), we follow **the book** [BB], because the site quotes the Big Book on nearly every page. Traditions short form: [BB] Anhang 1 (identical to [aa.de] but «selbstständig»/«ehrenamtlich bleiben, jedoch»). Long form: [BB] — German A.A. *does* print it, so unlike pl/fa/pt it is **not ours**. Concepts: [BB] Anhang 8 = [aa.at] (the 1971 short form; the typo «sorgältig» on aa.at is not in the book). The **long** Concepts the /12-concepts/ page also prints are not published in German online → ours.

## Form of address
- **Sie**, always, capital S: «Sie können», «Ihr Trinken», «wenn Sie sich entschieden haben». That is how German-speaking A.A.'s Big Book speaks to the reader («Wenn Sie sich darüber klar geworden sind, dass Sie das haben wollen, was wir heute besitzen …», «Mögen Sie Ihn jetzt finden!», S. 67–68) and how its website answers a newcomer («Was können wir für Sie tun?»). One rule for 20 runners, and our prose never clashes with the quotes.
- **du / dich / dir / dein / ihr / euch / euer** only inside a quotation that has it (a member's words in a story, a pamphlet title like «Sind die Anonymen Alkoholiker etwas für dich?»). `score.mjs de` flags du-forms (`reg`); a flag inside a quote is fine.
- God's pronouns are capitalised as [BB] does: **Er, Ihn, Ihm, Sein, Seinen Willen, Dir, Deine, Deinen** (Steps 3, 7, 11, the prayers, Tradition 2). [BB]'s Tradition 12 has «IHN»; keep it there only.
- **Gender:** prefer neutral wording («wer trinkt», «Menschen», «alle, die …»). Where a noun has to be chosen, the generic masculine as [BB] does («der Alkoholiker», «ein Neuling»); write both only where the English names both («Männer und Frauen», «Sponsor oder Sponsorin»). No gender star, colon or slash forms in prose.

## How to write a segment
- Placeholder form: keep every `<0>…</0>` and `<1/>` the English has, around the words that belong in them, in the order German needs. Don't type HTML.
- `node scripts/i18n/check.mjs de <your-batch>` = 0 problems. `node scripts/i18n/score.mjs de` shows `reg` (du-forms, ASCII quotes) and spelling flags — keep them at 0 outside quotes.
- **ß and umlauts always**: groß, Straße, heißt, weiß, außer, schließlich, Maß, bloß; ä ö ü — never ae/oe/ue (fuer, ueber, koennen are flagged). New spelling: **dass, muss, lässt** (never daß/muß).
- **Quotes:** „…“ (low-high, U+201E and U+201C). A quote inside a quote: ‚…‘. Never "…" or “…” in German prose. Apostrophes in English names stay: Claude's Lab; German genitive has none: «Bills Geschichte», «Dericks Weg».
- **Dashes:** a spaced en dash « – » between clauses (never « — »). Ranges without spaces: 1937–1950, S. 58–59.
- **Numbers:** 1.234 (point for thousands; 4-digit numbers may stay 1234), 3,5 (decimal comma), 30.000 Dollar. Prices: «2,99 USD». Times: **19:30 Uhr** (24-hour; "7:00 pm" → «19:00 Uhr»). Years: «1935», «im Jahr 1935». Ordinals take a point: «der 3. Schritt» — but in running text write Steps and Traditions as A.A. does: **«der Dritte Schritt», «Schritt 3», «die Dritte Tradition», «Tradition 3»** (capital ordinal: Erste, Zweite, Dritte, Vierte, Fünfte, Sechste, Siebte, Achte, Neunte, Zehnte, Elfte, Zwölfte).
- **Dates** (Gregorian, as the English): «17. Oktober», «1. Januar 2026», «am 17. Oktober». A month alone as a title: «Oktober». "All of October" → «Der ganze Oktober». "October 12 — Title" → «12. Oktober – Titel». Months: Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember (Germany's **Januar**, not Austria's Jänner). Weekdays: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag; "on Tuesdays" «dienstags».
- **Page references stay the English 4th Edition's numbers**: «S. 417», «Seite 86», «S. 58–59», «S. 561–562». The German book's pages are different (the Steps are on S. 68–69 there, not 59–60): never swap in German page numbers, except inside the credit «(Blaues Buch, S. N)» described below.
- **Nouns capitalised, sentences start with a capital** (flagged when not). Compounds join or take a hyphen: AA-Gruppe, AA-Meeting, AA-Mitglied, Online-Meeting, Meeting-Karte; never "AA Gruppe".
- **Arrows:** keep → ← › exactly as the English has them.
- **Names:** Bill W. (Bills, mit Bill W.), Dr. Bob, Lois, Ebby T., Akron, Dr. Silkworth, Carl Gustav Jung / C. G. Jung, the Oxford Group → **die Oxford-Gruppe** [BB], Derick, Red Deer (Alberta). **Recovery Einstein** is not declined: «mit Recovery Einstein», «Recovery Einsteins Sicht» (genitive -s is fine); alone «Einstein». Brands stay as written: Recovery Starts, Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Seeker, Pro, Google Play, aa.org, AA Big Book Search + AI Guide.
- Watch for lost negatives: «nicht», «kein/keine», «nie/niemals», «niemand», «außer», «weder … noch». A dropped «nicht» or «niemals» turns a Tradition upside down (Tradition 6 «sollte niemals … unterstützen», 9 «sollten niemals organisiert werden», 10 «nehmen niemals Stellung … niemals in öffentliche Streitfragen»).
- German runs ~30 % longer than English. Menus, buttons and titles: shorter wording is fine, the meaning stays. Meta descriptions (the short text Google shows) end on a full sentence, never cut mid-sentence.
- **One segment is live JavaScript** (daily-reflection, the share bar: `<2>this.textContent='Copy Link',2000);return false;">Copy Link</2>`). Translate only the two words «Copy Link» → «Link kopieren», both of them, and leave every other character exactly as it is.
- Translate it yourself; no Google, DeepL or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-17, each on the service's own site or the government's):
- **Germany — TelefonSeelsorge: 0800 111 0 111 · 0800 111 0 222 · 116 123** — free («Ihr Anruf ist kostenfrei»), anonymous, day and night («Tag und Nacht», «rund um die Uhr erreichbar») [telefonseelsorge.de].
- **Austria — Telefonseelsorge 142** — «rund um die Uhr, jeden Tag … kostenlos und vertraulich» (0–24 Uhr) [telefonseelsorge.at]; emergency numbers **112** (Euro-Notruf) and **144** (Rettung), free from any phone [oesterreich.gv.at, Notrufnummern].
- **Switzerland — Die Dargebotene Hand 143** — «immer für Sie da. Persönlich, anonym und vertraulich» [143.ch]; **not free**: CHF 0.20–0.70 per call [zh.ch, Notfallnummern] — so never write «kostenlos» for 143. **144** Sanität (ambulance) [zh.ch]; **112** works in Switzerland too.
- **Germany — 112** (Feuerwehr/Rettungsdienst/Notarzt, free, 24/7, from any phone in the EU) [baden-wuerttemberg.de, «Europaweiter Notruf 112»]. (Police 110 is not needed on our pages.)
- **Canada — 9-8-8**: call or text, English and French, 24/7; "if you would like to speak to someone in another language, this may be available by phone, via an interpreter" [988.ca, read by waves tr4/pl1 on 2026-10-12/13]. Text: English/French only.
- **USA — 988**: call, text and chat in English and Spanish; **a call gets a free interpreter in 240+ more languages** (say "German" when it answers); text and chat have no interpreter [samhsa.gov/mental-health/988/faqs, read by tr4/pl1].
- Dropped: none of the README's lines; all were confirmed. Not used: other regional or NGO lines, the Swiss 147 (Pro Juventute, for young people) except where the English speaks of teens.

So on a de page **never write "rufen Sie an oder schreiben Sie eine SMS an 988" alone** — a German speaker who texts 988 gets English, and a reader in Germany, Austria or Switzerland can't reach 988 at all. Home countries first, then North America. Use these, word for word (they are in `i18n/de/core.json`):

| English | German |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | Sind Sie gerade in einer Krise? In Deutschland erreichen Sie die TelefonSeelsorge kostenfrei und rund um die Uhr unter 0800 111 0 111, 0800 111 0 222 oder 116 123, in Österreich die Telefonseelsorge unter 142, in der Schweiz Die Dargebotene Hand unter 143. In Lebensgefahr: Notruf 112. In den USA und Kanada rufen Sie 988 an und bitten um einen Dolmetscher für Deutsch. Sie sind nicht allein. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). (the short line at the foot of many pages) | Wenn Sie in einer Krise sind: TelefonSeelsorge in Deutschland 0800 111 0 111 (kostenfrei, rund um die Uhr), in Österreich 142, in der Schweiz 143 (Die Dargebotene Hand); in Lebensgefahr Notruf 112; in den USA und Kanada 988 (Suicide & Crisis Lifeline), telefonisch, mit der Bitte um einen Dolmetscher für Deutsch. |
| If you're in crisis, call or text 988. | Wenn Sie in einer Krise sind: TelefonSeelsorge in Deutschland 0800 111 0 111 (kostenfrei, rund um die Uhr), in Österreich 142, in der Schweiz 143; in Lebensgefahr Notruf 112; in den USA und Kanada 988, telefonisch, mit der Bitte um einen Dolmetscher für Deutsch. |
| …988 inside a longer sentence | «988 (in den USA und Kanada; telefonisch, mit der Bitte um einen Dolmetscher für Deutsch)» and, where the sentence has room, «in Deutschland die TelefonSeelsorge, 0800 111 0 111» |
| 988 Crisis Lifeline (a button/link) | Krisentelefon 988 (USA und Kanada) |
| a teen / young person in crisis | (Deutschland) Nummer gegen Kummer — only if the English names a youth line; otherwise the TelefonSeelsorge lines above |
| Call 911 / go to the emergency room | Rufen Sie den Notruf an (in Europa 112, in den USA und Kanada 911) / gehen Sie in die nächste Notaufnahme |
| free, 24/7, confidential | kostenlos, rund um die Uhr, vertraulich |
| detox / medical detox / detox center | Entgiftung / Entgiftung unter ärztlicher Aufsicht / Entgiftungsstation [BB: «Entgiftung»] |
| withdrawal / alcohol withdrawal / withdrawal symptoms | Entzug / Alkoholentzug / Entzugserscheinungen [BB] |
| withdrawal can be dangerous — even fatal | ein Alkoholentzug kann gefährlich, sogar tödlich sein |
| not medical advice | keine medizinische Beratung |
| treatment / treatment center / rehab | Behandlung / Suchtklinik, Behandlungszentrum / Entwöhnung, Reha |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988; it's a `tel:988` link). Every crisis/988/detox/withdrawal segment is read by the Super.

## Fellowships and books
| English | German |
|---|---|
| Alcoholics Anonymous | **Anonyme Alkoholiker** (die Anonymen Alkoholiker, der Anonymen Alkoholiker); the fellowship: «die Gemeinschaft der Anonymen Alkoholiker», «die Gemeinschaft AA», «die AA-Gemeinschaft» [BB, aa.de] |
| A.A. (the abbreviation) | **AA**, no periods [aa.de everywhere]. As A.A. writes it: «bei AA», «zu AA», «in AA», «die Gemeinschaft der AA», plural «die AA» where it means the members («Was tun die AA nicht?», «Zugehörigkeit zu den AA»). Compounds with a hyphen: AA-Mitglied, AA-Gruppe, AA-Meeting, AA-Literatur, AA-Botschaft. Keep the periods only in English proper names: A.A. World Services, Inc.; A.A. Grapevine, Inc.; A.A.W.S. |
| a member / members | AA-Mitglied, AA-Mitglieder; «ein Anonymer Alkoholiker» [BB] |
| Narcotics Anonymous / N.A. | Narcotics Anonymous (NA) — the name only; never its literature |
| Gamblers Anonymous, Cocaine Anonymous, Crystal Meth Anonymous, Sex Addicts Anonymous, Recovery Dharma, SMART Recovery, Celebrate Recovery | names stay in English (GA, CA, CMA, SAA, RD, CR) |
| Al-Anon / Alateen | Al-Anon, Al-Anon-Familiengruppen / Alateen |
| the Big Book | **das Blaue Buch** (des Blauen Buches, im Blauen Buch) — German A.A.'s own name for it [aa.de: «Das ‚Blaue Buch‘»]; its title: «Anonyme Alkoholiker». "Big Book Page 205" → «Blaues Buch, Seite 205». |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i>, 4. Auflage (englisch) — short «4. Aufl.»; in running text «das Blaue Buch (4. englische Auflage)» |
| Twelve Steps and Twelve Traditions ("12 & 12") — only when the English names the book | «Zwölf Schritte und Zwölf Traditionen» [aa.de] — never a source |
| Daily Reflections | «Heute. Gedanken zum Tag» [aa.de] |
| As Bill Sees It | «Wie Bill es sieht» [aa.de] |
| A.A. Comes of Age | «AA wird mündig» [aa.de] |
| Living Sober | «Trocken bleiben – nüchtern leben» [aa.de] |
| Came to Believe | «Wir kamen zu dem Glauben» [aa.de] |
| The A.A. Service Manual | «Handbuch Dienen in AA» [aa.de] |
| "Pass It On", Dr. Bob and the Good Oldtimers, The Language of the Heart, The Best of Bill, 44 Questions | not published in German: keep the English title in italics, e.g. <i>Pass It On</i> |
| This is A.A. / A Newcomer Asks / The A.A. Group / Questions & Answers on Sponsorship / Problems Other Than Alcohol / Many Paths to Spirituality / Young People and A.A. / Women in A.A. / Is A.A. for You? / Is There an Alcoholic in Your Life? / Frequently Asked Questions About A.A. / Understanding Anonymity / The Twelve Traditions Illustrated / The Twelve Concepts Illustrated / The Twelve Steps Illustrated | «Das ist AA. Eine Einführung» / «Ein Newcomer fragt» / «Die AA-Gruppe – Wo alles beginnt» / «Fragen und Antworten zur Sponsorschaft» / «Andere Probleme als Alkohol» / «Viele Wege zur Spiritualität» / «Junge Leute und AA» / «Frauen in AA» / «Sind die Anonymen Alkoholiker etwas für mich?» / «Gibt es in Ihrem Leben einen Alkoholiker?» / «Häufig gestellte Fragen über AA» / «Was wir unter Anonymität verstehen» / «Die Zwölf Traditionen illustriert» / «Die Zwölf Konzepte für den Weltdienst illustriert» / «Die Zwölf Schritte illustriert» [aa.de literature list] |
| A.A. Tradition — How It Developed (P-17) / A.A.'s Legacy of Service (P-44) | «Die AA-Tradition – wie sie sich entwickelt hat» (P-17) / «Das Vermächtnis des Dienens in AA» (P-44) [ours] |
| Grapevine / La Viña | „AA-Grapevine“ [BB, Tradition 9] / „La Viña“; German A.A.'s own magazine is «AA-DACH» — don't swap it in for Grapevine |
| the A.A. Preamble | die Präambel der Anonymen Alkoholiker [aa.de] (text below) |
| the Promises | die Versprechen [BB, S. 97: «Sind das alles übertriebene Versprechen?»] (text below) |

### Big Book chapters — all A.A.'s own German [BB]
| English | German |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | Vorwort zur ersten Auflage (zweiten, dritten, vierten) [ours; the German book has its own forewords] |
| The Doctor's Opinion | **Aus der Sicht des Arztes** |
| 1 Bill's Story | **Bills Geschichte** |
| 2 There Is a Solution | **Es gibt eine Lösung** |
| 3 More About Alcoholism | **Mehr über Alkoholismus** |
| 4 We Agnostics | **Wir Agnostiker** |
| 5 How It Works | **Wie es funktioniert** |
| 6 Into Action | **In die Tat umgesetzt** |
| 7 Working with Others | **Die Arbeit mit anderen** |
| 8 To Wives | **An die Ehefrauen** |
| 9 The Family Afterward | **Die Familie danach** |
| 10 To Employers | **An die Arbeitgeber** |
| 11 A Vision for You | **Eine Vision für Sie** |
| Personal Stories – Part I / II / III | Lebensgeschichten – Teil I / II / III [BB: «Lebensgeschichten Teil I»] |
| Dr. Bob's Nightmare / Alcoholic Anonymous Number Three / Acceptance Was the Answer / Freedom from Bondage | «Doktor Bobs Albtraum» / «Der Anonyme Alkoholiker Nummer drei» / «Akzeptieren ist die Lösung» / «Von den Fesseln befreit» [BB — the only English stories the German book carries] |
| Appendices / Appendix I – The A.A. Tradition / II Spiritual Experience / III The Medical View on A.A. / IV The Lasker Award / V The Religious View on A.A. / VI How to Get in Touch with A.A. / VII The Twelve Concepts | Anhänge / Anhang I – Die Traditionen der AA-Gemeinschaft / II – Die spirituelle Erfahrung / III – Die AA-Gemeinschaft aus der Sicht von Ärzten / IV – Der Lasker-Preis / V – Die AA-Gemeinschaft aus der Sicht von Geistlichen / VI – Wie man mit den Anonymen Alkoholikern in Verbindung kommt / VII – Die Zwölf Konzepte [BB's titles; the English book's Roman numbering, because we cite the English pages] |
| Chapter 3 – More About Alcoholism | Kapitel 3 – Mehr über Alkoholismus (same pattern for every chapter) |

Any other personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | German |
|---|---|
| fellowship (A.A.'s) | Gemeinschaft (die Gemeinschaft der AA) [BB, aa.de]; "Fellowship" with a capital in the English → still «Gemeinschaft» |
| meeting | das Meeting, die Meetings [aa.de, BB]; a room: Meetingsraum, or just Meeting |
| open / closed meeting | offenes Meeting / geschlossenes Meeting [aa.de] |
| speaker meeting / online meeting / beginners' meeting | Sprecher-Meeting [ours] / Online-Meeting [aa.de: «Onlinemeetings»] / Anfängermeeting [aa.de] |
| sharing / to share | Austausch / sich mitteilen, teilen («ihre Erfahrung, Kraft und Hoffnung teilen») [Preamble] |
| home group | **Stammgruppe** [BB] |
| group conscience | Gruppengewissen [BB, Tradition 4 long]; in Tradition 2: «das Gewissen unserer Gruppe» |
| sponsor / sponsee / sponsorship / to sponsor | Sponsor, Sponsorin [BB] / Sponsee [ours; German meetings use the English word] / Sponsorschaft [aa.de] / Sponsor sein für jemanden, jemanden begleiten |
| newcomer | **Neuling** [BB]; «Newcomer» only in the pamphlet title «Ein Newcomer fragt» |
| old-timer | alter Hase, langjähriges Mitglied [ours] |
| sobriety / sober / to get sober | Nüchternheit / nüchtern / nüchtern werden [BB, Preamble «nüchtern zu bleiben»]; "dry" «trocken» [BB] |
| abstinence | Abstinenz |
| recovery / to recover | Genesung / genesen [BB, Tradition 1, Preamble «Genesung vom Alkoholismus»] |
| the program | das Programm, das Genesungsprogramm [BB: «als Programm zur Genesung empfohlen»] |
| relapse / slip | Rückfall [BB] |
| alcoholism / the disease | Alkoholismus / die Alkoholkrankheit [BB] |
| the Steps / Step One / Twelfth Step work | die Schritte / der Erste Schritt (Schritt 1) / die Arbeit im Zwölften Schritt [BB, Tradition 8 long] — **Schritt, Tradition, Konzept** |
| the Traditions / the Concepts | die Traditionen / die Konzepte (die Zwölf Konzepte für den Weltdienst [aa.de]) |
| inventory / moral inventory / personal inventory | Inventur / «eine gründliche und furchtlose Inventur in unserem Inneren» (Step 4) / Inventur bei uns (Step 10) [BB] |
| resentment | **Groll** [BB, 35×]; a resentment list: Grollliste [BB] |
| defects of character | Charakterfehler [Step 6]; in the Seventh Step prayer «Charaktermängel» |
| shortcomings | Mängel [Step 7] |
| the exact nature of our wrongs | «unverhüllt unsere Fehler» [Step 5] |
| amends / make amends | Wiedergutmachung / wiedergutmachen [BB, Steps 8–9] |
| Higher Power | **Höhere Macht** [BB, aa.de «meine Höhere Macht»] — Step 2's own words: «eine Macht, größer als wir selbst» |
| God as we understood Him | Gott – wie wir Ihn verstanden [Steps 3, 11] — "God as you understand Him" «Gott, wie Sie Ihn verstehen» [BB, S. 192] |
| spiritual awakening | spirituelles Erwachen [Step 12] |
| powerless over alcohol | dem Alkohol gegenüber machtlos [Step 1] |
| our lives had become unmanageable | «unser Leben nicht mehr meistern konnten» [Step 1] — "unmanageable" alone: «nicht mehr zu meistern» |
| restore us to sanity | «uns unsere geistige Gesundheit wiedergeben» [Step 2] |
| conscious contact with God | die bewusste Verbindung zu Gott [Step 11] |
| prayer and meditation | Gebet und Besinnung [Step 11] |
| carry the message | die Botschaft weitergeben [Step 12, Tradition 5 long] |
| the alcoholic who still suffers | Alkoholiker, die noch leiden [Tradition 5]; «jemand, der noch krank ist» [BB S. 192] |
| primary purpose | Hauptaufgabe (Tradition 5), Hauptziel (Tradition 5 long), «unser eigentlicher Zweck» (Tradition 6); Preamble: «Unser Hauptzweck» |
| self-supporting / the Seventh Tradition | sich selbst erhalten [Tradition 7, Preamble] / die Siebte Tradition; the collection: «Spende für die Siebte Tradition», «der Hut» [ours] |
| trusted servants | betraute Diener [Tradition 2] |
| principles before personalities | Prinzipien über Personen stellen [Tradition 12] |
| attraction rather than promotion | mehr auf Anziehung als auf Werbung [Tradition 11] |
| outside issues | Fragen außerhalb ihrer Gemeinschaft [Tradition 10] |
| no other affiliation (Tradition 3 long) | «keine andere Bindung» [BB] |
| anonymity | Anonymität [aa.de] |
| surrender / half measures / rigorous honesty | kapitulieren [BB S. 67: «bis wir kapitulierten»] / halbe Sachen [BB] / absolute Ehrlichkeit [BB S. 67] |
| cunning, baffling, powerful | verschlagen, trügerisch, mächtig [BB S. 68 — A.A.'s German order] |
| bondage of self | die Fesseln meines Ichs [BB, Third Step prayer] |
| a daily reprieve (p. 85) | eine tägliche Bewährungsfrist [BB S. 98; aa.de «Gedanken zum Tag»] |
| the Road of Happy Destiny (p. 164) | der beschwerliche Weg zum glücklichen Ziel [BB S. 192] |
| self-will run riot (p. 62) | Eigenwille [BB: «ein Leben, das von Eigenwillen gesteuert wird»]; the phrase itself: our faithful German |
| General Service Office (New York) / German-speaking A.A.'s office | das Gemeinsame Dienstbüro (GSO) in New York [BB, Tradition 9 long] / das Gemeinsame Dienstbüro (GDB) in Berlin [aa.de] |
| General Service Board / trustees | **Gemeinsamer Dienstausschuss** [BB, Concepts] / **Treuhänder** (Concepts), **Vertrauensleute** (Traditions 4, 9) [BB] |
| General Service Conference | **Gemeinsame Dienstkonferenz** [BB, Concept 2]; German-speaking A.A.'s own: GDK [aa.de] |
| the Right of Decision / Participation / Appeal / Petition | «Entscheidungsbefugnis» / «Mitwirkungsanspruch» / «Einspruchsrecht» [BB, Concepts 3–5] / «Petitionsrecht» [ours] |
| group service representative (GSR) / treasurer / secretary | Gruppen-Dienstvertreter (GSR) [ours] / Kassierer [BB] / Sekretär, Gruppensprecher [BB, Tradition 9 long] |
| intergroup / district / area / region / delegate | Intergruppe [BB, aa.de] / Bezirk [ours] / Area (Dienstgebiet) [ours] / Region [aa.de] / Delegierter, Delegierte |
| the Oxford Group | die Oxford-Gruppe |
| the Third Step prayer / Seventh Step prayer | das Gebet zum Dritten Schritt / das Gebet zum Siebten Schritt [ours for the names; texts below are BB] |
| step work | die Arbeit an den Schritten |
| the Serenity Prayer | der Gelassenheitsspruch [BB S. 331, aa.de shop]; "Serenity Prayer" in prose may also be «das Gelassenheitsgebet» [BB S. 229] — use **Gelassenheitsspruch** |

## The Twelve Steps — German-speaking A.A., word for word [BB, Kapitel 5, S. 68–69]
1. Wir gaben zu, dass wir dem Alkohol gegenüber machtlos sind – und unser Leben nicht mehr meistern konnten.
2. Wir kamen zu dem Glauben, dass eine Macht, größer als wir selbst, uns unsere geistige Gesundheit wiedergeben kann.
3. Wir fassten den Entschluss, unseren Willen und unser Leben der Sorge Gottes – wie wir Ihn verstanden – anzuvertrauen.
4. Wir machten eine gründliche und furchtlose Inventur in unserem Inneren.
5. Wir gaben Gott, uns selbst und einem anderen Menschen gegenüber unverhüllt unsere Fehler zu.
6. Wir waren völlig bereit, all diese Charakterfehler von Gott beseitigen zu lassen.
7. Demütig baten wir Ihn, unsere Mängel von uns zu nehmen.
8. Wir machten eine Liste aller Personen, denen wir Schaden zugefügt hatten – und wurden willig, ihn bei allen wiedergutzumachen.
9. Wir machten bei diesen Menschen alles wieder gut – wo immer es möglich war –, es sei denn, wir hätten dadurch sie oder andere verletzt.
10. Wir setzten die Inventur bei uns fort – und wenn wir unrecht hatten, gaben wir es sofort zu.
11. Wir suchten durch Gebet und Besinnung die bewusste Verbindung zu Gott – wie wir Ihn verstanden – zu vertiefen. Wir baten Ihn nur, uns Seinen Willen erkennbar werden zu lassen und uns die Kraft zu geben, ihn auszuführen.
12. Nachdem wir durch diese Schritte ein spirituelles Erwachen erlebt hatten, versuchten wir, diese Botschaft an Alkoholiker weiterzugeben und unser tägliches Leben nach diesen Grundsätzen auszurichten.

A Step quoted in part uses these words, cut, not reworded («dem Alkohol gegenüber machtlos», «eine gründliche und furchtlose Inventur»). Where the English page dissects an English word of a Step that the German doesn't carry ("searching", "moral", "exact nature", "direct amends", "improve"), quote the German Step and add the English in brackets once: «(engl. „searching and fearless moral inventory“)». The English's "A.A.'s own wording" or "word for word" claims about the Steps are true in German too (they're A.A.'s German).

## The Twelve Traditions, short form — word for word [BB, Anhang 1, S. 420–421]
1. Unser gemeinsames Wohlergehen sollte an erster Stelle stehen; die Genesung des Einzelnen beruht auf der Einigkeit der Anonymen Alkoholiker.
2. Für den Sinn und Zweck unserer Gruppe gibt es nur eine höchste Autorität – einen liebenden Gott, wie Er sich in dem Gewissen unserer Gruppe zu erkennen gibt. Unsere Vertrauensleute sind nur betraute Diener; sie herrschen nicht.
3. Die einzige Voraussetzung für die AA-Zugehörigkeit ist der Wunsch, mit dem Trinken aufzuhören.
4. Jede Gruppe sollte selbstständig sein, außer in Dingen, die andere Gruppen oder die Gemeinschaft der AA als Ganzes angehen.
5. Die Hauptaufgabe jeder Gruppe ist, unsere AA-Botschaft zu Alkoholikern zu bringen, die noch leiden.
6. Eine AA-Gruppe sollte niemals irgendein außenstehendes Unternehmen unterstützen, finanzieren oder mit dem AA-Namen decken, damit uns nicht Geld-, Besitz- und Prestigeprobleme von unserem eigentlichen Zweck ablenken.
7. Jede AA-Gruppe sollte sich selbst erhalten und von außen kommende Unterstützungen ablehnen.
8. Die Tätigkeit bei den Anonymen Alkoholikern sollte immer ehrenamtlich bleiben, jedoch dürfen unsere zentralen Dienststellen Angestellte beschäftigen.
9. Anonyme Alkoholiker sollten niemals organisiert werden. Jedoch dürfen wir Dienst-Ausschüsse und -Komitees bilden, die denjenigen verantwortlich sind, welchen sie dienen.
10. Anonyme Alkoholiker nehmen niemals Stellung zu Fragen außerhalb ihrer Gemeinschaft; deshalb sollte auch der AA-Name niemals in öffentliche Streitfragen verwickelt werden.
11. Unsere Beziehungen zur Öffentlichkeit stützen sich mehr auf Anziehung als auf Werbung. Deshalb sollten wir gegenüber Presse, Rundfunk, Film und Fernsehen stets unsere persönliche Anonymität wahren.
12. Anonymität ist die spirituelle Grundlage aller unserer Traditionen, die uns immer daran erinnern soll, Prinzipien über Personen zu stellen.

Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the German at the matching point.

## The Twelve Traditions, long form — word for word [BB, Anhang 1, S. 422–426]
German-speaking A.A. prints the long form («Unsere Erfahrung in der AA-Gemeinschaft hat uns Folgendes gelehrt:»). It is a freer translation than the short form; **use it exactly**, never re-translate it from the English. All twelve are also in `i18n/de/core.json` (the /aa-info/ list) — copy from there.
1. Jeder einzelne Alkoholiker ist nur ein kleiner Teil eines großen Ganzen. Die Gemeinschaft der Anonymen Alkoholiker muss weiter bestehen, sonst werden die meisten von uns sterben. Darum steht unser gemeinsames Wohlergehen an erster Stelle, das Wohlergehen des Einzelnen aber kommt sofort danach.
2. Für den Sinn und Zweck unserer Gruppe gibt es nur eine höchste Autorität – einen liebenden Gott, wie Er sich in dem Gewissen unserer Gruppe zu erkennen gibt.
3. Zu den Anonymen Alkoholikern gehören alle, die unter dem Alkoholismus leiden. Wir können niemanden zurückweisen, der genesen möchte. Die Zugehörigkeit zu den AA sollte niemals von Geld oder Meinungsgleichheit abhängig gemacht werden. Wenn sich zwei oder drei Alkoholiker treffen, um über ihre Nüchternheit zu reden, können sie sich AA-Gruppe nennen, vorausgesetzt, dass sie als Gruppe keine andere Bindung eingehen.
4. In ihren eigenen Angelegenheiten sollte jede AA-Gruppe selbstständig sein und keine andere Autorität als das eigene Gruppengewissen haben. Wenn eine Gruppe sich auch noch um das Wohlergehen der benachbarten Gruppen kümmert, sollte das gemeinsam beraten werden. Keine Gruppe, kein Komitee, kein Einzelner sollten jemals etwas tun, das die Gemeinschaft der AA als Ganzes angeht, ohne sich vorher mit den Vertrauensleuten des Gemeinsamen Dienstausschusses abgesprochen zu haben. Unser gemeinsames Wohlergehen steht an erster Stelle.
5. Jede Gruppe der Anonymen Alkoholiker sollte bestrebt sein, in spiritueller Übereinstimmung nur ein Hauptziel zu haben, die Botschaft an Alkoholiker weiterzugeben, die noch leiden.
6. Geld-, Besitz- und Autoritätsprobleme können uns leicht von unserem wichtigen spirituellen Ziel ablenken. Darum meinen wir, dass größere Besitztümer, die durch die Gemeinschaft der AA genutzt werden, separat geführt und verwaltet werden sollen, damit Materielles von Spirituellem getrennt wird. Eine AA-Gruppe sollte niemals Geschäfte machen. Untergeordnete Einrichtungen, die für die Gemeinschaft der AA nützlich sein könnten, wie Klubs, Krankenhäuser, bei denen die Besitzverhältnisse geregelt und die Verwaltung gewährleistet sein muss, sollten selbstständig und separat geführt werden. Wenn nötig, sollten sich die Gruppen von solchen Einrichtungen ungehindert trennen können. Diese Einrichtungen sollten niemals den Namen AA tragen. Die Geschäftsführung sollte nur denen gegenüber verantwortlich sein, die das Unternehmen finanzieren. In derartigen Klubhäusern werden vorzugsweise Anonyme Alkoholiker als Geschäftsführer eingestellt. Doch Krankenhäuser und andere Genesungsheime müssen medizinisch überwacht werden; die Leitung sollte nichts mit den AA zu tun haben. Obwohl jede AA-Gruppe mit anderen zusammenarbeiten kann, sollte aus der Zusammenarbeit niemals eine Verbindung oder Unterstützung einer anderen Organisation werden. Eine AA-Gruppe kann sich an keine andere außenstehende Gruppe binden.
7. AA-Gruppen sollten sich vollkommen selbst erhalten durch freiwillige Spenden ihrer eigenen Mitglieder. Nach unserer Ansicht sollte jede Gruppe diesen Idealzustand erreichen; jede öffentliche Sammlung unter dem Namen Anonyme Alkoholiker ist sehr gefährlich, ob sie nun von Gruppen, Klubs, Krankenhäusern oder außenstehenden Einrichtungen durchgeführt wird. Die Annahme größerer Geschenke oder Spenden, die mit irgendeiner Verpflichtung verbunden sind, ist unklug. Wir beobachten auch mit Sorge die Kassierer innerhalb unserer Gemeinschaft, die neben einer vernünftigen Reserve Gelder horten für neben dem festgeschriebenen AA-Ziel liegende Zwecke. Erfahrung lehrt und warnt uns, dass nichts unser spirituelles Erbe so endgültig zerstören kann wie unnötiger Streit um Besitz, Geld und Macht.
8. Die Tätigkeit innerhalb der Gemeinschaft der Anonymen Alkoholiker sollte immer ehrenamtlich sein. Unter professionellen Tätigkeiten verstehen wir die Ausübung eines Berufes als Berater für Alkoholiker gegen Entgelt. Wir können jedoch Alkoholiker einstellen, die mit Aufgaben betraut werden, für die wir sonst Nichtalkoholiker einstellen müssen. Diese Dienstleistungen werden gut bezahlt. Doch unsere normale Arbeit im Zwölften Schritt wird niemals bezahlt.
9. Jede AA-Gruppe braucht ein Mindestmaß an Organisation. Rotation in der Führung ist am besten. In einer kleinen Gruppe kann ein Sekretär (Gruppensprecher) gewählt werden, in einer größeren ein sogenanntes Rotationskomitee. Gruppen, die für ein bestimmtes Stadt- oder Landgebiet zuständig sind, wählen eine City-, Landes- oder Intergruppe. Sie haben häufig einen fest angestellten Mitarbeiter. Die Vertrauensleute des Gemeinsamen Dienstausschusses bilden das Dienstkomitee der AA. Sie sind die Wächter über unsere Traditionen und die Verwalter freiwilliger Spenden von Anonymen Alkoholikern oder deren Gruppen. Mit diesen Spenden wird das gemeinsame Dienstbüro in New York unterhalten. Die Vertrauensleute haben die Vollmacht der Gruppen, die allgemeine Öffentlichkeitsarbeit zu übernehmen, und sie garantieren für die Integrität unserer hauptsächlichen Zeitschrift, „AA-Grapevine“. Als solche Vertreter sehen sie in ihrer Tätigkeit eine dienende Aufgabe. Die wahren Führer unserer Gemeinschaft sind vertraute und erfahrene Diener des Ganzen. Aus ihrer Tätigkeit leiten sie keine Autorität ab; sie regieren nicht. Der ihnen allgemein entgegengebrachte Respekt ist der Schlüssel ihres nutzvollen Wirkens.
10. Keine AA-Gruppe und kein einzelner Anonymer Alkoholiker sollten je im Namen der AA irgendeine Meinung zu Fragen außerhalb der Gemeinschaft äußern, besonders dann nicht, wenn es sich um Politik, um Alkoholdiskussionen oder um religiöse Streitfragen handelt. Die Gruppen der Anonymen Alkoholiker stehen zu niemandem in Opposition. Sie können demnach in solchen Angelegenheiten keine Ansichten äußern.
11. Bei unseren Beziehungen zur Öffentlichkeit sollte unsere persönliche Anonymität gewahrt bleiben. Nach unserer Ansicht sollte die Gemeinschaft der AA auf sensationsheischende Reklame verzichten. Unsere Namen und Fotos sollten nicht im Zusammenhang mit den AA durch Radio, Film und Presse bekannt gemacht werden. Unsere Beziehung zur Öffentlichkeit stützt sich mehr auf Anziehung als auf Werbung. Es besteht keine Veranlassung, uns selbst anzupreisen. Wir fühlen uns wohler, wenn unsere Freunde für uns sprechen.
12. Und schließlich glauben wir Anonymen Alkoholiker, dass das Prinzip der Anonymität von ungeheurem spirituellem Wert ist. Wir werden daran erinnert, Prinzipien über Personen zu stellen. Wir müssen echte Demut beweisen. Die uns zuteilgewordene große Gnade sollte uns nie überheblich werden lassen. Wir sollten immer in Dankbarkeit an IHN denken, der über allem steht.

**Where the English quotes or discusses a phrase of the long form** that A.A.'s German words differently (the site does this a lot: "provided that, as a group, they have no other affiliation", "actual or implied", "bind itself to no one", "for no stated A.A. purpose", "gathered together for sobriety"): quote the matching German words from above («vorausgesetzt, dass sie als Gruppe keine andere Bindung eingehen», «Eine AA-Gruppe kann sich an keine andere außenstehende Gruppe binden») and, only where the point depends on an English word the German doesn't have (e.g. "actual or implied", "affiliation"), add the English once in brackets: «(im englischen Original: „actual or implied“)». Never invent a German "official" sentence that isn't above.
Tradition 3's clause, quoted all over the site: **„vorausgesetzt, dass sie als Gruppe keine andere Bindung eingehen“** — "affiliation" in the site's own prose: «Bindung» (and «Anbindung», «Zugehörigkeit zu einer anderen Organisation» where clearer).
**On the /12-traditions/ page** the English says both forms are printed "word for word, exactly as they appear in Alcoholics Anonymous": in German that is **true** (both are A.A.'s German, from the Blaue Buch). Say «… im Wortlaut der deutschsprachigen AA (Blaues Buch, Anhang 1)» and keep the English page numbers.

## The Twelve Concepts, short form — word for word [BB, Anhang 8, S. 443–446; = aa.at/12-konzepte]
1. Die letzte Verantwortung und die höchste Autorität für die AA-Weltdienste liegen stets im gemeinsamen Gewissen unserer gesamten Gemeinschaft.
2. Die Gemeinsame Dienstkonferenz der AA ist in praktisch allen Weltdienstbelangen die hörbare Stimme und das wirkende Gewissen unserer ganzen Gemeinschaft.
3. Wir empfehlen, alle AA-Elemente mit einer traditionellen „Entscheidungsbefugnis“ auszustatten, um eine wirksame Führung zu sichern: die Konferenz, den Gemeinsamen Dienstausschuss und seine Dienstunternehmen, Angestellte, Ausschüsse und Sachbearbeiter.
4. Alle Verantwortungsebenen erhalten einen traditionellen „Mitwirkungsanspruch“, der jedem ein Stimmrecht in angemessenem Verhältnis zu seiner jeweiligen Verantwortung einräumt.
5. In unserer gesamten Struktur herrsche ein traditionelles „Einspruchsrecht“, damit Meinungen von Minderheiten Gehör finden und individuelle Beschwerden sorgfältig erwogen werden.
6. Die Konferenz erkennt an, dass die hauptsächliche Initiative und aktive Verantwortung für fast alle Weltdienstangelegenheiten bei den treuhänderischen Konferenzmitgliedern liegen, wenn sie in ihrer Funktion als Gemeinsamer Dienstausschuss der Anonymen Alkoholiker handeln.
7. Die Charta und die Satzung des Gemeinsamen Dienstausschusses sind Geschäftsordnungsurkunden: Sie ermächtigen die Treuhänder, die Weltdienstaufgaben zu leiten und durchzuführen. Die Konferenzcharta ist kein Geschäftsordnungsdokument; sie stützt sich auf die Tradition und die AA-Kasse, um letztlich wirksam zu werden.
8. Die Treuhänder sind die Hauptplaner und -verwalter für Grundsatz- und Finanzfragen, soweit diese die Gemeinschaft als Ganzes betreffen. Sie beaufsichtigen die eigenständig eingetragenen und dauerhaft aktiven Dienstunternehmen treuhänderisch durch ihre Ermächtigung, alle Vorstände dieser Institutionen zu ernennen.
9. Gute Dienstführung auf allen Ebenen ist unerlässlich für unsere zukünftige Funktionsfähigkeit und Sicherheit. Die ursprünglich von den AA-Gründern ausgeübte höchste Weltdienstführung muss zwangsläufig von den Treuhändern übernommen werden.
10. Jede Dienstverantwortung sei mit der ihr entsprechenden Dienstautorität verbunden. Der Autoritätsbereich muss genau abgegrenzt sein.
11. Die Treuhänder brauchen stets bestmögliche Ausschüsse, Geschäftsführende Dienstdirektoren, leitende Angestellte, Sachbearbeiter und Berater. Zusammensetzung, Qualifikation, Berufungsmodalitäten sowie Rechte und Pflichten sind stets Gegenstand sorgfältiger Überlegung.
12. Die Konferenz befolge den Geist der AA-Tradition und achte darauf, dass sie niemals Sitz von gefährlichem Reichtum oder Macht wird; genügende Betriebsmittel und Rücklagen seien ihr umsichtiges Finanzprinzip; kein Konferenzmitglied darf in eine uneingeschränkte Machtstellung über ein anderes gesetzt werden; alle wichtigen Entscheidungen werden durch Aussprache, Abstimmung und, wenn irgend möglich, mit wesentlicher Einigkeit herbeigeführt; keine ihrer Maßnahmen darf jemals eine persönliche Bestrafung darstellen oder Anlass zu öffentlicher Auseinandersetzung bieten; sie übt niemals Hoheitsrechte aus; wie die Gemeinschaft, der sie dient, bleibt sie in ihrem Denken und Handeln stets demokratisch.

The /12-concepts/ page also prints each Concept's **long form** (from the Concepts book): not published in German online → translate it faithfully yourself **[ours]**, in the vocabulary above (Gemeinsame Dienstkonferenz, Gemeinsamer Dienstausschuss, Treuhänder, Entscheidungsbefugnis …), and keep the short forms exactly as above. "Substantial unanimity" = «wesentliche Einigkeit». Any "verbatim / official wording" claim on that page: true for the short form (A.A.'s German), say «Langform in unserer Übersetzung» for the long form.

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer — «Gelassenheitsspruch»** [BB S. 331; aa.de shop item 300 «Gelassenheitsspruch»]: «Gott, gebe mir die Gelassenheit, Dinge hinzunehmen, die ich nicht ändern kann, den Mut, Dinge zu ändern, die ich ändern kann, und die Weisheit, das eine vom andern zu unterscheiden.»
- **Third Step prayer** (English p. 63) [BB S. 73]: «Gott, ich gebe mich in Deine Hand, richte mich auf und tu mit mir nach Deinem Willen. Erlöse mich von den Fesseln meines Ichs, damit ich Deinen Willen besser erfüllen kann. Nimm meine Schwierigkeiten hinweg, damit der Sieg über sie Zeugnis von Deiner Macht, Deiner Liebe, Deiner Führung ablegen möge vor den Menschen, denen ich helfen möchte. Möge ich immer Deinen Willen tun!»
- **Seventh Step prayer** (English p. 76) [BB S. 87–88]: «Mein Schöpfer, ich bin nun willig, mich Dir ganz auszuliefern mit allen meinen guten und schlechten Seiten. Ich bitte, die Charaktermängel jetzt von mir zu nehmen, die mich daran hindern, Dir und meinen Mitmenschen gegenüber nützlich zu sein. Gib mir Kraft, von jetzt an Deinen Willen auszuführen. Amen.»
  - If the English discusses a single phrase of the English prayer ("bondage of self", "My Creator", "every single defect", "good and bad"), quote the German words that carry it («die Fesseln meines Ichs», «Mein Schöpfer», «mit allen meinen guten und schlechten Seiten») and, where the point depends on the exact English word, add the English once in brackets: «(engl. „every single defect“)».
- **The A.A. Preamble** [aa.de/unsere-idee/praeambel]: «Anonyme Alkoholiker sind eine Gemeinschaft von Menschen, die miteinander ihre Erfahrung, Kraft und Hoffnung teilen, um ihr gemeinsames Problem zu lösen und anderen zur Genesung vom Alkoholismus zu verhelfen. Die einzige Voraussetzung für die Zugehörigkeit ist der Wunsch, mit dem Trinken aufzuhören. Die Gemeinschaft kennt keine Mitgliedsbeiträge oder Gebühren, sie erhält sich durch eigene Spenden. Die Gemeinschaft AA ist mit keiner Sekte, Konfession, Partei, Organisation oder Institution verbunden; sie will sich weder an öffentlichen Debatten beteiligen, noch zu irgendwelchen Streitfragen Stellung nehmen. Unser Hauptzweck ist, nüchtern zu bleiben und anderen Alkoholikern zur Nüchternheit zu verhelfen.»
- A prayer or fixed text quoted in part uses these words, cut, not reworded.

## Big Book quotes — A.A.'s German where it exists
The site quotes the Big Book on almost every page (each `/big-book/page-N/` page has one short quote). German-speaking A.A.'s book is online, chapter by chapter, so:
1. **These passages always use A.A.'s German** [BB]:
   - p. 58 (S. 67): "Rarely have we seen a person fail who has thoroughly followed our path." → «Selten haben wir jemanden scheitern sehen, der unseren Weg gewissenhaft gegangen ist.» · "Our stories disclose in a general way what we used to be like, what happened, and what we are like now." → «Unsere Lebensgeschichten offenbaren, wie wir waren, was geschah und wie wir heute sind.»
   - pp. 58–59 (S. 68): «Denken Sie daran, dass wir es mit Alkohol zu tun haben: Er ist verschlagen, trügerisch, mächtig! Ohne Hilfe ist es viel zu schwer für uns. Aber es gibt einen, der alle Kraft hat – und das ist Gott. Mögen Sie ihn jetzt finden! Halbe Sachen nützten uns nichts. Wir standen am Wendepunkt.» · "Here are the steps we took, which are suggested as a program of recovery:" → «Hier sind die Schritte, die wir gegangen sind und die als Programm zur Genesung empfohlen werden.»
   - p. 60 (S. 69): the ABC → «a) Dass wir Alkoholiker sind und unser Leben nicht mehr meistern konnten. b) Dass wahrscheinlich keine menschliche Macht uns vom Alkoholismus befreien konnte. c) Dass Gott es tun konnte und würde, wenn wir Ihn suchten.» · "We claim spiritual progress rather than spiritual perfection." → «Wir streben eher nach spirituellem Fortschreiten als nach spiritueller Vollkommenheit.»
   - pp. 63, 76: the two prayers above.
   - pp. 83–84 (S. 96–97), **the Promises**: «Wenn wir in diesem Abschnitt unserer Entwicklung sehr gewissenhaft sind, werden wir verblüfft sein, noch bevor wir den Weg zur Hälfte zurückgelegt haben. Wir werden eine neue Freiheit und ein neues Glück kennenlernen. Wir wollen die Vergangenheit weder beklagen noch wünschen, die Tür hinter ihr zuzuschlagen. Wir werden verstehen, was das Wort Gelassenheit bedeutet und erfahren, was Frieden ist. Wie tief wir auch gesunken waren, wir werden merken, dass andere aus unseren Erfahrungen Nutzen ziehen können. Das Gefühl der Nutzlosigkeit und des Selbstmitleids wird verschwinden. Unsere Ichbezogenheit wird in den Hintergrund treten, das Interesse an unseren Mitmenschen wachsen. Unsere Selbstbezogenheit wird dahinschmelzen. Unsere Einstellung zum Leben und unsere Erwartungen werden sich ändern. Angst vor den Menschen und vor wirtschaftlicher Ungewissheit werden schwinden. Ohne lange nachzudenken, werden wir jetzt mit Situationen fertig, die uns früher umgeworfen haben. Plötzlich wird uns bewusst, dass Gott für uns das erledigt, wozu wir allein nicht in der Lage sind. Sind das alles übertriebene Versprechen? Wir meinen nicht. Sie werden überall bei uns Wirklichkeit – manchmal schneller, manchmal langsamer. Sie werden sich immer erfüllen, wenn wir daran arbeiten!»
   - p. 85 (S. 98): «Wir sind nicht vom Alkoholismus geheilt. Alles, was wir in der Hand haben, ist eine tägliche Bewährungsfrist unter der Bedingung, unser spirituelles Leben instand zu halten. Jeden Tag aufs Neue müssen wir den Gedanken an Gottes Willen in unser Tun einbeziehen: „Wie kann ich Dir am besten dienen – Dein Wille geschehe (nicht meiner)!“»
   - p. 164 (S. 192): «Geben Sie sich jetzt ganz in die Hand Gottes, wie Sie Ihn verstehen. Gestehen Sie Ihm und Ihren Freunden Ihre Fehler ein. Räumen Sie die Trümmer aus Ihrer Vergangenheit beiseite. Geben Sie freimütig von dem, was Sie finden – und kommen Sie zu uns. Wir werden mit Ihnen in spiritueller Gemeinschaft verbunden sein – und Sie werden bestimmt einigen von uns begegnen auf dem beschwerlichen Weg zum glücklichen Ziel. Bis dahin möge Gott Sie segnen und behüten.»
   - p. 417 (story «Akzeptieren ist die Lösung», German book S. 229): «Heute ist Akzeptieren die Lösung für all meine Probleme. Wenn ich unruhig bin, dann liegt das daran, dass ich irgendeine Person, einen Ort, eine Sache oder eine Situation – irgendeine Tatsache in meinem Leben – nicht aushalte. Und ich finde erst dann Gelassenheit, wenn ich akzeptiere, dass diese Personen, Orte, Sachen oder Situationen genauso sind, wie sie zu diesem Zeitpunkt sein sollen.»
2. **Any other quote from The Doctor's Opinion or chapters 1–11 (English pp. xxv–164)**: look it up in A.A.'s German first. Fetch the chapter (`curl -sLO https://www.anonyme-alkoholiker.de/downloads/blauesbuch/bbNN.pdf && pdftotext -layout bbNN.pdf -`) and find the passage around the German page this table gives (German page ≈ German chapter start + (English page − English chapter start) × 1.15):

   | English chapter (pp.) | file | German pages |
   |---|---|---|
   | The Doctor's Opinion (xxv–xxxii) | bb10.pdf | (roman) |
   | 1 Bill's Story (1–16) | bb21.pdf | 1–19 |
   | 2 There Is a Solution (17–29) | bb22.pdf | 21–34 |
   | 3 More About Alcoholism (30–43) | bb23.pdf | 35–50 |
   | 4 We Agnostics (44–57) | bb24.pdf | 51–66 |
   | 5 How It Works (58–71) | bb25.pdf | 67–82 |
   | 6 Into Action (72–88) | bb26.pdf | 83–102 |
   | 7 Working with Others (89–103) | bb27.pdf | 106–120 |
   | 8 To Wives (104–121) | bb28.pdf | 121–141 |
   | 9 The Family Afterward (122–135) | bb29.pdf | 143–158 |
   | 10 To Employers (136–150) | bb30.pdf | 159–175 |
   | 11 A Vision for You (151–164) | bb31.pdf | 177–192 |
   | Dr. Bob's Nightmare (171–181) / AA Number Three (182–192) / Acceptance Was the Answer (407–419) / Freedom from Bondage (544–553) | bb42 / bb43 / bb44 / bb45 | |
   | Appendices: Spiritual Experience (567–568) / Medical View / Lasker / Religious View | bb74 / bb75 / bb76 / bb77 | 427– |

   If you find it, copy A.A.'s German **exactly** (only the part the English quotes; fix nothing; „…“ around it as the English has quotes) and credit it as below with «Übersetzung der deutschsprachigen AA (Blaues Buch, S. N)», N = the German page. If you can't find it in a few minutes, or the German is so free that it doesn't carry what the English page then discusses, translate it yourself, credit «eigene Übersetzung», and list the id under `unsure:` with "own translation". The Super checks every quote credited to A.A. against the book by script, so never put A.A.'s name on your own words.
3. **Quotes from the other personal stories** (most of pp. 171–561 are not in the German book), from pamphlets or Grapevine: translate faithfully yourself, «eigene Übersetzung», and use the same German each time the same English line comes back in your batch (search your file before you write it again).
4. **The credit line.** "— <0>Alcoholics Anonymous</0>, 4th Edition, page N. A short quotation, for identification and study. <1>Read the whole page in your own copy →</1>" becomes «— <0>Alcoholics Anonymous</0>, 4. Auflage (englisch), Seite N; eigene Übersetzung. Ein kurzes Zitat, zum Wiedererkennen und Studieren. <1>Lesen Sie die ganze Seite in Ihrem eigenen Exemplar →</1>», and for A.A.'s German «…, Seite N; Übersetzung der deutschsprachigen AA (Blaues Buch, S. 98). Ein kurzes Zitat, …». Keep the English's placeholders around the same words; N stays the English page.

## Site words
| English | German |
|---|---|
| Daily Reflection (our section, and A.A.'s reading it follows) | **Gedanken zum Tag** — A.A.'s German name for *Daily Reflections* is «Heute. Gedanken zum Tag» [aa.de]; "the AA Daily Reflection for October 14" → «die AA-Gedanken zum Tag vom 14. Oktober» |
| Today's Reflection | Gedanken zum heutigen Tag |
| Daily Tradition / Daily Traditions (the series) / Today's Tradition | Tradition des Tages / Traditionen des Tages / Heutige Tradition |
| Daily Reading (menu) | Täglich lesen |
| Recovery Einstein's Big Book perspective | Recovery Einsteins Sicht aus dem Blauen Buch |
| Read today's official reflection at aa.org → | Die heutige offizielle Reflexion auf aa.org lesen → (aa.org's English text; say «auf Englisch» only if the English does) |
| a question to sit with / Sit with | eine Frage zum Nachdenken / Zum Nachdenken |
| Meetings Map / Online Meetings / Find a meeting | Meeting-Karte / Online-Meetings / Meeting finden |
| Talk to Recovery Einstein | Mit Recovery Einstein sprechen |
| You're not alone / You don't have to face it alone | Sie sind nicht allein / Sie müssen das nicht allein durchstehen |
| Get the App / the menu's "Get the App" / web app | App holen / App / Web-App |
| AI / AI chat | KI / KI-Chat |
| Donate / Donate — keep it free | Spenden / Spenden – damit es kostenlos bleibt |
| free | kostenlos (kostenfrei for a phone call) |
| Home (breadcrumb) | Startseite |
| ← Previous / Next → | ← Zurück / Weiter → (with a page: «← Seite 203», «Seite 205 →») |
| Page by page / Big Book Search Engine | Seite für Seite / Suchmaschine für das Blaue Buch |
| Section / Chapter / Page | Teil / Kapitel / Seite (S. in references) |
| Tradition N · live (month grid) | Tradition N · verfügbar |
| Tradition N · 30 readings | Tradition N · 30 Texte |
| Ask Recovery Einstein about Tradition N → | Recovery Einstein nach Tradition N fragen → |
| Daily Tradition card tags — the same on every card | the threat → die Gefahr · the threat today → die Gefahr heute · before the tradition → vor der Tradition · how a group breaks it → wie eine Gruppe sie bricht · how it gets captured → wie sie vereinnahmt wird · the earned answer → die erarbeitete Antwort · where it goes wrong → wo es schiefgeht |
| In plain terms | Einfach gesagt |
| 𝕏 Post / Facebook / Copy Link (share bar) | Auf 𝕏 posten / Facebook / Link kopieren |
| Short form / Long form | Kurzform / Langform [BB: «Kurzform», «Langform»] |
| Read page N — actual pages, free → | Seite N lesen – die echten Seiten, kostenlos → |
| Not verified yet | Noch nicht geprüft |
| email | E-Mail |
| The questions people actually ask | Die Fragen, die Menschen wirklich stellen |
| Related: | Verwandte Fragen: |
