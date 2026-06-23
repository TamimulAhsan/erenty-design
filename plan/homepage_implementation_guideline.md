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
    - **Scroll Behavior**: While scrolling past the hero section, the `Fleets` mega-menu link is removed from the left side, and a "For Business" action button slides in smoothly after "How it works".
  - Right Side (Utilities): "For Business" button (Prominently styled with brand-light tint background and brand-dark text/border for high visibility), language, help, and user profile icons.
    - **Scroll Behavior**: While scrolling past the hero section, the standard "For Business" button is removed, and a prominent primary-colored "See Fleets" CTA button appears on the far right.
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

### C. Start Your Journey
- **Layout**: 3-column grid featuring separate, spacious cards. Positioned in normal page flow with visual separation padding (100px top/bottom on desktop, and 70px top / 50px bottom on mobile) to guarantee a consistent visual separation from surrounding content. On mobile (under `992px`), it switches to a horizontal snap scroll slider with card widths set to `85%` and bottom indicator bars tracking current card visibility with active animations and click-to-scroll triggers.
- **Styling**: Cards use a muted gray background (`#F1F4F1`), `24px` border-radius (`radius-2xl`), and a 1px border. Section title sits fully on the light background in dark brand green (`#005B45`).
- **Cards details**:
  - **Card 01: Pick your fleet**
    - Step counter "01".
    - Description: "Browse vetted DUOTTS, Neuzer, MyEsel and Mamba models. Filter by range, motor power, intended use. Add bikes to a quote in one click."
    - Scrollable List: A vertically scrollable list containing all 7 fleets (VOK S, ELEGLIDE M2, Equickey Q8 - Pro, Kukirin G3 Pro, DUOTTS C29 Pro, Urban E-Cruise, DUOTTS F26 Lite). Scrollbar is completely hidden. Hovering over a fleet item triggers the dynamic preview in Card 02.
    - Footer Metrics: Grid of "4 brands curated" and "12 models in stock".
  - **Card 02: Configure cover**
    - Step counter "02".
    - Description: "Choose a Courier+ plan per bike — maintenance, GPS, theft insurance bundled. Switch plans monthly, no penalty."
    - Footer Metrics: Grid of "3 plans from 4,900 Ft" and "VAT reclaimable".
    - Fleet Preview Visual: Houses a 1.5x sized active bike preview image (`object-fit: contain` inside a `200px` container, `170px` on mobile) that transitions smoothly on hover. All cluttered text overlays have been removed.
  - **Card 03: Sign & ride**
    - Step counter "03".
    - Description: "Digital contract, optional KYC for business accounts, courier delivers within 48h to anywhere in Hungary."
    - Footer Metrics: Grid of "Delivery 48h nationwide" and "Contract e-sign".
    - CTA Button: A full-width primary teal pill button (`#00D8A4`) at the bottom labeled "See fleets".

### D. Your Journey Partner
- **Behavior**: A scroll-locked showcase. The section container is `400vh` tall. As the user scrolls vertically, the active product updates synchronously (via `activeIndex` and direct DOM tracking) causing in-place staggered crossfade animations.
- **Animations (Staggered Crossfade)**: 
  - Instead of horizontally sliding, products crossfade in-place with a premium staggered sequence:
    1. **Product Image**: Slides up from the bottom (`0.1s` delay).
    2. **Name & Price**: Slide in from the left (`0.3s` delay).
    3. **Specifications**: Slide in from the right (`0.5s` delay).
    4. **CTA Buttons**: Slide up from the bottom (`0.7s` delay).
- **Layout (Desktop)**: 
  - Central 1.5x scaled bike image (`max-width: 960px`).
  - Text anchored in corners within a `1280px` max-width container:
    - Top Left: H2 + Category.
    - Bottom Left (Raised to `30%` from bottom): Mono Price + "/month" caption (`var(--brand-dark)`).
    - Top Right (Lowered to `25%` from top): Spec list with `#00D8A4` dot bullets.
  - Bottom Center: Center Column flex layout separating the image and the CTAs (Primary "Rent [Model] ->" and Ghost "View All") with a generous `6vh` margin to prevent collisions.
  - Sticky vertical navigation dots sit on the right edge.
- **Layout (Mobile)**: 
  - Mathematical `vh`-proportioned vertical stack: Name -> Image (`35dvh` max-height to naturally fill space) -> Price -> Specs -> CTA.
  - Box models (backgrounds/shadows) are removed from specs and price for a clean "zigzag" flow.
  - Layout perfectly balanced using `margin-bottom: auto` on the Name and Price wrappers to act as dynamic, proportional vertical buffers.
  - Navbar integration: The sticky container explicitly calculates a `top: 72px` and `height: calc(100vh - 72px)` offset to ensure no UI is ever clipped by the global sticky header.

### E. We Handle It All (Services)
- **Concept**: A minimalist typographic grid ("Rest Zone" feature matrix) with no card boxes, borders, shadows, or background blocks at rest, creating an airy layout.
- **Layout (Desktop)**: 3-column, 2-row grid. Generous spacing using `column-gap: var(--space-16)` (64px) and `row-gap: var(--space-12)` (48px).
- **Layout (Tablet)**: 2-column typographic grid.
- **Layout (Mobile)**: Clean 1-column stack. Each cell aligns the stroke icon and header title horizontally on the same line, with the subtext description indented underneath to align perfectly with the start of the title text.
- **Header**: Left-aligned, featuring a bold H2 ("We Handle It All") and muted subtitle description.
- **Service Items (6)**: Raw, minimalist cells containing:
  - Simple stroke SVG icons colored in brand primary (`#00D8A4`).
  - Bold, benefit-driven titles (e.g., "Always in top shape", "Zero downtime guarantee", "Worry-free protection", etc.).
  - Muted body descriptions (15px) incorporating all 8 operational items from the website.
