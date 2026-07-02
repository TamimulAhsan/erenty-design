"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./LocationsWorkshops.module.css";
import { WORKSHOPS, CITIES, CITY_COORDINATES, getInitialsBg } from "@/data/workshops";
import BookingForm from "@/components/BookingForm";

export default function LocationsWorkshops({ dict }) {
  const [selectedCity, setSelectedCity] = useState("Budapest");
  const [hoveredCity, setHoveredCity] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const sectionRef = useRef(null);
  const dropdownRef = useRef(null);
  const closeDrawerBtnRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isDrawerOpen && isSectionInView && isMobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    if (isDrawerOpen) {
      lastActiveElementRef.current = document.activeElement;
      setTimeout(() => {
        if (closeDrawerBtnRef.current) {
          closeDrawerBtnRef.current.focus();
        }
      }, 50);
    } else {
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen, isSectionInView]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setIsDrawerOpen(true);
    setExpandedCard(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setExpandedCard(null);
  };

  const toggleExpandCard = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const filteredWorkshops = WORKSHOPS.filter((workshop) => {
    const matchesCity = workshop.location === selectedCity;
    const matchesPriority =
      filterPriority === "All" ||
      (filterPriority === "Priority" && workshop.featured) ||
      (filterPriority === "Standard" && !workshop.featured);
    return matchesCity && matchesPriority;
  });

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.animated : ""}`}
      id="workshops"
      ref={sectionRef}
    >
      <div className={styles.stickyContainer}>
        <div className={styles.container}>

          <div className={styles.heroContainer}>
          {/* ========================================================================= */}
          {/* TOP 80%: THE HERO MAP */}
          {/* ========================================================================= */}
          <div className={styles.mapHero}>
            {/* Top Floating Selector Panel for clear UX direction */}
            <div className={styles.topSelectorPanel}>
              <span className={styles.selectorLabel}>{dict.selectorLabel}</span>
              <div className={styles.customSelectWrapper} ref={dropdownRef}>
                <button
                  className={styles.dropdownToggleBtn}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  type="button"
                >
                  <span>
                    {selectedCity} ({CITIES.find(c => c.name === selectedCity)?.count} {CITIES.find(c => c.name === selectedCity)?.count === 1 ? dict.workshopSingular : dict.workshopPlural})
                  </span>
                  <svg className={`${styles.selectChevron} ${isDropdownOpen ? styles.chevronRotated : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {CITIES.map((c) => (
                      <div
                        key={c.name}
                        className={`${styles.dropdownOption} ${c.name === selectedCity ? styles.dropdownOptionActive : ''}`}
                        onClick={() => {
                          handleCitySelect(c.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className={styles.optionCityName}>{c.name}</span>
                        <span className={styles.optionCount}>
                          {c.count} {c.count === 1 ? dict.workshopSingular : dict.workshopPlural}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <svg
              viewBox="0 0 800 420"
              className={styles.mapSvg}
              preserveAspectRatio="xMidYMid meet"
            >

              {/* 3D Depth Extrusion Layer */}
              <path
                d="M 0.0 247.4 L 40.8 157.5 L 17.0 127.2 L 86.2 126.9 L 95.6 69.9 L 158.1 105.6 L 203.4 120.9 L 306.6 103.7 L 316.5 75.7 L 365.3 71.6 L 425.2 49.9 L 438.5 58.8 L 496.2 41.4 L 525.0 8.5 L 565.3 0.0 L 697.0 42.4 L 723.2 28.2 L 791.4 66.1 L 800.0 103.6 L 724.9 132.9 L 666.8 227.6 L 592.4 322.3 L 493.9 348.6 L 417.2 342.4 L 323.0 379.1 L 277.0 400.0 L 175.5 373.1 L 83.6 313.3 L 44.6 296.1 L 20.7 248.9 Z"
                fill="var(--brand-dark)"
                className={styles.map3DLayer}
              />

              {/* Blended Map Path */}
              <path
                d="M 0.0 247.4 L 40.8 157.5 L 17.0 127.2 L 86.2 126.9 L 95.6 69.9 L 158.1 105.6 L 203.4 120.9 L 306.6 103.7 L 316.5 75.7 L 365.3 71.6 L 425.2 49.9 L 438.5 58.8 L 496.2 41.4 L 525.0 8.5 L 565.3 0.0 L 697.0 42.4 L 723.2 28.2 L 791.4 66.1 L 800.0 103.6 L 724.9 132.9 L 666.8 227.6 L 592.4 322.3 L 493.9 348.6 L 417.2 342.4 L 323.0 379.1 L 277.0 400.0 L 175.5 373.1 L 83.6 313.3 L 44.6 296.1 L 20.7 248.9 Z"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.mapPath}
              />

              {/* Active Connection Line (To Drawer) */}
              {isDrawerOpen && isSectionInView && selectedCity && CITY_COORDINATES[selectedCity] && (
                <line
                  x1={CITY_COORDINATES[selectedCity].x}
                  y1={CITY_COORDINATES[selectedCity].y}
                  x2="800" /* Screen right edge to connect to drawer */
                  y2={CITY_COORDINATES[selectedCity].y}
                  className={styles.connectionLine}
                />
              )}

              {/* Map Circle Markers */}
              {CITIES.map((city, index) => {
                const coord = CITY_COORDINATES[city.name];
                const isActive = selectedCity === city.name;
                const isHovered = hoveredCity === city.name;
                const radius = city.count > 1 ? 14 : 9;

                return (
                  <g
                    key={city.name}
                    transform={`translate(${coord.x}, ${coord.y}) scale(${radius / 10})`}
                    onClick={() => handleCitySelect(city.name)}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <g
                      className={`${styles.markerGroup} ${isActive ? styles.markerActive : ""} ${isHovered ? styles.markerHovered : ""}`}
                      style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                    >
                      {/* Hover Tooltip */}
                      {(isHovered || city.name === "Budapest") && (
                        <g className={styles.pinTooltip} transform={`translate(0, -36) scale(${10 / radius})`}>
                          <rect x="-40" y="-20" width="80" height="18" rx="4" fill="var(--brand-dark)" opacity="0.9" />
                          <text x="0" y="-7" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="600">
                            {city.name}
                          </text>
                        </g>
                      )}

                      {/* Teardrop Pin Shape */}
                      <path
                        d="M0,0 C-7.5,-7.5 -12,-12 -12,-18 C-12,-24.627 -6.627,-30 0,-30 C6.627,-30 12,-24.627 12,-18 C12,-12 7.5,-7.5 0,0 Z"
                        className={styles.pinShape}
                      />

                      {/* Number inside or Dot */}
                      {city.count > 1 ? (
                        <text
                           x="0"
                           y="-14"
                           textAnchor="middle"
                           className={styles.markerText}
                        >
                          {city.count}
                        </text>
                      ) : (
                        <circle cx="0" cy="-18" r="4" className={styles.pinDot} />
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM 20%: MINIMAL TEXT FOOTER */}
          {/* ========================================================================= */}
          <div className={styles.heroFooter}>
            <div className={styles.footerText}>
              <h2 className={`${styles.headline} h2`}>{dict.headline}</h2>
              <p className={`${styles.subline} body-sm`}>
                {dict.subline}
              </p>
            </div>
            <div className={styles.footerActions}>
              <Link href="/courier-plus" className="btn-primary">
                {dict.courierPlus}
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
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
              <Link href="/repair-partners" className="btn-outline">
                {dict.bookService}
              </Link>
            </div>
          </div>

        </div>
      </div>
      </div>

      <button
        className={`${styles.drawerTab} ${(isSectionInView && !isDrawerOpen) ? styles.drawerTabVisible : ""}`}
        onClick={() => setIsDrawerOpen(true)}
        aria-label={dict.openDirectory}
      >
        <span className={styles.drawerTabChevron}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
        <span className={styles.drawerTabText}>{dict.drawerTabText}</span>
      </button>

      <div
        className={`${styles.drawerBackdrop} ${(isDrawerOpen && isSectionInView) ? styles.backdropVisible : ""}`}
        onClick={closeDrawer}
      />

      <div
        className={`${styles.drawer} ${(isDrawerOpen && isSectionInView) ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >

        <div className={styles.drawerHeader}>
          <button
            ref={closeDrawerBtnRef}
            className={styles.backBtn}
            onClick={closeDrawer}
            aria-label={dict.closeDirectory}
          >
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className={styles.drawerHeaderMeta}>
            <span className={`${styles.drawerEyebrow} eyebrow`}>{dict.serviceHub}</span>
            <h3 id="drawer-title" className={`${styles.drawerTitle} h3`}>{selectedCity}</h3>
            <p className={styles.drawerSubtitle}>
              <span className="mono-num">{filteredWorkshops.length}</span> {dict.certifiedRepair}{filteredWorkshops.length === 1 ? dict.partnerSingular : dict.partnerPlural} {dict.found}
            </p>
          </div>
        </div>

        <div className={styles.drawerContent}>

          <div className={styles.drawerFilters}>
            <button onClick={() => setFilterPriority("All")} className={`${styles.drawerToggleBtn} ${filterPriority === "All" ? styles.drawerToggleBtnActive : ""}`}>
              {dict.filterAll}
            </button>
            <button onClick={() => setFilterPriority("Priority")} className={`${styles.drawerToggleBtn} ${filterPriority === "Priority" ? styles.drawerToggleBtnActive : ""}`}>
              {dict.filterPriority}
            </button>
            <button onClick={() => setFilterPriority("Standard")} className={`${styles.drawerToggleBtn} ${filterPriority === "Standard" ? styles.drawerToggleBtnActive : ""}`}>
              {dict.filterStandard}
            </button>
          </div>

          <div className={styles.drawerWorkshopsList}>
            {filteredWorkshops.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{dict.emptyState}</p>
              </div>
            ) : (
              filteredWorkshops.map((workshop) => {
                const isExpanded = expandedCard === workshop.id;
                const booking = bookingStatus[workshop.id];

                return (
                  <div key={workshop.id} className={`${styles.drawerCard} ${workshop.featured ? styles.drawerFeaturedCard : ""} ${isExpanded ? styles.drawerCardExpanded : ""}`}>
                    <div
                      className={styles.drawerCardHeader}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpandCard(workshop.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpandCard(workshop.id);
                        }
                      }}
                    >
                      <div className={styles.initialsAvatar} style={{ background: getInitialsBg(workshop.type) }}>
                        <span className="mono-num">{workshop.initials}</span>
                      </div>

                      <div className={styles.drawerCardMeta}>
                        <div className={styles.drawerTitleRow}>
                          <h4 className={styles.drawerWorkshopTitle}>{workshop.title}</h4>
                          {workshop.featured && <span className={styles.featuredBadge}>{dict.featured}</span>}
                        </div>
                        <p className={styles.drawerWorkshopSubtitle}>{workshop.type}</p>
                      </div>

                      <div className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    <div className={`${styles.drawerCardBody} ${isExpanded ? styles.drawerCardBodyOpen : ""}`}>
                      <div className={styles.drawerCardBodyInner}>

                        <p className={styles.workshopDesc}>{workshop.description}</p>

                        {/* Free Repair Coverage */}
                        <div className={styles.coverageBlock}>
                          <h5 className={styles.coverageTitle}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            {dict.freeCoverage}
                          </h5>
                          <div className={styles.coverageGrid}>
                            {workshop.freeCoverage?.map((cov, idx) => (
                              <div key={idx} className={styles.coverageRow}>
                                <span className={styles.coverageType}>{cov.type}</span>
                                <span className={styles.coverageTiers}>{cov.tiers.join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Hours & Location Split */}
                        <div className={styles.infoSplit}>
                          <div className={styles.hoursBlock}>
                            <h5 className={`${styles.blockTitle} eyebrow`}>{dict.businessHours}</h5>
                            {workshop.businessHours ? (
                              <div className={styles.hoursTable}>
                                {workshop.businessHours.map((bh, idx) => (
                                  <div key={idx} className={`${styles.hourRow} ${bh.hours === 'Closed' ? styles.hourClosed : ''}`}>
                                    <span className={styles.hourDay}>{bh.day}</span>
                                    <span className={styles.hourTime}>{bh.hours}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={styles.fallbackHours}>{workshop.hours}</p>
                            )}
                          </div>

                           <div className={styles.contactBlock}>
                            <h5 className={`${styles.blockTitle} eyebrow`}>{dict.contact}</h5>
                            <div className={styles.detailRow}>
                              <svg className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                <span className={styles.detailText}>{workshop.address}</span>
                                <Link href={`https://maps.google.com/?q=${encodeURIComponent(workshop.address)}`} target="_blank" className={styles.mapLink}>
                                  {dict.viewOnMap}
                                </Link>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <svg aria-hidden="true" className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                              <a href={`tel:${workshop.phone}`} className={styles.detailText}>{workshop.phone}</a>
                            </div>
                            <div className={styles.detailRow}>
                              <svg aria-hidden="true" className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                              <a href={`mailto:${workshop.email}`} className={styles.detailText}>{workshop.email}</a>
                            </div>
                          </div>
                        </div>

                        {workshop.capacity && (
                          <p className={styles.capacityText}>{workshop.capacity}</p>
                        )}

                        <BookingForm
                          workshop={workshop}
                          booking={booking}
                          onBookingSuccess={(bookingData) => {
                            setBookingStatus((prev) => ({
                              ...prev,
                              [workshop.id]: bookingData
                            }));
                          }}
                          onResetBooking={() => {
                            setBookingStatus((prev) => ({
                              ...prev,
                              [workshop.id]: null
                            }));
                          }}
                        />

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
