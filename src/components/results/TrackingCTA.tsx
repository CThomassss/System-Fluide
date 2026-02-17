"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function TrackingCTA() {
  const t = useTranslations("results");
  const searchParams = useSearchParams();

  // Forward quiz params to signup so they can be saved to profile
  const signupUrl = `/auth/signup?${searchParams.toString()}`;

  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 text-center">
      <h3 className="font-display text-xl font-bold text-foreground">
        {t("tracking_cta_title")}
      </h3>
      <p className="mt-2 text-sm text-foreground/60">
        {t("tracking_cta_desc")}
      </p>
      <div className="mt-4">
        <Link href={signupUrl}>
          <Button>
            {t("tracking_cta_button")}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
