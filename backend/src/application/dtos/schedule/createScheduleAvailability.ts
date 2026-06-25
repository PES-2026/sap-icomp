import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateDateField,
  validateExternalIdField,
  validateNumberField,
  validateStringField,
} from "@domain/utils/validationUtils";

export interface CreateScheduleAvailabilityResponseItem {
  id: string;
  status: string;
  date: Date;
  weekday: DaysOfWeekEnum;
  pedagogueId: string;
  start: string;
  end: string;
  attendanceTime: number;
}

export class CreateScheduleAvailabilityItemDTO {
  constructor(
    public readonly date: Date,
    public readonly weekday: DaysOfWeekEnum,
    public readonly pedagogueId: string,
    public readonly start: string,
    public readonly end: string,
    public readonly attendanceTime: number,
  ) {}

  static create(value: unknown): CreateScheduleAvailabilityItemDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateScheduleAvailabilityItemDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const date: Date = validateDateField(raw.date, "date");
    const weekday: string = validateStringField(raw.weekday, "weekday");
    const pedagogueId: string = validateExternalIdField(raw.pedagogueId, "pedagogueId");
    const start: string = validateStringField(raw.start, "start");
    const end: string = validateStringField(raw.end, "end");
    const attendanceTime: number = validateNumberField(raw.attendanceTime, "attendanceTime");

    const mappedWeekday: DaysOfWeekEnum = findValueInEnum(DaysOfWeekEnum, weekday);

    return new CreateScheduleAvailabilityItemDTO(date, mappedWeekday, pedagogueId, start, end, attendanceTime);
  }
}

export class CreateScheduleAvailabilityDTO {
  constructor(public readonly items: CreateScheduleAvailabilityItemDTO[]) {}

  static create(value: unknown): CreateScheduleAvailabilityDTO {
    if (!Array.isArray(value)) {
      throw new Error(`Invalid input to ${CreateScheduleAvailabilityDTO.name}, expected an array.`);
    }

    const items = value.map((item) => CreateScheduleAvailabilityItemDTO.create(item));

    return new CreateScheduleAvailabilityDTO(items);
  }
}
