import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meal = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};


export type LogEntry = {
  id: string;
  mealId: string;
  mealName: string;
  calories: number;
  loggedAt: string;
};

type MealStore = {
  savedMeals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
  updateMeal: (id: string, updates: Partial<Omit<Meal, 'id'>>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  dailyLog: LogEntry[];
  logMeal: (meal: Meal) => Promise<void>;
  removeLogEntry: (id: string) => Promise<void>;
  totalCaloriesToday: () => number;
  loadFromStorage: () => Promise<void>;
};

const SAVED_MEALS_KEY = 'savedMeals';
const DAILY_LOG_KEY   = 'dailyLog';

export const useMealStore = create<MealStore>((set, get) => ({

  savedMeals: [],
  dailyLog:   [],

  loadFromStorage: async () => {
    try {
      const [mealsJson, logJson] = await Promise.all([
        AsyncStorage.getItem(SAVED_MEALS_KEY),
        AsyncStorage.getItem(DAILY_LOG_KEY),
      ]);
      set({
        savedMeals: mealsJson ? JSON.parse(mealsJson) : [],
        dailyLog:   logJson   ? JSON.parse(logJson)   : [],
      });
    } catch (e) {
      console.error('Failed to load meal data:', e);
    }
  },

  addMeal: async (meal) => {
    const newMeal: Meal = { ...meal, id: Date.now().toString() };
    const updated = [...get().savedMeals, newMeal];
    set({ savedMeals: updated });
    await AsyncStorage.setItem(SAVED_MEALS_KEY, JSON.stringify(updated));
  },

  updateMeal: async (id, updates) => {
    const updated = get().savedMeals.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    set({ savedMeals: updated });
    await AsyncStorage.setItem(SAVED_MEALS_KEY, JSON.stringify(updated));
  },

  deleteMeal: async (id) => {
    const updated = get().savedMeals.filter(m => m.id !== id);
    set({ savedMeals: updated });
    await AsyncStorage.setItem(SAVED_MEALS_KEY, JSON.stringify(updated));
  },

  logMeal: async (meal) => {
    const entry: LogEntry = {
      id:        Date.now().toString(),
      mealId:    meal.id,
      mealName:  meal.name,
      calories:  meal.calories,
      loggedAt:  new Date().toISOString(),
    };
    const updated = [...get().dailyLog, entry];
    set({ dailyLog: updated });
    await AsyncStorage.setItem(DAILY_LOG_KEY, JSON.stringify(updated));
  },

  removeLogEntry: async (id) => {
    const updated = get().dailyLog.filter(e => e.id !== id);
    set({ dailyLog: updated });
    await AsyncStorage.setItem(DAILY_LOG_KEY, JSON.stringify(updated));
  },

  totalCaloriesToday: () => {
    const today = new Date().toDateString();
    return get().dailyLog
      .filter(e => new Date(e.loggedAt).toDateString() === today)
      .reduce((sum, e) => sum + e.calories, 0);
  },
}));