# Arabic glossary: the words every ar runner uses the same way

*Started 2026-11-09 by prep-ar (wave langs). Modern Standard Arabic (الفصحى), plain and warm, readable from Morocco to Oman. No Egyptian or Gulf dialect in the copy. The reader is addressed as **أنت**, masculine singular as the generic form (لستَ وحدك، اتصل، اقرأ), the way A.A.'s own Arabic pages do it (AA in Amman: «إذا كنت تشرب الكحول أكثر مما تنوي…»). Where A.A. publishes its own Arabic online, we use it word for word and cite it in brackets. **[ours]** marks wording A.A. hasn't published online. It's ours, fixed here so every page says it the same way. Add to this file at your close (`unsure:`), not mid-wave. **Never N.A.'s Arabic** (زمالة المدمنين المجهولين literature, the "blue book"; it fills the first page of Arabic search results) **and never the book Twelve Steps and Twelve Traditions** (the "12 & 12"), even if you know them. No machine translation.*

## Sources (checked 2026-11-09, plain curl with a recoverystarts.com user-agent)
- **[M]** Middle East Regional Committee of Alcoholics Anonymous, **mercaa.com** (members: Abu Dhabi, Al Ain, Bahrain, Dubai, Egypt, Jordan, Kuwait, Lebanon, Oman, Qatar, Ras Al Khaimah, Saudi Arabia, Sharjah). `/anonymity-statement/` prints the **A.A. Preamble in Arabic** («مقدمة زمالة مدمني الكحول المجهولين — طُبعت بتصريح من صحيفة The AA Grapevine, Inc») and the fellowship's name «زمالة مدمني الكحول المجهولين». Everything else on the site is English.
- **[J]** AA in Amman, **aainamman.org** (an A.A. site in Jordan; its Arabic pages are local translations of A.A.W.S. leaflets). It is **not** marked Conference-approved, so it's usable for vocabulary and as a source of quoted lines, never called "official":
  - `/malwmat-an-mnzmh-mdmny-alkhwl-almjh`: «معلومات عن منظمة مدمني الكحول المجهولين», a translation of A.A.W.S. leaflet F-2 *Information on A.A.* (its English original is the PDF MERCAA links).
  - `/mn-hw-mdmn-alkhwl`: «من هو مدمن الكحول؟» (the "Who is an alcoholic" Q&A).
  - `/12-sualaan-lmsaadtk-ala-atkhath-alq`: 12 questions.
  - `/لكحوليون-المجهولون-الوعود`: **the Promises** (Big Book pp. 83–84) in Arabic.
- **[S]** aa.org's literature store (onlineliterature.aa.org) sells A.A.W.S.'s printed Arabic: **Big Book ARABB-30** (title *Mudaminu Alkuhul Almajhulun*, i.e. «مدمنو الكحول المجهولون»), **This is A.A. ARABP-1**, **44 Questions ARABP-2**, **A Newcomer Asks ARABP-24**. **None of their text is online.** So A.A.'s printed Arabic Steps, Traditions and Big Book exist, but we can't read them from here. Everything below that would come from them is **[ours]** until someone reads ARABB-30 (see PREP-NOTES "Unsure").
- Not used: aaarabia.org (once an A.A. Gulf site; now an unrelated French news site), aalebanon.org (refused the connection), every N.A., S.L.A.A., O.A., rehab-clinic and Wikipedia text that search turns up for «الخطوات الاثنتا عشرة».

