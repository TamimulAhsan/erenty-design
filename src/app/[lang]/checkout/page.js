import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: lang === "hu" ? "Biztonságos Fizetés | E-Renty" : "Secure Checkout | E-Renty",
    description: lang === "hu" ? "Fizesse elő bérleti díját biztonságosan." : "Pay your rental lease securely.",
  };
}

export default async function CheckoutPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <Suspense
      fallback={
        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--muted-foreground)", fontFamily: "sans-serif" }}>
          {lang === "hu" ? "Biztonságos fizetési oldal betöltése..." : "Loading secure checkout..."}
        </div>
      }
    >
      <CheckoutClient lang={lang} dict={dict} />
    </Suspense>
  );
}
