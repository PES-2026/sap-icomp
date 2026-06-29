import {
  TimeSlot,
  TimeSlotResponse,
} from "@/features/appointments/types/appointment";
import api from "@/services/api";
import {
  RequestSchedulePayload,
  SchedulingPreviewPayload,
  SchedulingPreviewResponse,
  SchedulingSavePayload,
} from "../types/scheduling";

export const scheduleService = {
  async preview(
    payload: SchedulingPreviewPayload,
  ): Promise<SchedulingPreviewResponse> {
    const response = await api.post<SchedulingPreviewResponse>(
      "/availabilities/preview",
      payload,
      {
        fallbackMsg: "Não foi possível gerar a prévia da agenda.",
      },
    );

    return response.data;
  },

  async save(payload: SchedulingSavePayload): Promise<void> {
    await api.post("/availabilities", payload, {
      fallbackMsg: "Não foi possível salvar a agenda.",
    });
  },

  async removeSlots(ids: string[]): Promise<void> {
    await api.put("/availabilities/remove-many", ids, {
      fallbackMsg: "Não foi possível remover os horários.",
    });
  },

  async request(payload: RequestSchedulePayload): Promise<void> {
    await api.post("/appointments/request", payload, {
      fallbackMsg: "Não foi possível solicitar o atendimento.",
    });
  },

  async getAvailableSlots(
    date: string,
    pedagogueId: string,
  ): Promise<TimeSlot[]> {
    const response = await api.get<any[]>(
      `/availabilities/pedagogue/${pedagogueId}`,
      {
        params: { startDate: date, endDate: date },
        fallbackMsg: "Não foi possível carregar os horários disponíveis.",
      },
    );

    return response.data;
  },

  async getAvailability(
    pedagogueId: string,
    date: string,
    page: number = 1,
    limit: number = 100,
  ): Promise<TimeSlotResponse> {
    const response = await api.get<TimeSlotResponse>(
      `/availabilities/pedagogue/${pedagogueId}`,
      {
        params: {
          page,
          limit,
          startDate: `${date}T00:00:00.000`,
          endDate: `${date}T23:59:59.999`,
          status: "CREATED",
        },
        fallbackMsg: "Não foi possível carregar os horários disponíveis.",
      },
    );

    return response.data;
  },
};
