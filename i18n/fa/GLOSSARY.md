# Persian glossary — the words every tr4 runner uses the same way

*Started 2026-10-13 by wave tr4 S1-fa (the super). Standard written Persian as read in Iran, the reader is **شما** (plural verbs: «می‌توانید», «بخوانید»), plain and warm. No Dari- or Tajik-only forms. Where A.A. in Iran prints its own Persian, we use it word for word; the source is in brackets. **[ours]** marks a wording A.A. hasn't published online: it's ours, fixed here so every page says it the same way. Add to this file through your close (`unsure:`), not by changing it mid-wave. **Never N.A.'s Persian (Basic Text, IPs, «معتادان گمنام» literature) and never the Twelve Steps and Twelve Traditions** («گام‌های دوازده‌گانه و سنت‌های دوازده‌گانه», "the 12 and 12"), even if you know them.*

## Sources (checked 2026-10-13)
A.A. in Iran has two service structures that publish in Persian; we credit them neutrally, as the meeting map does.
- **[A]** «شورای خدمات عمومی الکلی‌های گمنام ایران» — aairan.org and its app pwa.aairan.org: the Twelve Steps (`/fa/recovery-group/twelve/steps`), the Twelve Traditions (`/fa/recovery-group/twelve/traditions`; the 2024 PDF `aairan.org/wp-content/uploads/2024/06/سنت-های-دوازده-گانه.pdf`), «هوشیار زیستن» (`/fa/gifts/living-sober`: Steps, Traditions, Serenity, Third and Seventh Step prayers), the prayers (`/fa/recovery-group/third/prayer`, `/fa/recovery-group/prayers/seventh`), the Preamble (`/fa/about-us/definition`), «چگونگی عملکرد» (How It Works, 2024 PDF), the sponsor Q&A.
- **[B]** «دفتر خدمات عمومی الکلی‌های گمنام ایران» (Tehran) — iranaa.org: the Twelve Steps (`/newcommer/دوازده-قدم-aa`, the same words as [A]), the Twelve Concepts short form (`/newcommer/12-مفهوم`), a second Traditions wording and a newer, more literal Steps translation (`/how-anonymous-alcoholics-work`).
- aa.org sells three printed Farsi items (This is A.A., A Brief Guide, the Farsi Big Book) with no text online.

**Which wording, and why.** The Steps: the older translation, because **both** offices print it ([A] everywhere, [B] on its own Steps page); [B]'s newer translation appears only on one page and one PDF. The Traditions, Serenity Prayer, Third and Seventh Step prayers and Preamble: [A]'s, the same publisher as the Steps. Tradition 2: [A]'s 2024 PDF («خدمتگزاران مورد اعتمادند», "trusted servants"), where its app says «صادقند». The Concepts: [B]'s, the only Persian online, with its obvious typing slips corrected (noted below). Typography (half-space, «ی/ک», no space before «،») is normalized; **words are A.A.'s**. The long form of the Traditions isn't online in Persian anywhere: ours, below. Read through a reader service because both sites refuse connections from outside Iran; every text was read on the office's own URL.

