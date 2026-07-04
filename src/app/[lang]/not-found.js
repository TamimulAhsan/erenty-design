"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/LocalizedLink";
import { localeFromPathname, defaultLocale } from "@/lib/i18n";
import styles from "./NotFound.module.css";

// not-found.js is a special Next.js file — it doesn't receive the [lang] route
// param, so locale is detected from the URL client-side instead, same source
// LocalizedLink itself uses.
const COPY = {
  en: {
    title: "Page not found",
    desc: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    homeBtn: "Go to Homepage",
    fleetsBtn: "Browse Fleets",
  },
  hu: {
    title: "Az oldal nem található",
    desc: "A keresett oldal nem létezik, vagy áthelyezésre került. Segítünk visszatalálni.",
    homeBtn: "Vissza a főoldalra",
    fleetsBtn: "Flották böngészése",
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) || defaultLocale;
  const t = COPY[locale] || COPY[defaultLocale];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={`${styles.errorCode} mono-num`}>404</div>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.desc}>{t.desc}</p>
        <div className={styles.buttons}>
          <Link href="/" className="btn-primary">
            {t.homeBtn}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link href="/fleets" className="btn-secondary dark">
            {t.fleetsBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
