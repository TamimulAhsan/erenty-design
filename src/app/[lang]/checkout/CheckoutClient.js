"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocalizedLink";
import { localizeHref } from "@/lib/i18n";
import { FLEET_BIKES } from "@/data/fleets";
import styles from "./checkout.module.css";

export default function CheckoutClient({ lang, dict = {} }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bikeId = searchParams.get("bike") || "kukirin-g3-pro";
  const planId = searchParams.get("plan") || "plus";

  const bike = FLEET_BIKES.find(b => b.id === bikeId || b.slug === bikeId) || FLEET_BIKES[0];

  // Price calculations
  const planPriceOffset = planId === "plus" ? 7000 : planId === "max" ? 14000 : 0;
  const totalPrice = bike.price + planPriceOffset;

  const isHu = lang === "hu";

  const formatPrice = (num) => {
    return new Intl.NumberFormat(isHu ? "hu-HU" : "en-US").format(num);
  };

  const planName = planId === "basic" 
    ? (dict.planBasic || "Basic")
    : planId === "max"
      ? (dict.planMax || "Max")
      : (dict.planPlus || "Plus");

  const handlePayment = (e) => {
    e.preventDefault();
    // Redirect to fleets with success flags
    const returnUrl = `/fleets?checkout_status=success&bike=${bike.id}&plan=${planId}`;
    router.push(localizeHref(lang, returnUrl));
  };

  return (
    <div className={styles.checkoutPageWrapper}>
      <div className={styles.backgroundGlow} />
      <div className={styles.checkoutContainer}>
        <div className={styles.backHeader}>
          <Link href="/fleets" className={styles.backLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {isHu ? "Vissza a flottákhoz" : "Back to Fleets"}
          </Link>
        </div>

        <h1 className={styles.checkoutTitle}>
          {isHu ? "Biztonságos Fizetés" : "Secure Checkout"}
        </h1>
        <p className={styles.checkoutSubtitle}>
          {isHu ? "Fizesse elő a jármű bérleti díját és kezdje meg a bérlést." : "Complete your vehicle rental subscription and start riding."}
        </p>

        <div className={styles.checkoutGrid}>
          {/* Left Panel: Summary & Plan Details */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionTitle}>{isHu ? "Rendelés Összegzése" : "Order Summary"}</h2>
            </div>
            
            <div className={styles.bikeDetailsRow}>
              <div className={styles.bikeImgWrapper}>
                <Image src={bike.image} alt={bike.model} width={120} height={90} className={styles.bikeImg} />
              </div>
              <div className={styles.bikeMeta}>
                <span className={styles.categoryBadge}>{bike.category.toUpperCase()}</span>
                <h3 className={styles.bikeName}>{bike.brand} {bike.model}</h3>
                <p className={styles.bikeSpecs}>Range: {bike.range} | Speed: {bike.topSpeed}</p>
              </div>
            </div>

            <div className={styles.planBadgeRow}>
              <div className={styles.planInfo}>
                <span className={styles.planLabel}>{isHu ? "KIVÁLASZTOTT CSOMAG" : "SELECTED PLAN"}</span>
                <span className={styles.planName}>{planName}</span>
              </div>
              <div className={styles.planPriceInfo}>
                <span className={styles.planPrice}>{formatPrice(totalPrice)} Ft</span>
                <span className={styles.planPeriod}>/ mo</span>
              </div>
            </div>

            <div className={styles.priceDivider} />

            <div className={styles.priceBreakdown}>
              <div className={styles.breakdownRow}>
                <span>{isHu ? "Alap bérleti díj" : "Base rental fee"}</span>
                <span>{formatPrice(bike.price)} Ft</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>{isHu ? "Csomag kiegészítés" : "Plan coverage addon"}</span>
                <span>+{formatPrice(planPriceOffset)} Ft</span>
              </div>
              <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
                <span>{isHu ? "Fizetendő összeg (Havonta)" : "Total Due (Monthly)"}</span>
                <span>{formatPrice(totalPrice)} Ft</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Payment Method Form */}
          <form className={styles.paymentCard} onSubmit={handlePayment}>
            <h2 className={styles.sectionTitle}>{isHu ? "Fizetési Információk" : "Payment Details"}</h2>
            <p className={styles.paymentCardDesc}>
              {isHu ? "Biztonságos bankkártyás fizetés a Stripe segítségével." : "Secure credit card payment powered by Stripe."}
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="cardName" className={styles.inputLabel}>
                {isHu ? "Kártyabirtokos neve" : "Cardholder's Name"}
              </label>
              <input type="text" id="cardName" required defaultValue="John Doe" className={styles.textInput} />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cardNumber" className={styles.inputLabel}>
                {isHu ? "Kártyaszám" : "Card Number"}
              </label>
              <div className={styles.cardInputWrapper}>
                <input type="text" id="cardNumber" maxLength="19" required defaultValue="4242 4242 4242 4242" className={styles.textInput} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.cardBrandIcon}>
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            <div className={styles.doubleRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="expiry" className={styles.inputLabel}>
                  {isHu ? "Lejárati dátum" : "Expiration Date"}
                </label>
                <input type="text" id="expiry" placeholder="MM/YY" maxLength="5" required defaultValue="12/28" className={styles.textInput} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cvc" className={styles.inputLabel}>
                  CVC
                </label>
                <input type="text" id="cvc" maxLength="3" required defaultValue="123" className={styles.textInput} />
              </div>
            </div>

            <button type="submit" className={styles.payBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {isHu ? `Fizetés - ${formatPrice(totalPrice)} Ft` : `Pay Now - ${formatPrice(totalPrice)} Ft`}
            </button>

            <div className={styles.securityBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{isHu ? "256-bites SSL titkosítás. Biztonságos tranzakció." : "256-bit SSL encrypted. Safe & secure transaction."}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
