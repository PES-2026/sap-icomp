"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { useProfileEdit } from "../hooks/useProfileEdit";

export default function ProfileEditForm() {
  const { form, onSubmit } = useProfileEdit();
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (hasError: boolean) =>
    hasError
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  return (
    <div className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0"
      >
        <div className="shrink-0 px-7 pt-7 pb-4">
          <h1 className="m-0 text-2xl font-bold text-stone-800">
            Perfil de Usuário
          </h1>
        </div>

        <div className="flex-1 px-7 pb-4 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Field label="Nome:" error={errors.name?.message} required>
              <input
                type="text"
                {...register("name")}
                className={getValidationClass(!!errors.name)}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Email:" error={errors.email?.message} required>
                  <input
                    type="email"
                    {...register("email")}
                    className={getValidationClass(!!errors.email)}
                  />
                </Field>
              </div>

              <div className="col-span-1">
                <Field label="Telefone:" error={errors.phoneNumber?.message}>
                  <input
                    type="text"
                    {...register("phoneNumber")}
                    className={getValidationClass(!!errors.phoneNumber)}
                  />
                </Field>
              </div>
            </div>
          </div>

          <h1 className="my-4 text-2xl font-bold text-stone-800">
            Alterar Senha
          </h1>

          <div className="flex flex-col gap-4">
            <Field label="Senha Atual:" error={errors.currentPassword?.message}>
              <input
                type="password"
                {...register("currentPassword")}
                className={getValidationClass(!!errors.currentPassword)}
              />
            </Field>

            <Field
              label="Insira a Nova Senha:"
              error={errors.newPassword?.message}
            >
              <input
                type="password"
                {...register("newPassword")}
                className={getValidationClass(!!errors.newPassword)}
              />
            </Field>

            <Field
              label="Repita a Nova Senha:"
              error={errors.confirmNewPassword?.message}
            >
              <input
                type="password"
                {...register("confirmNewPassword")}
                className={getValidationClass(!!errors.confirmNewPassword)}
              />
            </Field>
          </div>
        </div>

        <div className="shrink-0 p-4 px-7 flex justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
          <CommonButton
            type="button"
            label="Cancelar"
            className="bg-[#f4a598] text-white hover:bg-[#f0a195]"
            onClick={() => reset(undefined)}
          />

          <CommonButton
            type="submit"
            label={isSubmitting ? "Confirmando..." : "Confirmar Alterações"}
          />
        </div>
      </form>
    </div>
  );
}
