"use client";

import { useState, useEffect, useLayoutEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { localeFromPathname, defaultLocale, isLocale, localizeHref } from "@/lib/i18n";
import styles from "./Navbar.module.css";

// Run the initial scroll-state sync before the browser paints (avoids a
// visible snap when a page loads already scrolled, e.g. after a language toggle).
// Falls back to useEffect on the server to skip React's SSR warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const fleetList = [
  { name: "VOK S", isElectric: true, image: "/images/S.png", slug: "vok-s" },
  { name: "ELEGLIDE M2", isElectric: true, image: "/images/m2.png", slug: "eleglide-m2" },
  { name: "Equickey Q8 - Pro", isElectric: true, image: "/images/q8_pro.png", slug: "equickey-q8-pro" },
  { name: "Kukirin G3 Pro", isElectric: true, image: "/images/g3_pro.png", slug: "kukirin-g3-pro" },
  { name: "DUOTTS C29 Pro", isElectric: true, image: "/images/c29_pro.png", slug: "duotts-c29-pro" },
];

// Routes with dark hero sections where navbar sits transparent over dark backgrounds.
const DARK_HERO_ROUTES = ["/", "/courier-plus", "/privacy", "/faq", "/about", "/contact", "/cookies", "/terms", "/business"];

// Routes with hero is light, so the navbar sits transparent over a light background.
const LIGHT_HERO_ROUTES = ["/fleets", "/repair-partners"];

// Every real top-level route. Anything NOT matching one of these is, by
// definition, the not-found page (it can be reached from any bad URL, so it
// has no fixed path of its own) — its hero is dark, so it gets the same
// transparent treatment as the other DARK_HERO_ROUTES.
const KNOWN_ROUTES = [
  "/", "/about", "/contact", "/faq", "/privacy", "/terms", "/cookies",
  "/business", "/insurance", "/login", "/signup",
  "/courier-plus", "/fleets", "/repair-partners", "/checkout", "/profile",
];

