# Open Cosmos — the design system

*recoverystarts.com. The night world, locked by Derick + Grok (grok-handoff/).
This document was rewritten 2026-08-06 from the shipped style.css after the
old First Light doc went stale — style.css section 1 is the canonical token
source; when this file and the CSS disagree, the CSS is right.*

## Soul

The site is the night sky over a small lit town — violet-navy grounds under a
cosmic sky (`/assets/world/cosmos-bg.webp`, painted hero), glass panels
floating on it, and warm gold as the book light on the readings. Recovery's
3am is real here: the site is **night-native — there is no light theme**.
Einstein stands in the hero as the companion in the dark.

**The organizing test for every decision: does this make someone shaking on
their phone at 3am feel held, not marketed to?**

## System

- **Grounds:** `--paper` #12081F (violet-navy), `--paper-2` #0E111C,
  `--paper-3` #1A1528, `--void` #04060D. Ink: `--ink` #F2F4FF /
  `--ink-soft` #D0D7EE / `--ink-dim` #9AA5C0. Hairlines are ink at low
  alpha (`--rule`), never gray.
- **Accents, each with ONE job:**
  - **Teal** `--accent` #2DD4BF — the single ACTION accent: the free-value
    door, links, focus rings, the Get the App pill.
  - **Soft violet** (rgba 167,139,250) — the Meetings Map pill only
    (`.nav-cta-map`, added 2026-08-06, Derick's call): the door to a real
    room, glowing beside the app door. Do not spread it further.
  - **Warm gold** `--sky-gold` #E0B15E — the book light on readings and
    sanctuary bands. Never an action color.
  - **Crisis blue** `--crisis` #7DD3FC — 988 only, never teal.
- **Glass:** panels are `--glass` rgba(8,12,24,.55) + 1px `--glass-border`
  with backdrop blur; `--glass-solid` is the no-blur fallback. Nebula washes
  (`--nebula-violet`, `--nebula-teal`) tint sections, never full-bleed.
- **Type:** Fraunces (display, serif) + Outfit (body and UI). Utopia fluid
  scale `--step--1 … --step-5` (320→1240px). Radius trio 20 / 999 / 12
  (`--radius`, `--radius-pill`, `--radius-sm`).
- **Motion:** breath, not behavior — everything inside
  `prefers-reduced-motion: no-preference`; stillness is the default
  experience (section 13). `--ease` cubic-bezier(0.22,1,0.36,1).
- **Chrome (stamped by `scripts/fix-nav.js` — THE one header/footer/pill):**
  nav = brand + Meetings Map pill (violet, first) + four dropdowns
  (Daily Reflection / Daily Tradition months from data, Big Book,
  The Program) + About + Get the App pill (teal). Floating Einstein pill on
  every page. Footer always carries the standing 988 line and the privacy /
  independence / no-medical-advice notice.

## What we refuse (carried forward from First Light — still law)

1. No funnel mechanics: popups, exit-intent, countdowns, sticky CTA bars,
   urgency copy, A/B'd labels.
2. No gating, ever — every reading fully free and complete.
3. No stock photography. Imagery = the real text, the real app, the painted
   cosmos, or nothing.
4. No testimonial walls, star ratings, logo strips, invented quotes.
5. No pure #000/#FFF, no gray neutrals; hairlines are ink at low alpha.
6. No accent inflation — each accent keeps its one job (see above).
7. No motion the reader didn't invite.
8. No institutional register — person-first language always.
9. No burying the crisis path: 988 in every footer, plainly, forever.
10. Nothing that breaks Firefox or an old phone — every fancy layer
    (glass blur, view transitions) is progressive enhancement over a page
    already complete as plain HTML.

## Mechanics (how ~1,200 pages stay coherent)

- `style.css` carries the whole system + the **legacy token bridge**
  (section 1b): old First Light var names remapped to Open Cosmos values so
  generated pages' inline styles re-theme without edits, plus targeted
  overrides that neutralize hardcoded legacy backdrops (`.dr-bg`, `.dt-bg`).
- `scripts/fix-nav.js` stamps the ONE header, footer and floating pill on
  every page and content-hashes style.css/app.js/cosmos.js into every asset
  link — run it last, always (`node scripts/build-all.js` does).
- Generators own their page bodies; they must only use tokens, never raw hex.
- The meetings finder (recoverystarts.com/meetings/* → meetings service via
  the `meetings-router` CF Worker) renders its own paper-toned pages
  server-side; it echoes the family palette but is deliberately its own
  quiet reading surface, not chrome-stamped.

## Sibling surfaces

- `read.recoverystarts.com` — the Big Book reader (app mirror).
- `/meetings/*` — the meeting finder (Railway service behind the Worker).
- `app.recoverystarts.com` — Recovery Einstein itself.
Each keeps its own interior design; the shared thread is Fraunces/Outfit,
night-warm palettes, and the same refusals list.
