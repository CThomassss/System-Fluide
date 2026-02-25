"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { scaleMeals } from "@/lib/calculations";
import { computeMealMacros } from "@/lib/foods";
import type { BaseMeal } from "@/lib/constants";

interface MacroGrams {
  protein: number;
  fat: number;
  carbs: number;
}

interface CustomFoodData {
  id: string;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  calories_per_100g: number;
}

interface MealSuggestionsProps {
  targetCalories: number;
  macroGrams?: MacroGrams;
  customMeals?: BaseMeal[] | null;
  customFoods?: CustomFoodData[];
}

export function MealSuggestions({ targetCalories, macroGrams, customMeals, customFoods }: MealSuggestionsProps) {
  const t = useTranslations("results");
  const meals: BaseMeal[] = customMeals ?? scaleMeals(targetCalories);

  // Compute real macros from meal items when custom meals + custom foods are available
  const realMacros = customMeals && customFoods
    ? computeMealMacros(customMeals, customFoods)
    : null;
  const displayMacros = realMacros
    ? { protein: realMacros.protein, carbs: realMacros.carbs, fat: realMacros.fat }
    : macroGrams;

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("meals_title")}</h3>
      <p className="mt-1 text-sm text-foreground/50">
        {t("meals_scaled_for", { calories: targetCalories })}
      </p>

      {displayMacros && (
        <div className="mt-3 flex flex-wrap gap-3">
          <MacroPill label={t("protein")} grams={displayMacros.protein} color="bg-accent/20 text-accent" />
          <MacroPill label={t("carbs")} grams={displayMacros.carbs} color="bg-green/20 text-green" />
          <MacroPill label={t("fat")} grams={displayMacros.fat} color="bg-blue-400/20 text-blue-400" />
        </div>
      )}

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
              <UtensilsCrossed size={16} className="text-foreground shrink-0" />
              <span className="font-display font-semibold text-sm">
                {t(`slot_${slot}`)}
              </span>
            </div>
            <div className="space-y-1 pl-6">
              {items.map((item) => {
                const label = item.label ?? t(`food_${item.key}` as Parameters<typeof t>[0]);
                return (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">{label}</span>
                    <span className="font-semibold text-foreground/90">{item.grams}g</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-background/50 p-4">
        <h4 className="font-display font-semibold text-sm mb-3">{t("equivalents_title")}</h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold text-accent">{t("protein")}</span>
            <span className="text-foreground/60"> : {t("equiv_protein")}</span>
          </div>
          <div>
            <span className="font-semibold text-green">{t("carbs")}</span>
            <span className="text-foreground/60"> : {t("equiv_carbs")}</span>
          </div>
          <div>
            <span className="font-semibold text-blue-400">{t("fat")}</span>
            <span className="text-foreground/60"> : {t("equiv_fat")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroPill({ label, grams, color }: { label: string; grams: number; color: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {label} {grams}g
    </span>
  );
}
