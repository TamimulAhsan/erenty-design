// Single source of truth for locale config and href localization.
// Used by proxy.js, dictionaries loader, Navbar, Hero, and LocalizedLink.

export const locales = ["en", "hu"];
export const defaultLocale = "en";

export function isLocale(value) {
  return typeof value === "string" && locales.includes(value.toLowerCase());
}

// Pull the locale out of a pathname like "/hu/fleets" -> "hu". Returns null if none.
export function localeFromPathname(pathname) {
  if (!pathname) return null;
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg.toLowerCase() : null;
}

// Prefix an internal href with the locale. Leaves external links,
// special protocols, already-localized paths, and bare anchors untouched.
export function localizeHref(lang, href) {
  const locale = isLocale(lang) ? lang.toLowerCase() : defaultLocale;

  if (typeof href !== "string") return href;

  // External or special-protocol links, and same-page anchors: leave alone.
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;

  // Relative links (no leading slash): leave alone.
  if (!href.startsWith("/")) return href;

  // Home-anchor like "/#how-it-works" -> "/hu#how-it-works"
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;

  // Already carries a locale prefix.
  const firstSeg = href.split("/")[1]?.split(/[?#]/)[0];
  if (isLocale(firstSeg)) return href;

  return `/${locale}${href === "/" ? "" : href}`;
}
