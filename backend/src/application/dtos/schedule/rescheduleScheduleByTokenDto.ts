import {
  validateExternalIdField,
  validateOptionalStringField,
  validateTokenField,
} from "@domain/utils/validationUtils";

export class RescheduleScheduleByTokenDTO {
  constructor(
    public readonly token: string,
    public readonly newSlotId: string,
    public readonly reason?: string,
  ) {}

  static create(token: string, body: unknown): RescheduleScheduleByTokenDTO {
    const validatedToken = validateTokenField(token, "token");

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${RescheduleScheduleByTokenDTO.name}`);
    }

    const raw = body as Record<string, unknown>;
    const newSlotId = validateExternalIdField(raw.newSlotId, "newSlotId");
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new RescheduleScheduleByTokenDTO(validatedToken, newSlotId, reason);
  }
}
