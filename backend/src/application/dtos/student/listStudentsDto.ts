import { validateDateField, validateNumberField, validateStringField } from "@domain/utils/validationUtils";
import { validatePageLimitValues } from "../shared/paginationValidationsDto";
import { ListStudentFilters } from "@domain/repositories/filters/studentFilters";
import { PaginatedResult } from "@domain/shared/pagination";

export interface StudentItemResponse {
  id: string;
  studentId: string;
  name: string;
  enrollmentId: string;
  course: string;
  attendanceType: string;
  attendanceDate: Date;
}

export type ListStudentResponse = PaginatedResult<StudentItemResponse>;

export class ListStudentDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListStudentFilters,
  ) {}

  static create(value: unknown): ListStudentDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListStudentDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListStudentFilters = {};

    if (raw.name) {
      filters.name = validateStringField(raw.name, "name");
    }
    if (raw.enrollment) {
      filters.enrollment = validateStringField(raw.enrollment, "enrollment");
    }
    if (raw.course) {
      filters.course = validateStringField(raw.course, "course");
    }
    if (raw.diganosis) {
      const diganosis: string = validateStringField(raw.attendanceType, "attendanceType");
      filters.diganosis = diganosis;
    }
    if (raw.lastAttendance) {
      filters.lastAttendance = validateDateField(raw.lastAttendance, "lastAttendance");
    }

    validatePageLimitValues(page, limit);

    return new ListStudentDTO(page, limit, filters);
  }
}
