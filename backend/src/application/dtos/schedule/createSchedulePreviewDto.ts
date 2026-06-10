import { validateDateField, validateExternalIdField } from "@domain/utils/validationUtils";

export interface ScheduleSlotPreview {
  startDateTime: string;
  endDateTime: string;
}

export interface CreateSchedulePreviewRequest {
  pedagogueId: string;
  startTime: string;
  endTime: string;
  attendanceDuration: string;
  startDate: string;
  endDate: string;
}

export interface CreateSchedulePreviewResponse {
  slots: ScheduleSlotPreview[];
}

export class CreateSchedulePreviewDTO {
  constructor(
    public readonly pedagogueId: string,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly attendanceDuration: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}

  static create(value: unknown): CreateSchedulePreviewDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateSchedulePreviewDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const pedagogueId = validateExternalIdField(raw.pedagogueId, "pedagogueId");
    const startTime = this.validateTime(raw.startTime, "startTime");
    const endTime = this.validateTime(raw.endTime, "endTime");
    const attendanceDuration = this.validateTime(raw.attendanceDuration, "attendanceDuration");

    if (!raw.startDate) throw new Error("startDate is required.");
    if (!raw.endDate) throw new Error("endDate is required.");

    const startDate = validateDateField(raw.startDate, "startDate");
    const endDate = validateDateField(raw.endDate, "endDate");

    if (startDate > endDate) {
      throw new Error("endDate cannot be before startDate.");
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const durationMinutes = this.timeToMinutes(attendanceDuration);

    if (durationMinutes <= 0) {
      throw new Error("attendanceDuration must be greater than zero.");
    }

    if (startMinutes >= endMinutes) {
      throw new Error("endTime must be greater than startTime.");
    }

    return new CreateSchedulePreviewDTO(pedagogueId, startTime, endTime, attendanceDuration, startDate, endDate);
  }

  private static validateTime(value: unknown, fieldName: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${fieldName} is required and must be a string in HH:mm format.`);
    }
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(value)) {
      throw new Error(`${fieldName} must be in HH:mm format.`);
    }
    return value;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours! * 60 + minutes!;
  }
}
