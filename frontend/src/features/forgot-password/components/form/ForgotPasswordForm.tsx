"use client";

import { MailCheck } from "lucide-react";
import Image from "next/image";

import { Images } from "@/assets";
import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { useForgotPassword } from "../../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const { handleNavigation } = useAppNavigation();
  const { form, isLoading, isSuccess, onSubmit } = useForgotPassword();
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

  const handleBackToLogin = () => {
    handleNavigation({ path: PATHS.login });
  };

  if (isSuccess) {
    return (
      <main className="flex min-w-0 flex-1 w-full min-h-screen items-center justify-center font-['Nunito','Segoe_UI',sans-serif] bg-[#f5f0e8] p-4">
        <section className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-10 text-center">
          <Image
            src={Images.logoHorizontal}
            alt="SAP iComp Logo"
            width={200}
            height={48}
            className="mb-6 h-10 md:h-12 w-auto"
            priority
          />

          <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-[#6bc4a6] text-white">
            <MailCheck size={36} strokeWidth={2.5} />
          </div>

          <h1 className="m-0 text-2xl font-bold text-stone-800">E-mail enviado!</h1>
          <p className="mt-3 mb-6 max-w-85 text-sm leading-6 text-stone-600">
            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
          </p>

          <CommonButton
            label="Voltar para o Login"
            type="button"
            onClick={handleBackToLogin}
            className="w-full justify-center"
            aria-label="Voltar para o Login"
          />
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
            width={200}
            height={48}
            className="mb-4 h-10 md:h-12 w-auto"
            priority
          />
          <h1 className="m-0 text-2xl font-bold text-stone-800">Recuperar Senha</h1>
          <p className="text-sm text-stone-500 mt-1 text-center">
            Informe seu e-mail para receber o link de recuperação
          </p>
        </div>

        <div className="flex-1 min-h-0 px-7 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-5 mt-2">
            <Field label="E-mail:" error={errors.email?.message} required>
              <input
                type="email"
                placeholder="seu-email@exemplo.com"
                {...register("email")}
                className={getValidationClass(!!errors.email)}
                aria-label="E-mail"
              />
            </Field>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7 bg-stone-50/50 flex flex-col gap-3">
          <CommonButton
            label={isLoading ? "Enviando..." : "Enviar Link"}
            type="submit"
            disabled={isLoading}
            className="w-full justify-center"
            aria-label="Enviar Link"
          />
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors cursor-pointer text-center"
          >
            Voltar para o Login
          </button>
        </div>
      </form>
    </main>
  );
}
