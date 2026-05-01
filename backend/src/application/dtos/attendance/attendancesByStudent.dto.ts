import {
  validateNumberField,
  validateStringField,
} from "../../../domain/utils/validation.utils";
import { PaginatedRequest, PaginatedResult } from "../shared/paginationDto";
import { validatePageLimitValues } from "../shared/paginationValidations";
import { AttendanceItemResponse } from "./listAttendance.dto";

export type AttendancesByStudentResponse =
  PaginatedResult<AttendanceItemResponse>;
export type AttendancesByStudentRequest = PaginatedRequest<"studentId", string>;

export class AttendancesByStudentDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly studentId: string,
  ) {}

  static create(id: unknown, params: unknown): AttendancesByStudentDTO {
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Attendance Id is required and must be a string");
    }

    const raw = params as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");
    const studentId = validateStringField(id, "studentId");

    validatePageLimitValues(page, limit);

    return new AttendancesByStudentDTO(page, limit, studentId);
  }
}
