"use client";

import { useState, FormEvent } from "react";
import CommonButton from "@/components/common-button/CommonButton";
import {
  maskRegistration,
  maskDate,
  maskPhone,
  validateStudentForm,
} from "@/utils/studentFormUtils";
import { SuccessScreen, Toast } from "./ui/StudentFormUI";
import { Field } from "../field/Field";
import { CustomSelect } from "../select-input/CustomSelect";
import { FormErrors, StudentFormData } from "@/types/student";
import { EMPTY_FORM } from "@/constants/student";
import { COURSES_NAME } from "@/constants/courses";

interface StudentFormProps {
  initialData?: StudentFormData;
  onSubmitSuccess?: (data: StudentFormData) => void;
  onCancel?: () => void;
}

export default function StudentForm({
  initialData,
  onSubmitSuccess,
  onCancel,
}: StudentFormProps) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<StudentFormData>(
    initialData || EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof StudentFormData, boolean>>
  >({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (field: keyof StudentFormData) =>
    errors[field]
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleFieldChange = (key: keyof StudentFormData, value: string) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (touched[key]) {
      const currentErrors = validateStudentForm(updated);
      setErrors((prev) => ({ ...prev, [key]: currentErrors[key] }));
    }
  };

  const handleFieldBlur = (key: keyof StudentFormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const currentErrors = validateStudentForm(formData);
    setErrors((prev) => ({ ...prev, [key]: currentErrors[key] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k as keyof StudentFormData]: true }),
      {},
    );
    setTouched(allTouched);

    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setToastMsg("Preencha os campos obrigatórios corretamente.");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      return;
    }

    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(formData);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
        {isSubmitted ? (
          <SuccessScreen
            studentName={formData.studentName}
            isEditMode={isEditMode}
            onNew={handleReset}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0"
          >
            <div className="shrink-0 px-7 pt-7 pb-4">
              <h1 className="m-0 text-2xl font-bold text-stone-800">
                {isEditMode ? "Editar Aluno" : "Cadastrar Novo Aluno"}
              </h1>
            </div>

            <div className="flex-1 px-7 pb-4 overflow-y-auto">
              {/* Row 1: Name | Registration | Birth Day */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px] gap-3.5 mb-3.5">
                <Field label="Aluno (a):" error={errors.studentName}>
                  <input
                    type="text"
                    placeholder="João Vitor Mesquita da Frota"
                    value={formData.studentName}
                    onChange={(e) =>
                      handleFieldChange("studentName", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("studentName")}
                    className={getValidationClass("studentName")}
                  />
                </Field>
                <Field label="Matrícula:" error={errors.registration}>
                  <input
                    type="text"
                    placeholder="1234-5678"
                    value={formData.registration}
                    onChange={(e) =>
                      handleFieldChange(
                        "registration",
                        maskRegistration(e.target.value),
                      )
                    }
                    onBlur={() => handleFieldBlur("registration")}
                    className={getValidationClass("registration")}
                  />
                </Field>
                <Field label="Nascimento:" error={errors.birthDate}>
                  <input
                    type="text"
                    placeholder="01/01/2001"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleFieldChange("birthDate", maskDate(e.target.value))
                    }
                    onBlur={() => handleFieldBlur("birthDate")}
                    className={getValidationClass("birthDate")}
                  />
                </Field>
              </div>

              {/* Row 2: Email | Phone | Course */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-3.5 mb-3.5">
                <Field label="Email:" error={errors.email}>
                  <input
                    type="email"
                    placeholder="joao.frota@icomp.ufam.edu.br"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    className={getValidationClass("email")}
                  />
                </Field>
                <Field label="Telefone:" error={errors.phone}>
                  <input
                    type="text"
                    placeholder="(99) 99999-9999"
                    value={formData.phone}
                    onChange={(e) =>
                      handleFieldChange("phone", maskPhone(e.target.value))
                    }
                    onBlur={() => handleFieldBlur("phone")}
                    className={getValidationClass("phone")}
                  />
                </Field>
                <CustomSelect
                  value={formData.course}
                  label="Curso:"
                  error={errors.course}
                  onChange={(val) => handleFieldChange("course", val)}
                  onBlur={() => handleFieldBlur("course")}
                  options={COURSES_NAME}
                />
              </div>

              {/* Diagnosis */}
              <div className="mb-3.5">
                <Field label="Diagnóstico:">
                  <input
                    type="text"
                    placeholder="TDAH, TAG"
                    value={formData.diagnosis}
                    onChange={(e) =>
                      handleFieldChange("diagnosis", e.target.value)
                    }
                    className={`${baseInputClass} border-stone-300 focus:border-teal-400`}
                  />
                </Field>
              </div>

              {/* Potentialities */}
              <div className="mb-3.5">
                <Field label="Potencialidades:">
                  <textarea
                    placeholder="Realiza atividades em grupo quando mediado e incluído no grupo pelo(a) professor(a)."
                    value={formData.potentialities}
                    onChange={(e) =>
                      handleFieldChange("potentialities", e.target.value)
                    }
                    rows={2}
                    className={`${baseInputClass} resize-y leading-relaxed min-h-16 border-stone-300 focus:border-teal-400`}
                  />
                </Field>
              </div>

              {/* Demands and Barriers */}
              <div className="mb-1.5">
                <Field label="Identificação inicial das demandas e barreiras:">
                  <textarea
                    placeholder="Descreva as demandas e barreiras identificadas..."
                    value={formData.demandsAndBarriers}
                    onChange={(e) =>
                      handleFieldChange("demandsAndBarriers", e.target.value)
                    }
                    rows={5}
                    className={`${baseInputClass} resize-y leading-relaxed min-h-30 bg-stone-50 border-stone-300 focus:bg-white focus:border-teal-400`}
                  />
                </Field>
              </div>
            </div>

            <div className="shrink-0 p-4 px-7 flex justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
              <CommonButton
                label="Cancelar"
                onClick={onCancel || handleReset}
                type="button"
                className="bg-[#f4a598] text-white hover:bg-[#f0a195]"
              />
              <CommonButton
                label={isEditMode ? "Salvar Alterações" : "Confirmar Registro"}
                type="submit"
              />
            </div>
          </form>
        )}
      </main>

      <Toast message={toastMsg} visible={toastVisible} type="error" />
    </>
  );
}
