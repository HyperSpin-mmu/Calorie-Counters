// Shared types for anything related to food logging / diary entries.
// Keeping these in one place prevents everyone from inventing slightly different shapes.

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

// MealType becomes a strict union type: "breakfast" | "lunch" | "dinner" | "snack"
// That means TypeScript will catch typos like "Breakfast" or "launch".
export type MealType = (typeof MEAL_TYPES)[number];

// A single logged food item in the diary.
// We store a timestamp so the system can automatically record *when* it was logged.
export type FoodLogEntry = {
  // Unique id for this entry (can be generated on the client, or returned from Firebase).
  id: string;

  // Owner of the entry (comes from auth).
  userId: string;

  // When the user logged it (Unix time in milliseconds: Date.now()).
  // We use ms (not seconds) because that’s what JS gives us by default.
  timestamp: number;

  // Which meal bucket this entry belongs to.
  mealType: MealType;

  // What the user ate.
  name: string;

  // Calories + macros (grams). If you don’t know a value, store 0 (don’t store null).
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // Optional: portion info (nice for manual entry and better diary display).
  // Example: quantity=2, unit="slices"
  quantity?: number;
  unit?: string;

  // Optional: helps us debug where the entry came from.
  source?: "manual" | "barcode";

  // Optional: saved if scanned (Ben’s part).
  barcode?: string;
};

// Handy type for totals shown at the top of the diary.
export type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};