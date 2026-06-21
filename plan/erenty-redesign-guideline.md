# E-Renty Redesign Guideline

Your figma file is a layout reference only — the grays, the yellow button, the blue map are all placeholder marks from sketching alignment, not decisions to preserve. This doc gives you the real system to pour into that structure: one general design system, then a full implementation spec for every section in the order they appear on the page.

---

# Part 1 — General Design System

## 1. Color

Pulled from `colors.md`, organized by where it actually gets used:

| Use case | Token | Hex |
|---|---|---|
| Primary actions, links, active states | `primary` | `#00D8A4` |
| Gradient end / glow accents | `primary-glow` | `#00FFCA` |
| Headings on light surfaces, secondary-button text | `brand-dark` | `#005B45` |
| Dark sections (hero) | `brand-darker` | `#143132` |
| Soft tinted backgrounds (badges, highlight strips) | `brand-light` | `#E3F0DF` |
| Page background | `background` | `#F7FAF7` |
| Body text | `foreground` | `#22191B` |
| Card surfaces | `card` | `#FFFFFF` |
| Secondary button fill | `secondary` | `#EBF3E8` |
| Muted backgrounds (icon tiles, subtle panels) | `muted` | `#F1F4F1` |
| Muted/placeholder text | `muted-foreground` | `#667370` |
| Icon-tile backgrounds, accent panels | `accent` | `#D5EDE8` |
| Borders, dividers | `border` | `#DAE2DA` |
| Input borders | `input` | `#E3E9E3` |
| Errors, destructive actions | `destructive` | `#E03030` |
| Map region fill | `accent` | `#D5EDE8` (+ `brand-dark` 1px borders) |
| Map cluster bubble | existing tokens | bg `#06EFB7`, border `#039E78`, text `#0A4A3A` |

*Note: `colors.md` lists `gradient-dark` as `160deg, #143132 → #005B14`. That end hex doesn't match any other token in your palette — likely meant to be `brand-dark #005B45`. Worth a quick check against your source file before you build the hero.*

## 2. Typography

**Families:** **Inter** for all UI/body text, **JetBrains Mono** for numbers that should feel precise — prices, stats, counters — **Cruiser** reserved for the logo mark only.

`colors.md` defines families and weights but no scale, so here's one built on the same step logic as your radius tokens:

| Token | Size | Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `hero-display` | 64px / mobile 40px | 1.05 | 800 | -0.02em | Hero H1 only |
| `h1` | 48px | 1.1 | 800 | -0.02em | Page-level headings |
| `h2` | 36px | 1.15 | 700 | -0.01em | Section headings |
| `h3` | 22px | 1.3 | 600 | normal | Card titles |
| `h4` | 18px | 1.4 | 600 | normal | Sub-card titles |
| `body-lg` | 18px | 1.6 | 400 | normal | Lead paragraphs, hero subtext |
| `body` | 16px | 1.6 | 400 | normal | Default body copy |
| `body-sm` | 14px | 1.5 | 400 | normal | Card descriptions, secondary copy |
| `caption` | 13px | 1.4 | 500 | 0.02em | Meta labels, stat labels |
| `eyebrow` | 12px | 1.2 | 600 | 0.08em, uppercase | Badges, kickers |
| `stat-number` | 36–48px | 1.1 | 700 (mono) | normal | Big counters |
| `price` | 24–28px | 1.2 | 600 (mono) | normal | Price displays |

## 3. Spacing Scale

Not defined in `colors.md` — extended on the same base your existing tokens imply:

| Token | Value | Typical use |
|---|---|---|
| `space-1` | 4px | icon-to-label micro gaps |
| `space-2` | 8px | tight inline gaps |
| `space-3` | 12px | icon-to-text in buttons/badges |
| `space-4` | 16px | default element gap |
| `space-5` | 20px | small card padding |
| `space-6` | 24px | standard card padding, grid gaps |
| `space-8` | 32px | large card padding |
| `space-10` | 40px | gap between major card sections |
| `space-12` | 48px | small section vertical padding (mobile) |
| `space-16` | 64px | hero bottom padding, mobile section padding |
| `space-20` | 80px | section vertical padding (desktop) |
| `space-24` | 96px | hero top padding |

**Rule of thumb:** card padding = `space-6`–`space-8`. Grid gaps = `space-4`–`space-6`. Section-to-section rhythm = `space-20`–`space-24` desktop, half that on mobile.

## 4. Border Radius

| Token | Value | Status | Use |
|---|---|---|---|
| `radius-sm` | 8px | existing | small chips, input fields |
| `radius-md` | 10px | existing | secondary buttons, small cards |
| `radius-lg` | 12px | existing | outline buttons, standard cards |
| `radius-xl` | 16px | new | glass cards, feature cards |
| `radius-2xl` | 24px | new | hero image frame, hero-overlap card |
| `radius-full` | 9999px | new | pills, badges, primary buttons, icon tiles |

