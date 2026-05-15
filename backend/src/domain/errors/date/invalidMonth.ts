import { DomainError, ErrorCategory } from "../domainError";

export class InvalidMonthError extends DomainError {
  constructor(month: number) {
    super(`Invalid month value: '${month}', it must be between 1 and 12`, ErrorCategory.VALIDATION);
  }
}
