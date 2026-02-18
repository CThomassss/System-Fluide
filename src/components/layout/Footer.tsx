"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-surface-light/20">
      <div className="mx-auto max-w-5xl px-6 py-6 text-center">
        <p className="text-xs text-accent-muted/50">{t("copyright")}</p>
      </div>
    </footer>
  );
}
