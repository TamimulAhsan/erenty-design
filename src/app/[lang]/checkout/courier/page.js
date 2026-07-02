import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.checkoutPage?.metaTitle || "Secure Checkout | Courier+ | E-Renty",
    description: dict.checkoutPage?.metaDesc || "Complete your Courier+ plan subscription.",
  };
}

export default async function CheckoutCourierPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <Suspense
      fallback={
        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--muted-foreground)", fontFamily: "sans-serif" }}>
          {dict.checkoutPage?.loading || "Loading secure checkout..."}
        </div>
      }
    >
      <CheckoutClient dict={{ ...dict.checkoutPage, plans: dict.courierPlusPage?.plans }} lang={lang} />
    </Suspense>
  );
}
