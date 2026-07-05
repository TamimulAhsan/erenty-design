import BusinessClient from "./BusinessClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title:
      dict.businessPage?.metaTitle ||
      "E-Renty for Business | Corporate E-Bike Fleets & Courier Solutions",
    description:
      dict.businessPage?.metaDesc ||
      "Fully managed electric bike and scooter fleets for Hungarian businesses — from tax-free employee mobility to always-on courier fleets. GPS tracking, theft insurance, sub-24h maintenance, one fixed monthly invoice.",
  };
}

export default async function BusinessPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh" }}>
      <BusinessClient dict={dict.businessPage} lang={lang} />
    </main>
  );
}
