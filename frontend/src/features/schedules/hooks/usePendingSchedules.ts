"use client";

import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { scheduleManagementService } from "../services/scheduleManagementService";
import {
  ManagedSchedule,
  ManagedScheduleActionResult,
} from "../types/scheduleManagement";

export const usePendingSchedules = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [schedules, setSchedules] = useState<ManagedSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPendingSchedules = useCallback(async () => {
    if (!pedagogueId) {
      setSchedules([]);
      setError("Não foi possível identificar a pedagoga responsável.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSchedules(
        await scheduleManagementService.listPending(pedagogueId),
      );
    } catch (loadError) {
      setSchedules([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as solicitações pendentes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [pedagogueId]);

  useEffect(() => {
    loadPendingSchedules();
  }, [loadPendingSchedules]);

  const runAction = async (
    scheduleId: string,
    action: () => Promise<ManagedScheduleActionResult>,
  ) => {
    try {
      setProcessingId(scheduleId);
      setError("");
      const result = await action();
      setSchedules((current) =>
        current.filter((schedule) => schedule.id !== scheduleId),
      );
      return result;
    } finally {
      setProcessingId(null);
    }
  };

  const confirmSchedule = async (scheduleId: string) => {
    if (!pedagogueId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.confirm(scheduleId, pedagogueId),
    );
  };

  const rejectSchedule = async (
    scheduleId: string,
    justification: string,
  ) => {
    if (!pedagogueId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.reject(
        scheduleId,
        pedagogueId,
        justification,
      ),
    );
  };

  return {
    schedules,
    isLoading,
    processingId,
    error,
    confirmSchedule,
    rejectSchedule,
    reload: loadPendingSchedules,
  };
};
