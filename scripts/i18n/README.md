# The translation pipeline

Builds the site's translated pages (`/es/…`, `/de/…`, …) from the English pages and the translation files in `i18n/`.

- `extract.mjs` — every English page's text → `i18n/segments/<part>.json` (+ `pages.json`).
- `batch.mjs` — segments → `i18n/batches/<part>-<n>.json` and the index `BATCHES.md`.
- `check.mjs <lang> [batch]` — checks a translation file: every id real, placeholders kept.
- `build.mjs <lang>` — writes `/<lang>/…` for every page whose text is fully translated, and the 🌐 language menu.
- `score.mjs`, `rtl.mjs`, `globe.mjs`, `restamp.mjs`, `sitemap.mjs`, `indexnow.mjs`, `unescape-attrs.mjs` — scoring, right-to-left handling, the language menu, date stamps, per-language sitemaps, IndexNow pings, attribute-escape repair.
- `lib.mjs` — shared helpers and `LANGS` (each language's code, own name and direction).

A language is `i18n/<code>/*.json` (`id → text`, tags written as placeholders like `<0>988</0>`), `_phrases.json` (strings `/rs-t.js` uses in the browser) and `GLOSSARY.md`. A page is built in a language only when all its segments are translated; a changed English sentence gets a new id. Dependencies: `parse5` (`package.json` here).
