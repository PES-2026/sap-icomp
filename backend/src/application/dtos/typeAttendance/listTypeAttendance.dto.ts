import {
  validateDateField,
  validateNumberField,
  validateStringField,
} from "../../../domain/utils/validation.utils";
import { PaginatedRequest, PaginatedResult } from "../shared/paginationDto";
import { validatePageLimitValues } from "../shared/paginationValidations";
import { TypeAttendance } from "../../../domain/entities/typeAttendance";

export interface ListTypeAttendanceFilters {
  name?: string;
}

export interface TypeAttendanceItemResponse {
  externalId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ListTypeAttendanceRequest = PaginatedRequest<
  "filters",
  ListTypeAttendanceFilters
>;
export type ListTypeAttendanceResponse =
  PaginatedResult<TypeAttendanceItemResponse>;
export class ListTypeAttendanceDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListTypeAttendanceFilters,
  ) {}
  static create(value: unknown): ListTypeAttendanceDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListTypeAttendanceDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListTypeAttendanceFilters = {};
    if (raw.name) filters.name = validateStringField(raw.name, "name");
    validatePageLimitValues(page, limit);

    return new ListTypeAttendanceDTO(page, limit, filters);
  }
}
