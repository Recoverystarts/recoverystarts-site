# Polish glossary — the words every pl1 runner uses the same way

*Started 2026-10-13 by wave pl1 S1-pl (the super). Standard written Polish, plain and warm. The reader is **ty**, written in **lower case** (see "Form of address"). Where Polish A.A. prints its own Polish, we use it word for word; the source is in brackets. **[ours]** marks a wording Polish A.A. hasn't published online: it's ours, fixed here so every page says it the same way. Add to this file through your close (`unsure:`), not by changing it mid-wave. **Never N.A.'s Polish (Anonimowi Narkomani's Basic Text or pamphlets) and never the Twelve Steps and Twelve Traditions** («Dwanaście Kroków i Dwanaście Tradycji», "the 12 and 12"), even if you know them.*

## Sources (checked 2026-10-13, all read directly on the publisher's own URL)
- **[aa.org.pl]** — the site of Fundacja Biuro Służby Krajowej Anonimowych Alkoholików w Polsce (Polish A.A.'s General Service Office, BSK): `/12-krokow-aa/` (Steps), `/12-tradycji-aa/` (Traditions, short form), `/12-koncepcji/` («12 Koncepcji dla służb AA w Polsce», Poland's own adaptation, reprinted with A.A.W.S. permission), `/wspolnota-aa/`, `/o-nas/`, `/anonimowosc-w-aa/`, `/co-to-jest-mityng/`, `/czy-aa-jest-dla-ciebie/`, `/mam-problem-z-alkoholem/`, `/aa-pytania-i-odpowiedzi/`, `/jak-zaniezc-sponsora/`, `/informacje-dla-rodzin-i-przyjaciol/`.
- **[Katalog]** — the BSK's literature catalogue, `aa.org.pl/wp-content/uploads/2025/04/Katalog_literatury_2025.pdf`: book and pamphlet titles; poster P-26 (the Twelve Steps, © A.A.W.S., and the Preamble); the cards «Modlitwa o pogodę ducha» and «Preambuła AA»; three Big Book quote cards from the Polish 4th edition: I-41 «Jak to działa», s. 58–59; I-42 «Do czynu», s. 84–85; I-45 «Wizja dla ciebie», s. 164.
- **[Region Warszawa]** — meeting cards written by A.A. Region Warszawa's literature team («Zespół ds. Literatury AA Region Warszawa»), each saying «Tekst modlitwy pochodzi z książki ANONIMOWI ALKOHOLICY, wydanej przez Biuro Służby Krajowej»: `intergrupapw.pl/do_pobrania/Modlitwa_Trzeciego_Kroku.pdf` and `…/Modlitwa_Siodmego_Kroku.pdf` (hosted by Intergrupa AA «Południowa Wielkopolska»). These follow an **earlier** Polish edition of the Big Book; the 4th edition's full prayer texts are not online anywhere we could find (an A.A. step-workshop handout quotes only their first and last words: «Boże, ofiaruję siebie Tobie… Obym zawsze spełniał Twoją wolę» and «Mój Stwórco chciałbym oddać Ci… jako że teraz będę czynił Twoją wolę. Amen»). We use the Region Warszawa texts whole, because they're the only complete A.A. Polish published; never mix in the 4th-edition fragments.
- aa.org has no Polish literature online. Older A.A. cards (e.g. Region Warszawa's «kroki_tradycje.pdf» with «przestaliśmy kierować własnym życiem») carry an **old** Steps/Traditions translation: never use it.

**Which wording, and why.** Steps: aa.org.pl's page and poster P-26 print the same words; where they differ by a slip we follow P-26, the printed card © A.A.W.S. (Step 8 has a comma before «i staliśmy się»; Step 11 has «tak jak **Go** rozumieliśmy» with a capital G, as Step 3 does; the web page's lower-case «go» is a slip). Traditions short form: aa.org.pl. Preamble and Serenity Prayer: the Katalog's cards. Concepts: the world Concepts the English site prints have **no** Polish publication; aa.org.pl prints Poland's own adaptation. Ours = Polish A.A.'s Concept sentences with the world structure put back where the English names it (marked below). Long form of the Traditions: not published by Polish A.A. online (only inside the Big Book and the 12 & 12) → **ours**, below.

## Form of address
- **ty, lower case**: «możesz», «twoje picie», «jeśli zdecydowałeś». That's how Polish A.A. addresses the reader in its literature (Big Book cards: «Bóg będzie wciąż ujawniał coraz więcej – tobie i nam», «Jeśli twoje sprawy są uporządkowane», «Obyś znalazł Go teraz!») and on aa.org.pl («Czy AA jest dla Ciebie?», «możemy Ci pomóc» — the website capitalises; we follow the books, so quotes and our prose never clash).
- **Capitals are kept for God** (On, Jego, Ty, Ci, Twoja wola, Go) — that's in the prayers and Steps. So a capital «Twój/Ciebie» in our prose reads like a prayer: don't write it. Exception: a pamphlet title as A.A. prints it, «Czy AA jest dla Ciebie?».
- Never Pan/Pani/Państwo and never plural «wy» (możecie, wasz) for the reader. `score.mjs pl` flags them (`reg` column).
- **Gender:** prefer forms that don't need it (present/future tense: «możesz», «zaczniesz»; «warto», «można»). Where a past-tense or adjective form can't be avoided, use the **masculine generic**, as Polish A.A.'s Big Book and Q&A do («jeśli zdecydowałeś», «Nie jesteś sam»). No slashes («zrobiłeś/aś») in prose.

