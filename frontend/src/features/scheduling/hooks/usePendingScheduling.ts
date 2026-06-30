"use client";

import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { scheduleManagementService } from "../services/schedulingManagementService";
import {
  ManagedSchedulingActionResult,
  ScheduleItem,
} from "../types/schedulingManagement";

export const usePendingSchedulings = (page: number, limit: number) => {
  const userId = useAuthStore((state) => state.user?.id);
  const [schedulings, setSchedulings] = useState<ScheduleItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPendingSchedulings = useCallback(async () => {
    if (!userId) {
      setSchedulings([]);
      setTotalItems(0);
      setError("Não foi possível identificar a pedagoga responsável.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await scheduleManagementService.listPending(
        userId,
        page,
        limit,
      );
      setSchedulings(response.items);
      setTotalItems(response.totalItems);
    } catch (loadError) {
      setSchedulings([]);
      setTotalItems(0);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as solicitações pendentes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, limit]);

  useEffect(() => {
    loadPendingSchedulings();
  }, [loadPendingSchedulings]);

  const runAction = async (
    scheduleId: string,
    action: () => Promise<ManagedSchedulingActionResult>,
  ) => {
    try {
      setProcessingId(scheduleId);
      setError("");
      const result = await action();
      setSchedulings((current) =>
        current.filter((scheduling) => scheduling.id !== scheduleId),
      );
      return result;
    } finally {
      setProcessingId(null);
    }
  };

  const confirmScheduling = async (scheduleId: string, type: string) => {
    if (!userId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.confirm(scheduleId, type),
    );
  };

  const rejectScheduling = async (
    scheduleId: string,
    justification: string,
  ) => {
    if (!userId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.reject(scheduleId, justification),
    );
  };

  return {
    schedulings,
    totalItems,
    isLoading,
    processingId,
    error,
    confirmScheduling,
    rejectScheduling,
    reload: loadPendingSchedulings,
  };
};
