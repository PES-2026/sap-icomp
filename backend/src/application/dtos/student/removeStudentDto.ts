import { validateStringField } from "@domain/utils/validationUtils";

export class RemoveStudentDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): RemoveStudentDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Student Id is required and must be a string`);
    }

    const id = validateStringField(value, "studentId");

    return new RemoveStudentDTO(id);
  }
}