## How to write a segment
- Placeholder form: keep every `<0>…</0>` and `<1/>` the English has, around the words that belong in them, in the order Polish needs. Don't type HTML.
- `node scripts/i18n/check.mjs pl <your-batch>` = 0 problems. `node scripts/i18n/score.mjs pl` shows `reg` (wrong register, ASCII quotes, stripped diacritics) — keep it at 0.
- **Diacritics always**: ą ć ę ł ń ó ś ź ż. A long segment with none is flagged.
- **Quotes:** „…” (low-high). A quote inside a quote: «…» inside „…”. Never "…" or “…” in Polish prose. Apostrophes in names stay: Claude's Lab, Bill's Story (in an English title).
- **Dashes:** Polish uses the en dash with spaces « – » between clauses. Keep a range as 1937–1950, s. 58–59 (no spaces).
- **Non-breaking spaces:** after one-letter words (a, i, o, u, w, z, A, I, O, U, W, Z) and inside numbers (1 234), the desk puts a no-break space at the merge (`fix_pl.py`). Type a normal space; don't hunt for special characters.
- **Numbers:** 1 234 (space for thousands; 4-digit numbers may stay 1234), 2,99 (decimal comma), 30 000 dolarów. Prices: «2,99 USD». Times: 19:30 (24-hour; "7:00 pm" → «19:00»). Years: «w 1935 roku» (or «w 1935 r.»). Ordinals: «12. Krok» is rare — write «Krok 12» or «Dwunasty Krok».
- **Dates** (Gregorian, as the English): the day plus the month in the **genitive**, lower case: «13 października», «1 stycznia», «13 października 2026». A month on its own as a title or label: **nominative, capital** — «Październik», «Styczeń». "in October" → «w październiku». "All of October" → «Cały październik». "October 12 — Title" → «12 października — tytuł».
  - nominative: Styczeń, Luty, Marzec, Kwiecień, Maj, Czerwiec, Lipiec, Sierpień, Wrzesień, Październik, Listopad, Grudzień
  - genitive (dates): stycznia, lutego, marca, kwietnia, maja, czerwca, lipca, sierpnia, września, października, listopada, grudnia
  - locative (w …): w styczniu, w lutym, w marcu, w kwietniu, w maju, w czerwcu, w lipcu, w sierpniu, we wrześniu, w październiku, w listopadzie, w grudniu
  - weekdays (lower case): poniedziałek, wtorek, środa, czwartek, piątek, sobota, niedziela
- **Page references stay the English 4th Edition's numbers**: «s. 417», «strona 86», «s. 58–59», «s. 561–562». The Polish 4th edition's pages are close but not always the same (the Seventh Step prayer is p. 76 in English, s. 77 in Polish): never swap in Polish page numbers.
- **Arrows:** keep → ← › exactly as the English has them.
- **Names:** Bill W. (Billa W., Billowi W., z Billem W.), doktor Bob / dr Bob (declined: doktora Boba), Lois, Ebby T., Akron, Silkworth (doktor Silkworth), Carl Jung, the Oxford Group → Grupa Oksfordzka, Derick (Dericka, Derickowi), Red Deer w Albercie. **Recovery Einstein** declines on «Einstein»: Recovery Einsteina, Recovery Einsteinowi, z Recovery Einsteinem, o Recovery Einsteinie; alone «Einstein». Brands stay as written: Recovery Starts, Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Seeker, Pro, Google Play, aa.org.
- Watch for lost negatives: «nie», «nigdy … nie», «żaden … nie», «z wyjątkiem», «ani». A dropped «nie» turns a Tradition upside down (Tradition 6 «nigdy nie powinna», 9 «nie powinno nigdy», 10 «nie zajmują stanowiska … nie zostało nigdy uwikłane»).
- Meta descriptions (the short text Google shows) end on a full sentence, never cut mid-sentence.
- **One segment is live JavaScript** (daily-reflection, the share bar: `<2>this.textContent='Copy Link',2000);return false;">Copy Link</2>`). Translate only the two words «Copy Link» → «Kopiuj link», both of them, and leave every other character exactly as it is.
- Translate it yourself; no Google or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-13, each on the service's own site):
- **Poland — 112**, numer alarmowy (emergency: ambulance, police, fire) [gov.pl/web/numer-alarmowy-112].
- **Poland — 116 123**, Kryzysowy Telefon Zaufania, for **adults** in emotional crisis; **free, 24/7** [116sos.pl: «telefon 116 123 dostępny 24/7», «Wsparcie dla osób dorosłych», «Bezpłatne»; the operator Instytut Psychologii Zdrowia, psychologia.edu.pl/kryzysy-osobiste/telefon-kryzysowy-116123.html, says the line became the 116sos.pl platform, 24/7 (an older line on that page still says 14:00–22:00; 116sos.pl is current)]. (116123.pl itself is a parked domain — not the service.)
- **Poland — 800 70 2222**, Centrum Wsparcia dla Osób Dorosłych w Kryzysie Psychicznym; **free, 24 hours, 7 days a week**; also chat and e-mail [centrumwsparcia.pl: «Bezpłatnie · Całodobowo · 7 dni w tygodniu», «Zadzwoń pod bezpłatny numer 800 70 2222»].
- **Poland — 116 111**, Telefon Zaufania dla Dzieci i Młodzieży (Fundacja Dajemy Dzieciom Siłę), for **under-18s**; **free, 24/7, anonymous** [116111.pl: «Telefon jest anonimowy, bezpłatny, całodobowy»]. Use it only where the English speaks of young people or teens.
- **Canada — 9-8-8**: call or text, English and French, 24/7; "if you would like to speak to someone in another language, this **may be available** by phone, via an interpreter" [988.ca/get-help/what-to-expect]. Text: English/French only.
- **USA — 988**: call, text and chat in English and Spanish; **a call gets a free interpreter in 240+ more languages** (Polish among them — say "Polish" when it answers); **text and chat have no interpreter** [samhsa.gov/mental-health/988/faqs].
- Dropped: nothing confirmed was dropped; all four Polish lines were confirmed on their own sites. Not used: other regional or NGO lines.

So on a pl page **never write "zadzwoń lub napisz SMS pod 988" alone** — a Polish speaker who texts 988 gets English, and a reader in Poland can't reach 988 at all. Poland first, then North America. Use these, word for word:

