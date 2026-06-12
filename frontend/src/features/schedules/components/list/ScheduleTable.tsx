"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Column, DataTable } from "@/components/ui/DataTable";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useManagedSchedules } from "../../hooks/useManagedSchedules";
import { ManagedSchedule } from "../../types/scheduleManagement";
import {
  formatScheduleDate,
  formatScheduleTime,
} from "../../utils/scheduleDates";
import ScheduleDetailsModal from "./ScheduleDetailsModal";
import ScheduleEmptyState from "./ScheduleEmptyState";
import ScheduleFilters from "./ScheduleFilters";
import ScheduleStatusBadge from "./ScheduleStatusBadge";

export default function ScheduleTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ManagedSchedule | null>(null);
  const { schedules, isLoading, error, setFilters, reload } =
    useManagedSchedules();

  const totalItems = schedules.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const paginatedSchedules = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return schedules.slice(startIndex, startIndex + limit);
  }, [schedules, limit, page]);

  const columns: Column<ManagedSchedule>[] = [
    {
      label: "Aluno",
      width: "min-w-[220px]",
      renderCell: (schedule) => (
        <span className="font-medium text-[#3a3530]">
          {schedule.student.name}
        </span>
      ),
    },
    {
      label: "Matrícula",
      width: "min-w-[130px]",
      renderCell: (schedule) => schedule.student.enrollmentId,
    },
    {
      label: "E-mail",
      width: "min-w-[250px]",
      renderCell: (schedule) => schedule.student.email,
    },
    {
      label: "Curso",
      width: "min-w-[220px]",
      renderCell: (schedule) => schedule.course.name,
    },
    {
      label: "Data",
      width: "min-w-[120px]",
      renderCell: (schedule) => formatScheduleDate(schedule.startDateTime),
    },
    {
      label: "Início",
      width: "min-w-[100px]",
      renderCell: (schedule) => formatScheduleTime(schedule.startDateTime),
    },
    {
      label: "Término",
      width: "min-w-[100px]",
      renderCell: (schedule) => formatScheduleTime(schedule.endDateTime),
    },
    {
      label: "Status",
      width: "min-w-[130px]",
      renderCell: (schedule) => (
        <ScheduleStatusBadge status={schedule.status} />
      ),
    },
    {
      label: "",
      width: "min-w-[70px]",
      renderCell: (schedule) => (
        <div className="flex justify-center">
          <CommonButton
            label=""
            type="button"
            aria-label={`Visualizar agendamento de ${schedule.student.name}`}
            title="Visualizar detalhes"
            startIcon={Eye}
            sizeIcon={20}
            onClick={() => setSelectedSchedule(schedule)}
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
          <ScheduleFilters
            onApply={(filters) => {
              setPage(1);
              setFilters(filters);
            }}
          />
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
        emptyComponent={error ? undefined : <ScheduleEmptyState />}
      />

      <ScheduleDetailsModal
        schedule={selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />
    </>
  );
}
