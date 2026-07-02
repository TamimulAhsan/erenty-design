"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./repair-partners.module.css";
import { WORKSHOPS, CITIES, WORKSHOP_TYPES, getInitialsBg } from "@/data/workshops";
import BookingForm from "@/components/BookingForm";

export default function RepairPartnersClient({ dict = {}, lang = "en" }) {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [activeWorkshop, setActiveWorkshop] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({});

  const typeRef = useRef(null);
  const closeModalBtnRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("modalOpen", !!activeWorkshop);

    if (activeWorkshop) {
      lastActiveElementRef.current = document.activeElement;
      setTimeout(() => {
        if (closeModalBtnRef.current) {
          closeModalBtnRef.current.focus();
        }
      }, 50);
    } else {
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    }

    return () => document.documentElement.classList.remove("modalOpen");
  }, [activeWorkshop]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveWorkshop(null);
        return;
      }

      if (e.key === "Tab" && activeWorkshop && modalRef.current) {
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
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWorkshop]);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedCity("All");
    setSelectedTypes([]);
    setSearchQuery("");
  };

  const getCityCount = (cityName) => {
    if (cityName === "All") return WORKSHOPS.length;
    return WORKSHOPS.filter((w) => w.location === cityName).length;
  };

  const filteredWorkshops = WORKSHOPS.filter((w) => {
    const matchesCity = selectedCity === "All" || w.location === selectedCity;
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(w.type);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      w.title.toLowerCase().includes(query) ||
      w.location.toLowerCase().includes(query) ||
      w.type.toLowerCase().includes(query);
    return matchesCity && matchesType && matchesSearch;
  }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY >= 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasActiveFilters = selectedCity !== "All" || selectedTypes.length > 0 || searchQuery !== "";

  const getCapacityText = (text) => {
    if (!text) return "";
    if (lang === "hu") {
      return text
        .replace("Accepts up to", "Maximum")
        .replace("repair appointment per hour", "javítási időpontot fogad óránként")
        .replace("repair appointments per hour", "javítási időpontot fogad óránként");
    }
    return text;
  };

  const formatHours = (hoursStr) => {
    if (!hoursStr) return "";
    if (lang === "hu") {
      return hoursStr
        .replace("Mon - Fri", "Hé - Pé")
        .replace("Sat", "Szo")
        .replace("Sun", "Vas")
        .replace("Emergency Dispatch", "Sürgősségi kiszállás");
    }
    return hoursStr.split(" | ")[0];
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTextContainer}>
          <span className={styles.heroPre}>{dict.heroPre || "Certified Repair Network"}</span>
          <h1 className={styles.heroTitle}>{dict.heroTitle || "Service & Repair Partners"}</h1>
          <p className={styles.heroSubtitle}>
            {dict.heroSubtitle || "Book standard repairs, battery diagnostics, or emergency mobile service with our certified partner workshops across the country."}
          </p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={`${styles.heroStatValue} mono-num`}>{filteredWorkshops.length}</span>
            <span className={styles.heroStatLabel}>{dict.statPartners || "Certified partners"}</span>
          </div>
          <div className={styles.heroStat}>
            <span className={`${styles.heroStatValue} mono-num`}>
              {new Set(filteredWorkshops.map(w => w.location)).size}
            </span>
            <span className={styles.heroStatLabel}>{dict.statCities || "Cities covered"}</span>
          </div>
          <div className={styles.heroStat}>
            <span className={`${styles.heroStatValue} mono-num`}>
              {new Set(filteredWorkshops.map(w => w.type)).size}
            </span>
            <span className={styles.heroStatLabel}>{dict.statSpecialties || "Specialties"}</span>
          </div>
        </div>
      </section>

      {/* 2. Sticky Filter Bar */}
      <div className={`${styles.stickyBarWrapper} ${isNavbarScrolled ? styles.scrolled : ""}`}>
        <div className={styles.stickyBar}>
          <div className={styles.cityTabs}>
            <button
              className={`${styles.tabBtn} ${selectedCity === "All" ? styles.tabBtnActive : ""}`}
              onClick={() => setSelectedCity("All")}
            >
              {dict.allCities || "All Cities"}
              <span className={styles.tabCount}>{getCityCount("All")}</span>
            </button>
            {CITIES.map((city) => (
              <button
                key={city.name}
                className={`${styles.tabBtn} ${selectedCity === city.name ? styles.tabBtnActive : ""}`}
                onClick={() => setSelectedCity(city.name)}
              >
                {city.name}
                <span className={styles.tabCount}>{getCityCount(city.name)}</span>
              </button>
            ))}
          </div>

          <div className={styles.controlsRight}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={dict.searchPlaceholder || "Search by name or city"}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsTypeDropdownOpen(false);
                }}
              />
            </div>

            <div ref={typeRef} className={styles.dropdownWrapper}>
              <button
                className={`${styles.dropdownTrigger} ${selectedTypes.length > 0 ? styles.activeTrigger : ""}`}
                onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
              >
                {dict.specialty || "Specialty"} {selectedTypes.length > 0 ? `(${selectedTypes.length})` : ""}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isTypeDropdownOpen && (
                <div className={styles.glassPopover}>
                  <div className={styles.popoverHeader}>{dict.filterBySpecialty || "Filter by Specialty"}</div>
                  <div className={styles.popoverList}>
                    {WORKSHOP_TYPES.map((type) => (
                      <label key={type} className={styles.popoverCheckboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span>{dict.types?.[type] || type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button className={styles.clearBtnClean} onClick={handleClearFilters}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span className={styles.clearBtnText}>{dict.reset || "Reset"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Partner Grid */}
      <section className={styles.gridSection}>
        <div className={styles.resultsSummary}>
          {filteredWorkshops.length} {filteredWorkshops.length === 1 ? (dict.partner || "partner") : (dict.partners || "partners")} {dict.found || "found"}
        </div>

        <div className={styles.partnerGrid}>
          {filteredWorkshops.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyStateTitle}>{dict.noPartnersFound || "No partners match this search"}</h3>
              <p className={styles.emptyStateDetail}>
                {dict.adjustFilters || "Try adjusting your city, specialty, or search filters."}
              </p>
              <button className={styles.emptyStateBtn} onClick={handleClearFilters}>
                {dict.resetFilters || "Reset filters"}
              </button>
            </div>
          ) : (
            filteredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                role="button"
                tabIndex={0}
                className={`${styles.partnerCard} ${workshop.featured ? styles.partnerFeaturedCard : ""}`}
                onClick={() => setActiveWorkshop(workshop)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveWorkshop(workshop);
                  }
                }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.avatar} style={{ background: getInitialsBg(workshop.type) }}>
                    <span className="mono-num">{workshop.initials}</span>
                  </div>
                  <div className={styles.cardTitleBlock}>
                    <div className={styles.cardTitleRow}>
                      <h3 className={styles.cardTitle}>{workshop.title}</h3>
                      {workshop.featured && <span className={styles.featuredBadge}>{dict.featured || "Featured"}</span>}
                    </div>
                    <div className={styles.cardMeta}>
                      <span>{dict.types?.[workshop.type] || workshop.type}</span>
                      <span className={styles.cardMetaDot}>·</span>
                      <span>{workshop.location}</span>
                    </div>
                  </div>
                </div>

                <p className={styles.cardDesc}>{workshop.description}</p>

                <div className={styles.tierChips}>
                  {workshop.tiers.map((tier) => (
                    <span key={tier} className={styles.tierChip}>
                      {lang === "hu" ? tier.replace("Tier", "szint") : tier}
                    </span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardHours}>
                    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    {formatHours(workshop.hours)}
                  </span>
                  <span className={styles.viewDetailsLink}>
                    {dict.viewDetails || "View details"}
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>
            <h2 className="h2">{dict.ridingCourierFleet || "Riding a Courier fleet?"}</h2>
            <p className="body-default">
              {dict.ridingCourierFleetDesc || "Courier+ subscribers get free repair coverage at every partner workshop on this page."}
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/courier-plus" className="btn-primary">
              {dict.exploreCourierPlus || "Explore Courier+"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
            <Link href="/contact" className="btn-secondary dark">
              {dict.contactUs || "Contact Us"}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Detail Modal */}
      {activeWorkshop && (
        <div className={styles.modalOverlay} onClick={() => setActiveWorkshop(null)}>
          <div
            className={styles.modalWrapper}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeModalBtnRef}
              className={styles.closeModalBtn}
              onClick={() => setActiveWorkshop(null)}
              aria-label="Close details"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.modalLeft}>
              <div className={styles.modalAvatar} style={{ background: getInitialsBg(activeWorkshop.type) }}>
                <span className="mono-num">{activeWorkshop.initials}</span>
              </div>

              <div>
                <div className={styles.modalBadgeRow}>
                  <span className={styles.modalTypeBadge}>{dict.types?.[activeWorkshop.type] || activeWorkshop.type}</span>
                  {activeWorkshop.featured && <span className={styles.featuredBadge}>{dict.featured || "Featured"}</span>}
                </div>
                <h2 id="modal-title" className={styles.modalTitle}>{activeWorkshop.title}</h2>
              </div>

              <div className={styles.modalContactList}>
                <div className={styles.detailRow}>
                  <svg aria-hidden="true" className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <span className={styles.detailText}>{activeWorkshop.address}</span>
                    <Link
                      href={`https://maps.google.com/?q=${encodeURIComponent(activeWorkshop.address)}`}
                      target="_blank"
                      className={styles.mapLink}
                    >
                      {dict.viewOnMap || "View on Map ↗"}
                    </Link>
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <svg aria-hidden="true" className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <a href={`tel:${activeWorkshop.phone}`} className={styles.detailText}>{activeWorkshop.phone}</a>
                </div>
                <div className={styles.detailRow}>
                  <svg aria-hidden="true" className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <a href={`mailto:${activeWorkshop.email}`} className={styles.detailText}>{activeWorkshop.email}</a>
                </div>
              </div>

              <div className={styles.modalTiers}>
                <h5 className={`${styles.blockTitle} eyebrow`}>{dict.repairTiersCovered || "Repair tiers covered"}</h5>
                <div className={styles.tierChips}>
                  {activeWorkshop.tiers.map((tier) => (
                    <span key={tier} className={styles.tierChip}>
                      {lang === "hu" ? tier.replace("Tier", "szint") : tier}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalRight}>
              <p className={styles.workshopDesc}>{activeWorkshop.description}</p>

              <div className={styles.coverageBlock}>
                <h5 className={styles.coverageTitle}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {dict.freeRepairCoverage || "Free repair coverage"}
                </h5>
                <div className={styles.coverageGrid}>
                  {activeWorkshop.freeCoverage?.map((cov, idx) => (
                    <div key={idx} className={styles.coverageRow}>
                      <span className={styles.coverageType}>{dict.types?.[cov.type] || cov.type}</span>
                      <span className={styles.coverageTiers}>
                        {cov.tiers.map(t => lang === "hu" ? t.replace("Tier", "szint") : t).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className={`${styles.blockTitle} eyebrow`}>{dict.businessHours || "Business Hours"}</h5>
                <div className={styles.hoursTable}>
                  {activeWorkshop.businessHours?.map((bh, idx) => (
                    <div key={idx} className={`${styles.hourRow} ${bh.hours === "Closed" ? styles.hourClosed : ""}`}>
                      <span className={styles.hourDay}>{dict.days?.[bh.day] || bh.day}</span>
                      <span>{bh.hours === "Closed" ? (dict.days?.Closed || "Closed") : bh.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeWorkshop.capacity && (
                <p className={styles.capacityText}>{getCapacityText(activeWorkshop.capacity)}</p>
              )}

              <BookingForm
                workshop={activeWorkshop}
                booking={bookingStatus[activeWorkshop.id]}
                onBookingSuccess={(bookingData) => {
                  setBookingStatus((prev) => ({
                    ...prev,
                    [activeWorkshop.id]: bookingData
                  }));
                }}
                onResetBooking={() => {
                  setBookingStatus((prev) => ({
                    ...prev,
                    [activeWorkshop.id]: null
                  }));
                }}
                dict={dict}
                lang={lang}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
