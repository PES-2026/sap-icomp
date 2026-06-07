"use client";

import { KeyRound } from "lucide-react";
import Image from "next/image";

import { Images } from "@/assets";
import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { useResetPassword } from "../../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const { form, isLoading, hasToken, onSubmit } = useResetPassword();
  const {
    register,
    formState: { errors },
  } = form;

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (hasError: boolean) =>
    hasError
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  if (!hasToken) {
    return (
      <main className="flex min-w-0 flex-1 w-full min-h-screen items-center justify-center font-['Nunito','Segoe_UI',sans-serif] bg-[#f5f0e8] p-4">
        <section className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white border border-red-200 p-7 items-center text-center shadow-md">
          <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-red-100 text-red-600">
            <KeyRound size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Token Inválido</h1>
          <p className="text-stone-600 mb-6">
            Não foi possível encontrar um token de recuperação válido na URL. Por favor, verifique o link enviado no seu e-mail.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 w-full min-h-screen items-center justify-center font-['Nunito','Segoe_UI',sans-serif] bg-[#f5f0e8] p-4">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-1 min-h-0 w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="shrink-0 px-7 pt-7 pb-4 flex flex-col items-center">
          <Image
            src={Images.logoHorizontal}
            alt="SAP iComp Logo"
            className="mb-4 h-10 md:h-12 w-auto"
            priority
          />
          <h1 className="m-0 text-2xl font-bold text-stone-800">Nova Senha</h1>
          <p className="text-sm text-stone-500 mt-1 text-center">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <div className="flex-1 min-h-0 px-7 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-5 mt-2">
            <Field label="Nova Senha:" error={errors.newPassword?.message} required>
              <input
                type="password"
                placeholder="••••••••"
                {...register("newPassword")}
                className={getValidationClass(!!errors.newPassword)}
                aria-label="Nova Senha"
              />
            </Field>

            <Field
              label="Confirmar Nova Senha:"
              error={errors.newPasswordConfirmation?.message}
              required
            >
              <input
                type="password"
                placeholder="••••••••"
                {...register("newPasswordConfirmation")}
                className={getValidationClass(!!errors.newPasswordConfirmation)}
                aria-label="Confirmar Nova Senha"
              />
            </Field>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7 bg-stone-50/50">
          <CommonButton
            label={isLoading ? "Alterando..." : "Redefinir Senha"}
            type="submit"
            disabled={isLoading}
            className="w-full justify-center"
            aria-label="Redefinir Senha"
          />
        </div>
      </form>
    </main>
  );
}
