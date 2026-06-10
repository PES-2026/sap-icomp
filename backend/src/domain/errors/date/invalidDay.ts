import { DomainError, ErrorCategory } from "../domainError";

export class InvalidDayError extends DomainError {
  constructor(day: number) {
    super(`Invalid day value: '${day}', it must be between 1 and 31`, ErrorCategory.VALIDATION);
  }
}
