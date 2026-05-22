"use client";

import Image from "next/image";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { useState } from "react";
import toast from "react-hot-toast";

type RegisterFormData = {
  name: string;
  phoneNumber: string;
  registerId: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

const EMPTY_FORM_REGISTER: RegisterFormData = {
  name: "",
  email: "",
  registerId: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const validateRegisterForm = (formData: RegisterFormData) => {
  const errors: RegisterFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Informe o nome.";
  }

  if (!formData.email.trim()) {
    errors.email = "Informe o e-mail.";
  }

  if (!formData.password) {
    errors.password = "Informe a senha.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem.";
  }

  return errors;
};

export default function RegisterForm() {
  const { handleNavigation } = useAppNavigation();

  const [formData, setFormData] =
    useState<RegisterFormData>(EMPTY_FORM_REGISTER);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (field: keyof RegisterFormData) =>
    errors[field]
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleFieldChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: validateRegisterForm(updated)[field],
      }));

      return updated;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return toast.error("Preencha os campos obrigatórios corretamente.");
    }

    // Futuramente: validar dados e chamar service de cadastro.
    console.log(formData);
  };

  return (
    <main className="flex min-w-0 flex-1 w-full min-h-screen items-center justify-center font-['Nunito','Segoe_UI',sans-serif] bg-[#f5f0e8] p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-1 min-h-0 w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="shrink-0 px-7 pt-7 pb-4 flex flex-col items-center">
          <Image
            src="/SAPICompLogoHorizontal.png"
            alt="SAP iComp Logo"
            width={200}
            height={48}
            className="mb-4 h-10 md:h-12 w-auto"
            priority
          />
          <h1 className="m-0 text-2xl font-bold text-stone-800">Criar Conta</h1>
        </div>

        <div className="flex-1 min-h-0 px-7 pb-4 overflow-y-auto">
          <div className="flex flex-col gap-5">
            <Field label="Nome Completo:" error={errors.name} required>
              <input
                type="text"
                placeholder=""
                value={formData.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                className={getValidationClass("name")}
                aria-label="Nome"
              />
            </Field>

            <Field
              label="Número de Registro:"
              error={errors.registerId}
              required
            >
              <input
                type="register"
                placeholder=""
                value={formData.registerId}
                onChange={(event) =>
                  handleFieldChange("registerId", event.target.value)
                }
                className={getValidationClass("registerId")}
                aria-label="RegisterId"
              />
            </Field>

            <Field label="Telefone:" error={errors.phoneNumber} required>
              <input
                type="phone"
                placeholder=""
                value={formData.phoneNumber}
                onChange={(event) =>
                  handleFieldChange("phoneNumber", event.target.value)
                }
                className={getValidationClass("email")}
                aria-label="phoneNumber"
              />
            </Field>

            <Field label="Email:" error={errors.email} required>
              <input
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                className={getValidationClass("email")}
                aria-label="Email"
              />
            </Field>

            <Field label="Senha:" error={errors.password} required>
              <input
                type="password"
                placeholder=""
                value={formData.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                className={getValidationClass("password")}
                aria-label="Senha"
              />
            </Field>

            <Field
              label="Confirmação de Senha:"
              error={errors.confirmPassword}
              required
            >
              <input
                type="password"
                placeholder=""
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleFieldChange("confirmPassword", event.target.value)
                }
                className={getValidationClass("confirmPassword")}
                aria-label="Confirmação de Senha"
              />
            </Field>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7">
          <CommonButton
            label="Criar Conta"
            type="submit"
            className="w-full justify-center"
            aria-label="Criar Conta"
          />
        </div>

        <div className="shrink-0 border-t border-stone-200 py-4 px-7 bg-stone-50/50 flex flex-col items-center gap-3">
          <p className="m-0 text-sm text-stone-600">Já possui conta?</p>
          <CommonButton
            label="Voltar para o Login"
            type="button"
            onClick={() => handleNavigation({ path: PATHS.students_list })}
            className="w-full justify-center border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 mt-2"
            aria-label="Voltar para o Login"
          />
        </div>
      </form>
    </main>
  );
}
