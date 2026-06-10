"use client";

import { Column, DataTable } from "@/components/ui/DataTable";
import { SelectInput } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { useEffect, useState } from "react";

import { useUsers } from "../../hooks/useUsers";
import { UserListItem, UserStatus, UserStatusFilter } from "../../types/user";

const roleLabelMap: Record<string, string> = {
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

const formatRole = (role: string) => roleLabelMap[role] ?? role;
const formatStatus = (status: string) => statusLabelMap[status] ?? status;

const statusFilterOptions = [
  { value: "ENABLED", label: "Apenas Ativos" },
  { value: "DISABLED", label: "Apenas Inativos" },
];

function StatusBadge({ status }: { status: UserStatus }) {
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

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("");

  const { users, totalPages, isLoading } = useUsers(page, limit, {
    name: debouncedNameFilter,
    userStatus: statusFilter,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedNameFilter(nameFilter.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [nameFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as UserStatusFilter);
    setPage(1);
  };

  const handleEmailFilterChange = (value: string) => {
    setEmailFilter(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

  // frontend filter since the current backend only accepts name and userStatus in /users
  const filteredUsers = users.filter((user) => {
    const normalizedEmailFilter = emailFilter.toLowerCase();
    const normalizedRoleFilter = roleFilter.toLowerCase();
    const formattedRole = formatRole(user.role).toLowerCase();

    const matchesEmail = (user.email || "")
      .toLowerCase()
      .includes(normalizedEmailFilter);
    const matchesRole =
      formattedRole.includes(normalizedRoleFilter) ||
      (user.role || "").toLowerCase().includes(normalizedRoleFilter);

    return matchesEmail && matchesRole;
  });

  const columns: Column<UserListItem>[] = [
    {
      label: "Nome",
      width: "w-[360px]",
      renderFilter: () => (
        <SearchInput
          placeholder="Buscar por nome"
          value={nameFilter}
          onChange={setNameFilter}
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
          onChange={handleEmailFilterChange}
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
          onChange={handleRoleFilterChange}
        />
      ),
      renderCell: (user) => formatRole(user.role),
    },
    {
      label: "Status",
      width: "w-[190px]",
      renderFilter: () => (
        <SelectInput
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={statusFilterOptions}
          placeholder="Todos"
        />
      ),
      renderCell: (user) => <StatusBadge status={user.userStatus} />,
    },
  ];

  return (
    <DataTable
      title="Lista Geral de Usuários"
      isLoading={isLoading}
      data={filteredUsers}
      columns={columns}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalItems={filteredUsers.length}
      totalPages={totalPages}
      emptyMessage="Nenhum usuário encontrado."
    />
  );
}
