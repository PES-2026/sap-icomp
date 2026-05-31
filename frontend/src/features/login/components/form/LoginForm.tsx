"use client";

import Image from "next/image";

import { Images } from "@/assets";
import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm() {
  const { handleNavigation } = useAppNavigation();

  const { form, isLoading, globalError, onSubmit } = useLogin();
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

  const handleForgotPassword = () => {
    handleNavigation({ path: PATHS.forgot_password });
  };

  const handleCreateAccount = () => {
    handleNavigation({ path: PATHS.register });
  };

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
          <h1 className="m-0 text-2xl font-bold text-stone-800">
            Acesso ao Sistema
          </h1>
          <p className="text-sm text-stone-500 mt-1 text-center">
            Insira suas credenciais para entrar
          </p>
        </div>

        <div className="flex-1 min-h-0 px-7 pb-4 overflow-y-auto">
          {globalError && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
              {globalError}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <Field label="E-mail:" error={errors.email?.message} required>
              <input
                type="email"
                placeholder="pedagoga@escola.com.br"
                {...register("email")}
                className={getValidationClass(!!errors.email)}
                aria-label="E-mail"
              />
            </Field>

            <Field label="Senha:" error={errors.password?.message} required>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={getValidationClass(!!errors.password)}
                aria-label="Senha"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-3 text-sm text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            aria-label="Esqueci minha senha"
          >
            Esqueci minha senha
          </button>
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7">
          <CommonButton
            label={isLoading ? "Entrando..." : "Entrar"}
            type="submit"
            disabled={isLoading}
            className="w-full justify-center"
            aria-label="Entrar"
          />
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7 bg-stone-50/50 flex flex-col items-center gap-3">
          <p className="m-0 text-sm text-stone-600">Não possui conta?</p>
          <CommonButton
            label="Criar uma conta"
            onClick={handleCreateAccount}
            className="w-full justify-center border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 mt-2"
            aria-label="Criar uma conta"
          />
        </div>
      </form>
    </main>
  );
}
