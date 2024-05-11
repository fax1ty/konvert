import { Locale } from "@/i18n/locales";

export interface Params extends Record<string, string> {
  locale: Locale;
}
