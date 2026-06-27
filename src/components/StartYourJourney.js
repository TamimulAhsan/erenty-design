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

const CONFIGURATION_ADDONS = [
  { id: "rack", name: "Heavy Cargo Rack", price: "+1 200 Ft/mo" },
  { id: "battery", name: "Extended Battery", price: "+2 500 Ft/mo" },
  { id: "mount", name: "Phone Mount & USB", price: "+500 Ft/mo" },
];

const APPOINTMENT_DAYS = [
  { id: "Mon", label: "Mon", date: "29 Jun" },
  { id: "Tue", label: "Tue", date: "30 Jun" },
  { id: "Wed", label: "Wed", date: "01 Jul" },
  { id: "Thu", label: "Thu", date: "02 Jul" },
  { id: "Fri", label: "Fri", date: "03 Jul" },
  { id: "Sat", label: "Sat", date: "04 Jul" },
];

const APPOINTMENT_TIMES = ["09:00", "11:30", "14:00", "16:30"];

export default function StartYourJourney() {
  const [activeModel, setActiveModel] = useState(FLEET_CATEGORIES[0]);
  const [selectedAddons, setSelectedAddons] = useState(["rack"]); // default selected addon
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedTime, setSelectedTime] = useState("11:30");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const gridRef = useRef(null);

  // Toggle addons
  const handleToggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* Section Headline */}
        <h2 className={`${styles.headerTitle} h2`}>Start your journey</h2>

        {/* Four Separate Cards Grid */}
        <div className={styles.grid} ref={gridRef} onScroll={handleScroll}>
          {/* Card 1: Choosing Fleet */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>01</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Choose fleet</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Browse vetted DUOTTS, Neuzer, MyEsel and Mamba models. Filter by range, motor power, and intended use.
            </p>

            {/* Scrollable list of 7 fleets */}
            <div className={styles.scrollList}>
              {FLEET_CATEGORIES.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.fleetPill} ${
                    activeModel.id === item.id ? styles.fleetPillActive : ""
                  }`}
                  onClick={() => setActiveModel(item)}
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

          {/* Card 2: Choosing Configuration */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>02</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Choose configuration</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Choose a Courier+ protection plan and select add-on hardware accessories tailored to your daily needs.
            </p>

            {/* Configuration Selectors */}
            <div className={styles.configContainer}>
              {CONFIGURATION_ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    className={`${styles.configPill} ${
                      isSelected ? styles.configPillActive : ""
                    }`}
                    onClick={() => handleToggleAddon(addon.id)}
                  >
                    <span className={styles.configLabel}>{addon.name}</span>
                    <span className={styles.configPrice}>{addon.price}</span>
                  </button>
                );
              })}
            </div>

            {/* Metric Footer for Card 2 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>3 plans</span>
                <span className={styles.statLabel}>available</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{selectedAddons.length} add-ons</span>
                <span className={styles.statLabel}>configured</span>
              </div>
            </div>

            {/* Image Preview Container */}
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

          {/* Card 3: Book an Appointment */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>03</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Book appointment</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Select a flexible time slot at our central Budapest service workshop for inspection, tutorial, and setup.
            </p>

            {/* Mini Scheduler Component */}
            <div className={styles.scheduler}>
              {/* Day Tabs */}
              <div className={styles.dayGrid}>
                {APPOINTMENT_DAYS.map((day) => (
                  <button
                    key={day.id}
                    className={`${styles.dayTab} ${
                      selectedDay === day.id ? styles.dayTabActive : ""
                    }`}
                    onClick={() => setSelectedDay(day.id)}
                  >
                    <span className={styles.dayLabel}>{day.label}</span>
                    <span className={styles.dayNum}>{day.date.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className={styles.timeGrid}>
                {APPOINTMENT_TIMES.map((time) => (
                  <button
                    key={time}
                    className={`${styles.timeChip} ${
                      selectedTime === time ? styles.timeChipActive : ""
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Footer for Card 3 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{selectedDay}day</span>
                <span className={styles.statLabel}>selected day</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{selectedTime}</span>
                <span className={styles.statLabel}>confirmed slot</span>
              </div>
            </div>
          </div>

          {/* Card 4: Sign Document & Take Bike */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <div className={styles.stepBadge}>04</div>
            </div>
            <h3 className={`${styles.cardTitle} h3`}>Sign & ride</h3>
            <p className={`${styles.cardDesc} body-sm`}>
              Review the lease terms. You will sign the official lease agreement on-site at the workshop during your scheduled appointment time.
            </p>

            {/* Mock Digital Contract & Signature Pad */}
            <div className={styles.documentMock}>
              <div className={styles.docHeader}>
                <span className={styles.docTitle}>Lease Agreement</span>
                <span className={styles.docStatus}>
                  ON-SITE SIGNING
                </span>
              </div>
              <div className={styles.docBody}>
                <p>E-Renty Lease Terms:</p>
                <p>Model: {activeModel.name}</p>
                <p>Add-ons: {selectedAddons.length > 0 ? selectedAddons.join(", ") : "none"}</p>
                <p>Appointment: {selectedDay} @ {selectedTime}</p>
              </div>
            </div>

            {/* Metric Footer for Card 4 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>On-site sign</span>
                <span className={styles.statLabel}>at appointment</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>Instant</span>
                <span className={styles.statLabel}>handover</span>
              </div>
            </div>

            {/* Primary Pill CTA Button at the Bottom */}
            <div className={styles.ctaWrapper}>
              <Link
                href="/see-fleets"
                className={styles.primaryPillBtn}
              >
                Confirm booking
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
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

