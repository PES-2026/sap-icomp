export class RemoveAttendanceTypeDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): RemoveAttendanceTypeDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("TypeAttendance Id is required and must be a string");
    }

    return new RemoveAttendanceTypeDTO(id.trim());
  }
}
