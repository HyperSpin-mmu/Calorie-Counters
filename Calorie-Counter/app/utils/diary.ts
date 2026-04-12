// Helpers for turning timestamp-based entries into a diary view.
// We use the phone's local time because "today" should match what the user sees locally.

import type { FoodLogEntry, MacroTotals, MealType } from "@/app/types/food";

/**
 * Returns a stable "day key" for local time, e.g. "2026-03-16".
 * This is the easiest way to group entries by day without fighting timezones.
 */
export function getLocalDayKey(timestamp: number): string {
  const d = new Date(timestamp);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Filters entries to only the ones belonging to a specific local day key.
 * Example dayKey: "2026-03-16"
 */
export function filterEntriesByDay(
  entries: FoodLogEntry[],
  dayKey: string
): FoodLogEntry[] {
  return entries.filter((e) => getLocalDayKey(e.timestamp) === dayKey);
}

/**
 * Groups entries by meal type (breakfast/lunch/dinner/snack).
 * This keeps the diary page logic clean.
 */
export function groupEntriesByMealType(entries: FoodLogEntry[]): Record<MealType, FoodLogEntry[]> {
  return {
    breakfast: entries.filter((e) => e.mealType === "breakfast"),
    lunch: entries.filter((e) => e.mealType === "lunch"),
    dinner: entries.filter((e) => e.mealType === "dinner"),
    snack: entries.filter((e) => e.mealType === "snack"),
  };
}

/**
 * Adds up macros for a list of entries.
 * We assume all numeric fields are present; if a value is unknown, store 0 at the source.
 */
export function calculateMacroTotals(entries: FoodLogEntry[]): MacroTotals {
  return entries.reduce<MacroTotals>(
    (totals, e) => {
      totals.calories += e.calories;
      totals.protein += e.protein;
      totals.carbs += e.carbs;
      totals.fat += e.fat;
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}