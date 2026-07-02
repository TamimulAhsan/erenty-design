"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "@/components/LocalizedLink";
import styles from "./invoice.module.css";

const PLANS = {
  basic: {
    name: "Basic Plan",
    price: 9990,
    tagline: "Reliable coverage for everyday wear and tear.",
  },
  extra: {
    name: "Extra Plan",
    price: 16990,
    tagline: "A stronger package for riders who want broader repairs and faster support.",
  },
  max: {
    name: "Max Plan",
    price: 24990,
    tagline: "Maximum protection for couriers who need the least possible downtime.",
  },
};

const ADD_ONS = {
  punctureProof: { name: "Puncture Proof Tyre", price: 2000 },
  powerBank: { name: "Power Bank (20000 mAh)", price: 2000 },
  extraBattery: { name: "Extra Battery", price: 17000 },
  helmet: { name: "Helmet", price: 1500 },
};

const CYCLE_MULTIPLIERS = {
  monthly: 1,
  quarterly: 3,
  "6months": 6,
  yearly: 12,
};

const CYCLE_LABELS = {
  monthly: "Monthly billing",
  quarterly: "Quarterly billing",
  "6months": "6-month billing",
  yearly: "Yearly billing",
};

export default function InvoiceClient() {
  const searchParams = useSearchParams();

  const planId = searchParams.get("plan") || "extra";
  const billingCycle = searchParams.get("billing") || "monthly";
  const vehiclesCount = parseInt(searchParams.get("vehicles") || "1", 10);

  let vins = [];
  try {
    const vinsStr = searchParams.get("vins");
    if (vinsStr) vins = JSON.parse(vinsStr);
  } catch (e) {
    vins = [];
  }
  if (!vins || vins.length === 0) {
    vins = Array(vehiclesCount).fill("N/A");
  }

  let addOns = {
    punctureProof: false,
    powerBank: false,
    extraBattery: false,
    helmet: false,
  };
  try {
    const addonsStr = searchParams.get("addons");
    if (addonsStr) addOns = JSON.parse(addonsStr);
  } catch (e) {
    // Keep defaults
  }

  const discountPercent = parseInt(searchParams.get("discount") || "0", 10);
  const couponCode = searchParams.get("coupon") || "";
  const paymentMethod = searchParams.get("payment") || "card";
  const cardName = searchParams.get("cardname") || "Customer";

  const selectedPlan = PLANS[planId.toLowerCase()] || PLANS.extra;
  const multiplier = CYCLE_MULTIPLIERS[billingCycle.toLowerCase()] || 1;

  const basePlanPricePeriod = Math.round(selectedPlan.price * multiplier * vehiclesCount);

  let addOnsPricePeriod = 0;
  const activeAddonsList = [];
  Object.keys(addOns).forEach((key) => {
    if (addOns[key] && ADD_ONS[key]) {
      addOnsPricePeriod += ADD_ONS[key].price * vehiclesCount;
      activeAddonsList.push({
        name: ADD_ONS[key].name,
        price: ADD_ONS[key].price,
        total: ADD_ONS[key].price * vehiclesCount,
      });
    }
  });

  const subtotalPrice = basePlanPricePeriod + addOnsPricePeriod;
  const discountAmount = Math.round(subtotalPrice * (discountPercent / 100));
  const totalPriceDue = subtotalPrice - discountAmount;

  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Generate date and random invoice ID once on client mount
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    
    setInvoiceDate(`${day} ${monthName} ${year}`);
    setDueDate(`${day} ${monthName} ${year}`);

    const rand = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNumber(`INV-${year}-${rand}`);
  }, []);

  const formatPrice = (val) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getCycleDisplayName = () => {
    if (billingCycle === "monthly") return "Monthly";
    if (billingCycle === "quarterly") return "Quarterly";
    if (billingCycle === "6months") return "6-Month";
    if (billingCycle === "yearly") return "Yearly";
    return billingCycle;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={styles.invoicePage}>
      {/* Action Bar (hidden in print) */}
      <div className={styles.actionBar}>
        <div className={styles.actionBarContainer}>
          <Link href="/checkout/courier" className={styles.backButton}>
            ← Back to Checkout
          </Link>
          <div className={styles.actionButtons}>
            <button type="button" onClick={handlePrint} className={styles.printBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Sheet */}
      <div className={styles.invoiceSheet}>
        <div className={styles.sheetHeader}>
          <div className={styles.logoAndContact}>
            <div className={styles.logoText}>E-RENTY</div>
            <div className={styles.companyInfo}>
              <p>E-Renty Kft.</p>
              <p>Váci út 47, Budapest 1134</p>
              <p>Hungary</p>
              <p>info@erenty.com | www.erenty.com</p>
            </div>
          </div>

          <div className={styles.invoiceMeta}>
            <h1 className={styles.invoiceTitle}>INVOICE</h1>
            <div className={styles.metaGrid}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Invoice No:</span>
                <span className={styles.metaValue}>{invoiceNumber || "INV-2026-..."}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Date:</span>
                <span className={styles.metaValue}>{invoiceDate}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Due Date:</span>
                <span className={styles.metaValue}>{dueDate}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Status:</span>
                <span className={styles.statusBadge}>PAID</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.billingSection}>
          <div className={styles.billTo}>
            <h3>Bill To</h3>
            <p className={styles.customerName}>{cardName}</p>
            <p className={styles.fleetInfo}>
              Fleet subscription size: {vehiclesCount} vehicle{vehiclesCount > 1 ? "s" : ""}
            </p>
          </div>

          <div className={styles.paymentInfo}>
            <h3>Payment Method</h3>
            <div className={styles.payMethodDetail}>
              {paymentMethod === "card" && (
                <>
                  <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)", marginRight: "8px" }}>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <span>Credit Card (Visa / Mastercard ending in 4242)</span>
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
          <h4 className={styles.vinTitle}>Covered Vehicle Frame Numbers (VINs)</h4>
          <div className={styles.vinGrid}>
            {vins.map((vin, idx) => (
              <div key={idx} className={styles.vinItem}>
                <span className={styles.vinNumber}>#{idx + 1}</span>
                <span className={styles.vinCode}>{vin}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.invoiceTableWrapper}>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th align="left">Description</th>
                <th align="center">Billing Cycle</th>
                <th align="right">Unit Price</th>
                <th align="center">Qty</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="left">
                  <strong>Courier+ {selectedPlan.name} Subscription</strong>
                  <div className={styles.itemTagline}>{selectedPlan.tagline}</div>
                </td>
                <td align="center">{getCycleDisplayName()}</td>
                <td align="right">{formatPrice(selectedPlan.price * multiplier)} Ft</td>
                <td align="center">{vehiclesCount}</td>
                <td align="right">{formatPrice(basePlanPricePeriod)} Ft</td>
              </tr>

              {activeAddonsList.map((addon, idx) => (
                <tr key={idx}>
                  <td align="left">
                    <strong>+ {addon.name} Add-on</strong>
                    <div className={styles.itemTagline}>Flat monthly accessory fee</div>
                  </td>
                  <td align="center">Monthly</td>
                  <td align="right">{formatPrice(addon.price)} Ft</td>
                  <td align="center">{vehiclesCount}</td>
                  <td align="right">{formatPrice(addon.total)} Ft</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.summaryContainer}>
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>{formatPrice(subtotalPrice)} Ft</span>
            </div>

            {discountPercent > 0 && (
              <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                <span>Discount ({discountPercent}% {couponCode && `- "${couponCode}"`}):</span>
                <span>- {formatPrice(discountAmount)} Ft</span>
              </div>
            )}

            <div className={styles.totalRow}>
              <span>Total Paid:</span>
              <span>{formatPrice(totalPriceDue)} Ft</span>
            </div>
          </div>
        </div>

        <div className={styles.sheetFooter}>
          <p className={styles.thankYou}>Thank you for choosing E-RENTY to power your delivery fleet.</p>
          <p className={styles.footerTerms}>
            This invoice is proof of payment for your active subscription. 
            Billing cycles renew automatically. Manage or cancel your coverage via the partner dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
