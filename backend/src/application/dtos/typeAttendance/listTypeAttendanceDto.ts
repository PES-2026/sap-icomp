import { ListTypeAttendanceFilters } from "@domain/repositories/filters/typeAttendanceFilters";
import { TypeAttendanceResult } from "@domain/repositories/results/typeAttendanceResult";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export interface ListTypeAttendanceResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: TypeAttendanceResult[];
}

export class ListTypeAttendanceDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListTypeAttendanceFilters,
  ) {}

  static create(query: unknown): ListTypeAttendanceDTO {
    const raw = query as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListTypeAttendanceFilters = {};

    if (raw.name) {
      filters.name = validateStringField(raw.name, "name");
    }

    validatePageLimitValues(page, limit);

    return new ListTypeAttendanceDTO(page, limit, filters);
  }
}
