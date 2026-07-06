# E-Renty

Marketing and self-service front-end for **E-Renty** — a Budapest-based electric-bike
and e-scooter **fleet subscription** and **courier** platform. Bilingual (English /
Hungarian), built on Next.js 16 with the App Router.

**Live:** https://erenty.tamimul.dev

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **CSS Modules** with a design-token system in `globals.css` (no CSS framework)
- **i18n** via middleware locale routing (`en` / `hu`) — see below
- Local self-hosted fonts (`next/font/local`), `lucide-react` for a few icons
- No external UI/data libraries; forms are currently client-side (see *Status*)

## Features

- **Bilingual EN/HU** — locale prefix in the URL (`/en/...`, `/hu/...`), auto-detected
  and persisted; instant in-place language toggle
- **Fleet catalog** with per-vehicle detail pages and a multi-step rental flow
- **Courier+** subscription plans, **Business** offering, **Repair Partners** with a
  booking widget, **FAQ**, **Contact**, **Login/Signup** (UI)
- **GDPR cookie consent** (granular, opt-in by default)
- **SEO**: per-page metadata + canonicals/hreflang, generated `sitemap.xml` & `robots.txt`

## Getting started

**Prerequisites:** Node.js **20+** and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to the default locale (`/en`).

### Build & run production

```bash
npm run build
npm run start        # serves on PORT (default 3000)
```

> ⚠️ **This is a customized Next.js build** — APIs and conventions may differ from the
> public docs. The relevant guides ship inside `node_modules/next/dist/docs/`; read those
> (and heed `AGENTS.md`) before changing framework-level code.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute site origin used for `metadataBase`, canonical URLs, `sitemap.xml`, and `robots.txt`. **Read at build time** — set it before `npm run build`, or these fall back to `https://e-renty.com`. |

Local/prod example (`.env.production.local`):

```
NEXT_PUBLIC_SITE_URL=https://erenty.tamimul.dev
```

## Project structure

```
src/
├─ app/
│  ├─ [lang]/              # all localized routes (home, fleets, business, faq, …)
│  │  ├─ layout.js         # Navbar + Footer + CookieConsent, fonts, metadata
│  │  ├─ page.js           # homepage (composes the section components)
│  │  ├─ dictionaries.js   # server-only dictionary loader
│  │  └─ globals.css       # design tokens + base styles
│  ├─ sitemap.js           # generated sitemap (localized hreflang alternates)
│  └─ robots.js            # generated robots.txt
├─ components/             # shared UI (Navbar, Footer, Hero, BookingForm, …)
├─ data/                   # fleet catalog, workshops (source of truth)
├─ dictionaries/           # en.json / hu.json translation dictionaries
├─ lib/i18n.js             # locale config + href localization helpers
└─ proxy.js                # middleware: locale detection, redirect, cookie
```

## Internationalization

- Locale config lives in `src/lib/i18n.js`; `src/proxy.js` (middleware) detects the
  locale (cookie → `Accept-Language` → default) and prefixes the path.
- UI strings come from `src/dictionaries/en.json` and `hu.json` — **keep both files at
  key parity**. Server components receive the resolved dictionary via `getDictionary`.
- Use the `LocalizedLink` component (or `localizeHref`) for internal links so they carry
  the active locale.

## Deployment

Runs as a Node server (`next start`) behind a reverse proxy, managed with PM2 in
production. The production host serves it via an existing nginx reverse proxy with a
Let's Encrypt certificate. The full server runbook (proxy config, TLS, rollback) is kept
outside the repo in `plan/deployment-erenty.md`.

Redeploy: `git pull && npm run build && pm2 reload erenty`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Status / limitations

This is a **front-end**. Forms (login/signup, contact, newsletter, service booking,
courier checkout) are wired to simulated success states — **backend/auth/payment
integration is pending**. Deferred items are tracked in `plan/tech_debt_flagged.md`.
