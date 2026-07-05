"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./Contact.module.css";

/* ── Icons ──────────────────────────────────────────────────────────── */
const Icon = {
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  mailEyebrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  mail: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  pin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  check: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

export default function ContactClient({ dict }) {
  const t = dict;
  const [formState, setFormState] = useState("idle"); // idle | sent
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission — wiring comes later
    setFormState("sent");
  };

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  // Scroll-reveal for below-the-fold blocks (same pattern as the About page).
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
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    const els = document.querySelectorAll(`.${styles.animateOnScroll}`);
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  const channels = [
    { icon: Icon.mail, label: t.emailLabel, value: "info@e-renty.com", href: "mailto:info@e-renty.com", sub: t.emailSub },
    { icon: Icon.phone, label: t.phoneLabel, value: "+36 20 434 0771", href: "tel:+36204340771", sub: t.phoneSub },
    { icon: Icon.pin, label: t.addressLabel, value: t.addressValue, href: null, sub: t.addressSub },
    { icon: Icon.clock, label: t.hoursLabel, value: t.hoursValue, href: null, sub: t.hoursSub },
  ];

  return (
    <>
      {/* ── HERO (dark) ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={`${styles.heroEyebrow} eyebrow`}>
            {Icon.mailEyebrow}
            {t.heroEyebrow}
          </span>
          <h1 className={styles.heroTitle}>
            {t.heroTitleLine1}<br />
            <span className={styles.heroTitleHighlight}>{t.heroTitleLine2}</span>
          </h1>
          <p className={`${styles.heroDesc} body-lg`}>{t.heroDesc}</p>
        </div>
      </section>

      {/* ── FLOATING CONTACT CARDS ────────────────────────────────────── */}
      <div className={styles.infoCards}>
        {channels.map((c, i) => (
          <div key={i} className={styles.infoCard}>
            <span className={styles.infoIcon}>{c.icon}</span>
            <span className={styles.infoLabel}>{c.label}</span>
            {c.href ? (
              <a className={styles.infoValue} href={c.href}>{c.value}</a>
            ) : (
              <span className={styles.infoValue}>{c.value}</span>
            )}
            <span className={styles.infoSub}>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* ── FORM ──────────────────────────────────────────────────────── */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>
          {formState === "sent" ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>{Icon.check}</div>
              <h3 className={styles.successTitle}>{t.successTitle}</h3>
              <p className={styles.successDesc}>{t.successDesc}</p>
            </div>
          ) : (
            <>
              <div className={`${styles.formHeader} ${styles.animateOnScroll}`}>
                <h2 className={styles.formTitle}>{t.formTitle}</h2>
                <p className={`${styles.formSubtitle} body-default`}>{t.formSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className={`${styles.form} ${styles.animateOnScroll} ${styles.delay1}`}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="contact-topic">{t.topicLabel}</label>
                  <select id="contact-topic" className={styles.fieldSelect} defaultValue="">
                    <option value="" disabled>{t.topicPlaceholder}</option>
                    {t.topics.map((topic, i) => (
                      <option key={i} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="contact-name">
                      {t.nameLabel} <span className={styles.required}>*</span>
                    </label>
                    <input id="contact-name" type="text" className={styles.fieldInput} placeholder={t.namePlaceholder} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="contact-email">
                      {t.emailFieldLabel} <span className={styles.required}>*</span>
                    </label>
                    <input id="contact-email" type="email" className={styles.fieldInput} placeholder={t.emailFieldPlaceholder} required />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="contact-company">{t.companyLabel}</label>
                  <input id="contact-company" type="text" className={styles.fieldInput} placeholder={t.companyPlaceholder} />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="contact-message">
                    {t.messageLabel} <span className={styles.required}>*</span>
                  </label>
                  <textarea id="contact-message" className={styles.fieldTextarea} placeholder={t.messagePlaceholder} required />
                </div>

                <div className={styles.formFooter}>
                  <p className={styles.privacyNote}>{t.privacyNote}</p>
                  <button type="submit" className={styles.submitBtn}>
                    {t.submitBtn} {Icon.send}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── MAP SECTION ───────────────────────────────────────────────── */}
      <section className={styles.mapSection}>
        <div className={`${styles.mapHeader} ${styles.animateOnScroll}`}>
          <p className={`${styles.mapEyebrow} eyebrow`}>{t.mapEyebrow}</p>
          <h2 className={styles.mapTitle}>{t.mapTitle}</h2>
          <p className={`${styles.mapSubtitle} body-default`}>{t.mapSubtitle}</p>
        </div>

        <div className={`${styles.mapContainer} ${styles.animateOnScroll} ${styles.delay1}`}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.57!2d19.0267!3d47.5025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc13a905ef81%3A0x0!2s1012+Budapest%2C+Kuny+Domokos+utca+13-15!5e0!3m2!1sen!2shu!4v1"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="E-Renty Office Location"
          />
          <div className={styles.mapInfoBar}>
            <div className={styles.mapAddress}>
              <span className={styles.mapAddressName}>E-Renty Kft.</span>
              <span className={styles.mapAddressLine}>{t.addressValue}</span>
            </div>
            <a
              href="https://www.google.com/maps/search/1012+Budapest,+Kuny+Domokos+utca+13-15"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              {t.openInMaps} {Icon.external}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ───────────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <div className={`${styles.faqHeader} ${styles.animateOnScroll}`}>
            <h2 className={styles.faqTitle}>{t.faqTitle}</h2>
          </div>

          <div className={`${styles.faqList} ${styles.animateOnScroll} ${styles.delay1}`}>
            {t.faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <svg
                    className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === i && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            ))}
          </div>

          <div className={`${styles.faqViewAllWrap} ${styles.animateOnScroll} ${styles.delay2}`}>
            <Link href="/faq" className={styles.faqViewAll}>
              {t.faqViewAll} {Icon.arrow}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={`${styles.ctaCard} ${styles.animateOnScroll}`}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <p className={styles.ctaDesc}>{t.ctaDesc}</p>
          <div className={styles.ctaButtons}>
            <Link href="/fleets" className="btn-primary">
              {t.ctaFleetBtn} {Icon.arrow}
            </Link>
            <Link href="/about" className="btn-secondary dark">
              {t.ctaAboutBtn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
