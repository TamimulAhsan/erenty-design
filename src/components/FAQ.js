"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./FAQ.module.css";

const FAQ_ITEMS = [
  {
    question: "How do I create an account?",
    answer: "Visit e-renty.com, click Sign In, then choose to register. Enter your name, email and a password of at least 8 characters. We'll send a 6-digit verification code to your inbox — enter it to activate your account."
  },
  {
    question: "What documents do I need to rent?",
    answer: "All customers must pass identity verification before renting. You need to upload an ID card or residence permit, a selfie, a proof-of-address card, and a business registration certificate. Each document is reviewed individually and you'll be notified once approved."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept Visa/Mastercard, Google Pay, Apple Pay, and bank transfer. Card and wallet payments are processed securely through Stripe — your card details are never stored on our servers."
  },
  {
    question: "Can I pay monthly instead of upfront?",
    answer: "Yes. At checkout you choose Monthly (only the first month is charged now, future months appear in your Payments tab with due dates) or Upfront (pay the full period at a discounted rate shown live in the checkout summary)."
  },
  {
    question: "What is the minimum rental period?",
    answer: "The platform minimum is typically 3 months, though this can vary. The checkout flow clearly shows the minimum — period buttons below it are greyed out and not selectable."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={`${styles.eyebrow} eyebrow`}>Support & Help</span>
          <h2 className={`${styles.title} h2`}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Have questions about account setup, document verification, or payments? Find quick answers below.
          </p>
        </div>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, index) => {
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
            View all FAQs
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
