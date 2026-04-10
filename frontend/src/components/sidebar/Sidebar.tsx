"use client";

import { Home, Calendar, Users, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Início", icon: Home, id: "Início", href: "/admin" },
    {
      label: "Agendamentos",
      icon: Calendar,
      id: "Calendário",
      href: "/admin/agendamentos",
    },
    {
      label: "Alunos",
      icon: Users,
      id: "Base de Alunos",
      href: "/admin/alunos",
    },
    {
      label: "Relatórios",
      icon: FileText,
      id: "Envio",
      href: "/admin/relatorios",
    },
  ];

  return (
    <aside className="w-[280px] bg-[#faf7f0] border-r border-[#ece7db] flex flex-col py-6 shrink-0 min-h-screen">
      <div className="px-5 pb-7">
        <div className="text-[22px] font-extrabold text-[#3a3530] leading-[1.1] text-center">
          SAP IComp
        </div>
        <div className="text-[14px] text-[#8a8075] mt-1.5 leading-[1.3] text-center">
          Serviço de Apoio Pedagógico
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-left text-[12.5px] leading-[1.35] whitespace-pre-line
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-[#6bc4a6] text-[#3a3530] font-bold shadow-md shadow-[#6bc4a6]/30 scale-[1.02]"
                    : "bg-transparent text-[#6a6560] font-medium hover:bg-[#ece7db]/60 hover:text-[#3a3530] hover:translate-x-1"
                }
              `}
            >
              <span
                className={`shrink-0 transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                <item.icon size={20} />
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
