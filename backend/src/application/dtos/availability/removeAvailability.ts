import { validateExternalIdField } from "@domain/utils/validationUtils";

export class RemoveAvailabilityDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): RemoveAvailabilityDTO {
    if (typeof value === "string") {
      return new RemoveAvailabilityDTO(validateExternalIdField(value, "id"));
    }

    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${RemoveAvailabilityDTO.name}`);
    }

    const raw = value as Record<string, unknown>;
    const id = validateExternalIdField(raw.id, "id");

    return new RemoveAvailabilityDTO(id);
  }
}
