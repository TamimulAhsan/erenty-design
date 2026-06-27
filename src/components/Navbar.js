"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

const fleetList = [
  { name: "VOK S", isElectric: true, image: "/images/S.png" },
  { name: "ELEGLIDE M2", isElectric: true, image: "/images/m2.png" },
  { name: "Equickey Q8 - Pro", isElectric: true, image: "/images/q8_pro.png" },
  { name: "Kukirin G3 Pro", isElectric: true, image: "/images/g3_pro.png" },
  { name: "DUOTTS C29 Pro", isElectric: true, image: "/images/c29_pro.png" },
];

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [footerNear, setFooterNear] = useState(false);

  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFleetsOpen, setIsMobileFleetsOpen] = useState(false);

  useEffect(() => {
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

    // Sync on mount in case the page was reloaded mid-scroll
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200); // 200ms grace period for moving between trigger and menu
    setHoverTimeout(timeout);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileFleets = (e) => {
    e.stopPropagation();
    setIsMobileFleetsOpen(!isMobileFleetsOpen);
  };

  return (
    <header className={`${styles.header} ${isAtTop ? styles.headerTransparent : ""}`}>
      <div className={styles.container}>
        {/* Left Side: Desktop Navigation Links */}
        <nav className={styles.nav}>
          {!hasScrolled && (
            /* Wraps both trigger and megaMenu so the mouse never leaves the hover boundary */
            <div
              className={styles.navLinkWrapper}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`${styles.navLink} ${isMegaMenuOpen ? styles.navLinkActive : ""}`}>
                Fleets
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

              {/* Mega Menu Dropdown (Nested to retain hover context) */}
              <div className={`${styles.megaMenu} ${isMegaMenuOpen ? styles.megaMenuOpen : ""}`}>
                <div className={styles.megaMenuContent}>
                  {/* Grid of 5 bike models */}
                  <div className={styles.fleetGrid}>
                    {fleetList.map((bike, idx) => (
                      <div key={idx} className={styles.fleetItem}>
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
                      </div>
                    ))}
                  </div>

                  {/* Quick Links on the right */}
                  <div className={styles.quickLinks}>
                    <Link href="/see-all-fleets" className={styles.quickLinkItem}>
                      See all fleets
                      <span className={styles.arrowIcon}>→</span>
                    </Link>
                    <Link href="/service" className={styles.quickLinkItem}>
                      Courier+
                      <span className={styles.arrowIcon}>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Link href="/service" className={styles.navLink}>
            Courier+
          </Link>
          <Link href="/how-it-works" className={styles.navLink}>
            How it works
          </Link>

          {hasScrolled && (
            <Link href="/business" className={styles.businessBtnLeft}>
              For Business
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
        <Link href="/" className={styles.logoArea}>
          E-RENTY
          <span className={`${styles.logoTagline} ${footerNear ? styles.logoTaglineVisible : ""}`}>
            Fuel-Free. Stress-Free.
          </span>
        </Link>

        {/* Right Side: Utilities */}
        <div className={styles.rightArea}>
          {!hasScrolled && (
            <Link href="/business" className={styles.businessBtn}>
              For Business
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

          {/* Language icon */}
          <button className={styles.iconButton} aria-label="Select Language">
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
          </button>

          {/* Help icon */}
          <button className={styles.iconButton} aria-label="Help Center">
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
          </button>

          {/* Profile icon */}
          <button className={styles.iconButton} aria-label="User Profile">
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
          </button>

          {hasScrolled && (
            <Link href="/see-all-fleets" className={styles.seeFleetsBtn}>
              See Fleets
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
                <span>Fleets</span>
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
                    href="/see-all-fleets"
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
                <Link href="/see-all-fleets" className={styles.mobileFleetItemAll} onClick={toggleMobileMenu}>
                  See all fleets →
                </Link>
              </div>
            </div>

            <Link href="/service" className={styles.mobileNavLink} onClick={toggleMobileMenu}>
              Courier+
            </Link>
            <Link href="/how-it-works" className={styles.mobileNavLink} onClick={toggleMobileMenu}>
              How it works
            </Link>
            <Link href="/business" className={styles.mobileBusinessLink} onClick={toggleMobileMenu}>
              For Business
            </Link>
          </div>

          <div className={styles.drawerFooter}>
            <button className={styles.footerIconButton} aria-label="Select Language">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>English</span>
            </button>

            <button className={styles.footerIconButton} aria-label="Help Center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Help</span>
            </button>

            <button className={styles.footerIconButton} aria-label="User Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
