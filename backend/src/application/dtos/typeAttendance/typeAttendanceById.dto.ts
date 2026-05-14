import { validateStringField } from "../../../domain/utils/validation.utils";
export interface TypeAttendanceByIdResponse {
  externalId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TypeAttendanceByIdDTO {
  constructor(public readonly id: string) {}

  static create(value: unknown): TypeAttendanceByIdDTO {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Type Attendance Id is required and must be a string");
    }

    const id: string = validateStringField(value, "id");

    return new TypeAttendanceByIdDTO(id);
  }
}
