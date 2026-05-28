"use client";

import { authMeService } from "@/services/authMe";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    async function validateSession() {
      try {
        const res = await authMeService.me();

        if (!res) {
          clearUser();
          router.push("/login");
          return;
        }

        setUser(res.user);
      } catch {
        clearUser();
        router.push("/login");
      }
    }

    validateSession();
  }, []);

  return <>{children}</>;
}
