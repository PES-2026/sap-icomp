import { TimeSlot } from "@/features/appointments/types/appointment";
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
      "/schedule/preview-availability",
      payload,
      {
        fallbackMsg: "Não foi possível gerar a prévia da agenda.",
      },
    );

    return response.data;
  },

  async save(payload: SchedulingSavePayload): Promise<void> {
    await api.post("/schedule/create-availability", payload, {
      fallbackMsg: "Não foi possível salvar a agenda.",
    });
  },

  async removeSlots(ids: string[]): Promise<void> {
    await api.put("/schedule/availability/remove-many", ids, {
      fallbackMsg: "Não foi possível remover os horários.",
    });
  },

  async request(payload: RequestSchedulePayload): Promise<void> {
    await api.post("/schedule/request", payload, {
      fallbackMsg: "Não foi possível solicitar o atendimento.",
    });
  },

  async getAvailableSlots(
    date: string,
    pedagogueId: string,
  ): Promise<TimeSlot[]> {
    const response = await api.get<any[]>("/schedules/slots", {
      params: { date, pedagogueId },
      fallbackMsg: "Não foi possível carregar os horários disponíveis.",
    });

    return response.data.map((slot: any) => {
      const start = new Date(slot.startDateTime);
      const end = new Date(slot.endDateTime);

      return {
        id: slot.id,
        time: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
        isAvailable: slot.status === "CREATED",
        attendanceTime: Math.round((end.getTime() - start.getTime()) / 60000),
      };
    });
  },

  async getAvailability(
    pedagogueId: string,
    date: string,
    page: number = 1,
    limit: number = 100,
  ): Promise<TimeSlot[]> {
    const response = await api.get<{ items: any[] }>(
      `/schedule/availability/${pedagogueId}`,
      {
        params: { page, limit, date },
        fallbackMsg: "Não foi possível carregar os horários disponíveis.",
      },
    );

    return response.data.items.map((slot: any) => {
      const start = new Date(slot.startDateTime);
      const end = new Date(slot.endDateTime);

      return {
        id: slot.id,
        time: `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
        isAvailable: slot.status === "CREATED",
        attendanceTime:
          slot.attendanceTime ||
          Math.round((end.getTime() - start.getTime()) / 60000),
      };
    });
  },
};
