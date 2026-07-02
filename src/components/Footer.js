"use client";

import Link from "@/components/LocalizedLink";
import Image from "next/image";
import { CreditCard, Smartphone, Landmark, Wallet } from "lucide-react";
import enDict from "@/dictionaries/en.json";
import styles from "./Footer.module.css";

const PARTNER_LOGOS = [
  { src: "/fleetpartnerlogos/logo_vok-bikes.png", alt: "Vok Bikes" },
  { src: "/fleetpartnerlogos/specialized-logo-png_seeklogo-130169.png", alt: "Specialized" },
  { src: "/fleetpartnerlogos/znen_logo.jfif", alt: "ZNEN" },
  { src: "/fleetpartnerlogos/Niu_Technologies_Logo.png", alt: "Niu Technologies" },
  { src: "/fleetpartnerlogos/Koliken-nyeri-logo.png", alt: "Koliken" },
  { src: "/fleetpartnerlogos/Merida_(Unternehmen)_logo.svg", alt: "Merida" },
  { src: "/fleetpartnerlogos/Ridley_Bikes_Logo_.png", alt: "Ridley" },
  { src: "/fleetpartnerlogos/Xiaomi-logo.jpg", alt: "Xiaomi" },
  { src: "/fleetpartnerlogos/neuzer-logo350.png", alt: "Neuzer" },
  { src: "/fleetpartnerlogos/tech2b_Logo_ESEL_2017.jpg", alt: "ESEL" },
  { src: "/fleetpartnerlogos/479-4797688_bike-logo-png-for-kids-scott-bike-logo-png.png", alt: "Scott" },
  { src: "/fleetpartnerlogos/duotts_logo.png", alt: "duotts" },
  { src: "/fleetpartnerlogos/images.png", alt: "Fleet Partner" },
  { src: "/fleetpartnerlogos/images (1).png", alt: "Fleet Partner" },
  { src: "/fleetpartnerlogos/layout_hu_header_logo-300x80_1_default.png", alt: "Fleet Partner" },
  { src: "/fleetpartnerlogos/logo.png", alt: "Fleet Partner" },
  { src: "/fleetpartnerlogos/unnamed.png", alt: "Fleet Partner" }
];

export default function Footer({ dict }) {
  // Footer renders on many pages; until each is migrated it falls back to English.
  const t = dict || enDict.footer;

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(t.subscribeSuccess);
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
            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                required
                className={styles.subscribeInput}
              />
              <button type="submit" className={styles.subscribeBtn}>{t.subscribe}</button>
            </form>
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
                <li><Link href="/blog">{t.blog}</Link></li>
                <li><Link href="/careers">{t.careers}</Link></li>
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
                <li><a href="mailto:hello@e-renty.hu">hello@e-renty.hu</a></li>
                <li><a href="tel:+3612345678">+36 1 234 5678</a></li>
                <li><span className={styles.contactText}>{t.location}</span></li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Budapest,Hungary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.viewOnMaps}
                  </a>
                </li>
              </ul>
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
                    width={120}
                    height={40}
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
                    width={120}
                    height={40}
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
              <CreditCard size={15} strokeWidth={1.8} />
              <span>{t.card}</span>
            </div>
            <div className={styles.paymentChip}>
              <Smartphone size={15} strokeWidth={1.8} />
              <span>{t.googlePay}</span>
            </div>
            <div className={styles.paymentChip}>
              <Wallet size={15} strokeWidth={1.8} />
              <span>{t.applePay}</span>
            </div>
            <div className={styles.paymentChip}>
              <Landmark size={15} strokeWidth={1.8} />
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
