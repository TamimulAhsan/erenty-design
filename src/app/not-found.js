import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { locales, defaultLocale } from "@/lib/i18n";

export default async function RootNotFound() {
  let locale = defaultLocale;

  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
    if (localeCookie && locales.includes(localeCookie)) {
      locale = localeCookie;
    } else {
      const headersList = await headers();
      const acceptLanguage = headersList.get("accept-language");
      if (acceptLanguage && acceptLanguage.toLowerCase().includes("hu")) {
        locale = "hu";
      }
    }
  } catch (e) {
    // Fallback if context is not available during static generation/prerendering
  }

  redirect(`/${locale}`);
}
