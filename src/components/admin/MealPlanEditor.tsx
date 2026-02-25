"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { MealSlotEditor } from "./MealSlotEditor";
import { Save, UtensilsCrossed } from "lucide-react";
import type { BaseMeal } from "@/lib/constants";
import type { CustomFood } from "./CustomFoodEditor";

const SLOTS = ["breakfast", "lunch", "preworkout", "dinner"] as const;

interface MealPlanEditorProps {
  userId: string;
  initialMeals: BaseMeal[] | null;
  computedMeals: BaseMeal[] | null;
  customFoods?: CustomFood[];
}

export function MealPlanEditor({ userId, initialMeals, computedMeals, customFoods }: MealPlanEditorProps) {
  const t = useTranslations("admin");
  const baseMeals = initialMeals ?? computedMeals ?? SLOTS.map((s) => ({ slot: s, items: [] }));

  const [meals, setMeals] = useState<BaseMeal[]>(baseMeals);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSlot = (slotIndex: number, items: BaseMeal["items"]) => {
    const next = [...meals];
    next[slotIndex] = { ...next[slotIndex], items };
    setMeals(next);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ custom_meals: JSON.stringify(meals) })
      .eq("id", userId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const handleReset = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ custom_meals: null })
      .eq("id", userId);
    setMeals(computedMeals ?? SLOTS.map((s) => ({ slot: s, items: [] })));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <div className="rounded-2xl border border-surface-light bg-background/50 p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed size={18} className="text-foreground" />
          <h4 className="font-display font-semibold">{t("meal_editor")}</h4>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset} disabled={saving} className="px-3 py-2 text-xs">
            {t("reset_meals")}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="px-3 py-2 text-xs">
            <Save size={14} />
            {saved ? t("saved") : saving ? t("saving") : t("save_meals")}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {meals.map((meal, i) => (
          <MealSlotEditor
            key={meal.slot}
            slot={meal.slot}
            items={meal.items}
            customFoods={customFoods}
            onChange={(items) => updateSlot(i, items)}
          />
        ))}
      </div>
    </div>
  );
}
