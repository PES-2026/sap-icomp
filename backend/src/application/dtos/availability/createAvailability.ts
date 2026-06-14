import { DaysOfWeekEnum } from "@domain/enum/daysOfWeek";
import { findValueInEnum } from "@domain/utils/enumUtils";
import {
  validateDateField,
  validateExternalIdField,
  validateNumberField,
  validateStringField,
} from "@domain/utils/validationUtils";

export class CreateAvailabilityItemDTO {
  constructor(
    public readonly date: Date,
    public readonly weekday: DaysOfWeekEnum,
    public readonly pedagogueId: string,
    public readonly start: string,
    public readonly end: string,
    public readonly attendanceTime: number,
  ) {}

  static create(value: unknown): CreateAvailabilityItemDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid item in CreateAvailability request`);
    }

    const raw = value as Record<string, unknown>;

    const date: Date = validateDateField(raw.date, "date");
    const weekday: string = validateStringField(raw.weekday, "weekday");
    const pedagogueId: string = validateExternalIdField(raw.pedagogueId, "pedagogueId");
    const start: string = validateStringField(raw.start, "start");
    const end: string = validateStringField(raw.end, "end");
    const attendanceTime: number = validateNumberField(raw.attendanceTime, "attendanceTime");

    const mappedWeekday: DaysOfWeekEnum = findValueInEnum(DaysOfWeekEnum, weekday);

    return new CreateAvailabilityItemDTO(date, mappedWeekday, pedagogueId, start, end, attendanceTime);
  }
}

export class CreateAvailabilityDTO {
  constructor(public readonly items: CreateAvailabilityItemDTO[]) {}

  static create(value: unknown): CreateAvailabilityDTO {
    if (!Array.isArray(value)) {
      throw new Error(`Invalid input to ${CreateAvailabilityDTO.name}, expected an array.`);
    }

    const items = value.map((item) => CreateAvailabilityItemDTO.create(item));

    return new CreateAvailabilityDTO(items);
  }
}
