"use client";

import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { scheduleManagementService } from "../services/schedulingManagementService";
import {
  ManagedScheduling,
  ManagedSchedulingFilters,
} from "../types/schedulingManagement";
import { getPeriodDates } from "../utils/schedulingDates";

const defaultDates = getPeriodDates("UPCOMING");

const defaultFilters: ManagedSchedulingFilters = {
  startDate: defaultDates.startDate,
  statuses: ["PENDING", "APPROVED"],
};

export const useManagedSchedulings = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [schedulings, setSchedulings] = useState<ManagedScheduling[]>([]);
  const [filters, setFilters] =
    useState<ManagedSchedulingFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchedulings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setSchedulings(
        await scheduleManagementService.list({
          ...filters,
          pedagogueId,
        }),
      );
    } catch (loadError) {
      setSchedulings([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar os agendamentos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, pedagogueId]);

  useEffect(() => {
    loadSchedulings();
  }, [loadSchedulings]);

  return {
    schedulings,
    filters,
    isLoading,
    error,
    setFilters,
    reload: loadSchedulings,
  };
};
