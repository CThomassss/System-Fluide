"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Apple } from "lucide-react";

export interface CustomFood {
  id: string;
  name: string;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  calories_per_100g: number;
}

interface CustomFoodEditorProps {
  initialFoods: CustomFood[];
}

export function CustomFoodEditor({ initialFoods }: CustomFoodEditorProps) {
  const t = useTranslations("admin");
  const [foods, setFoods] = useState<CustomFood[]>(initialFoods);
  const [name, setName] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [calories, setCalories] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!name || !protein || !carbs || !fat || !calories) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("custom_foods")
      .insert({
        name,
        protein_per_100g: parseFloat(protein),
        carbs_per_100g: parseFloat(carbs),
        fat_per_100g: parseFloat(fat),
        calories_per_100g: parseFloat(calories),
      })
      .select()
      .single();

    if (!error && data) {
      setFoods([...foods, data as CustomFood]);
      setName("");
      setProtein("");
      setCarbs("");
      setFat("");
      setCalories("");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("custom_foods").delete().eq("id", id);
    setFoods(foods.filter((f) => f.id !== id));
  };

  const inputClass =
    "w-full rounded-lg border border-surface-light bg-background px-2 py-1.5 text-sm outline-none focus:border-accent";

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <div className="flex items-center gap-2 mb-4">
        <Apple size={18} className="text-foreground" />
        <h3 className="font-display text-lg font-semibold">{t("custom_foods_title")}</h3>
      </div>

      {/* Existing foods list */}
      {foods.length > 0 && (
        <div className="mb-4 space-y-2">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between rounded-xl bg-background/50 px-4 py-2"
            >
              <div className="flex-1">
                <span className="font-display font-semibold text-sm">{food.name}</span>
                <span className="ml-3 text-xs text-foreground/50">
                  P {food.protein_per_100g}g · C {food.carbs_per_100g}g · F {food.fat_per_100g}g · {food.calories_per_100g} kcal
                </span>
              </div>
              <button
                onClick={() => handleDelete(food.id)}
                className="p-1 text-foreground/30 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new food form */}
      <div className="grid gap-2 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder={t("food_name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <input
          type="number"
          step="0.1"
          placeholder={t("protein_short")}
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          step="0.1"
          placeholder={t("carbs_short")}
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          step="0.1"
          placeholder={t("fat_short")}
          value={fat}
          onChange={(e) => setFat(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          step="0.1"
          placeholder="kcal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="mt-3">
        <Button onClick={handleAdd} disabled={saving} className="px-3 py-2 text-xs">
          <Plus size={14} />
          {t("add_custom_food")}
        </Button>
      </div>
    </div>
  );
}
