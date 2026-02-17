"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Flame, Footprints, Dumbbell, UtensilsCrossed } from "lucide-react";

const pillars = [
  { key: "bmr", icon: Flame },
  { key: "neat", icon: Footprints },
  { key: "eat", icon: Dumbbell },
  { key: "tef", icon: UtensilsCrossed },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TriangleExplainer() {
  const t = useTranslations("landing");

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm uppercase tracking-[0.2em] text-accent-muted">
          {t("triangle_label")}
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t("triangle_title")}
        </h2>

        <motion.div
          className="mt-16 grid gap-4 sm:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {pillars.map(({ key, icon: Icon }) => (
            <motion.div
              key={key}
              variants={item}
              className="rounded-2xl border border-surface-light bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light">
                  <Icon size={18} className="text-foreground" />
                </div>
                <div>
                  <span className="font-display text-lg font-bold">
                    {t(`pillar_${key}`)}
                  </span>
                  <span className="ml-2 text-sm text-accent-muted">
                    {t(`pillar_${key}_pct`)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/80">
                {t(`pillar_${key}_name`)}
              </p>
              <p className="mt-1 text-sm text-accent-muted leading-relaxed">
                {t(`pillar_${key}_desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
