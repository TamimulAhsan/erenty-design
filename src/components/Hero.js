"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";
import styles from "./Hero.module.css";

export default function Hero({ dict }) {
  const pathname = usePathname();
  const currentLang = localeFromPathname(pathname) || defaultLocale;
  const localizePath = (path) => localizeHref(currentLang, path);

  const t = dict || {
    titleLine1: "Your Team.",
    titleLine2: "Your Fleet.",
    titleHighlight: "Your E-Rent Solution.",
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
      <div className={styles.blobTopLeft} aria-hidden="true" />
      <div className={styles.blobBottomRight} aria-hidden="true" />

      {/* Main grid wrapper */}
      <div className={styles.heroInner}>
        {/* ── Left: Text + Stats + CTA ── */}
        <div className={styles.heroLeft}>
          <h1 className={`${styles.title} hero-display`}>
            <span>{t.titleLine1}</span>
            <span>{t.titleLine2}</span>
            <span className={styles.highlight} data-text={t.titleHighlight}>
              {t.titleHighlight}
            </span>
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

        {/* ── Right: Fleet emerging from mobile ── */}
        <div className={styles.heroRight}>
          <div className={styles.imageWrap}>
            <Image
              src="/images/hero_fleet_mobile.png"
              alt="E-bike fleet emerging from a smartphone — rent your fleet today"
              width={680}
              height={680}
              className={styles.heroImage}
              priority
            />
            {/* Glow ring behind the image */}
            <div className={styles.glowRing} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade into page */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>

    {/* ── Bleeding stats strip (Courier+ style) ── */}
    <div className={styles.statsStrip}>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>32+</span>
          <span className={styles.statLabel}>{t.statCustomers}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>120+</span>
          <span className={styles.statLabel}>{t.statDeployed}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>4.2k</span>
          <span className={styles.statLabel}>{t.statAvgMo}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>99.1%</span>
          <span className={styles.statLabel}>{t.statUpTime}</span>
        </div>
      </div>
    </div>
    </>
  );
}
