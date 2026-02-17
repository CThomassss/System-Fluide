"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

interface Entry {
  date: string;
  weight: number | null;
  steps: number | null;
  calories: number | null;
}

interface EntryCalendarProps {
  entries: Entry[];
}

export function EntryCalendar({ entries }: EntryCalendarProps) {
  const t = useTranslations("tracking");
  const tResults = useTranslations("results");

  const entryDates = new Set(entries.map((e) => e.date));

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  // Monday = 0 in our system (ISO)
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayLabels = [
    tResults("day_mon"),
    tResults("day_tue"),
    tResults("day_wed"),
    tResults("day_thu"),
    tResults("day_fri"),
    tResults("day_sat"),
    tResults("day_sun"),
  ];

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = today.toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("calendar_title")}</h3>
      <p className="mt-1 text-sm text-foreground/50">
        {firstDay.toLocaleString("default", { month: "long", year: "numeric" })}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-display font-semibold text-foreground/40 pb-2">
            {label}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasEntry = entryDates.has(dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div
              key={day}
              className={`relative flex h-10 items-center justify-center rounded-lg text-sm ${
                hasEntry
                  ? "bg-green/20 text-green font-semibold"
                  : isToday
                    ? "bg-accent/10 text-foreground font-semibold"
                    : "text-foreground/40"
              }`}
            >
              {day}
              {hasEntry && (
                <Check size={10} className="absolute top-1 right-1 text-green" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
