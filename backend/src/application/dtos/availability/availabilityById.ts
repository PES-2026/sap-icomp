import { validateStringField } from "@domain/utils/validationUtils";

export class AvailabilityByIdDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): AvailabilityByIdDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Availability Id is required and must be a string");
    }

    const id: string = validateStringField(value, "id");

    return new AvailabilityByIdDTO(id);
  }
}
