"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Subtle background linework/wheel graphic overlay */}
      <svg
        className={styles.wheelGraphic}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="50" cy="50" r="45" strokeDasharray="1 1" />
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="15" />
        <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18.18 18.18 L 81.82 81.82 M 18.18 81.82 L 81.82 18.18" />
      </svg>

      <div className={styles.container}>
        {/* Left Column - Content & Stats */}
        <div className={styles.leftCol}>
          {/* Eyebrow - Clean Text Only */}
          <span className={styles.eyebrowText}>
            Fuel-free • Stress-free
          </span>

          {/* Heading */}
          <h1 className={`${styles.title} hero-display`}>
            Your Team. <br />
            Your Fleet. <br />
            <span className={styles.highlightText}>Your E-rent Solution.</span>
          </h1>

          {/* Subtext */}
          <p className={`${styles.subtext} body-lg`}>
            Empower your business with smart, custom-tailored electric fleets.
            Increase productivity, eliminate fuel costs, and keep your city green.
          </p>

          {/* CTA Group: See Fleets & Service+ (Unified corner radius) */}
          <div className={styles.ctaGroup}>
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
              Service+
            </Link>
          </div>

          <div className={styles.divider}></div>

          {/* Stats strip */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={`${styles.statNum} mono-num`}>32+</span>
              <span className={styles.statLabel}>customers</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statNum} mono-num`}>120+</span>
              <span className={styles.statLabel}>deployed</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statNum} mono-num`}>4.2k</span>
              <span className={styles.statLabel}>avg/mo</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statNum} mono-num`}>99.1%</span>
              <span className={styles.statLabel}>uptime</span>
            </div>
          </div>
        </div>

        {/* Right Column - Large Animated Preview & Status Card */}
        <div className={styles.rightCol}>
          <div className={styles.previewContainer}>
            <Image
              src="/images/hero-bike.jpg"
              alt="E-Renty Fleet"
              width={800}
              height={600}
              className={styles.fleetPhoto}
              priority
            />

            {/* Flat text tag, not button-styled */}
            <div className={styles.insuredBadge}>
              <span className={styles.insuredDot}></span>
              Insured · 24/7 monitored
            </div>

            {/* Floating Glass Status Card (Business-oriented long-term metrics) */}
            <div className={styles.glassCard}>
              <div className={styles.statusRow}>
                <div className={styles.statusIndicator}>
                  <span className={styles.statusDot}></span>
                  Fleet Active
                </div>
                <div className={`${styles.speed} mono-num`}>Support</div>
              </div>

              <div className={styles.glassDivider}></div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Contract</span>
                  <span className={`${styles.metricValue} mono-num`}>12+ Mos</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Maintenance</span>
                  <span className={`${styles.metricValue} mono-num`}>Included</span>
                </div>
              </div>

              <div className={styles.locationRow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.locationIcon}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="caption">Budapest, Hungary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
