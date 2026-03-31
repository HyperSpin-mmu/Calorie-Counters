// This module defines a Zustand store for managing the user's food diary entries in the Calorie Counter app. 
// It provides actions to add, remove, and clear diary entries, allowing users to keep track of their meals and 
// nutritional intake effectively.

import { create } from 'zustand';

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
    carbs: string;
    protein: string;
    fat: string;
  };
  timestamp: string;
}

// The DiaryState interface defines the structure of the state and the actions available for managing diary entries.
interface DiaryState {
  entries: DiaryEntry[];
  addEntry: (newEntry: DiaryEntry) => void;
  removeEntry: (id: string) => void;
  clearDiary: () => void;
}

// The useDiaryStore hook provides access to the diary state and actions for adding, removing, and clearing entries in the user's food diary.
export const useDiaryStore = create<DiaryState>((set) => ({
  entries: [],

  addEntry: (newEntry) => set((state) => ({ 
    entries: [...state.entries, newEntry] 
  })),

  removeEntry: (id) => set((state) => ({ 
    entries: state.entries.filter((entry) => entry.id !== id) 
  })),

  clearDiary: () => set({ entries: [] }),
}));