"use client";

import { useAuthStore } from "@/features/login/utils/storage";
import type { User } from "../types/user";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user) as User | null;
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  return { user, setUser, clearUser };
};
