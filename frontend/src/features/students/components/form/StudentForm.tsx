"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Field } from "@/components/ui/Field";
import { useCoursesOptions } from "@/features/courses/hooks/useCoursesOptions";
import { FormErrors, StudentFormData } from "@/features/students/types/student";
import { maskDate, maskPhone, maskRegistration } from "@/utils/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { studentService } from "../../services/studentService";
import {
  EMPTY_FORM_STUDENT,
  formatForBackend,
  validateStudentForm,
} from "../../utils/studentUtils";
import { StudentSkeletonForm } from "./StudentSkeletonForm";
import { SuccessScreen } from "./SucessScreen";

interface StudentFormProps {
  initialData?: StudentFormData;
  onCancel?: () => void;
}

export default function StudentForm({
  initialData,
  onCancel,
}: StudentFormProps) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<StudentFormData>(
    initialData || EMPTY_FORM_STUDENT,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmRegister, setShowConfirmRegister] = useState(false);

  const { coursesOptions } = useCoursesOptions();

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (field: keyof StudentFormData) =>
    errors[field]
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleFieldChange = (key: keyof StudentFormData, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: validateStudentForm(updated)[key],
      }));

      return updated;
    });
  };

  const validateSubmit = () => {
    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return toast.error("Preencha os campos obrigatórios corretamente.");
    }

    setShowConfirmRegister(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const payload = formatForBackend(formData);

      if (isEditMode && initialData?.externalId) {
        await studentService.updateStudent(initialData.externalId, payload);
        toast.success("Estudante atualizado com sucesso!");
      } else {
        await studentService.createStudent(payload as StudentFormData);
        toast.success("Estudante cadastrado com sucesso!");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      isEditMode
        ? toast.error(
            error.response?.data?.error ||
              "Erro ao conectar com o servidor, não foi possível editar.",
          )
        : toast.error(
            error.response?.data?.error ||
              "Erro ao conectar com o servidor, não foi possível registrar.",
          );
    } finally {
      setIsLoading(false);
      setShowConfirmRegister(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM_STUDENT);
    setErrors({});
    setIsSubmitted(false);
  };

  return isLoading ? (
    <StudentSkeletonForm />
  ) : (
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
                    className={getValidationClass("phoneNumber")}
                  />
                </Field>
                <CustomSelect
                  value={formData.courseId}
                  label="Curso:"
                  error={errors.courseId}
                  onChange={(val) => handleFieldChange("courseId", val)}
                  options={coursesOptions}
                />
              </div>

              <div className="mb-3.5">
                <Field label="Diagnóstico:">
                  <input
                    type="text"
                    placeholder="TDAH, TAG"
                    value={formData.diagnosis ?? ""}
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
                    value={formData.potential ?? ""}
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
                    value={formData.difficulties ?? ""}
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
                type="button"
                onClick={validateSubmit}
                disabled={isLoading}
              />
            </div>
          </form>
        )}
      </main>

      {/* ── Confirm Modal to Update/Create Student ── */}
      <ConfirmModal
        open={showConfirmRegister}
        title={isEditMode ? "Atualizar Aluno" : "Cadastrar Aluno"}
        message={
          isEditMode
            ? `Tem certeza que deseja atualizar ${formData.name}?`
            : `Tem certeza que deseja cadastrar ${formData.name}?`
        }
        confirmLabel={isEditMode ? "Atualizar" : "Cadastrar"}
        confirmColor="primary"
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmRegister(false)}
      />
    </>
  );
}
