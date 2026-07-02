"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import styles from "./YourJourneyPartner.module.css";

const SHOWCASE_BIKES = [
  {
    id: "c29",
    name: "DUOTTS C29 Pro",
    category: "Urban Fleet",
    image: "/images/c29_pro.png",
    price: "29 900 Ft",
    specs: [
      "Motor: 750W Peak High-Torque Brushless",
      "Range: Up to 100 km (Dual-Battery option)",
      "Battery: 48V 15Ah (720Wh) LG cells",
      "Smart Features: Telemetry, GPS & App lock"
    ]
  },
  {
    id: "cargo",
    name: "VOK S",
    category: "Cargo Fleet",
    image: "/images/S.png",
    price: "49 900 Ft",
    specs: [
      "Cargo Volume: 250 Liters / 120 kg capacity",
      "Range: Up to 100 km per charge",
      "Battery: Dual 1.5 kWh Li-ion (Removable)",
      "Safety: Heavy-duty hydraulic disc brakes"
    ]
  },
  {
    id: "courier",
    name: "ELEGLIDE M2",
    category: "Courier Fleet",
    image: "/images/m2.png",
    price: "19 900 Ft",
    specs: [
      "Range: Up to 125 km (Pedal Assist)",
      "Motor: 250W Brushless (57Nm torque)",
      "Transmission: Shimano 24-Speed gears",
      "Suspension: Lockout hydraulic front fork"
    ]
  },
  {
    id: "scooter",
    name: "Kukirin G3 Pro",
    category: "Scooter Fleet",
    image: "/images/g3_pro.png",
    price: "15 900 Ft",
    specs: [
      "Power: Dual 1200W Hub Motors",
      "Max Speed: 65 km/h (limited for public)",
      "Climbing: Up to 30-degree slopes",
      "Braking: Front and rear oil disc brakes"
    ]
  }
];

const CATEGORY_KEY = { c29: "urban", cargo: "cargo", courier: "courier", scooter: "scooter" };

export default function YourJourneyPartner({ dict }) {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();

      // Account for the sticky navbar height (72px)
      const navbarHeight = 72;
      const scrolledPastTop = navbarHeight - rect.top;
      const totalScrollable = rect.height - (window.innerHeight - navbarHeight);

      if (totalScrollable <= 0) return;

      let progress = scrolledPastTop / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      // Divide progress into 4 equal bands corresponding to the 4 bikes
      const index = Math.min(
        SHOWCASE_BIKES.length - 1,
        Math.floor(progress * SHOWCASE_BIKES.length)
      );

      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    const timer = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToSlide = (index) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const navbarHeight = 72;
    const sectionTop = window.scrollY + rect.top;
    const startScroll = sectionTop - navbarHeight;
    const totalScrollable = rect.height - (window.innerHeight - navbarHeight);
    const targetScroll = startScroll + (totalScrollable * index) / (SHOWCASE_BIKES.length - 1);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stickyContainer}>
        <div className={styles.container}>
          {/* Eyebrow - Static at the top */}
          <span className={`${styles.eyebrow} eyebrow`}>{dict.eyebrow}</span>

          {/* Slider Viewport Container */}
          <div className={styles.sliderContainer}>
            <div className={styles.track}>
              {SHOWCASE_BIKES.map((bike, idx) => (
                <div 
                  key={bike.id} 
                  className={`${styles.slide} ${activeIndex === idx ? styles.slideActive : ""}`}
                >
                  <div className={styles.slideInner}>
                    {/* Top Left: Fleet Name and Category */}
                    <div className={styles.topLeft}>
                      <h2 className={`${styles.fleetName} h2`}>{bike.name}</h2>
                      <span className={`${styles.category} body-default`}>{dict.categories[CATEGORY_KEY[bike.id]] || bike.category}</span>
                    </div>

                    {/* Top Right: Specifications List */}
                    <div className={styles.topRight}>
                      <ul className={styles.specsList}>
                        {(dict.specs[bike.id] || bike.specs).map((spec, specIdx) => (
                          <li key={specIdx} className="body-sm">
                            <span className={styles.bullet}></span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Center Column: Image + CTA Button (flex-aligned to prevent overlapping) */}
                    <div className={styles.centerColumn}>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={bike.image}
                          alt={bike.name}
                          width={720}
                          height={420}
                          className={styles.bikeImage}
                          priority={idx === 0}
                        />
                      </div>

                      <div className={styles.ctaContainer}>
                        <Link href={`/fleets/${bike.id === "cargo" ? "vok-s" : bike.id === "courier" ? "eleglide-m2" : bike.id === "scooter" ? "kukirin-g3-pro" : "duotts-c29-pro"}`} className="btn-primary">
                          {dict.rentPrefix} {bike.name}
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
                        <Link href="/fleets" className="btn-ghost">
                          {dict.viewAll}
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Left: Price Display */}
                    <div className={styles.bottomLeft}>
                      <div className={styles.priceContainer}>
                        <span className={`${styles.price} price mono-num`}>{bike.price}</span>
                        <span className={`${styles.period} caption`}>{dict.perMonth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Vertical Navigation Dots on the Right */}
          <div className={styles.sideIndicators}>
            {SHOWCASE_BIKES.map((bike, idx) => (
              <button
                key={bike.id}
                className={`${styles.indicatorDot} ${activeIndex === idx ? styles.indicatorDotActive : ""
                  }`}
                onClick={() => scrollToSlide(idx)}
                aria-label={`${dict.slideAria} ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