**Which wording, and why.** The fellowship's name: A.A.'s own, «مدمنو الكحول المجهولون» (the Arabic Big Book's title [S]; [M]; [J]). The Preamble: [M]'s, word for word. The Steps, both forms of the Traditions, the Concepts, the prayers and Big Book quotes: **[ours]**, translated once from the English 4th Edition, as wave hi1 did for Hindi (build.mjs "our translation" + `ar_ours_note`). When ARABB-30's wording is in hand, swap it into this file and core.json, and set `OURS_NOTE.ar` to false.

## How to write a segment
- Keep every `<0>…</0>` and `<1/>` the English has, around the words that belong inside, in whatever order Arabic needs. Don't type HTML or direction marks (no U+200F/U+202B; the page is `dir="rtl"`).
- **Letters: Arabic only.** ي ك ى ة (U+064A, U+0643, U+0649, U+0629). **Never Persian ی ک ۀ (U+06CC, U+06A9, U+06C0) and no ZWNJ (U+200C).** That is the reverse of fa: copying a fa line or running fa's desk fixer (`desk/fix_fa.py`, which turns ي→ی) breaks ar. Hamza as standard: أ إ آ ؤ ئ ء.
- **Tashkeel (vowel marks):** none, except a shadda or tanween where a word would be misread (التوقُّف, لستَ). Tanween fatha on the alef: «مجانًا»، «دائمًا» (not «مجاناً»).
- **Punctuation:** ، ؛ ؟ and «…» for every quote. No space before them. The English period, colon and exclamation stay. Em dash — with spaces around it, as the English has it.
- **Digits: Western 0–9 everywhere** (page numbers, years, counts, prices, times, phone numbers): «ص. 417»، «عام 1935»، «251 اجتماعًا»، «الساعة 7:00 مساءً». Why: Egypt's own press and ministries print Western digits online (the Ministry of Social Solidarity's hotline list, al-Ahram, Youm7), so do the Gulf and the Maghreb, and searches are typed that way. The build turns digits Persian **only for fa** (`scripts/i18n/rtl.mjs` DIGITS); leave ar out of that table. Never type ٠–٩ or ۰–۹.
- **Thousands:** «29,000», «30,000 دولار» (Latin comma between digits; the Arabic comma ، only between words).
- **Arrows: keep them exactly as the English has them** (`→`, `←`). The build turns them for RTL, as for fa.
- **Dates are Gregorian.** Months, Egyptian/Gulf names: يناير، فبراير، مارس، أبريل، مايو، يونيو، يوليو، أغسطس، سبتمبر، أكتوبر، نوفمبر، ديسمبر. Not the Levantine كانون الثاني… "October 12" → «12 أكتوبر»; "All of October" → «كل أكتوبر». Weekdays: السبت، الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة.
- **Numbers and nouns:** in labels write the numeral, «الخطوة 4»، «التقليد 3»، «المفهوم 7». In prose, "the Twelve Steps" is «الخطوات الاثنتا عشرة» (nominative; «الخطوات الاثنتي عشرة» after a preposition: «القائمة على الخطوات الاثنتي عشرة»), "the Twelve Traditions" «التقاليد الاثنا عشر» («التقاليد الاثني عشر» after a preposition), "Step 12 work" «عمل الخطوة الثانية عشرة».
- **Page references stay the English 4th Edition's numbers** («ص. 417»، «الصفحات 563–566»). ARABB-30 is paginated differently; never swap in its page numbers.
- **Names:** Bill W. → بيل و.؛ Dr. Bob → الدكتور بوب؛ Lois → لويس؛ Ebby T. → إيبي ت.؛ Akron, Ohio → أكرون، أوهايو؛ Dr. Silkworth → الدكتور سيلكوورث؛ Carl Jung → كارل يونغ؛ the Oxford Group → مجموعة أكسفورد؛ Derick → ديريك؛ Red Deer, Alberta → ريد دير، ألبرتا. **Brand and product names stay in Latin letters:** Recovery Starts, Recovery Einstein (in running text after first mention: «Einstein»), Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Google Play, aa.org. Other fellowships' names stay in English (Narcotics Anonymous (NA), CA, CMA, GA, SAA, Recovery Dharma, SMART Recovery, Celebrate Recovery).
- **Watch for lost negatives:** لا، لن، لم، ليس، غير، إلا، أبدًا. «لا ينبغي أبدًا» runs through Traditions 6, 8, 9 and 10; dropping «لا» turns a Tradition upside down.
- Meta descriptions end on a full sentence.

