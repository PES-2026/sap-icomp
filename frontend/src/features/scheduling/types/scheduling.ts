export type SlotStatus = "CREATED" | "BOOKED" | "PENDING";

export type SlotWeekDay =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface SchedulingFormData {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: string;
}

export interface SchedulingPreviewPayload {
  pedagogueId: string;
  startTime: string;
  endTime: string;
  attendanceDuration: string;
  startDate: string;
  endDate: string;
}

export interface SchedulingSlot {
  id: string;
  pedagogueId: string;
  startDateTime: string;
  endDateTime: string;
  status: SlotStatus;
  date: Date;
  weekday: SlotWeekDay;
  attendanceTime: number;
}

export interface SchedulingPreviewResponse {
  slots: SchedulingSlot[];
}

export interface SchedulingSavePayload extends SchedulingPreviewPayload {
  slots: SchedulingSlot[];
}
