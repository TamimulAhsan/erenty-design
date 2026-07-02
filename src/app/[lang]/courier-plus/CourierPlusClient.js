"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./courier-plus.module.css";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Reliable coverage for everyday wear and tear.",
    price: 9990,
    featured: false,
    maintenanceScope: "Wear & tear parts repairs (brakes, tyres, etc.)",
    features: [
      "GPS tracking",
      "Theft insurance",
      "1 service point",
      "0–24 online support",
    ],
    cta: "Choose Basic",
  },
  {
    id: "extra",
    name: "Extra",
    tagline: "A stronger package for riders who want broader repairs and faster support.",
    price: 16990,
    featured: true,
    maintenanceScope: "Basic + electrical system repairs",
    features: [
      "GPS tracking",
      "Theft insurance",
      "0–24 online support",
      "Phone support (9:00–18:00)",
      "Service points across Hungary",
    ],
    cta: "Choose Extra",
  },
  {
    id: "max",
    name: "Max",
    tagline: "Maximum protection for couriers who need the least possible downtime.",
    price: 24990,
    featured: false,
    maintenanceScope: "Extra + puncture & flat tyre repair + replacement vehicle",
    features: [
      "GPS tracking",
      "Theft insurance",
      "0–24 online support",
      "Phone support (9:00–18:00)",
      "Priority / express repair",
      "Replacement vehicle",
      "Service points across Hungary",
    ],
    cta: "Choose Max",
  },
];

const COMPARISON_ROWS = [
  { label: "GPS tracking", basic: true, extra: true, max: true },
  { label: "Theft insurance", basic: true, extra: true, max: true },
  { label: "Service points", basic: "1", extra: "Across Hungary", max: "Across Hungary" },
  { label: "0–24 online support", basic: true, extra: true, max: true },
  { label: "Phone support (9:00–18:00)", basic: false, extra: true, max: true },
  { label: "Priority / express repair", basic: false, extra: false, max: true },
  { label: "Replacement vehicle", basic: false, extra: false, max: true },
];

