// app/types/food.ts
// Shared types for anything related to food logging / diary entries.
// Keeping these in one place prevents everyone from inventing slightly different shapes.

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

// MealType becomes a strict union type: "breakfast" | "lunch" | "dinner" | "snack"
// That means TypeScript will catch typos like "Breakfast" or "launch".
export type MealType = (typeof MEAL_TYPES)[number];