import { CalendarX2 } from "lucide-react";

export default function SchedulingEmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
        <CalendarX2 size={30} strokeWidth={1.7} />
      </div>
      <h3 className="text-base font-semibold text-[#3a3530]">
        Nenhum agendamento confirmado para este período.
      </h3>
      <p className="mt-2 max-w-md text-sm text-stone-500">
        Selecione outro intervalo de datas para consultar os agendamentos.
      </p>
    </div>
  );
}
