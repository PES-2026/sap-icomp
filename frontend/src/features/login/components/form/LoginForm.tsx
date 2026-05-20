"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm() {
  const { form, isLoading, globalError, onSubmit } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  const searchParams = useSearchParams();

  // Captura o redirecionamento do Middleware (Acesso Negado)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      toast.error(
        "Acesso negado. Faça login ou agende um atendimento.",
        { id: "unauthorized-toast" }, // ID fixo evita que o toast duplique ao recarregar
      );
    }
  }, [searchParams]);

  // Mesmas classes e estilos de validação do seu StudentForm
  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (hasError: boolean) =>
    hasError
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  return (
    <main className="flex min-w-0 flex-1 flex-col items-center justify-center h-screen bg-stone-50 font-sans p-7">
      <div className="w-full max-w-md">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          {/* ── Cabeçalho do Card ── */}
          <div className="shrink-0 px-7 pt-7 pb-4">
            <h1 className="m-0 text-2xl font-bold text-stone-800">
              Acesso ao Sistema
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Insira suas credenciais para entrar.
            </p>
          </div>

          {/* ── Corpo do Formulário ── */}
          <div className="flex-1 px-7 pb-4 overflow-y-auto">
            {globalError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                {globalError}
              </div>
            )}

            <div className="flex flex-col gap-3.5">
              <Field label="E-mail:" error={errors.email?.message} required>
                <input
                  type="email"
                  placeholder="pedagoga@escola.com.br"
                  {...register("email")}
                  className={getValidationClass(!!errors.email)}
                />
              </Field>

              <Field label="Senha:" error={errors.password?.message} required>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={getValidationClass(!!errors.password)}
                />
              </Field>
            </div>
          </div>

          {/* ── Rodapé / Ações ── */}
          <div className="shrink-0 p-4 px-7 flex justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
            <CommonButton
              label={isLoading ? "Entrando..." : "Entrar"}
              type="submit"
              disabled={isLoading}
              className="w-full justify-center" // Ocupa largura total para formulários de login
            />
          </div>
        </form>
      </div>
    </main>
  );
}
