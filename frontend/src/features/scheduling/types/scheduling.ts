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
  startDate: Date;
  endDate: Date;
  startHour: Date;
  endHour: Date;
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
  start: Date;
  end: Date;
}

export interface SchedulingDayPreview {
  date: Date;
  weekday: string;
  slots: SchedulingSlot[];
}

export type SchedulingPreviewResponse = SchedulingDayPreview[];

export interface CreateAvailabilitySlot {
  date: Date;
  weekday: string;
  pedagogueId: string;
  start: Date;
  end: Date;
  attendanceTime: number;
}

export type SchedulingSavePayload = CreateAvailabilitySlot[];

export interface RequestSchedulePayload {
  name: string;
  email: string;
  enrollment: string;
  pedagogueId: string;
  courseId: string;
  availabilitySlotId: string;
  durationMinutes: number;
  reason?: string;
}
