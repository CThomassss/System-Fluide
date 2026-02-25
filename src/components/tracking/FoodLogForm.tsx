"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FOOD_ITEMS, FOOD_MACRO_DATA, type FoodKey } from "@/lib/foods";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";

interface CustomFood {
  id: string;
  name: string;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  calories_per_100g: number;
}

interface FoodLogEntry {
  id: string;
  food_key: string;
  food_label: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodLogFormProps {
  date: string;
  initialLogs: FoodLogEntry[];
  customFoods: CustomFood[];
}

export function FoodLogForm({ date, initialLogs, customFoods }: FoodLogFormProps) {
  const t = useTranslations("tracking");
  const tResults = useTranslations("results");
  const router = useRouter();
  const [logs, setLogs] = useState<FoodLogEntry[]>(initialLogs);
  const [selectedFood, setSelectedFood] = useState("");
  const [grams, setGrams] = useState("100");
  const [adding, setAdding] = useState(false);

  const getMacros = (key: string, g: number) => {
    // Check standard foods
    if (key in FOOD_MACRO_DATA) {
      const data = FOOD_MACRO_DATA[key as FoodKey];
      const ratio = g / 100;
      return {
        calories: Math.round(data.calories * ratio),
        protein: parseFloat((data.protein * ratio).toFixed(1)),
        carbs: parseFloat((data.carbs * ratio).toFixed(1)),
        fat: parseFloat((data.fat * ratio).toFixed(1)),
      };
    }
    // Check custom foods
    if (key.startsWith("custom_")) {
      const cf = customFoods.find((f) => `custom_${f.id}` === key);
      if (cf) {
        const ratio = g / 100;
        return {
          calories: Math.round(cf.calories_per_100g * ratio),
          protein: parseFloat((cf.protein_per_100g * ratio).toFixed(1)),
          carbs: parseFloat((cf.carbs_per_100g * ratio).toFixed(1)),
          fat: parseFloat((cf.fat_per_100g * ratio).toFixed(1)),
        };
      }
    }
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  };

  const getFoodLabel = (key: string) => {
    if (key.startsWith("custom_")) {
      return customFoods.find((f) => `custom_${f.id}` === key)?.name ?? key;
    }
    try {
      return tResults(`food_${key}` as Parameters<typeof tResults>[0]);
    } catch {
      return key;
    }
  };

  const handleAdd = async () => {
    if (!selectedFood || !grams) return;
    setAdding(true);
    const g = parseFloat(grams);
    const macros = getMacros(selectedFood, g);
    const label = getFoodLabel(selectedFood);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAdding(false); return; }

    const { data, error } = await supabase
      .from("food_logs")
      .insert({
        user_id: user.id,
        date,
        food_key: selectedFood,
        food_label: label,
        grams: g,
        ...macros,
      })
      .select()
      .single();

    if (!error && data) {
      setLogs([...logs, data as FoodLogEntry]);
      setSelectedFood("");
      setGrams("100");
    }
    setAdding(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("food_logs").delete().eq("id", id);
    setLogs(logs.filter((l) => l.id !== id));
    router.refresh();
  };

  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein: acc.protein + l.protein,
      carbs: acc.carbs + l.carbs,
      fat: acc.fat + l.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const inputClass =
    "rounded-lg border border-surface-light bg-background px-2 py-1.5 text-sm outline-none focus:border-accent";

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed size={18} className="text-foreground" />
        <h3 className="font-display text-xl font-bold">{t("food_log_title")}</h3>
      </div>

      {/* Add food row */}
      <div className="flex flex-wrap gap-2 items-end">
        <select
          value={selectedFood}
          onChange={(e) => setSelectedFood(e.target.value)}
          className={`flex-1 min-w-[140px] ${inputClass}`}
        >
          <option value="">{t("food_log_select")}</option>
          {FOOD_ITEMS.map((key) => (
            <option key={key} value={key}>
              {tResults(`food_${key}` as Parameters<typeof tResults>[0])}
            </option>
          ))}
          {customFoods.map((cf) => (
            <option key={cf.id} value={`custom_${cf.id}`}>
              {cf.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="g"
          min={1}
          className={`w-20 ${inputClass}`}
        />
        <Button onClick={handleAdd} disabled={adding} className="px-3 py-1.5 text-xs">
          <Plus size={14} />
          {t("food_log_add")}
        </Button>
      </div>

      {/* Logged foods */}
      {logs.length > 0 && (
        <div className="mt-4 space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl bg-background/50 px-4 py-2"
            >
              <div className="flex-1">
                <span className="font-display font-semibold text-sm">{log.food_label}</span>
                <span className="ml-2 text-xs text-foreground/50">{log.grams}g</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-foreground/60">
                <span>{log.calories} kcal</span>
                <span>P {log.protein}g</span>
                <span>C {log.carbs}g</span>
                <span>F {log.fat}g</span>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="p-1 text-foreground/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="flex items-center justify-between rounded-xl bg-accent/10 px-4 py-2 font-semibold text-sm">
            <span>{t("food_log_total")}</span>
            <div className="flex items-center gap-3 text-xs">
              <span>{totals.calories} kcal</span>
              <span>P {totals.protein.toFixed(1)}g</span>
              <span>C {totals.carbs.toFixed(1)}g</span>
              <span>F {totals.fat.toFixed(1)}g</span>
              <span className="w-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
