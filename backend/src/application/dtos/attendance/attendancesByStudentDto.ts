import { PaginatedResult, PaginationParams } from "@domain/shared/pagination";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

import { AttendanceItemResponse } from "./listAttendanceDto";

export type AttendancesByStudentResponse = PaginatedResult<AttendanceItemResponse>;
export type AttendancesByStudentRequest = PaginationParams<"studentId", string>;

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
