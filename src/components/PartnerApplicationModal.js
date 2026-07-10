"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PartnerApplicationModal.module.css";
import { WORKSHOP_TYPES } from "@/data/workshops";

export default function PartnerApplicationModal({ isOpen, onClose, dict = {}, lang = "en" }) {
  const [status, setStatus] = useState("idle"); // idle | submitted
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [specialtyError, setSpecialtyError] = useState(false);

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const specialtyRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target)) {
        setSpecialtyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("modalOpen", isOpen);

    if (isOpen) {
      lastActiveElementRef.current = document.activeElement;
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      lastActiveElementRef.current?.focus();
    }

    return () => document.documentElement.classList.remove("modalOpen");
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setStatus("idle");
    setSelectedSpecialty("");
    setSpecialtyOpen(false);
    setSpecialtyError(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(modalRef.current.querySelectorAll(focusableSelectors));
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSpecialty) {
      setSpecialtyError(true);
      setSpecialtyOpen(true);
      return;
    }
    // Simulate application submission — backend wiring comes later
    setStatus("submitted");
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalWrapper}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "submitted" ? (
          <div className={styles.successState}>
            <button
              ref={closeBtnRef}
              className={`${styles.closeModalBtn} ${styles.closeModalBtnAbsolute}`}
              onClick={handleClose}
              aria-label={dict.closeBtn || "Close"}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className={styles.successIcon}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>{dict.partnerApplySuccessTitle || "Application received!"}</h3>
            <p className={styles.successDesc}>
              {dict.partnerApplySuccessDesc || "Thanks for reaching out — our partnerships team will review your workshop details and get back to you within 2 business days."}
            </p>
            <button type="button" className={styles.closeSuccessBtn} onClick={handleClose}>
              {dict.closeBtn || "Close"}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderText}>
                <h2 id="partner-modal-title" className={styles.modalTitle}>{dict.partnerApplyTitle || "Become a repair partner"}</h2>
                <p className={styles.modalSubtitle}>
                  {dict.partnerApplyDesc || "Join the E-renty network and get featured in the directory. Tell us about your workshop."}
                </p>
              </div>
              <button
                ref={closeBtnRef}
                className={styles.closeModalBtn}
                onClick={handleClose}
                aria-label={dict.closeBtn || "Close"}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-business-name">
                    {dict.businessNameLabel || "Business name"}
                  </label>
                  <input
                    id="partner-business-name"
                    type="text"
                    className={styles.fieldInput}
                    placeholder={dict.businessNamePlaceholder || "e.g. Volt Garázs"}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-contact-name">
                    {dict.contactNameLabel || "Contact name"}
                  </label>
                  <input
                    id="partner-contact-name"
                    type="text"
                    className={styles.fieldInput}
                    placeholder={dict.contactNamePlaceholder || "Full name"}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-email">
                    {dict.emailLabel || "Email"}
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    className={styles.fieldInput}
                    placeholder={dict.emailPlaceholder || "you@workshop.hu"}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-phone">
                    {dict.phoneLabel || "Phone"}
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    className={styles.fieldInput}
                    placeholder={dict.phonePlaceholder || "+36 …"}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-city">
                    {dict.cityLabel || "City"}
                  </label>
                  <input
                    id="partner-city"
                    type="text"
                    className={styles.fieldInput}
                    placeholder={dict.cityPlaceholder || "Budapest"}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="partner-address">
                    {dict.addressLabel || "Workshop address"}
                  </label>
                  <input
                    id="partner-address"
                    type="text"
                    className={styles.fieldInput}
                    placeholder={dict.addressPlaceholder || "Street, number, postal code"}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="partner-specialty">
                  {dict.specialtyLabel || "Repair specialty"}
                </label>
                <div className={styles.specialtyDropdown} ref={specialtyRef}>
                  <button
                    type="button"
                    id="partner-specialty"
                    className={`${styles.specialtyTrigger} ${specialtyError ? styles.specialtyTriggerError : ""}`}
                    aria-haspopup="listbox"
                    aria-expanded={specialtyOpen}
                    onClick={() => setSpecialtyOpen((prev) => !prev)}
                  >
                    <span className={selectedSpecialty ? styles.specialtyValue : styles.specialtyPlaceholderText}>
                      {selectedSpecialty
                        ? (dict.types?.[selectedSpecialty] || selectedSpecialty)
                        : (dict.specialtyPlaceholder || "Select specialty")}
                    </span>
                    <svg
                      className={`${styles.specialtyChevron} ${specialtyOpen ? styles.specialtyChevronOpen : ""}`}
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {specialtyOpen && (
                    <ul className={styles.specialtyOptions} role="listbox" aria-label={dict.specialtyLabel || "Repair specialty"}>
                      {WORKSHOP_TYPES.map((type) => (
                        <li
                          key={type}
                          role="option"
                          tabIndex={0}
                          aria-selected={selectedSpecialty === type}
                          className={`${styles.specialtyOption} ${selectedSpecialty === type ? styles.specialtyOptionActive : ""}`}
                          onClick={() => {
                            setSelectedSpecialty(type);
                            setSpecialtyOpen(false);
                            setSpecialtyError(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedSpecialty(type);
                              setSpecialtyOpen(false);
                              setSpecialtyError(false);
                            }
                          }}
                        >
                          <span>{dict.types?.[type] || type}</span>
                          {selectedSpecialty === type && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {specialtyError && (
                  <p className={styles.specialtyErrorText}>
                    {dict.errorSpecialty || "Please select a repair specialty."}
                  </p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="partner-notes">
                  {dict.notesLabel || "Anything we should know? (optional)"}
                </label>
                <textarea
                  id="partner-notes"
                  className={styles.fieldTextarea}
                  placeholder={dict.notesPlaceholder || "Certifications, opening hours, capacity…"}
                />
              </div>

              <div className={styles.formFooter}>
                <p className={styles.privacyNote}>
                  {dict.partnerApplyPrivacyNote || "We'll never share your details outside E-renty."}
                </p>
                <button type="submit" className={styles.submitBtn}>
                  {dict.partnerApplySubmit || "Submit application"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
