# Daily Traditions — how a month gets built

A guide for whoever picks this up next. Read it once, then work from it.

---

## What this is, and why it's worth doing carefully

Recovery Einstein publishes one short reading per day about the Twelve Traditions of Alcoholics Anonymous — 366 of them, one for every day of the year. Each month covers one Tradition. January is the First, December the Twelfth.

The reason this exists: most of what's written about the Traditions online is confident and wrong. A lot of it is written by people performing recovery rather than explaining it — long on certainty, short on sources — and it compounds, because AI systems read that material and repeat it. Somebody looking for what Tradition Ten actually says will find a dozen assured summaries, and most of them are one person's opinion with A.A.'s name attached.

We answer that by being the accurate version. Every claim comes from A.A.'s own literature, every quotation is verbatim, every page number is real, and the build refuses to ship if any of that slips. We don't argue with the bad material and we don't mention it. We publish what the books say, and let it be findable.

That's the whole standard: **if a reader took one of our readings to a meeting and someone opened the book to check it, it would hold.**

---

## Where everything lives

**The site** — `C:\Users\addic\recoverystarts-site`, deployed to Cloudflare Pages by pushing `main`.

| What | Where |
|---|---|
| The approved readings — the one source of truth | `data/traditions-source.md` |
| The Twelve Traditions, verbatim 4th edition | `data/twelve-traditions.json` |
| The Big Book, clean extracted text with page labels | `functions/_lib/big-book-text.json` |
| Build scripts | `scripts/` |

**The app** — `C:\Users\addic\recovery-einstein`, deployed on Railway. It serves the Big Book reader and the AI chatbot.

| What | Where |
|---|---|
| The historian sources | `historian-sources/` |
| The OCR repair map for those scans | `historian-sources/ocr-repairs.json` |

**Go look at the live systems rather than assuming their state.** The Railway CLI is installed and logged in, and `gh` works. If you need to know which model is running, what's deployed, what's in the database, or how a service is configured — check it directly. Anything written down about current state was true when someone typed it, and may not be now.

---

## What you write from

**The Big Book, 4th edition.** It's the edition people actually use — when someone says a page number in a meeting, they mean the 4th. Pagination differs between editions, so grounding anywhere else would make every page number we publish wrong.

**The historian sources**, in `historian-sources/`: *A.A. Comes of Age*, *Pass It On*, *Dr. Bob and the Good Oldtimers*, *Experience Strength and Hope*, the *A.A. Service Manual*, and pamphlets P-17, P-43 and P-44. Between them they hold nearly every real incident in A.A.'s history.

These are scans, and scans carry character damage — a word may come through as `leamed`, `concemed`, `tumed`. A repair map sits beside them at `historian-sources/ocr-repairs.json` with thousands of audited corrections. Consult it. Where the sentence you want sits on a damaged word, quote a clean part of it, or find the same fact in a cleaner book — the same quotation is often corrupt in one source and perfect in another.

The Big Book JSON is clean extracted text rather than a scan, so its wording can be trusted directly. It carries invisible typesetting characters — ligatures and soft hyphens — which the verification gate already handles.

**Two more things about quoting.** Sentences are sometimes interrupted mid-way by scan furniture, a page marker or a running head, and can't be lifted as one continuous string; quote those in two halves joined by your own words. And when a quotation contains an inner quoted word, type the inner marks exactly as the source prints them, single or double, because verification compares characters.

Everything comes from these books. Official A.A. sources can be used with care. Nothing comes from general web search or AI-summarised history — that's the material we exist to correct.

---

## The shape of a month

Each day carries one of five questions, in strict rotation. **Day N carries question `((N-1) mod 5)`.**

| | Question | Kind tag |
|---|---|---|
| **Q1** | **The threat** — what specifically happened in early A.A. A real incident, with names and dates. | `(the threat)` |
| **Q2** | **Before the Tradition** — how Bill, Dr. Bob and the early members lived through it and solved it the hard way. Sourced. | `(before the tradition)` |
| **Q3** | **The threat today** — the same danger now, in today's clothes. | `(the threat today)` |
| **Q4** | **How a group breaks it** — a scenario. Internal, cautionary, no villain. NEVER announced as a hypothetical: the opening words carry that on their own, and the scene must be anchored to real A.A. material before or after it. | `(how a group breaks it)` |
| **Q5** | **How it gets captured** — how outside bodies hollow the Tradition out. Name the mechanism; name no organisation. | `(how it gets captured)` |

