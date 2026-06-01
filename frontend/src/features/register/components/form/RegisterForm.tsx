"use client";

import { MailCheck } from "lucide-react";
import Image from "next/image";

import { Images } from "@/assets";
import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { maskPhone } from "@/utils/utils";
import { useRegister } from "../../hooks/useRegister";

export default function RegisterForm() {
  const { handleNavigation } = useAppNavigation();

  const {
    form,
    isLoading,
    isSubmitted,
    registeredEmail,
    globalError,
    onSubmit,
  } = useRegister();
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

  if (isSubmitted) {
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

          <h1 className="m-0 text-2xl font-bold text-stone-800">Quase lá!</h1>
          <p className="mt-3 mb-6 max-w-85 text-sm leading-6 text-stone-600">
            Seu pedido de cadastro está em análise pela administração.
            Avisaremos no e-mail{" "}
            <strong className="font-bold text-stone-800">
              {registeredEmail}
            </strong>{" "}
            assim que for aprovado.
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
          <h1 className="m-0 text-2xl font-bold text-stone-800">Criar Conta</h1>
          <p className="text-sm text-stone-500 mt-1 text-center">
            Informe seus dados para solicitar acesso
          </p>
        </div>

        <div className="flex-1 min-h-0 px-7 pb-4 overflow-y-auto">
          {globalError && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
              {globalError}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <Field label="Nome Completo:" error={errors.name?.message} required>
              <input
                type="text"
                placeholder="Pedagogo Teste"
                {...register("name")}
                className={getValidationClass(!!errors.name)}
                aria-label="Nome Completo"
              />
            </Field>

            <Field
              label="Número de Registro:"
              error={errors.registrationNumber?.message}
              required
            >
              <input
                type="text"
                placeholder="1234567"
                {...register("registrationNumber")}
                className={getValidationClass(!!errors.registrationNumber)}
                aria-label="Número de Registro"
              />
            </Field>

            <Field
              label="Telefone:"
              error={errors.phoneNumber?.message}
              required
            >
              <input
                type="tel"
                placeholder="(92) 99999-9999"
                {...register("phoneNumber", {
                  onChange: (e) => {
                    const { value } = e.target;
                    e.target.value = maskPhone(value);
                  },
                })}
                className={getValidationClass(!!errors.phoneNumber)}
                aria-label="Telefone"
              />
            </Field>

            <Field label="E-mail:" error={errors.email?.message} required>
              <input
                type="email"
                placeholder="pedagogo@teste.com"
                {...register("email")}
                className={getValidationClass(!!errors.email)}
                aria-label="E-mail"
              />
            </Field>

            <Field
              label="Repetir E-mail:"
              error={errors.confirmEmail?.message}
              required
            >
              <input
                type="email"
                placeholder="pedagogo@teste.com"
                {...register("confirmEmail")}
                className={getValidationClass(!!errors.confirmEmail)}
                aria-label="Repetir E-mail"
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

            <Field
              label="Confirmação de Senha:"
              error={errors.confirmPassword?.message}
              required
            >
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={getValidationClass(!!errors.confirmPassword)}
                aria-label="Confirmação de Senha"
              />
            </Field>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7">
          <CommonButton
            label={isLoading ? "Criando conta..." : "Criar Conta"}
            type="submit"
            disabled={isLoading}
            className="w-full justify-center"
            aria-label="Criar Conta"
          />
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7 bg-stone-50/50 flex flex-col items-center gap-3">
          <p className="m-0 text-sm text-stone-600">Já possui conta?</p>
          <CommonButton
            label="Voltar para o Login"
            type="button"
            onClick={handleBackToLogin}
            className="w-full justify-center border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 mt-2"
            aria-label="Voltar para o Login"
          />
        </div>
      </form>
    </main>
  );
}
