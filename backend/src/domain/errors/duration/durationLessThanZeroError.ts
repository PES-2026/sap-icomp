import { DomainError, ErrorCategory } from "../domainError";

export class DurationLessThanZeroError extends DomainError {
  constructor(minutes: number) {
    super(`Duration must be a positive integer. Provided: ${minutes}`, ErrorCategory.VALIDATION);
  }
}
