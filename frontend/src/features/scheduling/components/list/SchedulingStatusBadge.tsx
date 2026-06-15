import { ScheduleStatusEnum } from "../../types/schedulingManagement";

const statusConfig: Record<
  ScheduleStatusEnum,
  { label: string; className: string }
> = {
  [ScheduleStatusEnum.PENDING]: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700",
  },
  [ScheduleStatusEnum.CONFIRMED]: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700",
  },
  [ScheduleStatusEnum.DONE]: {
    label: "Finalizado",
    className: "bg-stone-100 text-stone-700",
  },
  [ScheduleStatusEnum.CANCELED]: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
  },
  [ScheduleStatusEnum.ABSENT]: {
    label: "Ausente",
    className: "bg-stone-100 text-stone-500",
  },
};

export default function SchedulingStatusBadge({
  status,
}: {
  status: ScheduleStatusEnum;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex justify-center rounded-lg px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
