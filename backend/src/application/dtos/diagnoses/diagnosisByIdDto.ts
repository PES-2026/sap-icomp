import { validateStringField } from "@domain/utils/validationUtils";

export class DiagnosisByIdDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): DiagnosisByIdDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Diagnosis Id is required and must be a string");
    }

    const id: string = validateStringField(value, "id");

    return new DiagnosisByIdDTO(id);
  }
}
