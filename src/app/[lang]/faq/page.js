// Force rebuild of page importing client component
import FaqClient from "./FaqClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.faqPage?.metaTitle || "FAQ | E-Renty — Frequently Asked Questions",
    description: dict.faqPage?.metaDesc || "Find answers about E-Renty rentals, Courier+ subscriptions, identity verification, payments, and fleet management.",
  };
}

export default async function FAQPage({ params, searchParams }) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab || "";
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh" }}>
      <FaqClient dict={dict.faqPage} initialTab={tab} />
    </main>
  );
}
