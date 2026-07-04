import AboutClient from "./AboutClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.aboutPage?.metaTitle || "About E-Renty | Smarter Fleets, Greener Cities",
    description:
      dict.aboutPage?.metaDesc ||
      "E-Renty is a Budapest-based e-bike fleet management company helping Hungarian businesses cut costs, reduce emissions, and keep their teams moving sustainably.",
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh" }}>
      <AboutClient dict={dict.aboutPage} />
    </main>
  );
}
