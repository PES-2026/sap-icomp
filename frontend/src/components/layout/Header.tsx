"use client";

import { PATHS } from "@/constants/paths";
import { useAuth } from "@/features/user/hooks/useAuth";
import { ChevronDown, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Breadcrumb } from "../ui/Breadcrumb";

export default function Header() {
  const { user, clearUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    clearUser?.();
    router.push(PATHS.login);
  };

  const profilePath = user?.role
    ? `/${String(user.role).toLowerCase()}/profile/edit`
    : PATHS.login;

  return (
    <header className="bg-[#faf7f0] border-b border-[#ece7db] px-6 py-4 flex items-center gap-4 shrink-0">
      <div className="flex flex-col gap-1 flex-1 ml-15 md:ml-0">
        <div className="text-lg m-0 font-bold text-[#3a3530]">
          Olá, {user?.name ?? "Usuário"}
        </div>
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="flex gap-2 items-center cursor-pointer p-1 rounded-full hover:bg-[#f0ede5] transition-colors"
          >
            <div
              className={`text-[#6bc4a6] transition-transform duration-300 ease-in-out ${
                open ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDown />
            </div>

            <div className="w-11 h-11 rounded-full bg-[#6bc4a6] text-white flex items-center justify-center shrink-0 shadow-sm hover:shadow transition-shadow">
              <User2 size={24} />{" "}
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-stone-200 shadow-lg z-50">
              <div className="flex flex-col py-1">
                <Link
                  href={profilePath}
                  className="px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
