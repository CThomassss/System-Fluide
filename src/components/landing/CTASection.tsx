"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const t = useTranslations("landing");

  return (
    <section className="px-4 py-20">
      <motion.div
        className="mx-auto max-w-2xl rounded-2xl border border-surface-light bg-surface p-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-condensed text-3xl font-bold">
          {t("cta_bottom_title")}
        </h2>
        <p className="mt-3 text-foreground/60">{t("cta_bottom_desc")}</p>
        <div className="mt-8">
          <Link href="/quiz">
            <Button>
              {t("cta_bottom")}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
