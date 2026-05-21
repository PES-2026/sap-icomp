export class AttendanceTypeByIdDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): AttendanceTypeByIdDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Type Id is required and must be a string");
    }

    return new AttendanceTypeByIdDTO(id.trim());
  }
}