export default function CourierPlusClient({ dict = {}, lang = "en" }) {
  const tableWrapperRef = useRef(null);
  const plansScrollRef = useRef(null);
  const valueStripRef = useRef(null);
  const [tableScrollShadow, setTableScrollShadow] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(1);
  const [valueStripVisible, setValueStripVisible] = useState(false);
  const isAnnual = false;

  const handleTableScroll = () => {
    if (tableWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableWrapperRef.current;
      setTableScrollShadow(scrollWidth - scrollLeft - clientWidth > 5);
    }
  };

  const handlePlansScroll = () => {
    if (plansScrollRef.current) {
      const container = plansScrollRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const cards = container.children;
      let minDistance = Infinity;
      let activeIndex = 0;

      // Iterate through card elements to find the one closest to the container center
      for (let i = 0; i < PLANS.length; i++) {
        const card = cards[i];
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            activeIndex = i;
          }
        }
      }
      setActivePlanIndex(activeIndex);
    }
  };

  const handleIndicatorClick = (index) => {
    setActivePlanIndex(index);
    if (plansScrollRef.current) {
      const container = plansScrollRef.current;
      const cards = container.children;
      if (cards && cards[index]) {
        const card = cards[index];
        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;
        const cardLeft = card.offsetLeft;
        container.scrollTo({
          left: cardLeft - (containerWidth - cardWidth) / 2,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    const el = tableWrapperRef.current;
    if (el) {
      handleTableScroll();
      el.addEventListener("scroll", handleTableScroll);
    }

    // Smooth scroll to center the middle card ("Extra") on mobile viewport mount
    if (plansScrollRef.current && window.innerWidth <= 768) {
      const container = plansScrollRef.current;
      const cards = container.children;
      if (cards && cards[1]) {
        const card = cards[1];
        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;
        const cardLeft = card.offsetLeft;
        container.scrollLeft = cardLeft - (containerWidth - cardWidth) / 2;
      }
    }

    const valueStripEl = valueStripRef.current;
    let valueObserver;
    if (valueStripEl) {
      valueObserver = new IntersectionObserver(
        ([entry]) => {
          setValueStripVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      valueObserver.observe(valueStripEl);
    }

    return () => {
      if (el) el.removeEventListener("scroll", handleTableScroll);
      if (valueObserver) valueObserver.disconnect();
    };
  }, []);

  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getPlanMonthlyPrice = (plan) => {
    return isAnnual ? Math.round((plan.price * 10) / 12) : plan.price;
  };

  const getPlanYearlySavings = (plan) => {
    return plan.price * 2;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* A. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.dotOverlay} />
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroPre}>{dict.heroPre || "Courier+ Subscription"}</span>
            <h1 className={`${styles.heroTitle} hero-display`}>{dict.heroTitle || "Courier+ for your fleet."}</h1>
            <p className={`${styles.heroSubtitle} body-lg`}>
              {dict.heroSubtitle || "Built for owner couriers riding their own E-Bikes. One fixed monthly fee covers maintenance, GPS tracking and theft insurance."}
            </p>
            <div className={styles.heroActions}>
              <a href="#plans-section" className="btn-primary">
                {dict.ctaSeePlans || "See Plans ↓"}
              </a>
              <Link href="/contact" className="btn-secondary dark">
                {dict.ctaContactSales || "Contact Sales"}
              </Link>
            </div>
          </div>

          {/* Interactive Mockup Dashboard Card */}
          <div className={styles.dashboardMockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupDot} />
              <span className={styles.mockupTitle}>{dict.liveTrack || "E-Renty Live Track"}</span>
              <span className={styles.mockupStatus}>{dict.active || "Active"}</span>
            </div>
            <div className={styles.mockupBody}>
              {/* Map/GPS widget */}
              <div className={styles.mapWidget}>
                <div className={styles.gridLines} />
                <svg className={styles.mapSvg} viewBox="0 0 200 120">
                  <path d="M20,100 C60,80 80,40 120,60 C160,80 180,20 190,10" fill="none" stroke="rgba(0, 216, 164, 0.15)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M20,100 C60,80 80,40 120,60" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" className={styles.pulsePath} />
                  <circle cx="120" cy="60" r="5" fill="#00D8A4" className={styles.mapPin} />
                  <circle cx="120" cy="60" r="12" fill="none" stroke="#00D8A4" strokeWidth="1" className={styles.mapPing} />
                </svg>
                <div className={styles.mapLabel}>{dict.budapestCenter || "Budapest Center"}</div>
              </div>

              {/* Status details */}
              <div className={styles.statusGrid}>
                <div className={styles.statusItem}>
                  <span className={styles.statusIcon}>⚡</span>
                  <div className={styles.statusInfo}>
                    <span className={styles.statusVal}>92%</span>
                    <span className={styles.statusLabel}>{dict.battery || "Battery (84 km)"}</span>
                  </div>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusIcon}>🛡️</span>
                  <div className={styles.statusInfo}>
                    <span className={styles.statusVal}>{dict.covered || "Covered"}</span>
                    <span className={styles.statusLabel}>{dict.theftInsurance || "Theft Insurance"}</span>
                  </div>
                </div>
              </div>

              <div className={styles.mockupFooter}>
                <span className={styles.mockupPlanName}>Courier+ Max</span>
                <span className={styles.mockupPlanSec}>{dict.onlineSecurity || "Online Security"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A2. Bleeding Stats Strip */}
      <div className={styles.heroStatsStrip}>
        <div className={styles.heroStatsContainer}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatNum}>3</span>
            <span className={styles.heroStatLabel}>{dict.statPlans || "Plans"}</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatNum}>&lt;24h</span>
            <span className={styles.heroStatLabel}>{dict.statMaintenance || "Maintenance Response"}</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatNum}>100%</span>
            <span className={styles.heroStatLabel}>{dict.statVat || "VAT Reclaimable"}</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatNum}>{lang === "hu" ? "Országos" : "Nationwide"}</span>
            <span className={styles.heroStatLabel}>{dict.statNetwork || "Service Network"}</span>
          </div>
        </div>
      </div>

      {/* B. Merged Value Propositions Strip */}
      <section
        ref={valueStripRef}
        className={`${styles.valueStrip} ${valueStripVisible ? styles.animated : ""}`}
      >
        <div className={styles.valueContainer}>
          <div className={styles.benefitGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.iconTile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" />
                  <line x1="12" y1="6" x2="12" y2="18" />
                </svg>
              </div>
              <h3 className={`${styles.benefitTitle} h3`}>{dict.benefitFixedCost || "Fixed monthly cost"}</h3>
              <p className={`${styles.benefitDesc} body-default`}>
                {dict.benefitFixedCostDesc || "Predictable maintenance instead of random repair bills."}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.iconTile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className={`${styles.benefitTitle} h3`}>{dict.benefitDowntime || "Minimal downtime"}</h3>
              <p className={`${styles.benefitDesc} body-default`}>
                {dict.benefitDowntimeDesc || "<24h maintenance turnaround keeps you earning on the street."}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.iconTile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 11 11 13 15 9" />
                </svg>
              </div>
              <h3 className={`${styles.benefitTitle} h3`}>{dict.benefitInsurance || "Theft insurance & GPS"}</h3>
              <p className={`${styles.benefitDesc} body-default`}>
                {dict.benefitInsuranceDesc || "Your work bike is tracked and fully covered against theft, 24/7."}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.iconTile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.25 10 12 10 12s10-6.75 10-12A10 10 0 0 0 12 2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className={`${styles.benefitTitle} h3`}>{dict.benefitNetwork || "Nationwide network"}</h3>
              <p className={`${styles.benefitDesc} body-default`}>
                {dict.benefitNetworkDesc || "Partners across all of Hungary, no matter where you deliver."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* C. Plans Section */}
      <section id="plans-section" className={styles.plansSection}>
        <div className={styles.plansContainer}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionEyebrow} eyebrow`}>{dict.pricingPlans || "Pricing Plans"}</span>
            <h2 className={`${styles.sectionTitle} h2`}>{dict.chooseLevel || "Choose the level of support your work bike needs"}</h2>
            <p className={`${styles.sectionSubtext} body-lg`}>
              {dict.allPlansMade || "All plans are made for couriers riding their own E-Bikes."}
            </p>
          </div>

          <div className={styles.discountBanner}>
            <div className={styles.bannerIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className={`${styles.bannerText} body-sm`}>
              {dict.discountBanner || "Discounted rates apply when: 20+ bikes covered · 2-year contract · Annual payment"}
            </div>
          </div>

          <div
            ref={plansScrollRef}
            onScroll={handlePlansScroll}
            className={styles.plansGrid}
          >
            {PLANS.map((plan, idx) => {
              const localizedPlanName = dict.plans?.[plan.id]?.name || plan.name;
              const localizedTagline = dict.plans?.[plan.id]?.tagline || plan.tagline;
              const localizedScope = dict.plans?.[plan.id]?.maintenanceScope || plan.maintenanceScope;
              const localizedFeatures = dict.plans?.[plan.id]?.features || plan.features;
              const localizedCTA = dict.plans?.[plan.id]?.cta || plan.cta;

              return (
                <div
                  key={plan.id}
                  className={`${styles.planCard} ${plan.featured ? styles.featuredCard : ""} ${
                    activePlanIndex === idx ? styles.activeCard : ""
                  }`}
                >
                  {plan.featured && (
                    <span className={styles.featuredBadge}>{dict.mostPopular || "Most popular"}</span>
                  )}
                  <div className={styles.planCardHeader}>
                    <h3 className={`${styles.planName} h3`}>{localizedPlanName}</h3>
                    <p className={`${styles.planTagline} body-sm`}>{localizedTagline}</p>
                  </div>

                  <div className={styles.priceWrapper}>
                    <span className={styles.priceVal}>{formatPrice(getPlanMonthlyPrice(plan))}</span>
                    <span className={styles.priceCurrency}>{dict.huf || "HUF"}</span>
                    <span className={styles.pricePeriod}>{dict.perMonth || "/ month"}</span>
                  </div>

                  {isAnnual && (
                    <span className={styles.annualSavingsBadge}>
                      Save {formatPrice(getPlanYearlySavings(plan))} Ft / year
                    </span>
                  )}

                  <div className={styles.scopeWrapper}>
                    <span className={styles.scopeTitle}>{dict.maintenanceScopeLabel || "Maintenance Scope"}</span>
                    <p className={styles.scopeValue}>{localizedScope}</p>
                  </div>

                  <div className={styles.cardDivider} />

                  <div className={styles.featureList}>
                    {localizedFeatures.map((feature, idx) => (
                      <div key={idx} className={styles.featureItem}>
                        <span className={styles.featureIcon}>
                          <span className={styles.includedIcon}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        </span>
                        <span className={`${styles.featureLabel} body-sm`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/checkout/courier?plan=${plan.id}&billing=${isAnnual ? "yearly" : "monthly"}`}
                    className={`${plan.featured ? "btn-primary" : "btn-secondary"} ${styles.cardCTA}`}
                  >
                    {localizedCTA}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.plansIndicatorWrapper}>
            {PLANS.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.indicatorDot} ${
                  activePlanIndex === idx ? styles.indicatorActive : ""
                }`}
                onClick={() => handleIndicatorClick(idx)}
                aria-label={`Go to plan ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* D. Comparison Table */}
      <section className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <h2 className={`${styles.tableTitle} h2`}>{dict.compareInDetail || "Compare in detail"}</h2>

          <div
            ref={tableWrapperRef}
            className={`${styles.tableWrapper} ${tableScrollShadow ? styles.tableScrollShadow : ""}`}
          >
            <table className={styles.comparisonTable}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.featureHeaderCell}>{dict.featureColumn || "Feature"}</th>
                  <th className={styles.planHeaderCell}>{dict.plans?.basic?.name || "Basic"}</th>
                  <th className={`${styles.planHeaderCell} ${styles.featuredHeaderCell}`}>
                    {dict.plans?.extra?.name || "Extra"}
                    <span className={styles.featuredHeaderBadge}>{dict.mostPopular || "Most Popular"}</span>
                  </th>
                  <th className={styles.planHeaderCell}>{dict.plans?.max?.name || "Max"}</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.bodyRow}>
                  <td className={styles.featureCellLabel}>
                    {dict.comparisonLabels?.["Monthly / bike"] || (lang === "hu" ? "Havi díj / kerékpár" : "Monthly / bike")}
                  </td>
                  <td className={styles.valueCell}>
                    <span className={styles.tablePriceVal}>
                      {formatPrice(isAnnual ? Math.round((9990 * 10) / 12) : 9990)}
                    </span>
                    <span className={styles.tablePricePeriod}> {dict.perMoPerBike || "Ft / mo"}</span>
                  </td>
                  <td className={`${styles.valueCell} ${styles.featuredColCell}`}>
                    <span className={styles.tablePriceVal}>
                      {formatPrice(isAnnual ? Math.round((16990 * 10) / 12) : 16990)}
                    </span>
                    <span className={styles.tablePricePeriod}> {dict.perMoPerBike || "Ft / mo"}</span>
                  </td>
                  <td className={styles.valueCell}>
                    <span className={styles.tablePriceVal}>
                      {formatPrice(isAnnual ? Math.round((24990 * 10) / 12) : 24990)}
                    </span>
                    <span className={styles.tablePricePeriod}> {dict.perMoPerBike || "Ft / mo"}</span>
                  </td>
                </tr>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className={styles.bodyRow}>
                    <td className={styles.featureCellLabel}>{dict.comparisonLabels?.[row.label] || row.label}</td>
                    
                    {/* Basic */}
                    <td className={styles.valueCell}>
                      {typeof row.basic === "string" ? (
                        <span className={styles.cellText}>{dict.comparisonValues?.[row.basic] || row.basic}</span>
                      ) : row.basic ? (
                        <span className={styles.tableCheckIcon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      ) : (
                        <span className={styles.tableDashIcon}>—</span>
                      )}
                    </td>

                    {/* Extra */}
                    <td className={`${styles.valueCell} ${styles.featuredColCell}`}>
                      {typeof row.extra === "string" ? (
                        <span className={styles.cellText}>{dict.comparisonValues?.[row.extra] || row.extra}</span>
                      ) : row.extra ? (
                        <span className={styles.tableCheckIcon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      ) : (
                        <span className={styles.tableDashIcon}>—</span>
                      )}
                    </td>

                    {/* Max */}
                    <td className={styles.valueCell}>
                      {typeof row.max === "string" ? (
                        <span className={styles.cellText}>{dict.comparisonValues?.[row.max] || row.max}</span>
                      ) : row.max ? (
                        <span className={styles.tableCheckIcon}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      ) : (
                        <span className={styles.tableDashIcon}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* CTA Action Row at Bottom of Comparison Table */}
                <tr className={styles.tableCtaRow}>
                  <td className={styles.featureCellLabel}></td>
                  <td className={styles.valueCell}>
                    <Link
                      href={`/checkout/courier?plan=basic&billing=${isAnnual ? "yearly" : "monthly"}`}
                      className="btn-secondary btn-sm"
                      style={{ width: "90%", padding: "10px" }}
                    >
                      {dict.plans?.basic?.cta || "Choose Basic"}
                    </Link>
                  </td>
                  <td className={`${styles.valueCell} ${styles.featuredColCell}`}>
                    <Link
                      href={`/checkout/courier?plan=extra&billing=${isAnnual ? "yearly" : "monthly"}`}
                      className="btn-primary btn-sm"
                      style={{ width: "90%", padding: "10px" }}
                    >
                      {dict.plans?.extra?.cta || "Choose Extra"}
                    </Link>
                  </td>
                  <td className={styles.valueCell}>
                    <Link
                      href={`/checkout/courier?plan=max&billing=${isAnnual ? "yearly" : "monthly"}`}
                      className="btn-secondary btn-sm"
                      style={{ width: "90%", padding: "10px" }}
                    >
                      {dict.plans?.max?.cta || "Choose Max"}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* E. Business / Fleet Section */}
      <section className={styles.businessSection}>
        <div className={styles.businessContainer}>
          <div className={styles.businessCard}>
            <div className={styles.businessContent}>
              <span className={`${styles.businessEyebrow} eyebrow`}>{dict.businessPre || "Business · 20+ bikes"}</span>
              <h2 className={`${styles.businessTitle} h2`}>{dict.businessTitle || "Manage your whole fleet from one dashboard."}</h2>
              <p className={`${styles.businessBody} body-lg`}>
                {dict.businessDesc || "Volume pricing kicks in automatically. Plus: master invoicing, employee provisioning, and a dedicated account manager."}
              </p>
              <Link href="/contact?type=business" className="btn-primary">
                {dict.businessCta || "Request a custom quote →"}
              </Link>
            </div>

            <div className={styles.businessStatsWrapper}>
              <div className={styles.statsBlock}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>22%</span>
                  <span className={styles.statLabel}>{dict.businessStatDiscount || "Volume discount up to"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>{lang === "hu" ? "Havi" : "Monthly"}</span>
                  <span className={styles.statLabel}>{dict.businessStatInvoicing || "Master invoicing"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>&lt; 4h</span>
                  <span className={styles.statLabel}>{dict.businessStatSLA || "SLA response"}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>50+</span>
                  <span className={styles.statLabel}>{dict.businessStatAM || "Dedicated AM (50+ bk)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
