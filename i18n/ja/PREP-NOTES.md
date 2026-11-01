# Japanese (ja) — prep notes

*prep-ja, 2026-11-01 (UTC 14:55–15:25). Research only: nothing merged, built or deployed. Work order: claude-home waves/2026-11-01-jalang1/README.md ("Prep: what the research covers"), waves/2026-10-31-prep-ja/README.md (prep-ja-lang), waves/2026-10-16-prep1/README.md (its rules). Files: `GLOSSARY.md`, `core.json`, `PREP-NOTES.md`, `verify-fixed.mjs`, all under `i18n/ja/`.*

## The short version
**Japanese isn't Hindi: A.A. Japan publishes A.A.'s core texts in Japanese on its own site.** The General Service Office (AA日本ゼネラルサービス, JSO, aajapan.org) prints the Twelve Steps, the Twelve Traditions short **and** long form, the Twelve Concepts (short form, complete) and the Preamble, each «reprinted with permission of A.A. World Services» (the Preamble: of A.A. Grapevine). It also prints the Big Book's chapter titles (on its audio-reading page) and every book and pamphlet title (its catalog). So the glossary gives those as **A.A. Japan's wording, word for word**, and the site's "A.A.'s own wording" claims stay true in Japanese.

What **isn't** online, so is **[ours]** and marked as ours on the page: the **Serenity Prayer, the Third and Seventh Step prayers, and the Big Book's text** (quotes). No decision is open before runners start, unlike Hindi; the things worth a word with Derick or JSO are under "Unsure" (1 and 2).

