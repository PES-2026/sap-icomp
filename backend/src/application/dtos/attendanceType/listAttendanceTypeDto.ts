import { ListAttendanceTypeFilters } from "@domain/repositories/filters/attendanceTypeFilters";
import { AttendanceTypeResult } from "@domain/repositories/results/attendanceTypeResult";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export interface ListAttendanceTypeResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: AttendanceTypeResult[];
}

export class ListAttendanceTypeDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListAttendanceTypeFilters,
  ) {}

  static create(query: unknown): ListAttendanceTypeDTO {
    const raw = query as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListAttendanceTypeFilters = {};

    if (raw.name) {
      filters.name = validateStringField(raw.name, "name");
    }

    validatePageLimitValues(page, limit);

    return new ListAttendanceTypeDTO(page, limit, filters);
  }
}
