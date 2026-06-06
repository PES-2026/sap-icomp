import {
  SchedulePreviewPayload,
  SchedulePreviewResponse,
} from "../types/schedule";
import { generateSchedulePreview } from "../utils/schedulePreview";

export const scheduleMock = {
  async preview(
    payload: SchedulePreviewPayload,
  ): Promise<SchedulePreviewResponse> {
    return {
      slots: generateSchedulePreview(payload),
    };
  },
};

