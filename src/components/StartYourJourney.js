"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import CountUp from "./CountUp";
import { BIKE_MORPH_TAKEOFF } from "./BikeMorph";
import styles from "./StartYourJourney.module.css";

const FLEET_CATEGORIES = [
  {
    id: "c29",
    name: "DUOTTS C29 Pro",
    category: "Urban Fleet",
    image: "/images/c29_pro.png",
    specs: "Range: 100 km | Speed: 50 km/h",
  },
  {
    id: "cargo",
    name: "VOK S",
    category: "Cargo Fleet",
    image: "/images/S.png",
    specs: "Range: 100 km | Speed: 25 km/h",
  },
  {
    id: "courier",
    name: "ELEGLIDE M2",
    category: "Courier Fleet",
    image: "/images/m2.png",
    specs: "Range: 125 km | Speed: 25 km/h",
  },
  {
    id: "scooter",
    name: "Kukirin G3 Pro",
    category: "Scooter Fleet",
    image: "/images/g3_pro.png",
    specs: "Range: 80 km | Speed: 65 km/h",
  },
];

export default function StartYourJourney({ dict }) {
  const isHu = dict.planBasic === "Alap";
  const [activeModel, setActiveModel] = useState(FLEET_CATEGORIES[0]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const gridRef = useRef(null);

  // The morphing bike carries the default model, so when it lifts back out of
  // this card the selection has to follow it home — otherwise the pills stay on
  // the old pick while the bike that lands is the default one.
  useEffect(() => {
    const reset = () => setActiveModel(FLEET_CATEGORIES[0]);
    window.addEventListener(BIKE_MORPH_TAKEOFF, reset);
    return () => window.removeEventListener(BIKE_MORPH_TAKEOFF, reset);
  }, []);

  // Handle mobile scroll swipe to update indicators
  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollWidth <= clientWidth) return;
    
    const progress = scrollLeft / (scrollWidth - clientWidth);
    const index = Math.round(progress * 3);
    setActiveCardIndex(index);
  };

  // Scroll to card index on indicator click
  const scrollToCard = (index) => {
    if (gridRef.current) {
      const { scrollWidth, clientWidth } = gridRef.current;
      const targetScrollLeft = (index / 3) * (scrollWidth - clientWidth);
      
      gridRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
      setActiveCardIndex(index);
    }
  };

  return (
    <section id="how-it-works" className={styles.wrapper}>
      <div className={styles.container}>
        {/* Section Headline */}
        <h2 className={`${styles.headerTitle} h2`}>{dict.title}</h2>

        {/* Four Separate Cards Grid */}
        <div className={styles.grid} ref={gridRef} onScroll={handleScroll}>
          {/* Card 1: Choosing Fleet */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>01</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>{dict.card1Title}</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              {dict.card1Desc}
            </p>

            {/* Interactive Bike Showcase Widget */}
            <div className={styles.bikeShowcase}>
              <div className={styles.bikeImageWrapper} data-morph="target">
                <Image
                  src={activeModel.image}
                  alt={activeModel.name}
                  fill
                  sizes="220px"
                  className={styles.bikeImage}
                  priority
                />
              </div>
              <div className={styles.bikePillSelector}>
                {FLEET_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.bikeMiniPill} ${
                      activeModel.id === item.id ? styles.bikeMiniPillActive : ""
                    }`}
                    onClick={() => setActiveModel(item)}
                    onMouseEnter={() => setActiveModel(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Footer for Card 1 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card1Stat1Value} /></span>
                <span className={styles.statLabel}>{dict.card1Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card1Stat2Value} /></span>
                <span className={styles.statLabel}>{dict.card1Stat2Label}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Choosing Plans */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>02</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>{dict.card2Title}</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              {dict.card2Desc}
            </p>

            {/* Premium Plan Showcase Widget */}
            <div className={styles.planShowcase}>
              <div className={styles.glassPlanCard}>
                <div className={styles.planCardHeader}>
                  <span className={styles.planCardBadge}>{isHu ? "NÉPSZERŰ" : "POPULAR"}</span>
                  <h4 className={styles.planCardName}>{dict.planPlus || "Plus"}</h4>
                  <div className={styles.planCardPrice}>
                    <span className={styles.priceNum}>35 000</span>
                    <span className={styles.pricePeriod}>{isHu ? " Ft/hó" : " Ft/mo"}</span>
                  </div>
                </div>
                <ul className={styles.planFeatures}>
                  <li>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{dict.gpsTracking || "GPS Tracking"}</span>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{dict.theftInsurance || "Theft Insurance"}</span>
                  </li>
                  <li>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{dict.addonRack || "Heavy Cargo Rack"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Metric Footer for Card 2 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card2Stat1Value} /></span>
                <span className={styles.statLabel}>{dict.card2Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={`1 ${isHu ? "kiegészítő" : "add-on"}`} /></span>
                <span className={styles.statLabel}>{dict.card2Stat2Label}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Pay and Sign */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>03</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>{dict.card3Title}</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              {dict.card3Desc}
            </p>

            {/* Secure E-Sign and Payment Widget */}
            <div className={styles.paymentShowcase}>
              <div className={styles.docMockup}>
                <div className={styles.docMockupHeader}>
                  <div className={styles.secureDot} />
                  <span>{dict.docTitle || "Lease Agreement"}</span>
                </div>
                <div className={styles.docMockupBody}>
                  <div className={styles.docLine} />
                  <div className={styles.docLine} style={{ width: "80%" }} />
                  <div className={styles.docLine} style={{ width: "65%" }} />
                  <div className={styles.signatureLine}>
                    <span className={styles.sigLabel}>{isHu ? "Aláírás:" : "Signature:"}</span>
                    <span className={styles.cursiveSig}>{dict.placeholderName || "John Doe"}</span>
                  </div>
                </div>
              </div>
              <div className={styles.paymentIconsRow}>
                <div className={styles.miniPayChip}>
                  <svg width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>{dict.card || "Card"}</span>
                </div>
                <div className={styles.miniPayChip}>
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>G-Pay</span>
                </div>
                <div className={styles.miniPayChip}>
                  <svg width="10" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                  </svg>
                  <span>Apple Pay</span>
                </div>
              </div>
            </div>

            {/* Metric Footer for Card 3 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card3Stat1Value} /></span>
                <span className={styles.statLabel}>{dict.card3Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card3Stat2Signed} /></span>
                <span className={styles.statLabel}>{dict.card3Stat2Label}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Book Appointment & Ride */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>04</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>{dict.card4Title}</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              {dict.card4Desc}
            </p>

            {/* Pickup Confirmation Widget */}
            <div className={styles.pickupShowcase}>
              <div className={styles.pickupCard}>
                <div className={styles.calendarHeader}>
                  <span className={styles.calendarMonth}>{isHu ? "JÚLIUS" : "JULY"}</span>
                </div>
                <div className={styles.calendarBody}>
                  <span className={styles.calendarDate}>01</span>
                  <span className={styles.calendarDay}>{isHu ? "Sze" : "Wed"}</span>
                  <div className={styles.pickupTimeBadge}>11:30</div>
                </div>
              </div>
              <div className={styles.pickupDetails}>
                <div className={styles.locationPin}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Budapest Hub</span>
                </div>
                <span className={styles.handoverTag}>{dict.card4Stat2Value || "Instant"}</span>
              </div>
            </div>

            {/* Metric Footer for Card 4 (Replaced by clean layout and CTA) */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value="11:30" /></span>
                <span className={styles.statLabel}>{dict.card4Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}><CountUp value={dict.card4Stat2Value} /></span>
                <span className={styles.statLabel}>{dict.card4Stat2Label}</span>
              </div>
            </div>

            {/* Primary CTA Button at the Bottom */}
            <div className={styles.ctaWrapper}>
              <Link href="/fleets" className={styles.primaryPillBtn}>
                {dict.cta}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Indicators */}
        <div className={styles.indicators}>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${activeCardIndex === idx ? styles.dotActive : ""}`}
              onClick={() => scrollToCard(idx)}
              aria-label={`${dict.stepAria} ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


