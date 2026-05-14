import { ListCourseFilters } from "@domain/repositories/filters/courseFilters";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

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
    if (raw.name !== undefined) {
      filters.name = validateStringField(raw.name, "name");
    }
    if (raw.acronym !== undefined) {
      filters.acronym = validateStringField(raw.acronym, "acronym");
    }

    validatePageLimitValues(page, limit);

    return new ListCourseDTO(page, limit, filters);
  }
}
