import { getCurrentWeekBounds, getPreviousWeekBounds } from "@/lib/weekUtils";

interface WeightEntry {
  date: string;
  weight: number | null;
}

interface AdjustmentResult {
  shouldAdjust: boolean;
  newTargetCalories: number;
  reason: string;
}

/**
 * Semi-automatic calorie adjustment based on weight trends.
 * Uses Monday-Sunday calendar weeks for comparison.
 * Requires entries in both current and previous weeks.
 */
export function computeCalorieAdjustment(
  goal: string,
  currentTarget: number,
  bmr: number,
  entries: WeightEntry[]
): AdjustmentResult | null {
  const { mondayStr, sundayStr } = getCurrentWeekBounds();
  const { mondayStr: prevMondayStr, sundayStr: prevSundayStr } = getPreviousWeekBounds();
  const last7 = entries.filter((e) => e.date >= mondayStr && e.date <= sundayStr);
  const prev7 = entries.filter((e) => e.date >= prevMondayStr && e.date <= prevSundayStr);

  const avgWeight = (list: WeightEntry[]) => {
    const valid = list.map((e) => e.weight).filter((v): v is number => v !== null);
    if (valid.length < 3) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const currentAvg = avgWeight(last7);
  const previousAvg = avgWeight(prev7);

  if (currentAvg === null || previousAvg === null) return null;

  const change = currentAvg - previousAvg;

  if (goal === "bulk" && change < 0.1) {
    const newTarget = currentTarget + 100;
    return {
      shouldAdjust: true,
      newTargetCalories: newTarget,
      reason: "adjust_bulk_no_gain",
    };
  }

  if (goal === "cut" && change > -0.2) {
    const newTarget = Math.max(bmr, currentTarget - 100);
    return {
      shouldAdjust: true,
      newTargetCalories: newTarget,
      reason: "adjust_cut_no_loss",
    };
  }

  return null;
}
