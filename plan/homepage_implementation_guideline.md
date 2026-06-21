# E-Renty Homepage Implementation Guideline

This document defines the implementation strategy for the E-Renty homepage. It bridges the visual layout provided in the Figma skeleton with the concrete design tokens from the design guidelines.

## 1. General Design System

### Colors
We will use a carefully curated palette to ensure a cohesive look:
- **Primary actions / Links**: `#00D8A4` (Glow accent: `#00FFCA`)
- **Dark Brand Elements**: `#005B45` (Text), `#143132` (Dark sections/Hero)
- **Backgrounds**: `#F7FAF7` (Page), `#FFFFFF` (Cards), `#F1F4F1` (Muted panels), `#E3F0DF` (Brand light tint)
- **Text**: `#22191B` (Body), `#667370` (Muted/Placeholder)
- **Utility**: `#DAE2DA` (Borders), `#E3E9E3` (Input borders), `#E03030` (Destructive)
- **Scrollbars**: Global custom scrollbars with solid black (`#000000`) thumbs on page-background matching tracks, configured with thin sizing for a premium, clean aesthetic.

### Typography
- **Families**: `Inter` (UI/body), `JetBrains Mono` (Numbers, prices, stats), `Cruiser` (Logo).
- **Scale**:
  - `Hero H1`: 64px, 1.05 lh, 800 weight, -0.02em tracking.
  - `H1/H2/H3`: 48px / 36px / 22px respectively, scaled weights (800 to 600).
  - `Body`: 18px (Large), 16px (Default), 14px (Small).
  - `Eyebrow/Caps`: 12px, 600 weight, 0.08em tracking, uppercase.
  - `Mono Stats`: 36-48px (Counters), 24-28px (Prices).

### Spacing & Borders
- **Spacing**: 4px (`space-1`) up to 96px (`space-24`).
  - *Standard Card padding*: 24px - 32px.
  - *Section padding*: 80px (desktop), 40-48px (mobile).
- **Border Radius**: 
  - 12px (Unified for all primary and secondary buttons, standard cards, and glass card corners for aesthetic consistency)
  - 16px (Feature cards)
  - 24px (Hero frame, Overlap cards)
  - 9999px (Small inline pills, status dots, and badges only).

### Shadows & Components
- **Shadows**: Soft, modern shadows like `0 4px 24px -8px hsl(165 50% 10% / 0.10)` for cards.
- **Buttons**:
  - *Primary*: `#00D8A4` fill, `#143132` text, unified `12px` border-radius (`radius-lg`).
  - *Secondary*: Transparent with 1.5px border, unified `12px` border-radius (`radius-lg`).
  - *Ghost*: `#00D8A4` text, no bg/border.

---

## 2. Section-by-Section Implementation

Below is the structure of the homepage matched with the specific design system tokens.

### A. Top Nav
- **Layout**: Sticky header, 72px height (64px mobile), max-width 1280px. Logo centered, nav links on the left, utilities on the right.
- **Styling**: White card background, 1px bottom border `#DAE2DA`.
- **Elements**: 
  - Logo (Centered): Text-only logo "E-RENTY" in Cruiser font, no icon mark.
  - Left Side (Nav links): `Fleets`, `Service+`, `How it works` (`Inter` 16px 500-weight, hover → `#00D8A4`).
  - Right Side (Utilities): "For Business" button (Prominently styled with brand-light tint background and brand-dark text/border for high visibility), language, help, and user profile icons.
    - **Visual Alignment Offset:** The right-side utility area includes a `margin-right: -10px` offset on desktop to counterbalance the internal padding of standard `40px` circular icon buttons. This ensures the rightmost icon aligns visually with the container margin (matching the leftmost "Fleets" link margin). On mobile, the margin offset is disabled to align the hamburger button cleanly to the viewport edge.
  - **"Fleets" Mega-Menu (Hover State)**:
    - Full-width dropdown panel anchored directly below the navbar with no gap, white background, `shadow-elevated`.
    - Left Area: Grid of 5 fleet models (VOK S, ELEGLIDE M2, Equickey Q8 - Pro, Kukirin G3 Pro, DUOTTS C29 Pro). Each item has a centered cutout image, name, and attributes.
    - Right Area: Separated by a 1px vertical border. Contains two ghost links: "See all fleets" and "Service+".
  - **Mobile Menu Drawer**:
    - Replaces nav menus on devices under `992px`. Triggers via hamburger button.
    - Fills the screen completely (`width: 100vw`, `max-width: 100vw`) overlaying a blurred backdrop (`backdrop-filter: blur(4px)`).
    - Contains stacked nav links, a "For Business" action button, and custom accordion submenus for the 5 fleets with rotating chevrons and thumbnail previews.
    - Footer displays horizontally aligned Language, Help, and Profile selectors.

