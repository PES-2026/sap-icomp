import { validateExternalIdField, validateOptionalStringField } from "@domain/utils/validationUtils";

export class CancelScheduleDTO {
  constructor(
    public readonly id: string,
    public readonly reason?: string,
  ) {}

  static create(id: string, body: unknown): CancelScheduleDTO {
    const validatedId = validateExternalIdField(id, "id");

    if (typeof body !== "object" || body === null) {
      return new CancelScheduleDTO(validatedId);
    }

    const raw = body as Record<string, unknown>;
    const reason = validateOptionalStringField(raw.reason, "reason");

    return new CancelScheduleDTO(validatedId, reason);
  }
}
