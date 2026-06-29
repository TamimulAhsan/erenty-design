"use client";

import Link from "next/link";
import Image from "next/image";
import { CreditCard, Smartphone, Landmark, Wallet } from "lucide-react";
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

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed successfully!");
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
              <span className={styles.tagline}>Fuel-Free. Stress-Free.</span>
            </Link>
          </div>

          {/* Zone 2 — Subscribe */}
          <div className={styles.subscribeZone}>
            <span className={styles.subscribeLabel}>Stay Updated</span>
            <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                required
                className={styles.subscribeInput}
              />
              <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
            </form>
            <p className={styles.legalNote}>
              By submitting, you agree to our Privacy Policy.
            </p>
          </div>

        </div>

        {/* Right Column — Navigation Field */}
        <div className={styles.rightCol}>

          {/* Nav Grid */}
          <div className={styles.navGrid}>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>Company</span>
              <ul className={styles.navList}>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/#how-it-works">How It Works</Link></li>
                <li><Link href="/business">For Business</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>Services</span>
              <ul className={styles.navList}>
                <li><Link href="/fleets">Fleet Subscriptions</Link></li>
                <li><Link href="/courier-plus">Courier+</Link></li>
                <li><Link href="/insurance">Insurance &amp; Coverage</Link></li>
                <li><Link href="/repair-partners">Maintenance</Link></li>
                <li><Link href="/insurance">Damage Protection</Link></li>
              </ul>
            </div>
            <div className={styles.navCol}>
              <span className={styles.navHeader}>Contact</span>
              <ul className={styles.navList}>
                <li><a href="mailto:hello@e-renty.hu">hello@e-renty.hu</a></li>
                <li><a href="tel:+3612345678">+36 1 234 5678</a></li>
                <li><span className={styles.contactText}>Budapest, Hungary</span></li>
                <li>
                  <a
                    href="https://maps.google.com/?q=Budapest,Hungary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Maps ↗
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
          <span className={styles.partnersLabel}>OUR FLEET PARTNERS</span>
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
          <span className={styles.paymentLabel}>Accepted Payments</span>
          <div className={styles.paymentIcons}>
            <div className={styles.paymentChip}>
              <CreditCard size={15} strokeWidth={1.8} />
              <span>Card</span>
            </div>
            <div className={styles.paymentChip}>
              <Smartphone size={15} strokeWidth={1.8} />
              <span>Google Pay</span>
            </div>
            <div className={styles.paymentChip}>
              <Wallet size={15} strokeWidth={1.8} />
              <span>Apple Pay</span>
            </div>
            <div className={styles.paymentChip}>
              <Landmark size={15} strokeWidth={1.8} />
              <span>Bank Transfer</span>
            </div>
          </div>
        </div>
        <div className={styles.legalRow}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} E-Renty. All rights reserved.
          </span>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
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
