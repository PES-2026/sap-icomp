"use client";

import { Images } from "@/assets";
import { PATHS } from "@/constants/paths";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  CalendarClock,
  Database,
  FolderOpen,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const { mobileOpen, setMobileOpen } = useSidebarStore();
  const user = useAuthStore((state) => state.user);

  const navItems =
    user?.role === "PROFESSOR"
      ? [{ label: "Início", icon: Home, id: "Início", href: PATHS.professor }]
      : [
          { label: "Início", icon: Home, id: "Início", href: PATHS.pedagogue },
          {
            label: "Alunos",
            icon: Users,
            id: "Alunos",
            href: PATHS.students_list,
          },
          {
            label: "Atendimentos",
            icon: FolderOpen,
            id: "Atendimentos",
            href: PATHS.attendances_list,
          },
          {
            label: "Agendamentos",
            icon: CalendarClock,
            id: "Agendamentos",
            href: PATHS.scheduling,
          },
          {
            label: "Usuários",
            icon: UserCog,
            id: "Usuários",
            href: PATHS.users_list,
          },
          {
            label: "Cadastros Gerais",
            icon: Database,
            id: "Configuração",
            href: PATHS.visualize_settings,
          },
        ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex min-h-screen shrink-0 flex-col border-r border-[#ece7db] bg-[#faf7f0]
          transition-all duration-300 ease-in-out md:static
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0 md:shadow-none"}
          ${collapsed ? "w-64 md:w-17" : "w-64 md:w-64"}
        `}
      >
        <div
          className={`
            flex items-center justify-between gap-3 px-4 border-b border-[#ece7db]
            shrink-0 transition-all duration-300 h-20 mb-6
          `}
        >
          <div
            className={`
              overflow-hidden transition-all duration-300
              ${collapsed ? "hidden w-0 opacity-0 md:w-0 md:opacity-0" : "opacity-100"}
            `}
          >
            <Image
              src={Images.logoHorizontal}
              alt="Logo SAP IComp"
              className="w-auto object-contain"
            />
          </div>

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={`
              hidden shrink-0 rounded-lg p-1.5 text-[#8a8075] cursor-pointer ml-auto
              transition-all duration-200 hover:bg-[#ece7db] hover:text-[#3a3530] md:block
            `}
            title={collapsed ? "Expandir menu" : "Retrair menu"}
            aria-label={collapsed ? "Expandir menu" : "Retrair menu"}
          >
            {collapsed ? (
              <PanelLeftOpen size={24} />
            ) : (
              <PanelLeftClose size={24} />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="mt-1 block shrink-0 rounded-lg p-1.5 text-[#8a8075] transition-all duration-200 hover:bg-[#ece7db] hover:text-[#3a3530] md:hidden ml-auto cursor-pointer"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className={`flex flex-col gap-1 transition-all duration-300 ${
            collapsed ? "px-5 md:px-3" : "px-5"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`
                  flex items-center gap-2.5 rounded-[10px] text-left text-sm leading-[1.35]
                  transition-all duration-300 ease-in-out cursor-pointer
                  ${collapsed ? "px-3.5 py-2.5 md:justify-center md:px-2.5" : "px-3.5 py-2.5"}
                  ${
                    isActive
                      ? "scale-[1.02] bg-[#6bc4a6] font-bold text-[#3a3530] shadow-md shadow-[#6bc4a6]/30"
                      : "bg-transparent font-medium text-[#6a6560] hover:translate-x-1 hover:bg-[#ece7db]/60 hover:text-[#3a3530]"
                  }
                `}
              >
                <span
                  className={`shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                >
                  <item.icon size={20} />
                </span>

                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    collapsed ? "hidden" : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
