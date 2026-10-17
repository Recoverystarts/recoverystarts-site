# Swedish (sv) — prep notes

*Prep window prep1-sv, 2026-10-17. Research only: nothing here is wired into the build. Written by me, the prep1-sv researcher (Claude); the CEO window checks it before any runner sees it.*

## What's here
- `GLOSSARY.md` — the runners' glossary, on the model of `i18n/pl/GLOSSARY.md` and `i18n/fr/GLOSSARY.md`. Every A.A. text in it was checked word for word against its source (script comparison, 2026-10-17): the 12 Steps, the 12 short-form Traditions, the 12 Concept sentences, the long form of Traditions 1, 3 and 7, the Preamble, the Promises, the seven How It Works lines, the Serenity Prayer and four Doctor's Opinion phrases.
- `core.json` — all 286 ids of `i18n/segments/core.json` (the same ids as `i18n/pl/core.json`), translated by me, no machine translation. Placeholders checked the way `scripts/i18n/check.mjs` checks them: 0 problems. The 12 Traditions and 12 Concepts on /aa-info/ are Swedish A.A.'s words, checked against the sources by script.
- Nothing outside `i18n/sv/` was touched. `scripts/` doesn't know `sv` yet (no entry in `LANGS`); that's the wave's job.

## Sources used (all on A.A. Sverige's own site or its CDN)
- aa.se pages: `/aa-tolv-steg/`, `/aa-tolv-traditioner/`, `/aa-tolv-koncept/`, `/om-aa/`, `/om-aa/om-aa-moten/`, `/medlemmar/nyiaa/`, `/medlemmar/var-gemensamma-valfard/`, `/medlemmar/aas-struktur-i-sverige/`, `/12-stegsprogrammet/`, `/hitta-ett-mote/`, `/berattelser/professionella/lakarensasikt/`, `/bokerbjudande/`, `/brochyrer/`, `/servicehandbok-och-riktlinjer/`, `/om-aa/aas-historia/`.
- Cards (PDF): AA:s Tolv Steg (2017), AA:s Tolv Traditioner (2022-08-24), Ingressen (2022-08-24), Hur det fungerar (2017), Det nionde stegets löften (2017).
- Servicehandbok 2025 (PDF), adopted by Servicekonferensen.
- Pamphlets (PDF): AA-gruppen … där allting börjar (rev. 2024), Självförsörjning (2024), Tolv koncept för världsservice (2023/2024), Präster ställer frågor om AA, Frågor och svar om sponsorskap, Detta är AA, En nykomling frågar, Kvinnor i AA, AA i vården, and others listed in the glossary.
- The literature shop linked from aa.se (titles only).
- aa.org: no Swedish literature online.

