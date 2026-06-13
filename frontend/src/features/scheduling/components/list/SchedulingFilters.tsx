"use client";

import CommonButton from "@/components/ui/CommonButton";
import { CalendarRange, Filter } from "lucide-react";
import { useState } from "react";
import {
  ManagedSchedulingFilters,
  ManagedSchedulingPeriod,
} from "../../types/schedulingManagement";
import { getPeriodDates } from "../../utils/schedulingDates";

interface SchedulingFiltersProps {
  onApply: (filters: ManagedSchedulingFilters) => void;
}

const periodOptions: {
  value: ManagedSchedulingPeriod;
  label: string;
}[] = [
  { value: "UPCOMING", label: "A partir de hoje" },
  { value: "THIS_WEEK", label: "Esta semana" },
  { value: "NEXT_15_DAYS", label: "Próximos 15 dias" },
  { value: "CUSTOM", label: "Período personalizado" },
];

const inputClass =
  "rounded-lg border border-[#e2ddd5] bg-[#faf8f4] px-3 py-2 text-sm text-[#4a4540] outline-none transition-colors focus:border-[#6bc4a6]";

export default function SchedulingFilters({ onApply }: SchedulingFiltersProps) {
  const upcomingDates = getPeriodDates("UPCOMING");
  const [period, setPeriod] = useState<ManagedSchedulingPeriod>("UPCOMING");
  const [startDate, setStartDate] = useState(upcomingDates.startDate);
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handlePeriodChange = (nextPeriod: ManagedSchedulingPeriod) => {
    setPeriod(nextPeriod);
    setError("");

    if (nextPeriod !== "CUSTOM") {
      const dates = getPeriodDates(nextPeriod);
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
  };

  const handleApply = () => {
    if (!startDate || (period === "CUSTOM" && !endDate)) {
      setError("Informe a data inicial e a data final.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("A data final deve ser posterior à data inicial.");
      return;
    }

    setError("");
    onApply({
      startDate,
      endDate: endDate || undefined,
      statuses: period === "UPCOMING" ? ["PENDING", "APPROVED"] : ["APPROVED"],
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-52 flex-col gap-1.5 text-xs font-semibold text-stone-500">
          Período
          <div className="relative">
            <CalendarRange
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <select
              value={period}
              onChange={(event) =>
                handlePeriodChange(
                  event.target.value as ManagedSchedulingPeriod,
                )
              }
              className={`${inputClass} w-full cursor-pointer pl-9`}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500">
          Data inicial
          <input
            type="date"
            value={startDate}
            disabled={period !== "CUSTOM"}
            onChange={(event) => setStartDate(event.target.value)}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-70`}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-stone-500">
          Data final
          <input
            type="date"
            value={endDate}
            disabled={period !== "CUSTOM"}
            onChange={(event) => setEndDate(event.target.value)}
            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-70`}
          />
        </label>

        <CommonButton
          label="Aplicar filtro"
          type="button"
          startIcon={Filter}
          onClick={handleApply}
          className="justify-center"
        />
      </div>

      <div className="mt-2 min-h-5">
        {error ? (
          <p className="text-xs font-medium text-red-500">{error}</p>
        ) : (
          <p className="text-xs text-stone-400">
            Filtros por período exibem somente agendamentos confirmados.
          </p>
        )}
      </div>
    </div>
  );
}
