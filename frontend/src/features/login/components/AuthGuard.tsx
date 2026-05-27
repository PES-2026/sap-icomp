"use client";

import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/features/login/utils/storage";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

interface AuthGuardProps {
  children: ReactNode;
}

const PUBLIC_PATHS = [
  PATHS.login,
  PATHS.register,
  PATHS.forgot_password,
  PATHS.scheduling,
];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some(
    (p) => p === pathname || (p !== "/" && pathname.startsWith(p + "/")),
  );

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!pathname) return;

    if (isPublicPath(pathname)) {
      setChecking(false);
      return;
    }

    if (user) {
      setChecking(false);
      return;
    }

    let mounted = true;
    setChecking(true);

    authService
      .me()
      .then((fetchedUser) => {
        if (!mounted) return;
        setUser(fetchedUser.user);
        setChecking(false);
      })
      .catch(() => {
        if (!mounted) return;
        toast.error("Acesso negado, faça o login.");
        router.replace(PATHS.login);
        setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, [pathname, user, router, setUser]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#6a6560]">
          <Loader2 className="animate-spin text-[#6bc4a6]" size={32} />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
