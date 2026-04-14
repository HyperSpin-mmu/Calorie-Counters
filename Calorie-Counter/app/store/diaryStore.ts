// This module defines a Zustand store for managing the user's food diary entries in the Calorie Counter app. 
// It provides actions to add, remove, and clear diary entries, allowing users to keep track of their meals and 
// nutritional intake effectively.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './authStore';
import type { Meal } from './mealStore';


// This store manages the state of the user's food diary entries.
export interface DiaryEntry {
  id: string;
  foodItem: string;
  brand: string;
  amount: string;
  unit: string;
  mealType: string;
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  timestamp: string;
}

// The DiaryState interface defines the structure of the state and the actions available for managing diary entries.
interface DiaryState {
  entries: DiaryEntry[];
  addEntry: (newEntry: DiaryEntry) => void;
  removeEntry: (id: string) => void;
  clearDiary: () => void;
  logSavedMeal: (meal: Meal, mealType?: string) => void;
}



// The useDiaryStore hook provides access to the diary state and actions for adding, removing, and clearing entries in the user's food diary.
export const useDiaryStore = create<DiaryState>()(persist((set) => ({
  entries: [],

  addEntry: (newEntry) => set((state) => ({ 
    entries: [...state.entries, newEntry] 
  })),

  removeEntry: (id) => set((state) => ({ 
    entries: state.entries.filter((entry) => entry.id !== id) 
  })),

  logSavedMeal: (meal: Meal, mealType: string = "Lunch") =>
  set((state) => ({
    entries: [
      ...state.entries,
      {
        id: Date.now().toString(),
        foodItem: meal.name,
        brand: "Saved Meal",
        amount: "1",
        unit: "serving",
        mealType,
        macros: {
          calories: Number(meal.calories) || 0,
          carbs: Number(meal.carbs) || 0,
          protein: Number(meal.protein) || 0,
          fat: Number(meal.fat) || 0,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  })),

  clearDiary: () => set({ entries: [] }),
}) , {

  name : 'default-diary', // Name of the storage key for persistence
  storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
}));