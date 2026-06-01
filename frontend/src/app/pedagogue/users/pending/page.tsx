"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { getUserTableColumns } from "@/features/users/components/table/userTableColumns";
import { usePendingAccountRequests } from "@/features/users/hooks/usePendingAccountRequests";
import {
  PendingAccountRequestItem,
  UserStatusFilter,
} from "@/features/users/types/user";

export default function PendingUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("");

  const { requests, isLoading } = usePendingAccountRequests();

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
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

  const filteredRequests = useMemo(() => {
    const normalizedName = nameFilter.toLowerCase().trim();
    const normalizedEmail = emailFilter.toLowerCase().trim();
    const normalizedRole = roleFilter.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesName = request.name.toLowerCase().includes(normalizedName);
      const matchesEmail = request.email
        .toLowerCase()
        .includes(normalizedEmail);
      const formattedRole = request.role?.toLowerCase() ?? "";
      const matchesRole =
        formattedRole.includes(normalizedRole) ||
        request.role?.toLowerCase().includes(normalizedRole);

      return matchesName && matchesEmail && matchesRole;
    });
  }, [requests, nameFilter, emailFilter, roleFilter]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const paginatedRequests = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredRequests.slice(startIndex, startIndex + limit);
  }, [filteredRequests, page, limit]);

  const columns = getUserTableColumns<PendingAccountRequestItem>({
    nameFilter,
    onNameFilterChange: handleNameFilterChange,
    emailFilter,
    onEmailFilterChange: handleEmailFilterChange,
    roleFilter,
    onRoleFilterChange: handleRoleFilterChange,
    statusFilter,
    onStatusFilterChange: (value: string) =>
      setStatusFilter(value as UserStatusFilter),
    statusFilterOptions: [],
  });

  return (
    <DataTable
      title="Solicitações Pendentes"
      isLoading={isLoading}
      data={paginatedRequests}
      columns={columns}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalItems={totalItems}
      totalPages={totalPages}
      emptyMessage="Nenhuma solicitação pendente encontrada."
    />
  );
}
