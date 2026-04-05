// This helper converts barcode scan results into the diary entry format.
// If the barcode data is missing anything useful, it is cleaned up before saving.

import type { FoodLogEntry, MealType } from "../types/food";

// This matches the shape currently returned by the barcode API.
type BarcodeFoodResult = {
  name: string;
  brand?: string;
  calories: number | string;
  carbs: number | string;
  protein: number | string;
  fat: number | string;
};

// This turns barcode values into numbers for the diary.
// If a value is missing or unusable, it falls back to 0.
function toSafeNumber(value: number | string | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleanedValue = value.trim();

    if (!cleanedValue || cleanedValue.toUpperCase() === "N/A") {
      return 0;
    }

    const parsedValue = Number(cleanedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

// Builds a proper diary entry from a scanned product.
// The system sets the log time automatically using Date.now().
export function mapBarcodeFoodToDiaryEntry(params: {
  food: BarcodeFoodResult;
  userId: string;
  mealType: MealType;
  barcode?: string;
  quantity?: number;
  unit?: string;
}): FoodLogEntry {
  const { food, userId, mealType, barcode, quantity, unit } = params;

  return {
    id: `${barcode ?? "scan"}-${Date.now()}`,
    userId,
    timestamp: Date.now(),
    mealType,
    name: food.name || "Unknown Product",
    calories: toSafeNumber(food.calories),
    protein: toSafeNumber(food.protein),
    carbs: toSafeNumber(food.carbs),
    fat: toSafeNumber(food.fat),
    quantity,
    unit,
    source: "barcode",
    barcode,
  };
}