import ContactClient from "./ContactClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.contactPage?.metaTitle || "Contact E-Renty | Let's Talk Fleet Strategy",
    description:
      dict.contactPage?.metaDesc ||
      "Get in touch with the E-Renty team. Whether you're exploring your first e-bike pilot or scaling an existing fleet, we're here to help.",
  };
}

export default async function ContactPage({ params }) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh" }}>
      <ContactClient dict={dict.contactPage} />
    </main>
  );
}