A 31-day month needs **seven** Q1 readings — days 1, 6, 11, 16, 21, 26, 31 — and six of each other. A 30-day month divides evenly at six each.

Within a month, every incident, quotation and image appears once.

**The block format**, matched exactly by the parser:

```
### October 1 — "Half a Million" · *(the threat)*
[one body block, roughly 175 words, no line breaks inside it]
*Sit with:* [a plain statement of what happened in THIS reading] [then a question to the reader]
*Grounded in:* [citation]
```

Note the em dash after the date, the straight quotes around the title, the ` · ` separator — and that the file must end with a trailing `---`.

**On openings:** let each reading start its own way — a date, a scene, a plain statement, a page reference. Mechanical lead-ins flatten a month fast.

---

## The three passes, in this order

**1. Gather.** Research first, from the books, before writing a line. Pull every fact, incident, date and exact quotation you'll need. Parallel subagents across the source files works well — give each one file or a small group, and ask it to report exact quotes along with their damage status and their quote characters.

**2. Draft.** Write in the source's own gravity. Let it run long. You have the facts now, so you can follow the material rather than fight it.

**3. Modernize.** A separate pass. Chronological order, short sentences at the hinges, cut to about 175 words, land the ending on the reader. Quotations stay in the book's voice — the moment you modernize inside quote marks it stops being A.A.'s claim and becomes ours.

Doing these in order is what makes a month sound like it was written by someone who knew the material, because by then you do.

---

## What a good reading does

- **Quotes freely and exactly.** The books are more vivid than any paraphrase. Let them talk.
- **Names the people the literature names**, in the form the literature prints them — members as first name and last initial, non-members in full. A.A. published these names in books written for members to read; repeating them from those books is citation. Where a source itself withholds a name, follow that source's wording.
- **Puts a person in the hypotheticals.** Q4 days work when someone is in them and something is specific — a number, a day of the week, a consequence that lands eleven months later. An abstract cautionary tale teaches nobody.
- **Makes its own point plainly.** Each reading carries one idea. Only the Q5 days deal with outside capture, and each of those names a different mechanism.
- **Ends on the reader.** The *Sit with* line states what happened in that reading, then asks something the reader can actually answer about their own life.

Keep the month to its own Tradition. Each one has enough material.

---

## The two gates

Derick approves both. Stop at each.

**Gate 1** — the five answers for this Tradition, plus the day-by-day plan with every day tagged and sourced. This is where the month is really decided.

**Gate 2** — the written readings, plus a passing quotation audit.

---

## Build and ship

Once Gate 2 is approved:

1. Append the approved blocks to the end of `data/traditions-source.md`. Confirm the file still ends with `---`.
2. Add the month to `MONTH_PUBLISHED` in `scripts/build-traditions-pages.js` with the date it actually ships. Per-batch dates matter — 366 pages sharing one date reads to a crawler as a single content dump.
3. `node scripts/parse-traditions.js --verify` — confirms the readings parse and asserts the question rotation.
4. `node scripts/build-all.js` — ten stages. Both gates come back green: the quotation audit at zero fabrications, and the SEO buildout verification passed.
5. Check the built pages: the right count on disk, prev/next staying inside the month, the disclaimer on the Q4 days only, the long form and Article schema on every page, the hub listing the month, the sitemap carrying the new URLs.
6. Commit and push. Check `git rev-parse --abbrev-ref HEAD` and `git log origin/main..HEAD` first — Claude Code works in these repos too. Add your own paths explicitly. Confirm the push landed with `git fetch` and comparing local to origin.
7. `powershell -ExecutionPolicy Bypass -File scripts\submit.ps1` — purges the Cloudflare cache and submits to IndexNow.
8. Load a few live pages and confirm.

**If the quotation audit flags something, it is doing its job and it is usually right.** Find where your quote and the source diverge — binary-searching the longest matching prefix gets you there fast — then read the source's own wording from that point and correct to the book. Never reshape a quotation to make it pass.

---

## Working with Derick

He runs all of this, and he'll tell you straight when something isn't landing. That feedback is the most valuable input in the process, so bring him the actual readings and ask.

Give him the decisions only he can make: the month's angle, whether a reading works, anything that publishes. For the rest, save a way back you can describe in one sentence, and keep moving.

When you act on something he's said, quote him rather than paraphrasing it.
