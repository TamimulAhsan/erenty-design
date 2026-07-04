import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { getDictionary } from "./dictionaries";
import { locales, defaultLocale } from "@/lib/i18n";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin-variable-wghtnormal-normal.woff2",
  variable: "--font-mono",
  weight: "100 900",
});

const cruiser = localFont({
  src: "./fonts/CruiserRegular.woff2",
  variable: "--font-cruiser",
  weight: "400",
});

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const languageAlternates = Object.fromEntries(locales.map((l) => [l, `/${l}`]));

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://e-renty.com"),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...languageAlternates, "x-default": `/${defaultLocale}` },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <html lang={lang || defaultLocale} className={`${inter.variable} ${jetbrainsMono.variable} ${cruiser.variable}`}>
      {/* suppressHydrationWarning covers attributes injected by browser extensions (e.g. Grammarly) into <body>, not our own markup. */}
      <body suppressHydrationWarning>
        {/* Navbar + Footer live in the layout so they persist across navigation
            (incl. language toggles) instead of remounting per page. */}
        <Navbar dict={dict.navbar} />
        {children}
        <Footer dict={dict.footer} />
        <CookieConsent dict={dict.cookieConsent} />
      </body>
    </html>
  );
}
