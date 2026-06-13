import api from "@/services/api";
import {
  SchedulingPreviewPayload,
  SchedulingPreviewResponse,
  SchedulingSavePayload,
} from "../types/scheduling";

export const scheduleService = {
  async preview(
    payload: SchedulingPreviewPayload,
  ): Promise<SchedulingPreviewResponse> {
    const response = await api.post<SchedulingPreviewResponse>(
      "/scheduling/preview",
      payload,
      {
        fallbackMsg: "Não foi possível gerar a prévia da agenda.",
      },
    );

    return response.data;
  },

  async save(payload: SchedulingSavePayload): Promise<void> {
    await api.post("/scheduling", payload, {
      fallbackMsg: "Não foi possível salvar a agenda.",
    });
  },
};