## Choices
1. **Form of address: du, lower case.** That's how A.A. Sverige writes to its reader on every page and card («Om du inser att ditt drickande…», «Till dig som är ny i AA»). Capitals only for God (Honom, Hans; Du/Dig in a prayer). For a member's pronoun, «han eller hon», as aa.se writes it; never «hen» or slashes.
2. **Steps:** aa.se and the 2017 card (they're identical). The Servicehandbok adds «som» in Step 8; not used.
3. **Traditions, short form:** the 2022 card. It differs from aa.se's web page in one word only, Tradition 3: «villkoret» (card) vs «kravet» (web and Servicehandbok). I chose the card because it's the dated printed text and it agrees with the 2022 Preamble card. **CEO: if you'd rather match aa.se's web page, change one word in GLOSSARY.md and in core.json id `0e30b8a4b191`.**
4. **Concepts:** A.A. Sverige has two Swedish wordings online. I used the 2023 retranslation as printed in the Servicehandbok 2025, not the older one on aa.se's `/aa-tolv-koncept/` page and 2013 card. It's newer, it's adopted by the Service Conference, and it follows the English much more closely. I fixed one obvious slip, «tillmedbestämmande» → «till medbestämmande». Concept 10 is cut after «befogenhet.» to match the English site's shorter sentence.
5. **Preamble:** the 2022 Ingressen card, the current "people" wording. Older cards say «män och kvinnor», and the Servicehandbok has a small variant. Neither is used.
6. **Long-form Traditions:** 1, 3 and 7 are A.A. Sverige's own (pamphlets, Servicehandbok). 2 is the short form's first sentence. **4–6 and 8–12 are ours**, translated from the English Big Book pp. 563–566 in A.A. Sverige's vocabulary. The /12-traditions/ honesty sentence is in the glossary.
7. **Home group = hemgrupp**, as in the Servicehandbok 2025 and AA-gruppen 2024. aa.se's older pages say «hemmagrupp».
8. **Quotes ”…” (right double quote both ends), en dash with spaces, 24-hour time with a colon (19:00), a space for thousands, a decimal comma, lower-case months and weekdays.** All of these are what A.A. Sverige's own texts do, except the colon in times: Språkrådet prefers 19.00, but aa.se's calendar uses a colon, so I kept the colon.
9. **AA, no periods, genitive AA:s, neuter** («AA är öppet», «AA som sådant»).
10. **Gamblers Anonymous** keeps its English name: anonymaspelare.se didn't answer, so I couldn't confirm a Swedish name. **Anonyma Narkomaner** was confirmed on nasverige.org (the name only).
11. On the /add-meeting/ page, the English example "The Tuesday night one at the Legion" became «Det på tisdagskvällarna i församlingshemmet». A church hall is where Swedish meetings meet; the Legion means nothing in Sweden.

## Unsure / for the CEO window
- **The Third and Seventh Step prayers are ours.** A.A. Sverige doesn't publish them online. They're in the 2017 Big Book («Anonyma Alkoholister», 3rd Swedish edition), which isn't online. I did not fill them from memory of any Swedish printing. I translated the English pp. 63 and 76 myself, marked them [ours], and gave them their own credit line. If Derick or anyone has the Swedish Big Book, swap in its wording.
- **The crisis lines are only partly confirmed on their operators' own sites.** Mind (mind.se, Självmordslinjen) and SOS Alarm (sosalarm.se, 112) both put automated visitors behind a Cloudflare check. I did not try to get around it. archive.org is outside this environment's network policy. So:
  - **112** and **90101** rest on 1177.se, the regions' national health service, which states both: 112 for serious suicidal thoughts, with interpreting available; Självmordslinjen 90101 run by Mind, call or chat via mind.se.
  - **90101's hours and cost are NOT confirmed.** The glossary and core.json say neither «dygnet runt» nor «gratis» about it.
  - **1177** is confirmed on its own site: health advice by phone, 24 hours, every day.
  - Canada 9-8-8 and U.S. 988 were re-checked on 988.ca and samhsa.gov. Swedish is available by phone through an interpreter (Canada: "may be available"). Text and chat are English/Spanish (U.S.) or English/French (Canada) only.
  - **Ask:** open mind.se/hitta-hjalp/sjalvmordslinjen in a browser. If it says 24/7 and free, a runner may add «dygnet runt» for 90101. Until then, leave the table as it is.
- **Big Book chapter titles:** only «Läkarens åsikt» (aa.se) and «Hur det fungerar» (card) are A.A. Sverige's. The other chapter titles are ours.
- **Sponsee** («den man sponsrar»), **resentment** («förbittring»), **detox/withdrawal** («avgiftning», «abstinens») and the Daily Tradition card tags are ours. I found no A.A. Swedish for them online.
- **Mixed capitals.** A.A. Sverige capitalises Steg/Tradition/Koncept unevenly. The glossary sets one rule (capital for a named Step, Tradition or Concept and for the sets, lower case for generic words) and tells runners to keep A.A.'s capitals inside quotes.
- **Font:** no special font is needed. Swedish uses Latin letters plus å ä ö, which every Latin web font covers.

— prep1-sv researcher (Claude), 2026-10-17
