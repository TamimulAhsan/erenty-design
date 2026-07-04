"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "@/components/LocalizedLink";
import styles from "./checkout.module.css";

const PLANS = {
  basic: {
    name: "Basic",
    price: 9990,
    tagline: "Reliable coverage for everyday wear and tear.",
    features: [
      "GPS tracking",
      "Theft insurance",
      "1 service point",
      "0–24 online support",
    ],
  },
  extra: {
    name: "Extra",
    price: 16990,
    tagline: "A stronger package for riders who want broader repairs and faster support.",
    features: [
      "GPS tracking",
      "Theft insurance",
      "Service points across Hungary",
      "0–24 online support",
      "Phone support (9:00–18:00)",
    ],
  },
  max: {
    name: "Max",
    price: 24990,
    tagline: "Maximum protection for couriers who need the least possible downtime.",
    features: [
      "GPS tracking",
      "Theft insurance",
      "Service points across Hungary",
      "0–24 online support",
      "Phone support (9:00–18:00)",
      "Priority / express repair",
      "Replacement vehicle",
    ],
  },
};

const ADD_ONS = {
  punctureProof: { name: "Puncture Proof Tyre", price: 2000, subtext: "" },
  powerBank: { name: "Power bank", price: 2000, subtext: "20000 mAh" },
  extraBattery: { name: "Extra Battery", price: 17000, subtext: "" },
  helmet: { name: "Helmet", price: 1500, subtext: "" },
};

const CYCLE_MULTIPLIERS = {
  monthly: 1,
  quarterly: 3,
  "6months": 6,
  yearly: 12,
};

