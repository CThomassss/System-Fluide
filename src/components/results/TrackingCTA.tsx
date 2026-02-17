"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function TrackingCTA() {
  const t = useTranslations("results");

  return (
    <div className="rounded-2xl border-2 border-orange/30 bg-orange/5 p-6 text-center">
      <h3 className="font-condensed text-xl font-bold text-orange">
        {t("tracking_cta_title")}
      </h3>
      <p className="mt-2 text-sm text-foreground/60">
        {t("tracking_cta_desc")}
      </p>
      <div className="mt-4">
        <Link href="/auth/signup">
          <Button>
            {t("tracking_cta_button")}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
