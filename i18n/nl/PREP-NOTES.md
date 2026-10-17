# Dutch (nl) — prep notes

*Prep window prep1-nl, 2026-10-17. Research only: nothing here is built, merged or deployed. For the CEO window's check (`status/CHECKED-nl.md`) and then the nl wave's super. These are my notes; the work order is claude-home `waves/2026-10-16-prep1/README.md`.*

## What's in this folder
- `GLOSSARY.md` — the shared wording, on the model of `i18n/pl/GLOSSARY.md` and `i18n/fr/GLOSSARY.md`; a source on every A.A. entry.
- `core.json` — the menu, footer and core pages, all 286 ids of `i18n/pl/core.json` (same ids as `i18n/segments/core.json`). Placeholders checked against the English with `lib.mjs`'s own `placeholdersOf` from a scratch script: **0 problems, 286 entries**. (`check.mjs nl` itself refuses to run until `nl` is in `LANGS`; that's the wave's job, and I didn't touch `scripts/`.) HTML entities written as plain characters, as pl and fr do.

## The choices
1. **Shared wording: AA Nederland (aa-nederland.nl).** It's the only Dutch-speaking A.A. body with the Steps and Traditions on its current public site; AA Vlaanderen's site paraphrases the Steps (`/12-stappen/` is twelve short summary lines, not the Steps) and puts the Traditions behind a member login. AA Vlaanderen's Steps and Traditions survive only in its undated «Informatiemap» PDF, in an older translation that differs in many words (listed in the glossary, "Where the two differ"). The Netherlands is also the larger readership.
2. **Preamble: AA Vlaanderen's Informatiemap**, because AA Nederland prints only its first sentence (site footer) and the Informatiemap's first sentence is word for word that footer. AA Nederland's Q&A has an older, different Preamble («De Anonieme Alcoholisten vormen een genootschap…»); not used.
3. **Form of address: je/jij, lower case.** AA Nederland's newer pages and its folder «Is AA wat voor jou», and AA Vlaanderen's site, use je. AA Nederland's older pages and Q&A still say u. Never u/uw/jullie for the reader.
4. **Meeting = «meeting»** (AA Nederland's menu: «Vind een meeting»), «bijeenkomst» in prose; not AA Vlaanderen's «vergadering».
5. **AA** with no periods; AA-lid, AA-groep, AA'er(s). Curly “…” quotes, en dash with spaces, 1.234 / 2,99, «19.30 uur», dates «17 oktober 2026», months and weekdays lower case.
6. **Crisis:** Netherlands and Belgium first, then North America (the pl pattern). Exact wording in the glossary table and already used in core.json (footer, home, app page).

## What's ours (marked [ours] in the glossary)
- The **long form of the Traditions** (not online from either body; it's in the 2014 Dutch Big Book, Bijlage I). Tradition 2's sentence is AA Nederland's.
- **Concepts 2–12** in the short form the English site uses: AA Nederland prints the **long** form; I built the short sentences from its phrases and terms. Concept 1 is AA Nederland's word for word.
- The **Third and Seventh Step prayers** and **the Promises**: not published online by either body. I couldn't confirm Dutch A.A.'s wording, so these are my translations from the English, and the glossary tells runners never to call them A.A.'s Dutch.
- **Big Book chapter titles** except «Hoe het werkt» (AA Vlaanderen's shop). «Ervaringsverhalen» for Personal Stories is AA Nederland's word.
- Small terms with no published Dutch: thuisgroep (home group), intergroep, district, Petitierecht, de Oxfordgroep, «Pass It On» kept in English.

## Unsure / for the CEO window
1. **Copyright notice on AA Nederland's Concepts page:** «Niets uit deze tekst mag worden overgenomen zonder schriftelijke toestemming vooraf van AA Nederland. Copyright © 1996 Stichting Publiciteit AA Nederland.» Its Steps and Traditions pages carry only the site footer («Copyright © 2026 | AA Nederland»), and AA Vlaanderen's PDF marks its Steps and Traditions «Copyright: AA World Services, Inc.» — the same situation pl and fr are in with their A.A. texts. But the Concepts notice is explicit, so I used only Concept 1's one sentence verbatim and told runners not to copy the long-form text. Your call whether even that sentence needs asking AA Nederland.
2. **One spelling correction in a "word for word" text:** AA Nederland's Tradition 2 has «authoriteit»; the glossary and core.json print «autoriteit». I judged it a one-letter slip, not a different wording (the pl window did the same with a slip). If you'd rather print it exactly as A.A. does (the fr window's rule), it's two places: GLOSSARY.md Traditions 2 (short and long form) and core.json id `95ea3eb4fba0`.
3. **0800-0113 dropped.** The work order lists it, but 113.nl's own pages now give only «Bel gratis 113». It still appears in third-party reports (telecompaper; government consultation papers), so it may still ring through; I couldn't confirm it on 113.nl, so it's out.
4. **112.nl** was refused by this session's network proxy (502 on CONNECT). The Netherlands' 112 is confirmed instead on rijksoverheid.nl and on 113.nl («Ben je in levensgevaar? Bel meteen 112»). Belgium's 112 (and 101 police) confirmed on 112.be.
5. **US 988 and Dutch:** SAMHSA says calls get interpreters in "more than 240 additional languages" but doesn't name them. The wording says «vraag om een tolk Nederlands» without promising one. Canada's 988.ca says another language "may be available by phone, via an interpreter".
6. **113 is a suicide-prevention line** ("Denk je aan zelfdoding?"); its hulplijn page also says «Geen levensgevaar, maar wel hulp nodig? Bel gratis 113», so I used it for the site's general "in crisis" lines, as the work order intends. Belgium's 1813 is the same kind of line. Neither country got a youth-only line (none was asked for or checked).
7. **aa.org has no Dutch literature online** (its search for "Dutch", "Nederlands", "Anonieme Alcoholisten" returns nothing), so no aa.org source appears.
8. **Font:** Dutch needs only Latin-1 (é, ë, ï, ó…). The site loads Fraunces and Outfit from Google Fonts' css2 API (index.html), whose `latin` subset covers U+00C0–00FF. No font change.

## Sources, in one place
aa-nederland.nl: `/wat-is-aa/de-12-stappen/`, `/wat-is-aa/de-12-tradities/`, `/wat-is-aa/de-12-concepten/`, `/wat-is-aa/`, `/informatie/over-aa/`, `/informatie/over-aa/hoe-het-werkt/`, `/informatie/over-aa/aa-herstelprogramma/`, `/informatie/algemeen/afkortingen/`, `/vragen-en-antwoorden/`, shop feed `/wp-json/wc/store/v1/products`. aa-vlaanderen.be: `/wat-is-aa/`, `/hoe-werkt-het/`, `/voor-wie-is-aa/`, `/ik-heb-een-probleem/`, `/12-stappen/`, `/12-tradities/` (login), `/downloads/`, shop feed; PDFs `aavlaanderen.org/pdf/AA%20informatiemap.pdf`, `…/AA%2050%20Belgie.pdf`. Crisis: 113.nl (`/heb-je-nu-hulp-nodig/hulplijn`, `/english`, `/teletolk`), zelfmoord1813.be, rijksoverheid.nl (alarmnummer 112), 112.be/nl, 988.ca/get-help/what-to-expect, samhsa.gov/mental-health/988/faqs. All read 2026-10-17.

*— prep1-nl*
