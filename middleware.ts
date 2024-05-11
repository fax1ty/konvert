import createMiddleware from "next-intl/middleware";

import { locales } from "./i18n/locales";

export default createMiddleware({
  locales,
  defaultLocale: locales[0],
  localePrefix: "as-needed",
});

export const config = {
  matcher: [
    "/((?!__nextjs_.*?|api|_next/static|_next/image|favicon.ico|robots.txt|ads.txt|sitemap.xml|manifest.json|android-chrome-192x192.png|apple-touch-icon.png|browserconfig.xml|mstile-150x150.png|safari-pinned-tab.svg|site.webmanifest|favicon-.*.png).*)",
  ],
};
