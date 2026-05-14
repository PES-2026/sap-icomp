import { ListDiagnosisFilters } from "@domain/repositories/filters/diagnosisFilters";
import { validateNumberField, validateStringField } from "@domain/utils/validationUtils";

import { validatePageLimitValues } from "../shared/paginationValidationsDto";

export class ListDiagnosisDTO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListDiagnosisFilters,
  ) {}

  static create(value: unknown): ListDiagnosisDTO {
    if (typeof value !== "object" || value === null) {
      throw new Error(`Invalid input to ${ListDiagnosisDTO.name}`);
    }

    const raw = value as Record<string, unknown>;

    const page = validateNumberField(raw.page, "page");
    const limit = validateNumberField(raw.limit, "limit");

    const filters: ListDiagnosisFilters = {};

    if (raw.name) {
      filters.name = validateStringField(raw.name, "name");
    }
    if (raw.acronym) {
      filters.acronym = validateStringField(raw.acronym, "acronym");
    }
    if (raw.cid) {
      filters.cid = validateStringField(raw.cid, "cid");
    }

    validatePageLimitValues(page, limit);

    return new ListDiagnosisDTO(page, limit, filters);
  }
}
