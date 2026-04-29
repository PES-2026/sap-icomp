"use client";

import { useState } from "react";
import CommonButton from "@/components/common-button/CommonButton";
import { Field } from "../field/Field";
import { CustomSelect } from "../select-input/CustomSelect";
import { ConfirmModal } from "../confirm-modal/ConfirmModal";
import toast from "react-hot-toast";
import { EMPTY_FORM_ATTENDANCE } from "@/constants/attendance";
import { AttendanceFormData, AttendanceFormErrors } from "@/types/attendance";
import {
  formatAttendanceForBackend,
  validateAttendanceForm,
} from "@/utils/attendanceFormUtils";
import { attendanceService } from "@/services/attendanceService";
import { useStudentById } from "@/hooks/useStudentById";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useAttendanceForm } from "@/hooks/useAttendances";
import { maskDate } from "@/utils/utils";
import { useAttendanceTypesOptions } from "@/hooks/useAttendanceTypesOptions";

interface FormProps {
  isEditMode?: boolean;
  onCancel?: () => void;
}

export default function AttendanceForm({
  isEditMode = false,
  onCancel,
}: FormProps) {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");
  const attendanceId = decodeURIComponent(
    (params?.attendanceId as string) ?? "",
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<AttendanceFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof AttendanceFormData, boolean>>
  >({});

  const { formData, setFormData } = useAttendanceForm({
    attendanceId,
    isEditMode,
  });

  const { student } = useStudentById(studentId);
  const { attendanceTypesOptions } = useAttendanceTypesOptions();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showConfirmRegister, setShowConfirmRegister] = useState(false);

  const baseInputClass =
    "w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans";

  const getValidationClass = (field: keyof AttendanceFormErrors) =>
    errors[field]
      ? `${baseInputClass} border-red-300 bg-red-50 focus:border-red-400`
      : `${baseInputClass} border-stone-300 hover:border-stone-400 focus:border-teal-400`;

  const handleFieldChange = (key: keyof AttendanceFormData, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: validateAttendanceForm(updated)[key],
      }));

      return updated;
    });
  };

  const handleFieldBlur = (key: keyof AttendanceFormData) => {
    setTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const validateSubmit = () => {
    const allFields = Object.keys(EMPTY_FORM_ATTENDANCE) as Array<
      keyof AttendanceFormData
    >;
    const allTouched = allFields.reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);

    const validationErrors = validateAttendanceForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return toast.error("Preencha os campos obrigatórios corretamente.");
    }

    setShowConfirmRegister(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = formatAttendanceForBackend(formData, studentId);

      if (isEditMode) {
        await attendanceService.update(formData.studentId, payload);
        toast.success("Atendimento atualizado com sucesso!");
      } else {
        await attendanceService.create(payload);
        toast.success("Atendimento registrado com sucesso!");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      isEditMode
        ? toast.error(
            error.response?.data?.message ||
              "Erro ao conectar com o servidor, não foi possível editar.",
          )
        : toast.error(
            error.response?.data?.message ||
              "Erro ao conectar com o servidor, não foi possível registrar.",
          );
    } finally {
      setShowConfirmRegister(false);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM_ATTENDANCE);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

  return (
    <>
      <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0"
        >
          <div className="shrink-0 px-7 pt-7 pb-4">
            <h1 className="m-0 text-2xl font-bold text-stone-800">
              {isEditMode ? "Editar Atendimento" : "Cadastrar Novo Atendimento"}
            </h1>
          </div>

          <div className="flex-1 px-7 pb-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px] gap-3.5 mb-3.5">
              <Field label="Aluno (a):">
                <input
                  disabled
                  type="text"
                  placeholder="João Vitor Mesquita da Frota"
                  value={student?.name || ""}
                  className="w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400"
                />
              </Field>
              <Field label="Matrícula:">
                <input
                  disabled
                  type="text"
                  placeholder="12345678"
                  value={student?.enrollmentId || ""}
                  className="w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400"
                />
              </Field>
              <Field label="Data:" error={errors.date}>
                <input
                  type="text"
                  placeholder="01/01/2001"
                  value={formData.date}
                  onChange={(e) =>
                    handleFieldChange("date", maskDate(e.target.value))
                  }
                  onBlur={() => handleFieldBlur("date")}
                  className={getValidationClass("date")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-3.5 mb-3.5">
              <Field label="Diagnóstico:">
                <input
                  disabled
                  type="text"
                  placeholder="TDAH, TAG"
                  value={student?.difficulties ?? ""}
                  className="w-full px-3.5 py-2.5 border-[1.5px] rounded-md bg-white text-sm text-stone-800 outline-none transition-colors font-sans border-stone-300 hover:border-stone-400 focus:border-teal-400"
                />
              </Field>
              <CustomSelect
                value={formData.type}
                label="Tipo de Atendimento:"
                error={errors.type}
                onChange={(val) => handleFieldChange("type", val)}
                onBlur={() => handleFieldBlur("type")}
                options={attendanceTypesOptions}
                isSetLabel={true}
              />
            </div>

            <div className="mb-3.5">
              <Field label="Demanda Relatada:">
                <textarea
                  placeholder="Realiza atividades em grupo..."
                  value={formData.demand ?? ""}
                  onChange={(e) => handleFieldChange("demand", e.target.value)}
                  rows={2}
                  className={`${baseInputClass} resize-y leading-relaxed min-h-16 border-stone-300 focus:border-teal-400`}
                />
              </Field>
            </div>

            <div className="mb-1.5">
              <Field label="Observações gerais:">
                <textarea
                  placeholder="Insira suas observações sobre o que foi relatado..."
                  value={formData.generalObservations ?? ""}
                  onChange={(e) =>
                    handleFieldChange("generalObservations", e.target.value)
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
      </main>

      {/* ── Confirm Modal to Update/Create Attendance ── */}
      <ConfirmModal
        open={showConfirmRegister}
        title={isEditMode ? "Atualizar Atendimento" : "Registrar Atendimento"}
        message={
          isEditMode
            ? `Tem certeza que deseja atualizar o atendimento?`
            : `Tem certeza que deseja cadastrar o atendimento?`
        }
        confirmLabel={isEditMode ? "Atualizar" : "Cadastrar"}
        confirmColor="primary"
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmRegister(false)}
      />
    </>
  );
}
