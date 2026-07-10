"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import CountUp from "@/components/CountUp";
import styles from "./Business.module.css";

/* Real E-Renty business customers (same asset set as the About page). */
const COMPANY_LOGOS = [
  { name: "Foodora", src: "/companies/foodora.png" },
  { name: "Wolt", src: "/companies/wolt.png" },
  { name: "Gorilla Delivery", src: "/companies/gorilladelivery.png" },
  { name: "Wantop Futar", src: "/companies/wantopfutar.png" },
  { name: "Accent Hotels", src: "/companies/accenthotels.png" },
  { name: "Bukfurdo Spa", src: "/companies/bukfurdo.png" },
  { name: "Movenpick", src: "/companies/movenpick.png" },
  { name: "Hotel Napfeny", src: "/companies/hotelnapfeny.png" },
  { name: "Club Hotels", src: "/companies/clubhotels.png" },
  { name: "Cardoner Hotel", src: "/companies/cardoner.png" },
  { name: "Lelle Hotel", src: "/companies/lelle%20hotel.png" },
  { name: "Tourinform", src: "/companies/tourinform.png" },
  { name: "Everness Festival", src: "/companies/evernessfestival.png" },
  { name: "Indotek Group", src: "/companies/indotekgroup.png" },
  { name: "Sonepar", src: "/companies/sonepar.png" },
  { name: "SDG", src: "/companies/sdg.png" },
];

/* ── Icon helpers ────────────────────────────────────────────────────── */

