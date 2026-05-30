"use client";

import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/store/authStore";
import { useAppNavigation } from "@/utils/navigator";
import toast from "react-hot-toast";
import { logoutService } from "../services/logoutService";

export const useLogout = () => {
  const { handleNavigation } = useAppNavigation();

  const clearUser = useAuthStore((s) => s.clearUser);

  const logout = async () => {
    try {
      await logoutService.logout();
    } catch (error) {
      console.error("Erro ao realizar logout na API:", error);
      if (error instanceof Error) toast.error(error.message);
    } finally {
      clearUser?.();
      handleNavigation({ path: PATHS.login });
    }
  };

  return { logout };
};
