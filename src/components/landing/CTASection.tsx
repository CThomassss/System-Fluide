"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const t = useTranslations("landing");

  return (
    <section className="px-6 py-24">
      <motion.div
        className="mx-auto max-w-2xl rounded-2xl border border-surface-light bg-surface p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight">
          {t("cta_bottom_title")}
        </h2>
        <p className="mt-3 text-accent-muted">{t("cta_bottom_desc")}</p>
        <div className="mt-8">
          <Link href="/quiz">
            <Button>
              {t("cta_bottom")}
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
