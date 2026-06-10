"use client";

import { CalendarDays, Check, Clock3, X } from "lucide-react";

import { ScheduleSlot } from "../types/schedule";

interface SchedulePreviewListProps {
  slots: ScheduleSlot[];
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
  }).format(new Date(`${date}T00:00:00Z`));

const formatWeekday = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".", "");

const getTime = (dateTime: string) => dateTime.slice(11, 16);

const getSlotId = (slot: ScheduleSlot) =>
  `${slot.startDateTime}|${slot.endDateTime}`;

export default function SchedulePreviewList({
  slots,
  hasGeneratedPreview,
  disabledSlotIds,
  onToggleSlot,
}: SchedulePreviewListProps) {
  const groupedSlots = slots.reduce<Record<string, ScheduleSlot[]>>(
    (groups, slot) => {
      const date = slot.startDateTime.slice(0, 10);
      groups[date] = [...(groups[date] ?? []), slot];
      return groups;
    },
    {},
  );

  const previewDays = Object.keys(groupedSlots);

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

  if (slots.length === 0) {
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
        {previewDays.map((date) => (
          <article
            key={date}
            className="shrink-0 w-[85vw] sm:w-64 md:w-auto md:flex-1 md:min-w-60 snap-center overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <header className="flex flex-col items-center justify-center border-b border-stone-100 bg-stone-50 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                {formatWeekday(date)}
              </span>
              <h3 className="text-base font-semibold text-stone-700">
                {formatDateLabel(date)}
              </h3>
            </header>

            <div className="flex flex-col p-2 gap-1.5 max-h-75 md:max-h-none overflow-y-auto custom-scroll">
              {groupedSlots[date].map((slot) => {
                const slotId = getSlotId(slot);
                const isDisabled = disabledSlotIds.has(slotId);

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onToggleSlot(slotId)}
                    aria-pressed={!isDisabled}
                    aria-label={`${isDisabled ? "Ativar" : "Desativar"} horário de ${getTime(slot.startDateTime)} às ${getTime(slot.endDateTime)}`}
                    className={`group relative flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.98] ${
                      isDisabled
                        ? "border-red-100 bg-red-50 hover:border-red-200 hover:bg-red-100/70"
                        : "border-teal-100 bg-teal-50 hover:border-teal-200 hover:bg-teal-100/70"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-bold ${isDisabled ? "text-red-700 line-through opacity-70" : "text-teal-800"}`}
                      >
                        {getTime(slot.startDateTime)}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${isDisabled ? "text-red-500 opacity-70" : "text-teal-600"}`}
                      >
                        até {getTime(slot.endDateTime)}
                      </span>
                    </div>

                    <div
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        isDisabled ? "bg-red-300" : "bg-teal-500"
                      }`}
                    >
                      <span
                        className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isDisabled ? "translate-x-0" : "translate-x-5"
                        }`}
                      >
                        {isDisabled ? (
                          <X
                            size={12}
                            className="text-red-500"
                            strokeWidth={3}
                          />
                        ) : (
                          <Check
                            size={12}
                            className="text-teal-500"
                            strokeWidth={3}
                          />
                        )}
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
