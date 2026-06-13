import { ManagedSchedulingStatus } from "../../types/schedulingManagement";

const statusConfig: Record<
  ManagedSchedulingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700",
  },
  APPROVED: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
  },
};

export default function SchedulingStatusBadge({
  status,
}: {
  status: ManagedSchedulingStatus;
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
