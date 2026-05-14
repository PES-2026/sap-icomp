import { DomainError, ErrorCategory } from "../domainError";

export class AcronymTooLongError extends DomainError {
  constructor(length: number) {
    super(`Acronym is too long, exceeding 15 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
