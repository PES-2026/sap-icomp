"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { PATHS } from "@/constants/paths";
import { useStudentById } from "@/features/students/hooks/useStudentById";
import { ApiError } from "@/services/apiError";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useReportById } from "../hooks/useReportById";
import { ReportSchemaData, reportSchema } from "../schemas/reportSchema";
import { reportService } from "../services/reportService";
import {
  EMPTY_LEXICAL_STATE,
  normalizeLexicalState,
  plainTextToLexical,
} from "../utils/lexicalState";
import { getReportId } from "../utils/reportUtils";
import { LexicalReportEditor } from "./LexicalReportEditor";
import { ReportConflictModal } from "./ReportConflictModal";
import { ReportErrorState } from "./ReportErrorState";
import { ReportMessageModal } from "./ReportMessageModal";

interface ReportFormProps {
  mode: "create" | "edit";
}

const EMPTY_FORM: ReportSchemaData = {
  condition: EMPTY_LEXICAL_STATE,
  potential: EMPTY_LEXICAL_STATE,
  difficulties: EMPTY_LEXICAL_STATE,
  recommendation: EMPTY_LEXICAL_STATE,
  conclusion: EMPTY_LEXICAL_STATE,
};

export default function ReportForm({ mode }: ReportFormProps) {
  const params = useParams();
  const router = useRouter();
  const studentId = decodeURIComponent((params.studentId as string) ?? "");
  const reportId = decodeURIComponent((params.reportId as string) ?? "");
  const isEditMode = mode === "edit";
  const user = useAuthStore((state) => state.user);
  const { student, isLoadingStudent } = useStudentById(studentId);
  const {
    report,
    isLoading: isLoadingReport,
    error: reportError,
    fetchReport,
  } = useReportById(studentId, isEditMode ? reportId : "");
  const [eligibilityMessage, setEligibilityMessage] = useState("");
  const [initialLoadError, setInitialLoadError] = useState("");
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(!isEditMode);
  const [hasConflict, setHasConflict] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ReportSchemaData>({
    resolver: zodResolver(reportSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (!isEditMode || !report) return;

    reset({
      condition: normalizeLexicalState(report.condition),
      potential: normalizeLexicalState(report.potential),
      difficulties: normalizeLexicalState(report.difficulties),
      recommendation: normalizeLexicalState(report.recommendation),
      conclusion: normalizeLexicalState(report.conclusion),
    });
  }, [isEditMode, report, reset]);

  useEffect(() => {
    if (isEditMode || !studentId) return;

    let active = true;
    const loadInitialData = async () => {
      try {
        setIsLoadingInitialData(true);
        setInitialLoadError("");
        const initialData = await reportService.getInitialData(studentId);
        if (!active) return;

        reset({
          ...EMPTY_FORM,
          potential: plainTextToLexical(initialData.potential),
          difficulties: plainTextToLexical(initialData.difficulties),
        });
      } catch (error) {
        if (!active) return;
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível iniciar a criação do relatório.";

        if (error instanceof ApiError && error.status === 422) {
          setEligibilityMessage(message);
        } else {
          setInitialLoadError(message);
        }
      } finally {
        if (active) setIsLoadingInitialData(false);
      }
    };

    void loadInitialData();
    return () => {
      active = false;
    };
  }, [isEditMode, reset, studentId]);

  const reloadAfterConflict = async () => {
    setHasConflict(false);
    await fetchReport();
  };

  const submit = async (data: ReportSchemaData) => {
    if (!student || !user) {
      toast.error("Não foi possível identificar a pedagoga autenticada.");
      return;
    }

    try {
      const requestData = { ...data, pedagogueId: user.id };

      if (isEditMode) {
        await reportService.update(studentId, reportId, requestData);
        toast.success("Relatório atualizado com sucesso.");
        router.push(PATHS.visualize_report(studentId, reportId));
        return;
      }

      const created = await reportService.create(studentId, requestData);
      const createdReportId = getReportId(created);
      toast.success("Relatório criado com sucesso.");
      router.push(PATHS.visualize_report(studentId, createdReportId));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setHasConflict(true);
        return;
      }
      if (error instanceof ApiError && error.status === 422) {
        setEligibilityMessage(error.message);
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
    (!isEditMode && isLoadingInitialData) ||
    (isEditMode && isLoadingReport);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={28} />
        Carregando relatório...
      </div>
    );
  }

  if (isEditMode && (reportError || !report)) {
    return <ReportErrorState error={reportError} studentId={studentId} />;
  }

  if (!student) {
    return <ReportErrorState studentId={studentId} />;
  }

  if (initialLoadError) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-800">
            Não foi possível criar o relatório
          </h1>
          <p className="mt-2 text-sm text-stone-500">{initialLoadError}</p>
          <CommonButton
            label="Voltar ao aluno"
            onClick={() => router.push(PATHS.visualize_student(studentId))}
            className="mx-auto mt-6"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-full min-w-0 flex-1 flex-col p-6 font-sans">
        <form
          noValidate
          onSubmit={handleSubmit(submit)}
          className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#ece7db] bg-white shadow-sm"
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

          <div className="custom-scroll flex-1 space-y-7 overflow-y-auto px-6 py-5 md:px-8">
            <section className="space-y-5">
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <Field
                    label="Deficiência/Condição"
                    error={errors.condition?.message}
                    required
                  >
                    <LexicalReportEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Descreva a deficiência ou condição do estudante"
                      hasError={Boolean(errors.condition)}
                    />
                  </Field>
                )}
              />
              <Controller
                name="potential"
                control={control}
                render={({ field }) => (
                  <Field
                    label="Potencialidades"
                    error={errors.potential?.message}
                    required
                  >
                    <LexicalReportEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Descreva as potencialidades"
                      hasError={Boolean(errors.potential)}
                    />
                  </Field>
                )}
              />
              <Controller
                name="difficulties"
                control={control}
                render={({ field }) => (
                  <Field
                    label="Dificuldades"
                    error={errors.difficulties?.message}
                    required
                  >
                    <LexicalReportEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Descreva as dificuldades"
                      hasError={Boolean(errors.difficulties)}
                    />
                  </Field>
                )}
              />
            </section>

            <Controller
              name="recommendation"
              control={control}
              render={({ field }) => (
                <Field
                  label="Recomendações metodológicas"
                  error={errors.recommendation?.message}
                  required
                >
                  <LexicalReportEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Insira as recomendações metodológicas"
                    hasError={Boolean(errors.recommendation)}
                  />
                </Field>
              )}
            />

            <Controller
              name="conclusion"
              control={control}
              render={({ field }) => (
                <Field
                  label="Considerações finais"
                  error={errors.conclusion?.message}
                  required
                >
                  <LexicalReportEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Insira as considerações finais"
                    hasError={Boolean(errors.conclusion)}
                  />
                </Field>
              )}
            />
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
