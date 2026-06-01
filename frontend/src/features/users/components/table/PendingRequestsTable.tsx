"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";

import { useApproveAccountRequest } from "../../hooks/useApproveAccountRequest";
import { usePendingAccountRequests } from "../../hooks/usePendingAccountRequests";
import { getPendingRequestsColumns } from "./pendingRequestsColumns";

export default function PendingRequestsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [debouncedNameFilter, setDebouncedNameFilter] = useState("");
  
  // Track which request is currently being processed
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { requests, isLoading: isLoadingRequests, fetchPendingRequests } = usePendingAccountRequests();
  const { approveRequest } = useApproveAccountRequest({
    onSuccess: () => {
      fetchPendingRequests();
      setProcessingId(null);
    },
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedNameFilter(nameFilter.trim().toLowerCase());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [nameFilter]);

  const handleEmailFilterChange = (value: string) => {
    setEmailFilter(value);
    setPage(1);
  };

  const handleApprove = async (id: string, role?: string) => {
    setProcessingId(id);
    await approveRequest(id, true, role || "PROFESSOR");
  };

  const handleReject = async (id: string) => {
    // Adding confirmation for rejection would be ideal, but keeping it simple for now
    if (window.confirm("Tem certeza que deseja rejeitar esta solicitação?")) {
      setProcessingId(id);
      await approveRequest(id, false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const normalizedEmailFilter = emailFilter.toLowerCase();

    const matchesName = (request.name || "")
      .toLowerCase()
      .includes(debouncedNameFilter);
      
    const matchesEmail = (request.email || "")
      .toLowerCase()
      .includes(normalizedEmailFilter);

    return matchesName && matchesEmail;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredRequests.length / limit) || 1;

  const columns = getPendingRequestsColumns({
    nameFilter,
    onNameFilterChange: setNameFilter,
    emailFilter,
    onEmailFilterChange: handleEmailFilterChange,
    onApprove: handleApprove,
    onReject: handleReject,
    isProcessingId: processingId,
  });

  return (
    <DataTable
      title="Solicitações de Acesso Pendentes"
      isLoading={isLoadingRequests}
      data={paginatedRequests}
      columns={columns}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalItems={filteredRequests.length}
      totalPages={totalPages}
      emptyMessage="Nenhuma solicitação pendente no momento."
    />
  );
}