## 5. Shadows & Elevation

| Token | Value | Status |
|---|---|---|
| `shadow-card` | `0 4px 24px -8px hsl(165 50% 10% / 0.10)` | existing |
| `shadow-glow` | `0 0 48px -8px hsl(165 100% 42% / 0.35)` | existing |
| `card-glow` (hover) | `0 0 0 1.5px #00D8A4/35%, 0 12px 36px -8px hsl(165 50% 25%/18%)` | existing |
| `teal-glow` (hover) | `0 0 0 1.5px #00D8A4/40%, 0 16px 40px -8px hsl(165 50% 20%/20%)` | existing |
| `btn-primary` (hover) | `0 8px 24px -6px #00D8A4/40%` | existing |
| `shadow-elevated` | `0 16px 48px -12px hsl(165 50% 10% / 0.18)` | new — dropdowns, modals, map filter popovers |

## 6. Components

**Buttons — three tiers, used consistently everywhere:**

| Tier | Look | Use for |
|---|---|---|
| **Primary** | filled `gradient-primary`, text `brand-darker`, `radius-full`, padding `14px 28px`, `btn-primary` shadow on hover | Main conversion actions (See Bikes, Rent Now, Subscribe) |
| **Secondary** | 1.5px border (`border` on light / `rgba(255,255,255,0.2)` on dark), transparent bg, `radius-lg`, same padding | Supporting actions next to a primary (Request Quote) |
| **Ghost** | text + arrow, color `primary`, no bg/border, weight 600 | Low-emphasis links (Browse Fleet, View All, Learn more) |

**Cards**
- Standard: bg `card`, `radius-xl`, `shadow-card`, padding `space-6`–`space-8`, hover → `card-glow`
- Glass (dark surfaces): bg `rgba(20,49,50,0.65)`, `backdrop-blur(12px)`, `radius-xl`, 1px `rgba(255,255,255,0.08)` border

**Badges/Pills:** bg `accent` or `primary` 12% tint, text `brand-dark`, `radius-full`, padding `6px 14px`, `eyebrow`/`caption` type

**Icon tiles:** circular, `40–48px`, bg `accent`, icon stroke `brand-dark` at 1.5–2px

**Numbered badges:** `36px` circle, 1.5px `primary` border, bold `primary` number, transparent fill — reserve for genuine sequences only (your 3-step flow qualifies)

**Inputs:** bg `card`, 1px `input` border, `radius-sm`, padding `10px 14px`, focus → 1.5px `primary` border + faint glow ring

---

# Part 2 — Section-by-Section Implementation

## A. Top Nav

```
[Logo  E-RENTY]   Fleets  Service+  How it works        [For Business ↗] [🌐] [?] [👤]
```

| Element | Spec |
|---|---|
| Bar | white `card` bg, sticky, 1px `border` bottom hairline, height `72px` (mobile `64px`) |
| Container | max-width `1280px`, inline padding `32px` (mobile `20px`) |
| Logo | icon mark (small `radius-md` square or circle, `primary` bg) + "E-RENTY" wordmark in Inter 700, ~`18px`, tight tracking |
| Nav links | `body` / 500 weight, `foreground`, gap `space-8`, hover → `primary`. "Service+" gets a small chevron if it opens a dropdown |
| Utility icons | language/help/profile at `36–40px` tap targets, `muted-foreground`, circular `muted` bg on hover |
| "For Business" | **Secondary** tier button, smaller padding (`8px 16px`), with external-link icon |

## B. Hero

The one section that needs an actual concept, not just a token pass — here's the full direction.

**Composition:** keep your current two-column idea (headline+CTA left, photo+live-data card right, stat strip below) — it's a strong, specific moment, just needs to sit on the token system below it. The one new move: let the "Start your journey" card overlap *up* into the hero by `56px`, so the dark canvas and the light body below are stitched together by one deliberate transition instead of a hard seam.

```
┌──────────────────────────────────────────────────────────────────────┐
│  ● FUEL-FREE · STRESS-FREE                          (eyebrow pill)    │
│                                                                        │
│  Your Team.                                  ┌──────────────────────┐│
│  Your Fleet.                                 │                      ││
│  Your E-rent Solution.  ← primary color      │   hero photo/visual  ││
│                                               │                      ││
│  Subtext, 1–2 lines, muted on dark            │     ⬤ Insured ·     ││
│                                               │       24/7 monitored ││
│  [ See Bikes →  pill ]  [ Request Quote ]    │                      ││
│                                               │ ┌──────────────────┐ ││
│  ──────────────────────────────────          │ │ ● Active·8.4km/h │ ││
│  32+      120+      4.2k      99.1%          │ │ BATTERY   RANGE  │ ││
│  customers deployed avg/mo   uptime           │ │ 84%       71km   │ ││
│                                               │ │ ▓▓▓▓░░░░░         │ ││
│                                               │ │ ⬤ Budapest VII   │ ││
│                                               │ └──────────────────┘ ││
│                                               └──────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
                     ╲___ rounded-2xl white card, pulled up 56px __╱
              ┌────────────────────────────────────────────────────┐
              │  ① Start your journey                               │
              └────────────────────────────────────────────────────┘
```

