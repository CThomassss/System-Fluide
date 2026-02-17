"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-surface-light/20">
      <div className="mx-auto max-w-5xl px-6 py-10 text-center">
        <p className="text-sm text-accent-muted">
          {t("made_with")}
        </p>
        <p className="mt-2 text-xs text-accent-muted/50 max-w-md mx-auto">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
