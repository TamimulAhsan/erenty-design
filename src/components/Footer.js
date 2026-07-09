"use client";

import { useState } from "react";
import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import enDict from "@/dictionaries/en.json";
import styles from "./Footer.module.css";

// Focused pages (auth flows) hide the marketing footer.
const HIDE_FOOTER_ROUTES = ["/login", "/signup"];

// Social channels. aria-label carries the platform name for screen readers.
const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

const PARTNER_LOGOS = [
  { src: "/fleetpartnerlogos/vok.png", alt: "Vok Bikes" },
  { src: "/fleetpartnerlogos/specialized.png", alt: "Specialized" },
  { src: "/fleetpartnerlogos/znen.png", alt: "ZNEN" },
  { src: "/fleetpartnerlogos/niu.png", alt: "Niu Technologies" },
  { src: "/fleetpartnerlogos/koliken.png", alt: "Koliken" },
  { src: "/fleetpartnerlogos/merida.png", alt: "Merida" },
  { src: "/fleetpartnerlogos/ridley.png", alt: "Ridley" },
  { src: "/fleetpartnerlogos/xiaomi.png", alt: "Xiaomi" },
  { src: "/fleetpartnerlogos/neuzer.png", alt: "Neuzer" },
  { src: "/fleetpartnerlogos/esel.png", alt: "ESEL" },
  { src: "/fleetpartnerlogos/scott.png", alt: "Scott" },
  { src: "/fleetpartnerlogos/duotts.png", alt: "duotts" },
  { src: "/fleetpartnerlogos/csepel.png", alt: "Csepel" },
  { src: "/fleetpartnerlogos/eleglide.png", alt: "Eleglide" },
  { src: "/fleetpartnerlogos/kukirin.png", alt: "Kukirin" },
  { src: "/fleetpartnerlogos/mamba.png", alt: "Mamba" },
  { src: "/fleetpartnerlogos/segway.png", alt: "Segway" }
];

export default function Footer({ dict }) {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);

  // Footer renders on many pages; until each is migrated it falls back to English.
  const t = dict || enDict.footer;

  const routePath = "/" + (pathname || "").split("/").slice(2).join("/");
  if (HIDE_FOOTER_ROUTES.some((r) => routePath === r || routePath.startsWith(`${r}/`))) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Wiring deferred — show inline confirmation (matches the contact form pattern).
    setSubscribed(true);
  };

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.inner}>

        {/* Left Column — Brand Field */}
        <div className={styles.leftCol}>

          {/* Zone 1 — Brand Identity */}
          <div className={styles.brandZone}>
            <Link href="/" className={styles.logo}>
              E-RENTY
              <span className={styles.tagline}>{t.tagline}</span>
            </Link>
          </div>

          {/* Zone 2 — Subscribe */}
          <div className={styles.subscribeZone}>
            <span className={styles.subscribeLabel}>{t.stayUpdated}</span>
            {subscribed ? (
              <div className={styles.subscribeSuccess} role="status" aria-live="polite">
                <span className={styles.subscribeSuccessIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {t.subscribeSuccess}
              </div>
            ) : (
              <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  className={styles.subscribeInput}
                />
                <button type="submit" className={styles.subscribeBtn}>{t.subscribe}</button>
              </form>
            )}
            <p className={styles.legalNote}>
              {t.legalNote}
            </p>
          </div>

        </div>

        {/* Right Column — Navigation Field */}
        <div className={styles.rightCol}>

          {/* Nav Grid */}
          <div className={styles.navGrid}>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>{t.companyHeader}</span>
              <ul className={styles.navList}>
                <li><Link href="/about">{t.aboutUs}</Link></li>
                <li><Link href="/#how-it-works">{t.howItWorks}</Link></li>
                <li><Link href="/business">{t.forBusiness}</Link></li>
              </ul>
            </div>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>{t.servicesHeader}</span>
              <ul className={styles.navList}>
                <li><Link href="/fleets">{t.fleetSubs}</Link></li>
                <li><Link href="/courier-plus">{t.courierPlus}</Link></li>
                <li><Link href="/insurance">{t.insurance}</Link></li>
                <li><Link href="/repair-partners">{t.maintenance}</Link></li>
                <li><Link href="/insurance">{t.damageProtection}</Link></li>
              </ul>
            </div>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>{t.contactHeader}</span>
              <ul className={styles.navList}>
                <li><Link href="/contact">{t.contactUs}</Link></li>
                <li><a href="mailto:info@e-renty.com">info@e-renty.com</a></li>
                <li><a href="tel:+36204340771">+36 20 434 0771</a></li>
                <li><span className={styles.contactText}>{t.location}</span></li>
                <li>
                  <a
                    href="https://maps.google.com/?q=1012+Budapest,+Kuny+Domokos+utca+13-15"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.viewOnMaps}
                  </a>
                </li>
              </ul>
              <div className={styles.socialRow} aria-label={t.followUs || "Follow us"}>
                {SOCIAL_LINKS.map((s) => {
                  const isBlank = s.href === "#" || !s.href;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target={isBlank ? undefined : "_blank"}
                      rel={isBlank ? undefined : "noopener noreferrer"}
                      className={styles.socialLink}
                      aria-label={s.name}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {s.icon}
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Partners Section */}
      <div className={styles.partnersSection}>
        <div className={styles.partnersBg} />
        <div className={styles.partnersContent}>
          <span className={styles.partnersLabel}>{t.ourFleetPartners}</span>
          <div className={styles.tickerContainer}>
            <div className={styles.tickerTrack}>
              {PARTNER_LOGOS.map((logo, index) => (
                <div key={`logo-1-${index}`} className={styles.logoItem}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={144}
                    height={48}
                    className={styles.partnerLogoImg}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
              {PARTNER_LOGOS.map((logo, index) => (
                <div key={`logo-2-${index}`} className={styles.logoItem}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={144}
                    height={48}
                    className={styles.partnerLogoImg}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.badgeRow}>
          <span className={styles.paymentLabel}>{t.acceptedPayments}</span>
          <div className={styles.paymentIcons}>
            <div className={styles.paymentChip}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>{t.card}</span>
            </div>
            <div className={styles.paymentChip}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>{t.googlePay}</span>
            </div>
            <div className={styles.paymentChip}>
              <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
              </svg>
              <span>{t.applePay}</span>
            </div>
            <div className={styles.paymentChip}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="21" x2="21" y2="21" />
                <line x1="3" y1="14" x2="21" y2="14" />
                <path d="M3 14v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M5 21v-7" />
                <path d="M19 21v-7" />
                <path d="M10 21v-7" />
                <path d="M14 21v-7" />
                <path d="M2 7l10-5 10 5" />
              </svg>
              <span>{t.bankTransfer}</span>
            </div>
          </div>
        </div>
        <div className={styles.legalRow}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} E-Renty. {t.rights}
          </span>
          <div className={styles.legalLinks}>
            <Link href="/privacy">{t.privacy}</Link>
            <Link href="/terms">{t.terms}</Link>
            <Link href="/cookies">{t.cookies}</Link>
          </div>
        </div>
      </div>

      {/* Single Unified Ghost Bike in background */}
      <div className={styles.ghostBike} aria-hidden="true">
        <div className={styles.ghostBikeGlow} />
        <Image
          src="/images/c29_pro.png"
          alt=""
          width={640}
          height={480}
          className={styles.ghostBikeImg}
        />
      </div>

    </footer>
  );
}
