"use client";

import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ManagedSchedulingFilters,
  ManagedSchedulingPeriod,
} from "../../types/schedulingManagement";
import { getPeriodDates } from "../../utils/schedulingDates";

interface SchedulingFiltersProps {
  onApply: (filters: ManagedSchedulingFilters) => void;
}

const periodOptions = [
  { value: "TODAY", label: "Hoje" },
  { value: "THIS_WEEK", label: "Esta semana" },
  { value: "THIS_MONTH", label: "Este mês" },
  { value: "CUSTOM", label: "Personalizado" },
];

const inputClass =
  "rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-[#4a4540] outline-none transition-colors focus:border-[#6bc4a6]";

export default function SchedulingFilters({ onApply }: SchedulingFiltersProps) {
  const defaultDates = getPeriodDates("THIS_MONTH");
  const [period, setPeriod] = useState<ManagedSchedulingPeriod>("THIS_MONTH");
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate);
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate);
  const [studentName, setStudentName] = useState("");
  const [studentEnrollment, setStudentEnrollment] = useState("");
  const [error, setError] = useState("");

  const handlePeriodChange = (nextPeriod: string) => {
    const periodValue = nextPeriod as ManagedSchedulingPeriod;
    setPeriod(periodValue);
    setError("");

    if (periodValue !== "CUSTOM") {
      const dates = getPeriodDates(periodValue);
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  // Real-time filtering with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!startDate || (period === "CUSTOM" && !endDate)) {
        return;
      }

      if (endDate && new Date(endDate) < new Date(startDate)) {
        setError("A data final deve ser posterior à data inicial.");
        return;
      }

      setError("");

      const searchTerms = [studentName.trim(), studentEnrollment.trim()]
        .filter(Boolean)
        .join(" ");

      onApply({
        startDate,
        endDate: endDate || undefined,
        statuses: ["APPROVED", "FINISHED"],
        search: searchTerms || undefined,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [startDate, endDate, studentName, studentEnrollment, period, onApply]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 min-w-50 flex-col gap-1.5 text-xs font-semibold text-stone-500">
          Nome do aluno
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={studentName}
              placeholder="Ex: Maria Silva"
              onChange={(e) => setStudentName(e.target.value)}
              className={`${inputClass} w-full pl-9`}
            />
          </div>
        </label>

        <label className="flex flex-1 min-w-37.5 flex-col gap-1.5 text-xs font-semibold text-stone-500">
          Matrícula
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={studentEnrollment}
              placeholder="Ex: 22450123"
              onChange={(e) => setStudentEnrollment(e.target.value)}
              className={`${inputClass} w-full pl-9`}
            />
          </div>
        </label>

        <div className="flex min-w-48 flex-col">
          <CustomSelect
            label="Período"
            value={period}
            options={periodOptions}
            onChange={handlePeriodChange}
            placeholder="Selecione o período"
          />
        </div>

        {period === "CUSTOM" && (
          <div className="flex gap-3">
            <div className="flex w-40 flex-col gap-1.5">
              <CustomDatePicker
                label="Data inicial"
                value={startDate}
                onChange={setStartDate}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div className="flex w-40 flex-col gap-1.5">
              <CustomDatePicker
                label="Data final"
                value={endDate}
                onChange={setEndDate}
                placeholder="DD/MM/AAAA"
              />
            </div>
          </div>
        )}
      </div>

      <div className="min-h-5">
        {error ? (
          <p className="text-xs font-medium text-red-500">{error}</p>
        ) : (
          <p className="text-xs text-stone-400">
            Filtros por período exibem agendamentos confirmados e concluídos.
          </p>
        )}
      </div>
    </div>
  );
}
