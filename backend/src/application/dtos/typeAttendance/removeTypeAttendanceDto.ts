export class RemoveTypeAttendanceDTO {
  constructor(public readonly id: string) {}

  static create(id: unknown): RemoveTypeAttendanceDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("TypeAttendance Id is required and must be a string");
    }

    return new RemoveTypeAttendanceDTO(id.trim());
  }
}
