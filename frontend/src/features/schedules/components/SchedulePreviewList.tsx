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
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-[#ece7db] bg-white px-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dff3ec] text-[#52b594]">
          <CalendarDays size={28} />
        </div>
        <h3 className="font-bold text-stone-700">Nenhuma prévia gerada</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
          Informe o período e os horários para visualizar a disponibilidade
          organizada por dia.
        </p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-[#ece7db] bg-white px-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <Clock3 className="mb-4 text-amber-600" size={30} />
        <h3 className="font-bold text-amber-800">
          Nenhum horário disponível
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-amber-700">
          A duração informada não cabe completamente no intervalo de
          atendimento.
        </p>
      </div>
    );
  }

  return (
    <div className="custom-scroll overflow-x-auto pb-3">
      <div className="flex min-w-max gap-3">
        {previewDays.map((date) => (
          <article
            key={date}
            className="w-55 overflow-hidden rounded-2xl border border-[#ece7db] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <header className="border-b border-[#ece7db] bg-[#faf7f0] px-3 py-3 text-center">
              <h3 className="text-sm font-bold text-stone-700">
                {formatDateLabel(date)} ({formatWeekday(date)})
              </h3>
            </header>

            <div>
              {groupedSlots[date].map((slot) => {
                const slotId = slot.startDateTime;
                const isDisabled = disabledSlotIds.has(slotId);

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onToggleSlot(slotId)}
                    aria-pressed={!isDisabled}
                    aria-label={`${isDisabled ? "Ativar" : "Desativar"} horário de ${getTime(slot.startDateTime)} às ${getTime(slot.endDateTime)}`}
                    className={`flex w-full cursor-pointer items-center justify-between border-b border-[#f7f1e6] px-4 py-4 text-left transition-colors last:border-b-0 ${
                      isDisabled
                        ? "bg-[#ffae99] hover:bg-[#f6a18c]"
                        : "bg-[#8fd3bd] hover:bg-[#7bc8af]"
                    }`}
                  >
                    <span className="flex flex-col text-stone-700">
                      <strong className="text-base font-semibold">
                        {getTime(slot.startDateTime)}
                      </strong>
                      <span className="text-[11px] opacity-70">
                        até {getTime(slot.endDateTime)}
                      </span>
                    </span>

                    <span
                      className={`flex h-7 w-13 items-center rounded-full px-1 transition-all ${
                        isDisabled
                          ? "justify-end bg-[#ff947c]"
                          : "justify-start bg-[#65c8aa]"
                      }`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/45 text-stone-700">
                        {isDisabled ? <X size={15} /> : <Check size={15} />}
                      </span>
                    </span>
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
