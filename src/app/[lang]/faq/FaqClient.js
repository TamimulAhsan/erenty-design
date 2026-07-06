'use client';

// Force compiler rebuild
import { useState, useRef, useEffect } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./Faq.module.css";

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const TAB_ICONS = {
  customers: (
    <svg className={undefined} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  couriers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18.5" cy="18.5" r="2.5" /><circle cx="5.5" cy="18.5" r="2.5" />
      <path d="M15 5a1 1 0 0 1 1 1v4.586a1 1 0 0 1-.293.707L12 15" />
      <path d="M2 8h3" /><path d="M2 12h5" /><path d="M2 16h2" />
    </svg>
  ),
  businesses: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
};

const TAB_KEYS = ["customers", "couriers", "businesses"];

export default function FaqClient({ dict, initialTab }) {
  const t = dict;
  const initialTabIdx = TAB_KEYS.indexOf(initialTab);
  const [activeTab, setActiveTab] = useState(initialTabIdx !== -1 ? initialTabIdx : 0);
  const [openItems, setOpenItems] = useState({});
  const tabRefs = useRef([]);

  // Deep-link sync: when the ?tab= param changes without a remount, jump to that
  // tab and scroll it into view. Syncing local state to the URL is a valid use
  // of an effect, so the set-state-in-effect rule is a false positive here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialTab) {
      const idx = TAB_KEYS.indexOf(initialTab);
      if (idx !== -1) {
        setActiveTab(idx);
        setOpenItems({});
        setTimeout(() => {
          tabRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 100);
      }
    }
  }, [initialTab]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    setOpenItems({});
    // Keep the tapped tab in view — the mobile bar scrolls horizontally.
    tabRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroEyebrow} eyebrow`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {t.heroEyebrow}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroDesc}>{t.heroDesc}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabBar}>
          {t.tabs.map((tab, i) => (
            <button
              key={i}
              ref={(el) => { tabRefs.current[i] = el; }}
              className={`${styles.tabBtn} ${activeTab === i ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabChange(i)}
            >
              {TAB_ICONS[TAB_KEYS[i]]}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className={styles.faqContent}>
        {t.tabs[activeTab].categories.map((cat, ci) => (
          <div key={ci} className={styles.categoryBlock}>
            <h2 className={styles.categoryTitle}>{cat.title}</h2>
            <div className={styles.faqList}>
              {cat.items.map((item, qi) => {
                const key = `${activeTab}-${ci}-${qi}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={qi} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleItem(key)}
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ""}`}>
                      <div className={styles.faqAnswerInner}>
                        <p className={styles.faqAnswerText}>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <p className={styles.ctaDesc}>{t.ctaDesc}</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn-primary">
              {t.ctaContactBtn} {ARROW_ICON}
            </Link>
            <Link href="/fleets" className="btn-secondary dark">
              {t.ctaFleetBtn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
