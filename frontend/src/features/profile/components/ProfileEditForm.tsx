"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Field } from "@/components/ui/Field";
import { maskPhone } from "@/utils/utils";
import { useState } from "react";
import { useProfileEdit } from "../hooks/useProfileEdit";

export default function ProfileEditForm() {
  const { form, onSubmit, resetForm } = useProfileEdit();
  const {
    register,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  const [isChangePwd, setIsChangePwd] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (hasError: boolean) =>
    hasError
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleOpenModal = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (isValid) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    onSubmit();
  };

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col h-full font-sans p-4 md:p-7 overflow-hidden">
        <form
          onSubmit={handleOpenModal}
          noValidate
          className="flex flex-col w-full mx-auto rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden h-full"
        >
          <div className="shrink-0 px-7 py-5 border-b border-stone-100">
            <h1 className="m-0 text-2xl font-bold text-stone-800">
              Perfil de Usuário
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Atualize suas informações pessoais e credenciais de acesso.
            </p>
          </div>

          <div className="flex-1 min-h-0 px-7 py-6 overflow-y-auto flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                Informações Pessoais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-3">
                  <Field label="Nome:" error={errors.name?.message} required>
                    <input
                      type="text"
                      {...register("name")}
                      className={getValidationClass(!!errors.name)}
                    />
                  </Field>
                </div>
                <div className="md:col-span-1">
                  <Field
                    label="Matrícula:"
                    error={errors.registrationNumber?.message}
                    required
                  >
                    <input
                      type="text"
                      {...register("registrationNumber")}
                      className={getValidationClass(
                        !!errors.registrationNumber,
                      )}
                    />
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <Field label="Email:" error={errors.email?.message} required>
                    <input
                      type="email"
                      {...register("email")}
                      className={getValidationClass(!!errors.email)}
                    />
                  </Field>
                </div>
                <div className="md:col-span-1">
                  <Field label="Telefone:" error={errors.phoneNumber?.message}>
                    <input
                      type="text"
                      {...register("phoneNumber", {
                        onChange: (e) => {
                          e.target.value = maskPhone(e.target.value);
                        },
                      })}
                      className={getValidationClass(!!errors.phoneNumber)}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200" />

            <div className="rounded-xl border border-stone-200 bg-stone-50/30">
              <button
                type="button"
                onClick={() => setIsChangePwd((v) => !v)}
                className="w-full flex items-center justify-between p-5 hover:bg-stone-100 transition-colors group cursor-pointer focus:outline-none rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-500 shadow-sm group-hover:text-teal-600 transition-colors shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-stone-800">
                      Segurança e Senha
                    </h2>
                    <p className="text-sm text-stone-500">
                      Altere sua senha de acesso ao sistema
                    </p>
                  </div>
                </div>
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-stone-200 group-hover:bg-stone-200 transition-colors shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-stone-500 group-hover:text-stone-800 transition-transform duration-300 ${
                      isChangePwd ? "-rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  isChangePwd ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 border-t border-stone-200 bg-white rounded-b-xl flex flex-col gap-5">
                    <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 lg:col-span-1">
                        <Field
                          label="Senha Atual:"
                          error={errors.oldPassword?.message}
                        >
                          <input
                            type="password"
                            {...register("oldPassword")}
                            className={getValidationClass(!!errors.oldPassword)}
                          />
                        </Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Nova Senha:"
                        error={errors.newPassword?.message}
                      >
                        <input
                          type="password"
                          {...register("newPassword")}
                          className={getValidationClass(!!errors.newPassword)}
                        />
                      </Field>

                      <Field
                        label="Confirmar Nova Senha:"
                        error={errors.newPasswordConfirmation?.message}
                      >
                        <input
                          type="password"
                          {...register("newPasswordConfirmation")}
                          className={getValidationClass(
                            !!errors.newPasswordConfirmation,
                          )}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 p-5 px-7 flex justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
            <CommonButton
              type="button"
              label="Cancelar"
              className="bg-[#f4a598] text-white hover:bg-[#f0a195]"
              onClick={resetForm}
            />
            <CommonButton
              type="submit"
              disabled={!isDirty || isSubmitting}
              className={!isDirty ? "opacity-50 cursor-not-allowed" : ""}
              label={isSubmitting ? "Confirmando..." : "Confirmar Alterações"}
            />
          </div>
        </form>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Atualizar Perfil"
        message="Tem certeza que deseja salvar as alterações no seu perfil?"
        confirmLabel="Atualizar"
        confirmColor="primary"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
}
