import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { Locale, locales } from "./locales";
import en from "./messages/en.json";
import ru from "./messages/ru.json";
import { timeZone } from "./timezone";

function getMessages(locale: Locale) {
  switch (locale) {
    case "en":
      return en;
    case "ru":
      return ru;
  }
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  const messages = getMessages(locale as Locale);

  return {
    messages,
    timeZone,
  };
});
