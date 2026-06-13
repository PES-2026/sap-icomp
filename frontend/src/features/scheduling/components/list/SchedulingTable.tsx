"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useManagedSchedulings } from "../../hooks/useManagedScheduling";
import { ManagedScheduling } from "../../types/schedulingManagement";
import {
  formatSchedulingDate,
  formatSchedulingTime,
} from "../../utils/schedulingDates";
import SchedulingDetailsModal from "./SchedulingDetailsModal";
import SchedulingEmptyState from "./SchedulingEmptyState";
import SchedulingFilters from "./SchedulingFilters";
import SchedulingStatusBadge from "./SchedulingStatusBadge";

export default function SchedulingTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedScheduling, setSelectedScheduling] =
    useState<ManagedScheduling | null>(null);
  const { schedulings, isLoading, error, setFilters, reload } =
    useManagedSchedulings();

  const totalItems = schedulings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const paginatedSchedulings = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return schedulings.slice(startIndex, startIndex + limit);
  }, [schedulings, limit, page]);

  const columns: Column<ManagedScheduling>[] = [
    {
      label: "Aluno",
      width: "min-w-[220px]",
      renderCell: (scheduling) => (
        <span className="font-medium text-[#3a3530]">
          {scheduling.studentName}
        </span>
      ),
    },
    {
      label: "Matrícula",
      width: "min-w-[130px]",
      renderCell: (scheduling) => scheduling.enrollmentId,
    },
    {
      label: "E-mail",
      width: "min-w-[250px]",
      renderCell: (scheduling) => scheduling.email,
    },
    {
      label: "Curso",
      width: "min-w-[220px]",
      renderCell: (scheduling) => scheduling.course.name,
    },
    {
      label: "Data",
      width: "min-w-[120px]",
      renderCell: (scheduling) =>
        formatSchedulingDate(scheduling.slot.startDateTime),
    },
    {
      label: "Início",
      width: "min-w-[100px]",
      renderCell: (scheduling) =>
        formatSchedulingTime(scheduling.slot.startDateTime),
    },
    {
      label: "Término",
      width: "min-w-[100px]",
      renderCell: (scheduling) =>
        formatSchedulingTime(scheduling.slot.endDateTime),
    },
    {
      label: "Status",
      width: "min-w-[130px]",
      renderCell: (scheduling) => (
        <SchedulingStatusBadge status={scheduling.status} />
      ),
    },
    {
      label: "",
      width: "min-w-[70px]",
      renderCell: (scheduling) => (
        <div className="flex justify-center">
          <CommonButton
            label=""
            type="button"
            aria-label={`Visualizar agendamento de ${scheduling.studentId}`}
            title="Visualizar detalhes"
            startIcon={Eye}
            sizeIcon={20}
            onClick={() => setSelectedScheduling(scheduling)}
            className="gap-0 border-0 bg-transparent p-1 text-[#6bc4a6] hover:bg-[#e8f7f2]"
          />
        </div>
      ),
    },
  ];

  const loadingComponent = (
    <div className="flex h-full min-h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <Loader2 className="animate-spin text-[#6bc4a6]" size={30} />
        <p className="text-sm">Carregando agendamentos...</p>
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        title="Lista de Agendamentos"
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
          <SchedulingFilters
            onApply={(filters) => {
              setPage(1);
              setFilters(filters);
            }}
          />
        }
        isLoading={isLoading}
        loadingComponent={loadingComponent}
        data={paginatedSchedulings}
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
        emptyComponent={error ? undefined : <SchedulingEmptyState />}
      />

      <SchedulingDetailsModal
        scheduling={selectedScheduling}
        onClose={() => setSelectedScheduling(null)}
      />
    </>
  );
}
