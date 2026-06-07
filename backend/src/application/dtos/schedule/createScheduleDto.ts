import { validateDateField, validateExternalIdField } from "@domain/utils/validationUtils";

export interface ScheduleSlotInput {
  startDateTime: string;
  endDateTime: string;
}

export interface CreateScheduleRequest {
  pedagogueId: string;
  startTime: string;
  endTime: string;
  appointmentDuration: string;
  startDate: string;
  endDate: string;
  slots: ScheduleSlotInput[];
}

export interface CreateScheduleResponse {
  id: string;
}

export class CreateScheduleDTO {
  constructor(
    public readonly pedagogueId: string,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly appointmentDuration: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly slots: ScheduleSlotInput[],
  ) {}

  static create(value: unknown): CreateScheduleDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateScheduleDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const pedagogueId = validateExternalIdField(raw.pedagogueId, "pedagogueId");
    const startTime = this.validateTime(raw.startTime, "startTime");
    const endTime = this.validateTime(raw.endTime, "endTime");
    const appointmentDuration = this.validateTime(raw.appointmentDuration, "appointmentDuration");

    if (!raw.startDate) throw new Error("startDate is required.");
    if (!raw.endDate) throw new Error("endDate is required.");

    const startDate = validateDateField(raw.startDate, "startDate");
    const endDate = validateDateField(raw.endDate, "endDate");

    if (startDate > endDate) {
      throw new Error("endDate cannot be before startDate.");
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const durationMinutes = this.timeToMinutes(appointmentDuration);

    if (durationMinutes <= 0) {
      throw new Error("appointmentDuration must be greater than zero.");
    }

    if (startMinutes >= endMinutes) {
      throw new Error("endTime must be greater than startTime.");
    }

    if (!Array.isArray(raw.slots) || raw.slots.length === 0) {
      throw new Error("slots must be a non-empty array.");
    }

    const slots = (raw.slots as any[]).map((slot, index) => {
      if (!slot.startDateTime || !slot.endDateTime) {
        throw new Error(`Slot at index ${index} is missing startDateTime or endDateTime.`);
      }

      const start = new Date(slot.startDateTime);
      const end = new Date(slot.endDateTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error(`Slot at index ${index} has an invalid date format.`);
      }

      // Check if slot is within the schedule date range
      // Reset hours to compare only dates
      const slotStartDate = new Date(start);
      slotStartDate.setHours(0, 0, 0, 0);
      const slotEndDate = new Date(end);
      slotEndDate.setHours(0, 0, 0, 0);

      if (slotStartDate < startDate || slotStartDate > endDate) {
        throw new Error(`Slot at index ${index} is outside the schedule date range.`);
      }

      if (start >= end) {
        throw new Error(`Slot at index ${index} has endDateTime before or equal to startDateTime.`);
      }

      return {
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
      };
    });

    // Validar sobreposição e duplicidade interna
    const sortedSlots = [...slots].sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i]!;
      const next = sortedSlots[i + 1]!;
      const currentEnd = new Date(current.endDateTime).getTime();
      const nextStart = new Date(next.startDateTime).getTime();

      if (currentEnd > nextStart) {
        throw new Error(
          `Internal overlap detected between slots starting at ${current.startDateTime} and ${next.startDateTime}.`,
        );
      }

      if (current.startDateTime === next.startDateTime && current.endDateTime === next.endDateTime) {
        throw new Error(`Duplicate slot detected for ${current.startDateTime}.`);
      }
    }

    return new CreateScheduleDTO(
      pedagogueId,
      startTime,
      endTime,
      appointmentDuration,
      startDate,
      endDate,
      slots,
    );
  }

  private static validateTime(value: unknown, fieldName: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${fieldName} is required and must be a string in HH:mm format.`);
    }
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(value)) {
      throw new Error(`${fieldName} must be in HH:mm format (00:00 to 23:59).`);
    }
    return value;
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours! * 60 + minutes!;
  }
}
