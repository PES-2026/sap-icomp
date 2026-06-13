"use client";

import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useState } from "react";
import { scheduleManagementService } from "../services/schedulingManagementService";
import {
  ManagedScheduling,
  ManagedSchedulingActionResult,
} from "../types/schedulingManagement";

export const usePendingSchedulings = () => {
  const pedagogueId = useAuthStore((state) => state.user?.id);
  const [schedulings, setSchedulings] = useState<ManagedScheduling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPendingSchedulings = useCallback(async () => {
    if (!pedagogueId) {
      setSchedulings([]);
      setError("Não foi possível identificar a pedagoga responsável.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSchedulings(await scheduleManagementService.listPending(pedagogueId));
    } catch (loadError) {
      setSchedulings([]);
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

  const confirmScheduling = async (scheduleId: string) => {
    if (!pedagogueId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.confirm(scheduleId, pedagogueId),
    );
  };

  const rejectScheduling = async (
    scheduleId: string,
    justification: string,
  ) => {
    if (!pedagogueId) {
      throw new Error("Não foi possível identificar a pedagoga responsável.");
    }

    return runAction(scheduleId, () =>
      scheduleManagementService.reject(scheduleId, pedagogueId, justification),
    );
  };

  return {
    schedulings,
    isLoading,
    processingId,
    error,
    confirmScheduling,
    rejectScheduling,
    reload: loadPendingSchedulings,
  };
};
