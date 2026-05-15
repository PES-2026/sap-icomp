export class TypeAttendanceByIdDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): TypeAttendanceByIdDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("TypeAttendance Id is required and must be a string");
    }

    return new TypeAttendanceByIdDTO(id.trim());
  }
}
