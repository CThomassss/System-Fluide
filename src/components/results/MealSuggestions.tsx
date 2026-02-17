"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { scaleMeals } from "@/lib/calculations";

interface MealSuggestionsProps {
  targetCalories: number;
}

export function MealSuggestions({ targetCalories }: MealSuggestionsProps) {
  const t = useTranslations("results");
  const meals = scaleMeals(targetCalories);

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-condensed text-xl font-bold">{t("meals_title")}</h3>
      <p className="mt-1 text-sm text-foreground/50">
        {t("meals_scaled_for", { calories: targetCalories })}
      </p>
      <div className="mt-4 space-y-4">
        {meals.map(({ slot, items }, i) => (
          <motion.div
            key={slot}
            className="rounded-xl bg-background/50 p-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={16} className="text-orange shrink-0" />
              <span className="font-condensed font-semibold text-sm">
                {t(`slot_${slot}`)}
              </span>
            </div>
            <div className="space-y-1 pl-6">
              {items.map(({ key, grams }) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">{t(`food_${key}`)}</span>
                  <span className="font-semibold text-foreground/90">{grams}g</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
