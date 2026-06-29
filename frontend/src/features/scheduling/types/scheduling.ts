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
  breakTime: string;
}

export interface SchedulingPreviewPayload {
  pedagogueId: string;
  attendanceTime: number;
  breakTime: number;
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
}

export interface SchedulingSlot {
  id?: string;
  pedagogueId?: string;
  startDateTime: string;
  endDateTime: string;
  status: SlotStatus | "AVAILABLE";
  date?: Date;
  weekday?: SlotWeekDay | string;
  attendanceTime: number;
  start: number;
  end: number;
}

export interface SchedulingDayPreview {
  date: string;
  weekday: string;
  slots: SchedulingSlot[];
}

export type SchedulingPreviewResponse = SchedulingDayPreview[];

export interface CreateAvailabilitySlot {
  date: string;
  weekday: string;
  pedagogueId: string;
  start: string;
  end: string;
  attendanceTime: number;
}

export type SchedulingSavePayload = CreateAvailabilitySlot[];

export interface RequestSchedulePayload {
  name: string;
  email: string;
  enrollment: string;
  pedagogueId: string;
  courseId: string;
  slotId: string;
  durationMinutes: number;
  reason?: string;
}
