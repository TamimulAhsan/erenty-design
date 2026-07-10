"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";
import styles from "./Login.module.css";
import BusinessSignupClient from "../signup/business/BusinessSignupClient";

const EYE_OPEN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EYE_CLOSED = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const USER_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const BUILDING_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default function LoginClient({ dict, businessDict }) {
  const t = dict;
  const router = useRouter();
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) || defaultLocale;

  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [accountType, setAccountType] = useState("individual"); // individual | business
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", "user");
    }
    router.push(localizeHref(locale, "/profile/user"));
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Reset-email wiring deferred — show inline confirmation.
    setForgotSent(true);
  };

  const goToLogin = () => {
    setMode("login");
    setForgotSent(false);
  };

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isBusiness = isSignup && accountType === "business";

  return (
    <div className={styles.page}>
      {/* ── Left: brand / context panel ─────────────────────────────── */}
      <aside className={styles.brandPanel}>
        <div className={styles.brandInner}>
          <div className={styles.panelHeader}>
            <div className={`${styles.headerBlock} ${isLogin || isForgot ? styles.headerBlockActive : ""}`}>
              <h1 className={styles.panelHeading}>
                {t.panelLoginHeading}
              </h1>
              <p className={styles.panelSub}>
                {t.panelLoginSub}
              </p>
            </div>
            <div className={`${styles.headerBlock} ${isSignup ? styles.headerBlockActive : ""}`}>
              <h1 className={styles.panelHeading}>
                {t.panelSignupHeading}
              </h1>
              <p className={styles.panelSub}>
                {t.panelSignupSub}
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className={styles.modeToggle} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`${styles.modeBtn} ${isLogin ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("login")}
            >
              {t.loginTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`${styles.modeBtn} ${!isLogin ? styles.modeBtnActive : ""}`}
              onClick={() => setMode("signup")}
            >
              {t.signupTab}
            </button>
          </div>

          {/* Account type (signup only) */}
          {isSignup && (
            <div className={styles.typeSection}>
              <div className={styles.typeLabel}>{t.accountTypeLabel}</div>
              <div className={styles.typeSelector}>
                <button
                  type="button"
                  className={`${styles.typeCard} ${accountType === "individual" ? styles.typeCardActive : ""}`}
                  onClick={() => setAccountType("individual")}
                  aria-pressed={accountType === "individual"}
                >
                  <span className={styles.typeIcon}>{USER_ICON}</span>
                  <span className={styles.typeText}>
                    <span className={styles.typeName}>{t.typeIndividual}</span>
                    <span className={styles.typeDesc}>{t.typeIndividualDesc}</span>
                  </span>
                  <span className={styles.typeCheck}>{CHECK}</span>
                </button>
                <button
                  type="button"
                  className={`${styles.typeCard} ${accountType === "business" ? styles.typeCardActive : ""}`}
                  onClick={() => setAccountType("business")}
                  aria-pressed={accountType === "business"}
                >
                  <span className={styles.typeIcon}>{BUILDING_ICON}</span>
                  <span className={styles.typeText}>
                    <span className={styles.typeName}>{t.typeBusiness}</span>
                    <span className={styles.typeDesc}>{t.typeBusinessDesc}</span>
                  </span>
                  <span className={styles.typeCheck}>{CHECK}</span>
                </button>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className={styles.benefits}>
            {[t.benefit1, t.benefit2, t.benefit3].map((b, i) => (
              <div key={i} className={styles.benefitItem}>
                <span className={styles.benefitCheck}>{CHECK}</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Right: form panel ───────────────────────────────────────── */}
      <main className={styles.formPanel}>
        <div className={`${styles.formInner} ${isBusiness ? styles.formInnerBusiness : ""}`}>
          {isLogin && (
            <>
              <h2 className={styles.formTitle}>{t.loginTitle}</h2>
              <p className={styles.formSubtitle}>{t.loginSubtitle}</p>
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="login-email">{t.emailLabel}</label>
                  <input id="login-email" type="email" className={styles.fieldInput} placeholder={t.emailPlaceholder} required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="login-password">{t.passwordLabel}</label>
                  <div className={styles.passwordWrapper}>
                    <input id="login-password" type={showPass ? "text" : "password"} className={styles.fieldInput} placeholder={t.passwordPlaceholder} required />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                      {showPass ? EYE_CLOSED : EYE_OPEN}
                    </button>
                  </div>
                </div>
                <button type="button" className={styles.forgotLink} onClick={() => setMode("forgot")}>{t.forgotPassword}</button>
                <button type="submit" className={styles.submitBtn}>
                  {t.loginBtn} {ARROW}
                </button>
              </form>
            </>
          )}

          {isSignup && !isBusiness && (
            <>
              <h2 className={styles.formTitle}>{t.signupTitle}</h2>
              <p className={styles.formSubtitle}>{t.individualSubtitle}</p>
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="signup-name">{t.nameLabel}</label>
                  <input id="signup-name" type="text" className={styles.fieldInput} placeholder={t.namePlaceholder} required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="signup-phone">{t.phoneLabel}</label>
                  <input id="signup-phone" type="tel" className={styles.fieldInput} placeholder={t.phonePlaceholder} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="signup-email">{t.emailLabel}</label>
                  <input id="signup-email" type="email" className={styles.fieldInput} placeholder={t.emailPlaceholder} required />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="signup-password">{t.passwordLabel}</label>
                  <div className={styles.passwordWrapper}>
                    <input id="signup-password" type={showPass ? "text" : "password"} className={styles.fieldInput} placeholder={t.createPasswordPlaceholder} required />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                      {showPass ? EYE_CLOSED : EYE_OPEN}
                    </button>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="signup-confirm">{t.confirmLabel}</label>
                  <div className={styles.passwordWrapper}>
                    <input id="signup-confirm" type={showConfirm ? "text" : "password"} className={styles.fieldInput} placeholder={t.confirmPlaceholder} required />
                    <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password">
                      {showConfirm ? EYE_CLOSED : EYE_OPEN}
                    </button>
                  </div>
                </div>
                <div className={styles.checkboxRow}>
                  <input type="checkbox" id="signup-terms" className={styles.checkbox} required />
                  <label htmlFor="signup-terms" className={styles.checkboxLabel}>
                    {t.termsPrefix}{" "}
                    <Link href="/terms">{t.termsLink}</Link>{" "}
                    {t.termsAnd}{" "}
                    <Link href="/privacy">{t.privacyLink}</Link>.
                  </label>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  {t.signupBtn} {ARROW}
                </button>
              </form>
            </>
          )}

          {isForgot && (
            forgotSent ? (
              <div className={styles.forgotSuccess}>
                <span className={styles.forgotSuccessIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h2 className={styles.formTitle}>{t.forgotSuccessTitle}</h2>
                <p className={styles.formSubtitle}>{t.forgotSuccessDesc}</p>
                <button type="button" className={styles.backLink} onClick={goToLogin}>{t.backToLogin}</button>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>{t.forgotTitle}</h2>
                <p className={styles.formSubtitle}>{t.forgotSubtitle}</p>
                <form onSubmit={handleForgotSubmit} className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="forgot-email">{t.emailLabel}</label>
                    <input id="forgot-email" type="email" className={styles.fieldInput} placeholder={t.emailPlaceholder} required />
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    {t.forgotSubmit} {ARROW}
                  </button>
                  <button type="button" className={styles.backLink} onClick={goToLogin}>{t.backToLogin}</button>
                </form>
              </>
            )
          )}

          {isBusiness && (
            <BusinessSignupClient dict={businessDict} isEmbedded={true} />
          )}
        </div>
      </main>
    </div>
  );
}
