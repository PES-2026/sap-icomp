export interface ScheduleFormData {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: string;
}

export interface SchedulePreviewPayload {
  pedagogueId: string;
  startTime: string;
  endTime: string;
  attendanceDuration: string;
  startDate: string;
  endDate: string;
}

export interface ScheduleSlot {
  startDateTime: string;
  endDateTime: string;
}

export interface SchedulePreviewResponse {
  slots: ScheduleSlot[];
}

export interface ScheduleSavePayload extends SchedulePreviewPayload {
  slots: ScheduleSlot[];
}