### B. Hero Section
- **Layout**: Two columns with an overlapping bottom card.
- **Styling**: `#143132` background with `#005B45` gradients, rotating spoke background tire (`@keyframes rotate` over 80s), and dot grid.
- **Left Column**:
  - Eyebrow (text-only): "Fuel-free • Stress-free" in primary teal (`#00D8A4`), uppercase with spacing, no pill/card outline wrapper.
  - H1 (`hero-display`, 64px white/primary mixed): "Your Team. Your Fleet. Your E-rent Solution."
  - Subtext (18px white at 70% opacity): Uses "fleet" terminology.
  - CTA Buttons: Primary "See Fleets" and Secondary "Service+" (Unified 12px border radius).
  - Stat strip below: Mono numbers (`JetBrains`, white) with uppercase caption labels.
- **Right Column**:
  - Massive, unconstrained preview container (floating up-and-down via `@keyframes float`, no boxed card outline). Image width set to `800x600`, stretching to `135%` width (up to `820px` max-width) and shifting `-15%` leftwards on desktop to bleed organically across the center gutter (`flex-shrink: 0` to prevent flex shrinking). Scales back down to `100%` on mobile/tablets.
  - Blends seamlessly into the dark background using a radial transparency gradient mask (`mask-image: radial-gradient(circle, black 65%, transparent 100%)`).
  - Flat text status badge ("Insured · 24/7 monitored" in teal, no background/border/shadow).
  - Glass status card (`backdrop-blur(12px)`) with unified `12px` corners and constrained `320px` width (stretching to full content width on mobile) displaying long-term metrics (Contract: `12+ Mos`, Maintenance: `Included`).

### C. Start Your Journey (Overlap Card)
- **Layout**: 3-column grid/bento, pulled up by 56px into the Hero section to bridge dark and light areas.
- **Styling**: White background, 24px radius, `shadow-card` elevation.
- **Elements**: 
  - Numbered badges (`radius-full`, bordered).
  - Col 1: Model rows (hover states on `#F1F4F1` background).
  - Col 2: Illustration.
  - Col 3: Primary button "See bikes ->".

### D. Your Journey Partner
- **Layout**: Full-width product shot, text anchored in corners.
- **Elements**:
  - Top Left: H2 + Category.
  - Bottom Left: Mono Price (e.g. 24px) + "/month" caption.
  - Right: Spec list with `#00D8A4` dot bullets.
  - Bottom Center: Primary CTA pill "Rent Now ->" and Ghost link "View All".

### E. We Handle It All (Services)
- **Layout**: 3x2 Bento Grid.
- **Center Cell**: No card styling. Just "OUR PROMISE" eyebrow + H2 + subtext.
- **Service Cards (5)**: White background, 16px radius, subtle 1px border. 
- **Elements**: Icon tiles (circular, `#D5EDE8` background), H3 titles, muted 14px body text.

### F. Locations & Workshops
- **Layout**: Two columns (35% left / 65% right).
- **Left**: Workshop photo card (`radius-xl`, gradient overlay, white mono stats).
- **Right (Map)**: White card (`radius-xl`, `shadow-card`). Accent tinted map regions with `#005B45` borders. Filter pills at the top (`#F1F4F1` background).

### G. Trusted By
- **Layout**: Two columns.
- **Left**: H2 heading + Primary button.
- **Right**: Logo gallery (loose grid). Grayscale at rest (`opacity: 0.6`), full color on hover. Max height 32-40px.

### H. FAQ
- **Layout**: Centered header block + single expanding list container.
- **Container**: White, 24px radius, `shadow-card`, max-width 720px.
- **Rows**: 18px / 600-weight questions, 1px bottom border separator, chevron icon (rotates 180deg). Expanded text is muted 16px body.

### I. Footer
- **Layout**: Top content area + bottom legal bar.
- **Styling**: `#F1F4F1` background with 1px top border.
- **Elements**: 
  - Left: Logo + Tagline.
  - Middle: 3 columns of links (`eyebrow` headers, muted links).
  - Right: Email subscribe block (Standard input + Primary button).
  - Bottom: Copyright, links, and grayscale partner logo.
