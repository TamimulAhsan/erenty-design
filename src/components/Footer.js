"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    alert("Subscribed successfully!");
  };

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.container}>

        {/* Main Content Area */}
        <div className={styles.mainContent}>

          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              e-renty
            </Link>

            <p className={styles.tagline}>
              Complete e-bike fleet management for Hungarian companies. Sustainable, managed, and fully insured.
            </p>

            <div className={styles.slogan}>
              Fuel-Free. Stress-Free.
            </div>

            <div className={styles.partnerContainer}>
              <span className={`${styles.partnerLabel} eyebrow`}>Fleet partner</span>
              <div className={styles.logoWrapper}>
                <Image
                  src="/images/duotts_logo.png"
                  alt="DUOTTS Logo"
                  width={110}
                  height={24}
                  className={styles.duottsLogo}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className={styles.linksGrid}>
            {/* Column 1: Company */}
            <div className={styles.linkCol}>
              <span className={`${styles.columnTitle} eyebrow`}>Company</span>
              <ul className={styles.linkList}>
                <li><Link href="/about">About e-Renty</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className={styles.linkCol}>
              <span className={`${styles.columnTitle} eyebrow`}>Services</span>
              <ul className={styles.linkList}>
                <li><Link href="/fleets">Our Fleet</Link></li>
                <li><Link href="/service-plus">Service+</Link></li>
                <li><Link href="/corporate-plans">Corporate Plans</Link></li>
                <li><Link href="/repair-partners">Repair Partners</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className={styles.linkCol}>
              <span className={`${styles.columnTitle} eyebrow`}>Contact</span>
              <div className={styles.contactDetails}>
                <a href="mailto:info@e-renty.com" className={styles.contactLink}>
                  <svg className={styles.contactIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  info@e-renty.com
                </a>
                <a href="tel:+36204340771" className={styles.contactLink}>
                  <svg className={styles.contactIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +36 20 434 0771
                </a>
                <a
                  href="https://maps.google.com/?q=1012+Budapest,+Kuny+Domokos+utca+13-15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  <svg className={styles.contactIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  1012 Budapest, Kuny Domokos u. 13-15
                </a>
              </div>
            </div>
          </div>

          {/* Subscribe Form Column */}
          <div className={styles.subscribeCol}>
            <span className={`${styles.columnTitle} eyebrow`}>Stay Updated</span>
            <p className={styles.subscribeDesc}>
              Subscribe to get maintenance updates, fleet additions, and business offers.
            </p>
            <form className={styles.subscribeForm} onSubmit={handleSubscribeSubmit}>
              <input
                type="email"
                placeholder="your.email@domain.com"
                required
                className={styles.subscribeInput}
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.badgeRow}>
            <div className={styles.partnerBadge}>
              <span className={styles.badgeText}>Certified Payment Partners</span>
            </div>
          </div>
          <div className={styles.legalInfoRow}>
            <span className={styles.copyright}>
              &copy; {new Date().getFullYear()} e-Renty. All rights reserved.
            </span>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
