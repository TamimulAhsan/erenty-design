"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { usePathname, useRouter } from "next/navigation";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";
import { FLEET_BIKES } from "@/data/fleets";
import styles from "./fleets.module.css";

const CATEGORIES = ["all", "cargo", "courier", "scooter", "urban"];
const BRANDS = ["Kukirin", "ELEGLIDE", "DUOTTS", "ZNEN", "Equickey", "VOK"];

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

export default function FleetsClient({ dict = {}, initialBikeSlug = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname) || defaultLocale;
  const isHu = locale === "hu";

  // Localized name for the selected rental tier (basic | plus | max).
  const planLabelFor = (id) =>
    id === "basic"
      ? (dict.planBasic || "Basic")
      : id === "max"
        ? (dict.planMax || "Max")
        : (dict.planPlus || "Plus");

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
  // Open the rental modal immediately when arriving on a deep-linked bike URL
  // (/fleets/[slug]) so the detail route renders as the modal over the listing.
  const [activeModalBike, setActiveModalBike] = useState(
    () => (initialBikeSlug ? FLEET_BIKES.find((b) => b.slug === initialBikeSlug) || null : null)
  );
  const [activeHotspot, setActiveHotspot] = useState(null);

  // New modal multi-step states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalStep, setModalStep] = useState("details"); // details | plans | verification | esign | booking | success
  const [verificationStatus, setVerificationStatus] = useState("verified"); // 'unsubmitted' | 'pending' | 'verified'
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [esignName, setEsignName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const isCheckingOutRef = useRef(false);

  const timeSlots = ["09:00 - 11:00", "11:00 - 13:00", "14:00 - 16:00", "16:00 - 18:00"];

  // Dropdown references for click-outside handlers
  const brandRef = useRef(null);
  const priceRef = useRef(null);
  const sortRef = useRef(null);
  const trackRef = useRef(null);

  // Generate the next 5 working days (excluding Sunday) for booking
  const getBookingDates = () => {
    const dates = [];
    let current = new Date();
    // Start from tomorrow
    current.setDate(current.getDate() + 1);
    while (dates.length < 5) {
      if (current.getDay() !== 0) { // 0 is Sunday
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };
  const bookingDates = getBookingDates();

  const formatDate = (date) => {
    return date.toLocaleDateString(locale === "hu" ? "hu-HU" : "en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Close dropdowns and hotspots on click outside
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
      if (!event.target.closest("." + styles.hotspotWrapper)) {
        setActiveHotspot(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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

  // Track window scroll to shrink filters bar
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
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

  // Close the modal and, if we arrived on a deep-linked /fleets/[slug] URL,
  // restore the bare /fleets URL without triggering a re-navigation/remount.
  const closeModal = () => {
    setActiveModalBike(null);
    if (typeof window !== "undefined") {
      const base = localizeHref(locale, "/fleets");
      if (window.location.pathname !== base) {
        window.history.replaceState(null, "", base);
      }
    }
  };

  // ESC Close Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Reset the multi-step flow's sub-states whenever the modal target changes
  // (a different bike is opened, or it's reopened). Resetting local state when
  // the editing target changes is an intentional, accepted use of an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setActiveImageIndex(0);
    if (typeof window !== "undefined" && window.location.search.includes("checkout_status=success")) {
      setModalStep("esign");
    } else {
      setModalStep("details");
    }
    setEsignName("");
    setSelectedAddons([]);
    if (bookingDates.length > 0) {
      setSelectedDate(formatDate(bookingDates[0]));
    }
    if (timeSlots.length > 0) {
      setSelectedTime(timeSlots[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModalBike]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Capture checkout redirect parameters on mount / search change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const checkoutStatus = params.get("checkout_status");
      const bikeId = params.get("bike");
      const planId = params.get("plan");
      const addonsId = params.get("addons");

      if (checkoutStatus === "success" && bikeId) {
        const bike = FLEET_BIKES.find(b => b.id === bikeId || b.slug === bikeId);
        if (bike) {
          setActiveModalBike(bike);
          setSelectedPlan(planId || "plus");
          if (addonsId) {
            setSelectedAddons(addonsId.split(",").filter(Boolean));
          } else {
            setSelectedAddons([]);
          }
          setModalStep("esign");
        }
        // Clean query parameters from URL without page reload after a short delay
        setTimeout(() => {
          const cleanParams = new URLSearchParams(window.location.search);
          cleanParams.delete("checkout_status");
          cleanParams.delete("bike");
          cleanParams.delete("plan");
          cleanParams.delete("addons");
          const searchStr = cleanParams.toString();
          const base = window.location.pathname + (searchStr ? `?${searchStr}` : "");
          window.history.replaceState(null, "", base);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Synchronize browser URL with the open bike modal and its active step for deep-linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeModalBike) {
        const path = `/fleets/${activeModalBike.slug}`;
        const searchParamsObj = new URLSearchParams(window.location.search);
        
        // Strip temporary checkout parameters from being set in the URL
        searchParamsObj.delete("checkout_status");
        searchParamsObj.delete("bike");
        searchParamsObj.delete("plan");

        // Sync modalStep to the URL search params if it is not details
        if (modalStep && modalStep !== "details") {
          searchParamsObj.set("step", modalStep);
        } else {
          searchParamsObj.delete("step");
        }

        const searchStr = searchParamsObj.toString();
        const fullPath = localizeHref(locale, path) + (searchStr ? `?${searchStr}` : "");
        
        if (window.location.pathname + window.location.search !== fullPath) {
          window.history.replaceState(null, "", fullPath);
        }
      } else {
        const base = localizeHref(locale, "/fleets");
        if (window.location.pathname !== base && !window.location.search.includes("checkout_status=success")) {
          window.history.replaceState(null, "", base);
        }
      }
    }
  }, [activeModalBike, modalStep, locale]);

  // Initialize modal step based on URL query parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlStep = params.get("step");
      if (initialBikeSlug && urlStep) {
        const validSteps = ["details", "plans", "verification", "esign", "booking", "success"];
        if (validSteps.includes(urlStep)) {
          setModalStep(urlStep);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to popstate event (browser back/forward navigation) to sync modal step
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlStep = params.get("step") || "details";
        
        // Find which bike (if any) is currently in the URL pathname
        const pathSegments = window.location.pathname.split("/");
        const lastSegment = pathSegments[pathSegments.length - 1];
        const bike = FLEET_BIKES.find(b => b.slug === lastSegment);
        
        if (bike) {
          setActiveModalBike(bike);
          const validSteps = ["details", "plans", "verification", "esign", "booking", "success"];
          if (validSteps.includes(urlStep)) {
            setModalStep(urlStep);
          }
        } else {
          setActiveModalBike(null);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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

  const formatPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Gallery dummy images (duplicate single image 3 times)
  const modalImages = activeModalBike
    ? [activeModalBike.image, activeModalBike.image, activeModalBike.image]
    : [];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0));
  };

  const handleContinueFromPlans = () => {
    setModalStep("addons");
  };

  const handleContinueFromAddons = () => {
    if (activeModalBike) {
      router.push(localizeHref(locale, `/checkout?bike=${activeModalBike.id}&plan=${selectedPlan}&addons=${selectedAddons.join(",")}`));
    }
  };

  // Flow views rendering functions
  const renderPlansView = () => {
    const plans = [
      {
        id: "basic",
        name: dict.planBasic || "Basic",
        desc: dict.planBasicDesc || "Basic Tier for Minimum Coverage",
        price: activeModalBike.price,
        popular: false,
        features: [
          { name: dict.gpsTracking || "GPS Tracking", included: true },
          { name: dict.theftInsurance || "Theft Insurance", included: true },
          { name: dict.servicePoint1 || "1 Service Point", included: true },
          { name: dict.basicSupport || "Support (Office Hours)", included: true }
        ]
      },
      {
        id: "plus",
        name: dict.planPlus || "Plus",
        desc: dict.planPlusDesc || "Plus Tier for Balanced Coverage",
        price: activeModalBike.price + 7000,
        popular: true,
        features: [
          { name: dict.gpsTracking || "GPS Tracking", included: true },
          { name: dict.theftInsurance || "Theft Insurance", included: true },
          { name: dict.multipleServicePoints || "Multiple Service Points", included: true },
          { name: dict.supportHours || "Support (09:00 - 18:00)", included: true }
        ]
      },
      {
        id: "max",
        name: dict.planMax || "Max",
        desc: dict.planMaxDesc || "Max Tier for Comprehensive Coverage",
        price: activeModalBike.price + 14000,
        popular: false,
        features: [
          { name: dict.gpsTracking || "GPS Tracking", included: true },
          { name: dict.theftInsurance || "Theft Insurance", included: true },
          { name: dict.nationwideServicePoints || "Nationwide Service Points", included: true },
          { name: dict.support247 || "Support 24/7", included: true }
        ]
      }
    ];

    const currentSelectedPlanObj = plans.find(p => p.id === selectedPlan) || plans[1];

    return (
      <div className={styles.flowPlansView}>
        <div className={styles.flowHeader}>
          <div className={styles.flowHeaderMain}>
            <div className={styles.flowHeaderImgWrapper}>
              <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
            </div>
            <div>
              <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
              <p className={styles.flowHeaderSubtitle}>{dict.chooseRentalPlan || "Choose a rental plan to continue"}</p>
            </div>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ""} ${isSelected ? styles.planCardSelected : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <span className={styles.popularBadge}>{dict.popularBadge || "POPULAR"}</span>}
                {isSelected && (
                  <div className={styles.selectedCheckIcon}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <span className={styles.planLabel}>{dict.planLabel || "PLAN"}</span>
                <h4 className={styles.planName}>{plan.name}</h4>
                <p className={styles.planDesc}>{plan.desc}</p>
                <div className={styles.planPriceRow}>
                  <span className={styles.planPrice}>{formatPrice(plan.price)} Ft</span>
                  <span className={styles.planPeriod}>{dict.perMonthShort || "/ mo"}</span>
                </div>
                <div className={styles.planFeatures}>
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className={styles.planFeatureItem}>
                      <svg className={styles.featureCheckIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.flowFooter}>
          <button className={styles.flowBackBtn} onClick={() => setModalStep("details")} type="button">
            {dict.backToDetails || "Back to details"}
          </button>
          <div className={styles.selectedPlanSummary}>
            <span className={styles.summaryLabel}>{dict.selectedPlanText || "SELECTED"}:</span>
            <span className={styles.summaryValue}>
              {currentSelectedPlanObj.name} - {formatPrice(currentSelectedPlanObj.price)} Ft/mo
            </span>
          </div>
          <button className={styles.flowContinueBtn} onClick={handleContinueFromPlans} type="button">
            {isHu ? "Kiegészítők kiválasztása" : "Select Add-ons"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderAddonsView = () => {
    const isHu = locale === "hu";
    const addons = [
      { id: "rack", name: dict.addonRack || (isHu ? "Nagy teherbírású csomagtartó" : "Heavy Cargo Rack"), desc: isHu ? "Masszív csomagtartó a hátsó részen." : "Heavy duty rear rack for deliveries.", price: 1200 },
      { id: "battery", name: dict.addonBattery || (isHu ? "Kiterjesztett akkumulátor" : "Extended Battery"), desc: isHu ? "Dupla kapacitású, kiterjesztett akkumulátor." : "Double capacity battery pack.", price: 2500 },
      { id: "mount", name: dict.addonMount || (isHu ? "Telefontartó és USB" : "Phone Mount & USB"), desc: isHu ? "Biztonságos telefontartó USB töltővel." : "Secure phone holder with USB charging port.", price: 500 }
    ];

    return (
      <div className={styles.flowPlansView}>
        <div className={styles.flowHeader}>
          <div className={styles.flowHeaderMain}>
            <div className={styles.flowHeaderImgWrapper}>
              <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
            </div>
            <div>
              <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
              <p className={styles.flowHeaderSubtitle}>{isHu ? "Válasszon kiegészítőket a bérléshez" : "Select optional add-ons to customize your rental"}</p>
            </div>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                className={`${styles.planCard} ${isSelected ? styles.planCardSelected : ""}`}
                onClick={() => {
                  setSelectedAddons((prev) =>
                    prev.includes(addon.id)
                      ? prev.filter((id) => id !== addon.id)
                      : [...prev, addon.id]
                  );
                }}
              >
                {isSelected && (
                  <div className={styles.selectedCheckIcon}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <span className={styles.planLabel}>{isHu ? "KIEGÉSZÍTŐ" : "ADD-ON"}</span>
                <h4 className={styles.planName}>{addon.name}</h4>
                <p className={styles.planDesc}>{addon.desc}</p>
                <div className={styles.planPriceRow}>
                  <span className={styles.planPrice}>+{formatPrice(addon.price)} Ft</span>
                  <span className={styles.planPeriod}>{dict.perMonthShort || "/ mo"}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.flowFooter}>
          <button className={styles.flowBackBtn} onClick={() => setModalStep("plans")} type="button">
            {isHu ? "Vissza a csomagokhoz" : "Back to plans"}
          </button>
          <div className={styles.selectedPlanSummary}>
            <span className={styles.summaryLabel}>{isHu ? "KIVÁLASZTOTT" : "SELECTED"}:</span>
            <span className={styles.summaryValue}>
              {selectedAddons.length} {dict.addonsSuffix || (isHu ? "kiegészítő" : "add-ons")}
            </span>
          </div>
          <button className={styles.flowContinueBtn} onClick={handleContinueFromAddons} type="button">
            {dict.rentNow || "Rent now"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderVerificationView = () => {
    if (verificationStatus === "unsubmitted") {
      return (
        <div className={styles.flowVerificationView}>
          <div className={styles.flowHeader}>
            <div className={styles.flowHeaderMain}>
              <div className={styles.flowHeaderImgWrapper}>
                <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
              </div>
              <div>
                <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
                <p className={styles.flowHeaderSubtitle}>{dict.docVerificationRequired || "Document verification required"}</p>
              </div>
            </div>
          </div>

          <div className={styles.verificationBody}>
            <div className={`${styles.verificationIconWrapper} ${styles.verificationIconUnsubmitted}`}>
              <svg className={styles.verificationIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="13" x2="12" y2="17" />
                <line x1="12" y1="9" x2="12" y2="9.01" />
              </svg>
            </div>
            <h4 className={styles.verificationTitle}>{dict.verificationRequired || "Identity Verification Required"}</h4>
            <p className={styles.verificationDesc}>
              {dict.verificationRequiredDesc || "You need to upload your identity document (ID or Passport) and address card before you can rent a vehicle."}
            </p>
          </div>

          <div className={styles.flowFooter}>
            <button className={styles.flowBackBtn} onClick={() => setModalStep("plans")} type="button">
              {dict.backToPlans || "Back to plans"}
            </button>
            <div style={{ flexGrow: 1 }} />
            <Link href="/profile/current?tab=documents" className={styles.flowContinueBtn}>
              {dict.uploadDocuments || "Upload Documents"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      );
    }

    if (verificationStatus === "pending") {
      return (
        <div className={styles.flowVerificationView}>
          <div className={styles.flowHeader}>
            <div className={styles.flowHeaderMain}>
              <div className={styles.flowHeaderImgWrapper}>
                <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
              </div>
              <div>
                <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
                <p className={styles.flowHeaderSubtitle}>{dict.docVerificationRequired || "Document verification required"}</p>
              </div>
            </div>
          </div>

          <div className={styles.verificationBody}>
            <div className={styles.verificationIconWrapper}>
              <svg className={styles.verificationIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h4 className={styles.verificationTitle}>{dict.documentsUnderReview || "Documents Under Review"}</h4>
            <p className={styles.verificationDesc}>
              {dict.documentsUnderReviewDesc || "Your documents are awaiting admin approval. You'll be able to rent once they're approved."}
            </p>
          </div>

          <div className={styles.flowFooter}>
            <button className={styles.flowBackBtn} onClick={() => setModalStep("plans")} type="button">
              {dict.backToPlans || "Back to plans"}
            </button>
            <div style={{ flexGrow: 1 }} />
            <Link href="/profile/current" className={styles.flowContinueBtn}>
              {dict.goToProfile || "Go to Profile"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      );
    }

    // Default or verified state (just in case they navigate here)
    return (
      <div className={styles.flowVerificationView}>
        <div className={styles.flowHeader}>
          <div className={styles.flowHeaderMain}>
            <div className={styles.flowHeaderImgWrapper}>
              <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
            </div>
            <div>
              <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
              <p className={styles.flowHeaderSubtitle}>{dict.verificationSuccess || "Account Verified"}</p>
            </div>
          </div>
        </div>

        <div className={styles.verificationBody}>
          <div className={`${styles.verificationIconWrapper} ${styles.verificationIconVerified}`}>
            <svg className={styles.verificationIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h4 className={styles.verificationTitle}>{dict.verificationSuccess || "Account Verified"}</h4>
          <p className={styles.verificationDesc}>
            {dict.verificationSuccessDesc || "Your account is verified! You can proceed with the rental agreement."}
          </p>
        </div>

        <div className={styles.flowFooter}>
          <button className={styles.flowBackBtn} onClick={() => setModalStep("plans")} type="button">
            {dict.backToPlans || "Back to plans"}
          </button>
          <div style={{ flexGrow: 1 }} />
          <button className={styles.flowContinueBtn} onClick={() => setModalStep("esign")} type="button">
            {dict.proceedToEsign || "Proceed to E-Sign"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderEsignView = () => {
    const rentPrice = activeModalBike.price + (selectedPlan === "plus" ? 7000 : selectedPlan === "max" ? 14000 : 0);
    return (
      <div className={styles.flowEsignView}>
        <div className={styles.flowHeader}>
          <div className={styles.flowHeaderMain}>
            <div className={styles.flowHeaderImgWrapper}>
              <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
            </div>
            <div>
              <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
              <p className={styles.flowHeaderSubtitle}>{dict.esignTitle || "E-Sign Lease Agreement"}</p>
            </div>
          </div>
        </div>

        <div className={styles.esignBody}>
          <p className={styles.esignInstructions}>
            {dict.esignSubtitle || "Please sign the digital contract to proceed with your rental."}
          </p>
          <div className={styles.contractPreview}>
            <h5>{dict.docTitle || "Lease Agreement"}</h5>
            <p>
              {dict.contractIntro || "This digital agreement is made between E-Renty Kft. and the undersigned customer for the rental of the following vehicle:"} <strong>{activeModalBike.brand} {activeModalBike.model}</strong>.
            </p>
            <p>
              <strong>{dict.contractSelectedPlan || "Selected Plan:"}</strong> {planLabelFor(selectedPlan)} ({formatPrice(rentPrice)} {dict.ftPerMonth || "Ft/mo"})<br />
              {selectedAddons.length > 0 && (
                <>
                  <strong>{locale === "hu" ? "Kiválasztott kiegészítők:" : "Selected Add-ons:"}</strong>{" "}
                  {selectedAddons.map(id => {
                    if (id === "rack") return dict.addonRack || "Heavy Cargo Rack";
                    if (id === "battery") return dict.addonBattery || "Extended Battery";
                    if (id === "mount") return dict.addonMount || "Phone Mount & USB";
                    return id;
                  }).join(", ")}<br />
                </>
              )}
              <strong>{dict.contractIncludedServices || "Included Services:"}</strong> {dict.contractServicesList || "GPS anti-theft tracking, comprehensive theft and accident insurance, and maintenance service as per plan details."}
            </p>
            <p>
              {dict.contractTerms || "The customer agrees to maintain the vehicle in good condition, report any damages immediately, and adhere to local traffic regulations."}
            </p>
          </div>
          <div className={styles.signatureInputGroup}>
            <label htmlFor="esign-name" className={styles.esignLabel}>
              {dict.typeFullName || "Type your full name to e-sign:"}
            </label>
            <input
              id="esign-name"
              type="text"
              className={styles.esignInput}
              placeholder={dict.placeholderFullName || "e.g. John Doe"}
              value={esignName}
              onChange={(e) => setEsignName(e.target.value)}
            />
            {esignName.trim() && (
              <div className={styles.digitalSignatureBox}>
                <span className={styles.signedLabel}>{dict.signedBy || "Digitally Signed By:"}</span>
                <span className={styles.scriptSignature}>{esignName}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.flowFooter}>
          <Link href="/profile/current" className={styles.flowBackBtn}>
            {dict.goToProfile || "Go to Profile"}
          </Link>
          <div style={{ flexGrow: 1 }} />
          <button
            className={styles.flowContinueBtn}
            disabled={!esignName.trim()}
            onClick={() => setModalStep("booking")}
            type="button"
          >
            {dict.proceedToBooking || "Proceed to Booking"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderBookingView = () => {
    return (
      <div className={styles.flowBookingView}>
        <div className={styles.flowHeader}>
          <div className={styles.flowHeaderMain}>
            <div className={styles.flowHeaderImgWrapper}>
              <Image src={activeModalBike.image} alt={activeModalBike.model} width={50} height={40} className={styles.flowHeaderImg} />
            </div>
            <div>
              <h3 className={styles.flowHeaderTitle}>{activeModalBike.brand} {activeModalBike.model}</h3>
              <p className={styles.flowHeaderSubtitle}>{dict.bookingTitle || "Appoint Booking"}</p>
            </div>
          </div>
        </div>

        <div className={styles.bookingBody}>
          <p className={styles.bookingInstructions}>
            {dict.bookingSubtitle || "Select a pickup date and time slot at our central workshop."}
          </p>

          <div className={styles.dateSelectorSection}>
            <h5 className={styles.sectionTitle}>{dict.selectDate || "Select Date"}</h5>
            <div className={styles.dateGrid}>
              {bookingDates.map((date, idx) => {
                const formatted = formatDate(date);
                const isSelected = selectedDate === formatted;
                return (
                  <button
                    key={idx}
                    className={`${styles.dateCard} ${isSelected ? styles.dateCardSelected : ""}`}
                    onClick={() => setSelectedDate(formatted)}
                    type="button"
                  >
                    <span className={styles.dateWeekday}>
                      {date.toLocaleDateString(locale === "hu" ? "hu-HU" : "en-US", { weekday: "short" })}
                    </span>
                    <span className={styles.dateDay}>
                      {date.getDate()}
                    </span>
                    <span className={styles.dateMonth}>
                      {date.toLocaleDateString(locale === "hu" ? "hu-HU" : "en-US", { month: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.timeSelectorSection}>
            <h5 className={styles.sectionTitle}>{dict.selectTimeSlot || "Select Time Slot"}</h5>
            <div className={styles.timeGrid}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    className={`${styles.timeCard} ${isSelected ? styles.timeCardSelected : ""}`}
                    onClick={() => setSelectedTime(slot)}
                    type="button"
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.flowFooter}>
          <button className={styles.flowBackBtn} onClick={() => setModalStep("esign")} type="button">
            {dict.backToPlans || "Back"}
          </button>
          <div style={{ flexGrow: 1 }} />
          <button
            className={styles.flowContinueBtn}
            disabled={!selectedDate || !selectedTime}
            onClick={() => setModalStep("success")}
            type="button"
          >
            {dict.confirmBooking || "Confirm Booking & Rent"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessView = () => {
    return (
      <div className={styles.flowSuccessView}>
        <div className={styles.successBody}>
          <div className={styles.successIconWrapper}>
            <svg className={styles.successCheckmark} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 className={styles.successTitle}>{dict.successTitle || "Booking Confirmed!"}</h4>
          <p className={styles.successSubtitle}>
            {dict.successSubtitle || "Your vehicle is ready. We look forward to seeing you at our central Budapest workshop."}
          </p>
          <div className={styles.bookingReceiptCard}>
            <div className={styles.receiptRow}>
              <span>{dict.receiptVehicle || "Vehicle:"}</span>
              <strong>{activeModalBike.brand} {activeModalBike.model}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>{dict.receiptPlan || "Rental Plan:"}</span>
              <strong>{planLabelFor(selectedPlan)}</strong>
            </div>
            {selectedAddons.length > 0 && (
              <div className={styles.receiptRow}>
                <span>{locale === "hu" ? "Kiegészítők:" : "Add-ons:"}</span>
                <strong>
                  {selectedAddons.map(id => {
                    if (id === "rack") return dict.addonRack || "Heavy Cargo Rack";
                    if (id === "battery") return dict.addonBattery || "Extended Battery";
                    if (id === "mount") return dict.addonMount || "Phone Mount & USB";
                    return id;
                  }).join(", ")}
                </strong>
              </div>
            )}
            <div className={styles.receiptRow}>
              <span>{dict.pickupAt || "Pickup date & time:"}</span>
              <strong>{selectedDate} @ {selectedTime}</strong>
            </div>
          </div>
          <p className={styles.successEmailNotice}>
            {dict.emailSentNotice || "A copy of your signed contract and booking details has been sent to your email."}
          </p>
        </div>

        <div className={styles.flowFooter} style={{ justifyContent: "center" }}>
          <button className={styles.flowFinishBtn} onClick={closeModal} type="button">
            {dict.finishBtn || "Finish"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Immersive Typographic Hero Section */}
      <section className={styles.cleanHero}>
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroTitleCentered}>{dict.heroTitle || "Go Green. Go Electric."}</h1>
          <p className={styles.heroSubtitleCentered}>
            {dict.heroSubtitle || "Smart GPS, anti-theft insurance, and 24/7 service included. Pick the bike that fits your urban journey."}
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

            {/* Desktop-only SVG Connector Lines */}
            <svg className={styles.desktopConnectorSvg} viewBox="0 0 560 350" width="560" height="350" overflow="visible">
              {/* Handlebars (0) */}
              <path
                d="M 600 60 C 500 60, 420 80.5, 324.8 80.5"
                className={`${styles.connectorPath} ${activeHotspot === 0 ? styles.connectorPathActive : ""}`}
              />
              {/* Seat (1) */}
              <path
                d="M -50 60 C 50 60, 120 101.5, 218.4 101.5"
                className={`${styles.connectorPath} ${activeHotspot === 1 ? styles.connectorPathActive : ""}`}
              />
              {/* Battery (2) */}
              <path
                d="M 280 380 C 280 280, 263.2 240, 263.2 164.5"
                className={`${styles.connectorPath} ${activeHotspot === 2 ? styles.connectorPathActive : ""}`}
              />
              {/* Motor (3) */}
              <path
                d="M -50 270 C 20 270, 80 241.5, 162.4 241.5"
                className={`${styles.connectorPath} ${activeHotspot === 3 ? styles.connectorPathActive : ""}`}
              />
              {/* Tires (4) */}
              <path
                d="M 600 270 C 530 270, 470 238, 397.6 238"
                className={`${styles.connectorPath} ${activeHotspot === 4 ? styles.connectorPathActive : ""}`}
              />
            </svg>

            {/* Pulsing Hotspots */}
            {HERO_HOTSPOTS.map((hotspot, idx) => {
              const localizedTitle = dict.hotspots?.[hotspot.id]?.title || hotspot.title;
              const localizedDesc = dict.hotspots?.[hotspot.id]?.desc || hotspot.desc;
              return (
                <div
                  key={hotspot.id}
                  className={styles.hotspotWrapper}
                  style={{ top: hotspot.top, left: hotspot.left }}
                  onMouseEnter={() => setActiveHotspot(idx)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <button
                    className={`${styles.hotspotDot} ${activeHotspot === idx ? styles.hotspotDotActive : ""}`}
                    aria-label={`View details about ${localizedTitle}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(prev => (prev === idx ? null : idx));
                    }}
                  >
                    <span className={styles.hotspotPulse}></span>
                  </button>

                  {/* Tooltip Card */}
                  <div
                    className={`${styles.hotspotTooltip} ${styles[`tooltip_${hotspot.id}`]} ${
                      activeHotspot === idx ? styles.tooltipVisible : ""
                    } ${hotspot.align === "right" ? styles.tooltipAlignRight : ""}`}
                  >
                    <h4 className={styles.tooltipTitle}>{localizedTitle}</h4>
                    <p className={styles.tooltipDesc}>{localizedDesc}</p>
                  </div>
                </div>
              );
            })}
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
                type="button"
              >
                {dict.categories?.[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1))}
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
                type="button"
              >
                {dict.filterBrand || "Brand"} {selectedBrands.length > 0 ? `(${selectedBrands.length})` : ""}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isBrandDropdownOpen && (
                <div className={styles.glassPopover}>
                  <div className={styles.popoverHeader}>
                    <span>{dict.filterBrandTitle || "Filter by Brand"}</span>
                    <div className={styles.popoverHeaderActions}>
                      <button type="button" onClick={handleSelectAllBrands} className={styles.popoverActionBtn}>{dict.selectAll || "Select All"}</button>
                      <span className={styles.popoverActionDivider}>/</span>
                      <button type="button" onClick={handleClearAllBrands} className={styles.popoverActionBtn}>{dict.clearAll || "Clear All"}</button>
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
                type="button"
              >
                {dict.filterPrice || "Price"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isPriceDropdownOpen && (
                <div className={styles.glassPopover} style={{ width: "260px" }}>
                  <div className={styles.popoverHeader}>{dict.filterPriceTitle || "Price Range (Monthly)"}</div>
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
                type="button"
              >
                <span>
                  {sortBy === "price-asc" && (dict.sortOptions?.["price-asc"] || "Price: Low to High")}
                  {sortBy === "price-desc" && (dict.sortOptions?.["price-desc"] || "Price: High to Low")}
                  {sortBy === "range-desc" && (dict.sortOptions?.["range-desc"] || "Range: Longest First")}
                  {sortBy === "motor-desc" && (dict.sortOptions?.["motor-desc"] || "Power: Highest First")}
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
                      type="button"
                    >
                      {dict.sortOptions?.["price-asc"] || "Price: Low to High"}
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "price-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("price-desc");
                        setIsSortDropdownOpen(false);
                      }}
                      type="button"
                    >
                      {dict.sortOptions?.["price-desc"] || "Price: High to Low"}
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "range-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("range-desc");
                        setIsSortDropdownOpen(false);
                      }}
                      type="button"
                    >
                      {dict.sortOptions?.["range-desc"] || "Range: Longest First"}
                    </button>
                    <button
                      className={`${styles.sortOption} ${sortBy === "motor-desc" ? styles.activeSortOption : ""}`}
                      onClick={() => {
                        setSortBy("motor-desc");
                        setIsSortDropdownOpen(false);
                      }}
                      type="button"
                    >
                      {dict.sortOptions?.["motor-desc"] || "Power: Highest First"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedBrands.length > 0 || priceMin > 40000 || priceMax < 120000 || selectedCategory !== "all") && (
              <button className={styles.clearBtnClean} onClick={handleClearFilters} aria-label="Reset all filters" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.resetIcon}>
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                {dict.reset || "Reset"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Catalog Grid */}
      <section className={styles.gridSection}>
        <div className={styles.resultsSummary}>
          {sortedBikes.length} {sortedBikes.length === 1 ? (dict.resultsSingle || "bike matches") : (dict.resultsMultiple || "bikes match")}
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
                    <span className={styles.cardCategoryBadge}>{dict.categories?.[bike.category] || bike.category}</span>
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
                        <span className={styles.priceMo}>{dict.modalPeriod || "/ month"}</span>
                      </div>
                    </div>

                    <div className={styles.cardInfoRight}>
                      {/* Specs Row */}
                      <div className={styles.cardSpecsRow}>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>{dict.modalRange ? dict.modalRange.replace(":", "") : "Range"}</span>
                          <span className={styles.specLabelVal}>{bike.range}</span>
                        </div>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>{dict.modalMotor ? dict.modalMotor.replace(":", "") : "Motor"}</span>
                          <span className={styles.specLabelVal}>{bike.motor}</span>
                        </div>
                        <div className={styles.cardSpecCol}>
                          <span className={styles.specLabelTitle}>{dict.modalSpeed ? dict.modalSpeed.replace(":", "") : "Speed"}</span>
                          <span className={styles.specLabelVal}>{bike.topSpeed}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveModalBike(bike)}
                        className={styles.portfolioRentLink}
                        type="button"
                      >
                        {dict.viewDetails || "View details"}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResultsBox}>
              <h3 className={styles.noResultsHeader}>{dict.noResults || "No fleets match this search"}</h3>
              <p className={styles.noResultsDetail}>
                {dict.noResultsDetail || "Try adjusting your brand toggles, category selectors, or price range inputs."}
              </p>
              <button className={styles.resetSearchBtn} onClick={handleClearFilters} type="button">
                {dict.resetFilters || "Reset Filter Parameters"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Bike Detail Modal / Checkout Flow */}
      {activeModalBike && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={`${styles.modalWrapper} ${modalStep !== "details" ? styles.modalWrapperLarge : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeModalBtn} onClick={closeModal} aria-label="Close modal" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {modalStep === "details" ? (
              <>
                {/* Left Image Showcase Panel - Strict 5:4 aspect ratio */}
                <div className={styles.modalImageArea}>
                  {/* Vertical Thumbnails Sidebar */}
                  <div className={styles.thumbnailColumn}>
                    {modalImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`${styles.thumbnailBtn} ${activeImageIndex === idx ? styles.activeThumbnail : ""}`}
                        onClick={() => setActiveImageIndex(idx)}
                        type="button"
                        aria-label={`Show image ${idx + 1}`}
                      >
                        <div className={styles.thumbnailImgWrapper}>
                          <Image
                            src={img}
                            alt={`${activeModalBike.brand} ${activeModalBike.model} thumbnail ${idx + 1}`}
                            fill
                            sizes="60px"
                            className={styles.thumbnailImg}
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Main Image Container */}
                  <div className={styles.mainImageContainer}>
                    {modalImages.length > 1 && (
                      <>
                        <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={handlePrevImage} type="button">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                        </button>
                        <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={handleNextImage} type="button">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </>
                    )}
                    <Image
                      src={modalImages[activeImageIndex]}
                      alt={`${activeModalBike.brand} ${activeModalBike.model}`}
                      fill
                      className={styles.modalBikeImage}
                      sizes="(max-width: 991px) 100vw, 55vw"
                      priority
                    />
                  </div>
                </div>

                {/* Right Information Details Panel */}
                <div className={styles.modalInfoArea}>
                  <div className={styles.modalEyebrowRow}>
                    <span className={styles.modalCategoryBadge}>{dict.categories?.[activeModalBike.category] || activeModalBike.category}</span>
                    <span className={styles.modalBrand}>{activeModalBike.brand}</span>
                  </div>
                  <h2 className={styles.modalTitle}>{activeModalBike.model}</h2>

                  <div className={styles.modalPriceRow}>
                    <span className={styles.modalPriceLabel}>{dict.modalStartingFrom || "Starting From"}</span>
                    <span className={styles.modalPriceValue}>{formatPrice(activeModalBike.price)} Ft</span>
                    <span className={styles.modalPricePeriod}>{dict.modalPeriod || "/ month"}</span>
                  </div>

                  <div className={styles.modalSpecsList}>
                    <div className={styles.modalSpecItem}>
                      <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span><strong>{dict.modalRange || "Range:"}</strong> {activeModalBike.range}{dict.modalRangeDetail || " (Pedal Assist / Dual mode options)"}</span>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span><strong>{dict.modalSpeed || "Top speed:"}</strong> {activeModalBike.topSpeed}{dict.modalSpeedDetail || " (Electronically optimized)"}</span>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      <span><strong>{dict.modalMotor || "Motor capacity:"}</strong> {activeModalBike.motor}{dict.modalMotorDetail || " brushless peak output"}</span>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span><strong>{dict.modalSecurity || "Security:"}</strong> {dict.modalSecurityDetail || "Smart GPS tracking + Remote anti-theft app lock"}</span>
                    </div>
                    <div className={styles.modalSpecItem}>
                      <svg className={styles.modalSpecIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span><strong>{dict.modalInsurance || "Insurance:"}</strong> {dict.modalInsuranceDetail || "Full comprehensive damages & third party liability"}</span>
                    </div>
                  </div>

                  <div className={styles.modalFeaturesRow}>
                    <span className={styles.modalFeatureBadge}>
                      <svg className={styles.modalFeatureIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {dict.modalServiceSupport || "24/7 Service Support"}
                    </span>
                    <span className={styles.modalFeatureBadge}>
                      <svg className={styles.modalFeatureIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {dict.modalMaintenance || "Sub-24h Maintenance"}
                    </span>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      onClick={() => setModalStep("plans")}
                      className={styles.modalRentBtn}
                      type="button"
                    >
                      {dict.modalRentBtn || "View rental plan"}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                    <Link href="/courier-plus" className={styles.modalCourierBtn}>
                      {dict.modalCourierBtn || "View courier+ plan"}
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.flowContainer}>
                {modalStep === "plans" && renderPlansView()}
                {modalStep === "addons" && renderAddonsView()}
                {modalStep === "verification" && renderVerificationView()}
                {modalStep === "esign" && renderEsignView()}
                {modalStep === "booking" && renderBookingView()}
                {modalStep === "success" && renderSuccessView()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
