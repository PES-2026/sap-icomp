import { DomainError, ErrorCategory } from "../domainError";

export class NonExistingDateError extends DomainError {
  constructor(day: number, month: number, year: number) {
    super(`Non-existent date: ${month}/${day}/${year}`, ErrorCategory.VALIDATION);
  }
}
