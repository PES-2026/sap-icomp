"use client";

import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { scheduleManagementService } from "../services/schedulingManagementService";
import {
  ListScheduleFilters,
  ScheduleItem,
  ScheduleStatusEnum,
} from "../types/schedulingManagement";
import { getPeriodDates } from "../utils/schedulingDates";

const defaultDates = getPeriodDates("TODAY");

const defaultFilters: ListScheduleFilters = {
  startDate: defaultDates.startDate,
  status: ScheduleStatusEnum.CONFIRMED,
};

export const useManagedSchedulings = (page: number, limit: number) => {
  const userId = useAuthStore((state) => state.user?.id);
  const [schedulings, setSchedulings] = useState<ScheduleItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFiltersInternal] =
    useState<ListScheduleFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setFilters = useCallback((newFilters: ListScheduleFilters) => {
    setFiltersInternal((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) {
        return prev;
      }
      return newFilters;
    });
  }, []);

  const loadSchedulings = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError("");
      const response = await scheduleManagementService.list(
        userId,
        page,
        limit,
        filters,
      );
      setSchedulings(response.items);
      setTotalItems(response.totalItems);
    } catch (loadError) {
      setSchedulings([]);
      setTotalItems(0);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar os agendamentos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters, userId, page, limit]);

  const cancelScheduling = async (id: string, justification: string) => {
    if (!userId) throw new Error("Usuário não autenticado.");

    try {
      setProcessingId(id);
      const result = await scheduleManagementService.cancel(id, justification);
      await loadSchedulings();
      return result;
    } finally {
      setProcessingId(null);
    }
  };

  const finishScheduling = async (id: string) => {
    if (!userId) throw new Error("Usuário não autenticado.");

    try {
      setProcessingId(id);
      const result = await scheduleManagementService.finish(id);
      await loadSchedulings();
      return result;
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    loadSchedulings();
  }, [loadSchedulings]);

  return {
    schedulings,
    totalItems,
    filters,
    isLoading,
    processingId,
    error,
    setFilters,
    cancelScheduling,
    finishScheduling,
    reload: loadSchedulings,
  };
};
