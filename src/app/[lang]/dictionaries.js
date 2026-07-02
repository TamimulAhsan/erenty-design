import "server-only";

const dictionaries = {
  en: () => import("../../dictionaries/en.json").then((module) => module.default),
  hu: () => import("../../dictionaries/hu.json").then((module) => module.default),
};

export const hasLocale = (locale) => locale === "en" || locale === "hu";

export const getDictionary = async (locale) => {
  if (!hasLocale(locale)) {
    return dictionaries.en();
  }
  return dictionaries[locale]();
};
