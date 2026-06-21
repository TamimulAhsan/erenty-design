"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./StartYourJourney.module.css";

const FLEET_CATEGORIES = [
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
    id: "q8",
    name: "Equickey Q8 - Pro",
    category: "Urban Fleet",
    image: "/images/q8_pro.png",
    specs: "Range: 70 km | Speed: 25 km/h",
  },
  {
    id: "scooter",
    name: "Kukirin G3 Pro",
    category: "Scooter Fleet",
    image: "/images/g3_pro.png",
    specs: "Range: 80 km | Speed: 65 km/h",
  },
  {
    id: "c29",
    name: "DUOTTS C29 Pro",
    category: "Urban Fleet",
    image: "/images/c29_pro.png",
    specs: "Range: 100 km | Speed: 50 km/h",
  },
  {
    id: "e-cruise",
    name: "Urban E-Cruise",
    category: "Urban Fleet",
    image: "/images/e_crusie.png",
    specs: "Range: 110 km | Speed: 25 km/h",
  },
  {
    id: "f26",
    name: "DUOTTS F26 Lite",
    category: "Courier Fleet",
    image: "/images/f26_lite.png",
    specs: "Range: 120 km | Speed: 25 km/h",
  },
];

export default function StartYourJourney() {
  const [activeModel, setActiveModel] = useState(FLEET_CATEGORIES[0]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const gridRef = useRef(null);

  // Handle mobile scroll swipe to update indicators
  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    
    // 1. If we are near the rightmost scroll limit, active card is Card 3 (index 2)
    if (scrollLeft + clientWidth >= scrollWidth - 25) {
      setActiveCardIndex(2);
      return;
    }
    
    // 2. If we are near the leftmost scroll limit, active card is Card 1 (index 0)
    if (scrollLeft <= 25) {
      setActiveCardIndex(0);
      return;
    }
    
    // 3. Otherwise, we are in the middle transition (index 1)
    setActiveCardIndex(1);
  };

  // Scroll to card index on indicator click
  const scrollToCard = (index) => {
    if (gridRef.current) {
      const { scrollWidth, clientWidth } = gridRef.current;
      let targetScrollLeft = 0;
      
      if (index === 1) {
        // Center card target scroll point
        targetScrollLeft = (scrollWidth - clientWidth) / 2;
      } else if (index === 2) {
        // Rightmost card target scroll point
        targetScrollLeft = scrollWidth - clientWidth;
      }
      
      gridRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
      setActiveCardIndex(index);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* Section Headline */}
        <h2 className={`${styles.headerTitle} h2`}>Start your journey</h2>

        {/* Three Separate Cards Grid */}
        <div className={styles.grid} ref={gridRef} onScroll={handleScroll}>
          {/* Card 1: Pick Your Fleet */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>01</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Pick your fleet</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Browse vetted DUOTTS, Neuzer, MyEsel and Mamba models. Filter by range, motor power, intended use. Add bikes to a quote in one click.
            </p>

            {/* Scrollable list of 7 fleets (no scrollbar) */}
            <div className={styles.scrollList}>
              {FLEET_CATEGORIES.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.fleetPill} ${
                    activeModel.id === item.id ? styles.fleetPillActive : ""
                  }`}
                  onMouseEnter={() => setActiveModel(item)}
                >
                  <div className={styles.pillLeft}>
                    <div className={styles.thumbContainer}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={36}
                        height={24}
                        className={styles.thumbImg}
                      />
                    </div>
                    <span className={styles.pillName}>{item.name}</span>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.chevron}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Metric Footer for Card 1 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>4 brands</span>
                <span className={styles.statLabel}>curated</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>12 models</span>
                <span className={styles.statLabel}>in stock</span>
              </div>
            </div>
          </div>

          {/* Card 2: Configure Cover */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>02</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Configure cover</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Choose a Courier+ plan per bike — maintenance, GPS, theft insurance bundled. Switch plans monthly, no penalty.
            </p>

            {/* Metric Footer for Card 2 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>3 plans</span>
                <span className={styles.statLabel}>from 4 900 Ft</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>VAT</span>
                <span className={styles.statLabel}>reclaimable</span>
              </div>
            </div>

            {/* Bleeding/Cropped Illustration at the Bottom - Fitted and gaps reduced */}
            <div className={styles.imageContainer}>
              <Image
                src={activeModel.image}
                alt={activeModel.name}
                width={380}
                height={240}
                className={styles.fitImage}
                priority
              />
            </div>
          </div>

          {/* Card 3: Sign & Ride */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>03</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Sign & ride</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Digital contract, optional KYC for business accounts, courier delivers within 48h to anywhere in Hungary.
            </p>

            {/* Metric Footer for Card 3 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>Delivery</span>
                <span className={styles.statLabel}>48h nationwide</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>Contract</span>
                <span className={styles.statLabel}>e-sign</span>
              </div>
            </div>

            {/* Primary Pill CTA Button at the Bottom */}
            <div className={styles.ctaWrapper}>
              <Link href="/see-fleets" className={styles.primaryPillBtn}>
                See fleets
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
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${activeCardIndex === idx ? styles.dotActive : ""}`}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
