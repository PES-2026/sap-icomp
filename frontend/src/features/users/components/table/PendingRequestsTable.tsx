"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";

import { useApproveAccountRequest } from "../../hooks/useApproveAccountRequest";
import { usePendingAccountRequests } from "../../hooks/usePendingAccountRequests";
import {
  getPendingRequestsColumns,
  PendingRequestAction,
} from "./PendingRequestsColumns";

export default function PendingRequestsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");
  const [processingAction, setProcessingAction] = useState<{
    id: string;
    action: PendingRequestAction;
  } | null>(null);

  const { requests, isLoading, removeRequest } = usePendingAccountRequests();
  const { approveRequest } = useApproveAccountRequest();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedNameFilter(nameFilter.trim().toLowerCase());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [nameFilter]);

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
  };

  const handleEmailFilterChange = (value: string) => {
    setEmailFilter(value);
    setPage(1);
  };

  const filteredRequests = useMemo(() => {
    const normalizedEmailFilter = emailFilter.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesName = request.name
        .toLowerCase()
        .includes(debouncedNameFilter);
      const matchesEmail = request.email
        .toLowerCase()
        .includes(normalizedEmailFilter);

      return matchesName && matchesEmail;
    });
  }, [requests, debouncedNameFilter, emailFilter]);

  const totalItems = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const adjustPageAfterRemoval = () => {
    setPage((currentPage) => {
      const remainingItems = Math.max(totalItems - 1, 0);
      const nextTotalPages = Math.max(1, Math.ceil(remainingItems / limit));

      return Math.min(currentPage, nextTotalPages);
    });
  };

  const handleApprove = async (id: string, role?: string) => {
    setProcessingAction({ id, action: "approve" });

    const wasApproved = await approveRequest(id, true, role || "PROFESSOR");

    if (wasApproved) {
      removeRequest(id);
      adjustPageAfterRemoval();
    }

    setProcessingAction(null);
  };

  const handleReject = async (id: string) => {
    setProcessingAction({ id, action: "reject" });

    const wasRejected = await approveRequest(id, false);

    if (wasRejected) {
      removeRequest(id);
      adjustPageAfterRemoval();
    }

    setProcessingAction(null);
  };

  const paginatedRequests = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredRequests.slice(startIndex, startIndex + limit);
  }, [filteredRequests, page, limit]);

  const columns = getPendingRequestsColumns({
    nameFilter,
    onNameFilterChange: handleNameFilterChange,
    emailFilter,
    onEmailFilterChange: handleEmailFilterChange,
    onApprove: handleApprove,
    onReject: handleReject,
    processingAction,
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
