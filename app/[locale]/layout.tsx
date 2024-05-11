import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { Params } from "@/params";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: "Konvert",
    description: t("main"),
  } satisfies Metadata;
}

interface Props {
  children: React.ReactNode;
  params: Params;
}

export default function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale}>
      <body className={cn(inter.className, "bg-black text-white")}>
        {children}
      </body>
    </html>
  );
}
