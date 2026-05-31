"use client";

import { PATHS } from "@/constants/paths";
import { publicRoutes } from "@/proxy";
import { authMeService } from "@/services/authMe";
import { useAuthStore } from "@/store/authStore";
import { useAppNavigation } from "@/utils/navigator";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useAuthStore();
  const { handleNavigation } = useAppNavigation();
  const pathname = usePathname();

  useEffect(() => {
    if (publicRoutes.includes(pathname)) return;

    async function validateSession() {
      try {
        const res = await authMeService.me();

        if (!res) {
          clearUser();
          handleNavigation({ path: PATHS.login });
          return;
        }

        setUser(res.user);
      } catch {
        clearUser();
        handleNavigation({ path: PATHS.login });
      }
    }

    validateSession();
  }, []);

  return <>{children}</>;
}
