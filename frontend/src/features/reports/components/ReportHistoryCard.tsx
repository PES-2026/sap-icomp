"use client";

import CommonButton from "@/components/ui/CommonButton";
import { PATHS } from "@/constants/paths";
import { Student } from "@/features/students/types/student";
import { ApiError } from "@/services/apiError";
import { FilePlus2, FileText, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useReportsByStudent } from "../hooks/useReportsByStudent";
import { reportService } from "../services/reportService";
import { ReportSummary } from "../types/report";
import { formatReportDate } from "../utils/reportDates";
import { DeleteReportModal } from "./DeleteReportModal";
import { ReportMessageModal } from "./ReportMessageModal";

interface ReportHistoryCardProps {
  student: Student;
}

export default function ReportHistoryCard({ student }: ReportHistoryCardProps) {
  const router = useRouter();
  const { reports, isLoading, fetchReports } = useReportsByStudent(student.id);
  const [reportToDelete, setReportToDelete] = useState<ReportSummary>();
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sharedMessage, setSharedMessage] = useState("");

  const handleCreate = () => {
    router.push(PATHS.create_report(student.id));
  };

  const requestDelete = (report: ReportSummary) => {
    // The current backend report list does not return sharing status yet. This
    // guard is kept for the future sharing workflow described in the sprint.
    if (report.shared) {
      setSharedMessage(
        "Este relatório já foi compartilhado com docentes e não pode ser excluído. Você ainda pode retificá-lo por meio da edição.",
      );
      return;
    }

    setDeleteError("");
    setReportToDelete(report);
  };

  const handleDelete = async (password: string) => {
    if (!reportToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError("");
      await reportService.remove(reportToDelete.id, password);
      setReportToDelete(undefined);
      await fetchReports();
      toast.success("Relatório excluído com sucesso.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setDeleteError(error.message);
      } else if (error instanceof ApiError && error.status === 409) {
        setReportToDelete(undefined);
        setSharedMessage(error.message);
      } else {
        setReportToDelete(undefined);
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível excluir o relatório.",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ede8df] px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-[#2a2520]">
              Relatórios de Intervenção
            </h2>
            <p className="mt-0.5 text-xs text-[#a0998e]">
              {reports.length} relatório{reports.length !== 1 ? "s" : ""} ativo
              {reports.length !== 1 ? "s" : ""}
            </p>
          </div>
          <CommonButton
            label="Criar Relatório"
            startIcon={FilePlus2}
            onClick={handleCreate}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-7 text-sm text-stone-500">
            <Loader2 size={18} className="animate-spin text-[#6bc4a6]" />
            Carregando relatórios...
          </div>
        ) : reports.length === 0 ? (
          <div className="flex items-center gap-3 px-6 py-5 text-sm text-stone-500">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f0e8] text-stone-400">
              <FileText size={19} />
            </span>
            Nenhum relatório de intervenção foi criado para este aluno.
          </div>
        ) : (
          <div className="custom-scroll max-h-48 divide-y divide-stone-100 overflow-y-auto">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-stone-50"
              >
                <Link
                  href={PATHS.visualize_report(student.id, report.id)}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold text-stone-800">
                    Relatório de {formatReportDate(report.createdAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Responsável: {report.pedagogueName}
                    {report.includedAttendancesCount != null && (
                      <>
                        {" "}· {report.includedAttendancesCount} atendimento
                        {report.includedAttendancesCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </p>
                </Link>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={PATHS.visualize_report(student.id, report.id)}
                    title="Visualizar relatório"
                    aria-label="Visualizar relatório"
                    className="rounded-lg p-2 text-[#319878] transition-colors hover:bg-emerald-50"
                  >
                    <FileText size={18} />
                  </Link>
                  <Link
                    href={PATHS.edit_report(student.id, report.id)}
                    title="Editar relatório"
                    aria-label="Editar relatório"
                    className="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    type="button"
                    title="Excluir relatório"
                    aria-label="Excluir relatório"
                    onClick={() => requestDelete(report)}
                    className="cursor-pointer rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ReportMessageModal
        open={Boolean(sharedMessage)}
        title="Exclusão não permitida"
        message={sharedMessage}
        onClose={() => setSharedMessage("")}
      />
      {reportToDelete && (
        <DeleteReportModal
          open
          isDeleting={isDeleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setReportToDelete(undefined);
            setDeleteError("");
          }}
        />
      )}
    </>
  );
}
