"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useAttendancesByStudent } from "@/features/attendances/hooks/useAttendancesByStudent";
import { useStudentById } from "@/features/students/hooks/useStudentById";
import { ApiError } from "@/services/apiError";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useReportById } from "../hooks/useReportById";
import { ReportSchemaData, reportSchema } from "../schemas/reportSchema";
import { reportService } from "../services/reportService";
import { ReportConflictModal } from "./ReportConflictModal";
import { ReportErrorState } from "./ReportErrorState";
import { ReportMessageModal } from "./ReportMessageModal";

interface ReportFormProps {
  mode: "create" | "edit";
}

const EMPTY_FORM: ReportSchemaData = {
  technicalOpinion: "",
  strategicInterventions: "",
  teacherGuidance: "",
};

export default function ReportForm({ mode }: ReportFormProps) {
  const params = useParams();
  const router = useRouter();
  const studentId = decodeURIComponent((params.studentId as string) ?? "");
  const reportId = decodeURIComponent((params.reportId as string) ?? "");
  const isEditMode = mode === "edit";
  const user = useAuthStore((state) => state.user);
  const { student, isLoadingStudent } = useStudentById(studentId);
  const { attendancesByStudent, isLoadingAttendancesByStudent } =
    useAttendancesByStudent(studentId);
  const {
    report,
    isLoading: isLoadingReport,
    error: reportError,
    fetchReport,
  } = useReportById(reportId);
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [hasConflict, setHasConflict] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ReportSchemaData>({
    resolver: zodResolver(reportSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (isEditMode && report) {
      reset({
        technicalOpinion: report.technicalOpinion,
        strategicInterventions: report.strategicInterventions,
        teacherGuidance: report.teacherGuidance,
      });
    }
  }, [isEditMode, report, reset]);

  const reloadAfterConflict = async () => {
    setHasConflict(false);
    await fetchReport();
  };

  const submit = async (data: ReportSchemaData) => {
    if (!student) return;

    try {
      if (isEditMode) {
        if (!report) return;
        const updated = await reportService.update(report.id, {
          ...data,
          version: report.version,
          lastModifiedBy: {
            id: user?.id ?? "mock-pedagogue",
            name: user?.name ?? "Pedagoga responsável",
          },
        });
        toast.success("Relatório atualizado com sucesso.");
        router.push(PATHS.visualize_report(studentId, updated.id));
        return;
      }

      const eligibility = await reportService.getEligibility(
        studentId,
        attendancesByStudent,
      );
      if (!eligibility.canCreate) {
        setEligibilityMessage(
          "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
        );
        return;
      }

      const created = await reportService.create(studentId, {
        ...data,
        student: {
          id: student.id,
          name: student.name,
          enrollmentId: student.enrollmentId,
          course: {
            id: student.course?.id ?? "",
            name: student.course?.name ?? "Curso não informado",
          },
        },
        author: {
          id: user?.id ?? "mock-pedagogue",
          name: user?.name ?? "Pedagoga responsável",
        },
        includedAttendancesCount: eligibility.completedAttendancesCount,
      });
      toast.success("Relatório criado com sucesso.");
      router.push(PATHS.visualize_report(studentId, created.id));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setHasConflict(true);
        return;
      }
      toast.error(
        error instanceof Error
          ? error.message
          : `Não foi possível ${isEditMode ? "atualizar" : "criar"} o relatório.`,
      );
    }
  };

  const isLoading =
    isLoadingStudent ||
    isLoadingAttendancesByStudent ||
    (isEditMode && isLoadingReport);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={28} />
        Carregando relatório...
      </div>
    );
  }

  if (
    isEditMode &&
    (reportError || !report || report.student.id !== studentId)
  ) {
    return <ReportErrorState error={reportError} studentId={studentId} />;
  }

  if (!student) {
    return <ReportErrorState studentId={studentId} />;
  }

  const inputClass = (hasError: boolean) =>
    `min-h-32 w-full resize-y rounded-xl border-[1.5px] px-4 py-3 text-sm leading-relaxed text-stone-800 outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50 focus:border-red-400"
        : "border-[#e8e0d5] bg-[#faf9f5] hover:border-stone-300 focus:border-[#6bc4a6] focus:bg-white"
    }`;

  return (
    <>
      <main className="flex h-full min-w-0 flex-1 flex-col p-4 font-sans md:p-7">
        <form
          noValidate
          onSubmit={handleSubmit(submit)}
          className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#ece7db] bg-white shadow-sm"
        >
          <div className="shrink-0 border-b border-stone-100 px-6 py-5 md:px-8">
            <h1 className="text-2xl font-bold text-stone-800">
              {isEditMode ? "Editar Relatório" : "Criar Relatório"}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {student.name} · {student.enrollmentId} ·{" "}
              {student.course?.name ?? "Curso não informado"}
            </p>
          </div>

          <div className="custom-scroll flex-1 space-y-5 overflow-y-auto px-6 py-5 md:px-8">
            <Field
              label="Parecer Técnico"
              error={errors.technicalOpinion?.message}
              required
            >
              <textarea
                {...register("technicalOpinion")}
                placeholder="Insira o parecer técnico"
                className={inputClass(Boolean(errors.technicalOpinion))}
              />
            </Field>
            <Field
              label="Intervenções Estratégicas"
              error={errors.strategicInterventions?.message}
              required
            >
              <textarea
                {...register("strategicInterventions")}
                placeholder="Insira as intervenções estratégicas"
                className={inputClass(Boolean(errors.strategicInterventions))}
              />
            </Field>
            <Field
              label="Orientações aos Docentes"
              error={errors.teacherGuidance?.message}
              required
            >
              <textarea
                {...register("teacherGuidance")}
                placeholder="Insira as orientações aos docentes"
                className={inputClass(Boolean(errors.teacherGuidance))}
              />
            </Field>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-stone-200 bg-stone-50/50 px-6 py-4 md:px-8">
            <CommonButton
              label="Cancelar"
              type="button"
              onClick={() => router.back()}
              className="bg-[#f4a598] hover:bg-[#f0a195]"
            />
            <CommonButton
              label={
                isSubmitting
                  ? "Salvando..."
                  : isEditMode
                    ? "Salvar Alterações"
                    : "Criar Relatório"
              }
              type="submit"
              disabled={isSubmitting || (isEditMode && !isDirty)}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </form>
      </main>

      <ReportMessageModal
        open={Boolean(eligibilityMessage)}
        message={eligibilityMessage}
        onClose={() => {
          setEligibilityMessage("");
          router.push(PATHS.visualize_student(studentId));
        }}
      />
      <ReportConflictModal
        open={hasConflict}
        onReload={reloadAfterConflict}
        onCancel={() => setHasConflict(false)}
      />
    </>
  );
}
