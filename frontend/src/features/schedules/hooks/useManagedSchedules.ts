"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { scheduleManagementService } from "../services/scheduleManagementService";
import {
  ManagedSchedule,
  ManagedScheduleFilters,
} from "../types/scheduleManagement";
import { getPeriodDates } from "../utils/scheduleDates";

const defaultDates = getPeriodDates("UPCOMING");

const defaultFilters: ManagedScheduleFilters = {
  startDate: defaultDates.startDate,
  statuses: ["PENDING", "CONFIRMED"],
};

export const useManagedSchedules = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [schedules, setSchedules] = useState<ManagedSchedule[]>([]);
  const [filters, setFilters] =
    useState<ManagedScheduleFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setSchedules(
        await scheduleManagementService.list({
          ...filters,
          pedagogueId,
        }),
      );
    } catch (loadError) {
      setSchedules([]);
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
    loadSchedules();
  }, [loadSchedules]);

  return {
    schedules,
    filters,
    isLoading,
    error,
    setFilters,
    reload: loadSchedules,
  };
};
