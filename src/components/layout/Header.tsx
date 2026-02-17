"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const t = useTranslations("header");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuth(!!user);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-light/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-condensed text-xl font-bold tracking-tight text-orange">
          {t("title")}
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="font-condensed text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
          >
            {t("quiz")}
          </Link>
          {isAuth && (
            <Link
              href="/suivi"
              className="font-condensed text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
            >
              {t("tracking")}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
