import { validateExternalIdField } from "@domain/utils/validationUtils";

export class RemoveScheduleSlotDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): RemoveScheduleSlotDTO {
    if (typeof value === "string") {
      return new RemoveScheduleSlotDTO(validateExternalIdField(value, "id"));
    }

    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${RemoveScheduleSlotDTO.name}`);
    }

    const raw = value as Record<string, unknown>;
    const id = validateExternalIdField(raw.id, "id");

    return new RemoveScheduleSlotDTO(id);
  }
}