| English | Polish |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | Jesteś teraz w kryzysie? W Polsce zadzwoń pod bezpłatny numer 116 123 lub 800 70 2222 (wsparcie dla dorosłych, całą dobę), a gdy zagrożone jest życie — pod 112. W USA i Kanadzie zadzwoń pod 988 i poproś o tłumacza na polski. Nie jesteś sam. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | Jeśli jesteś w kryzysie, w Polsce zadzwoń pod bezpłatny numer 116 123 lub 800 70 2222 (całą dobę), a gdy zagrożone jest życie — pod 112; w USA i Kanadzie zadzwoń pod 988 (Suicide & Crisis Lifeline) i poproś o tłumacza na polski. |
| In crisis? Call or text 988 — free, 24/7, confidential. | Jesteś w kryzysie? W Polsce zadzwoń pod 116 123 lub 800 70 2222 — bezpłatnie, całą dobę, poufnie; gdy zagrożone jest życie — 112. W USA i Kanadzie zadzwoń pod 988 i poproś o tłumacza na polski. |
| …988 inside a longer sentence | «988 (w USA i Kanadzie; telefonicznie, z prośbą o tłumacza na polski)» and, where the sentence has room, «w Polsce 116 123 lub 800 70 2222» |
| 988 Crisis Lifeline (a button/link) | Linia kryzysowa 988 (USA i Kanada) |
| a teen / young person in crisis | (in Poland) 116 111 — Telefon Zaufania dla Dzieci i Młodzieży, bezpłatnie, całą dobę |
| Call 911 / go to the emergency room | Zadzwoń pod numer alarmowy (w Polsce 112, w USA i Kanadzie 911) / idź na szpitalny oddział ratunkowy (SOR) |
| free, 24/7, confidential | bezpłatnie, całą dobę, poufnie |
| detox / medical detox | detoks / detoks pod opieką lekarza (oddział detoksykacyjny) [aa.org.pl: «oddział detoksykacji»] |
| withdrawal / alcohol withdrawal / withdrawal symptoms | odstawienie / alkoholowy zespół abstynencyjny / objawy odstawienne [aa.org.pl: «objawy odstawienne»] |
| withdrawal can be dangerous — even fatal | odstawienie alkoholu może być niebezpieczne, a nawet śmiertelne |
| not medical advice | to nie jest porada medyczna |
| treatment / treatment center / rehab | leczenie / ośrodek leczenia uzależnień / odwyk (terapia) |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988; it's a `tel:988` link). Every crisis/988/detox/withdrawal segment is read by the super.

