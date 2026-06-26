import { AvailabilityPreviewStatus } from "@domain/enum/availabilityStatus";
import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { validateDateField, validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validateStartEndDate } from "../shared/datesValidationsDto";

export interface Availability {
  id?: string;
  start: number;
  end: number;
  attendanceTime: number;
  status: AvailabilityPreviewStatus;
}

export interface PreviewAvailabilityItemResponse {
  date: Date;
  weekday: DaysOfWeekEnum;
  slots: Array<Availability>;
}

export class PreviewAvailabilityDTO {
  constructor(
    public readonly pedagogueId: string,
    public readonly attendanceTime: number,
    public readonly breakTime: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly startHour: number,
    public readonly endHour: number,
  ) {}

  static create(value: unknown): PreviewAvailabilityDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${PreviewAvailabilityDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const pedagogueId: string = validateStringField(raw.pedagogueId, "pedagogueId");
    const attendanceTime: number = validateNumberField(raw.attendanceTime, "attendanceTime");
    const breakTime: number = validateNumberField(raw.breakTime, "breakTime");
    const startDate: Date = validateDateField(raw.startDate, "startDate");
    const endDate: Date = validateDateField(raw.endDate, "endDate");
    const startHour: number = validateNumberField(raw.startHour, "startHour");
    const endHour: number = validateNumberField(raw.endHour, "endHour");

    validateStartEndDate(startDate, endDate);

    return new PreviewAvailabilityDTO(pedagogueId, attendanceTime, breakTime, startDate, endDate, startHour, endHour);
  }
}
