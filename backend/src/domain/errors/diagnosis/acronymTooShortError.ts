import { DomainError, ErrorCategory } from "../domainError";

export class AcronymTooShortError extends DomainError {
  constructor(length: number) {
    super(`Acronym must be longer than 2 characters. Provided length: ${length}.`, ErrorCategory.VALIDATION);
  }
}
