"use client";

import { CalendarDays, Check, Clock3, X } from "lucide-react";

import { SchedulingDayPreview, SchedulingSlot } from "../../types/scheduling";

interface SchedulingPreviewListProps {
  days: SchedulingDayPreview[];
  hasGeneratedPreview: boolean;
  disabledSlotIds: Set<string>;
  onToggleSlot: (slotId: string) => void;
}

const formatDateLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));

const formatWeekday = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    timeZone: "UTC",
  })
    .format(new Date(date))
    .replace(".", "");

const padTime = (value: number) => String(value).padStart(2, "0");

const formatTimeFromMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${padTime(hours)}:${padTime(minutes)}`;
};

const getSlotId = (slot: SchedulingSlot, dayDate: string) => {
  if (slot.startDateTime && slot.endDateTime) {
    return `${slot.startDateTime}|${slot.endDateTime}`;
  }
  // Fallback if ISO strings are missing
  return `${dayDate}|${slot.start}|${slot.end}`;
};

export default function SchedulingPreviewList({
  days,
  hasGeneratedPreview,
  disabledSlotIds,
  onToggleSlot,
}: SchedulingPreviewListProps) {
  if (!hasGeneratedPreview) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 px-6 py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 shadow-sm">
          <CalendarDays size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-stone-800">
          Nenhuma prévia gerada
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
          Preencha o formulário acima e clique em "Gerar disponibilidade" para
          visualizar e gerenciar os horários antes de salvar.
        </p>
      </div>
    );
  }

  const allSlots = days.flatMap(day => day.slots);

  if (allSlots.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm">
          <Clock3 size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-amber-900">
          Nenhum horário disponível
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-amber-700">
          A duração informada é maior que o intervalo entre o horário inicial e
          final, ou não há tempo suficiente para agendar um atendimento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-nowrap md:flex-wrap gap-4 overflow-x-auto md:overflow-visible pb-4 custom-scroll snap-x snap-mandatory">
        {days.map((day) => (
          <article
            key={day.date}
            className="shrink-0 w-[85vw] sm:w-64 md:w-auto md:flex-1 md:min-w-60 snap-center overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <header className="flex flex-col items-center justify-center border-b border-stone-100 bg-stone-50 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                {formatWeekday(day.date)}
              </span>
              <h3 className="text-base font-semibold text-stone-700">
                {formatDateLabel(day.date)}
              </h3>
            </header>

            <div className="flex flex-col p-2 gap-1.5 max-h-75 md:max-h-none overflow-y-auto custom-scroll">
              {day.slots.map((slot) => {
                const slotId = getSlotId(slot, day.date);
                const isToggled = disabledSlotIds.has(slotId);
                const isAvailable = slot.status === "AVAILABLE";
                const isCreated = slot.status === "CREATED";

                let buttonClass = "";
                let timeClass = "";
                let subTimeClass = "";
                let toggleBgClass = "";
                let toggleDotClass = "";
                let icon = null;

                if (isAvailable) {
                  if (isToggled) {
                    // Selecionado para criação (Verde)
                    buttonClass = "border-teal-100 bg-teal-50 hover:border-teal-200 hover:bg-teal-100/70";
                    timeClass = "text-teal-800";
                    subTimeClass = "text-teal-600";
                    toggleBgClass = "bg-teal-500";
                    toggleDotClass = "translate-x-5";
                    icon = <Check size={12} className="text-teal-500" strokeWidth={3} />;
                  } else {
                    // Disponível mas não selecionado (Cinza)
                    buttonClass = "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50";
                    timeClass = "text-stone-600";
                    subTimeClass = "text-stone-400";
                    toggleBgClass = "bg-stone-200";
                    toggleDotClass = "translate-x-0";
                    icon = <Clock3 size={12} className="text-stone-400" strokeWidth={3} />;
                  }
                } else if (isCreated) {
                  if (isToggled) {
                    // Selecionado para remoção (Vermelho)
                    buttonClass = "border-red-100 bg-red-50 hover:border-red-200 hover:bg-red-100/70";
                    timeClass = "text-red-700 line-through opacity-70";
                    subTimeClass = "text-red-500 opacity-70";
                    toggleBgClass = "bg-red-300";
                    toggleDotClass = "translate-x-0";
                    icon = <X size={12} className="text-red-500" strokeWidth={3} />;
                  } else {
                    // Já criado e ativo (Verde)
                    buttonClass = "border-teal-100 bg-teal-50 hover:border-teal-200 hover:bg-teal-100/70";
                    timeClass = "text-teal-800";
                    subTimeClass = "text-teal-600";
                    toggleBgClass = "bg-teal-500";
                    toggleDotClass = "translate-x-5";
                    icon = <Check size={12} className="text-teal-500" strokeWidth={3} />;
                  }
                }

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onToggleSlot(slotId)}
                    aria-pressed={(isAvailable && isToggled) || (isCreated && !isToggled)}
                    aria-label={`Horário de ${formatTimeFromMinutes(slot.start)} às ${formatTimeFromMinutes(slot.end)}`}
                    className={`group relative flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.98] ${buttonClass}`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${timeClass}`}>
                        {formatTimeFromMinutes(slot.start)}
                      </span>
                      <span className={`text-[11px] font-medium ${subTimeClass}`}>
                        até {formatTimeFromMinutes(slot.end)}
                      </span>
                    </div>

                    <div
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggleBgClass}`}
                    >
                      <span
                        className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggleDotClass}`}
                      >
                        {icon}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
