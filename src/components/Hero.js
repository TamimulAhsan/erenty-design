"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";
import CountUp from "./CountUp";
import styles from "./Hero.module.css";

export default function Hero({ dict }) {
  const pathname = usePathname();
  const currentLang = localeFromPathname(pathname) || defaultLocale;
  const localizePath = (path) => localizeHref(currentLang, path);

  const t = dict || {
    titleLine1: "Fuel Free",
    titleLine2: "",
    titleHighlight: "Stress Free",
    ctaSeeFleets: "See Fleets",
    ctaCourierPlus: "Courier+",
    statCustomers: "Customers",
    statDeployed: "Deployed",
    statAvgMo: "AVG/MO",
    statUpTime: "UP TIME",
  };

  return (
    <>
      <section className={styles.hero}>
        {/* Decorative background blobs */}
        <div className={styles.blobBottomRight} aria-hidden="true" />

        {/* Giant background text */}
        <div className={styles.bgText} aria-hidden="true">
          E-RENTY {/* Redesigned background brand text update reload final split */}
        </div>

        {/* ── Text stage: capped + centered (title + CTA) ── */}
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <h1 className={`${styles.title} hero-display`}>
              {t.titleLine1 && <span>{t.titleLine1}</span>}
              {t.titleLine2 && <span>{t.titleLine2}</span>}
              {t.titleHighlight && (
                <span className={styles.highlight} data-text={t.titleHighlight}>
                  {t.titleHighlight}
                </span>
              )}
            </h1>

            {/* CTA buttons */}
            <div className={styles.ctaRow}>
              <Link href={localizePath("/fleets")} className="btn-primary">
                {t.ctaSeeFleets}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href={localizePath("/courier-plus")}
                className="btn-secondary dark"
              >
                {t.ctaCourierPlus}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bike layer: direct child of .hero, anchored to the
             viewport's right + the hero's bottom so it scales and bleeds
             consistently on every screen ── */}
        <div className={styles.heroRight}>
          <div className={styles.imageWrap}>
            <Image
              src="/images/c29_pro.png"
              alt="DUOTTS C29 Pro Electric Bike"
              width={750}
              height={500}
              className={styles.heroImage}
              priority
              data-morph="hero"
            />
            {/* Glow ring behind the image */}
            <div className={styles.glowRing} aria-hidden="true" />
          </div>
        </div>

        {/* Bottom gradient fade into page */}
        <div className={styles.bottomFade} aria-hidden="true" />

        {/* ── Mobile-Only stats strip ── */}
        <div className={`${styles.statsStrip} ${styles.mobileOnlyStats}`}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statNum}><CountUp value="32+" /></span>
              <span className={styles.statLabel}>{t.statCustomers}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}><CountUp value="120+" /></span>
              <span className={styles.statLabel}>{t.statDeployed}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}><CountUp value="4.2k" /></span>
              <span className={styles.statLabel}>{t.statAvgMo}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}><CountUp value="99.1%" /></span>
              <span className={styles.statLabel}>{t.statUpTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Desktop-Only Bleeding stats strip ── */}
      <div className={`${styles.statsStrip} ${styles.desktopOnlyStats}`}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statNum}><CountUp value="32+" /></span>
            <span className={styles.statLabel}>{t.statCustomers}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}><CountUp value="120+" /></span>
            <span className={styles.statLabel}>{t.statDeployed}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}><CountUp value="4.2k" /></span>
            <span className={styles.statLabel}>{t.statAvgMo}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}><CountUp value="99.1%" /></span>
            <span className={styles.statLabel}>{t.statUpTime}</span>
          </div>
        </div>
      </div>
    </>
  );
}
