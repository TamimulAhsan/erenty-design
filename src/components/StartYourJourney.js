"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
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

const APPOINTMENT_TIMES = ["09:00", "11:30", "14:00", "16:30"];

export default function StartYourJourney({ dict }) {
  const isHu = dict.planBasic === "Alap";
  const priceSuffix = isHu ? "Ft/hó" : "Ft/mo";
  
  const PLANS = [
    { id: "basic", name: dict.planBasic || "Basic", price: `25 000 ${priceSuffix}` },
    { id: "plus", name: dict.planPlus || "Plus", price: `35 000 ${priceSuffix}` },
    { id: "max", name: dict.planMax || "Max", price: `45 000 ${priceSuffix}` },
  ];

  const ADDONS = [
    { id: "rack", nameKey: "addonRack", price: `+1 200 ${priceSuffix}` },
    { id: "battery", nameKey: "addonBattery", price: `+2 500 ${priceSuffix}` },
    { id: "mount", nameKey: "addonMount", price: `+500 ${priceSuffix}` },
  ];

  const APPOINTMENT_DAYS = [
    { id: "Mon", label: isHu ? "Hé" : "Mon", date: isHu ? "jún. 29." : "29 Jun" },
    { id: "Tue", label: isHu ? "Ke" : "Tue", date: isHu ? "jún. 30." : "30 Jun" },
    { id: "Wed", label: isHu ? "Sze" : "Wed", date: isHu ? "júl. 01." : "01 Jul" },
    { id: "Thu", label: isHu ? "Cs" : "Thu", date: isHu ? "júl. 02." : "02 Jul" },
    { id: "Fri", label: isHu ? "Pé" : "Fri", date: isHu ? "júl. 03." : "03 Jul" },
    { id: "Sat", label: isHu ? "Szo" : "Sat", date: isHu ? "júl. 04." : "04 Jul" },
  ];

  const [activeModel, setActiveModel] = useState(FLEET_CATEGORIES[0]);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [signedName, setSignedName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedTime, setSelectedTime] = useState("11:30");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const gridRef = useRef(null);

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

  const selectedDayLabel = APPOINTMENT_DAYS.find(d => d.id === selectedDay)?.label || selectedDay;

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
                <span className={styles.statValue}>{dict.card1Stat1Value}</span>
                <span className={styles.statLabel}>{dict.card1Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{dict.card1Stat2Value}</span>
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

            {/* Scrollable Container for Plans & Add-ons */}
            <div className={styles.card2ScrollContainer}>
              {/* Plan Selectors */}
              <div className={styles.configContainer}>
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      className={`${styles.configPill} ${
                        isSelected ? styles.configPillActive : ""
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <span className={styles.configLabel}>{plan.name}</span>
                      <span className={styles.configPrice}>{plan.price}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add-ons Selectors */}
              <span className={styles.subSectionTitle} style={{ marginTop: "4px", display: "block" }}>
                {dict.docAddonsLabel || "Add-ons:"}
              </span>
              <div className={styles.configContainer} style={{ marginTop: "8px" }}>
                {ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      className={`${styles.configPill} ${
                        isSelected ? styles.configPillActive : ""
                      }`}
                      onClick={() => {
                        setSelectedAddons((prev) =>
                          prev.includes(addon.id)
                            ? prev.filter((item) => item !== addon.id)
                            : [...prev, addon.id]
                        );
                      }}
                    >
                      <span className={styles.configLabel}>{dict[addon.nameKey] || addon.id}</span>
                      <span className={styles.configPrice}>{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metric Footer for Card 2 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{dict.card2Stat1Value}</span>
                <span className={styles.statLabel}>{dict.card2Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {selectedAddons.length} {dict.addonsSuffix || "add-ons"}
                </span>
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

            {/* Payment Method Selector */}
            <span className={styles.subSectionTitle}>{dict.paymentMethod}</span>
            <div className={styles.paymentSelector}>
              <button
                className={`${styles.paymentChip} ${
                  paymentMethod === "card" ? styles.paymentChipActive : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
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
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>{dict.card || "Card"}</span>
              </button>
              <button
                className={`${styles.paymentChip} ${
                  paymentMethod === "google" ? styles.paymentChipActive : ""
                }`}
                onClick={() => setPaymentMethod("google")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>{dict.googlePay || "Google Pay"}</span>
              </button>
              <button
                className={`${styles.paymentChip} ${
                  paymentMethod === "apple" ? styles.paymentChipActive : ""
                }`}
                onClick={() => setPaymentMethod("apple")}
              >
                <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                </svg>
                <span>{dict.applePay || "Apple Pay"}</span>
              </button>
            </div>

            {/* Mock Digital Contract */}
            <div className={styles.documentMock}>
              <div className={styles.docHeader}>
                <span className={styles.docTitle}>{dict.docTitle}</span>
                <span
                  className={`${styles.docStatus} ${
                    signedName.trim() ? styles.docStatusSigned : styles.docStatusPending
                  }`}
                >
                  {signedName.trim() ? dict.docStatusSigned : dict.docStatusPending}
                </span>
              </div>
              <div className={styles.docBody}>
                <p>{dict.docTermsLabel}</p>
                <p>
                  {dict.docModelLabel} {activeModel.name}
                </p>
                <p>
                  {dict.docPlanLabel}{" "}
                  {PLANS.find((p) => p.id === selectedPlan)?.name}
                </p>
                <p>
                  {dict.docAddonsLabel || "Add-ons:"}{" "}
                  {selectedAddons.length > 0
                    ? selectedAddons.map((id) => dict[ADDONS.find((a) => a.id === id)?.nameKey] || id).join(", ")
                    : dict.docNone || "none"}
                </p>
                <p>
                  {dict.docPaymentLabel}{" "}
                  {paymentMethod === "card"
                    ? dict.card || "Card"
                    : paymentMethod === "google"
                    ? dict.googlePay || "Google Pay"
                    : dict.applePay || "Apple Pay"}
                </p>
                <p>
                  {dict.docAppointmentLabel} {selectedDayLabel} @ {selectedTime}
                </p>
              </div>
            </div>

            {/* E-Signature Input */}
            <div className={styles.signatureInputWrapper}>
              <label className={styles.signatureLabel} htmlFor="journey-signature">
                {dict.typeToSign}
              </label>
              <input
                id="journey-signature"
                type="text"
                className={styles.signatureField}
                placeholder={dict.placeholderName || "e.g. John Doe"}
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
              />
              {signedName.trim() && (
                <div className={styles.signatureDraw}>{signedName}</div>
              )}
            </div>

            {/* Metric Footer for Card 3 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{dict.card3Stat1Value}</span>
                <span className={styles.statLabel}>{dict.card3Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {signedName.trim()
                    ? dict.card3Stat2Signed
                    : dict.card3Stat2Pending}
                </span>
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

            {/* Metric Footer for Card 4 */}
            <div className={styles.cardStats}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {selectedDayLabel} @ {selectedTime}
                </span>
                <span className={styles.statLabel}>{dict.card4Stat1Label}</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>{dict.card4Stat2Value}</span>
                <span className={styles.statLabel}>{dict.card4Stat2Label}</span>
              </div>
            </div>

            {/* Primary Pill CTA Button at the Bottom */}
            <div className={styles.ctaWrapper}>
              <Link
                href="/fleets"
                className={styles.primaryPillBtn}
              >
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

