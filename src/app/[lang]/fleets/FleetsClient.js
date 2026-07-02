"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import styles from "./fleets.module.css";

const FLEET_BIKES = [
  {
    id: "kukirin-g3-pro",
    brand: "Kukirin",
    model: "G3 Pro",
    category: "scooter",
    price: 40000,
    range: "80 km",
    rangeNum: 80,
    topSpeed: "65 km/h",
    motor: "1200W",
    motorNum: 1200,
    image: "/images/g3_pro.png",
    slug: "kukirin-g3-pro"
  },
  {
    id: "eleglide-m2",
    brand: "ELEGLIDE",
    model: "M2",
    category: "courier",
    price: 45000,
    range: "125 km",
    rangeNum: 125,
    topSpeed: "25 km/h",
    motor: "250 W",
    motorNum: 250,
    image: "/images/m2.png",
    slug: "eleglide-m2"
  },
  {
    id: "duotts-c29-pro",
    brand: "DUOTTS",
    model: "C29 Pro",
    category: "urban",
    price: 45000,
    range: "100 km",
    rangeNum: 100,
    topSpeed: "50 km/h",
    motor: "250W - 750W",
    motorNum: 750,
    image: "/images/c29_pro.png",
    slug: "duotts-c29-pro"
  },
  {
    id: "znen-e-crusie",
    brand: "ZNEN",
    model: "E-Crusie",
    category: "scooter",
    price: 50000,
    range: "80 km",
    rangeNum: 80,
    topSpeed: "45 km/h",
    motor: "3000 W",
    motorNum: 3000,
    image: "/images/e_crusie.png",
    slug: "znen-e-crusie"
  },
  {
    id: "equickey-q8-pro",
    brand: "Equickey",
    model: "Q8 - Pro",
    category: "courier",
    price: 50000,
    range: "120 km",
    rangeNum: 120,
    topSpeed: "50 km/h",
    motor: "2000 W",
    motorNum: 2000,
    image: "/images/q8_pro.png",
    slug: "equickey-q8-pro"
  },
  {
    id: "duotts-f26-lite",
    brand: "DUOTTS",
    model: "F26 Lite",
    category: "courier",
    price: 52000,
    range: "120 km",
    rangeNum: 120,
    topSpeed: "45 km/h",
    motor: "250 - 750 W",
    motorNum: 750,
    image: "/images/f26_lite.png",
    slug: "duotts-f26-lite"
  },
  {
    id: "vok-s",
    brand: "VOK",
    model: "S",
    category: "cargo",
    price: 120000,
    range: "100 km",
    rangeNum: 100,
    topSpeed: "25 km/h",
    motor: "250W",
    motorNum: 250,
    image: "/images/S.png",
    slug: "vok-s"
  }
];

const CATEGORIES = ["all", "cargo", "courier", "scooter", "urban"];
const BRANDS = ["Kukirin", "ELEGLIDE", "DUOTTS", "ZNEN", "Equickey", "VOK"];

// Pulsing Hotspots over the DUOTTS C29 Pro showcase bike in the Hero
const HERO_HOTSPOTS = [
  {
    id: "handlebars",
    title: "Smart Telemetry",
    desc: "Integrated GPS anti-theft, active digital dashboard, and remote app lock controls.",
    top: "23%",
    left: "58%",
    align: "left"
  },
  {
    id: "seat",
    title: "Ergonomic Saddle",
    desc: "Premium, shock-absorbing comfort saddle optimized for long-distance urban navigation.",
    top: "29%",
    left: "39%",
    align: "left"
  },
  {
    id: "battery",
    title: "LG Lithium Battery",
    desc: "Removable 48V 15Ah (720Wh) cells, lockable within frame, supplying up to 100km range.",
    top: "47%",
    left: "47%",
    align: "right"
  },
  {
    id: "motor",
    title: "750W Brushless Motor",
    desc: "High-torque output providing rapid acceleration and effortless climbing power.",
    top: "69%",
    left: "29%",
    align: "left"
  },
  {
    id: "tires",
    title: "Puncture-Resistant Tires",
    desc: "All-terrain dual compound tires coupled with dual hydraulic safety disc brakes.",
    top: "68%",
    left: "71%",
    align: "right"
  }
];

