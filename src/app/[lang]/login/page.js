import LoginClient from "./LoginClient";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.loginPage?.metaTitle || "Login | E-Renty",
    description: dict.loginPage?.metaDesc || "Sign in to your E-Renty account or create a new one.",
  };
}

export default async function LoginPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <LoginClient dict={dict.loginPage} businessDict={dict.businessSignupPage} />
  );
}
