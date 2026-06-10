import { DomainError, ErrorCategory } from "../domainError";

export class TimeMustBeANumberError extends DomainError {
  constructor() {
    super(`Time must be a number`, ErrorCategory.VALIDATION);
  }
}
