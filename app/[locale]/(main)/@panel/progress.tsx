"use client";

import { useAppStore } from "@/stores/app";

export function Progress() {
  const progress = useAppStore((state) => state.progress);

  if (!progress) return null;

  return (
    <div
      className="absolute left-0 top-0 h-0.5 w-px bg-white shadow-md duration-300"
      style={{ width: `${progress * 50}%` }}
    />
  );
}
