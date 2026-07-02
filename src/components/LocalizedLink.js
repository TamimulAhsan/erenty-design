"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname, defaultLocale, localizeHref } from "@/lib/i18n";

// Drop-in replacement for next/link that prefixes internal hrefs with the
// active locale. Swap the `next/link` import for this one and every <Link>
// in the file becomes locale-aware — no tag renaming needed.
// Pass an explicit `lang` prop to skip pathname detection (e.g. in server-rendered lists).
export default function LocalizedLink({ href, lang, ...props }) {
  const pathname = usePathname();
  const locale = lang || localeFromPathname(pathname) || defaultLocale;
  return <Link href={localizeHref(locale, href)} {...props} />;
}
