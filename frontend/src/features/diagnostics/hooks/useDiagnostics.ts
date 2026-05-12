"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { diagnosticService } from "../services/diagnosticService";
import { Diagnostic, DiagnosticPayload } from "../types/diagnostic";

export function useDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiagnostics = async () => {
    setIsLoading(true);

    try {
      const response = await diagnosticService.getDiagnostics(1, 100);
      setDiagnostics(response.items);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const createDiagnostic = async (data: DiagnosticPayload) => {
    try {
      const diagnostic = await diagnosticService.createDiagnostic(data);
      toast.success("Diagnóstico criado com sucesso!");
      await fetchDiagnostics();
      return diagnostic;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return null;
    }
  };

  const updateDiagnostic = async (id: string, data: DiagnosticPayload) => {
    try {
      await diagnosticService.updateDiagnostic(id, data);
      toast.success("Diagnóstico atualizado com sucesso!");
      await fetchDiagnostics();
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };

  const orderedDiagnostics = useMemo(() => {
    return [...diagnostics].sort((a, b) => a.name.localeCompare(b.name));
  }, [diagnostics]);

  return {
    diagnostics: orderedDiagnostics,
    isLoading,
    fetchDiagnostics,
    createDiagnostic,
    updateDiagnostic,
  };
}
