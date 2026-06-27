"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Heading — top-left */}
      <div className={styles.heroLeft}>
        <h1 className={`${styles.title} hero-display`}>
          <span>Your Team.</span>
          <span>Your Fleet.</span>
          <span className={styles.highlight} data-text="Your E-Rent Solution.">Your E-Rent Solution.</span>
        </h1>
      </div>

      {/* Stats — mid-right, overlapping the stage */}
      <div className={styles.statsBlock}>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>32+</span>
          <span className={styles.statLabel}>Customers</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>120+</span>
          <span className={styles.statLabel}>Deployed</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>4.2k</span>
          <span className={styles.statLabel}>AVG/MO</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statNum} mono-num`}>99.1%</span>
          <span className={styles.statLabel}>UP TIME</span>
        </div>
      </div>

      {/* CTA buttons — bottom-left */}
      <div className={styles.ctaRow}>
        <Link href="/see-fleets" className="btn-primary">
          See Fleets
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
        <Link href="/service" className="btn-secondary dark">
          Courier+
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
