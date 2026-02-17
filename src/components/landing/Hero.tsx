"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
      <motion.h1
        className="font-condensed text-5xl font-bold leading-tight sm:text-6xl md:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="glow-orange text-orange">{t("hero_title")}</span>
        <br />
        <span className="text-foreground">{t("hero_subtitle")}</span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-lg text-foreground/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {t("hero_description")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-10"
      >
        <Link href="/quiz">
          <Button>
            {t("cta")}
            <ArrowRight size={18} />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
