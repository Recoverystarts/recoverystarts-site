# Recovery Starts — Open Cosmos handoff (locked Option 2)

**Status:** Derick-approved homepage direction. Claude ports into generators/tokens.  
**World:** night-native full-site cosmos. Theme toggle retires (both light-dark legs dark).  
**Reference files in this folder:** `option-2.html`, `cosmos.css`, `cosmos.js`, `assets/*`

---

## 1. Art assets (rename on ingest)

| File | Role | Notes for prod |
|---|---|---|
| `assets/cosmos-bg.jpg` | **Primary full-site world bg** (nebula + island lights + beams) | Ship as WebP ≤200KB; one file only on homepage/hubs |
| `assets/cosmos-alt.jpg` | Alternate pure-nebula (optional secondary) | Not used in locked mockup; keep as fallback if needed |
| `assets/einstein-guide.jpg` | Hero Einstein (book glow) | Cut to transparent PNG/WebP for prod |
| `assets/einstein-think.jpg` | Companion strip portrait | Same — transparent |
| `assets/einstein-welcome.jpg` | Extra pose (welcome) | Pose pack |
| `assets/einstein-cosmic.jpg` | Extra pose (cosmic book) | Pose pack |

**Ring glow is CSS only** (`.figure-glow` + `.figure-ring`) — do not bake into asset.  
**Island lights / beams are inside `cosmos-bg.jpg`** — not separate layers.

Suggested prod names:
```
/assets/world/cosmos-bg.webp
/assets/einstein/guide.webp
/assets/einstein/think.webp
/assets/einstein/welcome.webp
/assets/einstein/cosmic.webp
```

---

## 2. Token mapping (night-native — no light twin)

```css
:root {
  /* Grounds — both light-dark legs dark; toggle retired */
  --paper: #12081f;          /* page void / body (was cream) */
  --paper-2: #0e111c;        /* wash / secondary band */
  --paper-3: #1a1528;        /* elevated panel / book window top */
  /* optional deeper void used under world img */
  --void: #04060d;

  /* Ink */
  --ink: #f2f4ff;
  --ink-soft: #d0d7ee;
  --ink-dim: #9aa5c0;

  /* Accent — ONE primary (CTA, links, focus, chips) */
  --accent: #2dd4bf;
  --accent-hover: #5eead4;   /* mock uses #5eead4 in gradients */
  --accent-deep: #14b8a6;
  --accent-fg: #042f2e;      /* text on teal CTA */

  /* Fixed night surfaces (already dark; keep names) */
  --sky: #141c2b;
  --sky-2: #0e121c;
  --sky-ink: #eef2ff;
  --sky-gold: #e0b15e;       /* book light / tradition chip / page tags */
  /* alias used in mock */
  --gold: var(--sky-gold);

  /* Semantic */
  --safe: #34d399;           /* reassurance green if needed */
  --alert: #f87171;
  --crisis: #7dd3fc;         /* 988 links — sky blue, not teal */

  /* Hairlines — ink at alpha, no gray */
  --rule: rgba(242, 244, 255, 0.10);
  --rule-strong: rgba(242, 244, 255, 0.16);

  /* NEW surfaces */
  --glass: rgba(8, 12, 24, 0.55);
  --glass-border: rgba(255, 255, 255, 0.16);
  --glass-highlight: rgba(255, 255, 255, 0.08);
  --glass-blur: 20px;        /* panels; doors 18px; buttons 14px */
  --glass-blur-btn: 14px;
  --lamp: rgba(224, 177, 94, 0.14); /* warm book lamp wash */
  --starfield: rgba(220, 235, 255, 0.55); /* particle color base */
  --nebula-violet: rgba(139, 100, 220, 0.28);
  --nebula-teal: rgba(45, 212, 191, 0.16);

  /* Type — Google Fonts only */
  --font-display: "Fraunces", Georgia, serif;     /* opsz 9..144, wght 400–600 */
  --font-body: "Outfit", system-ui, sans-serif;   /* 300–700 — approved in mock */
  --font-ui: "Outfit", system-ui, sans-serif;
  /* If Outfit must map to existing stack: use Outfit as display-adjacent body;
     Source Sans 3 is acceptable ONLY if Derick re-approves — locked mock is Outfit. */

  /* Radius (match mock + your system) */
  --radius: 20px;            /* panels / doors (mock) */
  --radius-sm: 12px;         /* inline / crisis / icons */
  --radius-pill: 999px;      /* CTAs, chips, nav-talk */

  /* Motion */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

**World shade (homepage/hubs only)** — exact values from locked mock:
```css
/* left readability wash + bottom footer fade */
background:
  linear-gradient(100deg, rgba(10, 4, 24, 0.45) 0%, rgba(10, 4, 24, 0.12) 42%, transparent 70%),
  linear-gradient(180deg, rgba(10, 4, 24, 0.15) 0%, transparent 25%, transparent 60%, rgba(10, 4, 24, 0.7) 100%);