- **Micro-Interactions**: Subtle transition translating the icon upward (`translateY(-2px)`) on hover.

### F. Locations & Workshops
- **Layout**: "Map as Hero" full-width section centered around a massive, dynamic SVG map of Hungary.
- **Map Aesthetics**: 
  - **3D Depth**: Uses an isometric depth effect by rendering an extruded dark layer beneath the main white map body.
  - **Entrance Animations**: Triggered via `IntersectionObserver`. The map outline organically draws itself over 2.5s, followed by staggered "teardrop" pins dropping into their exact coordinates.
  - **Idle State**: Pins subtly "breathe" (float) and pulse to prevent a static image feel.
  - **Mobile Scaling**: SVG marker coordinates natively scale down, but the pins themselves are enlarged by `1.5x` via a custom `dropPinMobile` animation to ensure tap targets remain huge.
- **Interaction (The Drawer)**: 
  - Clicking a pin opens a premium "Upwork-style" side-over drawer (`520px` wide, sliding from the right).
  - **Mobile Bottom Sheet**: On mobile (`<768px`), the drawer gracefully transforms into a `90vh` Bottom Sheet sliding up from the bottom (`border-radius: 24px 24px 0 0`).
- **Drawer Content**: 
  - **Coverage Block**: Clean typographic layout mapping "Rentals" and "Service+" to their respective free tiers, avoiding cluttered background-colored pills.
  - **Details Grid**: "Business Hours" automatically parsed into a highly legible Monday-Sunday table, sitting beside or above "Contact" details (styled cleanly at 13px with a "View on Map ↗" link).
  - **Booking**: Inline appointment booking form leading to a "Confirm Appointment" primary CTA.
- **Section Footer**: Minimal 20% height footer featuring a dual CTA stack ("Service+ ↗" in primary green, and "Book a service" in a crisp, dark outline variant).
### G. Trusted By
- **Concept**: A premium business trust section featuring a dynamic, rotating dual-ring logo orbital carousel.
- **Aesthetic**: Muted off-white/green background (`var(--background, #F7FAF7)`) aligned with the unified body background so white bubble logo containers pop.
- **Layout (Desktop)**: Two columns within a `1280px` max-width container.
  - **Left (Text Content)**: A bold H2 ("Trusted by leading companies") and a horizontal stack of action buttons (Primary green "For Business" with a hover slide-up effect, and a Secondary outlined "Rent now" button).
  - **Right (Visual Content)**: A large absolute-positioned container (`1100px`) hosting:
    - **Background Bike Illustration**: A scaled-up (`1.2x`) bike image rotated at `-15deg` with low opacity (`0.12`) and masked out smoothly via a radial transparency gradient to sit behind the logos.
    - **Dual-Ring Logo Orbit Carousel**: A circular container (`800px`) spinning continuously (`60s` linear animation) featuring dashed outer (`400px` radius) and inner (`180px` radius) tracks.
    - **Revolving Logos (20 total)**: 12 outer logos and 8 inner logos staggered circularly using custom CSS properties (`--angle` and `--radius`). Each logo is wrapped in a counter-rotating element (`-60s` linear animation) that keeps the logo images upright and legible.
- **Layout (Mobile - under 992px)**: Stacked vertical layout:
  - Text content centers at the top with adjusted typography size (36px heading).
  - The visual content anchors directly to the bottom edge of the section. The rotating wheel is scaled down to `600px` width/height and shifted using margins (`-300px` top/left) to cut the bottom half of the circle off-screen.
  - The background bike illustration is repositioned (`margin-top: -420px`), scaled up (`1.4x`), and rotated to `-25deg` to maximize visual impact on small screens.
  - Logo bubbles scale down from `120px` to `80px` diameter.
- **Next.js Image Optimizations**:
  - The main bike uses `fill` with `sizes="(max-width: 992px) 700px, 1100px"`.
  - All company logos use `fill` with `sizes="(max-width: 992px) 80px, 120px"` to prevent layout shifts and ensure Next.js serves optimized resolutions.

### H. FAQ
- **Layout**: Centered header block + single expanding list container + bottom centered link.
- **Container**: White, 24px radius, `shadow-card`, max-width 720px.
- **Rows**: 18px / 600-weight questions, 1px bottom border separator, chevron icon (rotates 180deg). Expanded text is muted 16px body.
- **View All Link**: A centered link below the list ("View all FAQs" with an arrow icon) that transitions to primary green on hover and shifts the arrow rightwards.

### I. Footer
- **Layout**: Top content area + bottom legal bar.
- **Styling**: White background (`var(--card, #FFFFFF)`) matching the navbar background, with a 1px top border.
- **Height**: On desktop, the footer utilizes `min-height: calc(100vh - 72px)` to span the entire screen height below the global sticky navbar. On mobile/tablets, height transitions to `auto` with custom vertical spacing.
- **Elements**: 
  - Left (Brand): Text logo `e-renty` (Cruiser font), "Fuel-Free. Stress-Free." slogan text, and a "Fleet partner" section displaying the DUOTTS logo (grayscaled at rest, color on hover).
  - Middle (Links): 2 columns of links (Company, Services) and 1 column of interactive contact details (mailto email, tel phone, maps address).
  - Right (Subscribe): Newsletter subscribe box ("Stay Updated") with email input and primary confirm button.
  - Bottom (Legal): Two-row structure with the top row centering the certified Stripe partner badge, and the bottom row splitting copyright (left) and legal links (right).
