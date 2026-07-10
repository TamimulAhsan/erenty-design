"use client";

import { useState, useEffect } from "react";
import LocalizedLink from "./LocalizedLink";
import styles from "./CookieConsent.module.css";

export default function CookieConsent({ dict }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  // GDPR: non-essential cookies must be opt-in, so these default to off.
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const t = dict || {
    title: "We value your privacy",
    description: "We use cookies to improve your browsing experience, analyze site traffic, and support our marketing efforts. By clicking \"Accept\", you consent to our use of cookies as described in our Cookie Policy.",
    cookiePolicyLink: "Cookie Policy",
    acceptAll: "Accept",
    decline: "Decline",
    customize: "Customize",
    save: "Save Preferences",
    necessary: "Necessary",
    necessaryDesc: "Required for secure log-in, language routing, and core functionality.",
    necessaryWarning: "Disabling these cookies fully via browser settings may cause issues with logging in.",
    analytics: "Analytics",
    analyticsDesc: "Helps us improve performance and understand how you interact with our pages.",
    marketing: "Marketing",
    marketingDesc: "Allows us to measure advertising performance and personalize content."
  };

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("erenty_cookie_consent");
    if (!consent) {
      // Trigger a small delay to make the entrance transition look incredibly smooth
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentObj = { necessary: true, analytics: true, marketing: true };
    saveConsent(consentObj);
  };

  const handleDeclineAll = () => {
    const consentObj = { necessary: true, analytics: false, marketing: false };
    saveConsent(consentObj);
  };

  const handleSavePreferences = () => {
    const consentObj = { necessary: true, analytics: analyticsAllowed, marketing: marketingAllowed };
    saveConsent(consentObj);
  };

  const saveConsent = (consentObj) => {
    localStorage.setItem("erenty_cookie_consent", JSON.stringify(consentObj));
    // Trigger slide-out animation before removing from DOM
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 450); // Match CSS transition duration
  };

  if (!isVisible) return null;

  // Split description dynamically by policy link to inject the localized link component
  const parts = t.description.split(t.cookiePolicyLink);

  return (
    <div className={`${styles.consentWrapper} ${isClosing ? styles.fadeOut : styles.fadeIn}`} role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className={styles.consentCard}>
        {/* Top/Main Panel */}
        <div className={styles.mainContent}>
          <div className={styles.textContainer}>
            <h2 id="consent-title" className={styles.title}>
              {t.title}
            </h2>
            <p className={styles.description}>
              {parts.length > 1 ? (
                <>
                  {parts[0]}
                  <LocalizedLink href="/cookies" className={styles.policyLink}>
                    {t.cookiePolicyLink}
                  </LocalizedLink>
                  {parts[1]}
                </>
              ) : (
                t.description
              )}
            </p>
          </div>

          {!showCustomize && (
            <div className={styles.actions}>
              <button onClick={handleDeclineAll} className={`${styles.btn} ${styles.btnSecondary}`}>
                {t.decline}
              </button>
              <button onClick={() => setShowCustomize(true)} className={`${styles.btn} ${styles.btnSecondary}`}>
                {t.customize}
              </button>
              <button onClick={handleAcceptAll} className={`${styles.btn} ${styles.btnPrimary}`}>
                {t.acceptAll}
              </button>
            </div>
          )}
        </div>

        {/* Customization Panel */}
        {showCustomize && (
          <div className={styles.customPanel}>
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>
                  {t.necessary} <span className={styles.badgeRequired}>Required</span>
                </span>
                <span className={styles.toggleDesc}>{t.necessaryDesc}</span>
                {t.necessaryWarning && (
                  <span className={styles.warningDesc}>
                    ⚠️ {t.necessaryWarning}
                  </span>
                )}
              </div>
              <div className={styles.toggleSwitchWrapper}>
                <input
                  type="checkbox"
                  id="consent-necessary"
                  checked
                  disabled
                  className={styles.switchInput}
                />
                <label htmlFor="consent-necessary" className={`${styles.switchLabel} ${styles.switchDisabled}`}>
                  <span className={styles.switchButton} />
                </label>
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <label htmlFor="consent-analytics" className={styles.toggleLabel}>
                  {t.analytics}
                </label>
                <span className={styles.toggleDesc}>{t.analyticsDesc}</span>
              </div>
              <div className={styles.toggleSwitchWrapper}>
                <input
                  type="checkbox"
                  id="consent-analytics"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className={styles.switchInput}
                />
                <label htmlFor="consent-analytics" className={styles.switchLabel}>
                  <span className={styles.switchButton} />
                </label>
              </div>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <label htmlFor="consent-marketing" className={styles.toggleLabel}>
                  {t.marketing}
                </label>
                <span className={styles.toggleDesc}>{t.marketingDesc}</span>
              </div>
              <div className={styles.toggleSwitchWrapper}>
                <input
                  type="checkbox"
                  id="consent-marketing"
                  checked={marketingAllowed}
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  className={styles.switchInput}
                />
                <label htmlFor="consent-marketing" className={styles.switchLabel}>
                  <span className={styles.switchButton} />
                </label>
              </div>
            </div>

            <div className={styles.customActions}>
              <button onClick={() => setShowCustomize(false)} className={`${styles.btn} ${styles.btnSecondary}`}>
                Cancel
              </button>
              <button onClick={handleSavePreferences} className={`${styles.btn} ${styles.btnPrimary}`}>
                {t.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
