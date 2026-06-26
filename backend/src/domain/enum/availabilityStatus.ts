export enum AvailabilityStatusEnum {
  CREATED = "CREATED",
  PENDING = "PENDING",
  BOOKED = "BOOKED",
}

export const AvailabilityPreviewStatus = {
  ...AvailabilityStatusEnum,
  AVAILABLE: "AVAILABLE",
} as const;

export type AvailabilityPreviewStatus = (typeof AvailabilityPreviewStatus)[keyof typeof AvailabilityPreviewStatus];
