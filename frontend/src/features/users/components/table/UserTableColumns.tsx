"use client";

import { Column } from "@/components/ui/DataTable";
import { SelectInput } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";

import { UserRole, UserStatus, UserStatusFilter } from "../../types/user";

const roleLabelMap: Record<UserRole, string> = {
  PEDAGOGUE: "Pedagoga",
  PROFESSOR: "Professor",
};

const statusLabelMap: Record<string, string> = {
  ENABLED: "Ativo",
  APPROVED: "Ativo",
  DISABLED: "Inativo",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
};

export const formatStatus = (status: string) =>
  statusLabelMap[status] ?? status;

export const formatRole = (role?: UserRole) =>
  role ? roleLabelMap[role] : "";

export function StatusBadge({ status }: { status: UserStatus }) {
  const isActive = status === "ENABLED" || status === "APPROVED";
  const isInactive = status === "DISABLED";

  const colorClass = isActive
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isInactive
      ? "bg-stone-100 text-stone-600 border-stone-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span
      className={`inline-flex min-w-20 justify-center rounded-md border px-2.5 py-1 text-xs font-semibold ${colorClass}`}
    >
      {formatStatus(status)}
    </span>
  );
}

type UserTableBaseItem = {
  name: string;
  email: string;
  role?: UserRole;
  userStatus: UserStatus;
};

export function getUserTableColumns<T extends UserTableBaseItem>({
  nameFilter,
  onNameFilterChange,
  emailFilter,
  onEmailFilterChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  statusFilterOptions,
}: {
  nameFilter: string;
  onNameFilterChange: (value: string) => void;
  emailFilter: string;
  onEmailFilterChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: UserStatusFilter;
  onStatusFilterChange: (value: string) => void;
  statusFilterOptions?: { value: string; label: string }[];
}): Column<T>[] {
  return [
    {
      label: "Nome",
      width: "w-[360px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por nome"
          value={nameFilter}
          onChange={onNameFilterChange}
        />
      ),
      renderCell: (user) => (
        <span className="font-medium text-[#3a3530]">{user.name}</span>
      ),
    },
    {
      label: "E-mail",
      width: "w-[320px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por e-mail"
          value={emailFilter}
          onChange={onEmailFilterChange}
        />
      ),
      renderCell: (user) => user.email,
    },
    {
      label: "Cargo",
      width: "w-[180px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por cargo"
          value={roleFilter}
          onChange={onRoleFilterChange}
        />
      ),
      renderCell: (user) => formatRole(user.role),
    },
    {
      label: "Status",
      width: "w-[190px]",
      renderFilter: () =>
        statusFilterOptions && statusFilterOptions.length > 0 ? (
          <SelectInput
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusFilterOptions}
            placeholder="Todos"
          />
        ) : null,
      renderCell: (user) => <StatusBadge status={user.userStatus} />,
    },
  ];
}
