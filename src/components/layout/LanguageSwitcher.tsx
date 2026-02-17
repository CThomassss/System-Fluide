"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "fr" ? "en" : "fr";

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
      aria-label={`Switch to ${nextLocale === "fr" ? "Français" : "English"}`}
    >
      <Globe size={16} />
      <span className="uppercase">{nextLocale}</span>
    </button>
  );
}
