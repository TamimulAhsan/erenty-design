import CourierPlusClient from "./CourierPlusClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.courierPlusPage?.metaTitle || "Courier+ | E-Renty — E-Bike Maintenance & Protection Plans",
    description:
      dict.courierPlusPage?.metaDesc ||
      "One fixed monthly fee covers maintenance, GPS tracking and theft insurance for owner couriers. 3 plans: Basic, Extra, Max. Volume discounts from 20+ bikes.",
  };
}

export default async function CourierPlusPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <>
      <main style={{ minHeight: "100vh" }}>
        <CourierPlusClient dict={dict.courierPlusPage} lang={lang} />
      </main>
    </>
  );
}
