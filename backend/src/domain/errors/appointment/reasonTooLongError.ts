import { DomainError, ErrorCategory } from "../domainError";

export class ReasonTooLongError extends DomainError {
  constructor(length: number) {
    super(`Reason is too long, exceeding 350 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
