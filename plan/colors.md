# E-Renty Color System

## Brand Palette (HSL → HEX)

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `primary` / `brand` | hsl(165 100% 42%) | **#00D8A4** | Main teal — CTAs, highlights, rings |
| `primary-glow` | hsl(165 100% 52%) | **#00FFCA** | Glows, gradients light end |
| `brand-dark` | hsl(165 100% 18%) | **#005B45** | Dark teal — headings, active states |
| `brand-darker` | hsl(182 43% 14%) | **#143132** | Darkest — hero bg, dark sections |
| `brand-light` | hsl(106 36% 91%) | **#E3F0DF** | Mint tint — subtle backgrounds |

## Semantic Tokens

| Token | HSL | HEX | Usage |
|-------|-----|-----|-------|
| `background` | hsl(120 25% 98%) | **#F7FAF7** | Page background |
| `foreground` | hsl(348 7% 13%) | **#22191B** | Body text |
| `card` | hsl(0 0% 100%) | **#FFFFFF** | Card backgrounds |
| `secondary` | hsl(106 28% 94%) | **#EBF3E8** | Secondary buttons bg |
| `secondary-foreground` | hsl(165 100% 18%) | **#005B45** | Secondary button text |
| `muted` | hsl(120 15% 95%) | **#F1F4F1** | Muted backgrounds |
| `muted-foreground` | hsl(172 7% 43%) | **#667370** | Muted text, placeholders |
| `accent` | hsl(165 40% 90%) | **#D5EDE8** | Accent backgrounds |
| `accent-foreground` | hsl(165 100% 18%) | **#005B45** | Accent text |
| `border` | hsl(120 15% 88%) | **#DAE2DA** | Borders, dividers |
| `input` | hsl(120 15% 91%) | **#E3E9E3** | Input borders |
| `destructive` | hsl(0 75% 55%) | **#E03030** | Errors, delete actions |

## Gradients

| Name | Value | Usage |
|------|-------|-------|
| `gradient-primary` | `135deg, #00D8A4 → #00FFCA` | Primary CTAs, badges |
| `gradient-dark` | `160deg, #143132 → #005B14` | Hero sections, dark cards |
| `badge-shimmer` | `90deg, #00C28A → #00FFCA → #00C28A` | Animated highlight badge |
| `pricing-glow-border` | `135deg, #00D8A4 → #005B45 → #00FFCA → #005B45` | Pricing card border animation |

## Shadows & Glows

| Name | Value |
|------|-------|
| `shadow-card` | `0 4px 24px -8px hsl(165 50% 10% / 0.10)` |
| `shadow-glow` | `0 0 48px -8px hsl(165 100% 42% / 0.35)` |
| `card-glow hover` | `0 0 0 1.5px #00D8A4/35%, 0 12px 36px -8px hsl(165 50% 25%/18%)` |
| `teal-glow-hover` | `0 0 0 1.5px #00D8A4/40%, 0 16px 40px -8px hsl(165 50% 20%/20%)` |
| `btn-primary hover` | `0 8px 24px -6px #00D8A4/40%` |

## Map Cluster Colors

| Element | HEX |
|---------|-----|
| Cluster bubble bg | **#06EFB7** |
| Cluster bubble border | **#039E78** |
| Cluster text | **#0A4A3A** |

## Raw Hex Values Used in Code (non-token)

| HEX | Context |
|-----|---------|
| `#06EFB7` | Map cluster bubble background |
| `#039E78` | Map cluster bubble border |
| `#0A4A3A` | Map cluster text |
| `#E5E7EB` | Map tooltip border (Tailwind gray-200) |
| `#111827` | Map tooltip text (Tailwind gray-900) |
| `rgba(255,255,255,0.75)` | Glass card background |
| `rgba(20,49,50,0.65)` | Glass dark card background |
| `rgba(255,255,255,0.055)` | Dot grid texture dot color |

## Typography

| Role | Font | Weights |
|------|------|---------|
| Body / UI | **Inter** (variable, 100–900) | 400 regular, 500 medium, 600 semibold |
| Monospace / prices | **JetBrains Mono** (variable, 100–900) | 400, 500 |
| Brand logo mark | **Cruiser** | Regular only |

## Border Radius

| Token | Value |
|-------|-------|
| `rounded-lg` | 0.75rem (12px) |
| `rounded-md` | 0.625rem (10px) |
| `rounded-sm` | 0.5rem (8px) |
