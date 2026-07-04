"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import styles from "./About.module.css";

const COMPANY_LOGOS = [
  { name: "Accent Hotels", src: "/companies/Accent_hotels.jpeg" },
  { name: "Bukfurdo Spa", src: "/companies/Bukfurdo%20Thermal%20%26%20Spa.jpeg" },
  { name: "Gorilla Delivery", src: "/companies/gorilla_delivery.png" },
  { name: "Foodora", src: "/companies/foodora.png" },
  { name: "Wolt", src: "/companies/wolt.jpeg" },
  { name: "Sziget", src: "/companies/sziget.png" },
  { name: "Movenpick", src: "/companies/movenpick.png" },
  { name: "Tourinform", src: "/companies/Tourinform.jpeg" },
  { name: "Indotek Group", src: "/companies/indotek_group.webp" },
  { name: "Hotel Napfeny", src: "/companies/hotel_napfeny.png" },
  { name: "SDG", src: "/companies/Sdg.jpeg" },
  { name: "Everness Festival", src: "/companies/everness_festival.png" },
  { name: "Sonepar", src: "/companies/sonepar.png" },
  { name: "R73", src: "/companies/r73.webp" },
  { name: "Lele Hotel", src: "/companies/lele_hotel.png" },
  { name: "Club Hotels", src: "/companies/club_hotels.jpeg" },
  { name: "Giggle", src: "/companies/giggle.png" },
  { name: "Wantop Futar", src: "/companies/wantop_futar.jpeg" },
  { name: "Roksh", src: "/companies/roksh.webp" },
  { name: "Cardoner Hotel", src: "/companies/cardoner_hotel.jpeg" },
];

/* ── SVG Icon helpers ────────────────────────────────────────────────── */

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const VALUE_ICONS = {
  sustainability: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
    </svg>
  ),
  reliability: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  transparency: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  partnership: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  people: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  innovation: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
};

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function AboutClient({ dict }) {
  const t = dict;

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      `.${styles.animateOnScroll}`
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroEyebrow} eyebrow`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {t.heroEyebrow}
          </div>
          <h1 className={styles.heroTitle}>
            {t.heroTitleLine1}<br />
            <span className={styles.heroTitleHighlight}>{t.heroTitleLine2}</span>
          </h1>
          <p className={`${styles.heroDesc} body-lg`}>{t.heroDesc}</p>
          <div className={styles.heroCtas}>
            <Link href="/fleets" className="btn-primary">
              {t.ctaFleet} {ARROW_ICON}
            </Link>
            <Link href="/contact" className="btn-secondary dark">
              {t.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        {t.stats.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={`${styles.statValue} mono-num`}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── MISSION ───────────────────────────────────────────────────── */}
      <section className={styles.missionSection}>
        <div className={styles.missionGrid}>
          <div className={`${styles.missionLeft} ${styles.animateOnScroll} ${styles.slideLeft}`}>
            <p className={`${styles.missionEyebrow} eyebrow`}>{t.missionEyebrow}</p>
            <h2 className={styles.missionTitle}>{t.missionTitle}</h2>
            <p className={`${styles.missionDesc} body-default`}>{t.missionDesc}</p>
            <ul className={styles.missionBullets}>
              {t.missionBullets.map((b, i) => (
                <li key={i}>
                  <span className={styles.bulletCheck}><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.missionRight}>
            <div className={styles.metricsGrid}>
              {t.metrics.map((m, i) => (
                <div key={i} className={`${styles.metricCard} ${styles.animateOnScroll} ${styles.slideRight} ${styles[`delay${i + 1}`]}`}>
                  <span className={`${styles.metricValue} mono-num`}>{m.value}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                  {m.sub && <span className={styles.metricMiniLabel}>{m.sub}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────── */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesInner}>
          <div className={`${styles.valuesHeader} ${styles.animateOnScroll}`}>
            <p className={`${styles.valuesEyebrow} eyebrow`}>{t.valuesEyebrow}</p>
            <h2 className={styles.valuesTitle}>{t.valuesTitle}</h2>
            <p className={`${styles.valuesSubtitle} body-default`}>{t.valuesSubtitle}</p>
          </div>
          <div className={styles.valuesGrid}>
            {t.values.map((v, i) => {
              const iconKeys = ["sustainability", "reliability", "transparency", "partnership", "people", "innovation"];
              return (
                <div key={i} className={`${styles.valueCard} ${styles.animateOnScroll} ${styles[`delay${(i % 3) + 1}`]}`}>
                  <div className={styles.valueIcon}>
                    {VALUE_ICONS[iconKeys[i]] || VALUE_ICONS.sustainability}
                  </div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────── */}
      <section className={styles.timelineSection}>
        <div className={`${styles.timelineHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.timelineEyebrow} eyebrow`}>{t.timelineEyebrow}</p>
          <h2 className={styles.timelineTitle}>{t.timelineTitle}</h2>
          <p className={`${styles.timelineSubtitle} body-default`}>{t.timelineSubtitle}</p>
        </div>
        <div className={styles.timeline}>
          <div className={`${styles.timelineLine} ${styles.animateOnScroll}`} aria-hidden="true" />
          {t.timeline.map((item, i) => (
            <div key={i} className={`${styles.timelineItem} ${styles.animateOnScroll}`}>
              <div className={styles.timelineDot} />
              <span className={styles.timelineYear}>{item.year}</span>
              <h3 className={styles.timelineItemTitle}>{item.title}</h3>
              <p className={styles.timelineItemDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────── */}
      <section className={styles.teamSection}>
        <div className={styles.teamInner}>
          <div className={`${styles.teamHeader} ${styles.animateOnScroll}`}>
            <p className={`${styles.teamEyebrow} eyebrow`}>{t.teamEyebrow}</p>
            <h2 className={styles.teamTitle}>{t.teamTitle}</h2>
            <p className={styles.teamSubtitle}>{t.teamSubtitleText}</p>
          </div>
          <div className={styles.teamGrid}>
            {t.team.map((m, i) => (
              <div key={i} className={`${styles.teamCard} ${styles.animateOnScroll} ${styles[`delay${(i % 3) + 1}`]}`}>
                <div className={styles.teamAvatar}>{m.initials}</div>
                <h3 className={styles.teamName}>{m.name}</h3>
                <p className={styles.teamRole}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ──────────────────────────────────────────────── */}
      <section className={styles.logosSection}>
        <div className={`${styles.logosHeader} ${styles.animateOnScroll}`}>
          <p className={styles.logosTitle}>{t.logosTitle}</p>
        </div>
        <div className={`${styles.marqueeTrack} ${styles.animateOnScroll} ${styles.delay1}`}>
          {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((logo, i) => (
            <div key={i} className={styles.logoItem}>
              <Image
                src={logo.src}
                alt={logo.name}
                width={72}
                height={40}
                className={styles.logoImg}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaCard} ${styles.animateOnScroll}`}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <p className={styles.ctaDesc}>{t.ctaDesc}</p>
          <div className={styles.ctaButtons}>
            <Link href="/fleets" className="btn-primary">
              {t.ctaFleetBtn} {ARROW_ICON}
            </Link>
            <Link href="/contact" className="btn-secondary dark">
              {t.ctaContactBtn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
