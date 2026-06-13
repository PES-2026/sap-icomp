export enum ScheduleSlotStatusEnum {
  CREATED = "CREATED",
  PENDING = "PENDING",
  BOOKED = "BOOKED",
  CANCELLED = "CANCELLED",
}

export const ScheduleSlotPreviewStatus = {
  ...ScheduleSlotStatusEnum,
  AVAILABLE: "AVAILABLE",
} as const;

export type ScheduleSlotPreviewStatus = (typeof ScheduleSlotPreviewStatus)[keyof typeof ScheduleSlotPreviewStatus];