export default function Navbar({ dict }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Strip the locale segment to get the app route (e.g. "/en/fleets" -> "/fleets").
  const routePath = "/" + pathname.split("/").slice(2).join("/");
  const forceSolid = false;
  const isKnownRoute = KNOWN_ROUTES.some((r) => routePath === r || routePath.startsWith(`${r}/`));
  const isDarkHeroRoute = DARK_HERO_ROUTES.includes(routePath) || !isKnownRoute;
  const isLightHeroRoute = LIGHT_HERO_ROUTES.includes(routePath);

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [footerNear, setFooterNear] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transitionsReady, setTransitionsReady] = useState(false);

  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFleetsOpen, setIsMobileFleetsOpen] = useState(false);

  // Extract language from URL path
  const currentLangLower = localeFromPathname(pathname) || defaultLocale;
  const currentLang = currentLangLower.toUpperCase();

  // Localization dictionary fallback
  const t = dict || {
    fleets: "Fleets",
    seeAllFleets: "See all fleets",
    courierPlus: "Courier+",
    howItWorks: "How it works",
    forBusiness: "For Business",
    seeFleetsBtn: "See Fleets",
    tagline: "Fuel-Free. Stress-Free.",
    selectLanguage: "Select Language",
    help: "Help",
    profile: "Profile"
  };

  const localizePath = (path) => localizeHref(currentLangLower, path);

  useIsomorphicLayoutEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsAtTop(y < 10);
      setHasScrolled(y > 550);

      const footer = document.getElementById("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setFooterNear(rect.top <= 120);
      }
    };

    // Sync the real scroll state before paint so the first painted frame is correct.
    handleScroll();
    setMounted(true);

    // Re-enable transitions/animations only after the corrected state has painted,
    // so the initial top→scrolled correction snaps instantly instead of animating.
    const raf = requestAnimationFrame(() => setTransitionsReady(true));

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleLanguage = () => {
    if (isPending) return;
    const nextLang = currentLangLower === "en" ? "hu" : "en";

    try {
      document.cookie = `NEXT_LOCALE=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.warn("Could not set NEXT_LOCALE cookie:", e);
    }

    // Swap (or insert) the locale segment, preserving query + hash and scroll position.
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = nextLang;
    } else {
      segments.splice(1, 0, nextLang);
    }
    const suffix = typeof window !== "undefined"
      ? window.location.search + window.location.hash
      : "";
    const newPath = (segments.join("/") || `/${nextLang}`) + suffix;

    startTransition(() => {
      router.replace(newPath, { scroll: false });
    });
  };

  // Safe checks to avoid hydration mismatches
  const isTransparentDark = !forceSolid && isDarkHeroRoute && (mounted ? isAtTop : true);
  const isTransparentLight = !forceSolid && isLightHeroRoute && (mounted ? isAtTop : true);
  const isNavbarScrolled = mounted ? !isAtTop : false;
  const showMegaMenu = mounted ? !hasScrolled : true;
  const showBusinessBtnLeft = mounted ? hasScrolled : false;
  const showBusinessBtn = mounted ? !hasScrolled : true;
  const showSeeFleetsBtn = mounted ? hasScrolled : false;
  const showLogoTagline = mounted ? footerNear : false;

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileFleets = (e) => {
    e.stopPropagation();
    setIsMobileFleetsOpen(!isMobileFleetsOpen);
  };

  if (routePath.startsWith("/checkout")) {
    return null;
  }

  return (
    <header className={`${styles.header} ${transitionsReady ? "" : styles.headerBooting} ${isTransparentDark ? styles.headerTransparent : ""} ${isTransparentLight ? styles.headerTransparentLight : ""} ${isNavbarScrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.container}>
        {/* Left Side: Desktop Navigation Links */}
        <nav className={styles.nav}>
          {showMegaMenu && (
            <div
              className={styles.navLinkWrapper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`${styles.navLink} ${isMegaMenuOpen ? styles.navLinkActive : ""}`}>
                {t.fleets}
                <svg
                  className={styles.chevron}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Mega Menu Dropdown */}
              <div className={`${styles.megaMenu} ${isMegaMenuOpen ? styles.megaMenuOpen : ""}`}>
                <div className={styles.megaMenuContent}>
                  <div className={styles.fleetGrid}>
                    {fleetList.map((bike, idx) => (
                      <Link key={idx} href={localizePath(`/fleets/${bike.slug}`)} className={styles.fleetItem}>
                        <div className={styles.bikeImageWrapper}>
                          <Image
                            src={bike.image}
                            alt={bike.name}
                            width={140}
                            height={90}
                            className={styles.bikeImage}
                            priority={true}
                          />
                        </div>
                        <div className={styles.bikeName}>
                          {bike.name}
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className={styles.quickLinks}>
                    <Link href={localizePath("/fleets")} className={styles.quickLinkItem}>
                      {t.seeAllFleets}
                      <span className={styles.arrowIcon}>→</span>
                    </Link>
                    <Link href={localizePath("/courier-plus")} className={styles.quickLinkItem}>
                      {t.courierPlus}
                      <span className={styles.arrowIcon}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Link href={localizePath("/courier-plus")} className={styles.navLink}>
            {t.courierPlus}
          </Link>
          <Link href={localizePath("/#how-it-works")} className={styles.navLink}>
            {t.howItWorks}
          </Link>

          {showBusinessBtnLeft && (
            <Link href={localizePath("/business")} className={styles.businessBtnLeft}>
              {t.forBusiness}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          )}
        </nav>

        {/* Middle Side: Text Logo */}
        <Link href={localizePath("/")} className={styles.logoArea}>
          E-RENTY
          <span className={`${styles.logoTagline} ${showLogoTagline ? styles.logoTaglineVisible : ""}`}>
            {t.tagline}
          </span>
        </Link>

        {/* Right Side: Utilities */}
        <div className={styles.rightArea}>
          {showBusinessBtn && (
            <Link href={localizePath("/business")} className={styles.businessBtn}>
              {t.forBusiness}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          )}

          {/* Language Toggle Button */}
          <button
            className={styles.iconButton}
            aria-label={t.selectLanguage}
            onClick={toggleLanguage}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '54px', justifyContent: 'center' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: '800' }}>{currentLang}</span>
          </button>

          {/* Help Center */}
          <Link href={localizePath("/faq")} className={styles.iconButton} aria-label={t.help}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </Link>

          {/* Profile */}
          <Link href={localizePath("/login")} className={styles.iconButton} aria-label={t.profile}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {showSeeFleetsBtn && (
            <Link href={localizePath("/fleets")} className={styles.seeFleetsBtn}>
              {t.seeFleetsBtn}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.seeFleetsArrow}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle Menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Drawer Panel */}
      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.mobileDrawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerLogo}>E-RENTY</span>
          <button className={styles.closeBtn} onClick={toggleMobileMenu} aria-label="Close Menu">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerContent}>
          <div className={styles.mobileNavLinks}>
            {/* Accordion item for Fleets */}
            <div className={styles.mobileAccordion}>
              <button
                className={`${styles.mobileNavLink} ${isMobileFleetsOpen ? styles.mobileAccordionActive : ""}`}
                onClick={toggleMobileFleets}
              >
                <span>{t.fleets}</span>
                <svg
                  className={`${styles.drawerChevron} ${isMobileFleetsOpen ? styles.rotateChevron : ""}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div className={`${styles.mobileAccordionContent} ${isMobileFleetsOpen ? styles.mobileAccordionContentOpen : ""}`}>
                {fleetList.map((bike, idx) => (
                  <Link
                    key={idx}
                    href={localizePath(`/fleets/${bike.slug}`)}
                    className={styles.mobileFleetItem}
                    onClick={toggleMobileMenu}
                  >
                    <div className={styles.mobileFleetThumb}>
                      <Image
                        src={bike.image}
                        alt={bike.name}
                        width={48}
                        height={32}
                        className={styles.mobileFleetImg}
                      />
                    </div>
                    <span className={styles.mobileFleetName}>
                      {bike.isElectric && "⚡ "}
                      {bike.name}
                    </span>
                  </Link>
                ))}
                <Link href={localizePath("/fleets")} className={styles.mobileFleetItemAll} onClick={toggleMobileMenu}>
                  {t.seeAllFleets} →
                </Link>
              </div>
            </div>

            <Link href={localizePath("/courier-plus")} className={styles.mobileNavLink} onClick={toggleMobileMenu}>
              {t.courierPlus}
            </Link>
            <Link href={localizePath("/#how-it-works")} className={styles.mobileNavLink} onClick={toggleMobileMenu}>
              {t.howItWorks}
            </Link>
            <Link href={localizePath("/business")} className={styles.mobileBusinessLink} onClick={toggleMobileMenu}>
              {t.forBusiness}
            </Link>
          </div>

          <div className={styles.drawerFooter}>
            <button
              className={styles.footerIconButton}
              aria-label={t.selectLanguage}
              onClick={toggleLanguage}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{currentLang === "EN" ? "English" : "Hungarian (HU)"}</span>
            </button>

            <Link href={localizePath("/faq")} className={styles.footerIconButton} aria-label={t.help} onClick={toggleMobileMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{t.help}</span>
            </Link>

            <Link href={localizePath("/login")} className={styles.footerIconButton} aria-label={t.profile} onClick={toggleMobileMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{t.profile}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
