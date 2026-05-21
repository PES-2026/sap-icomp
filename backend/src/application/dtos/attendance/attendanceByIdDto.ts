import { validateStringField } from "@domain/utils/validationUtils";

export class AttendanceByIdDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): AttendanceByIdDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Attendance Id is required and must be a string");
    }

    const id: string = validateStringField(value, "id");

    return new AttendanceByIdDTO(id);
  }
}
