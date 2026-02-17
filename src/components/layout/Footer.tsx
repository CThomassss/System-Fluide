"use client";

import { useTranslations } from "next-intl";
import { FlaskConical } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-surface-light/30 bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="flex items-center justify-center gap-2 text-sm text-foreground/50">
          <FlaskConical size={14} />
          {t("made_with")}
        </p>
        <p className="mt-2 text-xs text-foreground/30 max-w-md mx-auto">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
