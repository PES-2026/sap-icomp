"use client";

import { useState, FormEvent } from "react";
import CommonButton from "@/components/common-button/CommonButton";
import {
  maskRegistration,
  maskDate,
  maskPhone,
  validateStudentForm,
  formatForBackend,
} from "@/utils/studentFormUtils";
import { SuccessScreen, Toast } from "./ui/StudentFormUI";
import { Field } from "../field/Field";
import { CustomSelect } from "../select-input/CustomSelect";
import { FormErrors, NewStudentFormData } from "@/types/student";
import { EMPTY_FORM } from "@/constants/student";
import { COURSES_NAME } from "@/constants/courses";
import { studentService } from "@/services";

interface StudentFormProps {
  initialData?: NewStudentFormData;
  onSubmitSuccess?: (data: NewStudentFormData) => void;
  onCancel?: () => void;
}

export default function StudentForm({
  initialData,
  onSubmitSuccess,
  onCancel,
}: StudentFormProps) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<NewStudentFormData>(
    initialData || EMPTY_FORM,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof NewStudentFormData, boolean>>
  >({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: "" });

  const showToast = (msg: string) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
  };

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";
  const getValidationClass = (field: keyof NewStudentFormData) =>
    errors[field]
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleFieldChange = (key: keyof NewStudentFormData, value: string) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (touched[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateStudentForm(updated)[key],
      }));
    }
  };

  const handleFieldBlur = (key: keyof NewStudentFormData) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({
      ...prev,
      [key]: validateStudentForm(formData)[key],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const allFields = Object.keys(EMPTY_FORM) as Array<
      keyof NewStudentFormData
    >;
    const allTouched = allFields.reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);

    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return showToast("Preencha os campos obrigatórios corretamente.");
    }

    try {
      setIsLoading(true);

      const payload = formatForBackend(formData);

      const response = await studentService.createStudent(
        payload as NewStudentFormData,
      );

      showToast("Estudante cadastrado com sucesso!");
      setIsSubmitted(true);

      if (onSubmitSuccess) onSubmitSuccess(response);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Erro ao conectar com o servidor.",
      );
    } finally {
      setIsLoading(false);
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
            studentName={formData.name}
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
              <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px] gap-3.5 mb-3.5">
                <Field label="Aluno (a):" error={errors.name}>
                  <input
                    type="text"
                    placeholder="João Vitor Mesquita da Frota"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={() => handleFieldBlur("name")}
                    className={getValidationClass("name")}
                  />
                </Field>
                <Field label="Matrícula:" error={errors.enrollmentId}>
                  <input
                    type="text"
                    placeholder="12345678"
                    value={formData.enrollmentId}
                    onChange={(e) =>
                      handleFieldChange(
                        "enrollmentId",
                        maskRegistration(e.target.value),
                      )
                    }
                    onBlur={() => handleFieldBlur("enrollmentId")}
                    className={getValidationClass("enrollmentId")}
                  />
                </Field>
                <Field label="Nascimento:" error={errors.dtBirth}>
                  <input
                    type="text"
                    placeholder="01/01/2001"
                    value={formData.dtBirth}
                    onChange={(e) =>
                      handleFieldChange("dtBirth", maskDate(e.target.value))
                    }
                    onBlur={() => handleFieldBlur("dtBirth")}
                    className={getValidationClass("dtBirth")}
                  />
                </Field>
              </div>

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
                <Field label="Telefone:" error={errors.phoneNumber}>
                  <input
                    type="text"
                    placeholder="(99) 99999-9999"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleFieldChange(
                        "phoneNumber",
                        maskPhone(e.target.value),
                      )
                    }
                    onBlur={() => handleFieldBlur("phoneNumber")}
                    className={getValidationClass("phoneNumber")}
                  />
                </Field>
                <CustomSelect
                  value={formData.courseId}
                  label="Curso:"
                  error={errors.courseId}
                  onChange={(val) => handleFieldChange("courseId", val)}
                  onBlur={() => handleFieldBlur("courseId")}
                  options={COURSES_NAME}
                />
              </div>

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

              <div className="mb-3.5">
                <Field label="Potencialidades:">
                  <textarea
                    placeholder="Realiza atividades em grupo..."
                    value={formData.potential}
                    onChange={(e) =>
                      handleFieldChange("potential", e.target.value)
                    }
                    rows={2}
                    className={`${baseInputClass} resize-y leading-relaxed min-h-16 border-stone-300 focus:border-teal-400`}
                  />
                </Field>
              </div>

              <div className="mb-1.5">
                <Field label="Identificação inicial das demandas e barreiras:">
                  <textarea
                    placeholder="Descreva as demandas..."
                    value={formData.difficulties}
                    onChange={(e) =>
                      handleFieldChange("difficulties", e.target.value)
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
                label={
                  isLoading
                    ? "Salvando..."
                    : isEditMode
                      ? "Salvar Alterações"
                      : "Confirmar Registro"
                }
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
        )}
      </main>

      <Toast message={toast.msg} visible={toast.visible} type="error" />
    </>
  );
}
