import { DomainError, ErrorCategory } from "../domainError";

export class ReasonTooShortError extends DomainError {
  constructor(length: number) {
    super(`Reason is too short, minimum 15 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
