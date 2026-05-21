import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/login";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  getUser: () => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      getUser: () => get().user,
    }),
    {
      name: "@App:user",
    },
  ),
);
