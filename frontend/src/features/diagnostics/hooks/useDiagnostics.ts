"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { diagnosticService } from "../services/diagnosticService";
import { Diagnostic, DiagnosticPayload } from "../types/diagnostic";

export function useDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiagnostics = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await diagnosticService.getAllDiagnostics(1, 100);
      setDiagnostics(response.items);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const getDiagnosticsById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await diagnosticService.getById(id);
      return response;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDiagnostic = useCallback(async (data: DiagnosticPayload) => {
    try {
      const diagnostic = await diagnosticService.createDiagnostic(data);
      toast.success("Diagnóstico criado com sucesso!");
      await fetchDiagnostics();
      return diagnostic;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return null;
    }
  }, [fetchDiagnostics]);

  const updateDiagnostic = useCallback(async (id: string, data: DiagnosticPayload) => {
    try {
      await diagnosticService.updateDiagnostic(id, data);
      toast.success("Diagnóstico atualizado com sucesso!");
      await fetchDiagnostics();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  }, [fetchDiagnostics]);

  const removeDiagnostic = useCallback(async (id: string) => {
    try {
      await diagnosticService.removeDiagnostic(id);
      toast.success("Diagnóstico removido com sucesso");
      await fetchDiagnostics();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  }, [fetchDiagnostics]);

  const orderedDiagnostics = useMemo(() => {
    return [...diagnostics].sort((a, b) => a.name.localeCompare(b.name));
  }, [diagnostics]);

  return {
    diagnostics: orderedDiagnostics,
    isLoading,
    fetchDiagnostics,
    getDiagnosticsById,
    createDiagnostic,
    updateDiagnostic,
    removeDiagnostic,
  };
}
