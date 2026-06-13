import api from "@/services/api";
import {
  ManagedScheduling,
  ManagedSchedulingActionResult,
  ManagedSchedulingFilters,
} from "../types/schedulingManagement";
import { scheduleManagementMock } from "./schedulingManagementMock";

const shouldUseMocks =
  process.env.NEXT_PUBLIC_SCHEDULING_MANAGEMENT_MOCK !== "false";

export const scheduleManagementService = {
  async list(filters: ManagedSchedulingFilters): Promise<ManagedScheduling[]> {
    if (shouldUseMocks) {
      return scheduleManagementMock.list(filters);
    }

    const response = await api.get<{ items: ManagedScheduling[] }>(
      "/schedulings/appointments",
      {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate || undefined,
          status: filters.statuses.join(","),
        },
        fallbackMsg: "Não foi possível carregar os agendamentos.",
      },
    );

    return response.data.items;
  },

  async listPending(pedagogueId: string): Promise<ManagedScheduling[]> {
    if (shouldUseMocks) {
      return scheduleManagementMock.listPending(pedagogueId);
    }

    const response = await api.get<{ items: ManagedScheduling[] }>(
      "/schedulings/appointments/pending",
      {
        fallbackMsg: "Não foi possível carregar as solicitações pendentes.",
      },
    );

    return response.data.items;
  },

  async confirm(
    scheduleId: string,
    pedagogueId: string,
  ): Promise<ManagedSchedulingActionResult> {
    if (shouldUseMocks) {
      return scheduleManagementMock.confirm(scheduleId, pedagogueId);
    }

    const response = await api.patch<ManagedSchedulingActionResult>(
      `/schedulings/appointments/${scheduleId}/confirm`,
      undefined,
      {
        fallbackMsg: "Não foi possível confirmar o atendimento.",
      },
    );

    return response.data;
  },

  async reject(
    scheduleId: string,
    pedagogueId: string,
    justification: string,
  ): Promise<ManagedSchedulingActionResult> {
    if (shouldUseMocks) {
      return scheduleManagementMock.reject(
        scheduleId,
        pedagogueId,
        justification,
      );
    }

    const response = await api.patch<ManagedSchedulingActionResult>(
      `/schedulings/appointments/${scheduleId}/reject`,
      { justification },
      {
        fallbackMsg: "Não foi possível recusar o atendimento.",
      },
    );

    return response.data;
  },
};
