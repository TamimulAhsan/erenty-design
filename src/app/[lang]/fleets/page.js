import FleetsClient from "./FleetsClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.fleetsPage?.metaTitle || "E-Renty Fleet | Premium Electric Bike Subscriptions",
    description: dict.fleetsPage?.metaDesc || "Browse 7 connected electric vehicle models from trusted brands. Subscriptions include GPS tracking, comprehensive insurance, and 24/7 service support.",
  };
}

export default async function FleetsPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <>
      <main>
        <FleetsClient dict={dict.fleetsPage} />
      </main>
    </>
  );
}
