import { AttendanceType } from "../../../domain/enums/attendance/attendanceType.enum";
import { findValueInEnum } from "../../../domain/utils/enum.utils";
import {
  validateDateField,
  validateStringField,
} from "../../../domain/utils/validation.utils";

export interface CreateAttendanceResponse {
  id: string;
  studentId: string;
  type: string;
  date: Date;
  demand: string;
  generalObservations?: string;
}

export class CreateAttendanceDTO {
  constructor(
    public readonly studentId: string,
    public readonly date: Date,
    public readonly type: AttendanceType,
    public readonly demand: string,
    public readonly generalObservations?: string,
  ) {}

  static create(value: unknown): CreateAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${CreateAttendanceDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const studentId = validateStringField(raw.studentId, "studentId");
    const date = validateDateField(raw.date, "date");
    const type = validateStringField(raw.type, "type");
    const demand = validateStringField(raw.demand, "demand");
    let generalObservations = undefined;
    if (raw.generalObservations) {
      generalObservations = validateStringField(
        raw.generalObservations,
        "generalObservations",
      );
    }

    return new CreateAttendanceDTO(
      studentId,
      date,
      findValueInEnum(AttendanceType, type),
      demand,
      generalObservations ? generalObservations : undefined,
    );
  }
}
