import { locales, defaultLocale } from "@/lib/i18n";
import { FLEET_BIKES } from "@/data/fleets";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://e-renty.com").replace(/\/$/, "");

// Public, indexable routes. Auth-gated / transactional routes (checkout, profile)
// are intentionally excluded — see robots.js.
const STATIC_PATHS = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/fleets", changeFrequency: "weekly", priority: 0.9 },
  { path: "/courier-plus", changeFrequency: "monthly", priority: 0.9 },
  { path: "/business", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/insurance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/repair-partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/login", changeFrequency: "yearly", priority: 0.4 },
  { path: "/signup/business", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
];

// Per-bike detail pages.
const FLEET_PATHS = FLEET_BIKES.map((bike) => ({
  path: `/fleets/${bike.slug}`,
  changeFrequency: "monthly",
  priority: 0.8,
}));

// Build one entry per route with hreflang alternates for every locale.
function entry({ path, changeFrequency, priority }) {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
  );
  return {
    url: `${BASE_URL}/${defaultLocale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap() {
  return [...STATIC_PATHS, ...FLEET_PATHS].map(entry);
}