const Icon = ({ d, children, ...rest }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* Why-choose icons: predictable fee · tax · cheaper than car · no headaches */
const WHY_ICONS = [
  <Icon key="0"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" /><line x1="12" y1="6" x2="12" y2="18" /></Icon>,
  <Icon key="1"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>,
  <Icon key="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></Icon>,
  <Icon key="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>,
];

/* Solution segment icons: employee mobility · courier · branding · seasonal */
const SOLUTION_ICONS = [
  <Icon key="0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
  <Icon key="1"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>,
  <Icon key="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Icon>,
  <Icon key="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>,
];

/* Industry icons */
const INDUSTRY_ICONS = [
  <Icon key="0"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>,
  <Icon key="1"><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><line x1="9" y1="9" x2="9" y2="9.01" /><line x1="9" y1="12" x2="9" y2="12.01" /><line x1="9" y1="15" x2="9" y2="15.01" /></Icon>,
  <Icon key="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>,
  <Icon key="3"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Icon>,
  <Icon key="4"><path d="M3 21h18" /><path d="M3 7v14" /><path d="M21 7v14" /><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" /><path d="M9 7h1M9 11h1M14 7h1M14 11h1" /></Icon>,
  <Icon key="5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>,
];

/* Included checklist icons */
const INCLUDED_ICONS = [
  <Icon key="0"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>,
  <Icon key="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
  <Icon key="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Icon>,
  <Icon key="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>,
  <Icon key="4"><path d="M23 6l-9.5 9.5-5-5L1 18" /><polyline points="17 6 23 6 23 12" /></Icon>,
  <Icon key="5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>,
  <Icon key="6"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" /><path d="M12 2v10" /><path d="m8 6 4-4 4 4" /></Icon>,
  <Icon key="7"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></Icon>,
  <Icon key="8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>,
];

export default function BusinessClient({ dict = {}, lang = "en" }) {
  const t = dict;
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    const els = document.querySelectorAll(`.${styles.animateOnScroll}`);
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  const stats = t.stats || [];
  const why = t.why || [];
  const benefitsBullets = t.benefitsBullets || [];
  const benefitsMetrics = t.benefitsMetrics || [];
  const solutions = t.solutions || [];
  const industries = t.industries || [];
  const steps = t.steps || [];
  const included = t.included || [];
  const sustainBullets = t.sustainBullets || [];
  const sustainMetrics = t.sustainMetrics || [];
  const faqs = t.faqs || [];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            {t.heroTitleLine1}<br />
            <span className={styles.heroTitleHighlight}>{t.heroTitleLine2}</span>
          </h1>
          <p className={`${styles.heroDesc} body-lg`}>{t.heroDesc}</p>
          <div className={styles.heroCtas}>
            <Link href="/contact?type=business" className="btn-primary">
              {t.ctaPrimary} {ARROW_ICON}
            </Link>
            <Link href="/fleets" className="btn-secondary dark">
              {t.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* ── Mobile-Only stats strip ── */}
        <div className={`${styles.statsStrip} ${styles.mobileOnlyStats}`}>
          <div className={styles.statsContainer}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNum}><CountUp value={s.value} /></span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desktop-Only Bleeding stats strip ── */}
      <div className={`${styles.statsStrip} ${styles.desktopOnlyStats}`}>
        <div className={styles.statsContainer}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statNum}><CountUp value={s.value} /></span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOGO MARQUEE ──────────────────────────────────────────────── */}
      <section className={styles.logosSection}>
        <div className={`${styles.logosHeader} ${styles.animateOnScroll}`}>
          <p className={styles.logosTitle}>{t.logosTitle}</p>
        </div>
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((logo, i) => (
              <div key={i} className={styles.logoItem}>
                <Image src={logo.src} alt={logo.name} width={130} height={60} className={styles.logoImg} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY E-RENTY ───────────────────────────────────────────────── */}
      <section className={styles.whySection}>
        <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.eyebrow} eyebrow`}>{t.whyEyebrow}</p>
          <h2 className={styles.sectionTitle}>{t.whyTitle}</h2>
          <p className={`${styles.sectionSubtitle} body-default`}>{t.whySubtitle}</p>
        </div>
        <div className={styles.whyGrid}>
          {why.map((c, i) => (
            <div key={i} className={`${styles.whyCard} ${styles.animateOnScroll} ${styles[`delay${(i % 4) + 1}`]}`}>
              <div className={styles.cardIcon}>{WHY_ICONS[i] || WHY_ICONS[0]}</div>
              <h3 className={styles.whyTitle}>{c.title}</h3>
              <p className={styles.whyDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSINESS CASE (tax benefits) ──────────────────────────────── */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsInner}>
          <div className={`${styles.animateOnScroll}`}>
            <p className={`${styles.eyebrow} eyebrow`}>{t.benefitsEyebrow}</p>
            <h2 className={styles.benefitsTitle}>{t.benefitsTitle}</h2>
            <p className={styles.benefitsDesc}>{t.benefitsDesc}</p>
            <ul className={styles.benefitsBullets}>
              {benefitsBullets.map((b, i) => (
                <li key={i}>
                  <span className={styles.bulletCheck}><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
            {t.benefitsNote && <p className={styles.benefitsNote}>{t.benefitsNote}</p>}
          </div>
          <div className={styles.benefitsMetrics}>
            {benefitsMetrics.map((m, i) => (
              <div key={i} className={`${styles.metricCard} ${styles.animateOnScroll} ${styles[`delay${(i % 4) + 1}`]}`}>
                <span className={styles.metricValue}><CountUp value={m.value} /></span>
                <span className={styles.metricLabel}>{m.label}</span>
                {m.sub && <span className={styles.metricSub}>{m.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET SOLUTIONS (segments) ────────────────────────────────── */}
      <section className={styles.solutionsSection}>
        <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.eyebrow} eyebrow`}>{t.solutionsEyebrow}</p>
          <h2 className={styles.sectionTitle}>{t.solutionsTitle}</h2>
          <p className={`${styles.sectionSubtitle} body-default`}>{t.solutionsSubtitle}</p>
        </div>
        <div className={styles.solutionsGrid}>
          {solutions.map((s, i) => (
            <div key={i} className={`${styles.solutionCard} ${styles.animateOnScroll} ${styles[`delay${(i % 2) + 1}`]}`}>
              <div className={styles.solutionHeader}>
                <div className={styles.solutionIcon}>{SOLUTION_ICONS[i] || SOLUTION_ICONS[0]}</div>
                <h3 className={styles.solutionTitle}>{s.title}</h3>
              </div>
              <p className={styles.solutionDesc}>{s.desc}</p>
              <ul className={styles.solutionPoints}>
                {(s.points || []).map((p, j) => (
                  <li key={j}>
                    <span className={styles.pointDot}><DotIcon /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── INDUSTRIES SERVED ─────────────────────────────────────────── */}
      <section className={styles.industriesSection}>
        <div className={styles.industriesInner}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <p className={`${styles.eyebrow} eyebrow`}>{t.industriesEyebrow}</p>
            <h2 className={styles.sectionTitle}>{t.industriesTitle}</h2>
            <p className={`${styles.sectionSubtitle} body-default`}>{t.industriesSubtitle}</p>
          </div>
          <div className={styles.industriesGrid}>
            {industries.map((ind, i) => (
              <div key={i} className={`${styles.industryCard} ${styles.animateOnScroll} ${styles[`delay${(i % 3) + 1}`]}`}>
                <div className={styles.industryIcon}>{INDUSTRY_ICONS[i] || INDUSTRY_ICONS[0]}</div>
                <h3 className={styles.industryName}>{ind.name}</h3>
                <p className={styles.industryDesc}>{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className={styles.howSection}>
        <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.eyebrow} eyebrow`}>{t.howEyebrow}</p>
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>
          <p className={`${styles.sectionSubtitle} body-default`}>{t.howSubtitle}</p>
        </div>
        <div className={`${styles.stepsGrid} ${styles.animateOnScroll}`}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              {i < steps.length - 1 && <span className={styles.stepConnector} aria-hidden="true" />}
              <div className={styles.stepNum}>{i + 1}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVERYTHING INCLUDED ───────────────────────────────────────── */}
      <section className={styles.includedSection}>
        <div className={styles.includedInner}>
          <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
            <p className={`${styles.eyebrow} eyebrow`}>{t.includedEyebrow}</p>
            <h2 className={styles.sectionTitle}>{t.includedTitle}</h2>
            <p className={`${styles.sectionSubtitle} body-default`}>{t.includedSubtitle}</p>
          </div>
          <div className={styles.includedGrid}>
            {included.map((item, i) => (
              <div key={i} className={`${styles.includedItem} ${styles.animateOnScroll} ${styles[`delay${(i % 3) + 1}`]}`}>
                <span className={styles.includedCheck}>{INCLUDED_ICONS[i] || INCLUDED_ICONS[0]}</span>
                <div className={styles.includedText}>
                  <h3 className={styles.includedTitle}>{item.title}</h3>
                  <p className={styles.includedDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sustainSection}>
        <div className={styles.sustainCard}>
          <div className={`${styles.sustainContent} ${styles.animateOnScroll}`}>
            <p className={`${styles.sustainEyebrow} eyebrow`}>{t.sustainEyebrow}</p>
            <h2 className={styles.sustainTitle}>{t.sustainTitle}</h2>
            <p className={styles.sustainDesc}>{t.sustainDesc}</p>
            <ul className={styles.sustainBullets}>
              {sustainBullets.map((b, i) => (
                <li key={i}>
                  <span className={styles.sustainBulletCheck}><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.sustainMetrics}>
            {sustainMetrics.map((m, i) => (
              <div key={i} className={`${styles.sustainMetric} ${styles.animateOnScroll} ${styles[`delay${(i % 3) + 1}`]}`}>
                <span className={styles.sustainMetricValue}>{m.value}</span>
                <span className={styles.sustainMetricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B DASHBOARD HIGHLIGHT CARD ──────────────────────────────── */}
      <section className={styles.b2bSection}>
        <div className={styles.b2bContainer}>
          <div className={`${styles.b2bCard} ${styles.animateOnScroll}`}>
            <div className={styles.b2bContent}>
              <span className={`${styles.b2bEyebrow} eyebrow`}>{t.b2bPre || "Business · 20+ bikes"}</span>
              <h2 className={`${styles.b2bTitle} h2`}>{t.b2bTitle || "Manage your whole fleet from one dashboard."}</h2>
              <p className={`${styles.b2bBody} body-lg`}>
                {t.b2bDesc || "Volume pricing kicks in automatically. Plus: master invoicing, employee provisioning, and a dedicated account manager."}
              </p>
              <Link href="/contact?type=business" className="btn-primary">
                {t.b2bCta || "Request a custom quote →"}
              </Link>
            </div>

            <div className={styles.b2bStatsWrapper}>
              <div className={styles.b2bStatsBlock}>
                <div className={styles.b2bStatItem}>
                  <span className={styles.b2bStatNum}>22%</span>
                  <span className={styles.b2bStatLabel}>{t.b2bStatDiscount || "Volume discount up to"}</span>
                </div>
                <div className={styles.b2bStatItem}>
                  <span className={styles.b2bStatNum}>{lang === "hu" ? "Havi" : "Monthly"}</span>
                  <span className={styles.b2bStatLabel}>{t.b2bStatInvoicing || "Master invoicing"}</span>
                </div>
                <div className={styles.b2bStatItem}>
                  <span className={styles.b2bStatNum}>&lt; 4h</span>
                  <span className={styles.b2bStatLabel}>{t.b2bStatSLA || "SLA response"}</span>
                </div>
                <div className={styles.b2bStatItem}>
                  <span className={styles.b2bStatNum}>50+</span>
                  <span className={styles.b2bStatLabel}>{t.b2bStatAM || "Dedicated AM (50+ bk)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={`${styles.sectionHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.eyebrow} eyebrow`}>{t.faqEyebrow}</p>
          <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
          {t.faqSubtitle && <p className={`${styles.sectionSubtitle} body-default`}>{t.faqSubtitle}</p>}
        </div>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                aria-expanded={openFaq === i}
              >
                {f.q}
                <span className={styles.faqIcon}><PlusIcon /></span>
              </button>
              <div className={styles.faqAnswer}>
                <div className={styles.faqAnswerInner}>{f.a}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.faqMore}>
          <Link href="/faq?tab=businesses" className="btn-secondary">
            {t.viewAllFaq} {ARROW_ICON}
          </Link>
        </div>
      </section>

      {/* ── CONTACT SALES / CTA ───────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaCard} ${styles.animateOnScroll}`}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <p className={styles.ctaDesc}>{t.ctaDesc}</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact?type=business" className="btn-primary">
              {t.ctaPrimaryBtn} {ARROW_ICON}
            </Link>
            <Link href="/fleets" className="btn-secondary dark">
              {t.ctaSecondaryBtn}
            </Link>
          </div>
          {t.ctaNote && <p className={styles.ctaNote}>{t.ctaNote}</p>}
        </div>
      </section>
    </>
  );
}
