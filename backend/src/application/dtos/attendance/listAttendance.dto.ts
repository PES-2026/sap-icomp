import { AttendanceType } from "../../../domain/enums/attendance/attendanceType.enum";
import { findValueInEnum } from "../../../domain/utils/enum.utils";
import {
  validateDateField,
  validateNumberField,
  validateStringField,
} from "../../../domain/utils/validation.utils";
import { PaginatedRequest, PaginatedResult } from "../shared/paginationDto";
import { validatePageLimitValues } from "../shared/paginationValidations";

export interface ListAttendanceFilters {
  studentName?: string;
  studentEnrollment?: string;
  studentCourse?: string;
  attendanceType?: AttendanceType;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceItemResponse {
  studentId: string;
  studentName: string;
  enrollmentId: string;
  course: string;
  attendanceType: string;
  attendanceDate: Date;
}

export type ListAttendanceRequest = PaginatedRequest<
  "filters",
  ListAttendanceFilters
>;
export type ListAttendanceResponse = PaginatedResult<AttendanceItemResponse>;

export class ListAttendanceDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListAttendanceFilters,
  ) {}

  private static validateStartEndDate(startDate?: Date, endDate?: Date) {
    if (!startDate && !endDate) return;

    if (!startDate || !endDate) {
      throw new Error(
        `You must insert a period range with start and end date. The actual values are: start: '${startDate}', end: '${endDate}'`,
      );
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new Error("Start Date must be before End Date!");
    }
  }

  static create(value: unknown): ListAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListAttendanceDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListAttendanceFilters = {};

    if (raw.studentName)
      filters.studentName = validateStringField(raw.studentName, "studentName");
    if (raw.studentEnrollment)
      filters.studentEnrollment = validateStringField(
        raw.studentEnrollment,
        "studentEnrollment",
      );
    if (raw.studentCourse)
      filters.studentCourse = validateStringField(
        raw.studentCourse,
        "studentCourse",
      );
    if (raw.attendanceType) {
      const attendanceType: string = validateStringField(
        raw.attendanceType,
        "attendanceType",
      );
      const attendanceValueEnum: AttendanceType = findValueInEnum(
        AttendanceType,
        attendanceType,
      );
      filters.attendanceType = attendanceValueEnum;
    }
    if (raw.startDate)
      filters.startDate = validateDateField(raw.startDate, "startDate");
    if (raw.endDate)
      filters.endDate = validateDateField(raw.endDate, "endDate");

    validatePageLimitValues(page, limit);
    ListAttendanceDTO.validateStartEndDate(filters.startDate, filters.endDate);

    return new ListAttendanceDTO(page, limit, filters);
  }
}
