"use client";

import Image from "next/image";
import { Calendar, LogIn, ArrowRight } from "lucide-react";
import { Images } from "@/assets";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";

export default function Page() {
  const { handleNavigation } = useAppNavigation();

  return (
    <main className="flex min-w-0 flex-1 w-full min-h-screen items-center justify-center bg-[#f5f0e8] p-4 sm:p-6 font-['Nunito','Segoe_UI',sans-serif]">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-2xl border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white">
        
        {/* Painel Esquerdo: Identidade Visual e Boas-Vindas */}
        <div className="relative flex lg:w-5/12 flex-col justify-between bg-[#1a2e28] border-b lg:border-b-0 lg:border-r border-[#ece7db]/10 p-8 lg:p-12 overflow-hidden text-white shrink-0">
          {/* Elementos Decorativos de Fundo */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#2a4a3e] opacity-60" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#223d33] opacity-50" />
          <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-[#6bc4a6] opacity-5" />

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full flex justify-center lg:justify-start">
              <Image
                src={Images.logoHorizontal}
                alt="SAP iComp Logo"
                className="h-14 w-auto mb-8 brightness-0 invert"
                priority
              />
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold leading-snug mb-4">
              Bem-vindo(a) ao
              <br />
              <span className="text-[#6bc4a6] font-bold">SAP IComp</span>
            </h1>
            <p className="text-sm text-[#aac9bf] leading-relaxed max-w-sm">
              Serviço de Apoio Pedagógico do Instituto de Computação.
              Facilitando a comunicação, orientação e o agendamento de atendimentos para alunos e professores.
            </p>
          </div>

          <div className="relative z-10 border-t border-[rgba(107,196,166,0.15)] pt-6 mt-8 lg:mt-0 text-center lg:text-left">
            <p className="text-xs text-[#aac9bf]">
              Instituto de Computação - UFAM &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Painel Direito: Opções de Direcionamento */}
        <div className="flex-1 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              O que você deseja fazer?
            </h2>
            <p className="text-sm text-stone-500 mt-1.5">
              Selecione uma das opções abaixo para ser direcionado ao serviço correto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Opção 1: Agendamento de Atendimento (Alunos) */}
            <div
              onClick={() => handleNavigation({ path: "/appointment" })}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-[#ece7db] hover:border-[#6bc4a6]/50 bg-stone-50/40 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(107,196,166,0.08)] hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#6bc4a6]/10 flex items-center justify-center text-[#1a2e28] group-hover:bg-[#6bc4a6] group-hover:text-white transition-colors duration-300 mb-5">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#1a2e28] transition-colors">
                  Agendar Atendimento
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Discente / Aluno: Agende um horário de atendimento pedagógico de forma simples e rápida, sem precisar de login.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#1a2e28] group-hover:text-[#52b594] transition-colors">
                Ir para agendamentos
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            {/* Opção 2: Acesso ao Sistema (Pedagogos, Professores) */}
            <div
              onClick={() => handleNavigation({ path: PATHS.login })}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-[#ece7db] hover:border-[#1a2e28]/40 bg-stone-50/40 hover:bg-white transition-all duration-300 ease-in-out cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(26,46,40,0.08)] hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-[#1a2e28] group-hover:text-white transition-colors duration-300 mb-5">
                  <LogIn className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#1a2e28] transition-colors">
                  Acesso ao Sistema
                </h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Pedagogos, professores e administradores: Faça login para gerenciar atendimentos, cadastrar horários e acessar relatórios.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-stone-600 group-hover:text-[#1a2e28] transition-colors">
                Fazer login no sistema
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
