import { validateDateField, validateStringField } from "@domain/utils/validationUtils";

import { CreateAttendanceResponse } from "./createAttendanceDto";

export type UpdateAttendanceResponse = CreateAttendanceResponse;

export class UpdateAttendanceDTO {
  constructor(
    public readonly id: string,
    public readonly studentId?: string,
    public readonly date?: Date,
    public readonly typeId?: string,
    public readonly demand?: string,
    public readonly generalObservations?: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateAttendanceDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateAttendanceDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    let studentId = undefined;
    if (raw.studentId) {
      studentId = validateStringField(raw.studentId, "studentId");
    }

    let date = undefined;
    if (raw.date) {
      date = validateDateField(raw.date, "date");
    }

    let typeId = undefined;
    if (raw.typeId) {
      typeId = validateStringField(raw.typeId, "typeId");
    }

    let demand = undefined;
    if (raw.demand) {
      demand = validateStringField(raw.demand, "demand");
    }

    let generalObservations = undefined;
    if (raw.generalObservations) {
      generalObservations = validateStringField(raw.generalObservations, "generalObservations");
    }

    return new UpdateAttendanceDTO(id.trim(), studentId, date, typeId, demand, generalObservations);
  }
}
