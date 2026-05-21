import { DomainError, ErrorCategory } from "../domainError";

export class InvalidDateFormat extends DomainError {
  constructor(value: string) {
    super(
      `Invalid date format, it must be in the format "YYYY-MM-DD", the actual values are: ${value}`,
      ErrorCategory.VALIDATION,
    );
  }
}