**Mobile:** stack eyebrow → H1 → subtext → both CTAs full-width → hero visual (capped ~320px height, glass card stays anchored bottom-left) → stat strip as 2×2 grid → overlap card becomes a normal top margin (no overlap — it reads as a bug at small sizes).

| Element | Spec |
|---|---|
| Background | `gradient-dark` + dot-grid texture (`rgba(255,255,255,0.055)`, ~24px grid) + your existing spoke/wheel linework graphic — keep it, it's genuinely distinctive; consider reusing a faded version of it elsewhere (footer, section dividers) for cohesion |
| Container | max-width `1280px`, inline padding `32px` (mobile `20px`) |
| Vertical padding | `96–120px` top, `64px` bottom before the overlap card |
| Eyebrow pill | bg `rgba(0,216,164,0.12)`, text `primary`, 1px border `rgba(0,216,164,0.3)`, `radius-full`, padding `6px 14px`, `eyebrow` token, 6px dot before text |
| H1 | `hero-display`, white for lines 1–2, `primary` for the emphasized line, max-width `560px` |
| Subtext | `body-lg`, `rgba(255,255,255,0.7)`, max-width `480px`, margin-top `16px` |
| Primary CTA | **Primary** tier button |
| Secondary CTA | **Secondary** tier button, white text/border on this dark surface |
| Divider above stats | 1px `rgba(255,255,255,0.1)`, margin-top `48px`, padding-top `32px` |
| Stat numbers | `stat-number` token, white |
| Stat labels | `caption`, `rgba(255,255,255,0.5)`, uppercase |
| Hero image frame | `radius-2xl`, 1px border `rgba(255,255,255,0.08)`, soft `shadow-glow` behind it |
| "Insured" badge | solid `brand-light` or `primary` pill, text `brand-dark`, `radius-full`, padding `6px 12px` |
| Glass status card | bg glass-dark token, `backdrop-blur(12px)`, `radius-xl`, 1px `rgba(255,255,255,0.08)` border, padding `18px`. Internal: status row → divider → 2-col mini-stats → 4px `radius-full` progress bar (`gradient-primary` fill on `rgba(255,255,255,0.1)` track) → location row |
| Overlap card | white, `radius-2xl`, `shadow-card`, margin-top `-56px` |

## C. Start Your Journey

```
┌─────────────────────────────────────────────────────────┐
│  Start your journey                                       │
│  ┌──────────────┬──────────────┬──────────────┐          │
│  │ ① Choose      │ ② Get your   │ ③ Enjoy the   │         │
│  │   your bike   │    bike      │    ride       │         │
│  │   desc...     │   desc...    │   desc...     │         │
│  │   [model row] │  [bike img]  │  [See bikes →]│         │
│  │   [model row] │              │   (Primary)   │         │
│  └──────────────┴──────────────┴──────────────┘          │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Outer card | white, `radius-2xl`, `shadow-card`, padding `space-8` |
| Header | `h2`, margin-bottom `space-6` |
| Grid | 3 columns, gap `space-6`; stack vertically on mobile with `space-6` between, 1px `border` divider between stacked items |
| Step badge | numbered-badge spec, margin-bottom `space-3` |
| Column title | `h3` |
| Column description | `body-sm`, `muted-foreground`, margin-top `space-2`, margin-bottom `space-4` |
| Col 1 model rows | each row: padding `10px 12px`, `radius-md`, `muted` bg on hover, `body-sm`, small icon left (`24px`), chevron right `muted-foreground` |
| Col 2 illustration | `radius-lg`, fills column width, ~4:3 |
| Col 3 CTA | **Primary** pill, "See bikes →" — this is your cleanest existing reference for what every primary button should look like sitewide |

## D. Your Journey Partner

A full-width product-shot layout with text anchored in two corners, rather than a side-by-side split:

```
   Fleet Name                              • Specification
   Category                                • Specification
                                            • Specification
                  [ large bike photo ]      • Specification
   PRICE
   /month

              [ Rent Now →  Primary pill ]
                      View All (Ghost)
