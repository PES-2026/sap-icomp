import { Check, Loader2, X } from "lucide-react";

import { Column } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";

import { PendingAccountRequestItem } from "../../types/user";
import { StatusBadge } from "./UserTable";

export type PendingRequestAction = "approve" | "reject";

export function getPendingRequestsColumns({
  nameFilter,
  onNameFilterChange,
  emailFilter,
  onEmailFilterChange,
  onApprove,
  onReject,
  processingAction,
}: {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  emailFilter: string;
  onEmailFilterChange: (value: string) => void;
  onApprove: (id: string, role?: string) => void;
  onReject: (id: string) => void;
  processingAction: { id: string; action: PendingRequestAction } | null;
}): Column<PendingAccountRequestItem>[] {
  return [
    {
      label: "Nome",
      width: "w-[280px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por nome"
          value={nameFilter}
          onChange={onNameFilterChange}
        />
      ),
      renderCell: (request) => (
        <span className="font-medium text-[#3a3530]">{request.name}</span>
      ),
    },
    {
      label: "E-mail",
      width: "w-[260px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por e-mail"
          value={emailFilter}
          onChange={onEmailFilterChange}
        />
      ),
      renderCell: (request) => request.email,
    },
    // {
    //   label: "Cargo Solicitado",
    //   width: "w-[180px]",
    //   renderCell: (request) => formatRole(request.role),
    // },
    {
      label: "Status",
      width: "w-[150px]",
      renderCell: (request) => <StatusBadge status={request.userStatus} />,
    },
    {
      label: "Ações",
      width: "w-[220px]",
      renderCell: (request) => {
        const isApproving =
          processingAction?.id === request.id &&
          processingAction.action === "approve";
        const isRejecting =
          processingAction?.id === request.id &&
          processingAction.action === "reject";
        const isProcessing = isApproving || isRejecting;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onApprove(request.id, request.role)}
              disabled={isProcessing}
              className="flex cursor-pointer h-8 min-w-24 items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              title="Aprovar"
            >
              {isApproving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isApproving ? "Aprovando" : "Aprovar"}
            </button>
            <button
              onClick={() => onReject(request.id)}
              disabled={isProcessing}
              className="flex cursor-pointer h-8 min-w-24 items-center justify-center gap-1.5 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              title="Reprovar"
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {isRejecting ? "Reprovando" : "Reprovar"}
            </button>
          </div>
        );
      },
    },
  ];
}
