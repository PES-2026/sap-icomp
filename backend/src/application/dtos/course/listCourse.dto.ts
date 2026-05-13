import {
  validateNumberField,
  validateStringField,
  validateDateField,
} from "../../../domain/utils/validation.utils";
import { PaginatedRequest, PaginatedResult } from "../shared/paginationDto";
import { validatePageLimitValues } from "../shared/paginationValidations";

export interface ListCourseFilters {
  nameOrAcronym?: string;
  startDate?: Date;
  endDate?: Date;
}
export interface CourseItemResponse {
  externalId: string;
  name: string;
  acronym: string;
  coordinatorId?: string | undefined;
  coordinatorName?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
export type ListCourseRequest = PaginatedRequest<"filters", ListCourseFilters>;
export type ListCourseResponse = PaginatedResult<CourseItemResponse>;
export class ListCourseDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListCourseFilters,
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
  static create(value: unknown): ListCourseDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListCourseDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListCourseFilters = {};
    if (raw.nameOrAcronym !== undefined) {
      filters.nameOrAcronym = validateStringField(
        raw.nameOrAcronym,
        "nameOrAcronym",
      );
    }
    if (raw.startDate) {
      filters.startDate = validateDateField(raw.startDate, "startDate");
    }
    if (raw.endDate) {
      filters.endDate = validateDateField(raw.endDate, "endDate");
    }

    validatePageLimitValues(page, limit);
    ListCourseDTO.validateStartEndDate(filters.startDate, filters.endDate);

    return new ListCourseDTO(page, limit, filters);
  }
}
