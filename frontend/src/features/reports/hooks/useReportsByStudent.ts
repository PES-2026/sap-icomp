"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { reportService } from "../services/reportService";
import { REPORTS_CHANGED_EVENT } from "../services/reportMockService";
import { InterventionReport } from "../types/report";

export const useReportsByStudent = (studentId: string) => {
  const [reports, setReports] = useState<InterventionReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    if (!studentId) return;

    try {
      setIsLoading(true);
      setReports(await reportService.listByStudent(studentId));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os relatórios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void fetchReports();

    const refresh = () => void fetchReports();
    window.addEventListener(REPORTS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(REPORTS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [fetchReports]);

  return { reports, isLoading, fetchReports };
};
