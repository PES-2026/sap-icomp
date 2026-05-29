"use client";

import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { logoutService } from "../services/logoutService";

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await logoutService.logout();
    } catch (error) {
      console.error("Erro ao realizar logout na API:", error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      clearUser?.();
      router.push(PATHS.login);
    }
  }, [clearUser, router]);

  return { logout };
};
