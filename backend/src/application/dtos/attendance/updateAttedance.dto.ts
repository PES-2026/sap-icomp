import { AttendanceType } from "../../../domain/enums/attendance/attendanceType.enum";
import { findValueInEnum } from "../../../domain/utils/enum.utils";
import {
  validateDateField,
  validateStringField,
} from "../../../domain/utils/validation.utils";

export class UpdateAttendanceDTO {
  constructor(
    public readonly id: string,
    public readonly type: AttendanceType,
    public readonly date: Date,
    public readonly demand: string,
    public readonly generalObservations: string,
  ) {}

  static create(id: unknown, body: unknown): UpdateAttendanceDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Id is required and must be a string");
    }

    if (typeof body !== "object" || body === null) {
      throw new Error(`Invalid input to ${UpdateAttendanceDTO.name}`);
    }

    const raw = body as Record<string, unknown>;

    const type = validateStringField(raw.type, "attendanceType");
    const date = validateDateField(raw.date, "attendanceDate");
    const demand = validateStringField(raw.demand, "attendanceDemand");
    const generalObservations = validateStringField(
      raw.generalObservations,
      "attendanceGeneralObservations",
    );

    return new UpdateAttendanceDTO(
      id.trim(),
      findValueInEnum(AttendanceType, type),
      date,
      demand,
      generalObservations,
    );
  }
}
