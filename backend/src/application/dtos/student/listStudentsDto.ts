import { ListStudentFilters } from "@domain/repositories/filters/studentFilters";
import { PaginatedResult } from "@domain/shared/pagination";
import { validateDateField, validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export interface StudentItemResponse {
  id: string;
  name: string;
  dtBirth: Date;
  enrollmentId: string;
  phoneNumber: string;
  course: string;
  lastAttendance: Date | null;
  email: string;
  diagnosis: string;
  potential: string;
  difficulties: string;
  createdAt: Date;
  updatedAt: Date;
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
    if (raw.dtBirth) {
      filters.dtBirth = validateDateField(raw.dtBirth, "dtBirth");
    }
    if (raw.enrollment) {
      filters.enrollment = validateStringField(raw.enrollment, "enrollment");
    }
    if (raw.course) {
      filters.course = validateStringField(raw.course, "course");
    }
    if (raw.lastAttendance) {
      filters.lastAttendance = validateDateField(raw.lastAttendance, "lastAttendance");
    }
    if (raw.email) {
      filters.email = validateStringField(raw.email, "email");
    }
    if (raw.diagnosis) {
      filters.diagnosis = validateStringField(raw.diagnosis, "diagnosis");
    }
    if (raw.potential) {
      filters.potential = validateStringField(raw.potential, "potential");
    }
    if (raw.difficulties) {
      filters.difficulties = validateStringField(raw.difficulties, "difficulties");
    }

    validatePageLimitValues(page, limit);

    return new ListStudentDTO(page, limit, filters);
  }
}
