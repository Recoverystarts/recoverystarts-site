# Open Cosmos — the design system

*recoverystarts.com. `style.css` section 1 holds the tokens; this file describes them.*

## Soul

The site is the night sky over a small lit town: violet-navy grounds under a
cosmic sky (`/assets/world/cosmos-bg.webp`, painted hero), glass panels
floating on it, and warm gold as the book light on the readings. The site is
night-native; there is no light theme. Einstein stands in the hero as the
companion in the dark.

The test behind the look: someone shaking on their phone at 3am feels held,
not marketed to.

## System

- **Grounds:** `--paper` #12081F (violet-navy), `--paper-2` #0E111C,
  `--paper-3` #1A1528, `--void` #04060D. Ink: `--ink` #F2F4FF /
  `--ink-soft` #D0D7EE / `--ink-dim` #9AA5C0. Hairlines are ink at low
  alpha (`--rule`).
- **Accents, each with one job:**
  - **Teal** `--accent` #2DD4BF — the action accent: the free-value door,
    links, focus rings, the Get the App pill.
  - **Soft violet** (rgba 167,139,250) — the Meetings Map pill
    (`.nav-cta-map`), glowing beside the app door.
  - **Warm gold** `--sky-gold` #E0B15E — the book light on readings and
    sanctuary bands.
  - **Crisis blue** `--crisis` #7DD3FC — the 988 line.
- **Glass:** panels are `--glass` rgba(8,12,24,.55) + 1px `--glass-border`
  with backdrop blur; `--glass-solid` is the no-blur fallback. Nebula washes
  (`--nebula-violet`, `--nebula-teal`) tint sections.
- **Type:** Fraunces (display, serif) + Outfit (body and UI). Utopia fluid
  scale `--step--1 … --step-5` (320→1240px). Radius trio 20 / 999 / 12
  (`--radius`, `--radius-pill`, `--radius-sm`).
- **Motion:** all inside `prefers-reduced-motion: no-preference`; stillness
  is the default (section 13). `--ease` cubic-bezier(0.22,1,0.36,1).
- **Chrome (stamped by `scripts/fix-nav.js`):** nav = brand + Meetings Map
  pill (violet, first) + four dropdowns (Daily Reflection / Daily Tradition
  months from data, Big Book, The Program) + About + Get the App pill (teal).
  Floating Einstein pill on every page. The footer carries the 988 line and
  the privacy / independence / no-medical-advice notice.

## What the site is

- Every reading is free and complete; nothing is gated.
- Imagery is the real text, the real app or the painted cosmos; no stock
  photography, testimonial walls, star ratings or logo strips.
- The one prompt is a small, closable, once-per-month donate sheet
  (`/donate.js`) that appears after a reader has searched.
- Person-first language.
- Glass blur and view transitions are progressive enhancement over a page
  that is complete as plain HTML.

## Mechanics

- `style.css` carries the whole system and the legacy token bridge
  (section 1b): older var names mapped to Open Cosmos values, plus overrides
  for legacy backdrops (`.dr-bg`, `.dt-bg`).
- `scripts/fix-nav.js` stamps the header, footer and floating pill on every
  page and content-hashes style.css/app.js/cosmos.js into asset links;
  `node scripts/build-all.js` runs it last.
- The meeting finder (recoverystarts.com/meetings/* → meetings service via
  the `meetings-router` Worker) renders its own paper-toned pages
  server-side.

## Sibling surfaces

- `read.recoverystarts.com` — the Big Book reader (app mirror).
- `/meetings/*` — the meeting finder (Railway service behind the Worker).
- `app.recoverystarts.com` — Recovery Einstein.
