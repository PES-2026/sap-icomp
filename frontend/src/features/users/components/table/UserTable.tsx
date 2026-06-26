"use client";

import { Column, DataTable } from "@/components/ui/DataTable";
import { useEffect, useState } from "react";

import CommonButton from "@/components/ui/CommonButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SelectInput } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { UserListItem, UserStatus, UserStatusFilter } from "../../types/user";
import { formatRole, formatStatus } from "./UserTableColumns";

const statusFilterOptions = [
  { value: "ENABLED", label: "Ativos" },
  { value: "DISABLED", label: "Inativos" },
];

export function StatusBadge({ status }: { status: UserStatus }) {
  const isActive = status === "ENABLED" || status === "APPROVED";
  const isInactive = status === "DISABLED";

  const colorClass = isActive
    ? "bg-emerald-100 text-emerald-700"
    : isInactive
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`inline-flex justify-center rounded-lg px-3 py-1 text-xs font-semibold ${colorClass}`}
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

  const [showDisableUser, setShowDisableUser] = useState<boolean>(false);
  const [showEnableUser, setShowEnableUser] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem>(
    {} as UserListItem,
  );

  const { users, totalPages, isLoading, removeUser, activateUser } = useUsers(
    page,
    limit,
    {
      name: debouncedNameFilter,
      userStatus: statusFilter,
    },
  );

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

  const handleDisableUser = () => {
    removeUser(selectedUser.id);
    setShowDisableUser(false);
  };

  const handleEnableUser = () => {
    if (activateUser) {
      activateUser(selectedUser.id);
    }
    setShowEnableUser(false);
  };

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
    {
      label: "",
      width: "w-[70px]",
      renderCell: (user) => {
        const isDisabled = user.userStatus === "DISABLED";

        return (
          <div className="flex justify-center gap-0.5">
            {isDisabled ? (
              <CommonButton
                label=""
                aria-label="Ativar usuário"
                title="Ativar usuário"
                onClick={() => {
                  setSelectedUser(user);
                  setShowEnableUser(true);
                }}
                className="flex items-center rounded-lg bg-transparent border-0 hover:bg-emerald-100 text-emerald-500 p-1 gap-0"
                sizeIcon={20}
                startIcon={UserRoundCheck}
              />
            ) : (
              <CommonButton
                label=""
                aria-label="Desativar usuário"
                title="Desativar usuário"
                onClick={() => {
                  setSelectedUser(user);
                  setShowDisableUser(true);
                }}
                className="flex items-center rounded-lg bg-transparent border-0 hover:bg-red-100 text-red-500 p-1 gap-0"
                sizeIcon={20}
                startIcon={UserRoundX}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
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

      <ConfirmModal
        open={showDisableUser}
        title={"Inativar Usuário"}
        message={`Tem certeza que deseja inativar ${selectedUser.name}? O usuário não aparecerá mais na listagem ativa.`}
        confirmLabel="Inativar"
        confirmColor="critical"
        onConfirm={handleDisableUser}
        onCancel={() => setShowDisableUser(false)}
      />

      <ConfirmModal
        open={showEnableUser}
        title={"Ativar Usuário"}
        message={`Tem certeza que deseja ativar ${selectedUser.name}? O usuário voltará a ter acesso ao sistema.`}
        confirmLabel="Ativar"
        confirmColor="primary"
        onConfirm={handleEnableUser}
        onCancel={() => setShowEnableUser(false)}
      />
    </>
  );
}
