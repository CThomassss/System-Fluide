"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Flame, Footprints, Dumbbell, UtensilsCrossed } from "lucide-react";

const pillars = [
  { key: "bmr", icon: Flame, color: "text-orange" },
  { key: "neat", icon: Footprints, color: "text-green" },
  { key: "eat", icon: Dumbbell, color: "text-orange-light" },
  { key: "tef", icon: UtensilsCrossed, color: "text-green-light" },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function TriangleExplainer() {
  const t = useTranslations("landing");

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-condensed text-3xl font-bold sm:text-4xl">
          {t("triangle_title")}
        </h2>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pillars.map(({ key, icon: Icon, color }) => (
            <motion.div
              key={key}
              variants={item}
              className="rounded-2xl border border-surface-light bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <Icon size={24} className={color} />
                <div>
                  <span className={`font-condensed text-xl font-bold ${color}`}>
                    {t(`pillar_${key}`)}
                  </span>
                  <span className="ml-2 text-sm text-foreground/50">
                    {t(`pillar_${key}_pct`)}
                  </span>
                </div>
              </div>
              <p className="mt-1 font-condensed text-sm font-semibold text-foreground/80">
                {t(`pillar_${key}_name`)}
              </p>
              <p className="mt-2 text-sm text-foreground/50 leading-relaxed">
                {t(`pillar_${key}_desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