## Crisis lines: read this before any 988, detox or withdrawal segment
What's true (checked 2026-11-09 on each service's own site):
- **Egypt: 16023**, «خط صندوق الادمان», the hotline of the Fund for Drug Control and Treatment of Addiction (صندوق مكافحة وعلاج الإدمان والتعاطي), listed on the Ministry of Social Solidarity's own homepage [moss.gov.eg, hotline list: «16023 خط صندوق الادمان»]. The Fund's own site (drugcontrolfund.gov.eg) didn't answer from here, so **we don't claim hours, "free" or "confidential" for 16023** (the press says 24h, free, confidential; we can't confirm it on the service's site). Say only what's confirmed.
- **USA: 988**: call, chat and text in English and Spanish; **calls get a free interpreter in 240+ more languages** [samhsa.gov/mental-health/988/faqs]. Text and chat have no interpreter.
- **Canada: 9-8-8**: English and French, 24/7; another language "may be available by phone, via an interpreter" [988.ca/get-help/what-to-expect]. Not promised.
- **Dropped (couldn't confirm on the service's own site):** Egypt 16328 / 08008880700 / 0220816831 (General Secretariat of Mental Health and Addiction Treatment; mohp.gov.eg returned 503 and its subdomain didn't resolve), Egypt ambulance 123 (no official site reachable), Lebanon Embrace 1564 (embracelebanon.org returned 403). The other Arabic-speaking countries on the map: none checked yet, because the map's country list couldn't be read (see PREP-NOTES).

So on an ar page **never write "call or text 988" alone.** Egypt first, then North America. Use these, word for word:

| English | Arabic |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | هل تمرّ بأزمة الآن؟ في مصر اتصل بالخط الساخن 16023 (خط صندوق مكافحة وعلاج الإدمان والتعاطي). في الولايات المتحدة وكندا اتصل بـ 988 واطلب مترجمًا للعربية. لستَ وحدك. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | إن كنت في أزمة، ففي مصر اتصل بالخط الساخن 16023 (صندوق مكافحة وعلاج الإدمان والتعاطي)؛ وفي الولايات المتحدة وكندا اتصل بـ 988 (Suicide & Crisis Lifeline) واطلب مترجمًا للعربية. |
| …988 inside a longer sentence | «988 (في الولايات المتحدة وكندا؛ بالهاتف، مع طلب مترجم للعربية)» |
| free, 24/7, confidential (said of 988) | مجاني، على مدار الساعة، سرّي |
| go to the emergency room | توجّه إلى أقرب قسم طوارئ |
| detox / medical detox | إزالة السموم / إزالة السموم تحت إشراف طبي |
| withdrawal / alcohol withdrawal | أعراض الانسحاب / أعراض انسحاب الكحول |
| withdrawal can be dangerous — even fatal | قد يكون انسحاب الكحول خطيرًا، بل قاتلًا |
| not medical advice | ليست نصيحة طبية |
| treatment / treatment center / rehab | العلاج / مركز علاج / مركز إعادة تأهيل |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988). Every crisis/988/detox/withdrawal segment is read by the super.