```

**Z-layers**
```
0  .world-fixed (img.bg → .shade → canvas particles)
1  .page / content
100 sticky chrome (if any mock-bar; real site header can be sticky at 50+)
```

**Particles (canvas)**
- Count: `min(90, floor((w*h)/16000))`
- Color: `rgba(220, 235, 255, alpha)` with alpha `0.2–0.75` twinkling
- Radius: `0.4–2.1px`
- Velocity: vy `-(0.05–0.33)`, vx `±0.08`
- DPR cap: 2
- `prefers-reduced-motion: reduce` → hide canvas, no animation

**Keyframes**
- `pulse` 2.4s ease-out infinite (eyebrow dot)
- `breathe` 5s ease-in-out infinite (Einstein glow)
- `spin-slow` 40s linear infinite (ring)

**Glass recipe**
- bg `--glass`
- border 1px `--glass-border`
- blur `20px` + `saturate(1.25)` progressive enhancement
- inset highlight `0 0 0 1px --glass-highlight`
- outer shadow `0 24px 64px rgba(0,0,0,0.42)`
- Fallback no-blur: solid `rgba(12, 16, 28, 0.92)` so it still looks intentional

**Primary CTA (.btn-glow)**
```css
background: linear-gradient(135deg, #5eead4 0%, #2dd4bf 40%, #14b8a6 100%);
color: #042f2e;
box-shadow:
  0 0 0 1px rgba(255,255,255,0.18) inset,
  0 8px 32px rgba(45,212,191,0.45),
  0 0 48px rgba(45,212,191,0.2);
```

**Hero h1 em gradient**
```css
background: linear-gradient(120deg, #ffffff 0%, #d4c4ff 40%, #5eead4 100%);
-webkit-background-clip: text; background-clip: text; color: transparent;
```

**Book window tilt**
```css
transform: perspective(800px) rotateY(-6deg) rotateX(3deg);
background: linear-gradient(165deg, #1a1528 0%, #0e121c 100%);
color body: #e8dfd0;
```

**Brand mark**
```css
linear-gradient(135deg, #2dd4bf 0%, #5b8def 50%, #8b6cf0 100%);
box-shadow: 0 0 24px rgba(45,212,191,0.45), inset 0 1px 0 rgba(255,255,255,0.35);
```

---

## 3. Inner-page adaptation (recipe)

**Default rule (Claude's thumb, confirmed):**  
- **Full theater** = homepage + hubs (doors landing, library hub, meetings hub, pricing, companion invite)  
- **Quiet reading** = content density pages (daily reading, month index, Big Book reader/search)

### Shared chrome all pages
- Same header, footer, 988, accent tokens, fonts
- Fixed world layer always present (or static bg class) so identity holds
- Grain on dark surfaces (CSS noise or 1px tile, opacity ~0.12)

### (a) Daily reading page
- World: **dim hard** — cosmos-bg at `opacity: 0.22` OR replace with solid `--paper` + soft CSS starfield at edges only (no moving canvas)
- Main column: opaque reading surface  
  `background: rgba(14, 17, 28, 0.94); border: 1px solid var(--rule); border-radius: 16px; max-width: ~42rem`
- Type: body ≥16px, long-form line-height 1.65–1.75, `--ink` on that surface
- No glass soup over paragraphs
- Einstein: small quiet pose bottom or absent
- Particles: off

### (b) Month index
- World: dim to ~0.3 opacity
- Rows: hairline rows on near-opaque panel (`--paper-2`), not card grid spam
- Hover: left teal hairline + slight bg wash `rgba(45,212,191,0.06)`
- Stars only at page edges / header

### (c) Meetings
- Hub theater OK (doors-level energy)
- List: glass or solid rows; filters as pills (`--radius-pill`)
- Map/list toggle if exists stays chrome-simple
- Keep crisis 988 sticky or in footer

### (d) Pricing / app
- Full theater background OK
- Three honest tiers: Free / Seeker $2.99 / Pro $7.99
- Free never implies chat
- Featured tier: 1px accent border + subtle teal glow, not loud

### (e) Big Book reader/search (funnel-critical)
- **Text owns the screen**
- World: opacity ≤0.18 or solid `#0e111c` with 2–3% grain
- Reader chrome: book-window language without heavy 3D tilt on long sessions (optional micro-tilt on empty/search state only)
- Search bar: solid field, high contrast, large tap target
- Page text: Fraunces or high-readability serif at comfortable size; page tag in `--sky-gold`
- Side/rail Einstein: optional small think pose; never covers text
- CTA to app: quiet sticky or end-of-rail “Talk it through” — secondary to free reading

---

## 4. Performance budget

| Layer | Mock size | Prod target | Degrade |
|---|---|---|---|
| cosmos-bg | ~315KB JPG | WebP **≤180–200KB**, 1600w srcset | CSS gradient nebula only |
| Einstein guide | ~223KB JPG | transparent WebP **≤60KB** | omit figure on mobile if needed |
| Einstein think | ~73KB | WebP **≤40KB** | CSS placeholder circle |
| Particles | 0 bytes asset | canvas, ≤90 dots | static CSS stars; off if reduced-motion |
| Total imagery homepage | — | **≤400KB** | drop alt cosmos; one Einstein |
| First load phone | — | **≤1.5MB** | no blur on Android fallback |

**Blur:** design with blur; implement as progressive enhancement (`@supports (backdrop-filter: blur(1px))`). Fallback solid panel.

**Do not ship** cosmos-bg.png (~1MB) — discard.

---

## 5. Voice / funnel non-negotiables (for port)

- Headline: “However last night went, this is a new day.”
- Primary CTA: Read the Big Book free  
- Secondary: Talk to Recovery Einstein  
- 988 always visible, sky-blue link `#7dd3fc`
- No free chat promise; Free = reader only
- Person-first, honest; no dark patterns
- URLs unchanged

---

## 6. File map for Derick → Claude

```
handoff/
  HANDOFF.md          ← this document
  option-2.html       ← locked structure + world layers
  cosmos.css          ← full chrome
  cosmos.js           ← particles
  assets/
    cosmos-bg.jpg     ← PRIMARY world
    cosmos-alt.jpg    ← optional
    einstein-guide.jpg
    einstein-think.jpg
    einstein-welcome.jpg
    einstein-cosmic.jpg
```

Strip `.mock-bar` in production (picker chrome only).