## How to write a segment
- Write in the placeholder form: keep every `<0>…</0>` pair and `<1/>` the English has, around the words that belong in it, in whatever order Persian needs. Don't type HTML or direction marks (no U+200F/U+202B).
- `node scripts/i18n/check.mjs fa <your-batch>` must say 0 problems. `node scripts/i18n/score.mjs fa` has a `reg` column (Arabic ي/ك, «می» without the half-space, «تو» forms, Latin , ; ? in Persian) — keep it at 0 outside quotes.
- **Letters:** Persian ی and ک only, never Arabic ي ك ى. **Half-space** (نیم‌فاصله, U+200C): «می‌خواهم»، «نمی‌توانم»، «کتاب‌ها»، «خانه‌ای»، «صفحهٔ»/«صفحه‌ای»، «بی‌باکانه»، «الکلی‌های». Ezafe after a silent ه: «صفحهٔ ۶۰»، «نسخهٔ خودتان».
- **Punctuation:** ، ؛ ؟ and «گیومه» for every quote (English “…” and "…" become «…»). No space before ، ؛ ؟ . : !. The desk (`desk/fix_fa.py`) cleans letters, half-spaces and punctuation at the merge, but write them right.
- **Digits:** write Persian digits **۰–۹** in prose, page numbers, years, dates and counts («صفحهٔ ۴۱۷»، «سال ۱۹۳۵»، «بیش از ۲ میلیون»). **Phone numbers people dial stay Latin** (988, 123, 115, 911) and so do URLs, pamphlet codes (P-17) and prices ($2.99). The build writes any Latin digit left in Persian text as Persian anyway, except phone numbers and anything joined to Latin letters, so a slip can't make a page uneven.
- **Arrows: keep them exactly as the English has them** (`→`, `←`, `›`). The build turns every arrow to point the way Persian reads. If you flip one yourself it ends up pointing the wrong way.
- **Dates are Gregorian**, never converted to the solar calendar. Months: ژانویه، فوریه، مارس، آوریل، مه، ژوئن، ژوئیه، اوت، سپتامبر، اکتبر، نوامبر، دسامبر. "October 12" → «۱۲ اکتبر»; "October 12 — Title" → «۱۲ اکتبر — عنوان»; "All of October" → «همهٔ اکتبر»; "January 1" → «۱ ژانویه». Weekdays: شنبه، یکشنبه، دوشنبه، سه‌شنبه، چهارشنبه، پنجشنبه، جمعه.
- **After a number the noun is singular:** «دوازده قدم»، «دوازده سنت»، «۳۶۶ روز»، «۹ انجمن» (never «دوازده قدم‌ها»).
- **Page references stay the English 4th Edition's numbers**: «ص. ۴۱۷»، «صفحهٔ ۸۶»، «صفحه‌های ۵۸–۶۰»، «ص. ۵۶۱–۵۶۲». The Persian Big Book is paginated differently; never swap in its page numbers.
- **Names:** Bill W. → بیل و.؛ Dr. Bob → دکتر باب؛ Lois → لوئیس؛ Ebby T. → ابی ت.؛ Akron → آکرون؛ Earl T. → ارل ت.؛ Dr. Silkworth → دکتر سیلکورث؛ Carl Jung → کارل یونگ؛ the Oxford Group → گروه آکسفورد؛ Derick → دریک؛ Red Deer, Alberta → رِد دیر، آلبرتا. **Brand and product names stay in Latin letters:** Recovery Starts, Recovery Einstein (in running text after first mention: «اینشتین»), Addict2Influencer, AutoGrow AI Solutions, Claude's Lab, Seeker, Pro, Google Play, aa.org.
- Watch for lost negatives: «نـ»، «نمی‌»، «هرگز … نباید»، «هیچ … ندارد»، «جز»، «مگر». A dropped «ن» turns a Tradition upside down.
- Meta descriptions (the short text Google shows) end on a full sentence, never cut mid-sentence.
- Translate it yourself; no Google or other machine translation.

