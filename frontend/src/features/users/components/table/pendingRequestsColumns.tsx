import { Check, X } from "lucide-react";

import { Column } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";

import { PendingAccountRequestItem } from "../../types/user";
import { StatusBadge } from "./UserTable";

export function getPendingRequestsColumns({
  nameFilter,
  onNameFilterChange,
  emailFilter,
  onEmailFilterChange,
  onApprove,
  onReject,
  isProcessingId,
}: {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  emailFilter: string;
  onEmailFilterChange: (value: string) => void;
  onApprove: (id: string, role?: string) => void;
  onReject: (id: string) => void;
  isProcessingId: string | null;
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
      width: "w-[160px]",
      renderCell: (request) => {
        const isProcessing = isProcessingId === request.id;

        return (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={() => onApprove(request.id, request.role)}
              disabled={isProcessing}
              className="flex h-8 items-center justify-center gap-1 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
              title="Aprovar"
            >
              <Check className="h-4 w-4" />
              Aprovar
            </button>
            <button
              onClick={() => onReject(request.id)}
              disabled={isProcessing}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
              title="Rejeitar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];
}
