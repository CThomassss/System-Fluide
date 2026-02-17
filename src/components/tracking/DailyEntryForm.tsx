"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export function DailyEntryForm() {
  const t = useTranslations("tracking");
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    await supabase
      .from("daily_entries")
      .upsert(
        {
          user_id: user.id,
          date: today,
          weight: weight ? parseFloat(weight) : null,
          steps: steps ? parseInt(steps, 10) : null,
          calories: calories ? parseInt(calories, 10) : null,
        },
        { onConflict: "user_id,date" }
      );

    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h2 className="font-condensed text-xl font-bold">{t("daily_title")}</h2>
      <p className="mt-1 text-sm text-foreground/60">{t("daily_subtitle")}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="weight" className="block text-sm font-semibold font-condensed">{t("weight")}</label>
          <input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="75.0"
            className="mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-orange"
          />
        </div>
        <div>
          <label htmlFor="steps" className="block text-sm font-semibold font-condensed">{t("steps")}</label>
          <input
            id="steps"
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="10000"
            className="mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-orange"
          />
        </div>
        <div>
          <label htmlFor="calories" className="block text-sm font-semibold font-condensed">{t("calories")}</label>
          <input
            id="calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="2200"
            className="mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-orange"
          />
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {saved ? <Check size={16} /> : null}
          {saved ? t("saved") : loading ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
