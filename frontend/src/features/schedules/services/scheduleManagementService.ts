import api from "@/services/api";
import {
  ManagedSchedule,
  ManagedScheduleActionResult,
  ManagedScheduleFilters,
} from "../types/scheduleManagement";
import { scheduleManagementMock } from "./scheduleManagementMock";

const shouldUseMocks =
  process.env.NEXT_PUBLIC_SCHEDULE_MANAGEMENT_MOCK !== "false";

export const scheduleManagementService = {
  async list(
    filters: ManagedScheduleFilters,
  ): Promise<ManagedSchedule[]> {
    if (shouldUseMocks) {
      return scheduleManagementMock.list(filters);
    }

    const response = await api.get<{ items: ManagedSchedule[] }>(
      "/schedules/appointments",
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

  async listPending(pedagogueId: string): Promise<ManagedSchedule[]> {
    if (shouldUseMocks) {
      return scheduleManagementMock.listPending(pedagogueId);
    }

    const response = await api.get<{ items: ManagedSchedule[] }>(
      "/schedules/appointments/pending",
      {
        fallbackMsg: "Não foi possível carregar as solicitações pendentes.",
      },
    );

    return response.data.items;
  },

  async confirm(
    scheduleId: string,
    pedagogueId: string,
  ): Promise<ManagedScheduleActionResult> {
    if (shouldUseMocks) {
      return scheduleManagementMock.confirm(scheduleId, pedagogueId);
    }

    const response = await api.patch<ManagedScheduleActionResult>(
      `/schedules/appointments/${scheduleId}/confirm`,
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
  ): Promise<ManagedScheduleActionResult> {
    if (shouldUseMocks) {
      return scheduleManagementMock.reject(
        scheduleId,
        pedagogueId,
        justification,
      );
    }

    const response = await api.patch<ManagedScheduleActionResult>(
      `/schedules/appointments/${scheduleId}/reject`,
      { justification },
      {
        fallbackMsg: "Não foi possível recusar o atendimento.",
      },
    );

    return response.data;
  },
};