## Fellowships and books
| English | Polish |
|---|---|
| Alcoholics Anonymous | Anonimowi Alkoholicy; the fellowship: «Wspólnota Anonimowych Alkoholików», «Wspólnota AA» [aa.org.pl] |
| A.A. (the abbreviation) | **AA**, no periods, not declined: «w AA», «do AA», «członek AA», «grupa AA», «mityng AA» [aa.org.pl everywhere]. As a subject it's neuter singular: «AA jest otwarte», «AA, jako takie, nie powinno» [aa.org.pl, Tradition 9]. Keep the periods only in proper names: A.A. World Services, Inc.; A.A. Grapevine, Inc.; A.A.W.S. |
| a member / members | członek AA, członkowie AA; also «uczestnik/uczestnicy AA» [aa.org.pl] |
| Narcotics Anonymous / N.A. | Anonimowi Narkomani (NA) — the name only; never its literature |
| Gamblers Anonymous | Anonimowi Hazardziści (GA) |
| Cocaine Anonymous, Crystal Meth Anonymous, Sex Addicts Anonymous, Recovery Dharma, SMART Recovery, Celebrate Recovery | names stay in English (CA, CMA, SAA, RD…) |
| Al-Anon / Alateen | Al-Anon, Grupy Rodzinne Al-Anon / Alateen [aa.org.pl] |
| the Big Book | **Wielka Księga** (Wielkiej Księgi, Wielką Księgę, w Wielkiej Księdze); its title: «Anonimowi Alkoholicy» [Katalog: «Książka znana jest również jako Wielka Księga»] |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i>, wyd. IV (angielskie) — in running text «Wielka Księga, wydanie IV» |
| Twelve Steps and Twelve Traditions ("12 & 12") — only when the English names the book | «Dwanaście Kroków i Dwanaście Tradycji» [Katalog] — never a source |
| Daily Reflections | «Codzienne refleksje» [Katalog] |
| As Bill Sees It | «Jak to widzi Bill» [Katalog] |
| A.A. Comes of Age | «Anonimowi Alkoholicy wkraczają w dojrzałość» [Katalog] |
| "Pass It On" | «Przekaż dalej» [Katalog] |
| Dr. Bob and the Good Oldtimers | «Doktor Bob i dobrzy weterani» [Katalog] |
| The Language of the Heart | «Język serca» [Katalog] |
| Living Sober | «Życie w trzeźwości» [Katalog] |
| Came to Believe | «Uwierzyliśmy» [Katalog] |
| The Best of Bill | «The Best of Bill» [Katalog] |
| This is A.A. / A Newcomer Asks / The A.A. Group / Questions & Answers on Sponsorship / Problems Other Than Alcohol / Many Paths to Spirituality / The "God" Word / Young People and A.A. / Is A.A. for You? / 44 Questions | «To jest AA» / «Nowicjusz pyta» / «Grupa AA» / «Sponsorowanie. Pytania i odpowiedzi» / «Problemy inne niż alkohol» / «Wiele dróg do duchowości» / «Słowo „Bóg”. Agnostycy i Ateiści w AA» / «Młodzi i AA» / «Czy AA jest dla Ciebie?» / «AA pytania i odpowiedzi» [Katalog] |
| A.A. Tradition — How It Developed (P-17) | «Tradycja AA – jak się rozwijała» (P-17) [ours] |
| Grapevine / La Viña | „Grapevine” / „La Viña” [Katalog]; Polish A.A.'s own magazine is «Zdrój» — don't swap it in for Grapevine |
| the A.A. Preamble | Preambuła AA [Katalog] (text below) |
| the Promises | Obietnice [ours for the name; the passage, Big Book pp. 83–84, begins in Polish A.A.'s words «Poznamy nową wolność i nowe szczęście» — card I-42] |

### Big Book chapters
Polish A.A. prints three chapter titles in its catalogue; the rest are **[ours]**, fixed here.
| English | Polish |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | Przedmowa do pierwszego wydania (drugiego, trzeciego, czwartego) [ours] |
| The Doctor's Opinion | Opinia lekarza [ours] |
| 1 Bill's Story | Historia Billa [ours] |
| 2 There Is a Solution | Jest rozwiązanie [ours] |
| 3 More About Alcoholism | Więcej o alkoholizmie [ours] |
| 4 We Agnostics | My, agnostycy [ours] |
| 5 How It Works | **Jak to działa** [Katalog I-41] |
| 6 Into Action | **Do czynu** [Katalog I-42] |
| 7 Working with Others | Praca z innymi [ours] |
| 8 To Wives | Do żon [ours] |
| 9 The Family Afterward | Rodzina potem [ours] |
| 10 To Employers | Do pracodawców [ours] |
| 11 A Vision for You | **Wizja dla ciebie** [Katalog I-45] |
| Personal Stories – Part I / II / III | Historie osobiste – część I / II / III [Katalog: «historie osobiste»] |
| Appendices / Appendix I – The A.A. Tradition / II Spiritual Experience / III The Medical View / IV The Lasker Award / V The Religious View / VI How to Get in Touch / VII Twelve Concepts | Dodatki / Dodatek I – Tradycja AA / II Doświadczenie duchowe / III Opinia medyczna / IV Nagroda Laskera / V Opinia religijna / VI Jak nawiązać kontakt / VII Dwanaście Koncepcji [ours] |
| Chapter 3 – More About Alcoholism | Rozdział 3 – Więcej o alkoholizmie (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | Polish |
|---|---|
| fellowship (A.A.'s) | Wspólnota (capital W when it means A.A.) [aa.org.pl]; a fellowship in general: wspólnota |
| meeting | mityng (mityngu, na mityngu, mityngi) [aa.org.pl]; a room: sala |
| open / closed meeting | mityng otwarty / mityng zamknięty [aa.org.pl] |
| speaker meeting / online meeting | mityng spikerski / mityng online [aa.org.pl] |
| sharing / to share | dzielenie się / dzielić się (doświadczeniem, siłą i nadzieją) [aa.org.pl, Preamble] |
| home group | grupa macierzysta [Katalog: «Grupa macierzysta – Zeszyt nr 6»] |
| group conscience | sumienie grupy; in Tradition 2: «nasze grupowe sumienie» [Tradition 2] |
| sponsor / sponsee / sponsorship / to sponsor | sponsor / sponsorowany (podopieczny also fine) / sponsorowanie / sponsorować [aa.org.pl, Katalog] |
| newcomer | nowicjusz; «nowo przybyły» also [Katalog] |
| old-timer | weteran [Katalog: «Doktor Bob i dobrzy weterani»] |
| sobriety / sober / to get sober | trzeźwość / trzeźwy / wytrzeźwieć, osiągnąć trzeźwość [aa.org.pl, Preamble]; "stay sober" «trwać w trzeźwości» |
| abstinence | abstynencja [aa.org.pl] |
| recovery / to recover | zdrowienie / zdrowieć, wyzdrowieć [aa.org.pl «Program Zdrowienia»]; in Tradition 1 «powrót do zdrowia» |
| the program | Program AA, Program Zdrowienia [aa.org.pl] |
| relapse / slip | powrót do picia (nawrót) [ours; aa.org.pl: «powrót do destrukcyjnego picia»] |
| alcoholism / the disease | alkoholizm / choroba alkoholowa [aa.org.pl] |
| the Steps / Step One / Twelfth Step work | Kroki / Krok Pierwszy (Pierwszy Krok, Krok 1) / praca w Dwunastym Kroku, niesienie posłania [aa.org.pl] — **Krok, Tradycja, Koncepcja capitalised** as aa.org.pl does |
| the Traditions / the Concepts | Tradycje / Koncepcje (Dwanaście Koncepcji dla Służb Światowych) |
| inventory / moral inventory / personal inventory | inwentura / inwentura moralna / osobista inwentura [Steps 4, 10] |
| resentment | uraza (urazy) [ours, the usual word] |
| defects of character | wady charakteru [Step 6] |
| shortcomings | braki [Step 7] |
| the exact nature of our wrongs | istota naszych błędów [Step 5] |
| amends / make amends | zadośćuczynienie / zadośćuczynić [Steps 8–9] |
| Higher Power | Siła Wyższa [Katalog: «„Siła Wyższa”»] — Step 2's own words: «Siła większa od nas samych» |
| God as we understood Him | Bóg, tak jak Go rozumieliśmy [Steps 3, 11] — "God as you understand Him" «Bóg, tak jak Go rozumiesz» |
| spiritual awakening | przebudzenie duchowe [Step 12: «Przebudzeni duchowo»] |
| powerless over alcohol | bezsilni wobec alkoholu [Step 1] |
| our lives had become unmanageable | nasze życie stało się niekierowalne [Step 1] — "unmanageable" alone: «niekierowalne» |
| restore us to sanity | przywrócić nam zdrowy rozsądek [Step 2] |
| conscious contact with God | świadomy kontakt z Bogiem [Step 11] |
| carry the message | nieść posłanie [Step 12, Tradition 5] |
| the alcoholic who still suffers | alkoholik, który wciąż jeszcze cierpi [Tradition 5] |
| primary purpose | główny cel [Traditions 5, 6] |
| self-supporting / the Seventh Tradition | samowystarczalny [Tradition 7, Preamble] / 7 Tradycja, Siódma Tradycja [aa.org.pl]; the collection: «zbiórka na 7 Tradycję» [ours] |
| trusted servants | zaufani słudzy [Tradition 2] |
| principles before personalities | zasady są ważniejsze od osobowości [Tradition 12] |
| attraction rather than promotion | przyciąganie, a nie reklamowanie [Tradition 11] |
| outside issues | problemy spoza wspólnoty [Tradition 10] |
| anonymity | anonimowość [aa.org.pl] |
| surrender / half measures / rigorous honesty | poddanie się / półśrodki / bezwzględna uczciwość [Katalog I-41] |
| cunning, baffling, powerful | podstępny, potężny i przebiegły [Katalog I-41 — A.A.'s Polish order] |
| General Service Office (New York) / its Polish counterpart | Biuro Służby Ogólnej AA (GSO) w Nowym Jorku [ours] / Biuro Służby Krajowej (BSK) [aa.org.pl] |
| General Service Board / trustees | Rada Służby Ogólnej [ours, cf. «Rada Powierników»] / powiernicy [aa.org.pl, Concepts] |
| General Service Conference | Konferencja Służby Ogólnej [ours, cf. «Konferencja Służby Krajowej AA w Polsce»] |
| the Right of Decision / Participation / Appeal / Petition | «Prawo do Decyzji» / «Prawo do Uczestnictwa» / «Prawo do Apelacji» [aa.org.pl Concepts 3–5] / «Prawo do Petycji» [ours] |
| group service representative (GSR) / treasurer / secretary | mandatariusz [Katalog: «Służba mandatariusza»] / skarbnik [Katalog] / sekretarz |
| intergroup / district / area / region / delegate | intergrupa [Region Warszawa] / okręg [ours] / obszar (area) [ours] / region [aa.org.pl] / delegat |
| the Oxford Group | Grupa Oksfordzka |
| the Third Step prayer / Seventh Step prayer | Modlitwa Trzeciego Kroku / Modlitwa Siódmego Kroku [Region Warszawa: «MODLITWA 3 KROKU»] |
| step work | praca nad Krokami |

## The Twelve Steps — Polish A.A., word for word [aa.org.pl/12-krokow-aa; Katalog P-26]
1. Przyznaliśmy, że jesteśmy bezsilni wobec alkoholu – że nasze życie stało się niekierowalne.
2. Uwierzyliśmy, że Siła większa od nas samych może przywrócić nam zdrowy rozsądek.
3. Podjęliśmy decyzję, aby powierzyć naszą wolę i nasze życie opiece Boga, tak jak Go rozumieliśmy.
4. Zrobiliśmy wnikliwą i odważną osobistą inwenturę moralną.
5. Wyznaliśmy Bogu, sobie i drugiemu człowiekowi istotę naszych błędów.
6. Staliśmy się całkowicie gotowi, żeby Bóg usunął wszystkie te wady charakteru.
7. Zwróciliśmy się do Niego w pokorze, aby usunął nasze braki.
8. Zrobiliśmy listę wszystkich osób, które skrzywdziliśmy, i staliśmy się gotowi zadośćuczynić im wszystkim.
9. Zadośćuczyniliśmy osobiście wszystkim, wobec których było to możliwe, z wyjątkiem tych przypadków, gdy zraniłoby to ich lub innych.
10. Prowadziliśmy nadal osobistą inwenturę, z miejsca przyznając się do popełnianych błędów.
11. Staraliśmy się przez modlitwę i medytację poprawiać nasz świadomy kontakt z Bogiem, tak jak Go rozumieliśmy, prosząc jedynie o poznanie Jego woli wobec nas oraz o siłę do jej spełnienia.
12. Przebudzeni duchowo w rezultacie tych kroków staraliśmy się nieść to posłanie innym alkoholikom i stosować te zasady we wszystkich naszych poczynaniach.

A Step quoted in part uses these words, cut, not reworded («bezsilni wobec alkoholu», «wnikliwą i odważną osobistą inwenturę moralną»). The English's "A.A.'s own wording" or "word for word" claims about the Steps are true in Polish too (they're A.A.'s Polish).

## The Twelve Traditions, short form — Polish A.A., word for word [aa.org.pl/12-tradycji-aa]
1. Nasze wspólne dobro powinno być zawsze na pierwszym miejscu; powrót do zdrowia każdego z nas zależy od jedności AA.
2. Dla naszego grupowego celu istnieje tylko jedna ostateczna władza – miłujący Bóg, tak jak może On wyrażać siebie w naszym grupowym sumieniu. Nasi liderzy są tylko zaufanymi sługami; oni nie rządzą.
3. Jedynym warunkiem członkostwa w AA jest pragnienie zaprzestania picia.
4. Każda grupa powinna być niezależna we wszystkich sprawach z wyjątkiem tych, które dotyczą innych grup lub AA jako całości.
5. Każda grupa ma jeden główny cel – nieść posłanie alkoholikowi, który wciąż jeszcze cierpi.
6. Grupa AA nigdy nie powinna popierać, finansować ani użyczać nazwy AA żadnym pokrewnym ośrodkom ani zewnętrznym przedsięwzięciom, ażeby problemy związane z finansami, majątkiem lub prestiżem nie odrywały nas od głównego celu.
7. Każda grupa AA powinna być całkowicie samowystarczalna i nie przyjmować dotacji z zewnątrz.
8. Wspólnota Anonimowych Alkoholików powinna na zawsze pozostać nieprofesjonalna, lecz nasze biura służb mogą zatrudniać niezbędnych pracowników.
9. AA, jako takie, nie powinno nigdy stać się organizacją, ale możemy tworzyć zespoły i komisje bezpośrednio odpowiedzialne wobec tych, którym służą.
10. Anonimowi Alkoholicy nie zajmują stanowiska wobec problemów spoza ich wspólnoty, ażeby imię AA nie zostało nigdy uwikłane w publiczne polemiki.
11. Nasze oddziaływanie na zewnątrz opiera się na przyciąganiu, a nie na reklamowaniu; musimy zawsze zachowywać osobistą anonimowość wobec prasy, radia i filmu.
12. Anonimowość stanowi duchową podstawę wszystkich naszych Tradycji, przypominając nam zawsze, że zasady są ważniejsze od osobowości.

Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the Polish at the matching point; `i18n/pl/core.json` (the /aa-info/ page) has all twelve already cut — copy them.

## The Twelve Traditions, long form — [ours]
Polish A.A. doesn't publish the long form online (it's in the Polish Big Book and the 12 & 12; the 12 & 12 is never a source). This is ours, faithful to the English pp. 563–566, in Polish A.A.'s vocabulary. Use it word for word wherever a long-form Tradition, or a sentence from one, appears.
1. Każdy członek Anonimowych Alkoholików jest tylko małą cząstką wielkiej całości. AA musi trwać, inaczej większość z nas na pewno umrze. Dlatego nasze wspólne dobro jest na pierwszym miejscu. Ale dobro każdego z nas idzie zaraz za nim.
2. Dla naszego grupowego celu istnieje tylko jedna ostateczna władza – miłujący Bóg, tak jak może On wyrażać siebie w naszym grupowym sumieniu.
3. Nasza Wspólnota powinna obejmować wszystkich, którzy cierpią na alkoholizm. Dlatego nie możemy odmówić nikomu, kto chce wyzdrowieć. Członkostwo w AA nie powinno też nigdy zależeć od pieniędzy ani od podporządkowania się. Każdych dwóch lub trzech alkoholików zebranych razem dla trzeźwości może nazwać siebie grupą AA, pod warunkiem że jako grupa nie mają żadnych innych powiązań.
4. W swoich własnych sprawach każda grupa AA powinna odpowiadać tylko przed własnym sumieniem. Lecz gdy jej plany dotyczą także dobra sąsiednich grup, należy zasięgnąć ich zdania. I żadna grupa, komisja regionalna ani pojedyncza osoba nie powinny nigdy podejmować działań, które mogłyby poważnie wpłynąć na AA jako całość, bez porozumienia z powiernikami Rady Służby Ogólnej. W takich sprawach nasze wspólne dobro jest najważniejsze.
5. Każda grupa Anonimowych Alkoholików powinna być duchową wspólnotą, mającą tylko jeden główny cel – nieść posłanie alkoholikowi, który wciąż jeszcze cierpi.
6. Problemy związane z pieniędzmi, majątkiem i władzą mogą łatwo odciągnąć nas od naszego głównego duchowego celu. Uważamy więc, że każdy znaczniejszy majątek, rzeczywiście potrzebny AA, powinien być osobno zarejestrowany i zarządzany, tak by oddzielić to, co materialne, od tego, co duchowe. Grupa AA jako taka nie powinna nigdy prowadzić działalności gospodarczej. Placówki pomocnicze wobec AA, takie jak kluby czy szpitale, które wymagają dużego majątku lub rozbudowanej administracji, powinny mieć osobną osobowość prawną i być tak wyodrębnione, by w razie potrzeby grupy mogły się od nich swobodnie odciąć. Dlatego takie placówki nie powinny używać nazwy AA. Zarządzanie nimi powinno należeć wyłącznie do tych, którzy je finansują. Na kierowników klubów zwykle woli się członków AA. Ale szpitale, podobnie jak inne miejsca powrotu do zdrowia, powinny znajdować się zdecydowanie poza AA – i pod nadzorem lekarskim. Choć grupa AA może współpracować z każdym, taka współpraca nie powinna nigdy posunąć się do powiązania ani poparcia, rzeczywistego lub domniemanego. Grupa AA nie może wiązać się z nikim.
7. Same grupy AA powinny być w pełni utrzymywane z dobrowolnych datków własnych członków. Uważamy, że każda grupa powinna szybko osiągnąć ten ideał; że wszelkie publiczne zbieranie funduszy z użyciem nazwy Anonimowych Alkoholików jest bardzo niebezpieczne, czy to przez grupy, kluby, szpitale, czy inne instytucje zewnętrzne; że przyjmowanie dużych darów z jakiegokolwiek źródła albo datków niosących jakiekolwiek zobowiązania jest nierozsądne. Z wielkim niepokojem patrzymy też na te kasy AA, które ponad rozsądną rezerwę nadal gromadzą fundusze bez określonego celu w AA. Doświadczenie wielokrotnie nas ostrzegało, że nic nie zniszczy naszego duchowego dziedzictwa tak pewnie jak jałowe spory o majątek, pieniądze i władzę.
8. Wspólnota Anonimowych Alkoholików powinna na zawsze pozostać nieprofesjonalna. Za profesjonalizm uważamy zawodowe doradzanie alkoholikom za opłatą lub wynagrodzeniem. Możemy jednak zatrudniać alkoholików tam, gdzie mają wykonywać prace, do których w przeciwnym razie musielibyśmy zatrudnić niealkoholików. Takie szczególne usługi mogą być dobrze wynagradzane. Ale nasza zwykła praca w AA w ramach „Dwunastego Kroku” nigdy nie powinna być opłacana.
9. Każda grupa AA potrzebuje jak najmniej organizacji. Najlepsze jest rotacyjne przewodzenie. Mała grupa może wybrać swojego sekretarza, duża – rotacyjną komisję, a grupy wielkiego miasta – swoją komisję centralną lub intergrupę, która często zatrudnia sekretarza na pełen etat. Powiernicy Rady Służby Ogólnej są w istocie naszą Komisją Służby Ogólnej AA. Są strażnikami naszej Tradycji AA i odbiorcami dobrowolnych datków AA, z których utrzymujemy nasze Biuro Służby Ogólnej AA w Nowym Jorku. Grupy upoważniają ich do prowadzenia całości naszych relacji z opinią publiczną, a oni gwarantują rzetelność naszego głównego pisma, „A.A. Grapevine”. Wszyscy tacy przedstawiciele mają kierować się duchem służby, bo prawdziwi liderzy w AA są tylko zaufanymi i doświadczonymi sługami całości. Nie czerpią żadnej rzeczywistej władzy ze swoich tytułów; oni nie rządzą. Kluczem do ich użyteczności jest powszechny szacunek.
10. Żadna grupa ani żaden członek AA nie powinni nigdy wypowiadać opinii na zewnętrzne kontrowersyjne tematy – zwłaszcza dotyczące polityki, reform alkoholowych czy sporów wyznaniowych – w sposób, który wciągałby w to AA. Grupy Anonimowych Alkoholików nie występują przeciwko nikomu. W takich sprawach nie mogą wyrażać żadnych poglądów.
11. Nasze relacje z ogółem społeczeństwa powinna cechować osobista anonimowość. Uważamy, że AA powinno unikać sensacyjnej reklamy. Nasze nazwiska i zdjęcia jako członków AA nie powinny być nadawane, filmowane ani publicznie drukowane. Naszymi relacjami z opinią publiczną powinna kierować zasada przyciągania, a nie reklamowania. Nigdy nie ma potrzeby chwalić samych siebie. Uważamy, że lepiej pozwolić, by polecali nas nasi przyjaciele.
12. I wreszcie, my, Anonimowi Alkoholicy, wierzymy, że zasada anonimowości ma ogromne znaczenie duchowe. Przypomina nam, że zasady mają być ważniejsze od osobowości; że mamy naprawdę praktykować szczerą pokorę. Wszystko po to, by wielkie błogosławieństwa, jakie otrzymaliśmy, nigdy nas nie zepsuły; byśmy na zawsze żyli we wdzięcznej kontemplacji Tego, który czuwa nad nami wszystkimi.

Tradition 3's clause, quoted all over the site: **„pod warunkiem że jako grupa nie mają żadnych innych powiązań”**. Tradition 6's: «Grupa AA nie może wiązać się z nikim», «współpraca nie powinna nigdy posunąć się do powiązania ani poparcia, rzeczywistego lub domniemanego». Where the English splits a long-form Tradition into several segments, split the Polish at the matching sentence.

**On the /12-traditions/ page** (and anywhere the English says the Traditions are printed "word for word, exactly as they appear in Alcoholics Anonymous"): in Polish that would be untrue for the long form. Say what's true, in the same place: «Wersja skrócona w brzmieniu polskiej Wspólnoty AA (aa.org.pl), wersja pełna w naszym przekładzie — obie z <i>Alcoholics Anonymous</i>, wyd. IV (angielskie): wersja skrócona s. 561–562, wersja pełna s. 563–566.» Keep the English's placeholders and page numbers; the rest of the sentence (published unaltered, cited) is translated as it stands. Note it in your close.

## The Twelve Concepts, short form — Polish A.A.'s sentences, world structure ours
Polish A.A. prints «12 Koncepcji dla służb AA w Polsce» (aa.org.pl/12-koncepcji/), written for Poland's own Conference and Board. The English site prints the **world** Concepts (General Service Conference, General Service Board), first sentence only for 7–12. These are Polish A.A.'s sentences where they match the English, with the world bodies put back **[ours]**; all twelve are in `i18n/pl/core.json` (the /aa-info/ page) — use exactly those sentences wherever a Concept is quoted:
1. Ostateczna odpowiedzialność oraz najwyższe uprawnienia dla światowych służb AA powinny zawsze należeć do zbiorowego sumienia całej naszej Wspólnoty.
2. Konferencja Służby Ogólnej AA stała się niemal we wszystkich praktycznych sprawach aktywnym głosem i skutecznie działającym sumieniem całej naszej społeczności w jej sprawach światowych.
3. Aby zapewnić skuteczne przewodzenie, powinniśmy przyznać tradycyjne „Prawo do Decyzji” każdemu elementowi AA – Konferencji, Radzie Służby Ogólnej i jej korporacjom służb, personelowi, komisjom i kierownictwu.
4. Na wszystkich odpowiedzialnych poziomach powinniśmy utrzymywać tradycyjne „Prawo do Uczestnictwa”, pozwalające na głosowanie proporcjonalne do odpowiedzialności, jaką każdy musi ponosić.
5. W całej naszej strukturze powinno obowiązywać tradycyjne „Prawo do Apelacji”, gwarantujące wysłuchanie głosu mniejszości i wnikliwe rozpatrzenie osobistych skarg.
6. Konferencja uznaje, że główna inicjatywa i aktywna odpowiedzialność w większości spraw służb światowych powinna należeć do członków Konferencji będących powiernikami, działających jako Rada Służby Ogólnej.
7. Statut i regulaminy Rady Służby Ogólnej są instrumentami prawnymi, upoważniającymi powierników do kierowania i prowadzenia spraw służb światowych.
8. Powiernicy są głównymi planistami i administratorami ogólnej polityki i finansów.
9. Dobre przywództwo w służbach na wszystkich poziomach jest nieodzowne dla naszego przyszłego funkcjonowania i bezpieczeństwa.
10. Z każdą odpowiedzialnością w służbie powinny wiązać się równe jej uprawnienia.
11. Powiernicy powinni zawsze mieć możliwie najlepsze komisje, dyrektorów korporacji służb, kierownictwo, personel i konsultantów.
12. Konferencja ma się kierować duchem tradycji AA, dbając o to, by sama nigdy nie stała się ośrodkiem niebezpiecznego bogactwa lub władzy.

Where the /12-concepts/ page quotes more of a Concept than this, translate the rest faithfully yourself [ours] and keep these first sentences. Any "verbatim / A.A.'s official wording" claim about the Concepts gets the same honest rewording as the long-form Traditions: «Pierwsze zdania w brzmieniu polskiej Wspólnoty AA, dostosowane do struktury światowej; reszta w naszym przekładzie».

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer** [Katalog, card «Modlitwa o pogodę ducha»]: «Boże, użycz mi pogody ducha, abym godził się z tym, czego nie mogę zmienić, odwagi, abym zmieniał to, co mogę zmienić, i mądrości, abym odróżniał jedno od drugiego.» (A.A. prints it in the masculine; keep it.)
- **Third Step prayer** (English p. 63) [Region Warszawa]: «Boże, ofiaruję siebie Tobie, abyś mnie uformował i uczynił ze mną to, co będzie zgodne z Twoją wolą. Uwolnij mnie ode mnie samego, żebym mógł lepiej spełniać Twoją wolę. Oddal ode mnie trudności, aby zwycięstwo nad nimi mogło być świadectwem dla tych, którym pospieszę z pomocą, czerpiąc z Twej Potęgi, Miłości i Twego Pojmowania Dróg Życia. Dopomóż mi, abym zawsze spełniał Twoją wolę.»
- **Seventh Step prayer** (English p. 76) [Region Warszawa]: «Boże, Stwórco mój, oddaję Ci w posiadanie to wszystko, co jest we mnie dobre i złe. Modlę się i błagam, abyś raczył usunąć ze mnie wszystkie braki mego charakteru, które przeszkadzają mi być użytecznym dla Ciebie i mych współbraci. Udziel mi siły, abym od tej chwili czynił Twoją wolę. Amen.»
  - Both prayers are Polish A.A.'s earlier-edition wording (see Sources). If the English discusses a single phrase of the English prayer ("bondage of self", "My Creator", "every single defect"), quote the Polish words that carry it («Uwolnij mnie ode mnie samego», «Boże, Stwórco mój», «wszystkie braki mego charakteru») and, where the point depends on the exact English word, add the English in brackets once: «(ang. „bondage of self”)».
- **The A.A. Preamble** [Katalog, card «Preambuła AA»]: «Anonimowi Alkoholicy są wspólnotą mężczyzn i kobiet, którzy dzielą się nawzajem doświadczeniem, siłą i nadzieją, aby rozwiązać swój wspólny problem i pomagać innym w wyzdrowieniu z alkoholizmu. Jedynym warunkiem uczestnictwa we Wspólnocie jest chęć zaprzestania picia. Nie ma w AA żadnych składek ani opłat, jesteśmy samowystarczalni poprzez własne dobrowolne datki. Wspólnota AA nie jest związana z żadną sektą, wyznaniem, działalnością polityczną, organizacją lub instytucją, nie angażuje się w żadne publiczne polemiki, nie popiera ani nie zwalcza żadnych poglądów. Naszym podstawowym celem jest trwać w trzeźwości i pomagać innym alkoholikom w jej osiągnięciu.» (A.A.'s Polish card still says «mężczyzn i kobiet»; if the English quotes the current "a fellowship of people", translate the English faithfully and don't call it the Polish card's text.)
- **Big Book lines Polish A.A. prints on its cards** — use these words when the English quotes them:
  - p. 58 "Rarely have we seen a person fail who has thoroughly followed our path." → «Rzadko się zdarza, by nie powiodło się komuś, kto dokładnie podąża naszą drogą.» [I-41]; "Our stories disclose in a general way what we used to be like, what happened, and what we are like now." → «Nasze historie pokazują w ogólnych zarysach, jacy kiedyś byliśmy, co się stało i jacy jesteśmy obecnie.»; "Half measures availed us nothing." → «Stosowanie półśrodków nic nam nie dało.»; "We stood at the turning point." → «Znaleźliśmy się w punkcie zwrotnym.»; "Here are the steps we took, which are suggested as a program of recovery:" → «A oto kroki, które postawiliśmy i które są sugerowanym programem powrotu do zdrowia:» [I-41]. The full card (pp. 58–59) is in the Katalog, p. 30.
  - pp. 83–84 (the Promises): «Poznamy nową wolność i nowe szczęście. Nie będziemy żałować przeszłości i nie będziemy chcieli zatrzaskiwać za nią drzwi. Pojmiemy sens słów „pogoda ducha” i zaznamy spokoju. Bez względu na to, jak nisko upadliśmy, zobaczymy, że z naszego doświadczenia mogą skorzystać inni. Znikną poczucie bezużyteczności i użalanie się nad sobą. Przestaniemy skupiać się na sobie, a zaczniemy interesować się bliźnimi. Zniknie egoizm. Zmieni się całe nasze nastawienie i nasz sposób patrzenia na życie. Opuści nas strach przed ludźmi i niepewnością materialną. Znajdziemy intuicyjnie sposób postępowania w sytuacjach, które kiedyś wprawiały nas w zakłopotanie. Nagle uświadomimy sobie, że Bóg robi dla nas to, czego sami dla siebie nie byliśmy w stanie uczynić. Czy są to obietnice bez pokrycia? Sądzimy, że nie. One się spełniają wśród nas – czasem szybciej, czasem wolniej. Zawsze się materializują, jeśli nad nimi pracujemy.» [I-42; it opens with «Jeżeli do tego etapu naszego rozwoju podejdziemy starannie, to już w jego połowie będziemy zadziwieni efektami.»]
  - p. 164: «Oddaj się Bogu, tak, jak rozumiesz Boga. Wyznaj Mu i współbraciom swoje winy. Usuń gruzy po swojej przeszłości. Dziel się szczodrze tym, co odkrywasz, i dołącz do nas. Będziemy z tobą we Wspólnocie Ducha i z pewnością spotkasz niektórych z nas, gdy będziesz kroczył Drogą Szczęśliwego Przeznaczenia. Niech Bóg cię błogosławi i prowadzi. Zatem – do zobaczenia.» [I-45]; "Road of Happy Destiny" → «Droga Szczęśliwego Przeznaczenia».
- A prayer or fixed text quoted in part uses these words, cut, not reworded.
- **Any other line the English quotes from the Big Book, a pamphlet or Grapevine:** translate it faithfully yourself, and use the same Polish each time the same English line comes back in your batch (search your file before you write it again). Don't go looking for the Polish edition's wording for ordinary quotes.
- A quote's credit line: the English "Alcoholics Anonymous, 4th Edition, page N. A short quote, for identification and study. Read the whole page in your own copy →" becomes «<i>Alcoholics Anonymous</i>, wyd. IV (angielskie), strona N; tłumaczenie własne. Krótki cytat, do rozpoznania i studiowania. Przeczytaj całą stronę we własnym egzemplarzu →». For a line from the cards above, «przekład polskiej Wspólnoty AA» in place of «tłumaczenie własne». Keep the English's placeholders around the same words.

## Site words
| English | Polish |
|---|---|
| Daily Reflection / Daily Tradition / Daily Reading | Codzienna refleksja / Codzienna Tradycja / Codzienne czytanie |
| Today's Reflection / Today's Tradition | Dzisiejsza refleksja / Dzisiejsza Tradycja |
| Recovery Einstein's Big Book perspective | spojrzenie Recovery Einsteina oparte na Wielkiej Księdze |
| Read today's official reflection at aa.org → | Przeczytaj dzisiejszą oficjalną refleksję na aa.org → |
| a question to sit with / Sit with | pytanie do przemyślenia / Do przemyślenia |
| Meetings Map / Online Meetings / Find a meeting | Mapa mityngów / Mityngi online / Znajdź mityng |
| Talk to Recovery Einstein | Porozmawiaj z Recovery Einsteinem |
| You're not alone / You don't have to face it alone | Nie jesteś sam / Nie musisz mierzyć się z tym sam |
| Get the App / the menu's "Get the App" / web app | Pobierz aplikację / Aplikacja / aplikacja webowa |
| AI chat | czat z AI |
| Donate / Donate — keep it free | Wesprzyj / Wesprzyj – niech zostanie bezpłatne |
| free | bezpłatny, bezpłatnie (za darmo in speech) |
| Home (breadcrumb) | Strona główna |
| ← Previous / Next → | ← Poprzednia / Następna → |
| Page by page / Big Book Search Engine | Strona po stronie / Wyszukiwarka Wielkiej Księgi |
| Section / Chapter / Page | Część / Rozdział / Strona (s. in references) |
| Tradition N · live (month grid) | Tradycja N · dostępna |
| Tradition N · 30 readings | Tradycja N · 30 czytań |
| Ask Recovery Einstein about Tradition N → | Zapytaj Recovery Einsteina o Tradycję N → |
| Daily Tradition card tags — the same on every card | the threat → zagrożenie · the threat today → zagrożenie dziś · before the tradition → zanim powstała Tradycja · how a group breaks it → jak grupa ją łamie · how it gets captured → jak się ją zawłaszcza · the earned answer → odpowiedź okupiona doświadczeniem · where it goes wrong → gdzie to się psuje |
| In plain terms | Mówiąc prosto |
| 𝕏 Post / Facebook / Copy Link (share bar) | Opublikuj na 𝕏 / Facebook / Kopiuj link |
| Short form / Long form | Wersja skrócona / Wersja pełna |
| Not verified yet | Jeszcze niezweryfikowane |
| email | e-mail |
