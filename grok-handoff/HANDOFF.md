# Open Cosmos — Grok handoff (locked by Derick, 2026-08-01)

Direction: **Option 2 · Open Cosmos** (Direction A "Midnight Sanctuary" world,
full-site cosmic background). Direction C ("Quiet Library" glass reader) is
HELD for a separate traffic funnel later.

Division: Grok = visual soul (this package + inner-page mockups + drift-checks
in the Grok chat "Recovery Starts Website 3D Redesign"); Claude = production
build through the token system/generators; Derick = final call.

Files here are the reference implementation transcribed verbatim from Grok's
chat handoff (indentation flattened by transcription — semantics identical).
The PIXEL-TRUTH originals live in Grok's sandbox tarball
`recoverystarts-open-cosmos-handoff.tar.gz` (~1.2MB) — Derick downloads it
from the sandbox `/handoff/` page. Grok's md5s for drift-checking:
option-2.html `96e411a5…` · cosmos.css `80f66154b1a7280c6c1cebc25c59304d` ·
cosmos.js `492e2952…`.

## Art assets (in the tarball, not yet here)
| file | role | prod target |
|---|---|---|
| cosmos-bg.jpg (~315KB) | full-site world | WebP ≤180–200KB, ~1600w |
| cosmos-alt.jpg | optional pure nebula | not in locked mock |
| einstein-guide.jpg | hero | WebP ≤60KB |
| einstein-think.jpg | companion strip | WebP ≤40KB |
| einstein-welcome.jpg / einstein-cosmic.jpg | pose pack | optional |

Ring glow around Einstein = CSS only (.figure-glow/.figure-ring) — never baked
into the art. Prod paths: /assets/world/cosmos-bg.webp,
/assets/einstein/guide.webp, /assets/einstein/think.webp.

## Token values (night-native — both light-dark() legs go dark, toggle retires)
```css
--paper:#12081F; --paper-2:#0E111C; --paper-3:#1A1528; --void:#04060D;
--ink:#F2F4FF; --ink-soft:#D0D7EE; --ink-dim:#9AA5C0;
--accent:#2DD4BF; --accent-hover:#5EEAD4; --accent-deep:#14B8A6; --accent-fg:#042F2E;
--sky:#141C2B; --sky-2:#0E121C; --sky-ink:#EEF2FF; --sky-gold:#E0B15E;
--safe:#34D399; --alert:#F87171; --crisis:#7DD3FC; /* 988 only — never teal */
--rule:rgba(242,244,255,0.10); --rule-strong:rgba(242,244,255,0.16);
--glass:rgba(8,12,24,0.55); --glass-border:rgba(255,255,255,0.16);
--glass-highlight:rgba(255,255,255,0.08);
--glass-blur:20px; --glass-blur-door:18px; --glass-blur-btn:14px;
--lamp:rgba(224,177,94,0.14); --starfield:rgba(220,235,255,0.55);
--nebula-violet:rgba(139,100,220,0.28); --nebula-teal:rgba(45,212,191,0.16);
--font-display:"Fraunces",Georgia,serif;       /* 400–600, opsz 9..144 */
--font-body:"Outfit",system-ui,sans-serif;     /* LOCKED in approved mock */
--font-ui:"Outfit",system-ui,sans-serif;
--radius:20px; --radius-sm:12px; --radius-pill:999px;
--ease:cubic-bezier(0.22,1,0.36,1);
```
Glass fallback when backdrop-filter unsupported: solid rgba(12,16,28,0.92).

## Inner-page adaptation (Grok's table — the build law)
| page | world | surface | particles | Einstein |
|---|---|---|---|---|
| homepage + hubs (doors/library/meetings/pricing/companion) | full cosmos + shade | glass cards | on (≤90) | hero/invite |
| daily reading | cosmos at 0.22 opacity OR solid --paper + edge stars | opaque column rgba(14,17,28,0.94), ~42rem, 16px radius | off | small/absent |
| month index | dim ~0.3 | hairline rows on --paper-2, no card grid | off | no |
| meetings | hub theater ok | glass/solid rows + pill filters | light | optional |
| pricing | full theater | 3 honest cards, never "free chat" | light | optional |
| Big Book reader/search | ≤0.18 or solid #0E111C + grain | reader chrome solid; tilt only on empty/search tease | off | small rail, never over text |

Reading body ≥16px, lh 1.65–1.75, contrast ≥4.5:1. 988 always in chrome
(#7DD3FC). Grain ~0.12 on dark OLED surfaces.

## Performance budget (degradation order if over)
Homepage ≤1.5MB first load, imagery ≤400KB. If over: (1) drop second
Einstein, (2) compress cosmos harder, (3) kill particles — NEVER the cosmos
art on the homepage. Particles: canvas, min(90, w*h/16000), off under
reduced-motion.

## Voice locks
Headline "However last night went, this is a new day." · primary "Read the
Big Book free" · secondary "Talk to Recovery Einstein" · Free=reader only,
Seeker $2.99, Pro $7.99 · no free-chat bait · person-first · URLs unchanged.
