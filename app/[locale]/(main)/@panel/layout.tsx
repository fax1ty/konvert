import { cookies } from "next/headers";

import { Progress } from "./progress";

interface Props {
  convertor: React.ReactNode;
  controls: React.ReactNode;
}

export default function Layout({ convertor, controls }: Props) {
  const view = cookies().get("konvert-view");
  if (view?.value !== "app") return null;

  return (
    <main className="flex flex-col gap-4 overflow-auto py-4 md:flex-row md:py-8 lg:gap-8">
      <Progress />

      {convertor}
      {controls}
    </main>
  );
}
