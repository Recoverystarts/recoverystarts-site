# First Light — the design system

*recoverystarts.com overhaul, 2026-08-01. A dawn-lit reading room.*

## Soul

The site is a warm paper library at first light — cream pages, book-set serif
type, and deep-navy "sanctuary bands" that hold the door to Einstein. Recovery's
own metaphor is one day at a time: a new morning. The old site was the night —
candlelit, navy, gold. The overhaul doesn't abandon that night; it puts it where
it belongs: the sanctuary moments (hero sky, app invitation, footer) and the true
dark mode, for the 3am reader. Gold stops being ambient lighting and becomes the
single accent — the door.

**The organizing test for every decision: does this make someone shaking on
their phone at 3am feel held, not marketed to?**

## System

- **Palette:** `light-dark()` tokens in style.css. Warm cream paper default
  (#FAF6EE), warm ink (#2A2521); dark mode is the old candlelit brand, warmed
  (#131A26 / #E9E1CF). Sanctuary bands (`--sky` #141C2B + `--sky-gold` #E0B15E)
  are FIXED — always night, in both themes — they are the app, glowing like a
  lit window. Gold has three jobs only: primary CTA, links, focus rings.
  70% paper / 20% navy or wash / 10% gold, never more.
- **Type:** Fraunces (display, 500–600), Literata (body — Google Play Books'
  reading face), Source Sans 3 (UI). Fluid Utopia scale `--step--1 … --step-5`.
  Body 65ch max, line-height 1.68, `text-wrap: pretty`; headings
  `text-wrap: balance`, negative tracking at display sizes only.
- **Layout:** named-column editorial grid (`full / wide / prose` tracks), fluid
  space tokens ending in `--space-section` (the jump IS the design — never fill
  it). Rows and hairlines, not card grids. Radius trio: 16px panels, 999px
  pills, 8px inline. No box-shadows — depth is the surface ladder.
- **Motion:** all inside `prefers-reduced-motion: no-preference`. Hero breath
  via `@starting-style`, cross-document view transitions (300ms, header
  pinned), one scroll reveal, grain on sanctuary bands only, 180ms link
  transitions. Nothing else. Banned: parallax, carousels, autoplay,
  scroll-jacking, cursor effects, big blurs.
- **Components:** quiet fixed header with month dropdowns + one gold pill;
  doorway cards (first-person sentences); book-index rows for all hubs;
  eyebrow breadcrumbs; the Einstein invitation panel (sanctuary band, once per
  page, after the content has served); footer with the standing 988 safety
  line; the floating Einstein pill (small, calm, every page).

## What we refuse

1. No funnel mechanics: popups, exit-intent, countdowns, sticky CTA bars,
   urgency copy, A/B'd labels.
2. No gating, ever — every reading fully free and complete.
3. No stock photography. Imagery = the real text, the real app, CSS light, or
   nothing.
4. No testimonial walls, star ratings, logo strips, invented quotes.
5. No pure #000/#FFF, no gray neutrals, no gold inflation.
6. No card-grid default, no box-shadows, no glassmorphism, no SaaS aurora.
7. No motion the reader didn't invite.
8. No institutional register — person-first language always.
9. No burying the crisis path: 988 in every footer, plainly, forever.
10. Nothing that breaks Firefox or an old phone — every 2026 CSS feature is
    progressive enhancement over a page already complete as plain HTML.

## Mechanics (how 1,200 pages stay coherent)

- `style.css` carries the whole system + a **legacy token bridge**: old var
  names (`--bg-card`, `--text-muted`, `--gold-glow`…) remapped to First Light
  values so generated pages' inline styles re-theme without edits, plus a
  targeted override layer that neutralizes hardcoded legacy dark backdrops
  (`.dr-bg`, `.dt-bg`) and colors.
- `scripts/fix-nav.js` stamps the ONE header, footer and floating pill on every
  page — run it last, always (`node scripts/build-all.js`).
- Generators own their page bodies; they must only use tokens, never raw hex.
