import { validateStringField } from "../../../domain/utils/validation.utils";

export class RemoveAttendanceDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): RemoveAttendanceDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Attendance Id is required and must be a string`);
    }

    const id = validateStringField(value, "attendanceId");

    return new RemoveAttendanceDTO(id);
  }
}
