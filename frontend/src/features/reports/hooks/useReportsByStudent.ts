"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { reportService } from "../services/reportService";
import { ReportSummary } from "../types/report";

export const useReportsByStudent = (studentId: string) => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    if (!studentId) {
      setIsLoading(false);
      return;
    }

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
  }, [fetchReports]);

  return { reports, isLoading, fetchReports };
};
