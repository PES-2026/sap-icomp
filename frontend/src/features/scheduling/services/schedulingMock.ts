import {
  SchedulingPreviewPayload,
  SchedulingPreviewResponse,
  SchedulingSavePayload,
} from "../types/scheduling";
import { generateSchedulingPreview } from "../utils/schedulingPreview";

export const scheduleMock = {
  async preview(
    payload: SchedulingPreviewPayload,
  ): Promise<SchedulingPreviewResponse> {
    return {
      slots: generateSchedulingPreview(payload),
    };
  },

  async save(_payload: SchedulingSavePayload): Promise<void> {
    void _payload;
    return Promise.resolve();
  },
};
