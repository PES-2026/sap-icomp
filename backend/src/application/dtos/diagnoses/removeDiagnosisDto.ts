import { validateStringField } from "@domain/utils/validationUtils";

export class RemoveDiagnosisDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): RemoveDiagnosisDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Diagnosis Id is required and must be a string`);
    }

    const id = validateStringField(value, "diagnosisId");

    return new RemoveDiagnosisDTO(id);
  }
}
