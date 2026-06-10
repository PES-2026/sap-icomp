import { UserStatusEnum } from "@domain/enum/userStatus";
import { UserFilters } from "@domain/repositories/filters/userFilters";
import { findValueInEnum } from "@domain/utils/enumUtils";
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
      const userStatus = validateStringField(raw.userStatus, "userStatus");
      filters.userStatus = findValueInEnum(UserStatusEnum, userStatus);
    }

    validatePageLimitValues(page, limit);

    return new ListUsersDTO(page, limit, filters);
  }
}
