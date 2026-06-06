"use client";

import { Images } from "@/assets";
import { PATHS } from "@/constants/paths";
import { useLogout } from "@/features/login/hooks/useLogout";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { ChevronDown, LogOut, Menu, User, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Breadcrumb } from "../ui/Breadcrumb";

export default function Header() {
  const { user } = useAuthStore();
  const { setMobileOpen } = useSidebarStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const { logout } = useLogout();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  const profilePath = user?.role
    ? `/${String(user.role).toLowerCase()}/profile/edit`
    : PATHS.login;

  const isAppointmentRoute = pathname?.startsWith("/appointment");

  if (isAppointmentRoute) {
    return (
      <header className="bg-[#faf7f0] border-b border-[#ece7db] px-6 py-4 md:py-0 md:h-20 flex items-center justify-between shrink-0">
        <div className="flex items-center shrink-0">
          <Image
            src={Images.logoHorizontal}
            alt="Logo SAP IComp"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-[#3a3530]">Olá, Aluno</div>
          <div className="w-10 h-10 rounded-full bg-[#e8e0d5] text-[#8a8075] flex items-center justify-center shrink-0 shadow-sm">
            <User2 size={20} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#faf7f0] border-b border-[#ece7db] px-6 py-4 md:py-0 md:h-20 flex flex-col md:flex-row md:items-center justify-between gap-1 shrink-0">
      <div className="flex items-center justify-center w-full md:hidden shrink-0 md:mb-0">
        <Image
          src={Images.logoHorizontal}
          alt="Logo SAP IComp"
          className="h-8 md:h-9 w-auto object-contain transition-all"
        />
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden bg-transparent text-[#3a3530] cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-col gap-0 flex-1">
            <h2 className="font-bold text-[#3a3530]">
              Olá, {user?.name ?? "Usuário"}
            </h2>
            <Breadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative"
            ref={menuRef}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="flex gap-2 items-center cursor-pointer pl-2 rounded-full hover:bg-[#ece7db] transition-colors"
            >
              <div
                className={`text-[#6bc4a6] transition-transform duration-300 ease-in-out ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown size={20} />
              </div>

              <div className="w-11 h-11 rounded-full bg-[#6bc4a6] text-white flex items-center justify-center shrink-0 shadow-sm hover:shadow-md transition-shadow">
                <User2 size={20} />
              </div>
            </button>

            <div
              className={`absolute right-0 top-full pt-2 z-50 w-48 transition-all duration-300 origin-top-right ${
                open
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible"
              }`}
            >
              <div className="bg-white rounded-xl border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col py-1.5">
                <Link
                  href={profilePath}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-[#6bc4a6] hover:bg-stone-50 transition-colors"
                >
                  <User size={16} strokeWidth={2.5} />
                  Editar Perfil
                </Link>
                <div className="h-px bg-stone-100 my-1 mx-2" />{" "}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
