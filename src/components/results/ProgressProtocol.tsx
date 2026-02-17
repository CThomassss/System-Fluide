"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import type { Goal } from "@/types/quiz";

interface ProgressProtocolProps {
  goal: Goal;
}

export function ProgressProtocol({ goal }: ProgressProtocolProps) {
  const t = useTranslations("results");

  const steps: string[] = [];
  const count = Number(t(`protocol_${goal}_count`));
  for (let i = 1; i <= count; i++) {
    steps.push(t(`protocol_${goal}_step_${i}`));
  }

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <div className="flex items-center gap-2">
        <ClipboardList size={20} className="text-foreground" />
        <h3 className="font-display text-xl font-bold">{t("protocol_title")}</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/50">{t(`protocol_${goal}_intro`)}</p>
      <div className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex gap-3 rounded-xl bg-background/50 p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-foreground">
              {i + 1}
            </span>
            <span className="text-sm">{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
