"use client";

import { useTranslations } from "next-intl";
import { X, Plus } from "lucide-react";
import { FOOD_ITEMS, type FoodKey } from "@/lib/foods";
import type { BaseMealItem } from "@/lib/constants";

interface MealSlotEditorProps {
  slot: string;
  items: BaseMealItem[];
  onChange: (items: BaseMealItem[]) => void;
}

export function MealSlotEditor({ slot, items, onChange }: MealSlotEditorProps) {
  const t = useTranslations("results");
  const ta = useTranslations("admin");

  const usedKeys = new Set(items.map((i) => i.key));
  const availableFoods = FOOD_ITEMS.filter((f) => !usedKeys.has(f));

  const updateGrams = (index: number, grams: number) => {
    const next = [...items];
    next[index] = { ...next[index], grams };
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = (key: string) => {
    if (!key) return;
    onChange([...items, { key, grams: 100 }]);
  };

  return (
    <div className="rounded-xl border border-surface-light bg-background/50 p-4">
      <h5 className="font-display font-semibold text-sm mb-3">
        {t(`slot_${slot}` as Parameters<typeof t>[0])}
      </h5>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="text-sm text-foreground/70 flex-1 truncate">
              {t(`food_${item.key}` as Parameters<typeof t>[0])}
            </span>
            <input
              type="number"
              value={item.grams}
              onChange={(e) => updateGrams(i, Number(e.target.value))}
              className="w-20 rounded-lg border border-surface-light bg-background px-2 py-1 text-sm text-right outline-none focus:border-accent"
              min={0}
            />
            <span className="text-xs text-foreground/40">{ta("grams_unit")}</span>
            <button
              onClick={() => removeItem(i)}
              className="p-1 text-foreground/30 hover:text-red-400 transition-colors"
              title={ta("remove_food")}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {availableFoods.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <Plus size={14} className="text-foreground/40" />
          <select
            onChange={(e) => {
              addItem(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="flex-1 rounded-lg border border-surface-light bg-background px-2 py-1 text-sm outline-none focus:border-accent"
          >
            <option value="" disabled>
              {ta("select_food")}
            </option>
            {availableFoods.map((food) => (
              <option key={food} value={food}>
                {t(`food_${food}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