## How the fixed texts were taken, and how to check them
- `fixed.py` (prep-ja's scratch script, not committed) read the five aajapan.org pages' article text and wrote the 12 Steps, 12 short Traditions, 12 long Traditions (+ their opening line), 12 Concepts (+ the page's two-paragraph intro) and the Preamble into the glossary and into `core.json`'s 24 /aa-info/ segments. **Nothing was typed by hand.**
- The only change: A.A. Japan prints Latin letters and digits full-width («ＡＡ», «１２»); here they're half-width («AA», «12»), like the rest of the page; and a few spaces a PDF copy left inside words on the Concepts page («常任理 事会», «ス タッフ») are removed. Every kana, kanji and punctuation mark is A.A. Japan's.
- **`node i18n/ja/verify-fixed.mjs`** (Node 18+, no dependencies) fetches the five pages again, applies the same mapping, and prints only the entries it can't find. 2026-11-01 ~15:15Z: **73/73 match, 0 differences.** Tested the other way too: one character changed in Step 1 and in one core.json Concept → both reported, exit 1. It never prints the texts when they match (the S1 rule: compare by script, print only differences).
- `node scripts/i18n/check.mjs ja` with `ja` added to LANGS in a throwaway copy (scripts/ untouched on this branch): **0 problems, core 277/277** (`ja_ours_note` is the 278th key; check.mjs skips `ja_*` ids the way it does `hi_ours_note`).

## Choices runners need (all in GLOSSARY.md, with sources)
- **Register:** site prose in **です・ます**, the way A.A. Japan speaks to someone new (aajapan `/introduction/`, `/isaaforyou/`; aakco's 「こちらＡＡ」). Fixed texts stay in A.A. Japan's **である**. Buttons and links: short plain verb phrases («ミーティングを探す», «今日の振り返りを読む →»). "You": usually dropped; **あなた** where needed, as A.A. Japan writes. "We": **私たち** (the Steps).
- **God and the Higher Power:** **神** (the Steps); Higher Power **自分を超えた大きな力** (Step 2, and A.A. Japan's catalog blurb for 『信じるようになった』). **«ハイヤー・パワー» is on no A.A. Japan page we read**, so it isn't the default; it's allowed only where the English is discussing the English term, with the gloss.
- **«AA»** half-width, no periods (A.A. Japan's texts print «ＡＡ»; its catalog item names and the Kansai office's headings print «AA»). **アルコホーリクス・アノニマス**, **アルコホーリク**, **アルコホリズム** (never swapped for «アルコール依存症者» except in A.A. Japan's own bracketed gloss).
- **Punctuation:** 。、 ？！ （） full-width; 「」 for quotes, 『』 inside them and for book titles; «～» (U+FF5E, as JSO prints) for ranges; «――» for a dash inside a sentence; no spaces between Japanese and Latin words.
- **Numbers and dates:** half-width Latin digits; comma under 10,000 («5,700人»), **万** from 10,000 up («200万人以上», «2万9,000以上»), as A.A. Japan's `/introduction/` writes. **2026年11月1日**; months 1月–12月; weekdays 日曜日… and «（月～金）» in schedules.
- **Times: 24-hour** («19:00», «10:00～16:00»), as A.A. Japan's offices and meeting lists print them, the same lists the ja1 map wave read (its queue ruling 2). «午前2時» only in running prose where the English says "2 AM".
- **Page references** stay the English 4th Edition's, said as 英語版: the Japanese edition's pagination differs (A.A. Japan's 2025 errata puts Tradition 11 at hardcover p. 649 / pocket p. 259), and the Japanese edition carries **12 Japanese members' stories** in place of most English stories (catalog B001), so an English story quoted on our site (p. 417, "Acceptance Was the Answer") has **no** Japanese original at all.
- **Fellowship words:** A.A. as a fellowship → **共同体** (the Preamble); fellow members → **仲間**; "a fellowship" in general and "the nine fellowships" → **自助グループ** [ours].
- **The site's own series names** [ours]: Daily Reflection → **毎日の振り返り** (echoing A.A. Japan's blurb for 『今日を新たに』, «今日一日を省みるための書»); Daily Tradition → **毎日の伝統**; Daily Reading → **毎日の読みもの**. A.A.'s *Daily Reflections* book is **『今日を新たに』** (catalog B007).

## The "our translation" note (for S1)
`core.json` carries **`ja_ours_note`**, worded to be true on any page: the Steps, Traditions, Concepts and Preamble quoted here are JSO's published Japanese; Big Book text and prayers are our translation from A.A.'s English, not an A.A.-published Japanese translation; «<0>英語で読む</0>». build.mjs shows it under the h1 when `OURS_NOTE.ja` is on (hi's mechanism). S1's call: turn it on for the Big Book pages, the daily pages, /steps/ (prayers) and the home card (p. 417), and probably **skip /aa-info/, /12-traditions/ and /12-concepts/**, whose quoted texts are all A.A. Japan's (OURS_SKIP is one regex for every language today, so that needs a per-language skip). Where a prayer is printed, the glossary also asks for «（Recovery Startsによる翻訳）» after it.

## Font and line breaking (for S1; nothing here touches style files)
Modelled on `style.hi.css`. Proposed `style.ja.css`:
```css
/* Noto Sans JP after the site's Latin fonts, so AA, Recovery Einstein and other Latin words keep the site's face;
   the system Japanese fonts after it, in case Google Fonts doesn't load. */
html:lang(ja){--font-display:'Fraunces','Noto Sans JP','Hiragino Sans','Yu Gothic',Meiryo,Georgia,serif;--font-body:'Outfit','Noto Sans JP','Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,system-ui,sans-serif;--font-ui:'Outfit','Noto Sans JP','Hiragino Sans','Yu Gothic',Meiryo,system-ui,sans-serif}
html:lang(ja) body{line-height:1.8;line-break:strict;word-break:normal;overflow-wrap:break-word}
html:lang(ja) h1,html:lang(ja) h2,html:lang(ja) h3,html:lang(ja) h4{line-height:1.5}
html:lang(ja) *{letter-spacing:0!important;font-style:normal!important}
html:lang(ja) em,html:lang(ja) i{font-weight:600}
html:lang(ja) input,html:lang(ja) textarea,html:lang(ja) select,html:lang(ja) button{font-family:var(--font-ui)}
```
- Load `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap` on ja pages only. Google serves Japanese fonts sliced by `unicode-range`, so a page downloads only the slices its characters need.
- **No italics** (Japanese has none; a slanted Japanese face looks broken): the glossary puts 『』 around `<i>` book titles instead.
- `line-break: strict` keeps 。、」 and small kana off the start of a line; `word-break: normal` lets Japanese break between any two characters, as it should, without splitting Latin words; `overflow-wrap: break-word` stops a long URL or e-mail from widening the page.
- Headings in Fraunces + Noto Sans JP mix a serif Latin with a sans Japanese. If that looks wrong at 1366 px, Noto Serif JP for `--font-display` is the alternative (a second font download). S1 decides by looking.
- **390 px:** Japanese is wide per character but short per label. A per-label width estimate (CJK = 1 em, Latin ≈ 0.55 em) over every core string ≤ 34 English characters: the biggest growths are «このサイトについて» for "About" (≈ 9 em vs 2.8), «ここは空欄のままにしてください» (the honeypot's hidden label), «Einsteinに入っているビッグブックのページ» (a stat label, wraps), and «ミーティングを知らせる» for "Add a Meeting" (≈ 11 em vs 7). If the menu or footer overflows at 390, the shorter forms are **«サイトについて»** for "About" and **«ミーティングを追加»** for "Add a Meeting"; otherwise keep core.json's and let them wrap. Check the real render.

## Teaching the scripts `ja` (S1; listed here so it's quick)
- `scripts/i18n/lib.mjs` LANGS: `ja: { name: "日本語", dir: "ltr", en: "Japanese" }`, placed after `hi` (the 🌐 order in the jalang1 README ends «… हिन्दी · 日本語»). `lang="ja"`, og locale **`ja_JP`**.
- **score.mjs flags for ja** (the README's three, plus what this prep turned up):
  - wrong characters: fullwidth Latin/digits `[０-９Ａ-Ｚａ-ｚ]` outside a quoted A.A. Japan title (pamphlet titles like 「ＡＡにご用は？～１２の質問～」 keep A.A. Japan's widths; allow-list them); half-width katakana `[｡-ﾟ]`;
  - wrong quote marks: `“ ” "` in Japanese prose; ASCII `, . ? ! :` touching kana/kanji (`[぀-ヿ一-鿿][,.?!:]|[,.?!:][぀-ヿ一-鿿]`, excluding URLs and times);
  - English left untranslated: a run of 3+ Latin words that isn't a brand on the glossary's list;
  - wrong form of address: «お前», «君», «〜しろ», «〜なさい»; and, for review rather than as an error, a sentence ending «〜だ。» or «〜である。» in a non-quoted segment (the fixed texts and Big Book quotes legitimately end that way);
  - crisis: «テキスト»/«SMS» within a sentence of 988; «24時間» within a sentence of いのちの電話; «#いのちSOS» anywhere (suspended through 2026-11-30); «秘密» said of a Japanese line (see Unsure 3);
  - «ハイヤーパワー» without the gloss; «献金» outside A.A. context (Donate is 寄付).
- `WAVE.ja="jalang1"` in score.mjs (the README).

## Crisis lines (details and exact wording: GLOSSARY.md "Crisis lines")
- **Kept:** **いのちの電話** 0120-783-556 (free; 毎日16:00～21:00, and the 10th of each month 8:00 to 8:00 next day) and 0570-783-556 (charged; 10:00～22:00 every day) [inochinodenwa.org]. **よりそいホットライン** 0120-279-338 (free, nationwide, confidential; phone, FAX, chat, SNS) [since2011.net/yorisoi/], **with no hours stated** (its own pages don't give the Japanese line's hours). **119** for a medical emergency [fdma.go.jp]. **Canada 9-8-8** (EN/FR; another language "may be available by phone, via an interpreter") [988.ca]. **USA 988** (call with an interpreter in 240+ languages, free; text and chat EN/ES only) [samhsa.gov]. All read 2026-11-01.
- **Dropped:** **#いのちSOS** (Lifelink, 0120-061-338): its own site says phone, email and SNS counselling are **suspended 2026-11-01 00:00 to the end of November** for an urgent security fix. MHLW's list still shows it as 24/365, which is also why MHLW's list isn't trusted for よりそい's hours.
- **Held:** **こころの健康相談統一ダイヤル** 0570-064-556 (MHLW: hours vary by prefecture; charged); **110** (police: not confirmed on a police site this pass; npa.go.jp gave no page stating it, keishicho's guessed URL was 404).
- Wording: Japan first (いのちの電話, よりそいホットライン, 119), then «アメリカ・カナダでは988に電話し、日本語の通訳を頼んでください». Never "text" for 988. «秘密厳守» said of 988 only (the hi1 rule in the README).

## Unsure
1. **The prayers are [ours].** Japanese A.A. meetings surely say a Serenity Prayer, and the Japanese Big Book has the Third and Seventh Step prayers, but **no A.A. Japan page prints them**, so the glossary has fresh translations of A.A.'s English, marked ours. A member may find our Serenity Prayer differs from the one said aloud in Japanese rooms. Worth asking JSO (its literature page gives jso-1@fol.hi-ho.ne.jp) whether we may quote its published wording; then it's a find-and-replace. **I contacted no one.**
2. **The Big Book's Japanese text** isn't online as text. A.A. Japan does publish an **audio** reading (SoundCloud, from aajapan.org/bb-soundcloud/: chapters 1–11, ドクター・ボブの悪夢, the appendices). Transcribing it would give A.A.'s Japanese for quotes, but it means copying a copyrighted book from a recording; I didn't, and recommend not. The CEO's call. Until then, quotes are ours and marked.
3. **"Confidential"**: the README carries hi1's rule ("confidential" of 988 only). Both Japanese lines say it of themselves on their own sites (いのちの電話: «お話の内容が外に漏れることはありません»; よりそい: «秘密は守ります»), so the CEO may allow «秘密は守られます» for them. The wording here follows the README until told otherwise.
4. **よりそいホットライン's hours:** "24 hours" is MHLW's claim, not the line's own; written without hours.
5. **«再販にあたって»** (Foreword to the Second Edition) is printed so on A.A. Japan's audio page; «再版» is very likely what the book says. Copied as printed; worth a look in a printed copy.
6. **Pamphlet and service-role matches I inferred:** «44 Questions» = 「よくある質問」 (P002)? GSR = «代議員» (P028's subtitle «グループがＡＡ全体とつながるために» matches the English GSR pamphlet's)? Conference delegate = «評議員» (from «ＷＳＭ評議員» on `/soboku/`)? None is stated outright on A.A. Japan's pages.
7. **«自助グループ»** for "fellowship" in general and **«毎日の振り返り»** for the site's Daily Reflection are our choices; both are a find-and-replace if the CEO prefers others («フェローシップ», «今日の黙想»; I avoided 黙想 because it's A.A. Japan's Step 11 word for "meditation").
8. **No native Japanese-speaking A.A. member has read this.** One read of `core.json` and the three prayers by someone in Japanese A.A. would be worth it before the pages go live.
9. **«ＡＡ» vs «AA»:** we print half-width; A.A. Japan's own texts print full-width. A find-and-replace either way (verify-fixed.mjs already normalises).
10. **aa.org's search page:** I fetched `aa.org/search?keys=Japanese` once **before** reading its robots.txt, which disallows `/search?`. One request; nothing used from it (the sitemap answered the question). Said here so the record is straight.
11. **#いのちSOS** should be rechecked in December (Lifelink says it will post December's plans during November).