export default function CheckoutClient({ dict = {}, lang = "en" }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);

  const initialPlan = searchParams.get("plan") || "extra";
  const [planId, setPlanId] = useState(
    PLANS[initialPlan.toLowerCase()] ? initialPlan.toLowerCase() : "extra"
  );

  const initialBilling = searchParams.get("billing") || "monthly";
  const [billingCycle, setBillingCycle] = useState(
    CYCLE_MULTIPLIERS[initialBilling.toLowerCase()] ? initialBilling.toLowerCase() : "monthly"
  );

  const [vehicles, setVehicles] = useState(1);
  const [vins, setVins] = useState([""]);
  const [addOns, setAddOns] = useState({
    punctureProof: false,
    powerBank: false,
    extraBattery: false,
    helmet: false,
  });

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [showVinErrors, setShowVinErrors] = useState(false);

  const [toast, setToast] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const showToast = (message) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    setToast(message);
    const timeout = setTimeout(() => {
      setToast(null);
    }, 4000);
    setToastTimeout(timeout);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const platform = window.navigator.platform || "";
      const userAgent = window.navigator.userAgent || "";
      const isMacOrIOS = 
        /Mac|iPhone|iPad|iPod/.test(platform) || 
        (/Macintosh/.test(userAgent) && 'ontouchend' in document) || 
        /iPhone|iPad|iPod/.test(userAgent);
      setIsAppleDevice(!!isMacOrIOS);
    }

    // Generate date and random invoice ID once on client mount
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const monthsEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsHU = ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."];
    const monthName = lang === "hu" ? monthsHU[d.getMonth()] : monthsEN[d.getMonth()];
    const year = d.getFullYear();
    setInvoiceDate(lang === "hu" ? `${year}. ${monthName} ${day}.` : `${day} ${monthName} ${year}`);
    const rand = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNumber(`INV-${year}-${rand}`);
  }, [lang]);

  useEffect(() => {
    if (vins.length < vehicles) {
      const diff = vehicles - vins.length;
      setVins([...vins, ...Array(diff).fill("")]);
    } else if (vins.length > vehicles) {
      setVins(vins.slice(0, vehicles));
    }
  }, [vehicles]);

  const localizedPlan = (id) => {
    const rawPlan = PLANS[id] || PLANS.extra;
    const planDict = dict.plans?.[id] || {};
    return {
      ...rawPlan,
      name: planDict.name || rawPlan.name,
      tagline: planDict.tagline || rawPlan.tagline,
      features: planDict.features || rawPlan.features,
    };
  };

  const localizedAddon = (key) => {
    const rawAddon = ADD_ONS[key];
    if (lang === "hu") {
      const names = {
        punctureProof: "Defektálló gumiabroncs",
        powerBank: "Power bank",
        extraBattery: "Pótakkumulátor",
        helmet: "Bukósisak",
      };
      return {
        ...rawAddon,
        name: names[key] || rawAddon.name,
      };
    }
    return rawAddon;
  };

  const selectedPlan = localizedPlan(planId);
  const multiplier = CYCLE_MULTIPLIERS[billingCycle] || 1;

  const basePlanPricePeriod = Math.round(selectedPlan.price * multiplier * vehicles);

  const getCycleDisplayName = () => {
    if (billingCycle === "monthly") return dict.monthly || "Monthly";
    if (billingCycle === "quarterly") return dict.quarterly || "Quarterly";
    if (billingCycle === "6months") return dict["6months"] || "6-Month";
    if (billingCycle === "yearly") return dict.yearly || "Yearly";
    return billingCycle;
  };

  let addOnsPricePeriod = 0;
  Object.keys(addOns).forEach((key) => {
    if (addOns[key]) {
      // Add-ons are paid monthly flat, not multiplied by the cycle multiplier
      addOnsPricePeriod += ADD_ONS[key].price * vehicles;
    }
  });

  const subtotalPrice = basePlanPricePeriod + addOnsPricePeriod;
  const discountAmount = Math.round(subtotalPrice * (discountPercent / 100));
  const totalPriceDue = subtotalPrice - discountAmount;

  const getNextBillingDate = () => {
    const date = new Date();
    if (billingCycle === "monthly") {
      date.setMonth(date.getMonth() + 1);
    } else if (billingCycle === "quarterly") {
      date.setMonth(date.getMonth() + 3);
    } else if (billingCycle === "6months") {
      date.setMonth(date.getMonth() + 6);
    } else if (billingCycle === "yearly") {
      date.setFullYear(date.getFullYear() + 1);
    }

    const day = date.getDate();
    const monthsEN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsHU = ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."];
    const monthName = lang === "hu" ? monthsHU[date.getMonth()] : monthsEN[date.getMonth()];
    const year = date.getFullYear();
    return lang === "hu" ? `${year}. ${monthName} ${day}.` : `${day} ${monthName} ${year}`;
  };

  const formatPrice = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCodeInput.trim().toUpperCase();
    if (code === "SAVE10" || code === "ERENTY10" || code === "WELCOME") {
      setActiveCoupon(code);
      setDiscountPercent(10);
      setCouponCodeInput("");
    } else if (code === "") {
      setCouponError(dict.pleaseEnterCode || "Please enter a code");
    } else {
      setCouponError(dict.invalidCode || "Invalid promo code");
    }
  };

  const handleAutofillCard = () => {
    setCardName("John Doe");
    setCardNumber("4242 •••• •••• 4242");
    setCardExpiry("12/28");
    setCardCvc("123");
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate VINs are entered for all vehicles
      const hasEmptyVin = vins.some((vin) => !vin.trim());
      if (hasEmptyVin) {
        setShowVinErrors(true);
        showToast(dict.toastVinError || "Please enter a VIN / Frame Number for each vehicle.");
        return;
      }
      setShowVinErrors(false);
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      if (paymentMethod === "card") {
        if (!cardName.trim()) {
          showToast(dict.toastCardholderError || "Please enter the cardholder's name.");
          return;
        }

        const cleanCard = cardNumber.replace(/\s+/g, "").replace(/•/g, "");
        // Accept the dummy card "4242424242424242"
        if (!cleanCard || cleanCard.length < 12) {
          showToast(dict.toastCardNumberError || "Please enter a valid card number.");
          return;
        }

        if (!cardExpiry.trim() || !cardExpiry.includes("/")) {
          showToast(dict.toastExpiryError || "Please enter a valid expiry date (MM/YY).");
          return;
        }

        const expiryParts = cardExpiry.split("/");
        const expMonth = parseInt(expiryParts[0], 10);
        const expYear = parseInt(expiryParts[1], 10);
        if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
          showToast(dict.toastExpiryError || "Please enter a valid expiry date (MM/YY).");
          return;
        }

        const cleanCvc = cardCvc.trim();
        if (cleanCvc.length < 3 || cleanCvc.length > 4 || isNaN(parseInt(cleanCvc, 10))) {
          showToast(dict.toastCvcError || "Please enter a valid CVC.");
          return;
        }
      }
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <header className={styles.checkoutHeader}>
        <Link href="/courier-plus" className={styles.logoArea}>
          <span className={styles.logoText}>E-RENTY</span>
          {step < 3 && <span className={styles.checkoutBadge}>{dict.checkout || "Checkout"}</span>}
        </Link>

        {step < 3 ? (
          <>
            <div className={styles.progressSteps}>
              <div className={`${styles.stepItem} ${step === 1 ? styles.stepItemActive : ""} ${step > 1 ? styles.stepItemCompleted : ""}`}>
                <span className={styles.stepNumber}>
                  {step > 1 ? (
                    <span className={styles.stepCheckIcon}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  ) : "1"}
                </span>
                <span>{dict.configure || "Configure"}</span>
              </div>
              <div className={styles.stepDivider} />
              <div className={`${styles.stepItem} ${step === 2 ? styles.stepItemActive : ""} ${step > 2 ? styles.stepItemCompleted : ""}`}>
                <span className={styles.stepNumber}>2</span>
                <span>{dict.payment || "Payment"}</span>
              </div>
              <div className={styles.stepDivider} />
              <div className={`${styles.stepItem} ${step === 3 ? styles.stepItemActive : ""}`}>
                <span className={styles.stepNumber}>3</span>
                <span>{dict.confirm || "Confirm"}</span>
              </div>
            </div>
            <div className={styles.progressStepsMobile}>
              <span className={styles.mobileStepLabelFull}>
                {(dict.stepOf || "Step {step} of 2: {name}").replace("{step}", step).replace("{name}", step === 1 ? (dict.configure || "Configure") : (dict.payment || "Payment"))}
              </span>
              <span className={styles.mobileStepLabelShort}>
                {(dict.stepShort || "Step {step}/2").replace("{step}", step)}
              </span>
            </div>
          </>
        ) : (
          <div className={styles.confirmHeaderLabel}>
            {dict.orderConfirmation || "Order confirmation"}
          </div>
        )}

        <div className={styles.secureLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{dict.secureCheckout || "Secure checkout"}</span>
        </div>
      </header>

      <main className={styles.checkoutMain}>
        {step < 3 ? (
          <div className={styles.checkoutContainer}>
            <div className={styles.leftColumn}>
              {step === 1 ? (
                <>
                  <div>
                    <span className={styles.stepLabel}>{(dict.stepLabel || "Step {step} of 2").replace("{step}", 1)}</span>
                    <h1 className={`${styles.sectionTitle} h2`}>{dict.configureTitle || "Configure your subscription"}</h1>
                    <p className={styles.sectionSubtitle}>
                      {dict.configureSubtitle || "Select your plan, billing frequency and input your vehicles. Longer commitments save more."}
                    </p>
                  </div>

                  {/* Redesigned Plan Switcher: Selected Hero & Subgrid Alternatives */}
                  <div className={styles.planSwitcherHero}>
                    <div className={styles.planSwitcherHeroLeft}>
                      <div className={styles.planSwitcherHeroHeader}>
                        <span className={styles.planHeroLabel}>{dict.selectedPlanLabel || "Selected Coverage Plan"}</span>
                        <h3 className={styles.planHeroName}>
                          {dict.planSuffix ? `${selectedPlan.name} ${dict.planSuffix}` : `${selectedPlan.name} Plan`}
                        </h3>
                      </div>
                      <p className={styles.planHeroTagline}>{selectedPlan.tagline}</p>
                    </div>
                    <div className={styles.planSwitcherHeroRight}>
                      <div className={styles.planHeroPriceWrapper}>
                        <span className={styles.planHeroPrice}>
                          {formatPrice(selectedPlan.price)} Ft
                        </span>
                        <span className={styles.planHeroPeriod}>{dict.perMonthPerBike || "/ month / bike"}</span>
                      </div>
                      <div className={styles.planHeroRadioActive}>
                        <span>{dict.active || "Active"}</span>
                        <div className={styles.planHeroRadioDot} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.alternativesToggleWrapper}>
                    <button
                      type="button"
                      className={styles.alternativesToggleBtn}
                      onClick={() => setShowAlternatives(!showAlternatives)}
                    >
                      <span>{dict.switchCoverage || "Or switch to another coverage"}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: showAlternatives ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.25s ease",
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  <div className={`${styles.alternativesCollapse} ${showAlternatives ? styles.alternativesExpanded : ""}`}>
                    <div className={styles.planSwitcherGrid}>
                      {Object.keys(PLANS).map((key) => {
                        if (key === planId) return null;
                        const plan = localizedPlan(key);
                        return (
                          <div
                            key={key}
                            className={styles.planSwitcherCard}
                            onClick={() => setPlanId(key)}
                          >
                            <div className={styles.planSwitcherHeader}>
                              <span className={styles.planSwitcherName}>{plan.name}</span>
                              <div className={styles.planSwitcherRadio}>
                                <div className={styles.planSwitcherRadioInner} />
                              </div>
                            </div>
                            <p className={styles.planSwitcherTagline}>{plan.tagline}</p>
                            <div className={styles.planSwitcherPriceWrapper}>
                              <span className={styles.planSwitcherPrice}>
                                {formatPrice(plan.price)} Ft
                              </span>
                              <span className={styles.planSwitcherPeriod}>{dict.perMonthPerBike || "/ month / bike"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.sectionHeading}>{dict.billingCycle || "Billing Cycle"}</h4>
                    <div className={styles.cycleGrid}>
                      {/* Monthly */}
                      <div
                        className={`${styles.cycleCard} ${billingCycle === "monthly" ? styles.cycleSelected : ""}`}
                        onClick={() => setBillingCycle("monthly")}
                      >
                        <div className={styles.cycleHeader}>
                          <span className={styles.cycleName}>{dict.monthly || "Monthly"}</span>
                        </div>
                        <span className={styles.cyclePrice}>{formatPrice(selectedPlan.price)} Ft / {lang === "hu" ? "hó" : "month"}</span>
                        <span className={styles.cycleSavingsPlaceholder}>{dict.standardRate || "Standard rate"}</span>
                      </div>

                      {/* Quarterly */}
                      <div
                        className={`${styles.cycleCard} ${billingCycle === "quarterly" ? styles.cycleSelected : ""}`}
                        onClick={() => setBillingCycle("quarterly")}
                      >
                        <div className={styles.cycleHeader}>
                          <span className={styles.cycleName}>{dict.quarterly || "Quarterly"}</span>
                        </div>
                        <span className={styles.cyclePrice}>{formatPrice(selectedPlan.price * 3)} Ft / {dict.cycleSuffix || "cycle"}</span>
                        <span className={styles.cycleSavingsPlaceholder}>{dict.standardRate || "Standard rate"}</span>
                      </div>

                      {/* 6 Months */}
                      <div
                        className={`${styles.cycleCard} ${billingCycle === "6months" ? styles.cycleSelected : ""}`}
                        onClick={() => setBillingCycle("6months")}
                      >
                        <div className={styles.cycleHeader}>
                          <span className={styles.cycleName}>{dict["6months"] || "6 Months"}</span>
                        </div>
                        <span className={styles.cyclePrice}>{formatPrice(selectedPlan.price * 6)} Ft / {dict.cycleSuffix || "cycle"}</span>
                        <span className={styles.cycleSavingsPlaceholder}>{dict.standardRate || "Standard rate"}</span>
                      </div>

                      {/* Yearly */}
                      <div
                        className={`${styles.cycleCard} ${billingCycle === "yearly" ? styles.cycleSelected : ""}`}
                        onClick={() => setBillingCycle("yearly")}
                      >
                        <div className={styles.cycleHeader}>
                          <span className={styles.cycleName}>{dict.yearly || "Yearly"}</span>
                        </div>
                        <span className={styles.cyclePrice}>{formatPrice(selectedPlan.price * 12)} Ft / {dict.yearSuffix || "year"}</span>
                        <span className={styles.cycleSavingsPlaceholder}>{dict.standardRate || "Standard rate"}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.sectionHeading}>{dict.numVehicles || "Number of Vehicles"}</h4>
                    <div className={styles.counterRow}>
                      <div className={styles.counterControl}>
                        <button
                          type="button"
                          className={styles.counterBtn}
                          onClick={() => setVehicles(Math.max(1, vehicles - 1))}
                          disabled={vehicles <= 1}
                        >
                          —
                        </button>
                        <div className={styles.counterVal}>{vehicles}</div>
                        <button
                          type="button"
                          className={styles.counterBtn}
                          onClick={() => setVehicles(vehicles + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.counterLabelInfo}>
                        <span className={styles.counterMainPrice}>
                          {formatPrice(selectedPlan.price * vehicles)} Ft <span style={{ fontSize: "13px", fontWeight: "normal" }}>{lang === "hu" ? "/ hó" : "/ month"}</span>
                        </span>
                        <span className={styles.counterSubPrice}>
                          {formatPrice(selectedPlan.price)} Ft {dict.perVehicleMo || "per vehicle / month"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.sectionHeading}>{dict.vinHeading || "VIN / Frame Number"}</h4>
                    <p className={styles.sectionSubtitle} style={{ marginBottom: "16px", fontSize: "13px" }}>
                      {dict.vinSubtitle || "Enter the VIN or frame number for each vehicle. You can find this on the frame or in your vehicle documents."}
                    </p>
                    <div className={styles.vinInputsList}>
                      {vins.map((vin, idx) => (
                        <div key={idx} className={styles.vinField}>
                          {vehicles > 1 && (
                            <label className={styles.vinFieldLabel}>
                              {(dict.vehicleVinLabel || "Vehicle {number} VIN").replace("{number}", idx + 1)}
                            </label>
                          )}
                          <input
                            type="text"
                            placeholder="e.g. WBA3A5C50DF000001"
                            className={`${styles.textInput} ${showVinErrors && !vin.trim() ? styles.inputError : ""}`}
                            value={vin}
                            onChange={(e) => {
                              const updated = [...vins];
                              updated[idx] = e.target.value;
                              setVins(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.sectionHeading}>{dict.whatsIncluded || "What's Included"}</h4>
                    <div className={styles.includedGrid}>
                      {selectedPlan.features.map((feature, idx) => (
                        <div key={idx} className={styles.includedItem}>
                          <span className={styles.includedCheck}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h4 className={styles.sectionHeading}>{dict.optionalAddons || "Optional Add-ons"}</h4>
                    <div className={styles.addOnsList}>
                      {Object.keys(ADD_ONS).map((key) => {
                        const addon = localizedAddon(key);
                        return (
                          <div
                            key={key}
                            className={`${styles.addOnCard} ${addOns[key] ? styles.addOnSelected : ""}`}
                            onClick={() => setAddOns({ ...addOns, [key]: !addOns[key] })}
                          >
                            <div className={styles.addOnLeft}>
                              <div className={styles.addOnCheckbox}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div className={styles.addOnInfo}>
                                <span className={styles.addOnName}>{addon.name}</span>
                                {addon.subtext && <span className={styles.addOnSubtext}>{addon.subtext}</span>}
                              </div>
                            </div>
                            <div className={styles.addOnRight}>
                              <span className={styles.addOnPrice}>+{formatPrice(addon.price)} Ft</span>
                              <span className={styles.addOnPeriod}>{lang === "hu" ? "/ hó" : "/ month"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.backLinkRow}>
                    <Link href="/courier-plus" className={styles.backLink}>
                      {dict.backToPlans || "← Back to plans"}
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className={styles.stepLabel}>{(dict.stepLabel || "Step {step} of 2").replace("{step}", 2)}</span>
                    <h1 className={`${styles.sectionTitle} h2`}>{dict.howToPay || "How would you like to pay?"}</h1>
                    <p className={styles.sectionSubtitle}>
                      {dict.paySubtitle || "Pay now to activate your plan. We'll send a Hungarian VAT invoice within minutes."}
                    </p>
                  </div>

                  <div className={styles.paymentTabs}>
                    <div
                      className={`${styles.payTab} ${paymentMethod === "card" ? styles.payTabActive : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      {paymentMethod === "card" && (
                        <span className={styles.payTabCheck}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      <span className={styles.payTabIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </span>
                      <span className={styles.payTabLabel}>{dict.card || "Card"}</span>
                      <span className={styles.payTabDesc}>Visa, MC, Maestro</span>
                    </div>

                    <div
                      className={`${styles.payTab} ${paymentMethod === "gpay" ? styles.payTabActive : ""}`}
                      onClick={() => setPaymentMethod("gpay")}
                    >
                      {paymentMethod === "gpay" && (
                        <span className={styles.payTabCheck}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      <span className={styles.payTabIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                      </span>
                      <span className={styles.payTabLabel}>{dict.googlePay || "Google Pay"}</span>
                      <span className={styles.payTabDesc}>{lang === "hu" ? "Egy koppintás" : "One tap"}</span>
                    </div>

                    <div
                      className={`${styles.payTab} ${paymentMethod === "applepay" ? styles.payTabActive : ""} ${!isAppleDevice ? styles.payTabDisabled : ""}`}
                      onClick={() => {
                        if (!isAppleDevice) {
                          showToast(dict.applePayError || "Apple Pay is only available on iOS or macOS devices.");
                          return;
                        }
                        setPaymentMethod("applepay");
                      }}
                    >
                      {paymentMethod === "applepay" && (
                        <span className={styles.payTabCheck}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      <span className={styles.payTabIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#8E8E93" }}>
                        <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                        </svg>
                      </span>
                      <span className={styles.payTabLabel}>{dict.applePay || "Apple Pay"}</span>
                      <span className={styles.payTabDesc}>{lang === "hu" ? "Csak iOS / macOS" : "iOS / macOS only"}</span>
                    </div>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className={styles.formSection}>
                      <div className={styles.stripeHeader}>
                        <h4 className={styles.stripeTitle}>{dict.cardDetails || "Card details"}</h4>
                        <span className={styles.stripeLabel}>{dict.securedByStripe || "Secured by Stripe"}</span>
                      </div>

                      <div className={styles.vinInputsList} style={{ marginTop: "16px" }}>
                        <div className={styles.vinField}>
                          <input
                            type="text"
                            placeholder={dict.nameOnCard || "Name on card"}
                            className={styles.textInput}
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>

                        <div className={styles.cardNumberWrapper}>
                          <span className={styles.cardIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                              <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            placeholder="1234 1234 1234 1234"
                            className={`${styles.textInput} ${styles.stripeInput}`}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                          <button
                            type="button"
                            className={styles.autofillBtn}
                            onClick={handleAutofillCard}
                          >
                            {lang === "hu" ? "Kitöltés ➔" : "Autofill ➔"}
                          </button>
                        </div>

                        <div className={styles.cardInputRow}>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className={styles.textInput}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className={styles.textInput}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                          />
                        </div>

                        <label className={styles.saveCardRow}>
                          <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={saveCard}
                            onChange={() => setSaveCard(!saveCard)}
                          />
                          <span className={styles.saveCardLabel}>{dict.saveCard || "Save this card for future payments"}</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.formSection} style={{ textAlign: "center", padding: "40px" }}>
                      {paymentMethod === "gpay" ? (
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "12px" }}>
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                          <span style={{ fontSize: "28px", fontWeight: "bold", fontFamily: "var(--font-inter), sans-serif", color: "var(--foreground)" }}>Pay</span>
                        </div>
                      ) : (
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px", color: "var(--foreground)" }}>
                          <svg width="24" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                          </svg>
                          <span style={{ fontSize: "28px", fontWeight: "bold", fontFamily: "var(--font-inter), sans-serif" }}>Pay</span>
                        </div>
                      )}
                      <p className={styles.sectionSubtitle}>
                        {(dict.browserFastPay || "Your browser or device supports fast checkout with {method}.").replace("{method}", paymentMethod === "gpay" ? "Google Pay" : "Apple Pay")}
                      </p>
                    </div>
                  )}

                  <div className={styles.secureFooter}>
                    <div className={styles.secItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>3D-Secure 2</span>
                    </div>
                    <div className={styles.secItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <span>PCI-DSS Level 1</span>
                    </div>
                    <div className={styles.secItem}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span>{dict.noCardStored || "No card stored on our servers"}</span>
                    </div>
                  </div>

                  <div className={styles.backLinkRow}>
                    <button type="button" className={styles.backLink} onClick={handlePrevStep}>
                      {dict.backToConfigure || "← Back to configure"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>{dict.yourOrder || "Your Order"}</h4>

                <div className={styles.summaryProduct}>
                  <div className={styles.summaryProdIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className={styles.summaryProdInfo}>
                    <span className={styles.summaryProdLabel}>Courier+</span>
                    <span className={styles.summaryProdName}>{selectedPlan.name}</span>
                    <span className={styles.summaryProdCycle}>
                      {vehicles} {lang === "hu" ? "jármű" : (vehicles > 1 ? "vehicles" : "vehicle")} · {getCycleDisplayName()}
                    </span>
                  </div>
                </div>

                <div className={styles.summaryBreakdown}>
                  <div className={styles.summaryLine}>
                    <span className={styles.summaryLineName}>
                      {selectedPlan.name} × {vehicles} ({getCycleDisplayName()})
                    </span>
                    <span className={styles.summaryLineValue}>
                      {formatPrice(basePlanPricePeriod)} Ft
                    </span>
                  </div>

                  {Object.keys(addOns).map(
                    (key) =>
                      addOns[key] && (
                        <div key={key} className={styles.summaryLine}>
                          <span className={styles.summaryLineName}>
                            + {localizedAddon(key).name} × {vehicles} ({lang === "hu" ? "havi" : "monthly"})
                          </span>
                          <span className={styles.summaryLineValue}>
                            {formatPrice(ADD_ONS[key].price * vehicles)} Ft
                          </span>
                        </div>
                      )
                  )}

                  {discountPercent > 0 && (
                    <div className={`${styles.summaryLine} ${styles.summaryDiscountLine}`}>
                      <span className={styles.summaryLineName}>
                        Promo Discount ({discountPercent}%)
                      </span>
                      <span className={`${styles.summaryLineValue} ${styles.summaryDiscountValue}`}>
                        - {formatPrice(discountAmount)} Ft
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.summaryTotalRow}>
                  <span className={styles.summaryTotalLabel}>{dict.dueToday || "Due today"}</span>
                  <span className={styles.summaryTotalVal}>{formatPrice(totalPriceDue)} Ft</span>
                </div>

                <div className={styles.summaryNextBilling}>
                  <span>{dict.nextBilling || "Next billing"}</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>{getNextBillingDate()}</span>
                </div>

                <div className={styles.summaryDivider} />
                <form onSubmit={handleApplyCoupon} className={styles.couponRow}>
                  <input
                    type="text"
                    placeholder={dict.couponCode || "Coupon code"}
                    className={styles.couponInput}
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                  />
                  <button type="submit" className={styles.couponBtn}>
                    {dict.apply || "Apply"}
                  </button>
                </form>

                {activeCoupon && (
                  <div className={`${styles.couponFeedback} ${styles.couponSuccess}`}>
                    {(dict.couponApplied || "✓ Coupon code {code} applied (10% discount)").replace("{code}", activeCoupon)}
                  </div>
                )}
                {couponError && (
                  <div className={`${styles.couponFeedback} ${styles.couponError}`}>
                    ✕ {couponError}
                  </div>
                )}

                <div style={{ height: "24px" }} />

                {step === 1 ? (
                  <button type="button" className={styles.submitBtn} onClick={handleNextStep}>
                    {dict.continueToPayment || "Continue to payment ➔"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.submitBtn} ${styles.payCTA}`}
                    onClick={handleNextStep}
                  >
                    {(dict.payAndConfirm || "Pay {price} Ft & confirm").replace("{price}", formatPrice(totalPriceDue))}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.confirmWrapper}>
            <div className={styles.confirmBanner}>
              <div className={styles.confirmBannerLeft}>
                <div className={styles.successIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1 className={styles.confirmTitle}>{dict.allCovered || "You're all covered."}</h1>
                <p className={styles.confirmSubtitle}>
                  {(dict.planActiveSubtitle || "Your {planName} plan is now active. Our team will be in touch within 24 hours to get you started.").replace("{planName}", selectedPlan.name)}
                </p>
                <div className={styles.confirmActions}>
                  <Link href="/login" className="btn-primary">
                    {dict.goToDashboard || "Go to dashboard ➔"}
                  </Link>
                  <button
                    type="button"
                    className={styles.btnDownload}
                    onClick={() => setShowInvoiceModal(true)}
                  >
                    {dict.downloadInvoice || "Download invoice"}
                  </button>
                </div>
              </div>

              <div className={styles.confirmBannerRight}>
                <div className={styles.celebrationContainer}>
                  <svg className={styles.checkmarkSvg} viewBox="0 0 52 52">
                    <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" />
                    <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h4 className={styles.whatNextTitle}>{dict.whatNext || "What happens next"}</h4>
              <div className={styles.nextStepsGrid}>
                <div className={styles.stepCard}>
                  <div className={styles.stepCardHeader}>
                    <div className={styles.stepIconTile}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <span className={styles.stepCardTime}>{dict.now || "Now"}</span>
                  </div>
                  <h5 className={styles.stepCardTitle}>{dict.step1NextTitle || "Subscription Activated"}</h5>
                  <p className={styles.stepCardDesc}>
                    {dict.step1NextDesc || "Your plan is live. Invoice and plan details emailed to your inbox."}
                  </p>
                </div>

                <div className={styles.stepCard}>
                  <div className={styles.stepCardHeader}>
                    <div className={styles.stepIconTile}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <span className={styles.stepCardTime}>{dict.next || "Next"}</span>
                    <span className={styles.stepActiveDot} />
                  </div>
                  <h5 className={styles.stepCardTitle}>{dict.step2NextTitle || "Configure Vehicle"}</h5>
                  <p className={styles.stepCardDesc}>
                    {dict.step2NextDesc || "Set up VIN/Frame Number of your vehicle/s in dashboard."}
                  </p>
                </div>

                <div className={styles.stepCard}>
                  <div className={styles.stepCardHeader}>
                    <div className={styles.stepIconTile}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <span className={styles.stepCardTime}>{dict.then || "Then"}</span>
                  </div>
                  <h5 className={styles.stepCardTitle}>{dict.step3NextTitle || "Collect Items"}</h5>
                  <p className={styles.stepCardDesc}>
                    {dict.step3NextDesc || "Collect your items from our pickup point."}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.confirmBottomSplit}>
              <div className={styles.receiptCard}>
                <h4 className={styles.receiptHeading}>{dict.receipt || "Receipt"}</h4>
                <div className={styles.receiptList}>
                  <div className={styles.receiptLine}>
                    <span>
                      {selectedPlan.name} × {vehicles} ({getCycleDisplayName()})
                    </span>
                    <span className={styles.receiptLineVal}>{formatPrice(basePlanPricePeriod)} Ft</span>
                  </div>

                  {Object.keys(addOns).map(
                    (key) =>
                      addOns[key] && (
                        <div key={key} className={styles.receiptLine}>
                          <span>+ {localizedAddon(key).name} × {vehicles} ({lang === "hu" ? "havi" : "monthly"})</span>
                          <span className={styles.receiptLineVal}>
                            {formatPrice(ADD_ONS[key].price * vehicles)} Ft
                          </span>
                        </div>
                      )
                  )}

                  {discountPercent > 0 && (
                    <div className={styles.receiptLine} style={{ color: "var(--primary)" }}>
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span className={styles.receiptLineVal}>- {formatPrice(discountAmount)} Ft</span>
                    </div>
                  )}
                </div>

                <div className={styles.receiptDivider} />

                <div className={styles.receiptTotalLine}>
                  <span>{dict.paidToday || "Paid today"}</span>
                  <span className={styles.receiptTotalVal}>{formatPrice(totalPriceDue)} Ft</span>
                </div>
              </div>

              <div className={styles.addMoreCard}>
                <div className={styles.addMoreHeader}>
                  <div className={styles.addMoreIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <h4 className={styles.addMoreTitle}>{dict.addMoreVehicles || "Add more vehicles to your fleet"}</h4>
                  <p className={styles.addMoreDesc}>
                    {dict.addMoreDesc || "Manage multiple vehicles under one plan. Visit your dashboard to add more vehicles to your Courier+ coverage."}
                  </p>
                </div>
                <div>
                  <Link href="/login" className={styles.addMoreLink}>
                    {dict.goToDashboard || "Go to dashboard ➔"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {toast && (
        <div className={styles.toastContainer}>
          <div className={styles.toastCard}>
            <div className={styles.toastIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className={styles.toastText}>{toast}</div>
            <button
              type="button"
              className={styles.toastClose}
              onClick={() => setToast(null)}
              aria-label="Close error message"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <div className={styles.invoiceModalBackdrop}>
          <div className={styles.invoiceModalContainer}>
            <div className={styles.invoiceModalHeaderBar}>
              <span className={styles.invoiceModalTitle}>{dict.invoiceSheetTitle || "Subscription Invoice"}</span>
              <div className={styles.invoiceModalActions}>
                <button type="button" onClick={() => window.print()} className={styles.modalPrintBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  {dict.printSave || "Print / Save PDF"}
                </button>
                <button type="button" onClick={() => setShowInvoiceModal(false)} className={styles.modalCloseBtn}>
                  {dict.close || "Close"}
                </button>
              </div>
            </div>

            {/* Invoice Sheet */}
            <div className={styles.invoiceSheet}>
              <div className={styles.sheetHeader}>
                <div className={styles.logoAndContact}>
                  <div className={styles.logoWrapper}>
                    <span className={styles.logoText}>E-RENTY</span>
                  </div>
                  <div className={styles.companyInfo}>
                    <p>E-Renty Kft.</p>
                    <p>Váci út 47, Budapest 1134</p>
                    <p>Hungary</p>
                    <p>info@erenty.com | www.erenty.com</p>
                  </div>
                </div>

                <div className={styles.invoiceMeta}>
                  <h1 className={styles.invoiceTitle}>{lang === "hu" ? "SZÁMLA" : "INVOICE"}</h1>
                  <div className={styles.metaGrid}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{dict.invoiceNo || "Invoice No:"}</span>
                      <span className={styles.metaValue}>{invoiceNumber || "INV-2026-..."}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{dict.date || "Date:"}</span>
                      <span className={styles.metaValue}>{invoiceDate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{dict.dueDate || "Due Date:"}</span>
                      <span className={styles.metaValue}>{invoiceDate}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{dict.status || "Status:"}</span>
                      <span className={styles.statusBadge}>{dict.paid || "PAID"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.invoiceDivider} />

              <div className={styles.billingSection}>
                <div className={styles.billTo}>
                  <h3>{dict.billTo || "Bill To"}</h3>
                  <p className={styles.customerName}>{cardName || (lang === "hu" ? "Ügyfél" : "Customer")}</p>
                  <p className={styles.fleetInfo}>
                    {lang === "hu" ? `Flotta előfizetés mérete: ${vehicles} jármű` : `Fleet subscription size: ${vehicles} vehicle${vehicles > 1 ? "s" : ""}`}
                  </p>
                </div>

                <div className={styles.paymentInfo}>
                  <h3>{dict.paymentMethod || "Payment Method"}</h3>
                  <div className={styles.payMethodDetail}>
                    {paymentMethod === "card" && (
                      <>
                        <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)", marginRight: "8px" }}>
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span>{dict.creditCardDetail || "Credit Card (Visa / Mastercard ending in 4242)"}</span>
                      </>
                    )}
                    {paymentMethod === "gpay" && (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px" }}>
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                        </svg>
                        <span>Google Pay</span>
                      </>
                    )}
                    {paymentMethod === "applepay" && (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px" }}>
                          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"></path>
                        </svg>
                        <span>Apple Pay</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.vinSection}>
                <h4 className={styles.vinTitle}>{dict.coveredVins || "Covered Vehicle Frame Numbers (VINs)"}</h4>
                <div className={styles.vinGrid}>
                  {vins.map((vin, idx) => (
                    <div key={idx} className={styles.vinItem}>
                      <span className={styles.vinNumber}>#{idx + 1}</span>
                      <span className={styles.vinCode}>{vin || "N/A"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.invoiceTableWrapper}>
                <table className={styles.invoiceTable}>
                  <thead>
                    <tr>
                      <th align="left">{dict.description || "Description"}</th>
                      <th align="center">{dict.billingCycle || "Billing Cycle"}</th>
                      <th align="right">{dict.unitPrice || "Unit Price"}</th>
                      <th align="center">{dict.qty || "Qty"}</th>
                      <th align="right">{dict.total || "Total"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td align="left">
                        <strong>
                          {lang === "hu" ? `Courier+ ${selectedPlan.name} előfizetés` : `Courier+ ${selectedPlan.name} Subscription`}
                        </strong>
                        <div className={styles.itemTagline}>{selectedPlan.tagline}</div>
                      </td>
                      <td align="center">{getCycleDisplayName()}</td>
                      <td align="right">{formatPrice(selectedPlan.price * multiplier)} Ft</td>
                      <td align="center">{vehicles}</td>
                      <td align="right">{formatPrice(basePlanPricePeriod)} Ft</td>
                    </tr>

                    {Object.keys(addOns).map(
                      (key) =>
                        addOns[key] && (
                          <tr key={key}>
                            <td align="left">
                              <strong>
                                {lang === "hu" ? `+ ${localizedAddon(key).name} kiegészítő` : `+ ${localizedAddon(key).name} Add-on`}
                              </strong>
                              <div className={styles.itemTagline}>{lang === "hu" ? "Havi fix kiegészítő díj" : "Flat monthly accessory fee"}</div>
                            </td>
                            <td align="center">{lang === "hu" ? "Havi" : "Monthly"}</td>
                            <td align="right">{formatPrice(ADD_ONS[key].price)} Ft</td>
                            <td align="center">{vehicles}</td>
                            <td align="right">{formatPrice(ADD_ONS[key].price * vehicles)} Ft</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.summaryContainer}>
                <div className={styles.summaryBox}>
                  <div className={styles.summaryRow}>
                    <span>{dict.subtotal || "Subtotal:"}</span>
                    <span>{formatPrice(subtotalPrice)} Ft</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                      <span>
                        {(dict.discount || "Discount ({percent}% {coupon}):").replace("{percent}", discountPercent).replace("{coupon}", activeCoupon ? `- "${activeCoupon}"` : "")}
                      </span>
                      <span>- {formatPrice(discountAmount)} Ft</span>
                    </div>
                  )}

                  <div className={styles.totalRow}>
                    <span>{dict.totalPaid || "Total Paid:"}</span>
                    <span>{formatPrice(totalPriceDue)} Ft</span>
                  </div>
                </div>
              </div>

              <div className={styles.sheetFooter}>
                <p className={styles.thankYou}>{dict.thankYou || "Thank you for choosing E-RENTY for maintaining your fleet."}</p>
                <p className={styles.footerTerms}>
                  {dict.invoiceTerms || "This invoice is proof of payment for your active subscription. Billing cycles renew automatically. Manage or cancel your coverage via the partner dashboard."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
