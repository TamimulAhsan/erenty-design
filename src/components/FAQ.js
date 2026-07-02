"use client";

import { useState } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./FAQ.module.css";

export default function FAQ({ dict }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={`${styles.eyebrow} eyebrow`}>{dict.eyebrow}</span>
          <h2 className={`${styles.title} h2`}>{dict.title}</h2>
          <p className={styles.subtitle}>
            {dict.subtitle}
          </p>
        </div>

        <div className={styles.faqList}>
          {dict.items.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`${styles.faqRow} ${isOpen ? styles.faqRowOpen : ""}`}
              >
                <button 
                  className={styles.questionButton} 
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{item.question}</span>
                  <div className={styles.iconWrapper}>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={styles.chevronIcon}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                <div className={`${styles.answerWrapper} ${isOpen ? styles.answerOpen : ""}`}>
                  <div className={styles.answerInner}>
                    <p className={styles.answerText}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.viewAllContainer}>
          <Link href="/faq" className={styles.viewAllLink}>
            {dict.viewAll}
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