export default function FleetsClient() {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState(40000);
  const [priceMax, setPriceMax] = useState(120000);
  const [sortBy, setSortBy] = useState("price-asc");

  // Interaction dropdown states
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeModalBike, setActiveModalBike] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Dropdown references for click-outside handlers
  const brandRef = useRef(null);
  const priceRef = useRef(null);
  const sortRef = useRef(null);
  const trackRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setIsBrandDropdownOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setIsPriceDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update Price Slider track background when slider value changes
  const getPercent = (value) =>
    Math.round(((value - 40000) / (120000 - 40000)) * 100);

  useEffect(() => {
    if (trackRef.current) {
      const minPercent = getPercent(priceMin);
      const maxPercent = getPercent(priceMax);
      trackRef.current.style.left = `${minPercent}%`;
      trackRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [priceMin, priceMax, isPriceDropdownOpen]);

  // Prevent scroll when modal is active
  useEffect(() => {
    if (activeModalBike) {
      document.documentElement.classList.add("modalOpen");
    } else {
      document.documentElement.classList.remove("modalOpen");
    }
    return () => {
      document.documentElement.classList.remove("modalOpen");
    };
  }, [activeModalBike]);

  // Track window scroll to shrink filters bar with hysteresis to prevent jitter/vibration loops
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll tracking on mobile viewports to prevent React re-renders and layout thrashing
      if (window.innerWidth <= 768) {
        setIsScrolled(false);
        return;
      }
      const currentScroll = window.scrollY;
      setIsScrolled((prev) => {
        if (currentScroll > 80) return true;
        if (currentScroll < 40) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC Close Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalBike(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleBrandChange = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const handleSelectAllBrands = () => {
    setSelectedBrands(BRANDS);
  };

  const handleClearAllBrands = () => {
    setSelectedBrands([]);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setPriceMin(40000);
    setPriceMax(120000);
    setSortBy("price-asc");
  };

  const getCategoryCount = (category) => {
    if (category === "all") return FLEET_BIKES.length;
    return FLEET_BIKES.filter((bike) => bike.category === category).length;
  };

  // Filter bikes
  const filteredBikes = FLEET_BIKES.filter((bike) => {
    if (selectedCategory !== "all" && bike.category !== selectedCategory) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) {
      return false;
    }
    if (bike.price < priceMin || bike.price > priceMax) {
      return false;
    }
    return true;
  });

  // Sort bikes
  const sortedBikes = [...filteredBikes].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "range-desc") return b.rangeNum - a.rangeNum;
    if (sortBy === "motor-desc") return b.motorNum - a.motorNum;
    return 0;
  });

  // Carousel in Modal
  const handlePrevBike = (e) => {
    e.stopPropagation();
    const idx = sortedBikes.findIndex((b) => b.id === activeModalBike.id);
    if (idx > 0) {
      setActiveModalBike(sortedBikes[idx - 1]);
    } else {
      setActiveModalBike(sortedBikes[sortedBikes.length - 1]);
    }
  };

  const handleNextBike = (e) => {
    e.stopPropagation();
    const idx = sortedBikes.findIndex((b) => b.id === activeModalBike.id);
    if (idx < sortedBikes.length - 1) {
      setActiveModalBike(sortedBikes[idx + 1]);
    } else {
      setActiveModalBike(sortedBikes[0]);
    }
  };

  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Immersive Typographic Hero Section */}
      <section className={styles.cleanHero}>
        <div className={styles.heroTextContainer}>
          <span className={styles.heroPre}>E-Renty Fleets</span>
          <h1 className={styles.heroTitleCentered}>Go Green. Go Electric.</h1>
          <p className={styles.heroSubtitleCentered}>
            Smart GPS, anti-theft insurance, and 24/7 service included. Pick the bike that fits your urban journey.
          </p>
        </div>

        {/* Big centered visual frame with hotspots */}
        <div className={styles.interactiveBikeFrame}>
          <div className={styles.showcaseBikeContainer}>
            <div className={styles.showroomPlatform}></div>
            <Image
              src="/images/c29_pro.png"
              alt="DUOTTS C29 Pro Showcase"
              fill
              className={styles.heroShowcaseBike}
              priority
            />

            {/* Pulsing Hotspots */}
            {HERO_HOTSPOTS.map((hotspot, idx) => (
              <div
                key={hotspot.id}
                className={styles.hotspotWrapper}
                style={{ top: hotspot.top, left: hotspot.left }}
                onMouseEnter={() => setActiveHotspot(idx)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <button
                  className={`${styles.hotspotDot} ${activeHotspot === idx ? styles.hotspotDotActive : ""}`}
                  aria-label={`View details about ${hotspot.title}`}
                >
                  <span className={styles.hotspotPulse}></span>
                </button>

                {/* Tooltip Card */}
                <div
                  className={`${styles.hotspotTooltip} ${
                    activeHotspot === idx ? styles.tooltipVisible : ""
                  } ${hotspot.align === "right" ? styles.tooltipAlignRight : ""}`}
                >
                  <h4 className={styles.tooltipTitle}>{hotspot.title}</h4>
                  <p className={styles.tooltipDesc}>{hotspot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Top Navigation Control Filters Bar (Sticky) */}
      <div className={`${styles.stickyBarWrapper} ${isScrolled ? styles.stickyBarWrapperScrolled : ""}`}>
        <div className={styles.stickyBar}>
          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.tabBtn} ${selectedCategory === cat ? styles.tabBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                <span className={styles.tabCount}>{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>

          {/* Action Filters Panel */}
          <div className={styles.controlsRight}>
            {/* Brand Dropdown Selector */}
            <div ref={brandRef} className={styles.dropdownWrapper}>
              <button
                className={`${styles.dropdownTrigger} ${selectedBrands.length > 0 ? styles.activeTrigger : ""}`}
                onClick={() => {
                  setIsBrandDropdownOpen(!isBrandDropdownOpen);
                  setIsPriceDropdownOpen(false);
                  setIsSortDropdownOpen(false);
                }}
              >
                Brand {selectedBrands.length > 0 ? `(${selectedBrands.length})` : ""}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isBrandDropdownOpen && (
                <div className={styles.glassPopover}>
                  <div className={styles.popoverHeader}>
                    <span>Filter by Brand</span>
                    <div className={styles.popoverHeaderActions}>
                      <button type="button" onClick={handleSelectAllBrands} className={styles.popoverActionBtn}>Select All</button>
                      <span className={styles.popoverActionDivider}>/</span>
                      <button type="button" onClick={handleClearAllBrands} className={styles.popoverActionBtn}>Clear All</button>
                    </div>
                  </div>
                  <div className={styles.popoverList}>
                    {BRANDS.map((brand) => (
                      <label key={brand} className={styles.popoverCheckboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown Selector */}
            <div ref={priceRef} className={styles.dropdownWrapper}>
              <button
                className={`${styles.dropdownTrigger} ${
                  priceMin > 40000 || priceMax < 120000 ? styles.activeTrigger : ""
                }`}
                onClick={() => {
                  setIsPriceDropdownOpen(!isPriceDropdownOpen);
                  setIsBrandDropdownOpen(false);
                  setIsSortDropdownOpen(false);
                }}
              >
                Price
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isPriceDropdownOpen && (
                <div className={styles.glassPopover} style={{ width: "260px" }}>
                  <div className={styles.popoverHeader}>Price Range (Monthly)</div>
                  <div className={styles.sliderWrapper}>
                    <div className={styles.rangeInputs}>
                      <div ref={trackRef} className={styles.sliderTrack} />
                      <input
                        type="range"
                        min="40000"
                        max="120000"
                        step="5000"
                        value={priceMin}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), priceMax - 5000);
                          setPriceMin(val);
                        }}
                        className={`${styles.rangeInput} ${styles.minInput}`}
                      />
                      <input
                        type="range"
                        min="40000"
                        max="120000"
                        step="5000"
                        value={priceMax}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), priceMin + 5000);
                          setPriceMax(val);
                        }}
                        className={`${styles.rangeInput} ${styles.maxInput}`}
                      />
                    </div>
                    <div className={styles.sliderValues}>
                      <span>{formatPrice(priceMin)} Ft</span>
                      <span>—</span>
                      <span>{formatPrice(priceMax)} Ft</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div ref={sortRef} className={`${styles.dropdownWrapper} ${styles.sortDropdownWrapper}`}>
              <button
                className={`${styles.dropdownTrigger} ${isSortDropdownOpen ? styles.activeTrigger : ""}`}
                onClick={() => {
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                  setIsBrandDropdownOpen(false);
                  setIsPriceDropdownOpen(false);
                }}
              >
                <span>
                  {sortBy === "price-asc" && "Price: Low to High"}
                  {sortBy === "price-desc" && "Price: High to Low"}
                  {sortBy === "range-desc" && "Range: Longest First"}
                  {sortBy === "motor-desc" && "Power: Highest First"}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isSortDropdownOpen && (
                <div className={styles.glassPopover} style={{ minWidth: "200px" }}>
                  <div className={styles.sortOptionsList}>
                    <button
                      className={`${styles.sortOption} ${sortBy === "price-asc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("price-asc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Price: Low to High
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "price-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("price-desc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Price: High to Low
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "range-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("range-desc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Range: Longest First
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "motor-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("motor-desc");
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      Power: Highest First
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedBrands.length > 0 || priceMin > 40000 || priceMax < 120000 || selectedCategory !== "all") && (
              <button className={styles.clearBtnClean} onClick={handleClearFilters} aria-label="Reset all filters">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.resetIcon}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Creative Asymmetric Catalog Grid */}
      <section className={styles.gridSection}>
        <div className={styles.resultsSummary}>
          {sortedBikes.length} {sortedBikes.length === 1 ? "bike matches" : "bikes match"}
        </div>

        <div className={styles.portfolioGrid}>
          {sortedBikes.length > 0 ? (
            sortedBikes.map((bike, idx) => {
              return (
                <div
                  key={bike.id}
                  className={styles.portfolioCard}
                >
                  <div className={styles.cardImageContainer} onClick={() => setActiveModalBike(bike)}>
                    <span className={styles.cardCategoryBadge}>{bike.category}</span>
                    <Image
                      src={bike.image}
                      alt={`${bike.brand} ${bike.model}`}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 991px) 100vw, 33vw"
                      priority={idx < 3}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.cardInfoLeft}>
                      <span className={styles.brandTag}>{bike.brand}</span>
                      <h3 className={styles.bikeModelTitle}>{bike.model}</h3>

                      <div className={styles.bikePriceRow}>
                        <span className={styles.priceFt}>{formatPrice(bike.price)} Ft</span>
                        <span className={styles.priceMo}>/ month</span>
                      </div>
                    </div>

                    <div className={styles.cardInfoRight}>
                      {/* Specs Row */}
                      <div className={styles.cardSpecsRow}>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>Range</span>
                          <span className={styles.specLabelVal}>{bike.range}</span>
                        </div>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>Motor</span>
                          <span className={styles.specLabelVal}>{bike.motor}</span>
                        </div>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>Speed</span>
                          <span className={styles.specLabelVal}>{bike.topSpeed}</span>
                        </div>
                      </div>

                      <Link href={`/fleets/${bike.slug}`} className={styles.portfolioRentLink}>
                        Rent this fleet
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResultsBox}>
              <h3 className={styles.noResultsHeader}>No fleets match this search</h3>
              <p className={styles.noResultsDetail}>
                Try adjusting your brand toggles, category selectors, or price range inputs.
              </p>
              <button className={styles.resetSearchBtn} onClick={handleClearFilters}>
                Reset Filter Parameters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Bike Detail Modal (5:4 aspect ratio) */}
      {activeModalBike && (
        <div className={styles.modalOverlay} onClick={() => setActiveModalBike(null)}>
          <div className={styles.modalWrapper} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setActiveModalBike(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Left Image Showcase Panel - Strict 5:4 aspect ratio */}
            <div className={styles.modalImageArea}>
              {sortedBikes.length > 1 && (
                <>
                  <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={handlePrevBike}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={handleNextBike}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
              <Image
                src={activeModalBike.image}
                alt={`${activeModalBike.brand} ${activeModalBike.model}`}
                fill
                className={styles.modalBikeImage}
                sizes="(max-width: 991px) 100vw, 55vw"
                priority
              />
            </div>

            {/* Right Information Details Panel */}
            <div className={styles.modalInfoArea}>
              <div className={styles.modalEyebrowRow}>
                <span className={styles.modalCategoryBadge}>{activeModalBike.category}</span>
                <span className={styles.modalBrand}>{activeModalBike.brand}</span>
              </div>
              <h2 className={styles.modalTitle}>{activeModalBike.model}</h2>

              <div className={styles.modalPriceRow}>
                <span className={styles.modalPriceLabel}>Starting From</span>
                <span className={styles.modalPriceValue}>{formatPrice(activeModalBike.price)} Ft</span>
                <span className={styles.modalPricePeriod}>/ month</span>
              </div>

              <div className={styles.modalSpecsList}>
                <div className={styles.modalSpecItem}>
                  <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span><strong>Range:</strong> {activeModalBike.range} (Pedal Assist / Dual mode options)</span>
                </div>
                <div className={styles.modalSpecItem}>
                  <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span><strong>Top speed:</strong> {activeModalBike.topSpeed} (Electronically optimized)</span>
                </div>
                <div className={styles.modalSpecItem}>
                  <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span><strong>Motor capacity:</strong> {activeModalBike.motor} brushless peak output</span>
                </div>
                <div className={styles.modalSpecItem}>
                  <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span><strong>Security:</strong> Smart GPS tracking + Remote anti-theft app lock</span>
                </div>
                <div className={styles.modalSpecItem}>
                  <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span><strong>Insurance:</strong> Full comprehensive damages & third party liability</span>
                </div>
              </div>

              <div className={styles.modalFeaturesRow}>
                <span className={styles.modalFeatureBadge}>
                  <svg className={styles.modalFeatureIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  24/7 Service Support
                </span>
                <span className={styles.modalFeatureBadge}>
                  <svg className={styles.modalFeatureIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Sub-24h Maintenance
                </span>
              </div>

              <div className={styles.modalActions}>
                <Link href={`/fleets/${activeModalBike.slug}`} className={styles.modalRentBtn}>
                  Rent this bike
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
                <Link href="/courier-plus" className={styles.modalCourierBtn}>
                  View Courier+ plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
