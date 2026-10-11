# The translation pipeline

The site in other languages (claude-home `secrets-docs/WO-TRANSLATE-SITE.md`; wave `waves/2026-10-12-tr1/`). Run locally; Cloudflare Pages only serves what it writes.

```
cd scripts/i18n && npm install          # once (parse5)
node scripts/i18n/extract.mjs           # every page's text → i18n/segments/<part>.json (+ pages.json)
node scripts/i18n/batch.mjs             # → i18n/batches/<part>-<n>.json, the runner-sized pieces, and BATCHES.md
node scripts/i18n/check.mjs es [batch]  # a translation file is sound: every id real, placeholders kept
node scripts/i18n/build.mjs es          # → /es/… for every page whose text is all translated; the 🌐 on both copies
```

- A language is a folder of translation files, `i18n/<code>/*.json` (`id → text`), plus `_phrases.json` for words the site's scripts write in the browser (read by `/rs-t.js`), plus its `GLOSSARY.md`. Its code, own name and direction go in `LANGS` in `lib.mjs`.
- A translation is written in the placeholder form the batch file shows: `Call or text <0>988</0>.` — the numbers stand for the original tags, which the build puts back.
- A page is built in a language only when every one of its segments is translated, so no page is half in one language. The 🌐 on each page lists only the languages that page exists in, each in its own name.
- Re-run `extract.mjs` after any English page changes; a changed sentence gets a new id and its old translation simply stops being used.
- Building is repeatable: the same files in give the same pages out.
