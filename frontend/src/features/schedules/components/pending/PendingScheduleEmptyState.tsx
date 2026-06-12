import { CalendarCheck2 } from "lucide-react";

export default function PendingScheduleEmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CalendarCheck2 size={30} strokeWidth={1.7} />
      </div>
      <h3 className="text-base font-semibold text-[#3a3530]">
        Nenhuma solicitação pendente.
      </h3>
      <p className="mt-2 max-w-md text-sm text-stone-500">
        Todas as solicitações recebidas já foram analisadas.
      </p>
    </div>
  );
}
