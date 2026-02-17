"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Goal } from "@/types/quiz";

interface ReverseDietProps {
  goal: Goal;
  tdee: number;
}

export function ReverseDiet({ goal, tdee }: ReverseDietProps) {
  const t = useTranslations("results");
  const [open, setOpen] = useState(false);

  const buttonKey =
    goal === "cut" ? "reverse_button_cut"
    : goal === "bulk" ? "reverse_button_bulk"
    : "reverse_button_recomp";

  const direction = goal === "cut" ? +100 : -100;

  return (
    <div className="rounded-2xl border border-surface-light bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <h3 className="font-display text-xl font-bold">{t(buttonKey)}</h3>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-foreground/50" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-6 pb-6">
              <p className="text-sm text-foreground/70">
                {t(`reverse_intro_${goal}`)}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-foreground">1</span>
                  <span className="text-sm">{t("reverse_step_1", { amount: Math.abs(direction) })}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-foreground">2</span>
                  <span className="text-sm">{t("reverse_step_2")}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-foreground">3</span>
                  <span className="text-sm">{t("reverse_step_3", { tdee })}</span>
                </div>
              </div>

              <div className="rounded-xl bg-green/10 p-3">
                <p className="text-sm font-semibold text-green">{t("reverse_benefits")}</p>
              </div>

              <p className="text-center text-sm font-semibold text-foreground">
                {t("reverse_motivation")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
