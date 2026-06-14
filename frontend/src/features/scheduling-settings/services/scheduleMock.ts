import {
  SchedulePreviewPayload,
  SchedulePreviewResponse,
  ScheduleSavePayload,
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

  async save(_payload: ScheduleSavePayload): Promise<void> {
    void _payload;
    return Promise.resolve();
  },
};
