// waterStore.ts


import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterState {
  totalMl: number;         // single source of truth — always store in ml
  dailyGoalMl: number;     // could come from Firestore later, default 2000
  addWater: (ml: number) => void;
  resetWater: () => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set) => ({
      totalMl: 0,
      dailyGoalMl: 2000, // KURT U CAN EDIT THIS TO MATCH USER PREFERENCE LATER
      addWater: (ml) => set((state) => ({ totalMl: state.totalMl + ml })),
      resetWater: () => set({ totalMl: 0 }),
    }),
    {
      name: 'default-water',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);