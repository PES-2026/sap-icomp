"use client";

import { Column, DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState } from "react";

import { useUsers } from "../../hooks/useUsers";
import { UserListItem, UserStatus } from "../../types/user";

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

  const { users, isLoading } = useUsers(page, limit);

  const filteredUsers = users.filter((user) => {
    const matchesName = (user.name || "")
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesEmail = (user.email || "")
      .toLowerCase()
      .includes(emailFilter.toLowerCase());

    return matchesName && matchesEmail;
  });

  const columns: Column<UserListItem>[] = [
    {
      label: "Nome",
      width: "w-[360px]",
      renderFilter: () => (
        <SearchInput value={nameFilter} onChange={setNameFilter} />
      ),
      renderCell: (user) => (
        <span className="font-medium text-[#3a3530]">{user.name}</span>
      ),
    },
    {
      label: "E-mail",
      width: "w-[320px]",
      renderFilter: () => (
        <SearchInput value={emailFilter} onChange={setEmailFilter} />
      ),
      renderCell: (user) => user.email,
    },
    {
      label: "Perfil/Cargo",
      width: "w-[180px]",
      renderCell: (user) => formatRole(user.role),
    },
    {
      label: "Status",
      width: "w-[140px]",
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
      totalItems={users.length}
      emptyMessage="Nenhum usuário encontrado."
    />
  );
}
