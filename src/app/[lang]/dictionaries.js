import "server-only";
import { isLocale, defaultLocale } from "@/lib/i18n";

const dictionaries = {
  en: () => import("../../dictionaries/en.json").then((module) => module.default),
  hu: () => import("../../dictionaries/hu.json").then((module) => module.default),
};

export const hasLocale = isLocale;

export const getDictionary = async (locale) => {
  const key = isLocale(locale) ? locale.toLowerCase() : defaultLocale;
  return dictionaries[key]();
};
