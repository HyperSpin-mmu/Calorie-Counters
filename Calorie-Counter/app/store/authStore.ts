// authStore.ts

import { create } from "zustand";

interface AuthState {
  uid: string | null;
  setUid: (uid: string | null ) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  setUid: (uid) => set({ uid }),
}));