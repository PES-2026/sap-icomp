import { UserFilters } from "@domain/repositories/filters/userFilters";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export class ListUsersDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: UserFilters,
  ) {}

  static create(value: unknown): ListUsersDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListUsersDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: UserFilters = {};

    if (raw.name) {
      filters.name = validateStringField(raw.name, "name");
    }
    if (raw.userStatus) {
      filters.userStatus = validateStringField(raw.userStatus, "userStatus");
    }

    validatePageLimitValues(page, limit);

    return new ListUsersDTO(page, limit, filters);
  }
}
