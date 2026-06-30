"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Column, DataTable } from "@/components/ui/DataTable";
import { usePendingSchedulings } from "@/features/scheduling/hooks/usePendingScheduling";
import { AlertTriangle, Check, Eye, Loader2, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ScheduleItem } from "../../types/schedulingManagement";
import {
  formatSchedulingDate,
  formatSchedulingTime,
} from "../../utils/schedulingDates";
import SchedulingDetailsModal from "../list/SchedulingDetailsModal";
import SchedulingStatusBadge from "../list/SchedulingStatusBadge";
import PendingSchedulingEmptyState from "./PendingSchedulingEmptyState";
import SchedulingRejectionModal from "./SchedulingRejectionModal";

export default function PendingSchedulingTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [detailsScheduling, setDetailsScheduling] =
    useState<ScheduleItem | null>(null);

  const [rejectionScheduling, setRejectionScheduling] =
    useState<ScheduleItem | null>(null);

  const {
    schedulings,
    totalItems,
    isLoading,
    processingId,
    error,
    confirmScheduling,
    rejectScheduling,
    reload,
  } = usePendingSchedulings(page, limit);

  const handleConfirmClick = async (scheduleId: string, type: string) => {
    try {
      await confirmScheduling(scheduleId, type);
      toast.success("Atendimento confirmado com sucesso!");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Não foi possível confirmar o atendimento.",
      );
    }
  };

  const handleRejectConfirm = async (justification: string) => {
    if (!rejectionScheduling) return;

    try {
      await rejectScheduling(
        rejectionScheduling.id,
        justification,
        rejectionScheduling.type,
      );
      setRejectionScheduling(null);
      toast.success("Solicitação recusada com sucesso.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Não foi possível recusar o atendimento.",
      );
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const columns: Column<ScheduleItem>[] = [
    {
      label: "Aluno",
      width: "min-w-[230px]",
      renderCell: (scheduling) => (
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-[#3a3530]">
            {scheduling.studentName}
          </span>
          <span className="text-xs text-stone-400">
            {scheduling.studentEnrollment}
          </span>
        </div>
      ),
    },
    {
      label: "E-mail",
      width: "min-w-[260px]",
      renderCell: (scheduling) => scheduling.studentEmail,
    },
    {
      label: "Curso",
      width: "min-w-[190px]",
      renderCell: (scheduling) => scheduling.studentCourse,
    },
    {
      label: "Horário solicitado",
      width: "min-w-[160px]",
      renderCell: (scheduling) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[#4a4540]">
            {formatSchedulingDate(scheduling.startDate)}
          </span>
          <span>
            {formatSchedulingTime(scheduling.startDate)} às{" "}
            {formatSchedulingTime(scheduling.endDate)}
          </span>
        </div>
      ),
    },
    {
      label: "Status",
      width: "min-w-[130px]",
      renderCell: (scheduling) => (
        <SchedulingStatusBadge status={scheduling.status} />
      ),
    },
    {
      label: "Ações",
      width: "min-w-[150px]",
      renderCell: (scheduling) => {
        const isProcessing = processingId === scheduling.id;

        return (
          <div className="flex items-center justify-center gap-1">
            <CommonButton
              label=""
              type="button"
              aria-label={`Visualizar solicitação de ${scheduling.studentName}`}
              title="Visualizar detalhes"
              startIcon={Eye}
              sizeIcon={19}
              disabled={isProcessing}
              onClick={() => setDetailsScheduling(scheduling)}
              className="gap-0 rounded-md p-1 text-[#b0a898] bg-transparent hover:bg-[#f0ebe2]"
            />
            <CommonButton
              label=""
              type="button"
              aria-label={`Confirmar atendimento de ${scheduling.studentName}`}
              title="Confirmar Atendimento"
              startIcon={isProcessing ? Loader2 : Check}
              sizeIcon={20}
              disabled={isProcessing}
              onClick={() => handleConfirmClick(scheduling.id, scheduling.type)}
              className={`gap-0 rounded-md p-1 text-[#6bc4a6] bg-transparent hover:bg-[#e8f7f2] ${
                isProcessing ? "[&_svg]:animate-spin" : ""
              }`}
            />
            <CommonButton
              label=""
              type="button"
              aria-label={`Recusar atendimento de ${scheduling.studentName}`}
              title="Recusar Atendimento"
              startIcon={X}
              sizeIcon={20}
              disabled={isProcessing}
              onClick={() => setRejectionScheduling(scheduling)}
              className="gap-0 rounded-md p-1 text-red-600 bg-transparent hover:bg-red-100"
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
        data={schedulings}
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
        emptyComponent={error ? undefined : <PendingSchedulingEmptyState />}
      />

      <SchedulingDetailsModal
        scheduling={detailsScheduling}
        onClose={() => setDetailsScheduling(null)}
      />

      {rejectionScheduling && (
        <SchedulingRejectionModal
          scheduling={rejectionScheduling}
          isSubmitting={processingId === rejectionScheduling.id}
          onClose={() => setRejectionScheduling(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
    </>
  );
}
