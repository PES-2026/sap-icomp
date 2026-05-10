import { DomainError, ErrorCategory } from "../domainError";

export class DateObjectError extends DomainError {
  constructor(value: Date) {
    super(`Invalid Date object, the actual value is: ${value}`, ErrorCategory.VALIDATION);
  }
}