## Fellowships and books
| English | Arabic |
|---|---|
| Alcoholics Anonymous | **مدمنو الكحول المجهولون** (after a preposition or in iḍāfa: «مدمني الكحول المجهولين») [S, M, J]; the fellowship: **«زمالة مدمني الكحول المجهولين»** [M] |
| A.A. (the abbreviation) | **A.A.** in Latin letters, with the periods [J: «منظمة مدمني الكحول المجهولين (A.A.)»]; "AA" where the English writes AA. An A.A. member «عضو في A.A.»; an A.A. group «مجموعة A.A.» |
| the fellowship | الزمالة [M] (not [J]'s «المنظمة»: A.A. calls itself a fellowship, and Tradition 9 says it is not organized) |
| Narcotics Anonymous / N.A. | Narcotics Anonymous (NA): the name only, in English; never its literature |
| Al-Anon / Alateen | Al-Anon / Alateen |
| the Big Book | **الكتاب الكبير** |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | <i>Alcoholics Anonymous</i> (الكتاب الكبير)، الطبعة الإنجليزية الرابعة |
| A.A.'s Arabic Big Book (when the English names a translation) | «مدمنو الكحول المجهولون»، الطبعة العربية (ARABB-30) |
| Twelve Steps and Twelve Traditions ("12 & 12"), only when the English names the book | «اثنتا عشرة خطوة واثنا عشر تقليدًا» **[ours]**, never a source |
| Living Sober | «العيش ممتنعًا عن الشرب» **[ours]** |
| Daily Reflections | «تأملات يومية» **[ours]** |
| As Bill Sees It | «كما يراها بيل» **[ours]** |
| A.A. Comes of Age | «A.A. تبلغ سن الرشد» **[ours]** |
| "Pass It On" | «مرِّرها» **[ours]** |
| Dr. Bob and the Good Oldtimers | «الدكتور بوب والقدامى الطيبون» **[ours]** |
| The Language of the Heart | «لغة القلب» **[ours]** |
| This is A.A. / 44 Questions / A Newcomer Asks (pamphlets A.A. prints in Arabic) | «هذه هي A.A.» / «44 سؤالًا» / «قادم جديد يسأل» **[ours: we haven't seen the Arabic covers]** |
| Grapevine / La Viña | Grapevine / La Viña |
| the A.A. Preamble | **مقدمة زمالة مدمني الكحول المجهولين** [M] |
| the Promises | الوعود [J] |

### Big Book chapters **[ours]** (ARABB-30's titles not seen)
| English | Arabic |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | تمهيد الطبعة الأولى (الثانية، الثالثة، الرابعة) |
| Preface | مقدمة |
| The Doctor's Opinion | رأي الطبيب |
| 1 Bill's Story | قصة بيل |
| 2 There Is a Solution | يوجد حل |
| 3 More About Alcoholism | المزيد عن إدمان الكحول |
| 4 We Agnostics | نحن اللاأدريين |
| 5 How It Works | كيف يعمل البرنامج |
| 6 Into Action | إلى العمل |
| 7 Working with Others | العمل مع الآخرين |
| 8 To Wives | إلى الزوجات |
| 9 The Family Afterward | العائلة بعد ذلك |
| 10 To Employers | إلى أصحاب العمل |
| 11 A Vision for You | رؤية لك |
| Personal Stories – Part I / II / III | قصص شخصية – الجزء 1 / 2 / 3 |
| Appendix I … VII | الملحق 1 – تقليد A.A.؛ 2 – التجربة الروحية؛ 3 – الرأي الطبي في A.A.؛ 4 – جائزة لاسكر؛ 5 – الرأي الديني في A.A.؛ 6 – كيف تتواصل مع A.A.؛ 7 – المفاهيم الاثنا عشر |
| Chapter 3 – More About Alcoholism | الفصل 3 – المزيد عن إدمان الكحول (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | Arabic |
|---|---|
| meeting / open / closed meeting | اجتماع / اجتماع مفتوح / اجتماع مغلق [J] |
| speaker / discussion / Step meeting | اجتماع تحدّث / اجتماع نقاش / اجتماع الخطوات [J] |
| group | مجموعة [J] |
| home group | المجموعة الأم **[ours]** |
| group conscience | ضمير المجموعة **[ours]** (Tradition 2: «ضمير جماعتنا») |
| sponsor / sponsee / sponsorship | **كفيل / مَكفول / الكفالة** **[ours]** (no A.A. Arabic seen; «راعٍ/رعاية» clashes with [J]'s «الرعاية» for "Twelfth Step care") |
| newcomer | القادم الجديد، القادمون الجدد [J] |
| old-timer | العضو القديم، القدامى **[ours]** |
| **sobriety / sober / stay sober** | **الامتناع عن الشرب / ممتنع عن الشرب / البقاء ممتنعًا عن الشرب** **[ours]**. Why: [M] and [J] write «اليقظة» for sobriety, but «يقظة روحية» is "spiritual awakening" (Step 12), and one word for both would muddle the Step. «اليقظة» stays **only inside the Preamble as [M] prints it.** "3 years sober" «ممتنع عن الشرب منذ 3 سنوات» |
| alcoholic (person) / alcoholism | مدمن الكحول، مدمنو الكحول [M, J] / إدمان الكحول [M, J] |
| drinking / the first drink | الشرب / الكأس الأولى ([J]: «المشروب الأول», also fine) |
| slip / relapse | زلّة / انتكاسة **[ours]** |
| the Steps / Step One / Twelfth Step work | الخطوات / الخطوة الأولى / عمل الخطوة الثانية عشرة |
| the Traditions / Tradition Three | التقاليد / التقليد الثالث |
| the Concepts / Twelve Concepts for World Service | المفاهيم / المفاهيم الاثنا عشر للخدمة العالمية **[ours]** |
| inventory / moral inventory / personal inventory | جرد / جرد أخلاقي / جرد شخصي [Steps 4, 10, ours] |
| resentment | الاستياء **[ours]** |
| defects of character | عيوب الشخصية [Step 6, ours] |
| shortcomings | النقائص [Step 7, ours] |
| amends / make amends | التعويض / التعويض عن الأذى [Steps 8–9, ours] |
| Higher Power / a Power greater than ourselves | القوة العليا / **قوة أعظم منا** ([J]: «قوة أعظم») |
| God as we understood Him | الله كما فهمناه [Steps 3, 11, ours] |
| spiritual awakening | يقظة روحية [Step 12, ours] |
| powerless over alcohol | عاجزون أمام الكحول [Step 1, ours] |
| unmanageable | لم يعد بالإمكان إدارتها [Step 1, ours] |
| carry the message | حمل الرسالة |
| the alcoholic who still suffers | مدمن الكحول الذي ما زال يعاني |
| primary purpose | الهدف الأساسي [M] |
| self-supporting / Seventh Tradition basket | نعتمد على أنفسنا [M: «فنحن ندعم أنفسنا بأنفسنا»] / سلة التقليد السابع **[ours]** |
| anonymity | إخفاء الهوية **[ours]** (the name «المجهولون» already carries it; [J]: «لديك كامل الحق بإخفاء هويتك») |
| trusted servants | خدّام موثوقون |
| attraction rather than promotion | الجذب لا الترويج |
| principles before personalities | المبادئ قبل الأشخاص |
| General Service Office / Board / Conference / trustees | مكتب الخدمات العامة / مجلس الخدمات العامة / مؤتمر الخدمات العامة / الأمناء **[ours]** |
| Right of Decision / Participation / Appeal | «حق القرار» / «حق المشاركة» / «حق الاستئناف» [Concepts 3–5, ours] |
| intergroup / district / area | لجنة ما بين المجموعات / المنطقة / الإقليم **[ours]** |
| Serenity Prayer / Third Step prayer / Seventh Step prayer | صلاة السكينة / صلاة الخطوة الثالثة / صلاة الخطوة السابعة **[ours]** |
| dues or fees | استحقاقات أو رسوم [M, J] |
| the desire to stop drinking | الرغبة في التوقف عن الشرب ([M]: «في التوقُّف عن شرب الكحوليات») |

## The Twelve Steps: [ours], word for word
A.A. prints the Steps in Arabic (ARABB-30 [S]), but not online where we can read them. Until then, this is ours, written once from the English (Big Book pp. 59–60). Every runner uses it exactly; a Step quoted in part is cut from these words, not reworded.
1. اعترفنا بأننا عاجزون أمام الكحول، وأن حياتنا لم يعد بالإمكان إدارتها.
2. توصّلنا إلى الإيمان بأن قوةً أعظم منا يمكن أن تعيدنا إلى سلامة العقل.
3. اتخذنا قرارًا بأن نسلّم إرادتنا وحياتنا لرعاية الله كما فهمناه.
4. قمنا بجرد أخلاقي متعمّق وجريء لأنفسنا.
5. اعترفنا لله ولأنفسنا ولإنسان آخر بالطبيعة الدقيقة لأخطائنا.
6. كنا مستعدين تمامًا لأن يزيل الله كل عيوب الشخصية هذه.
7. طلبنا منه بتواضع أن يزيل نقائصنا.
8. أعددنا قائمة بجميع الأشخاص الذين أسأنا إليهم، وأصبحنا راغبين في التعويض لهم جميعًا.
9. عوّضنا هؤلاء الأشخاص تعويضًا مباشرًا حيثما أمكن، إلا إذا كان ذلك سيؤذيهم أو يؤذي غيرهم.
10. واصلنا القيام بالجرد الشخصي، وكلما أخطأنا اعترفنا بذلك فورًا.
11. سعينا من خلال الصلاة والتأمل إلى تحسين صلتنا الواعية بالله كما فهمناه، داعين فقط أن نعرف مشيئته لنا وأن نُمنح القوة لتنفيذها.
12. بعد أن حصلت لنا يقظة روحية نتيجةً لهذه الخطوات، حاولنا أن نحمل هذه الرسالة إلى مدمني الكحول، وأن نطبّق هذه المبادئ في جميع شؤوننا.

Lost-negative watch: Step 9 «إلا إذا».

## The Twelve Traditions, short form: [ours], word for word
1. ينبغي أن تأتي مصلحتنا المشتركة أولًا؛ فالتعافي الشخصي يعتمد على وحدة A.A.
2. لغرض جماعتنا لا توجد إلا سلطة عليا واحدة: إله محب كما قد يعبّر عن نفسه في ضمير جماعتنا. قادتنا ليسوا إلا خدّامًا موثوقين؛ فهم لا يحكمون.
3. الشرط الوحيد للعضوية في A.A. هو الرغبة في التوقف عن الشرب.
4. ينبغي أن تكون كل مجموعة مستقلة، إلا في الأمور التي تمسّ مجموعات أخرى أو A.A. ككل.
5. ليس لكل مجموعة إلا هدف أساسي واحد: أن تحمل رسالتها إلى مدمن الكحول الذي ما زال يعاني.
6. لا ينبغي أبدًا لمجموعة A.A. أن تؤيد أي مرفق ذي صلة أو أي مشروع خارجي، أو تموّله، أو تُعيره اسم A.A.، لئلا تصرفنا مشكلات المال والممتلكات والوجاهة عن هدفنا الأساسي.
7. ينبغي أن تعتمد كل مجموعة A.A. على نفسها اعتمادًا كاملًا، رافضةً أي تبرعات من الخارج.
8. ينبغي أن تبقى زمالة مدمني الكحول المجهولين غير مهنية إلى الأبد، لكن يجوز لمراكز خدمتنا أن توظّف عاملين متخصصين.
9. لا ينبغي أبدًا أن تُنظَّم A.A. بصفتها هذه؛ لكن يجوز لنا أن ننشئ مجالس أو لجان خدمة مسؤولة مباشرة أمام من تخدمهم.
10. ليس لزمالة مدمني الكحول المجهولين رأي في القضايا الخارجية؛ ولذلك لا ينبغي أبدًا أن يُزجّ باسم A.A. في الجدل العام.
11. تقوم سياسة علاقاتنا العامة على الجذب لا الترويج؛ وعلينا دائمًا أن نحافظ على إخفاء هويتنا الشخصية على مستوى الصحافة والإذاعة والسينما.
12. إخفاء الهوية هو الأساس الروحي لكل تقاليدنا، يذكّرنا دائمًا بأن نضع المبادئ قبل الأشخاص.

Where the English bolds the first half of a Tradition (`<0>…</0>`), cut at the matching point. Lost-negative watch: 2 «لا يحكمون», 6 «لا ينبغي أبدًا», 9 «لا ينبغي أبدًا», 10 «ليس … رأي» and «لا ينبغي أبدًا».

## The Twelve Traditions, long form: [ours]
Opening line, where a page has it ("Our A.A. experience has taught us that:"): «علّمتنا تجربتنا في A.A. أن:». All twelve are in `i18n/ar/core.json` on the /aa-info/ page (ids 0a41494395b7 … b2076a23b5ae). Use exactly those sentences wherever a long-form Tradition is quoted. **Tradition 3's clause is quoted all over the site:** "provided that, as a group, they have no other affiliation" is always «بشرط ألا تكون لهم، بوصفهم مجموعة، أي انتماء آخر»; "An A.A. group can bind itself to no one" is always «لا يمكن لمجموعة A.A. أن تُلزم نفسها بأحد». "Short form" / "Long Form" → «الصيغة المختصرة» / «الصيغة الكاملة».

## The Twelve Concepts, short form: [ours]
All twelve, cut to the sentences the English page has, are in `i18n/ar/core.json` (ids e32af397e692 … 549bf284bc05). Use exactly those.

## Prayers and fixed texts: one wording, everywhere
- **The A.A. Preamble** [M, word for word]: «مدمنو الكحول المجهولون هي زمالة تضم الرجال والسيدات الذين يقومون بمشاركة خبراتهم ونقاط قوتهم وآمالهم مع بعضهم بعضاً، مما قد يُمَكِّنهم من حل مشكلاتهم المشتركة ومساعدة الآخرين في التعافي من إدمان الكحول. والشرط الوحيد للاشتراك في هذه الزمالة هي الرغبة في التوقُّف عن شرب الكحوليات. فلا يوجد أي استحقاقات أو رسوم للاشتراك في عضوية زمالة مدمني الكحول المجهولين، فنحن ندعم أنفسنا بأنفسنا من خلال مساهماتنا. كما أن الزمالة ليست حليفة لأي طائفة أو فئة أو سياسة أو مؤسسة أو معهد، فهي لا ترغب في الدخول في أي خلاف، كما أنها لا تعارض ولا تؤيد أياً من القضايا والمشكلات. هدفنا الأساسي هو عدم الإفراط في تناول الشراب والحفاظ على اليقظة، ومساعدة مدمني الكحول الآخرين في الوصول إلى هذه الحالة من اليقظة وعدم الإفراط في تناول الشراب.» Kept as printed, «بعضاً» and «أياً» spelling included. Its last sentence reads further from the English ("to stay sober") than the rest; don't "correct" it.
- **The Promises** (Big Book pp. 83–84) [J], with its PDF-copy breaks («ا لم», «ا لإحساس») joined: «إن بذلنا غاية جهدنا في هذه المرحلة من تقدمنا، فإننا سنذهل قبل الوصول إلى منتصف الطريق…», then the numbered promises as [J] prints them. *unsure:* «هذه ا لم رحلة» is probably «هذه المرحلة»; read ARABB-30 before relying on it. Credit it as AA in Amman's Arabic, never as official.
- **Serenity Prayer [ours]:** «اللهم امنحني السكينة لأتقبّل الأشياء التي لا أستطيع تغييرها، والشجاعة لأغيّر الأشياء التي أستطيع تغييرها، والحكمة لأعرف الفرق بينها.»
- **Third Step prayer** (English p. 63) **[ours]:** «يا الله، أقدّم نفسي إليك، لتبني بي وتفعل بي ما تشاء. حرّرني من عبودية الذات، لأحسن العمل بمشيئتك. أزل عني صعابي، لعل انتصاري عليها يشهد لمن أودّ مساعدتهم على قوتك ومحبتك وطريقتك في الحياة. ليتني أعمل بمشيئتك دائمًا!»
- **Seventh Step prayer** (English p. 76) **[ours]:** «يا خالقي، أنا الآن راغب في أن تأخذني كلّي، بخيري وشري. أدعوك أن تزيل عني الآن كل عيب من عيوب شخصيتي يقف في طريق نفعي لك ولإخواني من البشر. امنحني القوة، وأنا أخرج من هنا، لأنفّذ أمرك. آمين.»
- **God:** «الله». Arabic-speaking Christians and Muslims both say it, and A.A.'s Arabic pages [J] use it. "a loving God" «إله محب»; "Him who presides over us all" «من يرعانا جميعًا».
- **Any other line the English quotes from the Big Book, a pamphlet or Grapevine:** translate it faithfully yourself (ترجمة حرة), the same Arabic each time the same English line returns in your batch (search your file first).
- A quote's credit line: "Alcoholics Anonymous, 4th Edition, page N. A short quotation, for identification and study. Read the whole page in your own copy →" becomes «<0>Alcoholics Anonymous</0> (الكتاب الكبير)، الطبعة الإنجليزية الرابعة، الصفحة N؛ ترجمة حرة. اقتباس قصير، للتعريف والدراسة. <1>اقرأ الصفحة كاملة في نسختك →</1>». Keep the English's placeholders.

## Site words
| English | Arabic |
|---|---|
| Daily Reflection / Daily Tradition | التأمل اليومي / التقليد اليومي |
| Today's Reflection / Today's Tradition | تأمل اليوم / تقليد اليوم |
| Daily Reading | قراءة اليوم |
| Recovery Einstein's Big Book perspective | نظرة Recovery Einstein من الكتاب الكبير |
| Read today's official reflection at aa.org → | اقرأ التأمل الرسمي لليوم على aa.org → |
| a question to sit with | سؤال للتأمل |
| In plain terms | بعبارة بسيطة |
| Meetings Map / Online Meetings / Find a meeting | خريطة الاجتماعات / اجتماعات عبر الإنترنت / ابحث عن اجتماع |
| Talk to Recovery Einstein | تحدّث مع Recovery Einstein |
| You're not alone | لستَ وحدك |
| Get the App / web app | حمّل التطبيق / تطبيق الويب |
| AI / AI chat | الذكاء الاصطناعي / المحادثة بالذكاء الاصطناعي |
| free / No sign-up | مجاني، مجانًا / بلا تسجيل |
| Home (breadcrumb) | الرئيسية |
| ← Previous / Next → | ← السابق / التالي → (keep the English's arrows exactly; the build turns them) |
| Page by page | صفحة بصفحة |
| Big Book Search Engine | محرّك بحث الكتاب الكبير |
| the rooms (meetings) | القاعات |
| Tradition N · live | التقليد N · متاح |
| Tradition N · 30 readings | التقليد N · 30 قراءة |
| Ask Recovery Einstein about Tradition N → | اسأل Recovery Einstein عن التقليد N → |
| Not verified yet | لم يُتحقَّق منه بعد |
| email | البريد الإلكتروني |
| US$4.99 | 4.99 دولار أمريكي |
| Recovery Starts is an independent recovery-awareness project: not official A.A. literature, not an A.A. group, not affiliated with A.A.W.S., and not medical advice | Recovery Starts مشروع مستقل للتوعية بالتعافي: ليس من منشورات A.A. الرسمية، وليس مجموعة A.A.، وغير تابع لـ A.A.W.S.، وليس نصيحة طبية |
