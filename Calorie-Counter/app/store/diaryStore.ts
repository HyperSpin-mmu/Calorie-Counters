// app/store/diaryStore.ts
// This store keeps all food diary entries in one place.
// It follows the shared structure from Sprint 1 so the rest of the app
// works with one consistent format.

import { create } from "zustand";
import type { FoodLogEntry } from "@/app/types/food";
import {
  calculateMacroTotals,
  filterEntriesByDay,
  getLocalDayKey,
  groupEntriesByMealType,
} from "@/app/utils/diary";

// This describes everything the diary store needs to hold and do.
interface DiaryState {
  // All food entries currently stored in the diary.
  entries: FoodLogEntry[];

  // The day currently being viewed in the diary.
  // Stored as a local day key like "2026-03-16".
  selectedDay: string;

  // Add a new food entry to the diary.
  addEntry: (newEntry: FoodLogEntry) => void;

  // Remove one entry by id.
  removeEntry: (id: string) => void;

  // Update part of an existing entry.
  updateEntry: (id: string, updatedFields: Partial<FoodLogEntry>) => void;

  // Change the day the user is viewing.
  setSelectedDay: (day: string) => void;

  // Remove all diary entries.
  clearDiary: () => void;

  // Get entries that belong to the currently selected day.
  getEntriesForSelectedDay: () => FoodLogEntry[];

  // Group the current day's entries by meal type.
  getGroupedEntriesForSelectedDay: () => ReturnType<typeof groupEntriesByMealType>;

  // Calculate calorie and macro totals for the selected day.
  getMacroTotalsForSelectedDay: () => ReturnType<typeof calculateMacroTotals>;
}

// We use today's local day as the default starting point.
const today = getLocalDayKey(Date.now());

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  selectedDay: today,

  addEntry: (newEntry) =>
    set((state) => ({
      entries: [...state.entries, newEntry],
    })),

  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),

  updateEntry: (id, updatedFields) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedFields } : entry
      ),
    })),

  setSelectedDay: (day) =>
    set({
      selectedDay: day,
    }),

  clearDiary: () =>
    set({
      entries: [],
    }),

  getEntriesForSelectedDay: () => {
    const { entries, selectedDay } = get();
    return filterEntriesByDay(entries, selectedDay);
  },

  getGroupedEntriesForSelectedDay: () => {
    const selectedEntries = get().getEntriesForSelectedDay();
    return groupEntriesByMealType(selectedEntries);
  },

  getMacroTotalsForSelectedDay: () => {
    const selectedEntries = get().getEntriesForSelectedDay();
    return calculateMacroTotals(selectedEntries);
  },
}));