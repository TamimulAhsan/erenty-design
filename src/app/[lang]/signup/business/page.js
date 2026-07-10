import BusinessSignupClient from "./BusinessSignupClient";
import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.businessSignupPage?.metaTitle || "Business Signup | E-Renty",
    description: dict.businessSignupPage?.metaDesc || "Set up your E-Renty business account.",
  };
}

export default async function BusinessSignupPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh" }}>
      <BusinessSignupClient dict={dict.businessSignupPage} />
    </main>
  );
}
