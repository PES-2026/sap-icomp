import { validateExternalIdField, validateOptionalStringField } from "@domain/utils/validationUtils";

export class RescheduleScheduleDTO {
  constructor(
    public readonly scheduleId: string,
    public readonly newSlotId: string,
    public readonly reason?: string,
  ) {}

  static create(scheduleId: string, body: unknown): RescheduleScheduleDTO {
    const validatedScheduleId = validateExternalIdField(scheduleId, "scheduleId");

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${RescheduleScheduleDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const newSlotId = validateExternalIdField(raw.newSlotId, "newSlotId");
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new RescheduleScheduleDTO(validatedScheduleId, newSlotId, reason);
  }
}