## Crisis lines — read this before any 988, detox or withdrawal segment
What's true (checked 2026-10-13):
- **Iran — 123, اورژانس اجتماعی بهزیستی** (Behzisti's social emergency): for someone thinking of suicide, or someone worried about them; a team can come to the person; **24 hours, free** [behzisti.ir/news/205390 «مداخله خط ۱۲۳ می‌تواند پیش از وقوع اقدام به خودکشی آغاز شود»; /news/31060; Behzisti: «شبانه‌روزی و رایگان»].
- **Iran — 115, اورژانس** (medical emergency, ambulance) [115.ir, the Emergency Organization's own site; ems115.behdasht.gov.ir].
- **Canada — 9-8-8**: English and French, 24/7; **a call can ask for an interpreter in another language, "may be available"** — not promised; text is English/French only [988.ca/get-help/what-to-expect].
- **USA — 988**: call, text and chat in English and Spanish; **a call gets a free interpreter in 240+ more languages** — say "Farsi" when it answers; **text and chat have no interpreter** [samhsa.gov/mental-health/988/faqs].
- Not used: 1480 «صدای مشاور» (counselling; hours differ by province) and 09628 «خط ملی اعتیاد» (hours differ by page) — we couldn't confirm their hours.

So on a fa page **never write "call or text 988" alone** — a Persian speaker who texts 988 gets English, and a reader in Iran can't reach 988 at all. Iran first, then North America. Use these, word for word:

| English | Persian |
|---|---|
| In crisis right now? Call or text 988. You are not alone. | همین حالا در بحران هستید؟ در ایران با 123 (اورژانس اجتماعی بهزیستی، شبانه‌روزی و رایگان) تماس بگیرید. در آمریکا و کانادا با 988 تماس بگیرید و بگویید «Farsi» تا مترجم فارسی بگیرند. تنها نیستید. |
| If you're in crisis, call or text 988 (Suicide & Crisis Lifeline). | اگر در بحران هستید، در ایران با 123 (اورژانس اجتماعی بهزیستی) تماس بگیرید؛ در آمریکا و کانادا با 988 (Suicide & Crisis Lifeline) تماس بگیرید و مترجم فارسی بخواهید. |
| …988 inside a longer sentence | «988 (در آمریکا و کانادا؛ تلفنی، با درخواست مترجم فارسی)» and, where the sentence has room, «در ایران 123» |
| Call 911 / go to the emergency room | با اورژانس تماس بگیرید (در ایران 115، در آمریکا و کانادا 911) / به اورژانس نزدیک‌ترین بیمارستان بروید |
| free, 24/7, confidential | رایگان، شبانه‌روزی، محرمانه |
| detox / medical detox | سم‌زدایی / سم‌زدایی زیر نظر پزشک |
| withdrawal / alcohol withdrawal | علائم ترک / علائم ترک الکل |
| withdrawal can be dangerous — even fatal | ترک الکل می‌تواند خطرناک، حتی کشنده باشد |
| not medical advice | توصیهٔ پزشکی نیست |
| treatment / treatment center / rehab | درمان / مرکز درمان / مرکز ترک اعتیاد |

Keep the English's placeholders around the numbers (`<0>988</0>` stays around 988). Every crisis/988/detox/withdrawal segment is read by the super.

## Fellowships and books
| English | Persian |
|---|---|
| Alcoholics Anonymous | الکلی‌های گمنام; the fellowship: «انجمن الکلی‌های گمنام» [A, B] |
| A.A. (the abbreviation) | **AA** in Latin letters, no periods [A: «درباره الکلی‌های گمنام (AA)»; B: «دوازده قدم AA»] — a member: «عضو AA»؛ an A.A. group: «گروه AA» |
| Narcotics Anonymous / N.A. | معتادان گمنام (NA) — the name only; never its literature |
| Cocaine Anonymous, Crystal Meth Anonymous, Gamblers Anonymous, Sex Addicts Anonymous, Recovery Dharma, SMART Recovery, Celebrate Recovery | names stay in English (CA, CMA, GA, SAA…) |
| Al-Anon / Alateen | الانان / الاتین |
| the Big Book | **کتاب بزرگ** [A: «کتاب بزرگ «الکلی‌های گمنام»»; B: «معروف به کتاب بزرگ»] |
| Alcoholics Anonymous, 4th Edition (a citation of the English book) | الکلی‌های گمنام (کتاب بزرگ)، ویرایش چهارم انگلیسی |
| Twelve Steps and Twelve Traditions ("12 & 12") — only when the English names the book | «گام‌های دوازده‌گانه و سنت‌های دوازده‌گانه» (کتاب «دوازده و دوازده») [A, B catalogues] — never a source |
| Living Sober | «هوشیار زیستن» [A] |
| Daily Reflections | «تأملات روزانه» [ours] |
| As Bill Sees It | «از نگاه بیل» [ours] |
| A.A. Comes of Age | «AA به بلوغ می‌رسد» [ours] |
| "Pass It On" | «به دیگران برسان» [ours] |
| Dr. Bob and the Good Oldtimers | «دکتر باب و پیشکسوتان خوب» [ours] |
| The Language of the Heart | «زبان دل» [ours] |
| A.A. Tradition — How It Developed (P-17) | «سنت AA — چگونه شکل گرفت» (P-17) [ours] |
| Grapevine / La Viña | گریپ‌واین / لاوینا [A catalogue] |
| the A.A. Preamble | مقدمهٔ AA [ours for the name; text below is A's] |
| the Promises | وعده‌ها; «وعده‌های دوازده‌گانه» [A] |

### Big Book chapters
A's Persian Big Book isn't online; only one chapter title is printed by A elsewhere. The rest are **[ours]**, fixed here.
| English | Persian |
|---|---|
| Foreword to the First Edition (Second…, Third…, Fourth…) | پیشگفتار ویرایش اول (دوم، سوم، چهارم) |
| Preface | مقدمه |
| The Doctor's Opinion | نظر پزشک |
| 1 Bill's Story | داستان بیل |
| 2 There Is a Solution | راه‌حلی هست |
| 3 More About Alcoholism | بیشتر دربارهٔ الکلیسم |
| 4 We Agnostics | ما ندانم‌گرایان |
| 5 How It Works | **چگونگی عملکرد** [A, its How It Works pamphlet] |
| 6 Into Action | دست به کار |
| 7 Working with Others | کار با دیگران |
| 8 To Wives | خطاب به همسران |
| 9 The Family Afterward | خانواده پس از آن |
| 10 To Employers | خطاب به کارفرمایان |
| 11 A Vision for You | چشم‌اندازی برای شما |
| Personal Stories – Part I / II / III | داستان‌های شخصی – بخش ۱ / ۲ / ۳ |
| Appendix I – The A.A. Tradition … VII – Twelve Concepts | پیوست ۱ – سنت AA؛ ۲ – تجربهٔ روحانی؛ ۳ – دیدگاه پزشکی؛ ۴ – جایزهٔ لاسکر؛ ۵ – دیدگاه مذهبی؛ ۶ – راه تماس؛ ۷ – دوازده مفهوم |
| Chapter 3 – More About Alcoholism | فصل ۳ – بیشتر دربارهٔ الکلیسم (same pattern for every chapter) |

A personal story's English title: translate it faithfully **[ours]**, the same each time it comes back in your batch.

## Program words
| English | Persian |
|---|---|
| fellowship (A.A.'s) | انجمن [A, B] |
| meeting / open / closed meeting | جلسه / جلسهٔ باز / جلسهٔ بسته [A] |
| group | گروه [A] |
| home group | گروه خانگی **[ours]** |
| group conscience | وجدان گروه [Tradition 2] |
| sponsor / sponsee / sponsorship / to sponsor | **راهنما / رهجو / راهنمایی / راهنمایی کردن** [A, sponsor Q&A] |
| newcomer | تازه‌وارد [A, B] |
| old-timer | قدیمی، عضو باسابقه **[ours]** |
| sobriety / sober | **هوشیاری / هوشیار** [A; Preamble] — "stay sober" «هوشیار بمانیم» |
| slip / relapse | لغزش [A] / بازگشت به مصرف **[ours]** |
| the Steps / Step One / Twelfth Step work | قدم‌ها / قدم اول / کار قدم دوازدهم [A] — "Step 4" in a label: «قدم ۴» |
| the Traditions / Tradition Three | سنت‌ها / سنت سوم [A] — "Tradition 3" in a label: «سنت ۳» |
| the Concepts / the Twelve Concepts for World Service | مفاهیم / دوازده مفهوم برای خدمات جهانی [A catalogue, B] — "Concept 7": «مفهوم ۷» |
| inventory / moral inventory / personal inventory | ترازنامه / ترازنامهٔ اخلاقی / ترازنامهٔ شخصی [Steps 4, 10] |
| resentment | رنجش **[ours]** |
| defects of character / character defects | نواقص اخلاقی [Step 6] |
| shortcomings | کمبودهای اخلاقی [Step 7] |
| the exact nature of our wrongs | چگونگی دقیق خطاهای خود [Step 5] |
| amends / make amends | جبران / جبران کردن، جبران خسارت [Steps 8–9] |
| Higher Power | **نیروی برتر** [A, B] |
| a Power greater than ourselves (outside the Step) | نیرویی برتر از خودمان **[ours]** — inside Step 2: «نیرویی مافوق» |
| God as we understood Him | پروردگار، آن‌گونه که خود درک می‌کردیم [Steps 3, 11: «پروردگاری که خود درک می‌کردیم»] |
| spiritual awakening | بیداری روحانی [Step 12] |
| powerless over alcohol | در مقابل الکل عاجز [Step 1] |
| our lives had become unmanageable | اختیار زندگی‌مان از دستمان خارج شده بود [Step 1] — "unmanageable" alone: «از اختیار خارج» |
| restore us to sanity | سلامت عقل را به ما بازگرداند [Step 2] |
| carry the message | رساندن پیام [Step 12, Tradition 5] |
| the alcoholic who still suffers | الکلی‌ای که هنوز در عذاب است [Tradition 5] |
| primary purpose | هدف اصلی [Tradition 5] |
| self-supporting / the Seventh Tradition basket | خودکفا [Tradition 7] / سبد سنت هفتم **[ours]** |
| anonymity | گمنامی [Traditions 11–12] |
| trusted servants | خدمتگزاران مورد اعتماد [Tradition 2, A PDF] |
| attraction rather than promotion | اصل جاذبه … نه تبلیغ [Tradition 11] |
| principles before personalities | اصول را به شخصیت‌ها ترجیح دهیم [Tradition 12; the short form says «اصول اخلاقی»] |
| General Service Office / Board / Conference / trustees | دفتر خدمات عمومی / هیئت خدمات عمومی / کنفرانس خدمات عمومی / معتمدین (هیئت معتمدین) [B] |
| the Right of Decision / Participation / Appeal | «حق تصمیم‌گیری» / «حق شرکت کردن» / «حق درخواست رسیدگی» [B, Concepts 3–5] |
| intergroup / district / area | بین‌گروهی / ناحیه / منطقه **[ours]** |
| the Third Step prayer / Seventh Step prayer | دعای قدم سوم / دعای قدم هفتم [A] |
| the Serenity Prayer | دعای آرامش [A] |
| step work | کار روی قدم‌ها |
| alcoholism / alcoholic | الکلیسم / الکلی [A] |

## The Twelve Steps — A.A.'s Persian, word for word [A, B]
1. ما پذیرفتیم که در مقابل الکل عاجز بودیم و اختیار زندگی‌مان از دستمان خارج شده بود.
2. ایمان آوردیم که نیرویی مافوق می‌تواند سلامت عقل را به ما بازگرداند.
3. تصمیم گرفتیم که اراده و زندگی‌مان را به پروردگاری که خود درک می‌کردیم بسپاریم.
4. یک ترازنامهٔ اخلاقی بی‌باکانه و موشکافانه از خود تهیه کردیم.
5. چگونگی دقیق خطاهای خود را به خداوند، خود و یک انسان دیگر اقرار کردیم.
6. آمادگی کامل پیدا کردیم که پروردگار کلیهٔ نواقص اخلاقی ما را مرتفع کند.
7. با فروتنی از او خواستیم کمبودهای اخلاقی ما را برطرف کند.
8. فهرستی از تمام کسانی که به آن‌ها زیان رسانده بودیم تهیه کردیم و درصدد جبران برآمدیم.
9. به‌طور مستقیم در هرجا امکان داشت از افراد فوق جبران خسارت کردیم، مگر در مواردی که انجام آن زیان مجددی بر ایشان و یا دیگران وارد کند.
10. به تهیهٔ ترازنامهٔ شخصی خود ادامه دادیم و در صورت قصور بلافاصله بدان اقرار کردیم.
11. از راه دعا و مراقبه کوشیدیم به پروردگاری که خود درک می‌کردیم نزدیک‌تر شویم و فقط طالب آگاهی از خواست او برای خود و قدرت اجرایش شدیم.
12. با بیداری روحانی حاصل از برداشتن این قدم‌ها سعی کردیم این پیام را به الکلی‌ها برسانیم و این اصول را در تمام موارد زندگی خود به اجرا درآوریم.

A Step quoted in part uses these words, cut, not reworded («در مقابل الکل عاجز بودیم»، «یک ترازنامهٔ اخلاقی بی‌باکانه و موشکافانه»). The English quotes Steps in the Big Book's words; the Persian is A.A. Iran's translation of those same Steps, so it is used as is, even where its English would read a little differently (Step 8's «درصدد جبران برآمدیم» for "became willing to make amends", Step 11's «نزدیک‌تر شویم» for "improve our conscious contact"). Don't "correct" it. Lost-negative watch: Step 9 «مگر».

## The Twelve Traditions, short form — A.A.'s Persian, word for word [A]
1. منافع مشترک ما باید در رأس کار ما قرار گیرد، بهبودی هر یک از ما به یگانگی الکلی‌های گمنام بستگی دارد.
2. در ارتباط گروهی ما فقط یک مرجع وجود دارد و آن پروردگار مهربان است، بدان‌گونه که خود را در وجدان گروه بیان کند؛ پیشوایان ما خدمتگزاران مورد اعتمادند و حکومت نمی‌کنند.
3. تنها لازمهٔ عضویت در الکلی‌های گمنام تمایل به ترک الکل است.
4. هر گروه باید مستقل باشد به استثنای مواردی که به دیگر گروه‌ها و الکلی‌های گمنام در جمع تأثیر بگذارد.
5. هر گروه فقط یک هدف اصلی دارد و آن رساندن پیام خود به الکلی‌هایی است که هنوز در عذابند.
6. الکلی‌های گمنام هرگز نباید هیچ مؤسسهٔ مرتبط و یا هر سازمان دیگری را تأیید کند و یا کمک مالی نماید و یا اجازهٔ استفاده از نام الکلی‌های گمنام را بدان‌ها بدهد، زیرا ممکن است که مسائل مالی، ملکی و شهرت، ما را از هدف اصلی خود منحرف سازد.
7. هر گروه الکلی‌های گمنام باید کاملاً خودکفا باشد و کمکی از خارج دریافت نکند.
8. الکلی‌های گمنام باید برای همیشه غیرحرفه‌ای باقی بماند، اما مراکز خدماتی ما می‌توانند کارمندانی استخدام کنند.
9. ما تحت عنوان الکلی‌های گمنام هرگز نباید متشکل شویم، اما می‌توانیم هیئت‌ها و کمیته‌هایی تشکیل دهیم که مستقیماً در برابر گروه مسئول باشند.
10. الکلی‌های گمنام هیچ عقیده‌ای در مورد موضوعات خارجی ندارد و نام الکلی‌های گمنام هرگز نباید وارد مسائل اجتماعی شود.
11. خط‌مشی روابط عمومی ما بنابر اصل جاذبه است نه تبلیغ؛ ما باید همیشه گمنامی خود را در سطح مطبوعات، رادیو و فیلم حفظ کنیم.
12. گمنامی اساس روحانی تمام سنت‌های ما می‌باشد و همیشه یادآور این است که اصول اخلاقی را به شخصیت‌ها ترجیح دهیم.

Where the English bolds the first half of a Tradition (`<0>…</0>`), cut the Persian at the matching point; the /aa-info/ page in `i18n/fa/core.json` has all twelve already cut — copy those. Like the Steps, A's wording is used as printed where it differs a little from the English (Tradition 6's subject «الکلی‌های گمنام» where the English says "an A.A. group"; Tradition 9's «در برابر گروه مسئول»). Lost-negative watch: Two «حکومت نمی‌کنند», Six «هرگز نباید», Seven «دریافت نکند», Nine «هرگز نباید», Ten «هیچ … ندارد» and «هرگز نباید».

## The Twelve Traditions, long form — [ours], word for word
Not published online in Persian by either office: this is ours, written once from the English 4th Edition (pp. 563–566) in the short form's vocabulary. Every runner uses it exactly.
Opening line: «تجربهٔ ما در AA به ما آموخته است که:»
1. هر عضو الکلی‌های گمنام تنها جزء کوچکی از یک کل بزرگ است. AA باید به زندگی ادامه دهد، وگرنه بیشتر ما بی‌گمان خواهیم مرد. از این رو منافع مشترک ما در رأس قرار می‌گیرد. اما منافع فردی بلافاصله پس از آن می‌آید.
2. در ارتباط گروهی ما فقط یک مرجع وجود دارد و آن پروردگار مهربان است، بدان‌گونه که خود را در وجدان گروه بیان کند.
3. عضویت ما باید همهٔ کسانی را که از الکلیسم رنج می‌برند در بر گیرد. از این رو نمی‌توانیم هیچ‌کس را که خواهان بهبودی است رد کنیم. و عضویت در AA هرگز نباید به پول یا همرنگی بستگی داشته باشد. هر دو یا سه الکلی که برای هوشیاری گرد هم آمده‌اند می‌توانند خود را یک گروه AA بنامند، به این شرط که به‌عنوان یک گروه، هیچ وابستگی دیگری نداشته باشند.
4. هر گروه AA در امور خود نباید در برابر هیچ مرجعی جز وجدان خودش پاسخ‌گو باشد. اما هنگامی که برنامه‌هایش به منافع گروه‌های همسایه نیز مربوط می‌شود، باید با آن گروه‌ها مشورت شود. و هیچ گروه، کمیتهٔ منطقه‌ای یا فردی هرگز نباید بی‌مشورت با معتمدین هیئت خدمات عمومی دست به اقدامی بزند که ممکن است بر کل AA تأثیر زیادی بگذارد. در چنین مسائلی منافع مشترک ما برتر از همه است.
5. هر گروه الکلی‌های گمنام باید یک هستی روحانی باشد که فقط یک هدف اصلی دارد: رساندن پیام خود به الکلی‌ای که هنوز در عذاب است.
6. مسائل مالی، ملکی و اقتدار به‌آسانی می‌توانند ما را از هدف روحانی اصلی‌مان منحرف کنند. از این رو بر این باوریم که هر دارایی قابل‌توجهی که واقعاً به کار AA می‌آید باید جداگانه ثبت و اداره شود تا امور مادی از امور روحانی جدا بماند. یک گروه AA، به این عنوان، هرگز نباید وارد کسب‌وکار شود. کمک‌های جانبی AA، مانند باشگاه‌ها یا بیمارستان‌ها، که به دارایی یا مدیریت زیادی نیاز دارند، باید جداگانه ثبت شوند و چنان جدا نگه داشته شوند که در صورت لزوم گروه‌ها بتوانند آزادانه کنارشان بگذارند. از این رو چنین مراکزی نباید از نام AA استفاده کنند. مدیریت آن‌ها باید تنها بر عهدهٔ کسانی باشد که از نظر مالی از آن‌ها حمایت می‌کنند. برای باشگاه‌ها معمولاً مدیرانی از اعضای AA ترجیح داده می‌شوند. اما بیمارستان‌ها، و همچنین دیگر مکان‌های بازتوانی، باید کاملاً بیرون از AA باشند — و زیر نظارت پزشکی. گرچه یک گروه AA می‌تواند با هر کسی همکاری کند، چنین همکاری‌ای هرگز نباید تا حد وابستگی یا تأیید، چه واقعی و چه ضمنی، پیش برود. یک گروه AA نمی‌تواند خود را به هیچ‌کس وابسته کند.
7. خود گروه‌های AA باید کاملاً با کمک‌های داوطلبانهٔ اعضای خودشان اداره شوند. بر این باوریم که هر گروه باید به‌زودی به این آرمان برسد؛ که هر گونه جمع‌آوری عمومی پول با استفاده از نام الکلی‌های گمنام، چه از سوی گروه‌ها، باشگاه‌ها، بیمارستان‌ها یا دیگر نهادهای بیرونی، بسیار خطرناک است؛ و که پذیرفتن هدیه‌های بزرگ از هر منبعی، یا کمک‌هایی که هر گونه تعهدی به همراه داشته باشد، نابخردانه است. همچنین با نگرانی بسیار به صندوق‌هایی از AA می‌نگریم که فراتر از ذخیره‌ای محتاطانه، بی‌هیچ هدف اعلام‌شده‌ای از AA، به انباشتن پول ادامه می‌دهند. تجربه بارها به ما هشدار داده است که هیچ چیز به اندازهٔ اختلاف‌های بیهوده بر سر دارایی، پول و اقتدار، میراث روحانی ما را با چنین قطعیتی نابود نمی‌کند.
8. الکلی‌های گمنام باید برای همیشه غیرحرفه‌ای باقی بماند. حرفه‌ای‌گری را چنین تعریف می‌کنیم: مشاوره دادن به الکلی‌ها در برابر دستمزد یا استخدام. اما می‌توانیم الکلی‌ها را برای انجام خدماتی به کار بگیریم که در غیر این صورت ناچار بودیم برای آن‌ها غیرالکلی‌ها را استخدام کنیم. چنین خدمات ویژه‌ای می‌تواند به‌خوبی جبران شود. اما کار معمول «قدم دوازدهم» ما در AA هرگز نباید دستمزدی داشته باشد.
9. هر گروه AA به کمترین سازمان‌دهی ممکن نیاز دارد. رهبری چرخشی بهترین است. گروه کوچک می‌تواند منشی خود را انتخاب کند، گروه بزرگ کمیتهٔ چرخشی خود را، و گروه‌های یک شهر بزرگ کمیتهٔ مرکزی یا بین‌گروهی خود را، که اغلب یک منشی تمام‌وقت به کار می‌گیرد. معتمدین هیئت خدمات عمومی در عمل کمیتهٔ خدمات عمومی AA ما هستند. آنان نگهبانان سنت AA و دریافت‌کنندگان کمک‌های داوطلبانهٔ AA هستند که با آن دفتر خدمات عمومی AA را در نیویورک نگه می‌داریم. گروه‌ها به آنان اختیار داده‌اند که روابط عمومی کلی ما را اداره کنند، و آنان ضامن درستی نشریهٔ اصلی ما، گریپ‌واین AA، هستند. همهٔ این نمایندگان باید با روحیهٔ خدمت هدایت شوند، چرا که رهبران راستین در AA تنها خدمتگزاران مورد اعتماد و باتجربهٔ کل انجمن‌اند. آنان از عنوان‌هایشان هیچ اختیار واقعی به دست نمی‌آورند؛ آنان حکومت نمی‌کنند. احترام همگانی کلید سودمندی آنان است.
10. هیچ گروه یا عضو AA هرگز نباید به گونه‌ای که پای AA را به میان بکشد، دربارهٔ موضوعات بحث‌برانگیز بیرونی — به‌ویژه سیاست، اصلاحات مربوط به الکل، یا مذهب فرقه‌ای — اظهار نظر کند. گروه‌های الکلی‌های گمنام با هیچ‌کس مخالفت نمی‌کنند. دربارهٔ چنین مسائلی هیچ دیدگاهی نمی‌توانند ابراز کنند.
11. روابط ما با عموم مردم باید با گمنامی شخصی شناخته شود. بر این باوریم که AA باید از تبلیغات جنجالی دوری کند. نام‌ها و تصویرهای ما به‌عنوان اعضای AA نباید پخش، فیلم‌برداری یا به‌طور عمومی چاپ شود. روابط عمومی ما باید با اصل جاذبه هدایت شود نه تبلیغ. هرگز نیازی به ستایش از خودمان نیست. بهتر می‌دانیم بگذاریم دوستانمان ما را معرفی کنند.
12. و سرانجام، ما الکلی‌های گمنام بر این باوریم که اصل گمنامی اهمیت روحانی بسیار زیادی دارد. این اصل به ما یادآوری می‌کند که باید اصول را به شخصیت‌ها ترجیح دهیم؛ که باید به‌راستی فروتنی حقیقی را تمرین کنیم. تا نعمت‌های بزرگ ما هرگز ما را تباه نکنند؛ و تا همیشه در اندیشهٔ سپاس‌آمیز او که بر همهٔ ما فرمان می‌راند زندگی کنیم.

Where the English splits a long-form Tradition into several segments, split the Persian at the matching sentence. **Tradition 3's clause is quoted all over the site**: "provided that, as a group, they have no other affiliation" is always «به این شرط که به‌عنوان یک گروه، هیچ وابستگی دیگری نداشته باشند»; "An A.A. group can bind itself to no one" is always «یک گروه AA نمی‌تواند خود را به هیچ‌کس وابسته کند». "Short form" / "Long Form" → «متن کوتاه» / «متن کامل».

**On the /12-traditions/ page:** "reproduced here in full — both forms, word for word — from Alcoholics Anonymous, 4th Edition" becomes: «در اینجا به‌طور کامل آمده‌اند — <0>هر دو متن، کلمه به کلمه</0> — متن کوتاه به ترجمهٔ فارسی خود AA در ایران، و متن کامل به ترجمهٔ ما از <1>الکلی‌های گمنام</1>، ویرایش چهارم انگلیسی: متن کوتاه ص. ۵۶۱–۵۶۲، متن کامل ص. ۵۶۳–۵۶۶». Say it the way the English sentence runs; keep its placeholders; keep the English page numbers.

## The Twelve Concepts, short form [B]
B's Persian, with its typing slips corrected (C2 «علمی» → «عملی»; C3 «بحش» → «بخش»; C6 «جل» → «حل»; C7 «مکان» → «امکان», the English words in it dropped; C8 «طاحان» → «طراحان») and cut to the sentences the English page has (the English prints only the first sentence of Concepts 7–12). All twelve, cut, are in `i18n/fa/core.json` (the /aa-info/ page): use exactly those sentences wherever a Concept is quoted.

## Prayers and fixed texts — one wording, everywhere
- **Serenity Prayer** [A, «هوشیار زیستن»]: «خداوندا، آرامشی عطا فرما تا بپذیرم آنچه را که نمی‌توانم تغییر دهم، و شهامتی تا تغییر دهم آنچه را که می‌توانم، و دانشی که تفاوت این دو را بدانم.»
- **Third Step prayer** (English p. 63) [A, «دعای قدم سوم»]: «پروردگارا، خود را تقدیم تو می‌دارم؛ با من کن و از من ساز آنچه خود اراده کنی. از اسارت نفس رهایم کن تا انجام اراده‌ات را بهتر توانم. مشکلاتم را بگیر تا پیروزی بر آن‌ها شاهدی باشد برای کسانی که با قدرت تو، عشق تو و در راه تو یاری‌شان خواهم داد. باشد که همیشه بر اراده‌ات گردن نهم.» (A ends with «آمین» in meetings; the English p. 63 has no Amen, so neither do we.)
- **Seventh Step prayer** (English p. 76) [A, «دعاهای قدم هفتم»]: «آفریدگارا، من اکنون آماده‌ام که تمام خوب و بد وجودم را به تو بسپارم. تمنا دارم یک‌یک نقص‌های درونم را که سد راه خدمت به تو و همنوعان من است برطرف کنی، و قدرتی عطا فرمایی تا از این پس به خدمت تو کمر بندم. آمین.»
- **The A.A. Preamble** [A, `/fa/about-us/definition`]: «الکلی‌های گمنام انجمن افرادی است که تجربه، نیرو و امید خود را با یکدیگر مشارکت می‌کنند تا شاید بتوانند مشکل مشترکشان را حل کنند و دیگران را نیز در بهبودی از بیماری الکلیسم یاری دهند. تنها لازمهٔ عضویت، تمایل به توقف نوشیدن الکل است. در الکلی‌های گمنام حق عضویت و یا پرداختی وجود ندارد؛ ما از طریق کمک‌های داوطلبانهٔ خودمان خودکفا هستیم. الکلی‌های گمنام با هیچ فرقهٔ مذهبی، سیاسی، سازمان و یا نهادی پیوستگی ندارد و مایل به موضع‌گیری در مباحث و مشاجرات نیست و هیچ موضوعی را رد یا قبول نمی‌کند. هدف اصلی ما هوشیاری و کمک به دیگر الکلی‌هاست تا به هوشیاری برسند.»
- A prayer or fixed text quoted in part uses these words, cut, not reworded.
- **Any other line the English quotes from the Big Book, a pamphlet or Grapevine:** translate it faithfully yourself (ترجمهٔ آزاد), and use the same Persian each time the same English line comes back in your batch (search your file before you write it again). One rule for everyone keeps the pages even.
- A quote's credit line: the English "Alcoholics Anonymous, 4th Edition, page N. A short quotation, for identification and study. Read the whole page in your own copy →" becomes «<0>الکلی‌های گمنام</0> (کتاب بزرگ)، ویرایش چهارم انگلیسی، صفحهٔ N؛ ترجمهٔ آزاد. نقل‌قولی کوتاه، برای شناخت و مطالعه. <1>کل صفحه را در نسخهٔ خودتان بخوانید →</1>». Keep the English's placeholders around the same words.

## Site words
| English | Persian |
|---|---|
| Daily Reflection / Daily Tradition | تأمل روزانه / سنت روزانه |
| Today's Reflection / Today's Tradition | تأمل امروز / سنت امروز |
| Daily Reading | خواندنی روز |
| Recovery Einstein's Big Book perspective | نگاه Recovery Einstein از کتاب بزرگ |
| Read today's official reflection at aa.org → | تأمل رسمی امروز را در aa.org بخوانید → |
| a question to sit with / Sit with | پرسشی برای تأمل / برای تأمل |
| In plain terms | به زبان ساده |
| Meetings Map / Online Meetings / Find a meeting | نقشهٔ جلسه‌ها / جلسه‌های آنلاین / پیدا کردن جلسه |
| Talk to Recovery Einstein | گفت‌وگو با Recovery Einstein |
| You're not alone | تنها نیستید |
| Get the App / web app | دریافت اپلیکیشن (the top menu says «اپلیکیشن») / اپلیکیشن وب |
| AI / AI chat | هوش مصنوعی / گفت‌وگو با هوش مصنوعی |
| free / No sign-up | رایگان / بی‌ثبت‌نام |
| Home (breadcrumb) | خانه |
| ← Previous / Next → | ← قبلی / بعدی → (keep the English's arrows exactly; the build turns them) |
| Page by page | صفحه به صفحه |
| Big Book Search Engine | موتور جست‌وجوی کتاب بزرگ |
| Tradition N · live (month grid) | سنت N · در دسترس |
| Tradition N · 30 readings | سنت N · ۳۰ خواندنی |
| Ask Recovery Einstein about Tradition N → | دربارهٔ سنت N از Recovery Einstein بپرسید → |
| Daily Tradition card tags — the same on every card | the threat → تهدید · the threat today → تهدید امروز · before the tradition → پیش از سنت · how a group breaks it → گروه چطور آن را می‌شکند · how it gets captured → چطور به چنگ می‌افتد · the earned answer → پاسخی که به دست آمده · where it goes wrong → کجا کار خراب می‌شود |
| Not verified yet | هنوز تأیید نشده |
| email | ایمیل |
| Recovery Starts is an independent recovery-awareness project: not official A.A. literature, not an A.A. group, not affiliated with A.A.W.S., and not medical advice | Recovery Starts پروژه‌ای مستقل برای آگاهی دربارهٔ بهبودی است: نه نشریهٔ رسمی AA، نه یک گروه AA، نه وابسته به A.A.W.S.، و نه توصیهٔ پزشکی |
