"use client";

import { ApiError } from "@/services/apiError";
import { useCallback, useEffect, useState } from "react";
import { reportService } from "../services/reportService";
import { ReportDetailsResponse } from "../types/report";

export const useReportById = (studentId: string, reportId: string) => {
  const [report, setReport] = useState<ReportDetailsResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError>();

  const fetchReport = useCallback(async () => {
    if (!studentId || !reportId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      setReport(await reportService.getById(studentId, reportId));
    } catch (caughtError) {
      setReport(undefined);
      setError(
        caughtError instanceof ApiError
          ? caughtError
          : new ApiError(
              caughtError instanceof Error
                ? caughtError.message
                : "Não foi possível carregar o relatório.",
            ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [reportId, studentId]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  return { report, isLoading, error, fetchReport };
};
