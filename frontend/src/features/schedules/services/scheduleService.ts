import api from "@/services/api";
import {
  SchedulePreviewPayload,
  SchedulePreviewResponse,
  ScheduleSavePayload,
} from "../types/schedule";

export const scheduleService = {
  async preview(
    payload: SchedulePreviewPayload,
  ): Promise<SchedulePreviewResponse> {
    const response = await api.post<SchedulePreviewResponse>(
      "/schedule/preview",
      payload,
      {
        fallbackMsg: "Não foi possível gerar a prévia da agenda.",
      },
    );

    return response.data;
  },

  async save(payload: ScheduleSavePayload): Promise<void> {
    await api.post("/schedule", payload, {
      fallbackMsg: "Não foi possível salvar a agenda.",
    });
  },
};
