"use client";

import { ApiError } from "@/services/apiError";
import { useCallback, useEffect, useState } from "react";
import { reportService } from "../services/reportService";
import { InterventionReport } from "../types/report";

export const useReportById = (reportId: string) => {
  const [report, setReport] = useState<InterventionReport>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError>();

  const fetchReport = useCallback(async () => {
    if (!reportId) return;

    try {
      setIsLoading(true);
      setError(undefined);
      setReport(await reportService.getById(reportId));
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
  }, [reportId]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  return { report, isLoading, error, fetchReport };
};
