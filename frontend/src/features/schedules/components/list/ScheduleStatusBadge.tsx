import { ManagedScheduleStatus } from "../../types/scheduleManagement";

const statusConfig: Record<
  ManagedScheduleStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
  },
  REJECTED: {
    label: "Recusado",
    className: "bg-red-100 text-red-700",
  },
};

export default function ScheduleStatusBadge({
  status,
}: {
  status: ManagedScheduleStatus;
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
