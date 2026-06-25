"use client";

import { Images } from "@/assets";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { ArrowRight, Calendar, LogIn } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const { handleNavigation } = useAppNavigation();

  return (
    <main className="flex min-w-60 flex-1 w-full min-h-dvh items-center justify-center bg-[#f5f0e8] p-4 sm:p-6 font-['Nunito','Segoe_UI',sans-serif]">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-2xl md:border md:border-[#ece7db] md:shadow-lg">
        <div className="md:hidden w-full flex justify-center lg:justify-start">
          <Image
            src={Images.logoHorizontal}
            alt="SAP iComp Logo"
            className="h-12 sm:h-14 w-auto mb-6 sm:mb-8"
            priority
          />
        </div>

        <div className="hidden relative md:flex lg:w-5/12 flex-col justify-between bg-[#1a2e28] border-b lg:border-b-0 lg:border-r border-[#ece7db]/10 p-6 sm:p-8 lg:p-12 overflow-hidden text-white shrink-0">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#2a4a3e] opacity-60 pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[#223d33] opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full flex justify-center lg:justify-start">
              <Image
                src={Images.logoHorizontal}
                alt="SAP iComp Logo"
                className="h-12 sm:h-14 w-auto mb-6 sm:mb-8 brightness-0 invert"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-2xl lg:text-3xl font-semibold leading-snug mb-3 sm:mb-4">
              Bem-vindo(a) ao
              <br />
              <span className="text-[#6bc4a6] font-bold">SAP iComp</span>
            </h1>
            <p className="text-sm text-[#aac9bf] leading-relaxed max-w-sm">
              Serviço de Apoio Pedagógico do Instituto de Computação.
              Facilitando a comunicação e o agendamento de atendimentos.
            </p>
          </div>

          <div className="relative z-10 border-t border-[rgba(107,196,166,0.15)] pt-5 mt-6 lg:mt-0 text-center lg:text-left">
            <p className="text-xs text-[#aac9bf]">
              ICOMP - UFAM &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-transparent sm:bg-white p-0 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              O que você deseja fazer?
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Selecione uma opção abaixo para prosseguir.
            </p>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <button
              type="button"
              onClick={() => handleNavigation({ path: "/appointment" })}
              className="group relative text-left flex flex-col justify-between p-4 md:p-6 w-full rounded-2xl bg-[#6bc4a6] text-[#3a3530] shadow-md active:scale-[0.98] md:hover:scale-[1.01] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="hidden md:absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Calendar className="w-20 h-20 mr-2 mt-2" />
              </div>

              <div className="relative z-10">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-white/20 ring-1 ring-white/30 flex items-center justify-center text-[#3a3530] mb-4">
                  <Calendar className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <h3 className="text-lg font-bold">Agendar Atendimento</h3>
                <p className="text-sm text-[#3a3530] mt-1 md:mt-2 leading-relaxed">
                  Agende seu horário pedagógico de forma rápida e sem login.
                </p>
              </div>
              <div className="relative z-10 mt-3 md:mt-6 flex items-center gap-1.5 text-sm font-bold text-[#3a3530]">
                Ir para agendamentos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavigation({ path: PATHS.login })}
              className="group text-left flex flex-col justify-between p-4 md:p-6 w-full rounded-2xl border border-[#ece7db] bg-white active:bg-stone-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-stone-100 ring-1 ring-white/30 flex items-center justify-center text-stone-600 group-hover:bg-stone-200 transition-colors mb-4">
                  <LogIn className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  Acesso ao Sistema
                </h3>
                <p className="text-sm text-stone-500 mt-1 md:mt-2">
                  Área restrita para pedagogos e professores gerenciarem
                  horários.
                </p>
              </div>
              <div className="mt-3 md:mt-6 flex items-center gap-1.5 text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">
                Fazer login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
