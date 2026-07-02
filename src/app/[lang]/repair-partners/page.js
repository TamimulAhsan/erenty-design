import RepairPartnersClient from "./RepairPartnersClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.repairPartnersPage?.metaTitle || "Repair Partners | E-Renty Certified Service Network",
    description: dict.repairPartnersPage?.metaDesc || "Find certified e-bike and e-scooter repair workshops near you. Book standard repairs, battery diagnostics, or emergency mobile service across our partner network.",
  };
}

export default async function RepairPartnersPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main>
      <RepairPartnersClient dict={dict.repairPartnersPage} lang={lang} />
    </main>
  );
}
