import { DomainError, ErrorCategory } from "../domainError";

export class InvalidYearError extends DomainError {
  constructor(year: number) {
    super(`Invalid year value: '${year}', it must be between 1900 and 2100`, ErrorCategory.VALIDATION);
  }
}
