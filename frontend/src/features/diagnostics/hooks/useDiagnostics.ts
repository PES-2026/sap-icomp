"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { diagnosticService } from "../services/diagnosticService";
import { Diagnostic } from "../types/diagnostic";

export function useDiagnostics(searchTerm: string) {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchDiagnostics() {
      setIsLoading(true);

      try {
        const response = await diagnosticService.getDiagnostic({
          page,
          limit,
          name: debouncedSearch || undefined,
        });

        setDiagnostics(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDiagnostics();
  }, [page, limit, debouncedSearch]);

  const orderedDiagnostics = useMemo(() => {
    return [...diagnostics].sort((a, b) => a.name.localeCompare(b.name));
  }, [diagnostics]);

  return {
    diagnostics: orderedDiagnostics,
    isLoading,
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    totalPages,
  };
}
