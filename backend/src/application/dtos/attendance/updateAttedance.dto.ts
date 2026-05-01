import { AttendanceType } from "../../../domain/enums/attendance/attendanceType.enum";
import { findValueInEnum } from "../../../domain/utils/enum.utils";
import {
  validateDateField,
  validateStringField,
} from "../../../domain/utils/validation.utils";

export interface UpdateAttendanceResponse {
  id: string;
  studentId: string;
  type?: string;
  date?: Date;
  demand?: string;
  generalObservations?: string;
}

export class UpdateAttendanceDTO {
  constructor(
    public readonly id: string,
    public readonly type?: AttendanceType,
    public readonly date?: Date,
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

    let type = null;
    if (raw.type) {
      type = validateStringField(raw.type, "attendanceType");
    }
    let date = null;
    if (raw.date) {
      date = validateDateField(raw.date, "attendanceDate");
    }
    let demand = null;
    if (raw.demand) {
      demand = validateStringField(raw.demand, "attendanceDemand");
    }
    let generalObservations = null;
    if (raw.generalObservations) {
      generalObservations = validateStringField(
        raw.generalObservations,
        "attendanceGeneralObservations",
      );
    }

    return new UpdateAttendanceDTO(
      id.trim(),
      type ? findValueInEnum(AttendanceType, type) : undefined,
      date ?? undefined,
      demand ?? "",
      generalObservations ?? "",
    );
  }
}
