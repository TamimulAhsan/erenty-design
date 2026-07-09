"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";
import styles from "./BusinessSignup.module.css";

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

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

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BusinessSignupClient({ dict, isEmbedded = false }) {
  const t = dict;
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname) || defaultLocale;

  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const formPanel = containerRef.current?.closest("main");
      if (formPanel) {
        formPanel.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [step]);
  const [form, setForm] = useState({
    fullName: "", designation: "", phone: "", email: "", password: "", confirmPassword: "", mailingAddress: "",
    companyName: "", postCode: "", city: "", streetAddress: "", regNumber: "", taxNumber: "", repName: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDropActive, setIsDropActive] = useState(false);
  const fileInputRef = useRef(null);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [status, setStatus] = useState("idle"); // idle | verifying | redirecting
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 4 || resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, resendCooldown]);

  const updateField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const goNext = (e) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError(t.step1.passwordMismatch);
      return;
    }
    setPasswordError("");
    setStep(2);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const validateAndSetFile = (candidate) => {
    if (!candidate) return;
    if (!ACCEPTED_FILE_TYPES.includes(candidate.type) || candidate.size > MAX_FILE_BYTES) {
      setFileError(t.step3.invalidFile);
      return;
    }
    setFileError("");
    setFile(candidate);
  };

  const handleFileInputChange = (e) => validateAndSetFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDropActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleDocumentsSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setFileError(t.step3.invalidFile);
      return;
    }
    setStep(4);
  };

  const handleOtpChange = (idx) => (e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx) => (e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;
    e.preventDefault();
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.some((d) => !d)) {
      setOtpError(t.step4.invalidCode);
      return;
    }
    setStatus("verifying");
    // Verification wiring deferred — UI only.
    setTimeout(() => {
      setStatus("redirecting");
      const slug = slugify(form.companyName) || "business";
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", slug);
      }
      setTimeout(() => {
        router.push(localizeHref(locale, `/profile/${slug}`));
      }, 700);
    }, 900);
  };
  const content = (
    <div ref={containerRef} style={{ width: "100%" }}>
      {/* Step indicator */}
      <div 
        className={styles.steps}
        style={{
          "--steps-translate": isEmbedded && step === 3 ? "-40px" : isEmbedded && step === 4 ? "-115px" : "0px"
        }}
      >
        {t.steps.map((s, i) => {
          const idx = i + 1;
          const isDone = idx < step;
          const isActive = idx === step;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <div className={`${styles.stepLine} ${idx <= step ? styles.stepLineDone : ""}`} />
              )}
              <div
                className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ""} ${isDone ? styles.stepItemDone : ""}`}
              >
                <div className={styles.stepBadge}>{isDone ? CHECK_ICON : idx}</div>
                <div className={styles.stepText}>
                  <div className={styles.stepLabel}>{s.label}</div>
                  <div className={styles.stepDesc}>{s.desc}</div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      <div className={isEmbedded ? styles.embeddedCard : styles.card}>
        {/* Step 1 — Contact details */}
        {step === 1 && (
          <form onSubmit={handleContactSubmit}>
            <h2 className={styles.cardTitle}>{t.step1.title}</h2>
            <p className={styles.cardSubtitle}>{t.step1.subtitle}</p>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-fullname">{t.step1.fullNameLabel} *</label>
                <input id="bs-fullname" className={styles.fieldInput} required placeholder={t.step1.fullNamePlaceholder} value={form.fullName} onChange={updateField("fullName")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-designation">{t.step1.designationLabel} *</label>
                <input id="bs-designation" className={styles.fieldInput} required placeholder={t.step1.designationPlaceholder} value={form.designation} onChange={updateField("designation")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-phone">{t.step1.phoneLabel}</label>
                <input id="bs-phone" type="tel" className={styles.fieldInput} placeholder={t.step1.phonePlaceholder} value={form.phone} onChange={updateField("phone")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-email">{t.step1.emailLabel} *</label>
                <input id="bs-email" type="email" className={styles.fieldInput} required placeholder={t.step1.emailPlaceholder} value={form.email} onChange={updateField("email")} />
                <span className={styles.fieldHelper}>{t.step1.emailHelper}</span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-password">{t.step1.passwordLabel} *</label>
                <div className={styles.passwordWrapper}>
                  <input id="bs-password" type={showPass ? "text" : "password"} className={styles.fieldInput} required minLength={8} value={form.password} onChange={updateField("password")} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                    {showPass ? EYE_CLOSED : EYE_OPEN}
                  </button>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-confirm">{t.step1.confirmLabel} *</label>
                <div className={styles.passwordWrapper}>
                  <input id="bs-confirm" type={showConfirm ? "text" : "password"} className={styles.fieldInput} required placeholder={t.step1.confirmPlaceholder} value={form.confirmPassword} onChange={updateField("confirmPassword")} />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle confirm password">
                    {showConfirm ? EYE_CLOSED : EYE_OPEN}
                  </button>
                </div>
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel} htmlFor="bs-address">{t.step1.addressLabel} *</label>
                <textarea id="bs-address" className={styles.fieldTextarea} required placeholder={t.step1.addressPlaceholder} value={form.mailingAddress} onChange={updateField("mailingAddress")} />
              </div>
            </div>
            {passwordError && <p className={styles.otpError}>{passwordError}</p>}
            <div className={styles.actionsRow}>
              <button type="submit" className={styles.nextBtn}>
                {t.continue} {ARROW_ICON}
              </button>
            </div>
          </form>
        )}

        {/* Step 2 — Company details */}
        {step === 2 && (
          <form onSubmit={goNext}>
            <h2 className={styles.cardTitle}>{t.step2.title}</h2>
            <p className={styles.cardSubtitle}>{t.step2.subtitle}</p>
            <div className={styles.formGrid}>
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel} htmlFor="bs-companyname">{t.step2.companyNameLabel} *</label>
                <input id="bs-companyname" className={styles.fieldInput} required placeholder={t.step2.companyNamePlaceholder} value={form.companyName} onChange={updateField("companyName")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-postcode">{t.step2.postCodeLabel} *</label>
                <input id="bs-postcode" className={styles.fieldInput} required placeholder={t.step2.postCodePlaceholder} value={form.postCode} onChange={updateField("postCode")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-city">{t.step2.cityLabel} *</label>
                <input id="bs-city" className={styles.fieldInput} required placeholder={t.step2.cityPlaceholder} value={form.city} onChange={updateField("city")} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel} htmlFor="bs-street">{t.step2.streetLabel} *</label>
                <input id="bs-street" className={styles.fieldInput} required placeholder={t.step2.streetPlaceholder} value={form.streetAddress} onChange={updateField("streetAddress")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-regnumber">{t.step2.regNumberLabel} *</label>
                <input id="bs-regnumber" className={styles.fieldInput} required placeholder={t.step2.regNumberPlaceholder} value={form.regNumber} onChange={updateField("regNumber")} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bs-taxnumber">{t.step2.taxNumberLabel} *</label>
                <input id="bs-taxnumber" className={styles.fieldInput} required placeholder={t.step2.taxNumberPlaceholder} value={form.taxNumber} onChange={updateField("taxNumber")} />
                <span className={styles.fieldHelper}>{t.step2.taxNumberHelper}</span>
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel} htmlFor="bs-repname">{t.step2.repNameLabel} *</label>
                <input id="bs-repname" className={styles.fieldInput} required placeholder={t.step2.repNamePlaceholder} value={form.repName} onChange={updateField("repName")} />
                <span className={styles.fieldHelper}>{t.step2.repNameHelper}</span>
              </div>
            </div>
            <div className={styles.actionsRow}>
              <button type="button" className={styles.backBtn} onClick={goBack}>{t.back}</button>
              <button type="submit" className={styles.nextBtn}>
                {t.continue} {ARROW_ICON}
              </button>
            </div>
          </form>
        )}

        {/* Step 3 — Documents */}
        {step === 3 && (
          <form onSubmit={handleDocumentsSubmit}>
            <h2 className={styles.cardTitle}>{t.step3.title}</h2>
            <p className={styles.cardSubtitle}>{t.step3.subtitle}</p>

            {!file ? (
              <div
                className={`${styles.dropzone} ${isDropActive ? styles.dropzoneActive : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDropActive(true); }}
                onDragLeave={() => setIsDropActive(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
              >
                <div className={styles.dropzoneIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className={styles.dropzoneLabel}>{t.step3.dropLabel}</p>
                <p className={styles.dropzoneHint}>{t.step3.fileTypes}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  required
                  className={styles.hiddenFileInput}
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                />
              </div>
            ) : (
              <div className={styles.filePreview}>
                <div className={styles.fileIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{formatBytes(file.size)}</div>
                </div>
                <button type="button" className={styles.fileRemove} onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                  {t.step3.removeFile}
                </button>
              </div>
            )}
            {fileError && <p className={styles.otpError}>{fileError}</p>}

            <p className={styles.consentText}>
              {t.step3.consentPrefix} <Link href="/terms">{t.step3.consentTermsLink}</Link> {t.step3.consentSuffix}
            </p>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.backBtn} onClick={goBack}>{t.back}</button>
              <button type="submit" className={styles.nextBtn}>
                {t.submit} {ARROW_ICON}
              </button>
            </div>
          </form>
        )}

        {/* Step 4 — Verify email */}
        {step === 4 && (
          <form onSubmit={handleVerify}>
            {status === "idle" ? (
              <>
                <div className={styles.verifyCenter}>
                  <div className={styles.verifyIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <h2 className={styles.cardTitle}>{t.step4.title}</h2>
                  <p className={styles.cardSubtitle}>
                    {t.step4.subtitle} <span className={styles.verifyEmail}>{form.email}</span>
                  </p>
                </div>

                <div className={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={styles.otpInput}
                      value={digit}
                      onChange={handleOtpChange(idx)}
                      onKeyDown={handleOtpKeyDown(idx)}
                    />
                  ))}
                </div>
                {otpError && <p className={styles.otpError}>{otpError}</p>}

                <div className={styles.resendRow}>
                  {t.step4.resendPrompt}{" "}
                  <button
                    type="button"
                    className={styles.resendBtn}
                    disabled={resendCooldown > 0}
                    onClick={handleResend}
                  >
                    {resendCooldown > 0 ? t.step4.resendCountdown.replace("{s}", resendCooldown) : t.step4.resendBtn}
                  </button>
                </div>

                <div className={styles.actionsRow}>
                  <button type="button" className={styles.backBtn} onClick={goBack}>{t.back}</button>
                  <button type="submit" className={styles.nextBtn}>
                    {t.step4.verifyBtn} {ARROW_ICON}
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.statusText}>
                {status === "verifying" ? t.step4.verifying : t.step4.redirecting}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>{t.headerTitle}</h1>
          <p className={styles.headerSubtitle}>{t.headerSubtitle}</p>
        </div>
        {content}
      </div>
    </div>
  );
}
