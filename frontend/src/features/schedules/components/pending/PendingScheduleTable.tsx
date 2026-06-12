"use client";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Column, DataTable } from "@/components/ui/DataTable";
import { usePendingSchedules } from "@/features/schedules/hooks/usePendingSchedules";
import { AlertTriangle, Check, Eye, Loader2, RefreshCw, X } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ManagedSchedule } from "../../types/scheduleManagement";
import {
  formatScheduleDate,
  formatScheduleTime,
} from "../../utils/scheduleDates";
import ScheduleDetailsModal from "../list/ScheduleDetailsModal";
import ScheduleStatusBadge from "../list/ScheduleStatusBadge";
import PendingScheduleEmptyState from "./PendingScheduleEmptyState";
import ScheduleRejectionModal from "./ScheduleRejectionModal";

export default function PendingScheduleTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailsSchedule, setDetailsSchedule] =
    useState<ManagedSchedule | null>(null);
  const [confirmationSchedule, setConfirmationSchedule] =
    useState<ManagedSchedule | null>(null);
  const [rejectionSchedule, setRejectionSchedule] =
    useState<ManagedSchedule | null>(null);

  const {
    schedules,
    isLoading,
    processingId,
    error,
    confirmSchedule,
    rejectSchedule,
    reload,
  } = usePendingSchedules();

  const totalItems = schedules.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const paginatedSchedules = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return schedules.slice(startIndex, startIndex + limit);
  }, [schedules, limit, page]);

  const handleConfirm = async () => {
    if (!confirmationSchedule) return;

    try {
      const result = await confirmSchedule(confirmationSchedule.id);
      setConfirmationSchedule(null);

      if (result.outcome === "CANCELLED") {
        toast.error(
          "A data deste atendimento passou. A solicitação foi cancelada e o horário foi liberado.",
          { duration: 5500 },
        );
        return;
      }

      toast.success(
        result.emailNotificationQueued
          ? "Atendimento confirmado. O aluno será notificado por e-mail."
          : "Atendimento confirmado com sucesso.",
      );
    } catch (confirmError) {
      toast.error(
        confirmError instanceof Error
          ? confirmError.message
          : "Não foi possível confirmar o atendimento.",
      );
    }
  };

  const handleReject = async (justification: string) => {
    if (!rejectionSchedule) return;

    try {
      const result = await rejectSchedule(
        rejectionSchedule.id,
        justification,
      );
      setRejectionSchedule(null);

      toast.success(
        result.emailNotificationQueued
          ? "Solicitação recusada. O horário foi liberado e o aluno será notificado por e-mail."
          : "Solicitação recusada e horário liberado.",
        { duration: 5000 },
      );
    } catch (rejectError) {
      toast.error(
        rejectError instanceof Error
          ? rejectError.message
          : "Não foi possível recusar o atendimento.",
      );
    }
  };

  const columns: Column<ManagedSchedule>[] = [
    {
      label: "Aluno",
      width: "min-w-[230px]",
      renderCell: (schedule) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-[#3a3530]">
            {schedule.student.name}
          </span>
          <span className="text-xs text-stone-400">
            {schedule.student.enrollmentId}
          </span>
        </div>
      ),
    },
    {
      label: "E-mail",
      width: "min-w-[260px]",
      renderCell: (schedule) => schedule.student.email,
    },
    {
      label: "Curso",
      width: "min-w-[190px]",
      renderCell: (schedule) => schedule.course.name,
    },
    {
      label: "Horário solicitado",
      width: "min-w-[160px]",
      renderCell: (schedule) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[#4a4540]">
            {formatScheduleDate(schedule.startDateTime)}
          </span>
          <span>
            {formatScheduleTime(schedule.startDateTime)} às{" "}
            {formatScheduleTime(schedule.endDateTime)}
          </span>
        </div>
      ),
    },
    {
      label: "Status",
      width: "min-w-[130px]",
      renderCell: (schedule) => (
        <ScheduleStatusBadge status={schedule.status} />
      ),
    },
    {
      label: "Ações",
      width: "min-w-[150px]",
      renderCell: (schedule) => {
        const isProcessing = processingId === schedule.id;

        return (
          <div className="flex items-center justify-center gap-1.5">
            <CommonButton
              label=""
              type="button"
              aria-label={`Visualizar solicitação de ${schedule.student.name}`}
              title="Visualizar detalhes"
              startIcon={Eye}
              sizeIcon={19}
              disabled={isProcessing}
              onClick={() => setDetailsSchedule(schedule)}
              className="gap-0 border-0 bg-transparent p-1.5 text-stone-500 hover:bg-stone-100"
            />
            <CommonButton
              label=""
              type="button"
              aria-label={`Confirmar atendimento de ${schedule.student.name}`}
              title="Confirmar Atendimento"
              startIcon={isProcessing ? Loader2 : Check}
              sizeIcon={20}
              disabled={isProcessing}
              onClick={() => setConfirmationSchedule(schedule)}
              className={`gap-0 rounded-full border border-emerald-200 bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200 ${
                isProcessing ? "[&_svg]:animate-spin" : ""
              }`}
            />
            <CommonButton
              label=""
              type="button"
              aria-label={`Recusar atendimento de ${schedule.student.name}`}
              title="Recusar Atendimento"
              startIcon={X}
              sizeIcon={20}
              disabled={isProcessing}
              onClick={() => setRejectionSchedule(schedule)}
              className="gap-0 rounded-full border border-red-200 bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
            />
          </div>
        );
      },
    },
  ];

  const loadingComponent = (
    <div className="flex h-full min-h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={30} />
        <p className="text-sm">Carregando solicitações pendentes...</p>
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        title="Gerenciar Solicitações"
        headerAction={
          error ? (
            <CommonButton
              label="Tentar novamente"
              startIcon={RefreshCw}
              onClick={reload}
            />
          ) : undefined
        }
        toolbar={
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <div>
              <p className="font-semibold">
                {totalItems}{" "}
                {totalItems === 1
                  ? "solicitação precisa"
                  : "solicitações precisam"}{" "}
                de análise!
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                Confirme os horários que podem ser atendidos. Solicitações
                vencidas serão marcadas como canceladas.
              </p>
            </div>
          </div>
        }
        isLoading={isLoading}
        loadingComponent={loadingComponent}
        data={paginatedSchedules}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={(nextLimit) => {
          setLimit(nextLimit);
          setPage(1);
        }}
        totalItems={totalItems}
        totalPages={totalPages}
        emptyMessage={error || undefined}
        emptyComponent={error ? undefined : <PendingScheduleEmptyState />}
      />

      <ScheduleDetailsModal
        schedule={detailsSchedule}
        onClose={() => setDetailsSchedule(null)}
      />

      <ConfirmModal
        open={Boolean(confirmationSchedule)}
        title="Confirmar atendimento"
        message={
          confirmationSchedule
            ? `Deseja confirmar o atendimento de ${confirmationSchedule.student.name}? O aluno será notificado por e-mail.`
            : ""
        }
        confirmLabel={
          processingId === confirmationSchedule?.id
            ? "Confirmando..."
            : "Confirmar Atendimento"
        }
        onConfirm={
          processingId === confirmationSchedule?.id
            ? () => undefined
            : handleConfirm
        }
        onCancel={() => {
          if (!processingId) setConfirmationSchedule(null);
        }}
      />

      {rejectionSchedule && (
        <ScheduleRejectionModal
          key={rejectionSchedule.id}
          schedule={rejectionSchedule}
          isSubmitting={processingId === rejectionSchedule.id}
          onClose={() => {
            if (!processingId) setRejectionSchedule(null);
          }}
          onConfirm={handleReject}
        />
      )}
    </>
  );
}
