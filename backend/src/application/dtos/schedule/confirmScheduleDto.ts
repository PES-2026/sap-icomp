import { validateExternalIdField } from "@domain/utils/validationUtils";

export class ConfirmScheduleDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): ConfirmScheduleDTO {
    if (typeof value === "string") {
      return new ConfirmScheduleDTO(validateExternalIdField(value, "id"));
    }

    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ConfirmScheduleDTO.name}`);
    }

    const raw = value as Record<string, unknown>;
    const id = validateExternalIdField(raw.id, "id");

    return new ConfirmScheduleDTO(id);
  }
}
