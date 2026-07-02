"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Hero.module.css";

export default function Hero({ dict }) {
  const pathname = usePathname();
  
  // Extract language from URL path
  const pathParts = pathname ? pathname.split("/") : [];
  const currentLang = pathParts[1] && ["en", "hu"].includes(pathParts[1].toLowerCase())
    ? pathParts[1].toLowerCase()
    : "en";

  const localizePath = (path) => {
    if (path.startsWith("/en") || path.startsWith("/hu")) {
      return path;
    }
    return `/${currentLang}${path === "/" ? "" : path}`;
  };

  const t = dict || {
    titleLine1: "Your Team.",
    titleLine2: "Your Fleet.",
    titleHighlight: "Your E-Rent Solution.",
    ctaSeeFleets: "See Fleets",
    ctaCourierPlus: "Courier+",
    statCustomers: "Customers",
    statDeployed: "Deployed",
    statAvgMo: "AVG/MO",
    statUpTime: "UP TIME"
  };

  return (
    <section className={styles.hero}>
      {/* Heading — top-left */}
      <div className={styles.heroLeft}>
        <h1 className={`${styles.title} hero-display`}>
          <span>{t.titleLine1}</span>
          <span>{t.titleLine2}</span>
          <span className={styles.highlight} data-text={t.titleHighlight}>{t.titleHighlight}</span>
        </h1>
      </div>

      {/* Stats — mid-right, overlapping the stage */}
      <div className={styles.statsBlock}>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>32+</span>
          <span className={styles.statLabel}>{t.statCustomers}</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>120+</span>
          <span className={styles.statLabel}>{t.statDeployed}</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>4.2k</span>
          <span className={styles.statLabel}>{t.statAvgMo}</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>99.1%</span>
          <span className={styles.statLabel}>{t.statUpTime}</span>
        </div>
      </div>

      {/* CTA buttons — bottom-left */}
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
        <Link href={localizePath("/courier-plus")} className="btn-secondary dark">
          {t.ctaCourierPlus}
        </Link>
      </div>

      {/* Polygon stage — vehicles stand on this */}
      <div className={styles.stage} aria-hidden="true" />

      {/* Vehicles */}
      <div className={styles.vehiclesLayer}>
        <div className={`${styles.vehicle} ${styles.vehicleLeft}`}>
          <Image
            src="/images/f26_lite.png"
            alt="DUOTTS F26 Lite"
            width={500}
            height={420}
            className={styles.vehicleImg}
            priority
          />
        </div>

        <div className={`${styles.vehicle} ${styles.vehicleCenter}`}>
          <Image
            src="/images/e_crusie.png"
            alt="Urban E-Cruise"
            width={600}
            height={520}
            className={styles.vehicleImg}
            priority
          />
        </div>

        <div className={`${styles.vehicle} ${styles.vehicleRight}`}>
          <Image
            src="/images/g3_pro.png"
            alt="Kukirin G3 Pro"
            width={420}
            height={380}
            className={styles.vehicleImg}
            priority
          />
        </div>
      </div>
    </section>
  );
}