```

| Element | Spec |
|---|---|
| Eyebrow | "YOUR JOURNEY PARTNER", `eyebrow` token, centered, margin-bottom `space-8` |
| Bike photo | centered, max-width ~`640–720px`, clean cutout (no card chrome) |
| Fleet Name | `h2`, top-left, `foreground` |
| Category | `body`, `muted-foreground`, directly below |
| Price | `price` token (mono), `primary` or `foreground` bold, with `/month` in `caption` `muted-foreground` beside it, lower-left |
| Specs list | top-right, `body-sm`, `space-2` gap, bullets as `6px` `primary` dots |
| Rent Now | **Primary** tier pill, centered below the image (this is the section's core conversion action, so it should carry the same weight as "See bikes" above) |
| View All | **Ghost**, centered, margin-top `space-3` |

## E. We Handle It All

A bento grid — 5 service cards surrounding a centered heading block in the middle-top cell:

```
┌──────────────┬──────────────────┬──────────────┐
│ Full          │   OUR PROMISE     │ Mobility      │
│ Maintenance   │ We Handle It All  │ First         │
│ & Electrical  │   (centered text, │               │
│               │    no card chrome)│               │
├──────────────┼──────────────────┼──────────────┤
│ Security &    │ 24/7 Digital      │ Comprehensive │
│ GPS Tracking  │ Support           │ Protection    │
└──────────────┴──────────────────┴──────────────┘
```

| Element | Spec |
|---|---|
| Grid | 3 columns × 2 rows, gap `space-6` |
| Center cell (row 1) | no card chrome — just `eyebrow` "OUR PROMISE" + `h2` "We Handle It All" + `body` subtext, centered both axes |
| Service cards (×5) | white bg, `radius-xl`, 1px `border` (subtle — these don't need full `shadow-card` weight), padding `space-6` |
| Icon tile | icon-tile spec, margin-bottom `space-4` |
| Card title | `h3` |
| Card description | `body-sm`, `muted-foreground`, margin-top `space-2` |
| Optional link | **Ghost** "Learn more →", margin-top `space-4`, only where there's a deeper page to send people to |

## F. Locations & Workshops

Two cards side by side, roughly 35/65 split:

| Element | Spec |
|---|---|
| Photo tile (left) | workshop photo bg, `radius-xl`, bottom gradient overlay (`brand-darker` 0%→70%) for text legibility, padding `space-6`. Stat "100+" in `stat-number` white, label in `body-sm` white/80%, **Ghost** "View All →" in white variant |
| Map card (right) | white bg, `radius-xl`, `shadow-card`, padding `space-4`–`space-6` |
| Filter pills | top row, `muted` bg, `radius-full`, padding `8px 14px`, `body-sm` + chevron, gap `space-2` |
| Map region fill | `accent` tint with 1px `brand-dark` borders — and use actual Hungary boundary data here, since that's the real coverage area |
| Location clusters | your existing dedicated tokens: bg `#06EFB7`, border `#039E78`, text `#0A4A3A` |

## G. Trusted By

| Element | Spec |
|---|---|
| Left block | `h2` two-line heading, **Primary** pill "View Fleets →" margin-top `space-6` |
| Logo gallery (right) | grayscale at rest (`filter: grayscale(1) opacity(0.6)`), full color on hover, consistent max-height `32–40px` per logo. The loose, slightly overlapping arrangement with the mascot illustration layered in is fine to keep as-is — it reads as a deliberate "trust gallery" rather than a strict grid, gap roughly `space-8` |

## H. FAQ

| Element | Spec |
|---|---|
| Header | `h2` centered, `body` `muted-foreground` subtext below, margin-bottom `space-8` |
| Card | white, `radius-2xl`, `shadow-card`, max-width `~720px` centered, padding `0` (rows carry their own) |
| Row | padding `space-5` vertical / `space-6` horizontal, flex `justify-between`, 1px `border` bottom (omit on last row) |
| Question | `body-lg` / 600 |
| Chevron | `muted-foreground`, rotates `180deg` on expand, `200ms` transition |
| Answer (expanded) | `body`, `muted-foreground`, padding-top `space-2`, padding-bottom `space-4` |
| Footer link | **Ghost** "View All FAQs →", centered, margin-top `space-6` |

## I. Footer

| Element | Spec |
|---|---|
| Background | `muted` bg, 1px `border` top hairline |
| Top row | logo + 2-line tagline (`body-sm` `muted-foreground`, max-width `280px`) on the left; 3 link columns (Explore / Erenty / Contact) with `eyebrow`-style column headers and `body-sm` `muted-foreground` links (hover → `primary`); email subscribe block on the right using the standard input spec + **Primary** "Subscribe" button |
| Column gap | `space-10`–`space-12` |
| Bottom bar | 1px `border` top, padding-block `space-4`, flex `justify-between` — copyright left (`caption`, `muted-foreground`), legal links + dev credit right (`caption`), partner logo (DUOTTS) grayscale at `~20px` height |
