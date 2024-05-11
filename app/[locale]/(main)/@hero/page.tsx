import { ArrowRight, Play } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Hero() {
  const view = cookies().get("konvert-view");

  const t = useTranslations("Hero");

  if (view?.value === "app") return null;

  return (
    <main className="flex flex-col justify-center text-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl ">
        {t("title")}
      </h1>
      <p className="mb-8 whitespace-pre-line text-lg font-normal text-gray-400 sm:px-16 lg:text-xl xl:px-48">
        {t("text")}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button asChild variant="text">
          <Link href="/blog/motivation">
            {t("how")}
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <form
          action={async () => {
            "use server";

            cookies().set({ name: "konvert-view", value: "app", path: "/" });
          }}
        >
          <Button type="submit">
            <Play className="size-5" />
            {t("watch")}
          </Button>
        </form>
      </div>
    </main>
  );
}
